// Copyright 2023 by Teradata Corporation. All rights reserved.

// This sample program demonstrates the behavior of the fake_result_sets escape function.

// @ts-ignore
import { TeradataConnection, TeradataCursor } from "teradatasql";

type Row = any[] | null;
type Rows = any[];

const con: TeradataConnection = new TeradataConnection();

con.connect({ host: "whomooz", user: "guest", password: "please" });

const cur: TeradataCursor = con.cursor();

cur.execute("create volatile table voltab1 (c1 integer, c2 varchar(100)) on commit preserve rows");
cur.execute("insert into voltab1 values (1, 'abc')");
cur.execute("insert into voltab1 values (2, 'def')");

cur.execute("create volatile table voltab2 (c1 integer, c2 varchar(100)) on commit preserve rows");
cur.execute("insert into voltab2 values (3, 'ghi')");
cur.execute("insert into voltab2 values (4, 'jkl')");
cur.execute("insert into voltab2 values (5, 'mno')");

cur.execute("create volatile table voltab3 (c1 integer, c2 varchar(100)) on commit preserve rows");
cur.execute("insert into voltab3 values (6, 'pqr')");
cur.execute("insert into voltab3 values (7, 'stu')");
cur.execute("insert into voltab3 values (8, 'vwx')");
cur.execute("insert into voltab3 values (9, 'yz')");

cur.execute("{fn teradata_fake_result_sets}select * from voltab1 order by 1");
console.log("=== Two result sets produced by a single-statement SQL request that returns one result set ===");
console.log(" --- Fake result set ---");
let row: Row = cur.fetchone();
if (row) {
    for (let i: number = 0; i < row.length; i++) {
        if (cur.description) {
            console.log(`Column ${i + 1} ${cur.description[i][0].padEnd(15)} = ${row[i]}`);
        }
    }
}
cur.nextset();
console.log(" --- Real result set ---");
let rows: Rows = cur.fetchall();
for (const row of rows) {
    console.log(row);
}
console.log();

cur.execute("{fn teradata_fake_result_sets}select * from voltab2 order by 1 ; select * from voltab3 order by 1");
console.log("=== Four result sets produced by a multi-statement SQL request that returns two result sets ===");
console.log(" --- Fake result set ---");
row = cur.fetchone();
if (row) {
    for (let i: number = 0; i < row.length; i++) {
        if (cur.description) {
            console.log(`Column ${i + 1} ${cur.description[i][0].padEnd(15)} = ${row[i]}`);
        }
    }
}
cur.nextset();
console.log(" --- Real result set ---");
rows = cur.fetchall();
for (const row of rows) {
    console.log(row);
}
cur.nextset();
console.log(" --- Fake result set ---");
row = cur.fetchone();
if (row) {
    for (let i: number = 0; i < row.length; i++) {
        if (cur.description) {
            console.log(`Column ${i + 1} ${cur.description[i][0].padEnd(15)} = ${row[i]}`);
        }
    }
}
cur.nextset();
console.log(" --- Real result set ---");
rows = cur.fetchall();
for (const row of rows) {
    console.log(row);
}

cur.close();
con.close();
