import 'mocha';
import { expect } from 'chai';
import { TeradataConnection } from '../../src/teradata-connection';
import { TeradataCursor } from '../../src/teradata-cursor';
import { TeradataLogging } from '../../src/teradata-logging';
import { Utils } from '../../test/utils';
import { connParams } from '../configurations';

let teradataConnection: TeradataConnection;
let cursor: TeradataCursor;

const logger: TeradataLogging = new TeradataLogging();
const sTableName: string = 'volatiletable'; // volatile table doesn't need scope

describe('\n\n\Inline LOB and Locator LOB Tests', () => {
  before((done: any) => {
    try {
      logger.infoLogMessage('\n');
      teradataConnection = new TeradataConnection();
      teradataConnection.connect(connParams);
      cursor = teradataConnection.cursor();
      const cQuery: string = 'create volatile table ' + sTableName
        + ' (c1 integer, c2 blob, c3 clob) on commit preserve rows';
      cursor.execute(cQuery);
      const nonBindQuery: string = 'insert into ' +  sTableName + ' values ( 1,  \'515253\'xbv, \'clobber\')';
      cursor.execute(nonBindQuery);
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

  it('Select inline lob values and compare with expected values', (done: any) => {
    let fetchedRows: any[];
    let aaoExpectedValues: any[];
    const expectedBlobValue: Uint8Array = new Uint8Array([81, 82, 83]);
    const expectedClobValue: string = 'clobber';
    try {
      const sQuery: string = 'SELECT * FROM ' + sTableName + ' ORDER BY 1';
      cursor.execute(sQuery);
      fetchedRows = cursor.fetchone();
      aaoExpectedValues = [1, expectedBlobValue, expectedClobValue];
    } catch (error) {
      logger.errorLogMessage(error.message); // unexpected error
    } finally {
      expect(fetchedRows).to.deep.equal(aaoExpectedValues);
      done();
    }
  });

  it('Select lob locators, fetch lob values with locators, and compare with expected values', (done: any) => {
    let fetchBlobRows: any[];
    let fetchClobRows: any[];
    const aaoExpectedValues: any = [Utils.BLOBLOC(new Uint8Array([81, 82, 83])), Utils.CLOBLOC('clobber')];

    try {
      const sQuery: string = 'SELECT * FROM ' + sTableName + ' ORDER BY 1';
      const ssQuery: string = '{fn teradata_lobselect(S)}' + sQuery; // SELECT statement that returns lob locators
      cursor.execute(ssQuery);
      const fetchedRows: any[] = cursor.fetchone();
      const blobLocator: Uint8Array = fetchedRows[1]; // fetched blob locator
      const clobLocator: Uint8Array = fetchedRows[2]; // fetched clob locator
      const blobLocatorSelectQuery: string = '{fn teradata_parameter(1,' + aaoExpectedValues[0].DataType + ')}select ?';
      const clobLocatorSelectQuery: string = '{fn teradata_parameter(1,' + aaoExpectedValues[1].DataType + ')}select ?';
      const cursor2: TeradataCursor = teradataConnection.cursor(); // use a new cursor to fetch blob through its locator.
                                                                   // The previous cursor should remain open;
                                                                   // otherwise, the fetch would fail because the spool was closed.
      cursor2.execute(blobLocatorSelectQuery, [blobLocator]); // select blob w/ the locator value
      fetchBlobRows = cursor2.fetchall();
      cursor2.close();
      const cursor3: TeradataCursor = teradataConnection.cursor(); // use a new cursor to fetch clob through its locator.
      cursor3.execute(clobLocatorSelectQuery, [clobLocator]); // select clob w/ the locator value
      fetchClobRows = cursor3.fetchall();
      cursor3.close();
    } catch (error) {
      logger.errorLogMessage(error.message); // unexpected error
    } finally {
      expect(fetchBlobRows[0][0]).to.deep.equal(aaoExpectedValues[0].LobValue);
      expect(fetchClobRows[0][0]).to.deep.equal(aaoExpectedValues[1].LobValue);
      done();
    }
  });
});
