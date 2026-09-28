// Copyright 2026 by Teradata Corporation. All Rights Reserved.
// TERADATA CORPORATION CONFIDENTIAL AND TRADE SECRET

// This sample program demonstrates how to FastExport into a JSON file.

import * as fs from "fs";
// @ts-ignore
import * as teradatasql from "teradatasql";

const con: teradatasql.TeradataConnection = teradatasql.connect({ host: "whomooz", user: "guest", password: "please" });
try {
    const cur: teradatasql.TeradataCursor = con.cursor();
    try {
        const sTableName: string = "FastExportJSON";
        cur.execute("create table " + sTableName + " (c1 integer, c2 varchar(10))");
        try {
            cur.execute("insert into " + sTableName + " values (?, ?)", [[1, null], [2, "abc"], [3, "xyz"]]);
            const sFileName: string = "dataJs.json";
            const sSelect: string = "{fn teradata_try_fastexport}{fn teradata_write_json(" + sFileName + ")}select * from " + sTableName + " order by 1";
            cur.execute(sSelect);
            try {
                console.log(JSON.parse(fs.readFileSync(sFileName, { encoding: "utf-8" })));
            } finally {
                fs.unlinkSync(sFileName);
            }
        } finally {
            cur.execute("drop table " + sTableName);
        }
    } finally {
        cur.close();
    }
} finally {
    con.close();
}
