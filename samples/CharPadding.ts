// Copyright 2023 by Teradata Corporation. All rights reserved.

// This sample program demonstrates how to work with the Teradata Database's Character Export Width behavior.

// The Teradata SQL Driver for Node.js always uses the UTF8 session character set, and the charset connection
// parameter is not supported. Be aware of the Teradata Database's Character Export Width behavior that adds trailing
// space padding to fixed-width CHAR data type result set column values when using the UTF8 session character set.

// Work around this drawback by using CAST or TRIM in SQL SELECT statements, or in views, to convert fixed-width CHAR
// data types to VARCHAR.

// @ts-ignore
import { TeradataConnection, TeradataCursor } from "teradatasql";

const con: TeradataConnection = new TeradataConnection();

con.connect({ host: "whomooz", user: "guest", password: "please" });

const cur: TeradataCursor = con.cursor();

cur.execute("CREATE TABLE MyTable (c1 CHAR(10), c2 CHAR(10))");

try {
    cur.execute("INSERT INTO MyTable VALUES ('a', 'b')");

    console.log("Original query that produces trailing space padding:");
    cur.execute("SELECT c1, c2 FROM MyTable");
    console.log(cur.fetchall());

    console.log("Modified query with either CAST or TRIM to avoid trailing space padding:");
    cur.execute("SELECT CAST(c1 AS VARCHAR(10)), TRIM(TRAILING FROM c2) FROM MyTable");
    console.log(cur.fetchall());

    cur.execute("CREATE VIEW MyView (c1, c2) AS SELECT CAST(c1 AS VARCHAR(10)), TRIM(TRAILING FROM c2) FROM MyTable");
    try {
        console.log("Or query view with CAST or TRIM to avoid trailing space padding:");
        cur.execute("SELECT c1, c2 FROM MyView");
        console.log(cur.fetchall());
    } finally {
        cur.execute("DROP VIEW MyView");
    }
} finally {
    cur.execute("DROP TABLE MyTable");
}

cur.close();
con.close();
