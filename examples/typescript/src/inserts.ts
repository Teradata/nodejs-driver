/*
* This sample program demonstrates how to insert data values to the Teradata Database.
*/

import { TeradataConnection, ITDConnParams } from 'teradata-nodejsdriver/teradata-connection';
import { TeradataCursor } from 'teradata-nodejsdriver/teradata-cursor';
import { OperationalError } from 'teradata-nodejsdriver/teradata-exceptions';

export const connParams: ITDConnParams = {
  host: '<host>',
  log: '0',
  password: '<password>',
  user: '<username>',
};

const sCreateTable: string =
  `CREATE TABLE T1 (
    C1 INT,
    C2 CHAR(5),
    C3 VARCHAR(5),
    C4 FLOAT,
    C5 DECIMAL(38,1),
    C6 NUMBER,
    C7 BYTE(5),
    C8 VARBYTE(5),
    C9 DATE,
    C10 BYTEINT,
    C11 SMALLINT,
    c12 INT,
    C13 BIGINT)`;

const data: any[] = [
  [ /* C1  */  1,
    /* C2  */  'ABC',
    /* C3  */  'XYZ',
    /* C4  */  0.1,
    /* C5  */  -0.11,
    /* C6  */  1.11,
    /* C7  */  new Uint8Array([65, 66, 67]),
    /* C8  */  new Uint8Array([76, 77, 78]),
    /* C9  */  new Date('2017-12-25'),
    /* C10 */  127,
    /* C11 */  -32768,
    /* C12 */  null,
    /* C13 */  '-9223372036854775808'],
];

export class ExampleInserts {

  private teradataConnection: TeradataConnection;
  private cursor: TeradataCursor;

  constructor() {
    try {
      this.teradataConnection = new TeradataConnection();
    } catch (error) {
      console.log(error);
    }
  }

  public setupAndRun(): void {
    try {
      this.connect();
      this.setup();
      this.execute();
      this.cleanup();
      this.close();
    } catch (error) {
      if (error instanceof OperationalError) {
        /* A database operational error */
        console.log(error.message);
      } else {
        console.log(error);
      }
    }
  }

  private connect(): void {
    this.teradataConnection.connect(connParams);
    this.cursor = this.teradataConnection.cursor();
  }

  private close(): void {
    this.cursor.close();
    this.teradataConnection.close();
  }

  private setup(): void {
    try {
      this.cursor.execute('DROP TABLE T1');
    } catch (error) {
      if ((error instanceof OperationalError) &&
          (error.message.indexOf('Object \'T1\' does not exist') > 0)) {
        // ignorble error
      } else {
        console.log(error.message);
      }
    }
    this.cursor.execute(sCreateTable);
  }

  private cleanup(): void {
    this.cursor.execute('DROP TABLE T1');
  }

  private execute(): void {
    this.cursor.execute('insert into T1 (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)', data);
    this.cursor.execute('select * from T1 order by 1');
    const rows: any[] = this.cursor.fetchall();
    console.log(rows);
  }
}

let exampleInserts: ExampleInserts = new ExampleInserts();
exampleInserts.setupAndRun();
