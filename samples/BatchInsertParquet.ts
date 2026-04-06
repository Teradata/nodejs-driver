// Copyright 2026 by Teradata Corporation. All rights reserved.

// This sample program demonstrates how to insert a batch using a parquet file.
// This sample program requires the airports.parquet file to be located in the current directory.

// @ts-ignore
import * as teradatasql from "teradatasql";

const con: teradatasql.TeradataConnection = teradatasql.connect({ host: "whomooz", user: "guest", password: "please" });
try {
    const cur: teradatasql.TeradataCursor = con.cursor();
    try {
        cur.execute("create volatile table voltab (City varchar(100), Airport varchar(100), AirportCode varchar(10)) on commit preserve rows");

        const parquetFileName: string = "airports.parquet";

        console.log("Inserting data");
        cur.execute(`{fn teradata_read_parquet(${parquetFileName})} insert into voltab (?, ?, ?)`);

        cur.execute("select * from voltab order by 1");
        console.log(cur.fetchall());
    } finally {
        cur.close();
    }
} finally {
    con.close();
}
