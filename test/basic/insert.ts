import 'mocha';
import { expect } from 'chai';
import { TeradataConnection } from '../../src/teradata-connection';
import { TeradataCursor } from '../../src/teradata-cursor';
import { TeradataLogging } from '../../src/teradata-logging';
import { OperationalError } from '../../src/teradata-exceptions';
import { connParams } from '../configurations';

let teradataConnection: TeradataConnection;
let cursor: TeradataCursor;

const logger: TeradataLogging = new TeradataLogging();

describe('\n\n\Insert SQL Tests', () => {
  before((done: any) => {
    let errorMsg: string;
    try {
      try { // attempt to drop the target table
        logger.infoLogMessage('\n');
        teradataConnection = new TeradataConnection();
        teradataConnection.connect(connParams);
        cursor = teradataConnection.cursor();
        const dQuery: string = 'DROP TABLE T1';
        cursor.execute(dQuery);
      } catch (error) {
        if ((error instanceof OperationalError) &&
            (error.message.indexOf('Object \'T1\' does not exist') > 0)) {
          // ignorble error
        } else {
          logger.errorLogMessage(error.message); // unexpected error
        }
      }

      const cQuery: string = 'CREATE TABLE T1 (C1 INT, C2 CHAR(5), C3 INT, C4 FLOAT, C5 DECIMAL(38,1), ' +
      'C6 NUMBER, C7 VARBYTE(5), C8 BYTE(5), C9 DATE, C10 BIGINT, C11 BYTEINT, C12 SMALLINT)';
      const iQuery: string = 'INSERT T1 values (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)';
      const c7Value: Uint8Array = new Uint8Array([65, 66, 67]);
      const c8Value: Uint8Array = new Uint8Array([76, 77, 78, 0, 0]); // exported length of byte(5) is 5
      let undef: any;
      const sym: Symbol = Symbol();
      const values: any[] = [1, 'XYZ', null, -0.1, -0.1, -0.1, c7Value, c8Value, new Date('2017-12-25'), '9007199254740995', 5, undef];
      const badValues: any[] = [2, sym, null, -0.1, -0.1, -0.1, c7Value, c8Value, new Date('2017-12-25'), '9007199254740995', 5, undef];
      cursor.execute(cQuery);
      cursor.execute(iQuery, values);
      try {  // attempt to insert a bad row - error expected
        cursor.execute(iQuery, badValues);
      } catch (error) {
        errorMsg = error.message;
      }
    } catch (error) {
      logger.errorLogMessage(error.message); // unexpected error
    } finally {
      expect(errorMsg).equals('Unexpected data type for IMPORT.');
      done();
    }
  });

  after((done: any) => {
    try {
      const dQuery: string = 'DROP TABLE T1';
      cursor.execute(dQuery);
      cursor.close();
      teradataConnection.close();
    } catch (error) {
      logger.errorLogMessage(error.message); // unexpected error
    } finally {
      done();
    }
  });

  it('Executes "SELECT * FROM T1" against Teradata Database', (done: any) => {

    const expectedMetadataDesc: any[] =
      [ [ 'C1', 'number', null, '4', null, null, true ],
        [ 'C2', 'string', null, '10', null, null, true ],
        [ 'C3', 'number', null, '4', null, null, true ],
        [ 'C4', 'number', null, '8', null, null, true ],
        [ 'C5', 'number', null, '16', '38', '1', true ],
        [ 'C6', 'number', null, '18', '40', '0', true ],
        [ 'C7', 'Uint8Array', null, '5', null, null, true ],
        [ 'C8', 'Uint8Array', null, '5', null, null, true ],
        [ 'C9', 'Date', null, '4', null, null, true ],
        [ 'C10', 'number', null, '8', null, null, true ],
        [ 'C11', 'number', null, '1', null, null, true ],
        [ 'C12', 'number', null, '2', null, null, true ] ];

    const sQuery: string = 'SELECT * FROM T1 ORDER BY 1';
    const c7Value: Uint8Array = new Uint8Array([65, 66, 67]);
    const c8Value: Uint8Array = new Uint8Array([76, 77, 78, 0, 0]); // exported length of byte(5) is 5
    const expectedRow: any[] = [1, 'XYZ       ', null, -0.1, -0.1, -0.1,
                                c7Value, c8Value, new Date('2017-12-25'), '9007199254740995', 5, null];
    let bNextSet: boolean;
    try {
      let fetchedRow: any[];
      try {
        cursor.execute(sQuery);
        fetchedRow = cursor.fetchone();
      } catch (error) {
        logger.errorLogMessage(error.message); // unexpected error
      } finally {
        expect(fetchedRow).to.deep.equal(expectedRow);
        expect(cursor.description).to.deep.equal(expectedMetadataDesc);
      }
      bNextSet = cursor.nextset(); // nextset()) resets cursor.descripton hence cursor.description is checked above
    } catch (error) {
      logger.errorLogMessage(error.message); // unexpected error
    } finally {
      expect(bNextSet).equals(false);
      done();
    }
  });
});
