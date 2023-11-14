// Copyright 2023 by Teradata Corporation. All rights reserved.

// This sample program demonstrates how to obtain the version numbers for the
// Teradata SQL Driver for Node.js and the Teradata Database.

// @ts-ignore
import { TeradataConnection, TeradataCursor } from "teradatasql";

type Row = any[] | null;

const con: TeradataConnection = new TeradataConnection();

con.connect({ host: "whomooz", user: "guest", password: "please" });

const cur: TeradataCursor = con.cursor();

cur.execute("{fn teradata_nativesql}Driver version {fn teradata_driver_version}  Database version {fn teradata_database_version}");

const row: Row = cur.fetchone();
if (row) {
    console.log(row[0]);
}

cur.close();
con.close();
