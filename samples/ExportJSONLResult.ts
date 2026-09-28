// Copyright 2026 by Teradata Corporation. All Rights Reserved.
// TERADATA CORPORATION CONFIDENTIAL AND TRADE SECRET

// This sample program demonstrates how to export a select result into a JSONL file.

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
        cur.execute("create volatile table voltab (c1 integer, c2 varchar(100)) on commit preserve rows");

        console.log("Inserting data");
        cur.execute("insert into voltab values (?, ?)", [[1, "abc"], [2, null], [3, "xyz"]]);

        const sFileName: string = "dataJs.jsonl";
        console.log("Exporting table data to file", sFileName);
        cur.execute("{fn teradata_write_jsonl(" + sFileName + ")}select * from voltab order by 1");

        try {
            console.log("Reading file", sFileName);
            console.log(readJSONL(sFileName));
        } finally {
            fs.unlinkSync(sFileName);
        }
    } finally {
        cur.close();
    }
} finally {
    con.close();
}
