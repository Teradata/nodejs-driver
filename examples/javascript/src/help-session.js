/*
* This sample program demonstrates how to obtain and display session information.
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
        var cursor_1 = teradataConnection.cursor();
        cursor_1.execute('help session');
        var row = cursor_1.fetchone();
        var i_1 = 0;
        row.forEach(function (field) {
            console.log('%s: %s', cursor_1.description[i_1][0], field);
            i_1++;
        });
        cursor_1.close();
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