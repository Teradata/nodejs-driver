/*
* This sample program demonstrates how to create and call a SELECT statement
*/
import { TeradataConnection, ITDConnParams } from 'teradata-nodejs-driver/teradata-connection';
import { TeradataCursor } from 'teradata-nodejs-driver/teradata-cursor';
import { OperationalError } from 'teradata-nodejs-driver/teradata-exceptions';

export const connParams: ITDConnParams = {
  host: '<host>',
  log: '0',
  password: '<password>',
  user: '<username>',
};

export class ExampleFetchall {

  private teradataConnection: TeradataConnection;
  private cursor: TeradataCursor;

  constructor() {
    try {
      this.teradataConnection = new TeradataConnection();
    } catch (error) {
      if (!this.anIgnoreError(error)) {
        throw error;
      }
    }
  }

  /*
  * Sets up the Data and Runs the fetchAll
  */
  public setupAndRun(): void {
    this.teradataConnection.connect(connParams);
    this.cursor = this.teradataConnection.cursor();

    this.dropTable();
    this.createData();
    this.doFetchAll();
    this.dropTable();

    this.teradataConnection.close();
  }

  /*
  * Fetches all data from tables
  */
  private doFetchAll(): void {
    const sQuery: string = 'SELECT * FROM T1 ORDER BY 1';

    try {
      this.cursor.execute(sQuery);
      let fetchedRows: any[] = this.cursor.fetchall();
      console.log('Fetched Rows Count: ' + fetchedRows.length);
    } catch (error) {
      if (!this.anIgnoreError(error)) {
        throw error;
      }
    }
  }

  /*
  * Creates temporary table and inserts data
  */
  private createData(): void {
    try {
      const cQuery: string = 'CREATE TABLE T1 (C1 INT, C2 CHAR(5), C3 INT, C4 FLOAT, C5 DECIMAL(38,1), ' +
        'C6 NUMBER, C7 VARBYTE(5), C8 BYTE(5), C9 DATE, C10 BIGINT, C11 BYTEINT, C12 SMALLINT)';
      const iQuery: string = 'INSERT T1 values (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)';
      const c7Value: Uint8Array = new Uint8Array([65, 66, 67]);
      const c8Value: Uint8Array = new Uint8Array([76, 77, 78, 0, 0]); // exported length of byte(5) is 5
      let undef: any;
      const values: any[] = [1, 'XYZ', null, -0.1, -0.1, -0.1, c7Value, c8Value, new Date('2017-12-25'), '9007199254740995', 5, undef];

      this.cursor.execute(cQuery);
      this.cursor.execute(iQuery, values);
    } catch (error) {
      if (!this.anIgnoreError(error)) {
        throw error;
      }
    }
  }

  /*
  * Drops temporary table
  */
  private dropTable(): void {
    try {
      const dQuery: string = 'DROP TABLE T1';
      this.cursor.execute(dQuery);
      this.cursor.close();
    } catch (error) {
      if (!this.anIgnoreError(error)) {
        throw error;
      }
    }
  }

  /*
  * Check if the error can be ignored
  */
  private anIgnoreError (error: Error): boolean {
    const ignoreErrorCodes: number [] = [
      3526, // The specified index does not exist.
      3802, // Database '%VSTR' does not exist.
      3807, // Object '%VSTR' does not exist.
      3824, // Macro '%VSTR' does not exist.
      3913, // The specified check does not exist.
      4322, // Schema %VSTR does not exist # DR176193
      5322, // The specified constraint name '%VSTR' does not exist.
      5495, // Stored Procedure "%VSTR" does not exist.
      5589, // Function "%VSTR" does not exist.
      5620, // Role '%VSTR' does not exist.
      5623, // User or role '%VSTR' does not exist.
      5653, // Profile '%VSTR' does not exist.
      5901, // Replication Group '%VSTR' does not exist.
      6808, // Ordering is not defined for UDT '%TVMID'.
      6831, // UDT "%VSTR" does not exist.
      6834, // Method "%VSTR" does not exist.
      6849, // The UDT (%VSTR) does not have Transform, or does not have the specified Transform Group.
      6863, // Cast with specified source and target does not exist
      6934, // External Stored Procedure "%VSTR" does not exist.
      6938, // Authorization "%VSTR" does not exist.
      7972, // JAVA Stored Procedure "%VSTR" does not exist.
      9213, // Connect Through privilege for %VSTR not found
      9403, // Specified constraint name "%VSTR" does not exist
    ];

    if (error instanceof OperationalError) {
      if (ignoreErrorCodes.indexOf(this.getErrorCode(error.message)) > -1) {
        return true;
      } else {
        return false;
      }
    } else {
      return false;
    }
  }

  /*
  * Extract error code from the Teradata Operation Exception error message
  */
  private getErrorCode(msg: string): number {
    const regex: RegExp = /\[Error (\d+)\]/;
    let found: RegExpMatchArray = msg.match(regex);
    let errorCode: string = '';
    if (found && found.length > 0) {
      errorCode = found[1];
    }
    return parseInt(errorCode, 10);
  }
}

let exampleFetchall: ExampleFetchall = new ExampleFetchall();
exampleFetchall.setupAndRun();
