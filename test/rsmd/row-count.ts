import 'mocha';
import { expect } from 'chai';
import { TeradataConnection } from '../../src/teradata-connection';
import { TeradataCursor } from '../../src/teradata-cursor';
import { TeradataLogging } from '../../src/teradata-logging';
import { connParams } from '../configurations';

let teradataConnection: TeradataConnection;
let cursor: TeradataCursor;

const logger: TeradataLogging = new TeradataLogging();
const sTab1: string = 'volatiletable1';
const sTab2: string = 'volatiletable2';

describe('\n\n\nMetadata Tests for row counts', () => {
  before((done: any) => {
    try {
      logger.infoLogMessage('\n');
      teradataConnection = new TeradataConnection();
      teradataConnection.connect(connParams);
      cursor = teradataConnection.cursor();
      let cQuery: string = 'create volatile table ' + sTab1 + ' (c1 integer) on commit preserve rows';
      cursor.execute(cQuery);
      cQuery = 'create volatile table ' + sTab2 + ' (c1 integer, c2 integer) on commit preserve rows';
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

  it('Insert rows and verify row counts', (done: any) => {
    let rowCount1: number = 0;
    let rowCount2: number = 0;
    let rowCount3: number = 0;
    let rowCount4: number = 0;
    let rowCountRowSet1: number = 0;
    let rowCountRowSet2: number = 0;
    let rowCount5: number = 0;
    let rowCount6: number = 0;
    let rowCount7: number = 0;
    let rowCount8: number = 0;
    let rowCount9: number = 0;
    let rowCount10: number = 0;
    let bNextSet1: boolean = null;
    let bNextSet2: boolean = null;
    let bNextSet3: boolean = null;
    let bNextSet10: boolean = null;
    let bNextSet11: boolean = null;
    let rowSet5: any[] = null;
    let rowSet6: any[] = null;
    let rowSet8: any[] = null;
    let rowSet9: any[] = null;
    let rowSet10: any[] = null;

    const expectedRows: any[] = [
      [ 1, null],
      [ 2, 102],
      [ 3, 103],
      [ 4, 104],
      [ 5, 105],
      [ 6, 106],
      [ 7, 107],
      [ 8, 108],
      [ 9, 109],
      [10, 110],
      [11, null],
      [12, null]];

    try {
      cursor.execute(sInsert(sTab1, 1));
      rowCount1 = cursor.rowcount;

      cursor.execute(sInsSelect(sTab1, 2, 3));
      rowCount2 = cursor.rowcount;

      cursor.execute(sInsSelect(sTab1, 4, 6));
      rowCount3 = cursor.rowcount;

      cursor.execute(sInsert(sTab1, 7) + ';' + sInsSelect(sTab1, 8, 10) + ';' + sInsSelect(sTab2, 1, 12));
      rowCount4 = cursor.rowcount;

      bNextSet1 = cursor.nextset();
      rowCountRowSet1 = cursor.rowcount;

      bNextSet2 = cursor.nextset();
      rowCountRowSet2 = cursor.rowcount;

      bNextSet3 = cursor.nextset();

      cursor.execute(`select * from ${sTab1} order by 1`);
      rowCount5 = cursor.rowcount;
      rowSet5 = cursor.fetchall();

      cursor.execute(`select c1 from ${sTab2} order by 1`);
      rowCount6 = cursor.rowcount;
      rowSet6 = cursor.fetchall();

      cursor.execute(`update ${sTab2} set c2=c1+100 where c1 between 2 and 10`);
      rowCount7 = cursor.rowcount;

      cursor.execute(`select * from ${sTab2} order by 1`);
      rowCount8 = cursor.rowcount;
      rowSet8 = cursor.fetchall();

      cursor.execute(`select * from ${sTab1} order by 1; select c1 from ${sTab2} order by 1`);
      rowCount9 = cursor.rowcount;
      rowSet9 = cursor.fetchall();

      bNextSet10 = cursor.nextset();
      rowCount10 = cursor.rowcount;
      rowSet10 = cursor.fetchall();

      bNextSet11 = cursor.nextset();
    } catch (error) {
      logger.errorLogMessage(error.message); // unexpected error
    } finally {
      expect(rowCount1).equals(1);
      expect(rowCount2).equals(2);
      expect(rowCount3).equals(3);
      expect(rowCount4).equals(1);
      expect(bNextSet1).equals(true);
      expect(rowCountRowSet1).equals(3);
      expect(bNextSet2).equals(true);
      expect(rowCountRowSet2).equals(12);
      expect(bNextSet3).equals(false);
      expect(rowCount5).equals(10);
      expect(rowSet5).to.deep.equal(makeIntRows(10));
      expect(rowCount6).equals(12);
      expect(rowSet6).to.deep.equal(makeIntRows(12));
      expect(rowCount7).equals(9);
      expect(rowCount8).equal(12);
      expect(rowSet8).to.deep.equal(expectedRows);
      expect(rowCount9).equals(10);
      expect(rowSet9).to.deep.equal(makeIntRows(10));
      expect(bNextSet10).equals(true);
      expect(rowCount10).equals(12);
      expect(rowSet10).to.deep.equal(makeIntRows(12));
      expect(bNextSet11).equals(false);
      done();
    }
  });
});

function sInsert(sTab: string, int: number): string {
  return `insert into ${sTab} (c1) values (${int})`;
}

function sInsSelect(sTab: string, int1: number, int2: number): string {
  return `insert into ${sTab} (c1)
  select (row_number() over (order by calendar_date)) + ${int1} - 1 as c1
  from sys_calendar.calendar qualify c1 <= ${int2}`;
}

function makeIntRows (nCount: number): any[] {
  const an: any[] = [];
  let n: number;
  for (n = 0; n < nCount ; n++) {
      an.push([n + 1]);
  }
  return an;
}
