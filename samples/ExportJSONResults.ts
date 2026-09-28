// Copyright 2026 by Teradata Corporation. All Rights Reserved.
// TERADATA CORPORATION CONFIDENTIAL AND TRADE SECRET

// This sample program demonstrates how a multi-statement request writes multiple JSON files.

import * as fs from "fs";
// @ts-ignore
import * as teradatasql from "teradatasql";

const con: teradatasql.TeradataConnection = teradatasql.connect({ host: "whomooz", user: "guest", password: "please" });
try {
    const cur: teradatasql.TeradataCursor = con.cursor();
    try {
        cur.execute("create volatile table voltab (c1 integer, c2 varchar(100)) on commit preserve rows");
        cur.execute("insert into voltab values (?, ?)", [[1, "abc"], [2, null], [3, "xyz"]]);
        const asFileNames: string[] = ["dataJs.json", "dataJs_1.json", "dataJs_2.json"];
        cur.execute("{fn teradata_write_json(" + asFileNames[0] + ")}select * from voltab where c1 < 3 order by 1;select * from voltab where c1 >= 3 order by 1;select 123 as col1, 'abc' as col2");
        try {
            for (const sFileName of asFileNames) {
                console.log(sFileName, JSON.parse(fs.readFileSync(sFileName, { encoding: "utf-8" })));
            }
        } finally {
            for (const sFileName of asFileNames) fs.unlinkSync(sFileName);
        }
    } finally {
        cur.close();
    }
} finally {
    con.close();
}
