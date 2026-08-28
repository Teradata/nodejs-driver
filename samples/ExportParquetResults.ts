// Copyright 2026 by Teradata Corporation. All rights reserved.

// This sample program demonstrates how to export the results from a multi-statement request into multiple Parquet files.
// After exporting, each file is read back using hyparquet and the contents are displayed.

// Run "npm install hyparquet" to install the Parquet reading module
import * as fs from "fs";
// @ts-ignore
import * as teradatasql from "teradatasql";

(async () => {
    const con: teradatasql.TeradataConnection = teradatasql.connect({ host: "whomooz", user: "guest", password: "please" });
    try {
        const cur: teradatasql.TeradataCursor = con.cursor();
        try {
            cur.execute("create volatile table voltab (c1 integer, c2 varchar(10)) on commit preserve rows");

            console.log("Inserting data");
            cur.execute("insert into voltab values (?, ?)", [
                [1, "x1"], [2, "x2"], [3, "x3"], [4, "x4"], [5, "x5"],
                [6, "x6"], [7, "x7"], [8, "x8"], [9, "x9"],
            ]);

            const asFileNames: string[] = ["dataJs.parquet", "dataJs_1.parquet", "dataJs_2.parquet"];
            console.log("Exporting table data to files", asFileNames);
            cur.execute(
                "{fn teradata_write_parquet(" +
                    asFileNames[0] +
                    ")}select * from voltab where c1 < 5 order by 1 ; select * from voltab where c1 >= 5 order by 1 ; select 'abc' as col1, '12' as col2"
            );

            try {
                for (const sFileName of asFileNames) {
                    await readParquetFile(sFileName);
                }
            } finally {
                for (const sFileName of asFileNames) {
                    console.log("fs.unlinkSync(" + sFileName + ")");
                    fs.unlinkSync(sFileName);
                }
            }
        } finally {
            cur.close();
        }
    } finally {
        con.close();
    }
})().catch(console.error);

async function readParquetFile(sFileName: string): Promise<void> {
    // hyparquet is ESM-only; use a real dynamic import (bypassing TypeScript's
    // commonjs downleveling of import() to require()) so Node resolves it via its ESM exports map
    // @ts-ignore
    const { asyncBufferFromFile, parquetReadObjects } = await (new Function("specifier", "return import(specifier)"))("hyparquet");
    const file = await asyncBufferFromFile(sFileName);
    const rows: Record<string, any>[] = await parquetReadObjects({ file });
    console.log("Parquet file " + sFileName + ": " + rows.length + " row" + (rows.length !== 1 ? "s" : ""));
    for (let nRow = 0; nRow < rows.length; nRow++) {
        console.log("Row " + (nRow + 1) + ":");
        for (const [sColName, value] of Object.entries(rows[nRow])) {
            console.log("  " + sColName.padEnd(20) + " = " + formatParquetValue(value));
        }
    }
}

function formatParquetValue(value: any): string {
    if (value === null || value === undefined) {
        return "null";
    }
    if (typeof value === "object" && !(value instanceof Date)) {
        try {
            const sIndent: string = " ".repeat(25); // 2 + 20 + 3 to align under value
            return JSON.stringify(value, null, 2).replace(/\n/g, "\n" + sIndent);
        } catch {
            return String(value);
        }
    }
    return String(value);
}
