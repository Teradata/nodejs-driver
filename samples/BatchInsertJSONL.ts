// Copyright 2026 by Teradata Corporation. All rights reserved.

// This sample program demonstrates how to insert a batch using a JSONL file.
// It demonstrates key-order independence and explicit NULL handling.

import * as fs from "fs";
// @ts-ignore
import * as teradatasql from "teradatasql";

const lines = [
    '{"c1":1,"c2":"x1","c3":[0.10,-0.20,0.30]}',
    '{"c2":"x2","c1":2,"c3":[0.20,-0.40,0.60]}',
    '{"c3":[0.30,-0.60,0.90],"c1":3,"c2":"x3"}',
    '{"c1":4,"c2":"x4","c3":[0.40,-0.80,1.20]}',
    '{"c1":5,"c2":null,"c3":[0.50,-1.00,1.50]}',
    '{"c1":6,"c2":"x6","c3":[0.60,-1.20,1.80]}',
    '{"c1":7,"c2":"x7","c3":[0.70,-1.40,2.10]}',
    '{"c1":8,"c2":"x8","c3":[0.80,-1.60,2.40]}',
    '{"c1":9,"c2":"x9","c3":[0.90,-1.80,2.70]}',
];

const con: teradatasql.TeradataConnection = teradatasql.connect({ host: "whomooz", user: "guest", password: "please" });
try {
    const cur: teradatasql.TeradataCursor = con.cursor();
    try {
        cur.execute("create volatile table voltab (c1 integer not null, c2 varchar(10), c3 VECTOR) on commit preserve rows");

        const sFileName: string = "dataBatchJs.jsonl";
        console.log(`Writing ${sFileName}`);
        fs.writeFileSync(sFileName, lines.join("\n") + "\n");

        try {
            console.log("Inserting data");
            cur.execute(`{fn teradata_read_jsonl(${sFileName})} insert into voltab (c1, c2, c3) values (?, ?, ?)`);
        } finally {
            fs.unlinkSync(sFileName);
        }

        cur.execute("select c1, c2, c3 from voltab order by 1");
        console.log(cur.fetchall());
    } finally {
        cur.close();
    }
} finally {
    con.close();
}
