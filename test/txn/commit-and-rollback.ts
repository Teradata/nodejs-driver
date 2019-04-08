import 'mocha';
import { expect } from 'chai';
import { TeradataConnection, ITDConnParams } from '../../src/teradata-connection';
import { TeradataCursor } from '../../src/teradata-cursor';
import { TeradataLogging } from '../../src/teradata-logging';
import { connParams } from '../configurations';

const logger: TeradataLogging = new TeradataLogging();

describe('\n\n\nTest Commit And Rollback', () => {
  const tests: any[] = [{mode: 'ANSI'},
                        {mode: 'TERA'} ];
  tests.forEach((test: any) => {
    it('Test \'' + test.mode + '\' mode', (done: any) => {
      const expectedValues: any[] = [[1], [2], [5], [6]];
      let actualValues: any[];
      try {
        const connParamsCopy: ITDConnParams = Object.assign({}, connParams);
        connParamsCopy.tmode = test.mode;
        const teradataConnection: TeradataConnection = new TeradataConnection();
        teradataConnection.connect(connParamsCopy);
        const cursor: TeradataCursor = teradataConnection.cursor();
        const setAutoCommitQuery: string = `{fn teradata_nativesql}{fn teradata_autocommit_off}`;
        cursor.execute(setAutoCommitQuery);
        const sTableName: string = 'volatiletable';
        const cQuery: string = 'create volatile table ' + sTableName +
          ' ( c1 integer ) on commit preserve rows';

        cursor.execute(cQuery); // create the target table
        cursor.execute('{fn teradata_commit}');

        cursor.execute('insert into ' + sTableName + ' (c1) values (1)');
        cursor.execute('insert into ' + sTableName + ' (c1) values (2)');
        cursor.execute('{fn teradata_commit}'); // commit [1] , [2]

        cursor.execute('insert into ' + sTableName + ' (c1) values (3)');
        cursor.execute('insert into ' + sTableName + ' (c1) values (4)');
        cursor.execute('{fn teradata_rollback}'); // rollback [3], [4]

        cursor.execute('insert into ' + sTableName + ' (c1) values (5)');
        cursor.execute('insert into ' + sTableName + ' (c1) values (6)');
        cursor.execute('{fn teradata_commit}'); // commit [5], [6]

        const sQuery: string = 'SELECT * FROM ' + sTableName + ' ORDER BY 1';
        cursor.execute(sQuery); // select all from the target table
        actualValues = cursor.fetchall();

        cursor.execute('{fn teradata_commit}'); // the last commit
        cursor.close();
        teradataConnection.close();
      } catch (error) {
        logger.errorLogMessage(error.message); // unexpected error
      }
      expect(actualValues).to.deep.equal(expectedValues);
      done();
    });
  });
});
