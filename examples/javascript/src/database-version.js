/*
* This sample program demonstrates how to obtain the version number for the
* Teradata Database.
*/
"use strict";
var TeradataConnection = require("teradata-nodejs-driver/teradata-connection");
var TeradataExceptions = require("teradata-nodejs-driver/teradata-exceptions");
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
        cursor.execute('{fn teradata_nativesql}Database version {fn teradata_database_version}');
        var rows = cursor.fetchall();
        console.log(rows);
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