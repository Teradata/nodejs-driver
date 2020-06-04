/*
* This sample program demonstrates how to create and call a SQL stored procedure
* with a variety of parameters and dynamic result sets.
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

export class ExampleStoredProc {

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

    // Demonstrate a stored procedure having IN and INOUT parameters.
    // Returns one result set having one row and one column containing the output parameter value.
    this.cursor.execute('replace procedure examplestoredproc (in p1 integer, inout p2 integer) begin set p2 = p1 + p2 ; end ;');

    this.cursorExecute(this.cursor, '{call examplestoredproc (3, 5)}'); // literal parameter values
    this.cursorExecute(this.cursor, '{call examplestoredproc (?, ?)}', [10, 7]); // bound parameter values
    this.cursorCallproc(this.cursor, 'examplestoredproc', [20, 4]); // bound parameter values

    // Demonstrate a stored procedure having one OUT parameter.
    // Returns one result set having one row and one column containing the output parameter value.
    // Only demonstrate .execute because OUT parameters are not supported by .callproc
    // OUT parameters must be unbound.

    this.cursor.execute ('replace procedure examplestoredproc (out p1 varchar(100)) begin set p1 = \'foobar\' ; end ;');
    this.cursorExecute (this.cursor, '{call examplestoredproc (?)}');

    // Demonstrate a stored procedure having no parameters that returns one dynamic result set.
    // Returns two result sets.
    // The first result set is empty having no rows or columns, because there are no output parameter values.
    // The second result set is the dynamic result set returned by the stored procedure.

    this.cursor.execute (`replace procedure examplestoredproc ()
        dynamic result sets 1
        begin
            declare cur1 cursor with return for select * from dbc.dbcinfo order by 1 ;
            open cur1 ;
        end ;`);
    this.cursorExecute (this.cursor, '{call examplestoredproc}');
    this.cursorCallproc (this.cursor, 'examplestoredproc');

    // Demonstrate a stored procedure having IN and INOUT parameters that returns two dynamic result sets.
    // Returns three result sets.
    // The first result set has one row and one column containing the output parameter values.
    // The second and third result sets are dynamic result sets returned by the stored procedure.

    this.cursor.execute (`replace procedure examplestoredproc (in p1 integer, inout p2 integer, inout p3 integer)
        dynamic result sets 2
        begin
            declare cur1 cursor with return for select * from dbc.dbcinfo order by 1 ;
            declare cur2 cursor with return for select infodata, infokey from dbc.dbcinfo order by 1 ;
            open cur1 ;
            open cur2 ;
            set p2 = p1 + p2 ;
            set p3 = p1 * p3 ;
        end ;`);
    this.cursorExecute (this.cursor, '{call examplestoredproc (2, 1, 3)}'); // literal parameter values
    this.cursorExecute (this.cursor, '{call examplestoredproc (?, ?, ?)}', [3, 2, 4]); // bound IN and INOUT parameter values
    this.cursorCallproc (this.cursor, 'examplestoredproc', [10, 3, 2]); // bound IN and INOUT parameter values

    // Demonstrate a stored procedure having IN, INOUT, and OUT parameters that returns two dynamic result sets.
    // Returns three result sets.
    // The first result set has one row and two columns containing the output values from the INOUT and OUT parameters.
    // The second and third result sets are dynamic result sets returned by the stored procedure.
    // Only demonstrate .execute because OUT parameters are not supported by .callproc
    // OUT parameters must be unbound.

    this.cursor.execute (`replace procedure examplestoredproc (in p1 integer, inout p2 integer, out p3 varchar(100))
        dynamic result sets 2
        begin
            declare cur1 cursor with return for select * from dbc.dbcinfo order by 1 desc ;
            declare cur2 cursor with return for select infodata, infokey from dbc.dbcinfo order by 1 ;
            open cur1 ;
            open cur2 ;
            set p2 = p1 + p2 ;
            set p3 = 'hello' ;
        end ;`);
    this.cursorExecute (this.cursor, '{call examplestoredproc (10, 5, ?)}'); // literal parameter values
    this.cursorExecute (this.cursor, '{call examplestoredproc (?, ?, ?)}', [20, 7]); // bound IN and INOUT parameter values

    this.cursor.execute ('drop procedure examplestoredproc');
  }

  private displayResults(cur: TeradataCursor): void {
    while (true) {
      console.log(' === metadata ===');
      console.log('  cursor.rowcount: %d', cur.rowcount);
      console.log('  cursor.description:');
      console.log(cur.description);

      console.log(' === result ===');
      console.log(cur.fetchall());

      if (!cur.nextset()) {
        break;
      }
    }
  }

  private cursorExecute(cur: TeradataCursor, sSql: string, params: any[] = null): void {
    console.log('');
    console.log('cursor.execute: %s', sSql);
    console.log('bound values:');
    console.log(params);
    cur.execute(sSql, params);
    this.displayResults(cur);
  }

  private cursorCallproc(cur: TeradataCursor, sProcName: string, params: any[] = null): void {
    console.log('');
    console.log('cursor.callproc: %s', sProcName);
    console.log('bound values:');
    console.log(params);
    cur.callproc(sProcName, params); // OUT parameters are not supported by .callproc
    this.displayResults(cur);
  }
}

let exampleStroedProc: ExampleStoredProc = new ExampleStoredProc();
exampleStroedProc.setupAndRun();
