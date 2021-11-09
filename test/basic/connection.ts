import 'mocha';
import { expect } from 'chai';
import { TeradataConnection } from '../../src/teradata-connection';
import { TeradataLogging } from '../../src/teradata-logging';
import { connParams, badConnParams } from '../configurations';
import { fail } from 'assert';

const logger: TeradataLogging = new TeradataLogging();

describe('\n\n\nConnection Test', () => {
  it('Connects to Teradata Database', (done: any) => {
    try {
      const teradataConnection: TeradataConnection = new TeradataConnection();
      teradataConnection.connect(connParams);
      done();
      } catch (error) {
        logger.errorLogMessage(error.message); // unexpected error
        fail();
      }
  });
});

describe('\n\n\nBad Connection Test', () => {
  it('Fails to Connect to Teradata Database', (done: any) => {
    try {
      const teradataConnection: TeradataConnection = new TeradataConnection();
      teradataConnection.connect(badConnParams);
      fail();
    } catch (error) {
      expect(error.message).contains('Hostname lookup failed for foo');
      done();
    }
  });
});

describe('Connects and Disconnects to Teradata Database', () => {
  it('td node connects and ends connection to database', (done: any) => {
    try {
      const teradataConnection: TeradataConnection = new TeradataConnection();
      teradataConnection.connect(connParams);
      teradataConnection.close();
      done();
    } catch (error) {
      logger.errorLogMessage(error.message); // unexpected error
      fail();
    }
  });
});
