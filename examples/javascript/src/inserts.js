/*
* This sample program demonstrates how to insert data values to the Teradata Database.
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
var sCreateTable =
  `CREATE TABLE T1 (
        C1 INT,
        C2 CHAR(5),
        C3 VARCHAR(5),
        C4 FLOAT,
        C5 DECIMAL(38,1),
        C6 NUMBER,
        C7 BYTE(5),
        C8 VARBYTE(5),
        C9 DATE,
        C10 BYTEINT,
        C11 SMALLINT,
        c12 INT,
        C13 BIGINT)`;
var data = [
    [   /* C1  */  1,
        /* C2  */  'ABC',
        /* C3  */  'XYZ',
        /* C4  */  0.1,
        /* C5  */  -0.11,
        /* C6  */  1.11,
        /* C7  */  new Uint8Array([65, 66, 67]),
        /* C8  */  new Uint8Array([76, 77, 78]),
        /* C9  */  new Date('2017-12-25'),
        /* C10 */  127,
        /* C11 */  -32768,
        /* C12 */  null,
        /* C13 */  '-9223372036854775808'],
];
function setupAndRun() {
    try {
        var teradataConnection = new TeradataConnection.TeradataConnection();
        teradataConnection.connect(connParams);
        var cursor = teradataConnection.cursor();
        cursor.execute(sCreateTable);
        cursor.execute('insert into T1 (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)', data);
        cursor.execute('select * from T1 order by 1');
        var rows = cursor.fetchall();
        console.log(rows);
        cursor.execute('DROP TABLE T1');
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