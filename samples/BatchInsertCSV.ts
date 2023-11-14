// Copyright 2023 by Teradata Corporation. All rights reserved.

// This sample program demonstrates how to insert a batch of rows using a CSV file.

// Run "npm install csv" to install the CSV module

import * as fs from "fs";
import { stringify } from "csv-stringify/sync";
// @ts-ignore
import { TeradataConnection, TeradataCursor } from "teradatasql";

const con: TeradataConnection = new TeradataConnection();

con.connect({ host: "whomooz", user: "guest", password: "please" });

const cur: TeradataCursor = con.cursor();

cur.execute("create volatile table voltab (c1 integer, c2 varchar(100)) on commit preserve rows");

const records: string[][] = [
    ["c1", "c2"],
    ["1", ""],
    ["2", "abc"],
    ["3", "def"],
    ["4", "mno"],
    ["5", ""],
    ["6", "pqr"],
    ["7", "uvw"],
    ["8", "xyz"],
    ["9", ""],
];

const sFileName: string = "CSVBatchInsertData_js";
fs.writeFileSync(sFileName, stringify(records));

try {
    console.log("Inserting data");
    cur.execute(`{fn teradata_read_csv(${sFileName})} insert into voltab (?, ?)`);
} finally {
    fs.unlinkSync(sFileName);
}

cur.execute("select * from voltab order by 1");
console.log(cur.fetchall());

cur.close();
con.close();
