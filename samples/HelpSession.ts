// Copyright 2023 by Teradata Corporation. All rights reserved.

// This sample program demonstrates how to obtain and display session information.

// @ts-ignore
import { TeradataConnection, TeradataCursor } from "teradatasql";

type Row = any[] | null;

const con: TeradataConnection = new TeradataConnection();

con.connect({ host: "whomooz", user: "guest", password: "please" });

const cur: TeradataCursor = con.cursor();

cur.execute("help session");
const row: Row = cur.fetchone();
if (row) {
    for (let i: number = 0; i < row.length; i++) {
        if (cur.description) {
            console.log(`${cur.description[i][0].padEnd(40)}, ${row[i]}`);
        }
    }
}

cur.close();
con.close();
