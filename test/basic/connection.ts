import 'mocha';
import { expect } from 'chai';
import { TeradataConnection } from '../../src/teradata-connection';
import { TeradataLogging } from '../../src/teradata-logging';
import { connParams, badConnParams } from '../configurations';

const logger: TeradataLogging = new TeradataLogging();

describe('\n\n\nConnection Test', () => {
  it('Connects to Teradata Database', (done: any) => {
    try {
      const teradataConnection: TeradataConnection = new TeradataConnection();
      teradataConnection.connect(connParams);
      } catch (error) {
        logger.errorLogMessage(error.message); // unexpected error
      } finally {
        done();
      }
  });
});

describe('\n\n\nBad Connection Test', () => {
  it('Fails to Connect to Teradata Database', (done: any) => {
    try {
      const teradataConnection: TeradataConnection = new TeradataConnection();
      teradataConnection.connect(badConnParams);
    } catch (error) {
      expect(error.message).contains('Failed to connect to foo');
    } finally {
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
    } catch (error) {
      logger.errorLogMessage(error.message); // unexpected error
    } finally {
      done();
    }
  });
});
