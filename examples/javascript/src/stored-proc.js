/*
* This sample program demonstrates how to create and call a SQL stored procedure
* with a variety of parameters and dynamic result sets.
*/
"use strict";
var TeradataConnection = require("teradata-nodejsdriver/teradata-connection");
var TeradataExceptions = require("teradata-nodejsdriver/teradata-exceptions");
var connParams = {
    host: '<host>',
    log: '0',
    password: '<password>',
    user: '<username>'
};
function displayResults(cur) {
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
function cursorExecute(cur, sSql, params) {
    if (params === void 0) { params = null; }
    console.log('');
    console.log('cursor.execute: %s', sSql);
    console.log('bound values:');
    console.log(params);
    cur.execute(sSql, params);
    displayResults(cur);
}
function cursorCallproc(cur, sProcName, params) {
    if (params === void 0) { params = null; }
    console.log('');
    console.log('cursor.callproc: %s', sProcName);
    console.log('bound values:');
    console.log(params);
    cur.callproc(sProcName, params); // OUT parameters are not supported by .callproc
    displayResults(cur);
}
function setupAndRun() {
    try {
        var teradataConnection = new TeradataConnection.TeradataConnection();
        teradataConnection.connect(connParams);
        var cursor = teradataConnection.cursor();
        // Demonstrate a stored procedure having IN and INOUT parameters.
        // Returns one result set having one row and one column containing the output parameter value.
        cursor.execute('replace procedure examplestoredproc (in p1 integer, inout p2 integer) begin set p2 = p1 + p2 ; end ;');
        cursorExecute(cursor, '{call examplestoredproc (3, 5)}'); // literal parameter values
        cursorExecute(cursor, '{call examplestoredproc (?, ?)}', [10, 7]); // bound parameter values
        cursorCallproc(cursor, 'examplestoredproc', [20, 4]); // bound parameter values
        // Demonstrate a stored procedure having one OUT parameter.
        // Returns one result set having one row and one column containing the output parameter value.
        // Only demonstrate .execute because OUT parameters are not supported by .callproc
        // OUT parameters must be unbound.
        cursor.execute('replace procedure examplestoredproc (out p1 varchar(100)) begin set p1 = \'foobar\' ; end ;');
        cursorExecute(cursor, '{call examplestoredproc (?)}');
        // Demonstrate a stored procedure having no parameters that returns one dynamic result set.
        // Returns two result sets.
        // The first result set is empty having no rows or columns, because there are no output parameter values.
        // The second result set is the dynamic result set returned by the stored procedure.
        cursor.execute("replace procedure examplestoredproc ()\n      dynamic result sets 1\n      begin\n          declare cur1 cursor with return for select * from dbc.dbcinfo order by 1 ;\n          open cur1 ;\n      end ;");
        cursorExecute(cursor, '{call examplestoredproc}');
        cursorCallproc(cursor, 'examplestoredproc');
        // Demonstrate a stored procedure having IN and INOUT parameters that returns two dynamic result sets.
        // Returns three result sets.
        // The first result set has one row and one column containing the output parameter values.
        // The second and third result sets are dynamic result sets returned by the stored procedure.
        cursor.execute("replace procedure examplestoredproc (in p1 integer, inout p2 integer, inout p3 integer)\n      dynamic result sets 2\n      begin\n          declare cur1 cursor with return for select * from dbc.dbcinfo order by 1 ;\n          declare cur2 cursor with return for select infodata, infokey from dbc.dbcinfo order by 1 ;\n          open cur1 ;\n          open cur2 ;\n          set p2 = p1 + p2 ;\n          set p3 = p1 * p3 ;\n      end ;");
        cursorExecute(cursor, '{call examplestoredproc (2, 1, 3)}'); // literal parameter values
        cursorExecute(cursor, '{call examplestoredproc (?, ?, ?)}', [3, 2, 4]); // bound IN and INOUT parameter values
        cursorCallproc(cursor, 'examplestoredproc', [10, 3, 2]); // bound IN and INOUT parameter values
        // Demonstrate a stored procedure having IN, INOUT, and OUT parameters that returns two dynamic result sets.
        // Returns three result sets.
        // The first result set has one row and two columns containing the output values from the INOUT and OUT parameters.
        // The second and third result sets are dynamic result sets returned by the stored procedure.
        // Only demonstrate .execute because OUT parameters are not supported by .callproc
        // OUT parameters must be unbound.
        cursor.execute("replace procedure examplestoredproc (in p1 integer, inout p2 integer, out p3 varchar(100))\n      dynamic result sets 2\n      begin\n          declare cur1 cursor with return for select * from dbc.dbcinfo order by 1 desc ;\n          declare cur2 cursor with return for select infodata, infokey from dbc.dbcinfo order by 1 ;\n          open cur1 ;\n          open cur2 ;\n          set p2 = p1 + p2 ;\n          set p3 = 'hello' ;\n      end ;");
        cursorExecute(cursor, '{call examplestoredproc (10, 5, ?)}'); // literal parameter values
        cursorExecute(cursor, '{call examplestoredproc (?, ?, ?)}', [20, 7]); // bound IN and INOUT parameter values
        cursor.execute('drop procedure examplestoredproc');
        cursor.close();
        teradataConnection.close();
    }
    catch (error) {
        if (error instanceof TeradataExceptions.OperationalError) {
            /* A database operational error */
            console.log(error.message);
        }
        else {
            console.log(error);
        }
    }
}
setupAndRun();