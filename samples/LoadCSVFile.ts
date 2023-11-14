// Copyright 2023 by Teradata Corporation. All rights reserved.

// This sample program demonstrates two different approaches to load data values
// from a CSV file and insert those data values into a database table.
// This sample program requires the airports.csv file to be located in the current directory.

// Run "npm install csv" to install the CSV module

import * as fs from "fs";
import { parse } from "csv-parse/sync";
// @ts-ignore
import { TeradataConnection, TeradataCursor } from "teradatasql";

const con: TeradataConnection = new TeradataConnection();

con.connect({ host: "whomooz", user: "guest", password: "please" });

const cur: TeradataCursor = con.cursor();

cur.execute("create volatile table Airports (City varchar(100), Airport varchar(100), AirportCode varchar(10)) on commit preserve rows");

console.log("Slower approach - use a cvs module to parse data values from a CSV file");
const records: string[][] = parse(fs.readFileSync("airports.csv", { encoding: "utf-8" }));
cur.execute("insert into Airports (?, ?, ?)", records);
cur.execute("select AirportCode, Airport, City from Airports order by AirportCode");
console.log(cur.fetchall());

cur.execute("delete from Airports");

console.log("Faster approach - the driver loads data values from a CSV file");
cur.execute("{fn teradata_read_csv(airports.csv)}insert into Airports (?, ?, ?)");
cur.execute("select AirportCode, Airport, City from Airports order by AirportCode");
console.log(cur.fetchall());

cur.close();
con.close();
