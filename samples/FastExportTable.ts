// Copyright 2023 by Teradata Corporation. All rights reserved.

// This sample program demonstrates how to FastExport rows from a table.

// @ts-ignore
import * as teradatasql from "teradatasql"

type Rows = any[];

const con: teradatasql.TeradataConnection = teradatasql.connect({ host: "whomooz", user: "guest", password: "please" });
try {
	const cur: teradatasql.TeradataCursor = con.cursor();
	try {
		const cur2: teradatasql.TeradataCursor = con.cursor();
		try {
			const sTableName: string = "FastExportTable";

			let sRequest: string = "DROP TABLE " + sTableName;
			try {
				console.log(sRequest);
				cur.execute(sRequest);
			} catch (ex: any) {
				if (ex instanceof teradatasql.OperationalError) {
					console.log("Ignoring", ex.message.split("\n")[0]);
				} else {
					throw ex;
				}
			}

			sRequest = "CREATE TABLE " + sTableName + " (c1 INTEGER NOT NULL, c2 VARCHAR(10))";
			console.log(sRequest);
			cur.execute(sRequest);

			try {
				const sInsert: string = "INSERT INTO " + sTableName + " VALUES (?, ?)";
				console.log(sInsert);
				cur.execute(sInsert, [
					[1, null],
					[2, "abc"],
					[3, "def"],
					[4, "mno"],
					[5, null],
					[6, "pqr"],
					[7, "uvw"],
					[8, "xyz"],
					[9, null],
				]);

				let sSelect = "{fn teradata_try_fastexport}SELECT * FROM " + sTableName;
				console.log(sSelect);
				cur.execute(sSelect);
				let rows: Rows = cur.fetchall();
				for (const row of rows.sort()) {
					console.log(row);
				}

				sRequest = "{fn teradata_nativesql}{fn teradata_get_warnings}" + sSelect;
				console.log(sRequest);
				cur2.execute(sRequest);
				rows = cur2.fetchall();
				for (const row of rows) {
					console.log(row);
				}

				sRequest = "{fn teradata_nativesql}{fn teradata_get_errors}" + sSelect;
				console.log(sRequest);
				cur2.execute(sRequest);
				rows = cur2.fetchall();
				for (const row of rows) {
					console.log(row);
				}

				sRequest = "{fn teradata_nativesql}{fn teradata_logon_sequence_number}" + sSelect;
				console.log(sRequest);
				cur2.execute(sRequest);
				rows = cur2.fetchall();
				for (const row of rows) {
					console.log(row);
				}
			} finally {
				sRequest = "DROP TABLE " + sTableName;
				console.log(sRequest);
				cur2.execute(sRequest);
			}
		} finally {
			cur2.close ()
		}
	} finally {
		cur.close ()
	}
} finally {
	con.close ()
}
