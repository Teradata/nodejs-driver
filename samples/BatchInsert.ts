// Copyright 2023 by Teradata Corporation. All rights reserved.

// This sample program demonstrates how to insert a batch of rows.

// @ts-ignore
import * as teradatasql from "teradatasql";

const con: teradatasql.TeradataConnection = teradatasql.connect({ host: "whomooz", user: "guest", password: "please" });
try {
	const cur: teradatasql.TeradataCursor = con.cursor();
	try {
		cur.execute("create volatile table voltab (c1 integer, c2 varchar(100)) on commit preserve rows");

		cur.execute("insert into voltab (?, ?)", [
			[1, "abc"],
			[2, "def"],
			[3, "ghi"],
		]);

		cur.execute("select * from voltab order by 1");
		console.log(cur.fetchall());
	} finally {
		cur.close();
	}
} finally {
	con.close();
}
