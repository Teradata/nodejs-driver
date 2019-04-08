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

describe('\n\n\nSelect SQL Tests', () => {
  before((done: any) => {
    try {
      logger.infoLogMessage('\n');
      try { // attempt to drop the target table
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
      cursor.execute(cQuery);
      const iQuery: string =
        'INSERT T1 values (1, \'XYZ\', , -0.1, -0.1, -0.1, \'414243\'xb, \'4C4D4E\'xb, \'2017-12-25\', \'9223372036854775807\', 127, -33)';
      cursor.execute(iQuery);
    } catch (error) {
      logger.errorLogMessage(error.message); // unexpected error
    } finally {
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
    const c7Value: Uint8Array = new Uint8Array([65, 66, 67]);
    const c8Value: Uint8Array = new Uint8Array([76, 77, 78, 0, 0]); // exported length of byte(5) is 5
    const expectedRow: any[] = [1, 'XYZ       ', null, -0.1, -0.1, -0.1, c7Value, c8Value, new Date('2017-12-25'), '9223372036854775807', 127, -33];

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
    const expectedRows: any[] = [expectedRow];
    let fetchedRows: any[];

    let bNextSet: boolean;
    try {
      try {
        cursor.execute(sQuery);
        fetchedRows = cursor.fetchall();
      } catch (error) {
        logger.errorLogMessage(error.message); // unexpected error
      } finally {
        expect(fetchedRows).to.deep.equal(expectedRows);
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

  it('Executes "SELECT * FROM T1" with "fetchmany(2)" with 1 expected row against Teradata Database', (done: any) => {
    const sQuery: string = 'SELECT * FROM T1 ORDER BY 1';
    let fetchedRows: any[];
    const c7Value: Uint8Array = new Uint8Array([65, 66, 67]);
    const c8Value: Uint8Array = new Uint8Array([76, 77, 78, 0, 0]); // exported length of byte(5) is 5
    const expectedRows: any[] = [
      [1, 'XYZ       ', null, -0.1, -0.1, -0.1, c7Value, c8Value, new Date('2017-12-25'), '9223372036854775807', 127, -33],
    ];
    try {
      cursor.execute(sQuery);
      fetchedRows = cursor.fetchmany(2);
    } catch (error) {
      logger.errorLogMessage(error.message); // unexpected error
    } finally {
      expect(fetchedRows).to.deep.equal(expectedRows);
      done();
    }
  });

  it('Executes "SELECT * FROM T1" with "fetchmany(2)" with 2 expected rows against Teradata Database', (done: any) => {
    const iQuery: string =
      'INSERT T1 values (2, \'ABC\', -2147483648, -0.1, -0.1, -0.1, \'414243\'xb, \'4C4D4E\'xb, ' +
      '\'2017-12-25\', \'-9223372036854775808\', -128, 32767)';
    const sQuery: string = 'SELECT * FROM T1 ORDER BY 1';
    let fetchedRows: any[];
    const c7Value: Uint8Array = new Uint8Array([65, 66, 67]);
    const c8Value: Uint8Array = new Uint8Array([76, 77, 78, 0, 0]); // exported length of byte(5) is 5
    const expectedRows: any[] = [
      [1, 'XYZ       ', null, -0.1, -0.1, -0.1, c7Value, c8Value, new Date('2017-12-25'), '9223372036854775807', 127, -33],
      [2, 'ABC       ', -2147483648, -0.1, -0.1, -0.1, c7Value, c8Value, new Date('2017-12-25'), '-9223372036854775808', -128, 32767],
    ];
    try {
      cursor.execute(iQuery);
      cursor.execute(sQuery);
      fetchedRows = cursor.fetchmany(2);
    } catch (error) {
      logger.errorLogMessage(error.message); // unexpected error
    } finally {
      expect(fetchedRows).to.deep.equal(expectedRows);
      done();
    }
  });

  it('Executes "SELECT * FROM T1" with "fetchmany(4) with 2 expected rows against Teradata Database', (done: any) => {
    const sQuery: string = 'SELECT * FROM T1 ORDER BY 1';
    const c7Value: Uint8Array = new Uint8Array([65, 66, 67]);
    const c8Value: Uint8Array = new Uint8Array([76, 77, 78, 0, 0]); // exported length of byte(5) is 5
    const expectedRows: any[] = [
      [1, 'XYZ       ', null, -0.1, -0.1, -0.1, c7Value, c8Value, new Date('2017-12-25'), '9223372036854775807', 127, -33],
      [2, 'ABC       ', -2147483648, -0.1, -0.1, -0.1, c7Value, c8Value, new Date('2017-12-25'), '-9223372036854775808', -128, 32767],
    ];
    let fetchedRows: any[];
    try {
      cursor.execute(sQuery);
      fetchedRows = cursor.fetchmany(4);
    } catch (error) {
      logger.errorLogMessage(error.message); // unexpected error
    } finally {
      expect(fetchedRows).to.deep.equal(expectedRows);
      done();
    }
  });

  it('Executes "SELECT * FROM T1" with "fetchmany()" with 3 possible but 2 expected rows against Teradata Database', (done: any) => {
    const iQuery: string =
      'INSERT T1 values (3, \'DEF\', , -0.1, -0.1, -0.1, \'414243\'xb, \'4C4D4E\'xb, \'2017-12-25\', \'9223372036854775807\', 0, 0)';
    const sQuery: string = 'SELECT * FROM T1 ORDER BY 1';
    const c7Value: Uint8Array = new Uint8Array([65, 66, 67]);
    const c8Value: Uint8Array = new Uint8Array([76, 77, 78, 0, 0]); // exported length of byte(5) is 5
    const expectedRows: any[] = [
      [1, 'XYZ       ', null, -0.1, -0.1, -0.1, c7Value, c8Value, new Date('2017-12-25'), '9223372036854775807', 127, -33],
      [2, 'ABC       ', -2147483648, -0.1, -0.1, -0.1, c7Value, c8Value, new Date('2017-12-25'), '-9223372036854775808', -128, 32767],
    ];
    let fetchedRows: any[];
    try {
      cursor.execute(iQuery);
      cursor.execute(sQuery);
      fetchedRows = cursor.fetchmany(2);
    } catch (error) {
      logger.errorLogMessage(error.message); // unexpected error
    } finally {
      expect(fetchedRows).to.deep.equal(expectedRows);
      done();
    }
  });
});
