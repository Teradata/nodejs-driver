// Copyright 2023 by Teradata Corporation. All rights reserved.

// This sample program demonstrates how to use the commit and rollback methods after turning off auto-commit.

// @ts-ignore
import { TeradataConnection, TeradataCursor } from "teradatasql";

type Rows = any[];

const con: TeradataConnection = new TeradataConnection();

con.connect({ host: "whomooz", user: "guest", password: "please" });

const cur: TeradataCursor = con.cursor();

con.autocommit = false;

cur.execute("create volatile table voltab (c1 integer) on commit preserve rows");
con.commit();

cur.execute("insert into voltab values (1)");
con.commit();

cur.execute("insert into voltab values (2)");
con.rollback();

cur.execute("insert into voltab values (3)");
cur.execute("insert into voltab values (4)");
con.commit();

cur.execute("insert into voltab values (5)");
cur.execute("insert into voltab values (6)");
con.rollback();

cur.execute("select * from voltab order by 1");
con.commit();

const rows: Rows = cur.fetchall();
const anValues: any[] = [];
for (const row of rows) {
    anValues.push(row[0]);
}
console.log("Expected result set row values: [1,3,4]");
console.log(`Obtained result set row values: [${anValues}]`);

cur.close();
con.close();
