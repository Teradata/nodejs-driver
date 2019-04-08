import 'mocha';
import { expect } from 'chai';
import { TeradataConnection, ITDConnParams } from '../../src/teradata-connection';
import { TeradataCursor } from '../../src/teradata-cursor';
import { TeradataLogging } from '../../src/teradata-logging';
import { connParams } from '../configurations';
import { OperationalError } from '../../src/teradata-exceptions';

const logger: TeradataLogging = new TeradataLogging();

describe('\n\n\nTest AutoCommit Off DDL', () => {
  const tests: any[] = [{mode: 'ANSI'},
                        {mode: 'TERA'} ];
  tests.forEach((test: any) => {
    let teradataConnection1: TeradataConnection;
    let cursor1: TeradataCursor;
    const connParamsCopy: ITDConnParams = Object.assign({}, connParams);
    connParamsCopy.tmode = test.mode;

    it('Test \'' + test.mode + '\' mode: test CreateTableCommit', (done: any) => {
      let succeeded: boolean = false;
      const sTableName: string = 'testCreateTableCommit';

      try { //  pre-test cleanup
        teradataConnection1 = new TeradataConnection();
        teradataConnection1.connect(connParamsCopy);
        cursor1 = teradataConnection1.cursor();
        const dQuery: string = 'DROP TABLE ' + sTableName;
        cursor1.execute(dQuery);
      } catch (error) {
        if ((error instanceof OperationalError) &&
            (error.message.indexOf('Object ') > 0)) {
          // ignorble error
        } else {
          logger.errorLogMessage(error.message); // unexpected error
        }
      }

      try { // test CreateTableCommit
        const teradataConnection2: TeradataConnection = new TeradataConnection();
        teradataConnection2.connect(connParamsCopy);
        const cursor2: TeradataCursor = teradataConnection2.cursor();
        try {
          cursor2.execute('{fn teradata_nativesql}{fn teradata_autocommit_off}');
          const cQuery: string = 'create table ' + sTableName +
            ' (c1 integer not null)';
          cursor2.execute(cQuery);
          cursor2.execute('{fn teradata_commit}');
          succeeded = true;
        } catch (error) {
          logger.errorLogMessage(error.message); // unexpected error
        }
        cursor2.close();
        teradataConnection2.close();
      } catch (error) {
        logger.errorLogMessage(error.message); // unexpected error
      }

      try { // post-test cleanup
        const dQuery: string = 'DROP TABLE ' + sTableName;
        cursor1.execute(dQuery);
        cursor1.close();
        teradataConnection1.close();
      } catch (error) {
        if ((error instanceof OperationalError) &&
            (error.message.indexOf('Object ') > 0)) {
          // ignorble error
        } else {
          logger.errorLogMessage(error.message); // unexpected error
        }
      }
      expect(succeeded).equal(true);
      done();
    });

    it('Test \'' + test.mode + '\' mode: test CreateTableRollback', (done: any) => {
      const sTableName: string = 'testCreateTableRollback';

      try { //  pre-test cleanup
        teradataConnection1 = new TeradataConnection();
        teradataConnection1.connect(connParamsCopy);
        cursor1 = teradataConnection1.cursor();
        const dQuery: string = 'DROP TABLE ' + sTableName;
        cursor1.execute(dQuery);
      } catch (error) {
        if ((error instanceof OperationalError) &&
            (error.message.indexOf('Object ') > 0)) {
          // ignorble error
        } else {
          logger.errorLogMessage(error.message); // unexpected error
        }
      }

      let nWarningCode: number = null;
      let sWarningMsg: string = null;
      try { // test testCreateTableRollback
        const teradataConnection2: TeradataConnection = new TeradataConnection();
        teradataConnection2.connect(connParamsCopy);
        const cursor2: TeradataCursor = teradataConnection2.cursor();
        try {
          cursor2.execute('{fn teradata_nativesql}{fn teradata_autocommit_off}');
          const cQuery: string = 'create table ' + sTableName +
            ' (c1 integer not null)';
          cursor2.execute(cQuery);
          cursor2.execute('{fn teradata_fake_result_sets}{fn teradata_rollback}');
          const res: any[] = cursor2.fetchone();
          nWarningCode = res[5];
          sWarningMsg = res[6];
          logger.infoLogMessage('Expected warning from rollback: ' + sWarningMsg);
        } catch (error) {
          logger.errorLogMessage(error.message); // unexpected error
        }
        cursor2.close();
        teradataConnection2.close();
      } catch (error) {
        logger.errorLogMessage(error.message); // unexpected error
      }

      let gotExpectedError: boolean = false;
      try { // post-test cleanup
        const dQuery: string = 'DROP TABLE ' + sTableName;
        cursor1.execute(dQuery);
        cursor1.close();
        teradataConnection1.close();
      } catch (error) {
        if ((error instanceof OperationalError) &&
            (error.message.indexOf('Object ') > 0)) {
          // Table should be non-existent because of the rollback
          gotExpectedError = true;
        } else {
          logger.errorLogMessage(error.message); // unexpected error
        }
      }
      expect(nWarningCode).equal(3514);
      expect(gotExpectedError).equal(true);
      done();
    });
  });
});
