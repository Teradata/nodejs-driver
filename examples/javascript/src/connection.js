/*
* This program demonstrates how to connect to Teradata database.
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
        console.log("Connect Success");
        teradataConnection.close();
        console.log("Close Success");
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