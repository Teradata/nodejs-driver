// Copyright 2023 by Teradata Corporation. All rights reserved.

// This sample program demonstrates how to export the results from a select statement into a csv file.

// Run "npm install csv" to install the CSV module

import * as fs from "fs";
import { parse } from "csv-parse/sync";
// @ts-ignore
import { TeradataConnection, TeradataCursor } from "teradatasql";

const con: TeradataConnection = new TeradataConnection();

con.connect({ host: "whomooz", user: "guest", password: "please" });

const cur: TeradataCursor = con.cursor();

cur.execute("create volatile table voltab (c1 integer, c2 varchar(100)) on commit preserve rows");

console.log("Inserting data");
cur.execute("insert into voltab values (?, ?)", [
    [1, ""],
    [2, "abc"],
    [3, "def"],
    [4, "mno"],
    [5, ""],
    [6, "pqr"],
    [7, "uvw"],
    [8, "xyz"],
    [9, ""],
]);

const sFileName: string = "dataJs.csv";
console.log("Exporting table data to file", sFileName);
cur.execute("{fn teradata_write_csv(" + sFileName + ")}select * from voltab order by 1");

try {
    console.log("Reading file", sFileName);
    const sRows: string[][] = parse(fs.readFileSync(sFileName, { encoding: "utf-8" }));
    console.log(sRows);
} finally {
    fs.unlinkSync(sFileName);
}

cur.close();
con.close();
