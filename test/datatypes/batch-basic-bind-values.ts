import 'mocha';
import { expect } from 'chai';
import { TeradataConnection } from '../../src/teradata-connection';
import { TeradataCursor } from '../../src/teradata-cursor';
import { TeradataLogging } from '../../src/teradata-logging';
import { connParams } from '../configurations';

let teradataConnection: TeradataConnection;
let cursor: TeradataCursor;

const logger: TeradataLogging = new TeradataLogging();
const sTableName: string = 'volatiletable';

describe('\n\n\nBatch Bind Tests', () => {
  before((done: any) => {
    try {
      logger.infoLogMessage('\n');
      teradataConnection = new TeradataConnection();
      teradataConnection.connect(connParams);
      cursor = teradataConnection.cursor();
      const cQuery: string = 'create volatile table ' + sTableName +
        ' (c1 integer, c2 varchar(100), c3 integer, c4 varbyte(10), c5 float) on commit preserve rows';
      cursor.execute(cQuery);
    } catch (error) {
      logger.errorLogMessage(error.message);
    } finally {
      done();
    }
  });

  after((done: any) => {
    try {
      cursor.close();
      teradataConnection.close();
    } catch (error) {
      logger.errorLogMessage(error.message);
    } finally {
      done();
    }
  });

  it('Inserts batch bind values and then selects for same values', (done: any) => {
    let fetchedRows1: any[] = null;
    let fetchedRows2: any[] = null;
    let bindQuery: string = null;
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
      bindQuery = 'insert into ' + sTableName + ' (c1, c2) values (?, ?)';
      cursor.execute(bindQuery, [[0, 'first'], [1, 'hello'], [2, 'foobar'], [3, 'hiho'], [4, null]]);

      bindQuery = 'insert into ' + sTableName + ' (c1, c3) values (?, ?)';
      cursor.execute(bindQuery, [[5, 123], [6, null]]);

      bindQuery = 'insert into ' + sTableName + ' (c1, c4) values (?, ?)';
      cursor.execute(bindQuery, [[7, new Uint8Array([65, 66, 67])], [8, null]]);

      bindQuery = 'insert into ' + sTableName + ' (c1, c5) values (?, ?)';
      cursor.execute(bindQuery, [[9, 123.45], [10, null]]);

      const sQuery: string = 'SELECT * FROM ' + sTableName + ' ORDER BY 1';
      cursor.execute(sQuery);
      fetchedRows1 = cursor.fetchall();

      bindQuery = 'select * from ' + sTableName + ' where c1 between ? and ? order by 1';
      cursor.execute(bindQuery, [2, 5]);
      fetchedRows2 = cursor.fetchall();
    } catch (error) {
      logger.errorLogMessage(error.message);
    } finally {
      expect(fetchedRows1).to.deep.equal(expectedRows);
      expect(fetchedRows2).to.deep.equal(expectedRows.slice(2, 6));
      done();
    }
  });
});
