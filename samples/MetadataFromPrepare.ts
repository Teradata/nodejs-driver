// Copyright 2023 by Teradata Corporation. All rights reserved.

// This sample program demonstrates how to use the teradata_rpo(S) and teradata_fake_result_sets
// escape functions to prepare a SQL request without executing it and obtain SQL statement metadata.
// This sample program assumes that StatementInfo parcel support is available from the Teradata Database.

// @ts-ignore
import { TeradataConnection, TeradataCursor } from "teradatasql";

type Row = any[] | null;

const con: TeradataConnection = new TeradataConnection();

con.connect({ host: "whomooz", user: "guest", password: "please" });

const cur: TeradataCursor = con.cursor();

cur.execute("{fn teradata_rpo(S)}{fn teradata_fake_result_sets}select * from dbc.dbcinfo where infokey=?");
const row: Row = cur.fetchone();

if (row && cur.description) {
    console.log("SQL statement metadata from prepare operation:");
    console.log();

    for (let i: number = 0; i < cur.description.length; i++) {
        console.log(`   Column [${i}] ${cur.description[i][0].padEnd(18)} : ${row[i]}`);
    }

    console.log("Result set column metadata as JSON:");
    console.log(JSON.parse(row[7]));
    console.log();
    console.log("Parameter marker metadata as JSON:");
    console.log(JSON.parse(row[8]));
}

cur.close();
con.close();
