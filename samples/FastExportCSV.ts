// Copyright 2023 by Teradata Corporation. All rights reserved.

// This sample program demonstrates how to export the results from a select statement into a csv file.

// Run "npm install csv" to install the CSV module

import * as fs from "fs";
import { parse } from "csv-parse/sync";
// @ts-ignore
import { TeradataConnection, TeradataCursor, OperationalError } from "teradatasql";

type Rows = any[];

const con: TeradataConnection = new TeradataConnection();

con.connect({ host: "whomooz", user: "guest", password: "please" });

const cur: TeradataCursor = con.cursor();
const cur2: TeradataCursor = con.cursor();

const sTableName: string = "FastExportCSV";

let sRequest: string = "DROP TABLE " + sTableName;
try {
    console.log(sRequest);
    cur.execute(sRequest);
} catch (ex) {
    if (ex instanceof OperationalError) {
        console.log("Ignoring", ex.message.split("\n")[0]);
    } else {
        throw ex;
    }
}

sRequest = "CREATE TABLE " + sTableName + " (c1 INTEGER NOT NULL, c2 VARCHAR(10))";
console.log(sRequest);
cur.execute(sRequest);

try {
    const sInsert: string = "INSERT INTO " + sTableName + " VALUES (?, ?)";
    console.log(sInsert);
    cur.execute(sInsert, [
        [1, null],
        [2, "abc"],
        [3, "def"],
        [4, "mno"],
        [5, null],
        [6, "pqr"],
        [7, "uvw"],
        [8, "xyz"],
        [9, null],
    ]);

    const sFileName = "dataJs.csv";
    const sSelect = "{fn teradata_try_fastexport}{fn teradata_write_csv(" + sFileName + ")}SELECT * FROM " + sTableName;
    console.log(sSelect);
    cur.execute(sSelect);

    try {
        console.log("Reading file", sFileName);
        const sRows: string[][] = parse(fs.readFileSync(sFileName, { encoding: "utf-8" }));
        console.log(sRows);

        sRequest = "{fn teradata_nativesql}{fn teradata_get_warnings}" + sSelect;
        console.log(sRequest);
        cur2.execute(sRequest);
        let rows: Rows = cur2.fetchall();
        for (const row of rows) {
            console.log(row);
        }

        sRequest = "{fn teradata_nativesql}{fn teradata_get_errors}" + sSelect;
        console.log(sRequest);
        cur2.execute(sRequest);
        rows = cur2.fetchall();
        for (const row of rows) {
            console.log(row);
        }

        sRequest = "{fn teradata_nativesql}{fn teradata_logon_sequence_number}" + sSelect;
        console.log(sRequest);
        cur2.execute(sRequest);
        rows = cur2.fetchall();
        for (const row of rows) {
            console.log(row);
        }
    } finally {
        fs.unlinkSync(sFileName);
    }
} finally {
    sRequest = "DROP TABLE " + sTableName;
    console.log(sRequest);
    cur.execute(sRequest);
}

cur.close();
cur2.close();
con.close();
