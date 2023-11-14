// Copyright 2023 by Teradata Corporation. All rights reserved.

// This sample program demonstrates how to display the output from a show command.
// The show command output includes embedded carriage returns as line terminators,
// which typically must be changed to newlines in order to display properly.
// The show command output may include multiple result sets, and the cursor nextset
// function must be called to advance to subsequent result sets.

// @ts-ignore
import { TeradataConnection, TeradataCursor } from "teradatasql";

type Rows = any[];

function ShowCommand(cur: TeradataCursor, s: string): void {
    console.log("-- " + s);
    cur.execute(s);
    let n: number = 1;
    while (true) {
        console.log(`-- result set ${n}`);
        const rows: Rows = cur.fetchall();
        for (const row of rows) {
            const s: string = JSON.stringify(row).split("\\r").join("\n");
            console.log(s.slice(2, s.length - 2));
        }
        if (cur.nextset()) {
            n += 1;
        } else {
            break;
        }
    }
}

const con: TeradataConnection = new TeradataConnection();

con.connect({ host: "whomooz", user: "guest", password: "please" });

const cur: TeradataCursor = con.cursor();

ShowCommand(cur, "show view DBC.DBCInfo");
console.log();
ShowCommand(cur, "show select * from DBC.DBCInfo");

cur.close();
con.close();
