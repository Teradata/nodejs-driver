// Copyright 2026 by Teradata Corporation. All Rights Reserved.
// TERADATA CORPORATION CONFIDENTIAL AND TRADE SECRET

// This sample program demonstrates how to FastExport into a JSONL file.

import * as fs from "fs";
// @ts-ignore
import * as teradatasql from "teradatasql";

function readJSONL(sFileName: string): any[] {
    return fs.readFileSync(sFileName, { encoding: "utf-8" }).split("\n").filter((sLine: string) => sLine.length > 0).map((sLine: string) => JSON.parse(sLine));
}

const con: teradatasql.TeradataConnection = teradatasql.connect({ host: "whomooz", user: "guest", password: "please" });
try {
    const cur: teradatasql.TeradataCursor = con.cursor();
    try {
        const sTableName: string = "FastExportJSONL";
        cur.execute("create table " + sTableName + " (c1 integer, c2 varchar(10))");
        try {
            console.log("Inserting data");
            cur.execute("insert into " + sTableName + " values (?, ?)", [[1, null], [2, "abc"], [3, "xyz"]]);

            const sFileName: string = "dataJs.jsonl";
            const sSelect: string = "{fn teradata_try_fastexport}{fn teradata_write_jsonl(" + sFileName + ")}select * from " + sTableName + " order by 1";
            console.log("FastExporting table data to file", sFileName);
            cur.execute(sSelect);
            try {
                console.log("Reading file", sFileName);
                console.log(readJSONL(sFileName));
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
