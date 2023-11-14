// Copyright 2023 by Teradata Corporation. All rights reserved.

// This sample program demonstrates how to FastLoad batches of rows.

// @ts-ignore
import { TeradataConnection, TeradataCursor } from "teradatasql";

type Rows = any[];

const con: TeradataConnection = new TeradataConnection();

con.connect({ host: "whomooz", user: "guest", password: "please" });

const cur: TeradataCursor = con.cursor();

const sTableName: string = "FastLoadBatch";

let sRequest: string = "DROP TABLE " + sTableName;

console.log(sRequest);
cur.execute(sRequest, undefined, 3807); // ignoreErrors = 3807

sRequest = "CREATE TABLE " + sTableName + " (c1 INTEGER NOT NULL, c2 VARCHAR(10))";
console.log(sRequest);
cur.execute(sRequest);

try {
    console.log("con.autocommit = false");
    con.autocommit = false;

    try {
        let aaoValues: any[] = [
            [
                1, // c1 INTEGER NOT NULL
                null, // c2 VARCHAR
            ],
            [
                2, // c1 INTEGER NOT NULL
                "abc", // c2 VARCHAR
            ],
            [
                3, // c1 INTEGER NOT NULL
                "def", // c2 VARCHAR
            ],
        ];

        const sInsert: string = "{fn teradata_try_fastload}INSERT INTO " + sTableName + " (?, ?)";
        console.log(sInsert);
        cur.execute(sInsert, aaoValues);

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

        aaoValues = [
            [
                4, // c1 INTEGER NOT NULL
                "mno", // c2 VARCHAR
            ],
            [
                5, // c1 INTEGER NOT NULL
                null, // c2 VARCHAR
            ],
            [
                6, // c1 INTEGER NOT NULL
                "pqr", // c2 VARCHAR
            ],
        ];

        console.log(sInsert);
        cur.execute(sInsert, aaoValues);

        // obtain the warnings and errors for transmitting the data to the database -- the acquisition phase

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

        aaoValues = [
            [
                7, // c1 INTEGER NOT NULL
                "uvw", // c2 VARCHAR
            ],
            [
                8, // c1 INTEGER NOT NULL
                "xyz", // c2 VARCHAR
            ],
            [
                9, // c1 INTEGER NOT NULL
                null, // c2 VARCHAR
            ],
        ];

        console.log(sInsert);
        cur.execute(sInsert, aaoValues);

        // obtain the warnings and errors for transmitting the data to the database -- the acquisition phase

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

        console.log("con.commit()");
        con.commit();

        //  obtain the warnings and errors for the apply phase

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

cur.close();
con.close();
