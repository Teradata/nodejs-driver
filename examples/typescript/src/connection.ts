import { TeradataConnection, ITDConnParams } from 'teradata-nodejsdriver';

export const connParams: ITDConnParams = {
  host: '<host>',
  log: '0',
  password: '<password>',
  user: '<username>',
};

export class ExampleConnection {

  private teradataConnection: TeradataConnection;

  constructor() {
    try {
      this.teradataConnection = new TeradataConnection();
    } catch (error) {
      console.log(error);
    }
  }

  /*
  * Connect to the Teradata Database
  */
  public connect(): void {
    this.teradataConnection.connect(connParams);
    console.log('Connect Success');
  }

  /*
  * Disconnect from the Teradata Database
  */
  public close(): void {
    this.teradataConnection.close();
    console.log('Close Success');
  }
}

let exampleConnection: ExampleConnection = new ExampleConnection();
exampleConnection.connect();
exampleConnection.close();
