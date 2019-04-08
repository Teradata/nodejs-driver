/*
* This sample program demonstrates how to obtain the version number for the
* Teradata Database.
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

export class ExampleDriverDatabaseVersion {

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
    this.cursor.execute('{fn teradata_nativesql}Database version {fn teradata_database_version}');
    const rows: any[] = this.cursor.fetchall();
    console.log(rows);
  }
}

let exampleDriverDatabaseVersion: ExampleDriverDatabaseVersion = new ExampleDriverDatabaseVersion();
exampleDriverDatabaseVersion.setupAndRun();
