// Copyright 2023 by Teradata Corporation. All rights reserved.

// This sample program demonstrates how to obtain and display session information.

// @ts-ignore
import * as teradatasql from "teradatasql";

type Row = any[] | null;

const con: teradatasql.TeradataConnection = teradatasql.connect({ host: "whomooz", user: "guest", password: "please" });
try {
	const cur: teradatasql.TeradataCursor = con.cursor();
	try {
		cur.execute("help session");
		const row: Row = cur.fetchone();
		if (row) {
			for (let i: number = 0; i < row.length; i++) {
				if (cur.description) {
					console.log(`${cur.description[i][0].padEnd(40)}, ${row[i]}`);
				}
			}
		}
	} finally {
		cur.close();
	}
} finally {
	con.close();
}
