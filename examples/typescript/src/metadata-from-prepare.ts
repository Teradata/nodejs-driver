/*
* This sample program demonstrates how to use the teradata_rpo(S) and teradata_fake_result_sets
* escape functions to prepare a SQL request without executing it and obtain SQL statement metadata.
* This sample program assumes that StatementInfo parcel support is available from the Teradata Database.
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

export class ExampleMetadataFromPrepare {

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
    this.cursor.execute('{fn teradata_rpo(S)}{fn teradata_fake_result_sets}select * from dbc.dbcinfo where infokey=?');
    const row: any[] = this.cursor.fetchone();
    const metadata: any[] = this.cursor.description;
    console.log('SQL statement metadata from prepare operation:');
    console.log('');
    let i: number = 0;
    metadata.forEach((data: any[]) => {
      console.log('Column [%d] %s: %s', i, data[0], row[i]);
      i++;
    });
    console.log('');
    console.log('Result set column metadata pretty-printed JSON:');
    const columnMetadata: any = JSON.parse(row[7]);
    console.log(JSON.stringify(columnMetadata, null, 4));
    console.log('');
    console.log('Parameter marker metadata as pretty-printed JSON:');
    const parameterMetadata: any = JSON.parse(row[8]);
    console.log(JSON.stringify(parameterMetadata, null, 4));
  }
}

let exampleMetadataFromPrepare: ExampleMetadataFromPrepare = new ExampleMetadataFromPrepare();
exampleMetadataFromPrepare.setupAndRun();
