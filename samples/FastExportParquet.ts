// Copyright 2026 by Teradata Corporation. All rights reserved.

// This sample program demonstrates how to FastExport rows to a Parquet file.
// After exporting, the file is read back using hyparquet and the contents are displayed.

// Run "npm install hyparquet" to install the Parquet reading module
import * as fs from "fs";
// @ts-ignore
import * as teradatasql from "teradatasql";

type Rows = any[];

(async () => {
    const con: teradatasql.TeradataConnection = teradatasql.connect({ host: "whomooz", user: "guest", password: "please" });
    try {
        const cur: teradatasql.TeradataCursor = con.cursor();
        try {
            const cur2: teradatasql.TeradataCursor = con.cursor();
            try {
                const sTableName: string = "FastExportParquet";

                let sRequest: string = "DROP TABLE " + sTableName;
                try {
                    console.log(sRequest);
                    cur.execute(sRequest);
                } catch (ex: any) {
                    if (ex instanceof teradatasql.OperationalError) {
                        console.log("Ignoring", ex.message.split("\n")[0]);
                    } else {
                        throw ex;
                    }
                }

                sRequest = "CREATE TABLE " + sTableName + " (c1 INTEGER NOT NULL, c2 VARCHAR(10))";
                console.log(sRequest);
                cur.execute(sRequest);

                try {
                    const sInsert: string = "INSERT INTO " + sTableName + " VALUES (?, ?)";
                    console.log(sInsert);
                    cur.execute(sInsert, [
                        [1, null], [2, "x2"], [3, "x3"], [4, "x4"], [5, null],
                        [6, "x6"], [7, "x7"], [8, "x8"], [9, null],
                    ]);

                    const sFileName: string = "dataJs.parquet";
                    const sSelect: string = "{fn teradata_try_fastexport}{fn teradata_write_parquet(" + sFileName + ")}SELECT * FROM " + sTableName;
                    console.log(sSelect);
                    cur.execute(sSelect);

                    try {
                        await readParquetFile(sFileName);

                        sRequest = "{fn teradata_nativesql}{fn teradata_get_warnings}" + sSelect;
                        console.log(sRequest);
                        cur2.execute(sRequest);
                        let rows: Rows = cur2.fetchall();
                        for (const row of rows) { console.log(row); }

                        sRequest = "{fn teradata_nativesql}{fn teradata_get_errors}" + sSelect;
                        console.log(sRequest);
                        cur2.execute(sRequest);
                        rows = cur2.fetchall();
                        for (const row of rows) { console.log(row); }

                        sRequest = "{fn teradata_nativesql}{fn teradata_logon_sequence_number}" + sSelect;
                        console.log(sRequest);
                        cur2.execute(sRequest);
                        rows = cur2.fetchall();
                        for (const row of rows) { console.log(row); }
                    } finally {
                        console.log("fs.unlinkSync(" + sFileName + ")");
                        fs.unlinkSync(sFileName);
                    }
                } finally {
                    sRequest = "DROP TABLE " + sTableName;
                    console.log(sRequest);
                    cur.execute(sRequest);
                }
            } finally {
                cur2.close();
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
