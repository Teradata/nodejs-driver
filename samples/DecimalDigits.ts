// Copyright 2023 by Teradata Corporation. All rights reserved.

// This sample program demonstrates how to format decimal.Decimal values.

// @ts-ignore
import { TeradataConnection, TeradataCursor } from "teradatasql";

type Row = any[] | null;
type Rows = any[];

const con: TeradataConnection = new TeradataConnection();

con.connect({ host: "whomooz", user: "guest", password: "please" });

const cur: TeradataCursor = con.cursor();

cur.execute("create volatile table voltab (c1 integer, c2 decimal(15,8), c3 varchar(10)) on commit preserve rows");
cur.execute("insert into voltab values (?, ?, ?)", [
    [123, Number("0.00000081"), "hello"],
    [456, null, "world"],
    [789, Number("1234567.89012345"), null],
]);

let row: Row;
let rows: Rows;

console.log("Without decimal.Decimal formatting, Row 1 Column 2 value is printed as 8.1E-7");
cur.execute("select * from voltab order by 1");
rows = cur.fetchall();

for (let iRow: number = 0; iRow < rows.length; iRow++) {
    row = rows[iRow];
    if (row) {
        for (let iColumn: number = 0; iColumn < row.length; iColumn++) {
            const value: any = row[iColumn];
            console.log(`Row ${iRow + 1} Column ${iColumn + 1} value = ${value}`);
        }
    }
}

console.log("With decimal.Decimal formatting, Row 1 Column 2 value is printed as 0.00000081");
cur.execute("select * from voltab order by 1");
rows = cur.fetchall();

if (cur.description) {
    for (let iRow: number = 0; iRow < rows.length; iRow++) {
        row = rows[iRow];
        if (row) {
            for (let iColumn: number = 0; iColumn < row.length; iColumn++) {
                let value: any = row[iColumn];
                if (typeof value === "number") {
                    const n: number = Number(cur.description[iColumn][5]);
                    if (n > 0) {
                        value = value.toFixed(n);
                    }
                }
                console.log(`Row ${iRow + 1} Column ${iColumn + 1} value = ${value}`);
            }
        }
    }
}

cur.close();
con.close();
