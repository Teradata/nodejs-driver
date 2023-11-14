// Copyright 2023 by Teradata Corporation. All rights reserved.

// This sample program demonstrates how to insert and retrieve XML values.
// Use the escape function teradata_parameter to override the data type for a parameter marker bind value.

// @ts-ignore
import { TeradataConnection, TeradataCursor } from "teradatasql";

type Row = any[] | null;
type Rows = any[];

const con: TeradataConnection = new TeradataConnection();

con.connect({ host: "whomooz", user: "guest", password: "please" });

const cur: TeradataCursor = con.cursor();

cur.execute("create volatile table voltab (c1 integer, c2 xml) on commit preserve rows");

cur.execute("{fn teradata_parameter(2,XML)}insert into voltab values (?, ?)", [
    [1, "<hello>world</hello>"],
    [2, "<hello>moon</hello>"],
]);

cur.execute("{fn teradata_fake_result_sets}select * from voltab order by 1");

// obtain column metadata from the fake result set

const asTypeNames: string[] = [];
let row: Row = cur.fetchone();
if (row) {
    const json: any = JSON.parse(row[7].toString());
    for (const elem of json) {
        for (const k in elem) {
            if (k === "TypeName") {
                asTypeNames.push(elem[k]);
            }
        }
    }
}

cur.nextset(); // advance to the real result set

const rows: Rows = cur.fetchall();

for (let nRow: number = 0; nRow < rows.length; nRow++) {
    row = rows[nRow];
    if (row && cur.description) {
        for (let iColumn: number = 0; iColumn < row.length; iColumn++) {
            console.log(`Row ${nRow + 1} Column ${cur.description[iColumn][0]} ${asTypeNames[iColumn].padEnd(7)} ${row[iColumn]}`);
        }
    }
}

cur.close();
con.close();
