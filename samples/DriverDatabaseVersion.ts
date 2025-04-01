// Copyright 2023 by Teradata Corporation. All rights reserved.

// This sample program demonstrates how to obtain the version numbers for the
// Teradata SQL Driver for Node.js and the Teradata Database.

// @ts-ignore
import * as teradatasql from "teradatasql";

type Row = any[] | null;

const con: teradatasql.TeradataConnection = teradatasql.connect({ host: "whomooz", user: "guest", password: "please" });
try {
    const cur: teradatasql.TeradataCursor = con.cursor();
    try {
        cur.execute("{fn teradata_nativesql}Driver version {fn teradata_driver_version}  Database version {fn teradata_database_version}");

        const row: Row = cur.fetchone();
        if (row) {
            console.log(row[0]);
        }
    } finally {
        cur.close();
    }
} finally {
    con.close();
}
