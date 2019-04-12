/*
* This sample program demonstrates how to use the Elicit File feature of the Teradata SQL Driver for Node.js
* to upload the C source file to the Teradata Database and create a User-Defined Function (UDF).
* This sample program requires the udfinc.c source file to be located in the current directory.
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

export class ExampleElicitFile {

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
      this.execute();
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

  private execute(): void {
    console.log('Create function');
    this.cursor.execute('create function myudfinc(integer) ' +
      'returns integer language c no sql parameter style sql external name \'CS!udfinc!src/udfinc.c!F!udfinc\'');

    console.log('Execute function');
    this.cursor.execute('select myudfinc(1)');

    console.log('Function returned: ' + this.cursor.fetchone()[0]);

    console.log('Drop function');
    this.cursor.execute('drop function myudfinc');
  }
}

let exampleElicitFile: ExampleElicitFile = new ExampleElicitFile();
exampleElicitFile.setupAndRun();
