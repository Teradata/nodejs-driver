// Copyright 2026 by Teradata Corporation. All rights reserved.

// This sample program demonstrates how to FastLoad a JSON file.
// It also illustrates dual treatment of a nested JSON object: the raw JSON
// string is stored verbatim in the "address" column, while the flattened
// sub-field "city" is stored in a separate column.
//
// FastLoad requires:
//   - A non-volatile, persistent table (not VOLATILE).
//   - autocommit=false / con.commit() bracketing the insert.
//   - teradata_require_fastload (or teradata_try_fastload) escape function.

import * as fs from "fs";
// @ts-ignore
import * as teradatasql from "teradatasql";

type Rows = any[];

// Each record has three top-level keys:
//   id      -- scalar integer
//   name    -- scalar string
//   address -- nested object; its raw JSON string maps to the "address" column
//              and its sub-field "city" maps to the "city" column.
const records = [
    { id: 1, name: "Alice", address: { city: "Boston"       } },
    { id: 2, name: "Bob",   address: { city: "Austin"       } },
    { id: 3, name: "Carol", address: { city: "Chicago"      } },
    { id: 4, name: "Dave",  address: { city: "Denver"       } },
    { id: 5, name: "Erin",  address: { city: "Eugene"       } },
    { id: 6, name: "Frank", address: { city: "Fresno"       } },
    { id: 7, name: "Grace", address: { city: "Houston"      } },
    { id: 8, name: "Hank",  address: { city: "Irvine"       } },
    { id: 9, name: "Iris",  address: { city: "Jacksonville" } },
];

const con: teradatasql.TeradataConnection = teradatasql.connect({ host: "whomooz", user: "guest", password: "please" });
try {
    const cur: teradatasql.TeradataCursor = con.cursor();
    try {
        const sTableName: string = "FastLoadJSON";

        let sRequest: string = "DROP TABLE " + sTableName;
        console.log(sRequest);
        cur.execute(sRequest, undefined, 3807); // ignoreErrors = 3807

        sRequest = "DROP TABLE " + sTableName + "_ERR_1";
        console.log(sRequest);
        cur.execute(sRequest, undefined, 3807); // ignoreErrors = 3807

        sRequest = "DROP TABLE " + sTableName + "_ERR_2";
        console.log(sRequest);
        cur.execute(sRequest, undefined, 3807); // ignoreErrors = 3807

        const jsonFileName: string = "dataJs.json";
        console.log(`Writing ${jsonFileName}`);
        fs.writeFileSync(jsonFileName, JSON.stringify(records));

        try {
            sRequest = "CREATE TABLE " + sTableName + " (id INTEGER, name VARCHAR(20), address VARCHAR(200), city VARCHAR(20)) UNIQUE PRIMARY INDEX (id)";
            console.log(sRequest);
            cur.execute(sRequest);

            try {
                console.log("con.autocommit = false");
                con.autocommit = false;

                try {
                    // The INSERT column list (id, name, address, city) drives name-based matching:
                    //   ?1 -> id      (scalar)
                    //   ?2 -> name    (scalar)
                    //   ?3 -> address (raw JSON object string -- dual treatment)
                    //   ?4 -> city    (flattened sub-field of address)
                    const sInsert: string =
                        "{fn teradata_require_fastload}" +
                        "{fn teradata_read_json(" + jsonFileName + ")}" +
                        "INSERT INTO " + sTableName + " (id, name, address, city) VALUES (?, ?, ?, ?)";
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

                sRequest = "SELECT id, name, address, city FROM " + sTableName + " ORDER BY 1";
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
            console.log(`fs.unlinkSync(${jsonFileName})`);
            try {
                fs.unlinkSync(jsonFileName);
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
