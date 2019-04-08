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

describe('\n\n\nBasic Bind Tests', () => {
  before((done: any) => {
    try {
      logger.infoLogMessage('\n');
      teradataConnection = new TeradataConnection();
      teradataConnection.connect(connParams);
      cursor = teradataConnection.cursor();
      const cQuery: string = 'create volatile table ' + sTableName + ' (c1 integer, c2 varchar(100), ' +
                             'c3 integer, c4 varbyte(10), c5 float) on commit preserve rows';
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
    let fetchedRows1: any[];
    let fetchedRows2: any[];
    const expectedRows: any[] = [
      [0, 'first', null, null, null],
      [1, 'hello', null, null, null],
      [2, 'foobar', null, null, null],
      [3, 'hiho', null, null, null],
      [4, null, null, null, null],
      [5, null, 123, null, null],
      [6, null, null, null, null],
      [7, null, null, new Uint8Array([65, 66, 67]), null],
      [8, null, null, null, null],
      [9, null, null, null, 123.45],
      [10, null, null, null, null],
    ];
    try {
      let bindQuery: string = 'insert into ' + sTableName + ' (c1, c2) values (?, ?)';
      let values: any[] = [0, 'first'];
      cursor.execute(bindQuery, values);

      values = [1, 'hello'];
      cursor.execute(bindQuery, values);

      values = [2, 'foobar'];
      cursor.execute(bindQuery, values);

      values = [3, 'hiho'];
      cursor.execute(bindQuery, values);

      values = [4, null];
      cursor.execute(bindQuery, values);

      bindQuery = 'insert into ' + sTableName + ' (c1, c3) values (?, ?)';
      values = [5, 123];
      cursor.execute(bindQuery, values);

      values = [6, null];
      cursor.execute(bindQuery, values);

      bindQuery = 'insert into ' + sTableName + ' (c1, c4) values (?, ?)';
      values = [7, new Uint8Array([65, 66, 67])];
      cursor.execute(bindQuery, values);

      values = [8, null];
      cursor.execute(bindQuery, values);

      bindQuery = 'insert into ' + sTableName + ' (c1, c5) values (?, ?)';
      values = [9, 123.45];
      cursor.execute(bindQuery, values);

      values = [10, null];
      cursor.execute(bindQuery, values);

      const sQuery: string = 'SELECT * FROM ' + sTableName + ' ORDER BY 1';
      cursor.execute(sQuery);

      fetchedRows1 = cursor.fetchall();

      bindQuery = 'select * from ' + sTableName + ' where c1 between ? and ? order by 1';
      values = [2, 5];
      cursor.execute(bindQuery, values);

      fetchedRows2 = cursor.fetchall();

    } catch (error) {
      logger.errorLogMessage(error.message); // unexpected error
    } finally {
      expect(fetchedRows1).to.deep.equal(expectedRows);
      expect(fetchedRows2).to.deep.equal(expectedRows.slice(2, 6));
      done();
    }
  });
});
