// Copyright 2026 by Teradata Corporation. All rights reserved.

// This sample program demonstrates how to FastLoad a Parquet file.
// This sample program requires the airports.parquet file to be located in the current directory.

// @ts-ignore
import * as teradatasql from "teradatasql";

type Rows = any[];

const con: teradatasql.TeradataConnection = teradatasql.connect({ host: "whomooz", user: "guest", password: "please" });
try {
    const cur: teradatasql.TeradataCursor = con.cursor();
    try {
        const sTableName: string = "FastLoadParquet";

        let sRequest: string = "DROP TABLE " + sTableName;
        console.log(sRequest);
        cur.execute(sRequest, undefined, 3807); // ignoreErrors = 3807

        sRequest = "DROP TABLE " + sTableName + "_ERR_1";
        console.log(sRequest);
        cur.execute(sRequest, undefined, 3807); // ignoreErrors = 3807

        sRequest = "DROP TABLE " + sTableName + "_ERR_2";
        console.log(sRequest);
        cur.execute(sRequest, undefined, 3807); // ignoreErrors = 3807

        const parquetFileName: string = "airports.parquet";

        sRequest = "CREATE TABLE " + sTableName + " (City VARCHAR(100), Airport VARCHAR(100), AirportCode VARCHAR(10))";
        console.log(sRequest);
        cur.execute(sRequest);

        try {
            console.log("con.autocommit = false");
            con.autocommit = false;

            try {
                const sInsert: string =
                    "{fn teradata_require_fastload}{fn teradata_read_parquet(" + parquetFileName + ")}INSERT INTO " + sTableName + " (?, ?, ?)";
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
            cur.execute(sRequest, undefined, 3807); // ignoreErrors = 3807
        }
    } finally {
        cur.close();
    }
} finally {
    con.close();
}
