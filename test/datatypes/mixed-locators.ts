import 'mocha';
import { expect } from 'chai';
import { TeradataConnection } from '../../src/teradata-connection';
import { TeradataCursor } from '../../src/teradata-cursor';
import { TeradataLogging } from '../../src/teradata-logging';
import { MakeError } from '../../src/teradata-exceptions';
import { Utils, LobValueFromLocator } from '../../test/utils';
import { connParams } from '../configurations';

let teradataConnection: TeradataConnection;
let cursor: TeradataCursor;

const logger: TeradataLogging = new TeradataLogging();
const sTableName: string = 'volatiletable';

const aaoInsertValues: any[] = [
  [
    1,
    getNewBytes ('1'.charCodeAt(0), 3000),
    getNewString ('b', 20),
    getJsonString (1),
    getXmlString (1),
    getNewBytes ('e'.charCodeAt(0), 30),
    getNewString ('f', 2000),
    getJsonString (2),
    getXmlString  (2),
    getNewBytes ('i'.charCodeAt(0), 300),
    getNewString ('j', 200),
    getJsonString (3),
    getXmlString  (3),
    getNewBytes ('m'.charCodeAt(0), 3000),
    getNewString ('n', 20),
    getJsonString (1),
    getXmlString  (1),
  ],
  [
    2,
    getNewBytes ('2'.charCodeAt(0), 300),
    getNewString ('3', 2000),
    getJsonString (2),
    getXmlString  (2),
    getNewBytes ('6'.charCodeAt(0), 30),
    getNewString ('7', 20),
    getJsonString (3),
    getXmlString  (3),
    getNewBytes ('0'.charCodeAt(0), 3000),
    getNewString ('1', 200),
    getJsonString (1),
    getXmlString  (1),
    getNewBytes ('4'.charCodeAt(0), 300),
    getNewString ('5', 2000),
    getJsonString (2),
    getXmlString  (2),
  ],
  [
    3,
    getNewBytes ('3'.charCodeAt(0), 3000),
    getNewString ('q', 200),
    getJsonString (3),
    getXmlString  (3),
    getNewBytes ('t'.charCodeAt(0), 300),
    getNewString ('u', 20),
    getJsonString (1),
    getXmlString  (1),
    getNewBytes ('x'.charCodeAt(0), 30),
    getNewString ('y', 2000),
    getJsonString (2),
    getXmlString  (2),
    getNewBytes ('b'.charCodeAt(0), 300),
    getNewString ('c', 200),
    getJsonString (3),
    getXmlString  (3),
  ],
];

