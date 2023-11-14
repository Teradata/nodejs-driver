// Copyright 2023 by Teradata Corporation. All rights reserved.

// This sample program demonstrates how to export the results from a multi-statement request into
// multiple csv files and obtain info on each statement using fake_result_sets escape function.

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

const asFileNames: string[] = ["dataJs.csv", "dataJs_1.csv", "dataJs_2.csv", "dataJs_3.csv", "dataJs_4.csv", "dataJs_5.csv"];

console.log("Exporting table data to file", asFileNames);
cur.execute(
    "{fn teradata_write_csv(" +
        asFileNames[0] +
        ")}{fn teradata_fake_result_sets}select * from voltab order by 1 ; select * from voltab order by 1 desc ; select 123 as col1, 'abc' as col2"
);

const re: RegExp = new RegExp("\\d+");

try {
    for (const sFileName of asFileNames) {
        console.log("Reading file", sFileName);

        let nFilenamePostfix;
        const m: any = sFileName.match(re);
        if (m) {
            nFilenamePostfix = parseInt(m[0]);
        } else {
            nFilenamePostfix = 0;
        }

        const records: string[][] = parse(fs.readFileSync(sFileName, { encoding: "utf-8" }));

        if (nFilenamePostfix & 1) {
            console.log("Real result set");

            for (const record of records) {
                console.log(record);
            }
        } else {
            console.log("Fake result set");

            const asColumnNames: string[] = records[0];
            const row: string[] = records[1];

            for (let i: number = 0; i < row.length; i++) {
                console.log(`${asColumnNames[i].padEnd(15)} = ${row[i]}`);
            }
        }
    }
} finally {
    for (const sFileName of asFileNames) {
        fs.unlinkSync(sFileName);
    }
}

cur.close();
con.close();
