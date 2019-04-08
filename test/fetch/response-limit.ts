import 'mocha';
import { expect } from 'chai';
import { TeradataConnection } from '../../src/teradata-connection';
import { TeradataCursor } from '../../src/teradata-cursor';
import { TeradataLogging } from '../../src/teradata-logging';
import { MakeError, OperationalError } from '../../src/teradata-exceptions';
import { connParams } from '../configurations';

let teradataConnection: TeradataConnection;

const logger: TeradataLogging = new TeradataLogging();

describe('\n\n\nResponse Limit Tests', () => {
  before((done: any) => {
    try {
      logger.infoLogMessage('\n');
      teradataConnection = new TeradataConnection();
      teradataConnection.connect(connParams);
    } catch (error) {
      logger.errorLogMessage(error.message); // unexpected error
    } finally {
      done();
    }
  });

  after((done: any) => {
    teradataConnection.close();
    done();
  });

  it('Test 1', (done: any) => {
    let acur: TeradataCursor[] = [];
    try {
      for (let i: number = 0; i < 21; i++) {
        const cur: TeradataCursor = teradataConnection.cursor();
        acur.push(cur);
        try {
          cur.execute('select 123');
        } catch (error) {
          logger.errorLogMessage(error.message); // unexpected error
        }
      }
    } catch (error) {
      logger.errorLogMessage(error.message); // unexpected error
    } finally {
      for (let i: number = 0; i < acur.length; i++) {
        acur[i].close();
      }
    }
    done();
  });

  it('Test 2', (done: any) => {
    let acur: TeradataCursor[] = [];
    let bCaught3130: boolean = false;
    try {
      for (let n: number = 1; n <= 21; n++) {
        const cur: TeradataCursor = teradataConnection.cursor();
        acur.push(cur);
        try {
          cur.execute('{fn teradata_lobselect(S)}select 123');
        } catch (error) {
          if ((error instanceof OperationalError) &&
          (error.message.indexOf('Response limit exceeded') > 0)) {
            // error 3130 is expected
            if (n <= 15) {
              throw new MakeError ('Got expected error 3130 too soon');
            } else {
              bCaught3130 = true;
              throw error;
            }
          } else {
            logger.errorLogMessage(error.message); // unexpected error
          }
        }
      }
    } catch (error) {
      acur.pop(); // error 3130 resulted in a bad row handle so discard it
    } finally {
      for (let i: number = 0; i < acur.length; i++) {
        acur[i].close();
      }
    }
    expect(bCaught3130).equal(true);
    done();
  });

  it('Test 3', (done: any) => {
    let acur: TeradataCursor[] = [];
    let bCaught3130: boolean = false;
    try {
      for (let n: number = 1; n <= 21; n++) {
        const cur: TeradataCursor = teradataConnection.cursor();
        acur.push(cur);
        try {
          cur.execute('select row_number() over (order by calendar_date) as ' +
            'c1, cast(cast(c1 as integer) as char(64000)) as c2 from sys_calendar.calendar qualify c1 <= 50');
        } catch (error) {
          if ((error instanceof OperationalError) &&
          (error.message.indexOf('Response limit exceeded') > 0)) {
            // error 3130 is expected
            if (n <= 15) {
              throw new MakeError ('Got expected error 3130 too soon');
            } else {
              bCaught3130 = true;
              throw error;
            }
          } else {
            logger.errorLogMessage(error.message); // unexpected error
          }
        }
      }
    } catch (error) {
      acur.pop(); // error 3130 resulted in a bad row handle so discard it
    } finally {
      for (let i: number = 0; i < acur.length; i++) {
        acur[i].close();
      }
    }
    expect(bCaught3130).equal(true);
    done();
  });
});
