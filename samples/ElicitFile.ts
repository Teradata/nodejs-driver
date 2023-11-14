// Copyright 2023 by Teradata Corporation. All rights reserved.

// This sample program demonstrates how to use the Elicit File feature of the Teradata SQL Driver for Node.js
// to upload the C source file to the Teradata Database and create a User-Defined Function (UDF).
// This sample program requires the udfinc.c source file to be located in the current directory.

// @ts-ignore
import { TeradataConnection, TeradataCursor } from "teradatasql";

type Row = any[] | null;

const con: TeradataConnection = new TeradataConnection();

con.connect({ host: "whomooz", user: "guest", password: "please" });

const cur: TeradataCursor = con.cursor();

console.log("Create function");
cur.execute("create function myudfinc(integer) returns integer language c no sql parameter style sql external name 'CS!udfinc!udfinc.c!F!udfinc'");

console.log("Execute function");
cur.execute("select myudfinc(1)");

const row: Row = cur.fetchone();
if (row) {
    console.log("Function returned", row[0]);
}

console.log("Drop function");
cur.execute("drop function myudfinc");

cur.close();
con.close();
