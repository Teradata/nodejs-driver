// Copyright 2023 by Teradata Corporation. All rights reserved.

// This sample program demonstrates how to FastLoad a CSV file.

// @ts-ignore
import { TeradataConnection, TeradataCursor } from "teradatasql";
import * as fs from "fs";

type Rows = any[];

const con: TeradataConnection = new TeradataConnection();

con.connect({ host: "whomooz", user: "guest", password: "please" });

const cur: TeradataCursor = con.cursor();

const sTableName: string = "FastLoadCSV";

let sRequest: string = "DROP TABLE " + sTableName;
console.log(sRequest);
cur.execute(sRequest, undefined, 3807); // ignoreErrors = 3807

sRequest = "DROP TABLE " + sTableName + "_ERR_1";
console.log(sRequest);
cur.execute(sRequest, undefined, 3807); // ignoreErrors = 3807

sRequest = "DROP TABLE " + sTableName + "_ERR_2";
console.log(sRequest);
cur.execute(sRequest, undefined, 3807); // ignoreErrors = 3807

const records: string[] = ["c1,c2", "1,", "2,abc", "3,def", "4,mno", "5,", "6,pqr", "7,uvw", "8,xyz", "9,"];
console.log("records", records);

const csvFileName: string = "dataJs.csv";
for (const record of records) {
    fs.appendFileSync(csvFileName, record + "\n");
}

try {
    sRequest = "CREATE TABLE " + sTableName + " (c1 INTEGER NOT NULL, c2 VARCHAR(10))";
    console.log(sRequest);
    cur.execute(sRequest);

    try {
        console.log("con.autocommit = false");
        con.autocommit = false;

        try {
            const sInsert: string = "{fn teradata_require_fastload}{fn teradata_read_csv(" + csvFileName + ")}INSERT INTO " + sTableName + " (?, ?)";
            console.log(sInsert);
            cur.execute(sInsert);

            // obtain the warnings and errors for transmitting the data to the database -- the acquisition phase

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

            // obtain the warnings and errors for the apply phase

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

        sRequest = "SELECT * FROM " + sTableName + " ORDER BY 1";
        console.log(sRequest);
        cur.execute(sRequest);
        const rows: Rows = cur.fetchall();
        for (const row of rows) {
            console.log(row);
        }
    } finally {
        sRequest = "DROP TABLE " + sTableName;
        console.log(sRequest);
        cur.execute(sRequest);
    }
} finally {
    console.log(`delete ${csvFileName}`);
    fs.unlinkSync(csvFileName);
}
cur.close();
con.close();
