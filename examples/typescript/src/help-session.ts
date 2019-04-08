/*
* This sample program demonstrates how to obtain and display session information.
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

export class ExampleHelpSession {

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
    this.cursor.execute('help session');
    const row: any[] = this.cursor.fetchone();
    let i: number = 0;
    row.forEach((field: string) => {
      console.log('%s: %s', this.cursor.description[i][0], field);
      i++;
    });
  }
}

let exampleHelpSession: ExampleHelpSession = new ExampleHelpSession();
exampleHelpSession.setupAndRun();
