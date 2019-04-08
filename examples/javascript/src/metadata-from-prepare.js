/*
* This sample program demonstrates how to use the teradata_rpo(S) and teradata_fake_result_sets
* escape functions to prepare a SQL request without executing it and obtain SQL statement metadata.
* This sample program assumes that StatementInfo parcel support is available from the Teradata Database.
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
        cursor.execute('{fn teradata_rpo(S)}{fn teradata_fake_result_sets}select * from dbc.dbcinfo where infokey=?');
        var row_1 = cursor.fetchone();
        var metadata = cursor.description;
        cursor.close();
        teradataConnection.close();
        console.log('SQL statement metadata from prepare operation:');
        console.log('');
        var i_1 = 0;
        metadata.forEach(function (data) {
            console.log('Column [%d] %s: %s', i_1, data[0], row_1[i_1]);
            i_1++;
        });
        console.log('');
        console.log('Result set column metadata pretty-printed JSON:');
        var columnMetadata = JSON.parse(row_1[7]);
        console.log(JSON.stringify(columnMetadata, null, 4));
        console.log('');
        console.log('Parameter marker metadata as pretty-printed JSON:');
        var parameterMetadata = JSON.parse(row_1[8]);
        console.log(JSON.stringify(parameterMetadata, null, 4));
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