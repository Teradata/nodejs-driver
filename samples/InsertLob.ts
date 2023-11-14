// Copyright 2023 by Teradata Corporation. All rights reserved.

// This sample program demonstrates how to insert BLOB and CLOB values.

// @ts-ignore
import { TeradataConnection, TeradataCursor } from "teradatasql";

type Row = any[] | null;

function byte(s: string, encoding?: BufferEncoding): Uint8Array {
    return Uint8Array.from(Buffer.from(s, encoding));
}

function FormatValue(oValue: any): any {
    let s: string;
    if (typeof oValue === "string") {
        s = oValue;
        if (s.length > 20) {
            s = s.slice(0, 20) + " ...";
        }
        return s + ` (len=${oValue.length})`;
    } else if (oValue instanceof Uint8Array) {
        s = Buffer.from(oValue).toString();
        if (s.length > 20) {
            s = s.slice(0, 20) + " ...";
        }
        return `byte('${s}')` + ` (len=${oValue.length})`;
    } else {
        return oValue;
    }
}

const con: TeradataConnection = new TeradataConnection();

con.connect({ host: "whomooz", user: "guest", password: "please", log: "8" });

const cur: TeradataCursor = con.cursor();

let sSQL: string = "create volatile table voltab (c1 integer, c2 blob, c3 clob) on commit preserve rows";
console.log(sSQL);
cur.execute(sSQL);

const abySmallBlob = byte("abc"); // bytes value with len=3
const abyLargeBlob = byte("ABC".repeat(75000)); // bytes value with len=75000
const sSmallClob = "xyz"; // str   value with len=3
const sLargeClob = "XYZ".repeat(25000); // str   value with len=75000

sSQL = "insert into voltab values (?, ?, ?)";
console.log(sSQL);
// Small LOB values <= 64K are inserted as inline values, contained in a single request message sent to the database.
cur.execute(sSQL, [1, abySmallBlob, sSmallClob]);

// TIMING log lines show a single send/receive message round trip:
//   GOSQL-TIMING NetworkIO.go:426 Receive header Start Response message took 24 ms
//   GOSQL-TIMING NetworkIO.go:464 Receive Start Response message body took 0 ms, send and receive took 56 ms
//   GOSIDE-TIMING goside.go:789 createRows call to QueryContext took 56 ms

console.log(sSQL);
// Large LOB values > 64K are inserted as deferred values, and require multiple message round trips to the database.
cur.execute(sSQL, [2, abyLargeBlob, sLargeClob]);

// TIMING log lines show multiple send/receive message round trips:
//   GOSQL-TIMING NetworkIO.go:426 Receive header Elicit Request message took 9 ms
//   GOSQL-TIMING NetworkIO.go:464 Receive Elicit Request message body took 0 ms, send and receive took 22 ms
//   GOSQL-TIMING NetworkIO.go:426 Receive header Elicit Request message took 38 ms
//   GOSQL-TIMING NetworkIO.go:464 Receive Elicit Request message body took 0 ms, send and receive took 54 ms
//   GOSQL-TIMING NetworkIO.go:426 Receive header Start Response message took 27 ms
//   GOSQL-TIMING NetworkIO.go:464 Receive Start Response message body took 0 ms, send and receive took 29 ms
//   GOSIDE-TIMING goside.go:789 createRows call to QueryContext took 115 ms

sSQL = "select * from voltab order by 1";
console.log(sSQL);
cur.execute(sSQL);

let nRow: number = 0;
let row: Row = null;
while (true) {
    row = cur.fetchone();
    if (!row) {
        break;
    }
    nRow += 1;
    if (cur.description) {
        for (let iColumn: number = 0; iColumn < row.length; iColumn++) {
            console.log(`Row ${nRow} Column ${iColumn + 1} "${cur.description[iColumn][0]}" = ${FormatValue(row[iColumn])}`);
        }
    }
}
console.log(`Fetched ${nRow} rows`);

cur.close();
con.close();
