/*
* This sample program demonstrates how to create and call a SELECT statement
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

/*
* Fetches all data from tables
*/
function doFetchAll(cursor) {
  const sQuery = 'SELECT * FROM T1 ORDER BY 1';

  try {
    cursor.execute(sQuery);
    var fetchedRows = cursor.fetchall();
    console.log("Fetched Rows Count: " + fetchedRows.length);
  } catch (error) {
    if (!anIgnoreError(error)) {
      throw error;
    }
  }
}

/*
* Creates temporary table and inserts data
*/
function createData(cursor) {
  try {
    const cQuery = 'CREATE TABLE T1 (C1 INT, C2 CHAR(5), C3 INT, C4 FLOAT, C5 DECIMAL(38,1), ' +
      'C6 NUMBER, C7 VARBYTE(5), C8 BYTE(5), C9 DATE, C10 BIGINT, C11 BYTEINT, C12 SMALLINT)';
    const iQuery = 'INSERT T1 values (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)';
    const c7Value = new Uint8Array([65, 66, 67]);
    const c8Value = new Uint8Array([76, 77, 78, 0, 0]); // exported length of byte(5) is 5
    var undef;
    const values = [1, 'XYZ', null, -0.1, -0.1, -0.1, c7Value, c8Value, new Date('2017-12-25'), '9007199254740995', 5, undef];

    cursor.execute(cQuery);
    cursor.execute(iQuery, values);
  } catch (error) {
    if (!anIgnoreError(error)) {
      throw error;
    }
  }
}

/*
* Drops temporary table
*/
function dropTable(cursor) {
  try {
    const dQuery = 'DROP TABLE T1';
    cursor.execute(dQuery);
    cursor.close();
  } catch (error) {
    if (!anIgnoreError(error)) {
      throw error;
    }
  }
}

/*
* Check if the error can be ignored
*/
function anIgnoreError (error) {
  var ignoreErrorCodes = [
    3526, // The specified index does not exist.
    3802, // Database '%VSTR' does not exist.
    3807, // Object '%VSTR' does not exist.
    3824, // Macro '%VSTR' does not exist.
    3913, // The specified check does not exist.
    4322, // Schema %VSTR does not exist # DR176193
    5322, // The specified constraint name '%VSTR' does not exist.
    5495, // Stored Procedure "%VSTR" does not exist.
    5589, // Function "%VSTR" does not exist.
    5620, // Role '%VSTR' does not exist.
    5623, // User or role '%VSTR' does not exist.
    5653, // Profile '%VSTR' does not exist.
    5901, // Replication Group '%VSTR' does not exist.
    6808, // Ordering is not defined for UDT '%TVMID'.
    6831, // UDT "%VSTR" does not exist.
    6834, // Method "%VSTR" does not exist.
    6849, // The UDT (%VSTR) does not have Transform, or does not have the specified Transform Group.
    6863, // Cast with specified source and target does not exist
    6934, // External Stored Procedure "%VSTR" does not exist.
    6938, // Authorization "%VSTR" does not exist.
    7972, // JAVA Stored Procedure "%VSTR" does not exist.
    9213, // Connect Through privilege for %VSTR not found
    9403, // Specified constraint name "%VSTR" does not exist
  ];

  if (error instanceof TeradataExceptions.OperationalError) {
    if (ignoreErrorCodes.includes(getErrorCode(error.message))) {
      return true;
    } else {
      return false;
    }
  } else {
    return false;
  }
}

/*
* Extract error code from the Teradata Operation Exception error message
*/
function getErrorCode(msg) {
  var regex = /\[Error (\d+)\]/;
  var found = msg.match(regex);
  var errorCode = '';
  if (found && found.length > 0) {
    errorCode = found[1];
  }
  return parseInt(errorCode, 10);
}

/*
* Sets up the Data and Runs the fetchAll
*/
function setupAndRun() {
  try {
    var teradataConnection = new TeradataConnection.TeradataConnection();
    var cursor = teradataConnection.cursor();
    teradataConnection.connect(connParams);

    dropTable(cursor)
    createData(cursor);
    doFetchAll(cursor);
    dropTable(cursor);

    teradataConnection.close();
  } catch (error) {
    if (!anIgnoreError(error)) {
      throw error;
    }
  }
}

setupAndRun();
