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

let nColumnLen: number = 64000;

describe('\n\n\nOne MB Rows Tests', () => {
  before((done: any) => {
    try {
      logger.infoLogMessage('\n');
      teradataConnection = new TeradataConnection();
      teradataConnection.connect(connParams);
      cursor = teradataConnection.cursor();

      if (getDBSVersion(cursor) < 160000) {
        nColumnLen = 2000;
      }

      const sColumnSize: string = nColumnLen.toString();

      const cQuery: string = 'create volatile table ' + sTableName +
        '(  c1 integer not null' +
        ',  c2 char (' + sColumnSize + ')' +
        ',  c3 char (' + sColumnSize + ')' +
        ',  c4 char (' + sColumnSize + ')' +
        ',  c5 char (' + sColumnSize + ')' +
        ',  c6 char (' + sColumnSize + ')' +
        ',  c7 char (' + sColumnSize + ')' +
        ',  c8 char (' + sColumnSize + ')' +
        ',  c9 char (' + sColumnSize + ')' +
        ', c10 char (' + sColumnSize + ')' +
        ', c11 char (' + sColumnSize + ')' +
        ', c12 char (' + sColumnSize + ')' +
        ', c13 char (' + sColumnSize + ')' +
        ', c14 char (' + sColumnSize + ')' +
        ', c15 byte (' + sColumnSize + ')' +
        ', c16 byte (' + sColumnSize + ')' +
        ') on commit preserve rows';
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

  it('Inserts values and then selects for comparisons', (done: any) => {
    const nNumberOfRows: number = 5;
    const nNumberOfCols: number = 16;

    const data: any[] = getData(nNumberOfRows, nNumberOfCols, nColumnLen);
    const aaoRows: any[] = data[0];
    const aaoExpectedValues: any[] = data[1];

    const iQuery: string = 'insert into ' + sTableName + ' (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)';
    const sQuery: string = 'SELECT * FROM ' + sTableName + ' ORDER BY 1';

    let fetchedRows: any[];
    try {
      cursor.execute(iQuery, aaoRows);
      cursor.execute(sQuery);
      fetchedRows = cursor.fetchall();
    } catch (error) {
      logger.errorLogMessage(error.message); // unexpected error
    } finally {
      expect(fetchedRows).to.deep.equal(aaoExpectedValues);
      done();
    }
  });
});

function getData (nRowNums: number, nColNums: number, nColLen: number): any[] {

  const data: any[] = [];

  const aaoRows: any[] = new Array(nRowNums);
  const aaoExpectedValues: any[] = new Array(nRowNums);
  aaoRows.fill(null);
  aaoExpectedValues.fill(null);

  let nRowIndex: number;
  for (nRowIndex = 0; nRowIndex < nRowNums; nRowIndex++) {

    const aoColumns: any[] = new Array(nColNums);
    const aoExpectedCols: any[] = new Array(nColNums);
    aoColumns.fill(null);
    aoExpectedCols.fill(null);

    let st: string = '';
    let ch: string = 'a';

    let nColIndex: number;
    for (nColIndex = 0; nColIndex < nColNums; nColIndex++) {

      st = ch + nRowIndex.toString();

      if (nColIndex === 0) {
        aoColumns [nColIndex] = nRowIndex + 1;
        aoExpectedCols [nColIndex] = aoColumns [nColIndex];
      } else if (nColIndex < 14) {
        if (nRowIndex === 0) {
          aoColumns [nColIndex] = null;
          aoExpectedCols [nColIndex] = null;

        } else if (nRowIndex === 1) {
          aoColumns [nColIndex] = st;
          if (nColLen === 2000) {
            aoExpectedCols [nColIndex] = padEndBlank(aoColumns [nColIndex], nColLen * 2);
          } else {
            aoExpectedCols [nColIndex] = padEndBlank(aoColumns [nColIndex], nColLen);
          }
        } else if (nRowIndex === 2) {
          aoColumns [nColIndex] = getString(st, nColLen / 2).trimRight ();
          if (nColLen === 2000) {
            aoExpectedCols [nColIndex] = padEndBlank(aoColumns [nColIndex], nColLen * 2);
          } else {
            aoExpectedCols [nColIndex] = padEndBlank(aoColumns [nColIndex], nColLen);
          }
        } else {
          let nMult: number = 2000;
          if (nColLen < 64000) {
            nMult = 10;
          }
          aoColumns [nColIndex] = getString (st, nMult * nColIndex).trimRight ();
          if (nColLen === 2000) {
            aoExpectedCols [nColIndex] = padEndBlank(aoColumns [nColIndex], nColLen * 2);
          } else {
            aoExpectedCols [nColIndex] = padEndBlank(aoColumns [nColIndex], nColLen);
          }
        }
      } else {
          if (nRowIndex === 0) {
            aoColumns [nColIndex] = null;
            aoExpectedCols [nColIndex] = null;
          } else {
            const bytes: Uint8Array = getStringEncodingValues(st, nColLen);
            aoColumns [nColIndex] = bytes;
            aoExpectedCols [nColIndex] = padEndNull(bytes, nColLen);
          }
      }
      ch = String.fromCodePoint(ch.charCodeAt(0) + 1);
    } // end for nColIndex = 0

    aaoRows [nRowIndex] = aoColumns;
    aaoExpectedValues [nRowIndex] = aoExpectedCols;
  } // end for nRowIndex = 0

  data.push(aaoRows);
  data.push(aaoExpectedValues);

  return data;
}

function getDBSVersion (cur: TeradataCursor): number {
  const sQuery: string = '{fn teradata_nativesql}{fn teradata_provide (config_response)}';
  cur.execute(sQuery);
  const row: any[] = cur.fetchone();
  const j: any = JSON.parse(row[0]);
  return Number(j.DatabaseVersionNumber);
} // end getDBSVersion

function getStringEncodingValues (st: string, nColLen: number): Uint8Array {

  // create encoding-values buffer from string
  const buf: Buffer = Buffer.from((getString(st, (nColLen / 2)).trimRight()), 'utf8');

  // create ArrayBuffer from Buffer
  const arrayBuffer: ArrayBuffer = buf.buffer.slice(buf.byteOffset, buf.byteOffset + buf.length);

  // create Uint8Array from ArrayBuffer
  const bytes: Uint8Array = new Uint8Array(arrayBuffer);
  for (let i: number = 0; i < buf.length; ++i) {
    bytes[i] = buf[i];
  }

  return bytes;
}

function padEndBlank (str: string, targetLength: number): string {
  let padString: string = String(' ');
  if (str.length > targetLength) {
    return String(str);
  } else {
    targetLength = targetLength - str.length;
    if (targetLength > padString.length) {
      padString += padString.repeat(targetLength / padString.length);
    }
    return String(str) + padString.slice(0, targetLength);
  }
}

function padEndNull (bytes: Uint8Array, targetLength: number): Uint8Array {
  if (bytes.length > targetLength) {
    return bytes.slice();
  } else {
    const padded: Uint8Array = new Uint8Array(targetLength);
    padded.fill(0);
    padded.set(bytes);
    return padded;
  }
}

function getString (c: string, nLength: number): string {
  let s: string = '';
  while ((s.length + c.length) < nLength) {
    s += c + ' ';
  }
  return s;
}
