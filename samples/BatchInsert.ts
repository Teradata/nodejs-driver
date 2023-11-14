// Copyright 2023 by Teradata Corporation. All rights reserved.

// This sample program demonstrates how to insert a batch of rows.

// @ts-ignore
import { TeradataConnection, TeradataCursor } from "teradatasql";

const con: TeradataConnection = new TeradataConnection();

con.connect({ host: "whomooz", user: "guest", password: "please" });

const cur: TeradataCursor = con.cursor();

cur.execute("create volatile table voltab (c1 integer, c2 varchar(100)) on commit preserve rows");

cur.execute("insert into voltab (?, ?)", [
    [1, "abc"],
    [2, "def"],
    [3, "ghi"],
]);

cur.execute("select * from voltab order by 1");
console.log(cur.fetchall());

cur.close();
con.close();
