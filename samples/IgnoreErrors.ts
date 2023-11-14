// Copyright 2023 by Teradata Corporation. All rights reserved.

// This sample program demonstrates how to ignore errors.

// @ts-ignore
import { TeradataConnection, TeradataCursor, OperationalError } from "teradatasql";

const con: TeradataConnection = new TeradataConnection();

con.connect({ host: "whomooz", user: "guest", password: "please" });

const cur: TeradataCursor = con.cursor();

console.log("Demonstrating how to ignore caught exceptions:");

console.log("drop user NonExistentUser");
try {
    cur.execute("drop user NonExistentUser");
} catch (ex) {
    if (ex instanceof OperationalError && ex.message.includes("[Error 3802]")) {
        console.log("Ignoring", ex.message.split("\n")[0]);
    } else {
        throw ex;
    }
}

console.log("drop view NonExistentView");
try {
    cur.execute("drop view NonExistentView");
} catch (ex) {
    if (ex instanceof OperationalError && ex.message.includes("[Error 3807]")) {
        console.log("Ignoring", ex.message.split("\n")[0]);
    } else {
        throw ex;
    }
}

console.log("drop macro NonExistentMacro");
try {
    cur.execute("drop macro NonExistentMacro");
} catch (ex) {
    if (ex instanceof OperationalError && ex.message.includes("[Error 3824]")) {
        console.log("Ignoring", ex.message.split("\n")[0]);
    } else {
        throw ex;
    }
}

console.log("drop table NonExistentTable");
try {
    cur.execute("drop table NonExistentTable");
} catch (ex) {
    if (ex instanceof OperationalError && ex.message.includes("[Error 3807]")) {
        console.log("Ignoring", ex.message.split("\n")[0]);
    } else {
        throw ex;
    }
}

console.log("drop database NonExistentDbase");
try {
    cur.execute("drop database NonExistentDbase");
} catch (ex) {
    if (ex instanceof OperationalError && ex.message.includes("[Error 3802]")) {
        console.log("Ignoring", ex.message.split("\n")[0]);
    } else {
        throw ex;
    }
}

console.log("drop procedure NonExistentProc");
try {
    cur.execute("drop procedure NonExistentProc");
} catch (ex) {
    if (ex instanceof OperationalError && ex.message.includes("[Error 5495]")) {
        console.log("Ignoring", ex.message.split("\n")[0]);
    } else {
        throw ex;
    }
}

console.log();
console.log("Demonstrating how to ignore a single error:");
console.log("drop table NonExistentTable");
cur.execute("drop table NonExistentTable", undefined, /* ignoreErrors */ 3807);

console.log();
console.log("Demonstrating how to ignore several different errors:");

const nonExistenceErrors: number[] = [
    3526, // The specified index does not exist.
    3802, // Database '%VSTR' does not exist.
    3807, // Object '%VSTR' does not exist.
    3824, // Macro '%VSTR' does not exist.
    3913, // The specified check does not exist.
    4322, // Schema %VSTR does not exist // DR176193
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

console.log("drop user NonExistentUser");
cur.execute("drop user NonExistentUser", undefined, nonExistenceErrors);
console.log("drop view NonExistentView");
cur.execute("drop view NonExistentView", undefined, nonExistenceErrors);
console.log("drop macro NonExistentMacro");
cur.execute("drop macro NonExistentMacro", undefined, nonExistenceErrors);
console.log("drop table NonExistentTable");
cur.execute("drop table NonExistentTable", undefined, nonExistenceErrors);
console.log("drop database NonExistentDbase");
cur.execute("drop database NonExistentDbase", undefined, nonExistenceErrors);
console.log("drop procedure NonExistentProc");
cur.execute("drop procedure NonExistentProc", undefined, nonExistenceErrors);

cur.close();
con.close();
