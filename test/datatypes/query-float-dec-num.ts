import 'mocha';
import { expect } from 'chai';
import { TeradataConnection } from '../../src/teradata-connection';
import { TeradataCursor } from '../../src/teradata-cursor';
import { TeradataLogging } from '../../src/teradata-logging';
import { connParams } from '../configurations';

let teradataConnection: TeradataConnection;
let cursor: TeradataCursor;

const logger: TeradataLogging = new TeradataLogging();
const sTableName: string = 'volatiletable'; // volatile table doesn't need scope

describe('\n\n\nQuery Float Decimal Number Values Tests', () => {
  before((done: any) => {
    try {
      logger.infoLogMessage('\n');
      teradataConnection = new TeradataConnection();
      teradataConnection.connect(connParams);
      cursor = teradataConnection.cursor();
      const cQuery: string = 'create volatile table ' + sTableName
        + ' (c1 integer, c2 float, c3 decimal(38,1), c4 number) on commit preserve rows';
      cursor.execute(cQuery);
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

  it('Inserts values and then selects for same values', (done: any) => {
    const nonBindQuery: string = `insert into @ values ( 1,  1001,  1001,  1001)
      ; insert into @ values ( 2,  1000,  1000,  1000)
      ; insert into @ values ( 3,   101,   101,   101)
      ; insert into @ values ( 4,   100,   100,   100)
      ; insert into @ values ( 5,    11,    11,    11)
      ; insert into @ values ( 6,    10,    10,    10)
      ; insert into @ values ( 7,     1,     1,     1)
      ; insert into @ values ( 8,   0.1,   0.1,   0.1)
      ; insert into @ values ( 9,     0,     0,     0)
      ; insert into @ values (10,  -0.1,  -0.1,  -0.1)
      ; insert into @ values (11,    -1,    -1,    -1)
      ; insert into @ values (12,   -10,   -10,   -10)
      ; insert into @ values (13,   -11,   -11,   -11)
      ; insert into @ values (14,  -100,  -100,  -100)
      ; insert into @ values (15,  -101,  -101,  -101)
      ; insert into @ values (16, -1000, -1000, -1000)
      ; insert into @ values (17, -1001, -1001, -1001)`.replace(/@/g, sTableName);

    const values: any[] = [
      [ 1,  1001.0,  1001  ,  1001  ],
      [ 2,  1000.0,  1000  ,  1000  ],
      [ 3,   101.0,   101  ,   101  ],
      [ 4,   100.0,   100  ,   100  ],
      [ 5,    11.0,    11  ,    11  ],
      [ 6,    10.0,    10  ,    10  ],
      [ 7,     1.0,     1  ,     1  ],
      [ 8,     0.1,     0.1,     0.1],
      [ 9,     0.0,     0  ,     0  ],
      [10,    -0.1,    -0.1,    -0.1],
      [11,    -1.0,    -1  ,    -1  ],
      [12,   -10.0,   -10  ,   -10  ],
      [13,   -11.0,   -11  ,   -11  ],
      [14,  -100.0,  -100  ,  -100  ],
      [15,  -101.0,  -101  ,  -101  ],
      [16, -1000.0, -1000  , -1000  ],
      [17, -1001.0, -1001  , -1001  ],
    ];
    let fetchedRows: any[];
    try {
      cursor.execute(nonBindQuery);
      const sQuery: string = 'SELECT * FROM ' + sTableName + ' ORDER BY 1';
      cursor.execute(sQuery);
      fetchedRows = cursor.fetchall();
    } catch (error) {
      logger.errorLogMessage(error.message); // unexpected error
    } finally {
      expect(fetchedRows).to.deep.equal(values);
      done();
    }
  });
});
