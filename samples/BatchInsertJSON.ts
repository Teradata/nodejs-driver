// Copyright 2026 by Teradata Corporation. All rights reserved.

// This sample program demonstrates how to insert a batch of rows using a JSON file.
// It also illustrates dual treatment of a nested JSON object: the raw JSON
// string is stored verbatim in the "address" column, while the flattened
// sub-field "city" is stored in a separate column.

import * as fs from "fs";
// @ts-ignore
import * as teradatasql from "teradatasql";

// Each record has three top-level keys:
//   id      -- scalar integer
//   name    -- scalar string
//   address -- nested object; its raw JSON string maps to the "address" column
//              and its sub-field "city" maps to the "city" column.
const records = [
    { id: 1, name: "Alice", address: { city: "Boston"       } },
    { id: 2, name: "Bob",   address: { city: "Austin"       } },
    { id: 3, name: "Carol", address: { city: "Chicago"      } },
    { id: 4, name: "Dave",  address: { city: "Denver"       } },
    { id: 5, name: "Erin",  address: { city: "Eugene"       } },
    { id: 6, name: "Frank", address: { city: "Fresno"       } },
    { id: 7, name: "Grace", address: { city: "Houston"      } },
    { id: 8, name: "Hank",  address: { city: "Irvine"       } },
    { id: 9, name: "Iris",  address: { city: "Jacksonville" } },
];

const con: teradatasql.TeradataConnection = teradatasql.connect({ host: "whomooz", user: "guest", password: "please" });
try {
    const cur: teradatasql.TeradataCursor = con.cursor();
    try {
        cur.execute("create volatile table voltab (id integer, name varchar(20), address varchar(200), city varchar(20)) on commit preserve rows");

        const sFileName: string = "dataBatchJs.json";
        console.log(`Writing ${sFileName}`);
        fs.writeFileSync(sFileName, JSON.stringify(records));

        try {
            // The INSERT column list (id, name, address, city) drives name-based matching:
            //   ?1 -> id      (scalar)
            //   ?2 -> name    (scalar)
            //   ?3 -> address (raw JSON object string -- dual treatment)
            //   ?4 -> city    (flattened sub-field of address)
            console.log("Inserting data");
            cur.execute(`{fn teradata_read_json(${sFileName})} insert into voltab (id, name, address, city) values (?, ?, ?, ?)`);
        } finally {
            fs.unlinkSync(sFileName);
        }

        cur.execute("select id, name, address, city from voltab order by 1");
        console.log(cur.fetchall());
    } finally {
        cur.close();
    }
} finally {
    con.close();
}
