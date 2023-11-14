// Copyright 2023 by Teradata Corporation. All rights reserved.

// This sample program measures the time to insert one million rows as 100 batches of 10000 rows per batch.

// @ts-ignore
import { TeradataConnection, TeradataCursor, OperationalError } from "teradatasql";

type Row = any[] | null;

const con: TeradataConnection = new TeradataConnection();

con.connect({ host: "whomooz", user: "guest", password: "please" });

const cur: TeradataCursor = con.cursor();

const sTableName: string = "batchinsperf";
const nRowsPerBatch: number = 10000;
const nBatchCount: number = 100;

try {
    cur.execute("drop table " + sTableName);
} catch (ex) {
    if (ex instanceof OperationalError) {
        console.log("Ignoring", ex.message.split("\n")[0]);
    } else {
        throw ex;
    }
}
cur.execute("create table " + sTableName + " (c1 integer, c2 varchar(100), c3 integer, c4 varchar(100))");

try {
    let dStartTime1: number = Date.now();

    for (let iBatch: number = 0; iBatch < nBatchCount; iBatch++) {
        const aaoBatch: any[] = [];
        for (let nRow: number = 1; nRow < nRowsPerBatch + 1; nRow++) {
            const nValue: number = iBatch * nRowsPerBatch + nRow;
            aaoBatch.push([nValue, "a" + nValue.toString(), -nValue, "b" + nValue.toString()]);
        }
        const dStartTime2: number = Date.now();

        cur.execute("insert into " + sTableName + " values (?, ?, ?, ?)", aaoBatch);

        console.log(`Batch insert #${iBatch + 1} of ${nRowsPerBatch} rows took ${Date.now() - dStartTime2} ms"`);
    } // end for iBatch

    let dTotalTime: number = Date.now() - dStartTime1;

    console.log(
        `Inserting ${nBatchCount} batches containing ${nBatchCount * nRowsPerBatch} total rows took ${dTotalTime} ms for ${
            ((nBatchCount * nRowsPerBatch) / dTotalTime) * 1000
        } rows/sec throughput`
    );

    cur.execute("select count(*) from " + sTableName + " order by 1");
    const row: Row = cur.fetchone();
    if (row) {
        console.log(`Table ${sTableName} contains ` + row[0] + " rows");
    }
} finally {
    cur.execute("drop table " + sTableName);
}

cur.close();
con.close();
