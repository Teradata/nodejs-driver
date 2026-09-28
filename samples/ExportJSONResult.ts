// Copyright 2026 by Teradata Corporation. All Rights Reserved.
// TERADATA CORPORATION CONFIDENTIAL AND TRADE SECRET

// This sample program demonstrates how to export a select result into a JSON file.

import * as fs from "fs";
// @ts-ignore
import * as teradatasql from "teradatasql";

const con: teradatasql.TeradataConnection = teradatasql.connect({ host: "whomooz", user: "guest", password: "please" });
try {
    const cur: teradatasql.TeradataCursor = con.cursor();
    try {
        cur.execute("create volatile table voltab (c1 integer, c2 varchar(100)) on commit preserve rows");
        cur.execute("insert into voltab values (?, ?)", [[1, "abc"], [2, null], [3, "xyz"]]);
        const sFileName: string = "dataJs.json";
        cur.execute("{fn teradata_write_json(" + sFileName + ")}select * from voltab order by 1");
        try {
            console.log(JSON.parse(fs.readFileSync(sFileName, { encoding: "utf-8" })));
        } finally {
            fs.unlinkSync(sFileName);
        }
    } finally {
        cur.close();
    }
} finally {
    con.close();
}
