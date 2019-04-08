/*
* This sample program demonstrates how to use the Elicit File feature of the Teradata SQL Driver for Node.js
* to upload the C source file to the Teradata Database and create a User-Defined Function (UDF).
* This sample program requires the udfinc.c source file to be located in the current directory.
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
function setupAndRun() {
    try {
        var teradataConnection = new TeradataConnection.TeradataConnection();
        teradataConnection.connect(connParams);
        var cursor = teradataConnection.cursor();
        console.log('Create function');
        cursor.execute('create function myudfinc(integer) ' +
            'returns integer language c no sql parameter style sql external name \'CS!udfinc!src/udfinc.c!F!udfinc\'');
        console.log('Execute function');
        cursor.execute('select myudfinc(1)');
        console.log('Function returned: %s', cursor.fetchone()[0]);
        console.log('Drop function');
        cursor.execute('drop function myudfinc');
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