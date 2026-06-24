// Copyright 2026 by Teradata Corporation. All rights reserved.

// This sample program demonstrates how to FastLoad a JSONL file.
// It demonstrates key-order independence and explicit NULL handling.

import * as fs from "fs";
// @ts-ignore
import * as teradatasql from "teradatasql";

type Rows = any[];

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
        const sTableName: string = "FastLoadJSONL";

        let sRequest: string = "DROP TABLE " + sTableName;
        console.log(sRequest);
        cur.execute(sRequest, undefined, 3807);

        sRequest = "DROP TABLE " + sTableName + "_ERR_1";
        console.log(sRequest);
        cur.execute(sRequest, undefined, 3807);

        sRequest = "DROP TABLE " + sTableName + "_ERR_2";
        console.log(sRequest);
        cur.execute(sRequest, undefined, 3807);

        const jsonlFileName: string = "dataJs.jsonl";
        console.log(`Writing ${jsonlFileName}`);
        fs.writeFileSync(jsonlFileName, lines.join("\n") + "\n");

        try {
            sRequest = "CREATE TABLE " + sTableName + " (c1 INTEGER NOT NULL, c2 VARCHAR(10), c3 VECTOR) UNIQUE PRIMARY INDEX (c1)";
            console.log(sRequest);
            cur.execute(sRequest);

            try {
                console.log("con.autocommit = false");
                con.autocommit = false;

                try {
                    const sInsert: string =
                        "{fn teradata_require_fastload}" +
                        "{fn teradata_read_jsonl(" + jsonlFileName + ")}" +
                        "INSERT INTO " + sTableName + " (c1, c2, c3) VALUES (?, ?, ?)";
                    console.log(sInsert);
                    cur.execute(sInsert);

                    sRequest = "{fn teradata_nativesql}{fn teradata_get_warnings}" + sInsert;
                    console.log(sRequest);
                    cur.execute(sRequest);
                    let rows: Rows = cur.fetchall();
                    for (const row of rows) {
                        console.log(row);
                    }

                    sRequest = "{fn teradata_nativesql}{fn teradata_get_errors}" + sInsert;
                    console.log(sRequest);
                    cur.execute(sRequest);
                    rows = cur.fetchall();
                    for (const row of rows) {
                        console.log(row);
                    }

                    sRequest = "{fn teradata_nativesql}{fn teradata_logon_sequence_number}" + sInsert;
                    console.log(sRequest);
                    cur.execute(sRequest);
                    rows = cur.fetchall();
                    for (const row of rows) {
                        console.log(row);
                    }

                    console.log("con.commit()");
                    con.commit();

                    sRequest = "{fn teradata_nativesql}{fn teradata_get_warnings}" + sInsert;
                    console.log(sRequest);
                    cur.execute(sRequest);
                    rows = cur.fetchall();
                    for (const row of rows) {
                        console.log(row);
                    }

                    sRequest = "{fn teradata_nativesql}{fn teradata_get_errors}" + sInsert;
                    console.log(sRequest);
                    cur.execute(sRequest);
                    rows = cur.fetchall();
                    for (const row of rows) {
                        console.log(row);
                    }
                } finally {
                    console.log("con.autocommit = true");
                    con.autocommit = true;
                }

                sRequest = "SELECT c1, c2, c3 FROM " + sTableName + " ORDER BY 1";
                console.log(sRequest);
                cur.execute(sRequest);
                const rows: Rows = cur.fetchall();
                for (const row of rows) {
                    console.log(row);
                }
            } finally {
                sRequest = "DROP TABLE " + sTableName;
                console.log(sRequest);
                cur.execute(sRequest, undefined, 3807);
            }
        } finally {
            console.log(`fs.unlinkSync(${jsonlFileName})`);
            try {
                fs.unlinkSync(jsonlFileName);
            } catch (e) {
                console.log(`fs.unlinkSync failed: ${e}`);
            }
        }
    } finally {
        cur.close();
    }
} finally {
    con.close();
}
