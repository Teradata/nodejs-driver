// Copyright 2023 by Teradata Corporation. All rights reserved.

// This sample program demonstrates how to specify the data type of parameter marker bind values.
// Use the escape function teradata_parameter to override the data type for a parameter marker bind value.

// @ts-ignore
import { TeradataConnection, TeradataCursor } from "teradatasql";

type Row = any[] | null;

function byte(s: string, encoding?: BufferEncoding): Uint8Array {
    return Uint8Array.from(Buffer.from(s, encoding));
}

const con: TeradataConnection = new TeradataConnection();

con.connect({ host: "whomooz", user: "guest", password: "please" });

const cur: TeradataCursor = con.cursor();

const aao: any[][] = [
    ["BYTEINT", 1n],
    ["SMALLINT", 2n],
    ["INTEGER", 3n],
    ["BIGINT", 4n],
    ["FLOAT", "5"],
    ["NUMBER", "6"],
    ["DECIMAL(18)", "7"],
    ["DECIMAL(38)", "8"],
    ["PERIOD(DATE)", "0009-09-09,0909-09-09"],
    ["PERIOD(TIME)", "10:10:10.101000,10:10:10.101010"],
    ["PERIOD(TIME WITH TIME ZONE)", "11:11:11.111110+11:11,11:11:11.111111+11:11"],
    ["PERIOD(TIMESTAMP)", "1212-01-12 12:12:12.121212,1212-02-12 12:12:12.121212"],
    ["PERIOD(TIMESTAMP WITH TIME ZONE)", "1313-01-13 13:13:13.131313+13:13,1313-02-13 13:13:13.131313+13:13"],
    ["INTERVAL YEAR(4)", "-1414"],
    ["INTERVAL YEAR(4) TO MONTH", "-1515-11"],
    ["INTERVAL MONTH(4)", "-1616"],
    ["INTERVAL DAY(4)", "-1717"],
    ["INTERVAL DAY(4) TO HOUR", "-1818 18"],
    ["INTERVAL DAY(4) TO MINUTE", "-1919 19:19"],
    ["INTERVAL DAY(4) TO SECOND", "-2020 20:20:20.202020"],
    ["INTERVAL HOUR(4)", "-2121"],
    ["INTERVAL HOUR(4) TO MINUTE", "-2222:22"],
    ["INTERVAL HOUR(4) TO SECOND", "-2323:23:23.232323"],
    ["INTERVAL MINUTE(4)", "-2424"],
    ["INTERVAL MINUTE(4) TO SECOND", "-2525:25.252525"],
    ["INTERVAL SECOND(4)", "-2626.262626"],
    ["BYTE(2)", byte("27")],
    ["CHAR(2)", "28"],
];

console.log("   teradata_parameter bind type      Result from TYPE function            Round-trip data value");
console.log("   --------------------------------  -----------------------------------  ---------------------");

for (let n: number = 0; n < aao.length; n++) {
    const ao: any[] = aao[n];
    const sDataType: string = ao[0];
    const oValue: any = ao[1];

    // The result from the built-in TYPE function shows the data type that the database receives from the driver.
    cur.execute("{fn teradata_parameter(1," + sDataType + ")}select trim(type(?))", [null]);
    const row: Row = cur.fetchone();
    const sTypeFuncResult: string = row ? row[0] : "";

    // The database does not support binding a PERIOD value to a select-list parameter marker, so we go through a table.
    let oOutput: any;
    if (sDataType.startsWith("PERIOD")) {
        cur.execute("create volatile table volatiletable (c1 " + sDataType + ") no primary index on commit preserve rows");
        cur.execute("{fn teradata_parameter(1," + sDataType + ")}insert into volatiletable values (?)", [oValue]);
        cur.execute("select * from volatiletable");

        const row: Row = cur.fetchone();
        oOutput = row ? row[0] : null;
        cur.execute("drop table volatiletable");
    } else if (sDataType.startsWith("BYTE(")) {
        oOutput = 'byte("' + Buffer.from(oValue).toString() + '")';
    } else {
        // Other data types can be bound to a select-list parameter marker.
        cur.execute("{fn teradata_parameter(1," + sDataType + ")}select ?", [oValue]);
        const row: Row = cur.fetchone();
        oOutput = row ? row[0] : null;
    }
    console.log(`${(n + 1).toString().padEnd(2)} ${sDataType.padEnd(33)} ${sTypeFuncResult.padEnd(36)} ${oOutput}`);
}

cur.close();
con.close();
