# Running Tests

1. Go through the [Setup](SETUPRUNNING.md) steps.
1. Activate the correct version of `node`:
    ```
    nvm use
    ```
1. Prepare the test database, using e.g. [Vantage Express](https://downloads.teradata.com/download/database/vantage-express-for-vmware-player):
    ```
    -- create user TD01 and give the user required privileges
    CREATE USER TD01
        AS  
        PERMANENT = 1000000000 BYTES 
        PASSWORD = TD01
        TEMPORARY = 1000000000 BYTES 
        SPOOL = 1000000000 BYTES;
    
    GRANT CREATE PROCEDURE, EXECUTE PROCEDURE, DROP PROCEDURE, 
    CREATE EXTERNAL PROCEDURE, CREATE FUNCTION, DROP FUNCTION
    ON TD01
    TO TD01;
    ```
1. Edit `test/configurations.ts` and modify the `'{ "host": "<hostname>", "user": "<username>", "password": "<password>" }'` with correct connection parameters.
1. Run the Node.js Javascript test files:
    ```
    npm run test
    ```
