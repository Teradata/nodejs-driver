## Examples Guide for Node.js Driver for Teradata

### Setup

#### NPM
* Ensure you have **Node 8.x+** (on a Mac use Homebrew and `brew install node@8.9.4`)
* Ensure you have **npm 3.x+** installed.

#### MSVC Redistributables 2015 (Microsoft Windows only)
* MSVC Redistributables are required to run the Teradata Node.js Driver on Microsoft Windows
* If when running an error occurs for finding the `ref.node` native module then run the following command as an administrator
  * `npm install --global windows-build-tools --vs2015`

#### Typescript
* Command line go to example directory
  * `cd examples/typescript`
* Install dependencies
  * `npm install`
    * Click to view dependencies in [package.json](typescript/package.json)

* Compile all the typescript examples
  * `npm run build`

#### Javascript
* Command line go to example directory
  * `cd example/javascript`
* Install dependencies
  * `npm install`
    * Click to view dependencies in [package.json](javascript/package.json)

---

### Run Examples

#### Typescript
Modify the following section with correct connection parameters in `each` example file before running:
```
const connParams: ITDConnParams = {
  host: '<host>',
  log: '0',
  password: '<password>',
  user: '<username>',
};
```
##### Examples
* Create and Close a Connection
  * Click to view source in : [typescript/src/connection.ts](typescript/src/connection.ts)
  * Run example from command line: `node dist/connection.js`
* Simple Select of Data
  * Click to view source in : [typescript/src/simple-select.ts](typescript/src/simple-select.ts)
  * Run example from command line: `node dist/simple-select.js`
* Obtain the version number for the Teradata Database
  * Click to view source in : [typescript/src/database-version.ts](typescript/src/database-version.ts)
  * Run example from command line: `node dist/database-version.js`
* Create a C User-Defined Function
  * Click to view source in :
    * [typescript/src/elicit-file.ts](typescript/src/elicit-file.ts)
    * [typescript/src/udfinc.c](typescript/src/udfinc.c)
  * Run example from command line: `node dist/elicit-file.js`
* Encrypt a password, saves the encryption key in one file, and saves the encrypted password in a second file
  * Click to view source in : [typescript/src/encrypt-password.ts](typescript/src/encrypt-password.ts)
  * Run example from command line: `node dist/encrypt-password.js <params>`
  * See comments in the example source for <_params_> details
* Obtain the session information
  * Click to view source in : [typescript/src/help-session.ts](typescript/src/help-session.ts)
  * Run example from command line: `node dist/help-session.js`
* Inserts data values to a table in Teradata database
  * Click to view source in : [typescript/src/inserts.ts](typescript/src/inserts.ts)
  * Run example from command line: `node dist/inserts.js`
* Prepare a SQL request without executing it and obtain SQL statement metadata
  * Click to view source in : [typescript/src/metadata-from-prepare.ts](typescript/src/metadata-from-prepare.ts)
  * Run example from command line: `node dist/metadata-from-prepare.js`
* Create and call a SQL stored procedure with a variety of parameters and dynamic result sets
  * Click to view source in : [typescript/src/stored-proc.ts](typescript/src/stored-proc.ts)
  * Run example from command line: `node dist/stored-proc.js`
#### Javascript
Modify the following section with correct connection parameters in `each` example file before running:
```
var connParams = {
  host: '<host>',
  log: '0',
  password: '<password>',
  user: '<username>'
};
```
##### Examples
* Create and Close a Connection
  * Click to view source in : [javascript/src/connection.js](javascript/src/connection.js)
  * Run example from command line: `node src/connection.js`
* Simple Select of Data
  * Click to view source in : [javascript/src/simple-select.js](javascript/src/simple-select.js)
  * Run example from command line: `node src/simple-select.js`
* Obtain the version number for the Teradata Database
  * Click to view source in : [javascript/src/database-version.js](javascript/src/database-version.js)
  * Run example from command line: `node src/database-version.js`
* Create a C User-Defined Function
  * Click to view source in :
    * [javascript/src/elicit-file.js](javascript/src/elicit-file.js)
    * [javascript/src/udfinc.c](javascript/src/udfinc.c)
  * Run example from command line: `node src/elicit-file.js`
* Encrypt a password, saves the encryption key in one file, and saves the encrypted password in a second file
  * Click to view source in : [javascript/src/encrypt-password.js](javascript/src/encrypt-password.js)
  * Run example from command line: `node src/encrypt-password.js <params>`
  * See comments in the example source for _<params>_ details
* Obtain the session information
  * Click to view source in : [javascript/src/help-session.js](javascript/src/help-session.js)
  * Run example from command line: `node src/help-session.js`
* Inserts data values to a table in Teradata database
  * Click to view source in : [javascript/src/inserts.js](javascript/src/inserts.js)
  * Run example from command line: `node src/inserts.js`
* Prepare a SQL request without executing it and obtain SQL statement metadata
  * Click to view source in : [javascript/src/metadata-from-prepare.js](javascript/src/metadata-from-prepare.js)
  * Run example from command line: `node src/metadata-from-prepare.js`
* Create and call a SQL stored procedure with a variety of parameters and dynamic result sets
  * Click to view source in : [javascript/src/stored-proc.js](javascript/src/stored-proc.js)
  * Run example from command line: `node src/stored-proc.js`
---
