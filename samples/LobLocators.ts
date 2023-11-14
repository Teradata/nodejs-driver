// Copyright 2023 by Teradata Corporation. All rights reserved.

//  This sample program demonstrates how to use the teradata_lobselect(S) and teradata_fake_result_sets
//  escape functions to obtain LOB locators instead of the default inline LOB values from a result set,
//  and then subsequently read the LOB values from the LOB locators.

// @ts-ignore
import { TeradataConnection, TeradataCursor } from "teradatasql";

type Row = any[] | null;

function byte(s: string, encoding?: BufferEncoding): Uint8Array {
    return Uint8Array.from(Buffer.from(s, encoding));
}

function ReadLobValueFromLobLocator(con: TeradataConnection, abyLocator: Uint8Array, sTypeName: string): any {
    if (!(abyLocator instanceof Uint8Array)) {
        throw TypeError("abyLocator must be Unint8Array");
    }

    const cur: TeradataCursor = con.cursor();

    sSQL = "{fn teradata_parameter(1," + sTypeName + ")}select ?";
    console.log(sSQL);
    cur.execute(sSQL, [abyLocator]);

    const row: Row = cur.fetchone();

    let result: any = null;
    if (row) {
        result = row[0];
    }

    cur.close();

    return result;
}

const con: TeradataConnection = new TeradataConnection();

con.connect({ host: "whomooz", user: "guest", password: "please" });

const cur: TeradataCursor = con.cursor();

let sSQL: string = "create volatile table voltab (c1 integer, c2 blob, c3 clob, c4 xml, c5 st_geometry, c6 json) on commit preserve rows";
console.log(sSQL);
cur.execute(sSQL);

const sXML: string = '<?xml version="1.0" encoding="UTF-8"?><foo>bar</foo>';
const sJSON: string = '{"foo":"bar"}';

sSQL =
    "insert into voltab values (1, '" + Buffer.from(byte("ABC")).toString("hex") + "'xbv, 'clobval', '" + sXML + "', 'point(1 2)', '" + sJSON + "')";
console.log(sSQL);
cur.execute(sSQL);

sSQL = "{fn teradata_lobselect(S)}{fn teradata_fake_result_sets}select * from voltab order by 1";
console.log(sSQL);
cur.execute(sSQL);

const aoFakeResultSetRow: Row = cur.fetchone();

if (aoFakeResultSetRow) {
    const sResultSetColumnMetadataJSON: string = aoFakeResultSetRow[7].toString();
    const amapResultSetColumnMetadata: any = JSON.parse(sResultSetColumnMetadataJSON);

    cur.nextset();
    const aoRealResultSetRow: Row = cur.fetchone();

    if (aoRealResultSetRow) {
        for (let iColumn: number = 0; iColumn < aoRealResultSetRow.length; iColumn++) {
            let oValue = aoRealResultSetRow[iColumn];
            const sTypeName: string = amapResultSetColumnMetadata[iColumn]["TypeName"];

            if (sTypeName.startsWith("LOCATOR(")) {
                oValue = ReadLobValueFromLobLocator(con, oValue, sTypeName);
            }
            console.log(`Column ${iColumn + 1} ${sTypeName} value: ${oValue}`);
        }
    }
}

cur.close();
con.close();
