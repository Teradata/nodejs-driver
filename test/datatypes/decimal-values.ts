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

describe('\n\n\nDecimal Values Tests', () => {
  before((done: any) => {
    try {
      logger.infoLogMessage('\n');
      teradataConnection = new TeradataConnection();
      teradataConnection.connect(connParams);
      cursor = teradataConnection.cursor();
      const cQuery: string = 'create volatile table ' + sTableName
        + ' (c1 integer'
        + ', c2 decimal(2)'
        + ', c3 decimal(2,1)'
        + ', c4 decimal(4)'
        + ', c5 decimal(4,2)'
        + ', c6 decimal(9)'
        + ', c7 decimal(9,3)'
        + ', c8 decimal(19)'
        + ', c9 decimal(19,4)'
        + ', c10 decimal(38)'
        + ', c11 decimal(38,5)'
        + ', c12 number'
        + ') on commit preserve rows';
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

  it('Inserts bind values and then selects for same values', (done: any) => {
    const bindQuery: string = 'insert into ' + sTableName + ' values (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)';
    const sQuery: string = 'SELECT * FROM ' + sTableName + ' ORDER BY 1';
    const values: any[] = [
      [1, 99, 9.9, 9999, 99.99, 999999999, 999999.999, 999999999999999999, 99999999999999.9999,
        99999999999999999999999999999999999999, 999999999999999999999999999999999.99999, 999.99999999999999999999999999999999999],
      [2, 1, 0.1, 1, 0.01, 1, 0.001, 1, 0.0001, 1, 0.00001, 99999999999999999999999999999999999.999],
      [3, 0, 0.0, 0, 0.00, 0, 0.000, 0, 0.0000, 0, 0.00000, 0],
      [4, -1, -0.1, -1, -0.01, -1, -0.001, -1, -0.0001, -1, -0.00001, -99999999999999999999999999999999999.999],
      [5, -99, -9.9, -9999, -99.99, -999999999, -999999.999, -999999999999999999, -99999999999999.9999,
        -99999999999999999999999999999999999999, -999999999999999999999999999999999.99999, -999.99999999999999999999999999999999999],
      [6, null, null, null, null, null, null, null, null, null, null, null],
    ];
    let fetchedRows: any[];
    try {
      cursor.execute(bindQuery, values);
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
