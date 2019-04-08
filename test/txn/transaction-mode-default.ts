import 'mocha';
import { expect } from 'chai';
import { TeradataConnection, ITDConnParams } from '../../src/teradata-connection';
import { TeradataCursor } from '../../src/teradata-cursor';
import { TeradataLogging } from '../../src/teradata-logging';
import { connParams } from '../configurations';

const logger: TeradataLogging = new TeradataLogging();

describe('\n\n\nTest Transaction Mode Default', () => {
  const tests: any[] = [{mode: 'DEFAULT', expectedRows: ['T']}];
  tests.forEach((test: any) => {
    it('Test default transaction mode', (done: any) => {
      let res: any[];
      try {
        const connParamsCopy: ITDConnParams = Object.assign({}, connParams);
        connParamsCopy.tmode = test.mode;
        const teradataConnection: TeradataConnection = new TeradataConnection();
        teradataConnection.connect(connParamsCopy);
        const cursor: TeradataCursor = teradataConnection.cursor();
        const sQuery: string = `select Transaction_Mode from DBC.SessionInfoV where SessionNo = session`;
        cursor.execute(sQuery);
        res = cursor.fetchone();
        teradataConnection.close();
      } catch (error) {
        logger.errorLogMessage(error.message); // unexpected error
      } finally {
        expect(res).to.deep.equal(test.expectedRows);
      }
      done();
    });
  });
});
