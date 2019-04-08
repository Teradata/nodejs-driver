import 'mocha';
import { expect } from 'chai';
import { TeradataConnection } from '../../src/teradata-connection';
import { TeradataCursor } from '../../src/teradata-cursor';
import { TeradataLogging } from '../../src/teradata-logging';
import { connParams } from '../configurations';

let teradataConnection: TeradataConnection;
let cursor: TeradataCursor;
const sTableName: string = 'volatiletable';
const logger: TeradataLogging = new TeradataLogging();

describe('\n\n\nDate Time Values Tests', () => {
  before((done: any) => {
    try {
      logger.infoLogMessage('\n');
      teradataConnection = new TeradataConnection();
      teradataConnection.connect(connParams);
      cursor = teradataConnection.cursor();
      const cQuery: string = 'create volatile table ' + sTableName
        + ' (c1 integer'
        + ', c2 date'
        + ', c3 time'
        + ', c4 time with time zone'
        + ', c5 timestamp'
        + ', c6 timestamp with time zone'
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
    const bindQuery: string = 'insert into ' + sTableName + ' values (?, ?, ?, ?, ?, ?)';
    const sQuery: string = 'SELECT * FROM ' + sTableName + ' ORDER BY 1';
    const values: any[] = [
      [0, new Date('1899-01-11'), '17:43:53.000000', '10:43:53.000000+11:45', '1899-06-12 12:33:50.000000', '1899-06-12 12:33:50.000000+11:45'],
      [1, new Date('1900-02-12'), '18:44:54.000001', '11:44:54.000001+10:30', '1900-07-13 12:34:51.000001', '1900-07-13 12:34:51.000001+10:30'],
      [2, new Date('1901-03-13'), '19:45:55.000012', '12:45:55.000012+01:00', '1901-08-14 12:35:52.000012', '1901-08-14 12:35:52.000012+01:00'],
      [3, new Date('1999-04-14'), '20:46:56.000123', '13:46:56.000123+00:00', '1999-09-15 12:36:53.000123', '1999-09-15 12:36:53.000123+00:00'],
      [4, new Date('2000-05-15'), '21:47:57.001234', '14:47:57.001234-01:00', '2000-10-16 12:37:54.001234', '2000-10-16 12:37:54.001234+01:00'],
      [5, new Date('2001-06-16'), '22:48:58.012345', '15:48:58.012345-10:30', '2001-11-17 12:38:55.012345', '2001-11-17 12:38:55.012345+10:30'],
      [6, new Date('2002-07-17'), '23:49:59.123456', '16:49:59.123456-11:45', '2002-12-18 12:39:56.123456', '2002-12-18 12:39:56.123456+11:45'],
      [7, null, null, null, null, null],
      [8, null, null, null, null, null],
      [9, null, null, null, null, null],
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
