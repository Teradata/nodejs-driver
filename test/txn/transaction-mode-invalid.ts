import 'mocha';
import { expect } from 'chai';
import { TeradataConnection, ITDConnParams } from '../../src/teradata-connection';
import { TeradataLogging } from '../../src/teradata-logging';
import { connParams } from '../configurations';
import { OperationalError } from '../../src/teradata-exceptions';

const logger: TeradataLogging = new TeradataLogging();

describe('\n\n\nTest Transaction Mode Invalid', () => {
  it('Test invalid transaction mode', (done: any) => {
    let gotExpectedError: boolean = false;
    try {
      const connParamsCopy: ITDConnParams = Object.assign({}, connParams);
      connParamsCopy.tmode = 'INVALID';
      const teradataConnection: TeradataConnection = new TeradataConnection();
      teradataConnection.connect(connParamsCopy);
    } catch (error) {
      if ((error instanceof OperationalError) &&
      (error.message.indexOf('INVALID') > 0)) {
        gotExpectedError = true;
      } else {
        logger.errorLogMessage(error.message); // unexpected error
      }
    }
    expect(gotExpectedError).equal(true);
    done();
  });
});
