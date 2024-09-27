// Copyright 2024 by Teradata Corporation. All rights reserved.

// This sample program demonstrates how to insert a batch of rows.

// @ts-ignore
import { TeradataConnection, TeradataCursor } from "teradatasql";

const con: TeradataConnection = new TeradataConnection();

con.connect({ host: "whomooz", user: "guest", password: "please" });

const cur: TeradataCursor = con.cursor();

async function worker() {
    let dStart: number = 0;
    let dElapsed: number = 0;

    try {
        dStart = Date.now();

        let sql: string = "select mysleep (10)"; // sleep for 10 seconds
        console.log(`worker() ${sql}`);        
        await cur.executeAsync(sql);
        
        dElapsed = Date.now() - dStart;
    } catch (error: any) {
        dElapsed = Date.now() - dStart;
        console.log(`worker() received error: ${error.message.split("\n")[0]}`);
    } finally {
        console.log(`worker() completed in ${dElapsed / 1000} seconds`);
    }
}

async function main() {
    let sql: string = "drop function mysleep";

    console.log(`main() ${sql}`);
    cur.execute(sql, undefined, 5589); // ignoreErrors=5589

    sql = "create function mysleep (integer) returns integer language c no sql parameter style sql external name 'CS!udfsleep!udfsleep.c!F!udfsleep'";
    console.log(`main() ${sql}`);
    cur.execute(sql);

    console.log("main() starting worker()") // The query will take more than 10 seconds to complete if not cancelled
    const result: Promise<void> = worker();

    console.log("main() waiting for 5 seconds");

    const dStart: number = Date.now();
    await new Promise((resolve) => setTimeout(resolve, 5000));

    const dElapsed = Date.now() - dStart;
    console.log(`main() waited ${dElapsed / 1000} seconds`);

    try {
        console.log("main() calling cancel");
        con.cancel();
        console.log("main() completed cancel");
    } catch (error: any) {
        console.log(`main() ${error.message}`);
    }

    try {
        console.log("main() waiting for worker() to finish");
        await result;
        console.log("main() done waiting for worker() finishes");
    } catch (error: any) {
        console.log(`main() ${error.message}`);        
    } finally {
        sql = "drop function mysleep";
        console.log(`main() ${sql}`);
        cur.execute(sql);
        cur.close();
        con.close();
    }
}

main();
