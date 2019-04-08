import 'mocha';
import { expect } from 'chai';
import { TeradataConnection } from '../../src/teradata-connection';
import { TeradataCursor } from '../../src/teradata-cursor';
import { TeradataLogging } from '../../src/teradata-logging';
import { connParams } from '../configurations';

let teradataConnection: TeradataConnection;
let cursor: TeradataCursor;

const logger: TeradataLogging = new TeradataLogging();

describe('\n\n\nSession Number Tests', () => {
  before((done: any) => {
    try {
      logger.infoLogMessage('\n');
      teradataConnection = new TeradataConnection();
      teradataConnection.connect(connParams);
      cursor = teradataConnection.cursor();
    } catch (error) {
      logger.errorLogMessage(error.message); // unexpected error
    } finally {
      done();
    }
  });

  after((done: any) => {
    try {
      cursor.close();
      teradataConnection.close();
    } catch (error) {
      logger.errorLogMessage(error.message); // unexpected error
    } finally {
      done();
    }
  });

  it('Executes queries against Teradata Database', (done: any) => {
    let sSelectOutput: string;
    let sEscOutput: string;
    try {
      let sQuery: string = 'SELECT session';
      cursor.execute(sQuery);
      let row: any[] = cursor.fetchone();
      sSelectOutput = row[0].toString();

      sQuery = '{fn teradata_nativesql}{fn teradata_session_number}';
      cursor.execute(sQuery);
      row = cursor.fetchone();
      sEscOutput = row[0];
    } catch (error) {
      logger.errorLogMessage(error.message); // unexpected error
    } finally {
      expect(sSelectOutput).equals(sEscOutput);
      done();
    }
  });
});