describe('\n\n\nLocator LOB Tests', () => {
  before((done: any) => {
    try {
      logger.infoLogMessage('\n');
      teradataConnection = new TeradataConnection();
      teradataConnection.connect(connParams);
      cursor = teradataConnection.cursor();
      const cQuery: string = 'create volatile table ' + sTableName
        + '(c1 integer, c2 blob, c3 clob, c4 json, c5 xml, c6 blob, c7 clob, c8 json, c9 xml, c10 blob, ' +
          ' c11 clob, c12 json, c13 xml, c14 blob, c15 clob, c16 json, c17 xml) on commit preserve rows';
      cursor.execute(cQuery);
      const iQuery: string = 'insert into ' +  sTableName + ' values (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)';
      cursor.execute(iQuery, aaoInsertValues);
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

  it('Select lob values, one locator per query', (done: any) => {
    const aaoExpectedValues: any[] = [
      [
        1,
        Utils.BLOBLOC (getNewBytes ('1'.charCodeAt(0), 3000)),
        Utils.CLOBLOC (getNewString ('b', 20)),
        Utils.JSONLOC (getJsonString (1)),
        Utils.XMLLOC  (getXmlString (1)),
        Utils.BLOBLOC (getNewBytes ('e'.charCodeAt(0), 30)),
        Utils.CLOBLOC (getNewString ('f', 2000)),
        Utils.JSONLOC (getJsonString (2)),
        Utils.XMLLOC  (getXmlString  (2)),
        Utils.BLOBLOC (getNewBytes ('i'.charCodeAt(0), 300)),
        Utils.CLOBLOC (getNewString ('j', 200)),
        Utils.JSONLOC (getJsonString (3)),
        Utils.XMLLOC  (getXmlString  (3)),
        Utils.BLOBLOC (getNewBytes ('m'.charCodeAt(0), 3000)),
        Utils.CLOBLOC (getNewString ('n', 20)),
        Utils.JSONLOC (getJsonString (1)),
        Utils.XMLLOC  (getXmlString  (1)),
      ],
      [
        2,
        Utils.BLOBLOC (getNewBytes ('2'.charCodeAt(0), 300)),
        Utils.CLOBLOC (getNewString ('3', 2000)),
        Utils.JSONLOC (getJsonString (2)),
        Utils.XMLLOC  (getXmlString  (2)),
        Utils.BLOBLOC (getNewBytes ('6'.charCodeAt(0), 30)),
        Utils.CLOBLOC (getNewString ('7', 20)),
        Utils.JSONLOC (getJsonString (3)),
        Utils.XMLLOC  (getXmlString  (3)),
        Utils.BLOBLOC (getNewBytes ('0'.charCodeAt(0), 3000)),
        Utils.CLOBLOC (getNewString ('1', 200)),
        Utils.JSONLOC (getJsonString (1)),
        Utils.XMLLOC  (getXmlString  (1)),
        Utils.BLOBLOC (getNewBytes ('4'.charCodeAt(0), 300)),
        Utils.CLOBLOC (getNewString ('5', 2000)),
        Utils.JSONLOC (getJsonString (2)),
        Utils.XMLLOC  (getXmlString  (2)),
      ],
      [
        3,
        Utils.BLOBLOC (getNewBytes ('3'.charCodeAt(0), 3000)),
        Utils.CLOBLOC (getNewString ('q', 200)),
        Utils.JSONLOC (getJsonString (3)),
        Utils.XMLLOC  (getXmlString  (3)),
        Utils.BLOBLOC (getNewBytes ('t'.charCodeAt(0), 300)),
        Utils.CLOBLOC (getNewString ('u', 20)),
        Utils.JSONLOC (getJsonString (1)),
        Utils.XMLLOC  (getXmlString  (1)),
        Utils.BLOBLOC (getNewBytes ('x'.charCodeAt(0), 30)),
        Utils.CLOBLOC (getNewString ('y', 2000)),
        Utils.JSONLOC (getJsonString (2)),
        Utils.XMLLOC  (getXmlString  (2)),
        Utils.BLOBLOC (getNewBytes ('b'.charCodeAt(0), 300)),
        Utils.CLOBLOC (getNewString ('c', 200)),
        Utils.JSONLOC (getJsonString (3)),
        Utils.XMLLOC  (getXmlString  (3)),
      ],
    ];

    let fetchedRows: any[] = null;
    try {
      const sQuery: string = 'SELECT * FROM ' + sTableName + ' ORDER BY 1';
      const ssQuery: string = '{fn teradata_lobselect(S)}' + sQuery; // SELECT statement that returns lob locators
      cursor.execute(ssQuery);
      fetchedRows = fetchLobsOneLocatorPerQuery(cursor, aaoExpectedValues);
    } catch (error) {
      logger.errorLogMessage(error.message); // unexpected error
    } finally {
      expect(fetchedRows).to.deep.equal(aaoExpectedValues);
      done();
    }
  });

  it('Select lob values, all locators in one query', (done: any) => {
    const aaoExpectedValues: any[] = [
      [
        Utils.BLOBLOC (getNewBytes ('1'.charCodeAt(0), 3000)),
        Utils.CLOBLOC (getNewString ('b', 20)),
        Utils.JSONLOC (getJsonString (1)),
        Utils.BLOBLOC (getNewBytes ('e'.charCodeAt(0), 30)),
        Utils.CLOBLOC (getNewString ('f', 2000)),
        Utils.BLOBLOC (getNewBytes ('i'.charCodeAt(0), 300)),
        Utils.CLOBLOC (getNewString ('j', 200)),
        Utils.JSONLOC (getJsonString (3)),
        Utils.BLOBLOC (getNewBytes ('m'.charCodeAt(0), 3000)),
        Utils.CLOBLOC (getNewString ('n', 20)),
      ],
      [
        Utils.BLOBLOC (getNewBytes ('2'.charCodeAt(0), 300)),
        Utils.CLOBLOC (getNewString ('3', 2000)),
        Utils.JSONLOC (getJsonString (2)),
        Utils.BLOBLOC (getNewBytes ('6'.charCodeAt(0), 30)),
        Utils.CLOBLOC (getNewString ('7', 20)),
        Utils.BLOBLOC (getNewBytes ('0'.charCodeAt(0), 3000)),
        Utils.CLOBLOC (getNewString ('1', 200)),
        Utils.JSONLOC (getJsonString (1)),
        Utils.BLOBLOC (getNewBytes ('4'.charCodeAt(0), 300)),
        Utils.CLOBLOC (getNewString ('5', 2000)),
      ],
      [
        Utils.BLOBLOC (getNewBytes ('3'.charCodeAt(0), 3000)),
        Utils.CLOBLOC (getNewString ('q', 200)),
        Utils.JSONLOC (getJsonString (3)),
        Utils.BLOBLOC (getNewBytes ('t'.charCodeAt(0), 300)),
        Utils.CLOBLOC (getNewString ('u', 20)),
        Utils.BLOBLOC (getNewBytes ('x'.charCodeAt(0), 30)),
        Utils.CLOBLOC (getNewString ('y', 2000)),
        Utils.JSONLOC (getJsonString (2)),
        Utils.BLOBLOC (getNewBytes ('b'.charCodeAt(0), 300)),
        Utils.CLOBLOC (getNewString ('c', 200)),
      ],
    ];

    let fetchedRows: any[] = null;
    try {
      const sQuery: string = 'select c1, c2, c3, c4, c6, c7, c10, c11, c12, c14, c15 from  ' + sTableName + ' ORDER BY 1';
      const ssQuery: string = '{fn teradata_lobselect(S)}' + sQuery; // SELECT statement that returns lob locators
      cursor.execute(ssQuery);
      fetchedRows = fetchLobsAllLocatorsInOneQuery(cursor, aaoExpectedValues);
    } catch (error) {
      logger.errorLogMessage(error.message); // unexpected error
    } finally {
      expect(fetchedRows).to.deep.equal(aaoExpectedValues);
      done();
    }
  });
});

function ReadLobValue (con: TeradataConnection, abyInputLocator: Uint8Array, sDataType: string): any[] {
    if (!(abyInputLocator instanceof Uint8Array)) {
        throw new MakeError ('abyInputLocator must be bytes');
    }
    let rs: any[] = null;
    try {
      const cur: TeradataCursor = con.cursor();
      cur.execute('{fn teradata_parameter(1,' +  sDataType + ')}select ?', [abyInputLocator]); // select blob w/ the locator value
      rs = cur.fetchall();
      cur.close();
    } catch (error) {
      logger.errorLogMessage(error.message); // unexpected error
    } finally {
      if (rs && rs[0]) {
        return rs[0][0];
      } else {
        return null;
      }
    }
}

function getLobLocators (cur: TeradataCursor, aaoExpectedValues: any[]): any[] {
  const nExpectedRowCount: number = aaoExpectedValues.length;
  const aaabyLobLocators: any[] = [];
  let aoActualValues: any[] = [];
  let aoExpectedValues: any[] = [];

  // Fetch one row at a time so the select request is not closed before we can
  // fetch all the lob values associated with the lob locator
  let nActualRowCount: number = 0;
  for (nActualRowCount = 0; nActualRowCount < nExpectedRowCount; nActualRowCount++) {
      aoActualValues = cur.fetchone();
      if (aoActualValues === null) {
        break;
      }

      aoExpectedValues = aaoExpectedValues [nActualRowCount];

      let nCol: number = 0;
      let bIsLob: boolean = null;
      for (nCol = 0; nCol < aoExpectedValues.length; nCol++) {
        bIsLob = aoExpectedValues[nCol] instanceof LobValueFromLocator;
        if (bIsLob) {
          aoActualValues[nCol] = aoActualValues [nCol + 1]; // skip column c1
        }
      } // end for
      aoActualValues.pop(); // remove the last column value as it was shfited left.
      aaabyLobLocators[nActualRowCount] = aoActualValues;
  } // end for

  return aaabyLobLocators;
}

function fetchLobsAllLocatorsInOneQuery (cur: TeradataCursor, aaoExpectedValues: any[]): any[] {

  const aaoActualValues: any[] = [];

  // Obtain all the lob locator values returned from the select stmt and
  // use them to retrieve all their associated values in a single statement
  const aaabyLobLocators: any[] = getLobLocators (cur, aaoExpectedValues);

  // Combine all the escape clauses for each parameter by specifying the
  // parameter index and the associated lob locator data type ex. JSON AS LOCATOR.
  let sEscapeClauses: string = '';
  let v: number = 0;
  for (v = 0; v < aaoExpectedValues[0].length; v++) {
    sEscapeClauses += '{fn teradata_parameter(' + (v + 1).toString() + ', ' +  aaoExpectedValues[0][v]._sDataType + ')}';
  }

  try {
    const curLobLoc: TeradataCursor = cur.connection.cursor();
    curLobLoc.execute(sEscapeClauses + 'select ?,?,?,?,?,?,?,?,?,?', aaabyLobLocators); // select blob w/ the locator value

    let aoExpectedValues: any[] = [];
    let i: number = 0;
    for (i = 0; i < aaoExpectedValues.length; i++) {
        const aoActualValues: any[] = curLobLoc.fetchone();

        aoExpectedValues = aaoExpectedValues[i];

        let iCol: number = 0;
        for (iCol = 0; iCol < aaoExpectedValues[i].length; iCol++) {
            aoExpectedValues[iCol] = aoExpectedValues[iCol]._oLobvalue;
        }
        aaoActualValues[i] = aoActualValues;

        if (!curLobLoc.nextset()) {
            break;
        }
    } // end for i = 0

    curLobLoc.close();
  } catch (error) {
    logger.errorLogMessage(error.message); // unexpected error
  } finally {
    return aaoActualValues;
  }
}

function fetchLobsOneLocatorPerQuery (cur: TeradataCursor, aaoExpectedValues: any[]): any[] {

  const aaoActualValues: any[] = [];

  let nActualRowCount: number = 0;
  let aoExpectedValues: any[] = [];
  let aoActualValues: any[] = [];

  while (true) { // while a row is not null
    aoActualValues = cur.fetchone();
    if (aoActualValues === null) {
      break;
    }
    aoExpectedValues = aaoExpectedValues [nActualRowCount];

    let i: number = 0;
    let bIsLob: boolean = null;

    for (i = 0; i < aoExpectedValues.length ; i++) {
      bIsLob = aoExpectedValues[i] instanceof LobValueFromLocator;
      if (bIsLob) {
        // Fetch a Lob value using the locator, one locator per query
        aoActualValues[i] = ReadLobValue (cur.connection, aoActualValues[i], aoExpectedValues[i]._sDataType);

        if (aoExpectedValues[i]._sDataType === 'XML AS LOCATOR') {
          aoActualValues[i] = aoActualValues[i].replace (/&lt;/g, '<').replace (/&gt;/g, '>').replace (/&quot;/g, '"');
        }
        aoExpectedValues[i] = aoExpectedValues[i]._oLobvalue;
      }
    } // end for
    aaoActualValues[nActualRowCount] = aoActualValues;
    nActualRowCount += 1;
  } // end while

  return aaoActualValues;
}

function getNewString(s: string, nLength: number): string {
  let str: string = '';
  let n: number;
  for (n = 0; n < nLength ; n++) {
    str += s;
  }
  return str;
}

function getNewBytes(b: number, nLength: number): Uint8Array {
  const aby: Uint8Array = new Uint8Array(nLength);
  let n: number;
  for (n = 0; n < nLength ; n++) {
          aby[n] = b;
  }
  return aby;
}

function getXmlString(iItem: number): string {
  if (iItem === 1) {
    return '<note> <to>Tove</to><from>Jani</from><heading>Reminder</heading><body>Do not forget</body></note>';
  }
  if (iItem === 2) {
    return '<book category="COOKING"><title lang="en">Everyday Italian' +
      '</title><author>Geo Little</author><year>2016</year><price>50.00</price></book>';
  } else {
    return '<characters><character><name>Ms. Coder</name><actor>Olivia Actora</actor>' +
      '</character><character><name>Mr. Coder</name><actor>Joe Jones</actor></character></characters>';
  }
}

function getJsonString (iItem: number): string {
    if (iItem === 1) {
      return '{"name" : "Cameron"}';
    }
    if (iItem === 2) {
      return '{"address" : "123 Maple St. MyCity, MA 12075"}';
    } else {
      return '{"book" : "Where It All Started In the Beginning of Time and Where the Red Planets Evolved"}';
    }
}
