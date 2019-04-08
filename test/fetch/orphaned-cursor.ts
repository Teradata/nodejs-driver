import 'mocha';
import { expect } from 'chai';
import { TeradataConnection } from '../../src/teradata-connection';
import { TeradataCursor } from '../../src/teradata-cursor';
import { TeradataLogging } from '../../src/teradata-logging';
import { connParams } from '../configurations';

let teradataConnection: TeradataConnection;
let cursor: TeradataCursor;
let bCursorOpened: boolean = null;
let bDisconnectedWithOrphanCursor: boolean = null;

const logger: TeradataLogging = new TeradataLogging();

describe('\n\n\nOrphaned Cursor Tests', () => {
  before((done: any) => {
    try {
      logger.infoLogMessage('\n');
      teradataConnection = new TeradataConnection();
      teradataConnection.connect(connParams);
      cursor = teradataConnection.cursor();
      cursor.execute('select 123');
      cursor.execute('{fn teradata_lobselect(S)}select 123');
      cursor.execute('select row_number() over (order by calendar_date) ' +
        'as c1, cast(cast(c1 as integer) as char(64000)) as c2 from sys_calendar.calendar qualify c1 <= 50');
      bCursorOpened = true;
    } catch (error) {
      logger.errorLogMessage(error.message); // unexpected error
      bCursorOpened = false;
    } finally {
      done();
    }
  });

  after((done: any) => {
    done();
  });

  it('Attempt to close connectin with an orphan cursor', (done: any) => {
    if (bCursorOpened) {
      try {
        // deliberately skip calling cursor.close()
        teradataConnection.close();
        bDisconnectedWithOrphanCursor = true;
      } catch (error) {
        logger.errorLogMessage(error.message); // unexpected error
        bDisconnectedWithOrphanCursor = false;
      }
    } else {
      bDisconnectedWithOrphanCursor = false;
    }
    expect(bDisconnectedWithOrphanCursor).equal(true);
    done();
  });
});
