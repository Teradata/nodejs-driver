// Copyright 2024 by Teradata Corporation. All rights reserved.

// This sample program demonstrates how to execute a SQL request and display results.

// @ts-ignore
import { TeradataConnection, TeradataCursor } from "teradatasql"

if (process.argv.length != 6) {
	console.log ("Parameters: Host User Password SQL")
	process.exit (1)
}

const sHost     : string = process.argv [2]
const sUser     : string = process.argv [3]
const sPassword : string = process.argv [4]
const sSQL      : string = process.argv [5]

type Rows = any []
type Row  = any [] | null

let con: TeradataConnection = new TeradataConnection ()
try {
	con.connect ({ host: sHost, user: sUser, password: sPassword })

	let cur: TeradataCursor = con.cursor ()
	try {
		console.log (`Executing ${sSQL}`)
		cur.execute (sSQL)

		for (let nResult: number = 1 ; ; nResult++) {
			const rows: Rows = cur.fetchall ()

			for (let iRow: number = 0 ; iRow < rows.length ; iRow++) {
				const row: Row = rows [iRow]

				for (let iColumn: number = 0 ; row != null && iColumn < row.length ; iColumn++) {
					let oValue : any    = row [iColumn]
					let sType  : string = typeof oValue

					if (sType === "number") {
						const n: number = Number (cur.description [iColumn][5])
						if (n > 0) {
							oValue = oValue.toFixed (n)
						}
					} else if (sType === "object") {
						sType = oValue.constructor.name
					}

					if (sType === "Uint8Array") {
						oValue = Buffer.from (oValue).toString ("hex")
					}

					console.log (`Result ${nResult} Row ${iRow + 1} Column ${iColumn + 1} ${cur.description [iColumn][0]} ${sType} = ${oValue}`)

				} // end for iColumn
			} // end for iRow

			if (! cur.nextset ()) {
				break
			}
		} // end for nResult
	} finally {
		cur.close ()
	}
} finally {
	con.close ()
}
