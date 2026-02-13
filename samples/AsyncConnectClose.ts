// Copyright 2025 by Teradata Corporation. All rights reserved.

// This sample program demonstrates how to use connectAsync and closeAsync
// for non-blocking connection operations.

// @ts-ignore
import * as teradatasql from "teradatasql";

async function main() {
    const con: teradatasql.TeradataConnection = new teradatasql.TeradataConnection();
    try {
        console.log("Connecting asynchronously to the database...");
        await con.connectAsync({ host: "whomooz", user: "guest", password: "please" });
        console.log("Connected successfully!");

        const cur: teradatasql.TeradataCursor = con.cursor();
        try {
            // Execute a simple query to verify the connection works
            cur.execute("select current_timestamp");
            const row: any[] | null = cur.fetchone();
            if (row) {
                console.log(`Current timestamp: ${row[0]}`);
            }

            // Demonstrate a query execution
            cur.execute("select 'Hello from Teradata!' as greeting");
            const result: any[] | null = cur.fetchone();
            if (result) {
                console.log(`Query result: ${result[0]}`);
            }
        } finally {
            cur.close();
        }

        console.log("Closing connection asynchronously...");
        await con.closeAsync();
        console.log("Connection closed successfully!");
    } catch (error: any) {
        console.error(`Error: ${error.message}`);
        // Ensure connection is closed even if an error occurs
        try {
            if (con) {
                await con.closeAsync();
            }
        } catch (closeError: any) {
            console.error(`Error closing connection: ${closeError.message}`);
        }
    }
} // end main

// Run the async main function
main()
    .then(() => {
        console.log("Sample completed successfully");
    })
    .catch((error: any) => {
        console.error(`Unexpected error: ${error.message}`);
        process.exit(1);
    });
