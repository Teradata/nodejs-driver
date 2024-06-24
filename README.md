## Teradata SQL Driver for Node.js

This package enables Node.js applications to connect to the Teradata Database.

This package requires 64-bit Node.js 12 or later, and runs on Windows, macOS, and Linux. 32-bit Node.js is not supported.

> Please note that Node.js versions 14 and 16 are not currently supported for Linux and macOS. An issue ([ref-napi#54](https://github.com/node-ffi-napi/ref-napi/issues/54)) in Node.js versions 14 and 16 affects the `node-ffi-napi` library that the driver depends on. This issue is fixed in later versions of Node.js.

For community support, please visit [Teradata Community](https://support.teradata.com/community).

For Teradata customer support, please visit [Teradata Customer Service](https://support.teradata.com/).

Please note, this driver may contain beta/preview features ("Beta Features"). As such, by downloading and/or using the driver, in addition to agreeing to the licensing terms below, you acknowledge that the Beta Features are experimental in nature and that the Beta Features are provided "AS IS" and may not be functional on any machine or in any environment.

Copyright 2024 Teradata. All Rights Reserved.

### Table of Contents

* [Features](#Features)
* [Limitations](#Limitations)
* [Installation](#Installation)
* [License](#License)
* [Documentation](#Documentation)
* [Sample Programs](#SamplePrograms)
* [Using the Driver](#Using)
* [Connection Parameters](#ConnectionParameters)
* [COP Discovery](#COPDiscovery)
* [Stored Password Protection](#StoredPasswordProtection)
* [Logon Authentication Methods](#LogonMethods)
* [Client Attributes](#ClientAttributes)
* [User STARTUP SQL Request](#UserStartup)
* [Transaction Mode](#TransactionMode)
* [Auto-Commit](#AutoCommit)
* [Data Types](#DataTypes)
* [Null Values](#NullValues)
* [Undefined Values](#UndefinedValues)
* [Character Export Width](#CharacterExportWidth)
* [Module Constructors](#ModuleConstructors)
* [Module Exceptions](#ModuleExceptions)
* [Connection Attributes](#ConnectionAttributes)
* [Connection Methods](#ConnectionMethods)
* [Cursor Attributes](#CursorAttributes)
* [Cursor Methods](#CursorMethods)
* [Type Objects](#TypeObjects)
* [Escape Syntax](#EscapeSyntax)
* [FastLoad](#FastLoad)
* [FastExport](#FastExport)
* [CSV Batch Inserts](#CSVBatchInserts)
* [CSV Export Results](#CSVExportResults)
* [Change Log](#ChangeLog)

<a id="Features"></a>

### Features

At the present time, the driver offers the following features.

* Supported for use with Teradata database 16.20 and later releases.
* [COP Discovery](#COPDiscovery).
* Laddered Concurrent Connect.
* [HTTPS](https://en.wikipedia.org/wiki/HTTPS)/[TLS](https://en.wikipedia.org/wiki/Transport_Layer_Security) connections with Teradata database 16.20.53.30 and later.
* Encrypted logon.
* [GSS-API](https://en.wikipedia.org/wiki/Generic_Security_Services_Application_Program_Interface) logon authentication methods `KRB5` (Kerberos), `LDAP`, `TD2`, and `TDNEGO`.
* [OpenID Connect (OIDC)](https://en.wikipedia.org/wiki/OpenID#OpenID_Connect_(OIDC)) logon authentication methods `BEARER`, `BROWSER`, `CODE`, `CRED`, `JWT`, `ROPC`, and `SECRET`.
* Data encryption provided by TLS for HTTPS connections.
* For non-HTTPS connections, data encryption governed by central administration or enabled via the `encryptdata` connection parameter.
* Unicode character data transferred via the UTF8 session character set.
* [Auto-commit]((#AutoCommit)) for ANSI and TERA transaction modes.
* Result set row size up to 1 MB.
* Multi-statement requests that return multiple result sets.
* Most JDBC escape syntax.
* Parameterized SQL requests with question-mark parameter markers.
* Parameterized batch SQL requests with multiple rows of data bound to question-mark parameter markers.
* Auto-Generated Key Retrieval (AGKR) for identity column values and more.
* Large Object (LOB) support for the BLOB and CLOB data types.
* Complex data types such as `XML`, `JSON`, `DATASET STORAGE FORMAT AVRO`, and `DATASET STORAGE FORMAT CSV`.
* ElicitFile protocol support for DDL commands that create external UDFs or stored procedures and upload a file from client to database.
* `CREATE PROCEDURE` and `REPLACE PROCEDURE` commands.
* Stored Procedure Dynamic Result Sets.
* FastLoad and FastExport.
* Monitor partition.

<a id="Limitations"></a>

### Limitations

* The UTF8 session character set is always used. The `charset` connection parameter is not supported.
* No support yet for Recoverable Network Protocol and Redrive.

<a id="Installation"></a>

### Installation

The driver depends on the `ffi-napi`, `ref-napi`, `ref-array-di` packages which are available from [npmjs.com](http://www.npmjs.com).

Use `npm install teradatasql` to download and install the driver and its dependencies automatically.

<a id="License"></a>

### License

Use of the driver is governed by the *License Agreement for the Teradata SQL Driver for Node.js*.

When the driver is installed, the `LICENSE` and `THIRDPARTYLICENSE` files are placed in the `teradatasql` directory under your `node_modules` installation directory.

In addition to the license terms, the driver may contain beta/preview features ("Beta Features"). As such, by downloading and/or using the driver, in addition to the licensing terms, you acknowledge that the Beta Features are experimental in nature and that the Beta Features are provided "AS IS" and may not be functional on any machine or in any environment.

<a id="Documentation"></a>

### Documentation

When the driver is installed, the `README.md` file is placed in the `teradatasql` directory under your `node_modules` installation directory. This permits you to view the documentation offline, when you are not connected to the Internet.

The `README.md` file is a plain text file containing the documentation for the driver. While the file can be viewed with any text file viewer or editor, your viewing experience will be best with an editor that understands Markdown format.

<a id="SamplePrograms"></a>

### Sample Programs

Sample programs are provided to demonstrate how to use the driver. When the driver is installed, the sample programs are placed in the `teradatasql/samples` directory under your `node_modules` installation directory.

The sample programs are coded with a fake database hostname `whomooz`, username `guest`, and password `please`. Substitute your actual database hostname and credentials before running a sample program.

Program                                                                                                              | Purpose
-------------------------------------------------------------------------------------------------------------------- | ---
[AGKRBatchInsert.ts](https://github.com/Teradata/nodejs-driver/blob/develop/samples/AGKRBatchInsert.ts)              | Demonstrates how to insert a batch of rows with Auto-Generated Key Retrieval (AGKR)
[AGKRInsertSelect.ts](https://github.com/Teradata/nodejs-driver/blob/develop/samples/AGKRInsertSelect.ts)            | Demonstrates Insert/Select with Auto-Generated Key Retrieval (AGKR)
[BatchInsert.ts](https://github.com/Teradata/nodejs-driver/blob/develop/samples/BatchInsert.ts)                      | Demonstrates how to insert a batch of rows
[BatchInsertCSV.ts](https://github.com/Teradata/nodejs-driver/blob/develop/samples/BatchInsertCSV.ts)                | Demonstrates how to insert a batch of rows from a CSV file
[BatchInsPerf.ts](https://github.com/Teradata/nodejs-driver/blob/develop/samples/BatchInsPerf.ts)                    | Measures time to insert one million rows
[CharPadding.ts](https://github.com/Teradata/nodejs-driver/blob/develop/samples/CharPadding.ts)                      | Demonstrates the database's *Character Export Width* behavior
[CommitRollback.ts](https://github.com/Teradata/nodejs-driver/blob/develop/samples/CommitRollback.ts)                | Demonstrates commit and rollback methods with auto-commit off.
[DecimalDigits.ts](https://github.com/Teradata/nodejs-driver/blob/develop/samples/DecimalDigits.ts)                  | Demonstrates how to format decimal.Decimal values.
[DriverDatabaseVersion.ts](https://github.com/Teradata/nodejs-driver/blob/develop/samples/DriverDatabaseVersion.ts)  | Displays the driver version and database version
[ElicitFile.ts](https://github.com/Teradata/nodejs-driver/blob/develop/samples/ElicitFile.ts)                        | Demonstrates C source file upload to create a User-Defined Function (UDF)
[ExecuteRequest.ts](https://github.com/Teradata/nodejs-driver/blob/develop/samples/ExecuteRequest.ts)                | Demonstrates how to execute a SQL request and display results
[ExportCSVResult.ts](https://github.com/Teradata/nodejs-driver/blob/develop/samples/ExportCSVResult.ts)              | Demonstrates how to export a query result set to a CSV file
[ExportCSVResults.ts](https://github.com/Teradata/nodejs-driver/blob/develop/samples/ExportCSVResults.ts)            | Demonstrates how to export multiple query result sets to CSV files
[FakeExportCSVResults.ts](https://github.com/Teradata/nodejs-driver/blob/develop/samples/FakeExportCSVResults.ts)    | Demonstrates how to export multiple query result sets with the metadata to CSV files
[FakeResultSetCon.ts](https://github.com/Teradata/nodejs-driver/blob/develop/samples/FakeResultSetCon.ts)            | Demonstrates connection parameter for fake result sets
[FakeResultSetEsc.ts](https://github.com/Teradata/nodejs-driver/blob/develop/samples/FakeResultSetEsc.ts)            | Demonstrates escape function for fake result sets
[FastExportCSV.ts](https://github.com/Teradata/nodejs-driver/blob/develop/samples/FastExportCSV.ts)                  | Demonstrates how to FastExport rows from a table to a CSV file
[FastExportTable.ts](https://github.com/Teradata/nodejs-driver/blob/develop/samples/FastExportTable.ts)              | Demonstrates how to FastExport rows from a table
[FastLoadBatch.ts](https://github.com/Teradata/nodejs-driver/blob/develop/samples/FastLoadBatch.ts)                  | Demonstrates how to FastLoad batches of rows
[FastLoadCSV.ts](https://github.com/Teradata/nodejs-driver/blob/develop/samples/FastLoadCSV.ts)                      | Demonstrates how to FastLoad batches of rows from a CSV file
[HelpSession.ts](https://github.com/Teradata/nodejs-driver/blob/develop/samples/HelpSession.ts)                      | Displays session information
[IgnoreErrors.ts](https://github.com/Teradata/nodejs-driver/blob/develop/samples/IgnoreErrors.ts)                    | Demonstrates how to ignore errors
[InsertLob.ts](https://github.com/Teradata/nodejs-driver/blob/develop/samples/InsertLob.ts)                          | Demonstrates how to insert BLOB and CLOB values
[InsertXML.ts](https://github.com/Teradata/nodejs-driver/blob/develop/samples/InsertXML.ts)                          | Demonstrates how to insert and retrieve XML values
[LoadCSVFile.ts](https://github.com/Teradata/nodejs-driver/blob/develop/samples/LoadCSVFile.ts)                      | Demonstrates how to load data from a CSV file into a table
[LobLocators.ts](https://github.com/Teradata/nodejs-driver/blob/develop/samples/LobLocators.ts)                      | Demonstrates how to use LOB locators
[MetadataFromPrepare.ts](https://github.com/Teradata/nodejs-driver/blob/develop/samples/MetadataFromPrepare.ts)      | Demonstrates how to prepare a SQL request and obtain SQL statement metadata
[ParamDataTypes.ts](https://github.com/Teradata/nodejs-driver/blob/develop/samples/ParamDataTypes.ts)                | Demonstrates how to specify data types for parameter marker bind values
[ShowCommand.ts](https://github.com/Teradata/nodejs-driver/blob/develop/samples/ShowCommand.ts)                      | Displays the results from the `SHOW` command
[StoredProc.ts](https://github.com/Teradata/nodejs-driver/blob/develop/samples/StoredProc.ts)                        | Demonstrates how to create and call a SQL stored procedure
[TJEncryptPassword.ts](https://github.com/Teradata/nodejs-driver/blob/develop/samples/TJEncryptPassword.ts)          | Creates encrypted password files

<a id="Using"></a>

### Using the Driver

Example usage of establishing a connection:
```
    const teradatasql = require("teradatasql");

    const con = teradatasql.connect({
        host: 'whomooz',
        user: 'guest',
        password: 'please'
    });
```

You may specify connection parameters as a JavaScript object, as a JSON string, or using a combination of the two approaches. The TeradataConnection.connect function's first argument is a JavaScript object. The TeradataConnection.connect function's second arguments is an optional JSON string.

Connection parameters specified only as a JavaScript object:

    con = teradataConnection.connect({host:"whomooz",user:"guest",password:"please"})

Connection parameters specified as a JSON string:

    con = teradataConnection.connect({}, '{"host":"whomooz", "user":"guest", "password":"please"}')

Connection parameters specified using a combination:

    con = teradataConnection.connect({host:"whomooz"}, '{"user":"guest", "password":"please"}')

When a combination of parameters are specified, connection parameters specified as a JSON string take precedence over same-named connection parameters specified in the JavaScript object.

<a id="ConnectionParameters"></a>

### Connection Parameters

The following table lists the connection parameters currently offered by the driver. Connection parameter values are case-sensitive unless stated otherwise.

Our goal is consistency for the connection parameters offered by this driver and the Teradata JDBC Driver, with respect to connection parameter names and functionality. For comparison, Teradata JDBC Driver connection parameters are [documented here](https://downloads.teradata.com/doc/connectivity/jdbc/reference/current/jdbcug_chapter_2.html#BGBHDDGB).

Parameter               | Default     | Type           | Description
----------------------- | ----------- | -------------- | ---
`account`               |             | string         | Specifies the database account. Equivalent to the Teradata JDBC Driver `ACCOUNT` connection parameter.
`browser`               |             | string         | Specifies the command to open the browser for Browser Authentication when `logmech` is `BROWSER`. Browser Authentication is supported for Windows and macOS. Equivalent to the Teradata JDBC Driver `BROWSER` connection parameter.<br/>The specified command must include a placeholder token, literally specified as `PLACEHOLDER`, which the driver will replace with the Identity Provider authorization endpoint URL. The `PLACEHOLDER` token is case-sensitive and must be specified in uppercase.<br/>&bull; On Windows, the default command is `cmd /c start "title" "PLACEHOLDER"`. Windows command syntax requires the quoted title to precede the quoted URL.<br/>&bull; On macOS, the default command is `open PLACEHOLDER`. macOS command syntax does not allow the URL to be quoted.
`browser_tab_timeout`   | `"5"`       | quoted integer | Specifies the number of seconds to wait before closing the browser tab after Browser Authentication is completed. The default is 5 seconds. The behavior is under the browser's control, and not all browsers support automatic closing of browser tabs. Typically, the tab used to log on will remain open indefinitely, but the second and subsequent tabs will be automatically closed. Specify `0` (zero) to close the tab immediately. Specify `-1` to turn off automatic closing of browser tabs. Browser Authentication is supported for Windows and macOS. Equivalent to the Teradata JDBC Driver `BROWSER_TAB_TIMEOUT` connection parameter.
`browser_timeout`       | `"180"`     | quoted integer | Specifies the number of seconds that the driver will wait for Browser Authentication to complete. The default is 180 seconds (3 minutes). Browser Authentication is supported for Windows and macOS. Equivalent to the Teradata JDBC Driver `BROWSER_TIMEOUT` connection parameter.
`code_append_file`      | `"-out"`    | string         | Specifies how to display the verification URL and code. Optional when `logmech` is `CODE` and ignored for other `logmech` values. The default `-out` prints the verification URL and code to stdout. Specify `-err` to print the verification URL and code to stderr. Specify a file name to append the verification URL and code to an existing file or create a new file if the file does not exist. Equivalent to the Teradata JDBC Driver `CODE_APPEND_FILE` connection parameter.
`column_name`           | `"false"`   | quoted boolean | Controls the behavior of cursor `.description` sequence `name` items. Equivalent to the Teradata JDBC Driver `COLUMN_NAME` connection parameter. False specifies that a cursor `.description` sequence `name` item provides the AS-clause name if available, or the column name if available, or the column title. True specifies that a cursor `.description` sequence `name` item provides the column name if available, but has no effect when StatementInfo parcel support is unavailable.
`connect_failure_ttl`   | `"0"`       | quoted integer | Specifies the time-to-live in seconds to remember the most recent connection failure for each IP address/port combination. The driver subsequently skips connection attempts to that IP address/port for the duration of the time-to-live. The default value of zero disables this feature. The recommended value is half the database restart time. Equivalent to the Teradata JDBC Driver `CONNECT_FAILURE_TTL` connection parameter.
`connect_function`      | `"0"`       | quoted integer | Specifies whether the database should allocate a Logon Sequence Number (LSN) for this session, or associate this session with an existing LSN. Specify `0` for a session with no LSN (the default). Specify `1` to allocate a new LSN for the session. Specify `2` to associate the session with the existing LSN identified by the `logon_sequence_number` connection parameter. The database only permits sessions for the same user to share an LSN. Equivalent to the Teradata JDBC Driver `CONNECT_FUNCTION` connection parameter.
`connect_timeout`       | `"10000"`   | quoted integer | Specifies the timeout in milliseconds for establishing a TCP socket connection. Specify `0` for no timeout. The default is 10 seconds (10000 milliseconds).
`cop`                   | `"true"`    | quoted boolean | Specifies whether COP Discovery is performed. Equivalent to the Teradata JDBC Driver `COP` connection parameter.
`coplast`               | `"false"`   | quoted boolean | Specifies how COP Discovery determines the last COP hostname. Equivalent to the Teradata JDBC Driver `COPLAST` connection parameter. When `coplast` is `false` or omitted, or COP Discovery is turned off, then no DNS lookup occurs for the coplast hostname. When `coplast` is `true`, and COP Discovery is turned on, then a DNS lookup occurs for a coplast hostname.
`database`              |             | string         | Specifies the initial database to use after logon, instead of the user's default database. Equivalent to the Teradata JDBC Driver `DATABASE` connection parameter.
`dbs_port`              | `"1025"`    | quoted integer | Specifies the database port number. Equivalent to the Teradata JDBC Driver `DBS_PORT` connection parameter.
`encryptdata`           | `"false"`   | quoted boolean | Controls encryption of data exchanged between the driver and the database. Equivalent to the Teradata JDBC Driver `ENCRYPTDATA` connection parameter.
`error_query_count`     | `"21"`      | quoted integer | Specifies how many times the driver will attempt to query FastLoad Error Table 1 after a FastLoad operation. Equivalent to the Teradata JDBC Driver `ERROR_QUERY_COUNT` connection parameter.
`error_query_interval`  | `"500"`     | quoted integer | Specifies how many milliseconds the driver will wait between attempts to query FastLoad Error Table 1. Equivalent to the Teradata JDBC Driver `ERROR_QUERY_INTERVAL` connection parameter.
`error_table_1_suffix`  | `"_ERR_1"`  | string         | Specifies the suffix for the name of FastLoad Error Table 1. Equivalent to the Teradata JDBC Driver `ERROR_TABLE_1_SUFFIX` connection parameter.
`error_table_2_suffix`  | `"_ERR_2"`  | string         | Specifies the suffix for the name of FastLoad Error Table 2. Equivalent to the Teradata JDBC Driver `ERROR_TABLE_2_SUFFIX` connection parameter.
`error_table_database`  |             | string         | Specifies the database name for the FastLoad error tables. By default, FastLoad error tables reside in the same database as the destination table being loaded. Equivalent to the Teradata JDBC Driver `ERROR_TABLE_DATABASE` connection parameter.
`fake_result_sets`      | `"false"`   | quoted boolean | Controls whether a fake result set containing statement metadata precedes each real result set.
`field_quote`           | `"\""`      | string         | Specifies a single character string used to quote fields in a CSV file.
`field_sep`             | `","`       | string         | Specifies a single character string used to separate fields in a CSV file. Equivalent to the Teradata JDBC Driver `FIELD_SEP` connection parameter.
`govern`                | `"true"`    | quoted boolean | Controls FastLoad and FastExport throttling by Teradata workload management rules. When set to `true` (the default), workload management rules may delay a FastLoad or FastExport. When set to `false`, workload management rules will reject rather than delay a FastLoad or FastExport. Equivalent to the Teradata JDBC Driver `GOVERN` connection parameter.
`host`                  |             | string         | Specifies the database hostname.
`http_proxy`            |             | string         | Specifies the proxy server URL for HTTP connections to TLS certificate verification CRL and OCSP endpoints. The URL must begin with `http://` and must include a colon `:` and port number.
`http_proxy_password`   |             | string         | Specifies the proxy server password for the proxy server identified by the `http_proxy` parameter. This parameter may only be specified in conjunction with the `http_proxy` parameter. When this parameter is omitted, no proxy server password is provided to the proxy server identified by the `http_proxy` parameter.
`http_proxy_user`       |             | string         | Specifies the proxy server username for the proxy server identified by the `http_proxy` parameter. This parameter may only be specified in conjunction with the `http_proxy` parameter. When this parameter is omitted, no proxy server username is provided to the proxy server identified by the `http_proxy` parameter.
`https_port`            | `"443"`     | quoted integer | Specifies the database port number for HTTPS/TLS connections. Equivalent to the Teradata JDBC Driver `HTTPS_PORT` connection parameter.
`https_proxy`           |             | string         | Specifies the proxy server URL for HTTPS/TLS connections to the database and to Identity Provider endpoints. The URL must begin with `http://` and must include a colon `:` and port number. The driver connects to the proxy server using a non-TLS HTTP connection, then uses the HTTP CONNECT method to establish an HTTPS/TLS connection to the destination. Equivalent to the Teradata JDBC Driver `HTTPS_PROXY` connection parameter.
`https_proxy_password`  |             | string         | Specifies the proxy server password for the proxy server identified by the `https_proxy` parameter. This parameter may only be specified in conjunction with the `https_proxy` parameter. When this parameter is omitted, no proxy server password is provided to the proxy server identified by the `https_proxy` parameter. Equivalent to the Teradata JDBC Driver `HTTPS_PROXY_PASSWORD` connection parameter.
`https_proxy_user`      |             | string         | Specifies the proxy server username for the proxy server identified by the `https_proxy` parameter. This parameter may only be specified in conjunction with the `https_proxy` parameter. When this parameter is omitted, no proxy server username is provided to the proxy server identified by the `https_proxy` parameter. Equivalent to the Teradata JDBC Driver `HTTPS_PROXY_USER` connection parameter.
`jws_algorithm`         | `"RS256"`   | string         | Specifies the JSON Web Signature (JWS) algorithm to sign the JWT Bearer Token for client authentication. Optional when `logmech` is `BEARER` and ignored for other `logmech` values. The default `RS256` is RSASSA-PKCS1-v1_5 using SHA-256. Specify `RS384` for RSASSA-PKCS1-v1_5 using SHA-384. Specify `RS512` for RSASSA-PKCS1-v1_5 using SHA-512. Equivalent to the Teradata JDBC Driver `JWS_ALGORITHM` connection parameter.
`jws_cert`              |             | string         | Specifies the file name of the X.509 certificate PEM file that contains the public key corresponding to the private key from `jws_private_key`. Optional when `logmech` is `BEARER` and ignored for other `logmech` values. When this parameter is specified, the "x5t" header thumbprint is added to the JWT Bearer Token for the Identity Provider to select the public key for JWT signature verification. Some Identity Providers, such as Microsoft Entra ID, require this. When this parameter is omitted, the "x5t" header thumbprint is not added to the JWT Bearer Token. Some Identity Providers do not require the "x5t" header thumbprint. Equivalent to the Teradata JDBC Driver `JWS_CERT` connection parameter.
`jws_private_key`       |             | string         | Specifies the file name of the PEM or JWK file containing the private key to sign the JWT Bearer Token for client authentication. Required when `logmech` is `BEARER` and ignored for other `logmech` values. PEM and JWK file formats are supported. The private key filename must end with the `.pem` or `.jwk` extension. A PEM file must contain the BEGIN/END PRIVATE KEY header and trailer. If a JWK file contains a "kid" (key identifier) parameter, the "kid" header is added to the JWT Bearer Token for the Identity Provider to select the public key for JWT signature verification. Equivalent to the Teradata JDBC Driver `JWS_PRIVATE_KEY` connection parameter.
`lob_support`           | `"true"`    | quoted boolean | Controls LOB support. Equivalent to the Teradata JDBC Driver `LOB_SUPPORT` connection parameter.
`log`                   | `"0"`       | quoted integer | Controls debug logging. Somewhat equivalent to the Teradata JDBC Driver `LOG` connection parameter. This parameter's behavior is subject to change in the future. This parameter's value is currently defined as an integer in which the 1-bit governs function and method tracing, the 2-bit governs debug logging, the 4-bit governs transmit and receive message hex dumps, and the 8-bit governs timing. Compose the value by adding together 1, 2, 4, and/or 8.
`logdata`               |             | string         | Specifies extra data for the chosen logon authentication method. Equivalent to the Teradata JDBC Driver `LOGDATA` connection parameter.
`logmech`               | `"TD2"`     | string         | Specifies the logon authentication method. Equivalent to the Teradata JDBC Driver `LOGMECH` connection parameter. The database user must have the "logon with null password" permission for `KRB5` Single Sign On (SSO) or any of the OpenID Connect (OIDC) methods `BEARER`, `BROWSER`, `CODE`, `CRED`, `JWT`, `ROPC`, or `SECRET`. Values are case-insensitive.<br/>&bull; `BEARER` uses OIDC Client Credentials Grant with JWT Bearer Token for client authentication.<br/>&bull; `BROWSER` uses Browser Authentication, supported for Windows and macOS.<br/>&bull; `CODE` uses OIDC Device Code Flow, also known as OIDC Device Authorization Grant.<br/>&bull; `CRED` uses OIDC Client Credentials Grant with client_secret_post for client authentication.<br/>&bull; `JWT` uses JSON Web Token.<br/>&bull; `KRB5` uses Kerberos V5.<br/>&bull; `LDAP` uses Lightweight Directory Access Protocol.<br/>&bull; `ROPC` uses OIDC Resource Owner Password Credentials (ROPC).<br/>&bull; `SECRET` uses OIDC Client Credentials Grant with client_secret_basic for client authentication.<br/>&bull; `TD2` uses Teradata Method 2.<br/>&bull; `TDNEGO` automatically selects the appropriate logon authentication method.
`logon_sequence_number` |             | quoted integer | Associates this session with an existing Logon Sequence Number (LSN) when `connect_function` is `2`. The database only permits sessions for the same user to share an LSN. An LSN groups multiple sessions together for workload management. Using an LSN is a three-step process. First, establish a control session with `connect_function` as `1`, which allocates a new LSN. Second, obtain the LSN from the control session using the escape function `{fn teradata_logon_sequence_number}`. Third, establish an associated session with `connect_function` as `2` and the logon sequence number. Equivalent to the Teradata JDBC Driver `LOGON_SEQUENCE_NUMBER` connection parameter.
`logon_timeout`         | `"0"`       | quoted integer | Specifies the logon timeout in seconds. Zero means no timeout.
`manage_error_tables`   | `"true"`    | quoted boolean | Controls whether the driver manages the FastLoad error tables.
`max_message_body`      | `"2097000"` | quoted integer | Specifies the maximum Response Message size in bytes. Equivalent to the Teradata JDBC Driver `MAX_MESSAGE_BODY` connection parameter.
`oidc_clientid`         |             | string         | Specifies the OpenID Connect (OIDC) Client ID to use for Browser Authentication and other OIDC methods. When omitted, the default Client ID comes from the database's TdgssUserConfigFile.xml file. Browser Authentication is supported for Windows and macOS. Equivalent to the Teradata JDBC Driver `OIDC_CLIENTID` connection parameter.
`oidc_scope`            | `"openid"`  | string         | Specifies the OpenID Connect (OIDC) scope to use for Browser Authentication. Beginning with Teradata Database 17.20.03.11, the default scope can be specified in the database's `TdgssUserConfigFile.xml` file, using the `IdPConfig` element's `Scope` attribute. Browser Authentication is supported for Windows and macOS. Equivalent to the Teradata JDBC Driver `OIDC_SCOPE` connection parameter.
`oidc_sslmode`          |             | string         | Specifies the mode for HTTPS connections to the Identity Provider. Equivalent to the Teradata JDBC Driver `OIDC_SSLMODE` connection parameter. Values are case-insensitive. When this parameter is omitted, the default is the value of the `sslmode` connection parameter.<br/>&bull; `ALLOW` does not perform certificate verification for HTTPS connections to the Identity Provider.<br/>&bull; `VERIFY-CA` verifies that the server certificate is valid and trusted.<br/>&bull; `VERIFY-FULL` verifies that the server certificate is valid and trusted, and verifies that the server certificate matches the Identity Provider hostname.
`oidc_token`            | `"access_token"` | string    | Specifies the kind of OIDC token to use for Browser Authentication. Specify `id_token` to use the id_token instead of the access_token. Browser Authentication is supported for Windows and macOS. Equivalent to the Teradata JDBC Driver `OIDC_TOKEN` connection parameter.
`partition`             | `"DBC/SQL"` | string         | Specifies the database partition. Equivalent to the Teradata JDBC Driver `PARTITION` connection parameter.
`password`              |             | string         | Specifies the database password. Equivalent to the Teradata JDBC Driver `PASSWORD` connection parameter.
`proxy_bypass_hosts`    |             | string | Specifies a matching pattern for hostnames and addresses to bypass the proxy server identified by the `http_proxy` and/or `https_proxy` parameter. This parameter may only be specified in conjunction with the `http_proxy` and/or `https_proxy` parameter. Separate multiple hostnames and addresses with a vertical bar `\|` character. Specify an asterisk `*` as a wildcard character. When this parameter is omitted, the default pattern `localhost\|127.*\|[::1]` bypasses the proxy server identified by the `http_proxy` and/or `https_proxy` parameter for common variations of the loopback address. Equivalent to the Teradata JDBC Driver `PROXY_BYPASS_HOSTS` connection parameter.
`request_timeout`       | `"0"`       | quoted integer | Specifies the timeout for executing each SQL request. Zero means no timeout.
`runstartup`            | `"false"`   | quoted boolean | Controls whether the user's `STARTUP` SQL request is executed after logon. For more information, refer to [User STARTUP SQL Request](#UserStartup). Equivalent to the Teradata JDBC Driver `RUNSTARTUP` connection parameter.
`sessions`              |             | quoted integer | Specifies the number of data transfer connections for FastLoad or FastExport. The default (recommended) lets the database choose the appropriate number of connections. Equivalent to the Teradata JDBC Driver `SESSIONS` connection parameter.
`sip_support`           | `"true"`    | quoted boolean | Controls whether StatementInfo parcel is used. Equivalent to the Teradata JDBC Driver `SIP_SUPPORT` connection parameter.
`sp_spl`                | `"true"`    | quoted boolean | Controls whether stored procedure source code is saved in the database when a SQL stored procedure is created. Equivalent to the Teradata JDBC Driver `SP_SPL` connection parameter.
`sslca`                 |             | string         | Specifies the file name of a PEM file that contains Certificate Authority (CA) certificates for use with `sslmode` or `oidc_sslmode` values `VERIFY-CA` or `VERIFY-FULL`. Equivalent to the Teradata JDBC Driver `SSLCA` connection parameter.
`sslcapath`             |             | string         | Specifies a directory of PEM files that contain Certificate Authority (CA) certificates for use with `sslmode` or `oidc_sslmode` values `VERIFY-CA` or `VERIFY-FULL`. Only files with an extension of `.pem` are used. Other files in the specified directory are not used. Equivalent to the Teradata JDBC Driver `SSLCAPATH` connection parameter.
`sslcipher`             |             | string         | Specifies the TLS cipher for HTTPS/TLS connections. Equivalent to the Teradata JDBC Driver `SSLCIPHER` connection parameter.
`sslcrc`                | `"ALLOW"`   | string         | Controls TLS certificate revocation checking (CRC) for HTTPS/TLS connections. Equivalent to the Teradata JDBC Driver `SSLCRC` connection parameter. Values are case-insensitive.<br/>&bull; `ALLOW` performs CRC for `sslmode` or `oidc_sslmode` `VERIFY-CA` and `VERIFY-FULL`, and provides soft fail CRC for `VERIFY-CA` and `VERIFY-FULL` to ignore CRC communication failures.<br/>&bull; `PREFER` performs CRC for all HTTPS connections, and provides soft fail CRC for `VERIFY-CA` and `VERIFY-FULL` to ignore CRC communication failures.<br/>&bull; `REQUIRE` performs CRC for all HTTPS connections, and requires CRC for `VERIFY-CA` and `VERIFY-FULL`.
`sslmode`               | `"PREFER"`  | string         | Specifies the mode for connections to the database. Equivalent to the Teradata JDBC Driver `SSLMODE` connection parameter. Values are case-insensitive.<br/>&bull; `DISABLE` disables HTTPS/TLS connections and uses only non-TLS connections.<br/>&bull; `ALLOW` uses non-TLS connections unless the database requires HTTPS/TLS connections.<br/>&bull; `PREFER` uses HTTPS/TLS connections unless the database does not offer HTTPS/TLS connections.<br/>&bull; `REQUIRE` uses only HTTPS/TLS connections.<br/>&bull; `VERIFY-CA` uses only HTTPS/TLS connections and verifies that the server certificate is valid and trusted.<br/>&bull; `VERIFY-FULL` uses only HTTPS/TLS connections, verifies that the server certificate is valid and trusted, and verifies that the server certificate matches the database hostname.
`sslprotocol`           | `"TLSv1.2"` | string         | Specifies the TLS protocol for HTTPS/TLS connections. Equivalent to the Teradata JDBC Driver `SSLPROTOCOL` connection parameter.
`teradata_values`       | `"true"`    | quoted boolean | Controls whether `str` or a more specific JavaScript data type is used for certain result set column value types. Refer to the [Data Types](#DataTypes) table below for details.
`tmode`                 | `"DEFAULT"` | string         | Specifies the transaction mode. Equivalent to the Teradata JDBC Driver `TMODE` connection parameter. Possible values are `DEFAULT` (the default), `ANSI`, or `TERA`.
`user`                  |             | string         | Specifies the database username. Equivalent to the Teradata JDBC Driver `USER` connection parameter.

<a id="COPDiscovery"></a>

### COP Discovery

The driver provides Communications Processor (COP) discovery behavior when the `cop` connection parameter is `true` or omitted. COP Discovery is turned off when the `cop` connection parameter is `false`.

A database system can be composed of multiple database nodes. One or more of the database nodes can be configured to run the database Gateway process. Each database node that runs the database Gateway process is termed a Communications Processor, or COP. COP Discovery refers to the procedure of identifying all the available COP hostnames and their IP addresses. COP hostnames can be defined in DNS, or can be defined in the client system's `hosts` file. Teradata strongly recommends that COP hostnames be defined in DNS, rather than the client system's `hosts` file. Defining COP hostnames in DNS provides centralized administration, and enables centralized changes to COP hostnames if and when the database is reconfigured.

The `coplast` connection parameter specifies how COP Discovery determines the last COP hostname.
* When `coplast` is `false` or omitted, or COP Discovery is turned off, then the driver will not perform a DNS lookup for the coplast hostname.
* When `coplast` is `true`, and COP Discovery is turned on, then the driver will first perform a DNS lookup for a coplast hostname to obtain the IP address of the last COP hostname before performing COP Discovery. Subsequently, during COP Discovery, the driver will stop searching for COP hostnames when either an unknown COP hostname is encountered, or a COP hostname is encountered whose IP address matches the IP address of the coplast hostname.

Specifying `coplast` as `true` can improve performance with DNS that is slow to respond for DNS lookup failures, and is necessary for DNS that never returns a DNS lookup failure.

When performing COP Discovery, the driver starts with cop1, which is appended to the database hostname, and then proceeds with cop2, cop3, ..., copN. The driver supports domain-name qualification for COP Discovery and the coplast hostname. Domain-name qualification is recommended, because it can improve performance by avoiding unnecessary DNS lookups for DNS search suffixes.

The following table illustrates the DNS lookups performed for a hypothetical three-node database system named "whomooz".

&nbsp; | No domain name qualification | With domain name qualification<br/>(Recommended)
------ | ---------------------------- | ---
Application-specified<br/>database hostname | `whomooz` | `whomooz.domain.com`
Default: COP Discovery turned on, and `coplast` is `false` or omitted,<br/>perform DNS lookups until unknown COP hostname is encountered | `whomoozcop1`&rarr;`10.0.0.1`<br/>`whomoozcop2`&rarr;`10.0.0.2`<br/>`whomoozcop3`&rarr;`10.0.0.3`<br/>`whomoozcop4`&rarr;undefined | `whomoozcop1.domain.com`&rarr;`10.0.0.1`<br/>`whomoozcop2.domain.com`&rarr;`10.0.0.2`<br/>`whomoozcop3.domain.com`&rarr;`10.0.0.3`<br/>`whomoozcop4.domain.com`&rarr;undefined
COP Discovery turned on, and `coplast` is `true`,<br/>perform DNS lookups until COP hostname is found whose IP address matches the coplast hostname, or unknown COP hostname is encountered | `whomoozcoplast`&rarr;`10.0.0.3`<br/>`whomoozcop1`&rarr;`10.0.0.1`<br/>`whomoozcop2`&rarr;`10.0.0.2`<br/>`whomoozcop3`&rarr;`10.0.0.3` | `whomoozcoplast.domain.com`&rarr;`10.0.0.3`<br/>`whomoozcop1.domain.com`&rarr;`10.0.0.1`<br/>`whomoozcop2.domain.com`&rarr;`10.0.0.2`<br/>`whomoozcop3.domain.com`&rarr;`10.0.0.3`
COP Discovery turned off and round-robin DNS,<br/>perform one DNS lookup that returns multiple IP addresses | `whomooz`&rarr;`10.0.0.1`, `10.0.0.2`, `10.0.0.3` | `whomooz.domain.com`&rarr;`10.0.0.1`, `10.0.0.2`, `10.0.0.3`

Round-robin DNS rotates the list of IP addresses automatically to provide load distribution. Round-robin is only possible with DNS, not with the client system `hosts` file.

The driver supports the definition of multiple IP addresses for COP hostnames and non-COP hostnames.

For the first connection to a particular database system, the driver generates a random number to index into the list of COPs. For each subsequent connection, the driver increments the saved index until it wraps around to the first position. This behavior provides load distribution across all discovered COPs.

The driver masks connection failures to down COPs, thereby hiding most connection failures from the client application. An exception is thrown to the application only when all the COPs are down for that database. If a COP is down, the next COP in the sequence (including a wrap-around to the first COP) receives extra connections that were originally destined for the down COP. When multiple IP addresses are defined in DNS for a COP, the driver will attempt to connect to each of the COP's IP addresses, and the COP is considered down only when connection attempts fail to all of the COP's IP addresses.

If COP Discovery is turned off, or no COP hostnames are defined in DNS, the driver connects directly to the hostname specified in the `host` connection parameter. This permits load distribution schemes other than the COP Discovery approach. For example, round-robin DNS or a TCP/IP load distribution product can be used. COP Discovery takes precedence over simple database hostname lookup. To use an alternative load distribution scheme, either ensure that no COP hostnames are defined in DNS, or turn off COP Discovery with `cop` as `false`.

<a id="StoredPasswordProtection"></a>

### Stored Password Protection

#### Overview

Stored Password Protection enables an application to provide a connection password in encrypted form to the driver.

An encrypted password may be specified in the following contexts:
* A login password specified as the `password` connection parameter.
* A login password specified within the `logdata` connection parameter.

If the password, however specified, begins with the prefix `ENCRYPTED_PASSWORD(` then the specified password must follow this format:

`ENCRYPTED_PASSWORD(file:`*PasswordEncryptionKeyFileName*`,file:`*EncryptedPasswordFileName*`)`

Each filename must be preceded by the `file:` prefix. The *PasswordEncryptionKeyFileName* must be separated from the *EncryptedPasswordFileName* by a single comma.

The *PasswordEncryptionKeyFileName* specifies the name of a file that contains the password encryption key and associated information. The *EncryptedPasswordFileName* specifies the name of a file that contains the encrypted password and associated information. The two files are described below.

Stored Password Protection is offered by this driver, the Teradata JDBC Driver, and the Teradata SQL Driver for R. These drivers use the same file format.

#### Program TJEncryptPassword.ts

`TJEncryptPassword.ts` is a sample program to create encrypted password files for use with Stored Password Protection. When the driver is installed, the sample programs are placed in the `teradatasql/samples` directory under your `node_modules` installation directory.

This program works in conjunction with Stored Password Protection offered by the driver. This program creates the files containing the password encryption key and encrypted password, which can be subsequently specified via the `ENCRYPTED_PASSWORD(` syntax.

You are not required to use this program to create the files containing the password encryption key and encrypted password. You can develop your own software to create the necessary files. You may also use the [`TJEncryptPassword.java`](https://downloads.teradata.com/doc/connectivity/jdbc/reference/current/samp/TJEncryptPassword.java.txt) sample program that is available with the [Teradata JDBC Driver Reference](https://downloads.teradata.com/doc/connectivity/jdbc/reference/current/frameset.html). The only requirement is that the files must match the format expected by the driver, which is documented below.

This program encrypts the password and then immediately decrypts the password, in order to verify that the password can be successfully decrypted. This program mimics the password decryption of the driver, and is intended to openly illustrate its operation and enable scrutiny by the community.

The encrypted password is only as safe as the two files. You are responsible for restricting access to the files containing the password encryption key and encrypted password. If an attacker obtains both files, the password can be decrypted. The operating system file permissions for the two files should be as limited and restrictive as possible, to ensure that only the intended operating system userid has access to the files.

The two files can be kept on separate physical volumes, to reduce the risk that both files might be lost at the same time. If either or both of the files are located on a network volume, then an encrypted wire protocol can be used to access the network volume, such as sshfs, encrypted NFSv4, or encrypted SMB 3.0.

This program accepts eight command-line arguments:

Argument                      | Example              | Description
----------------------------- | -------------------- | ---
Transformation                | `AES/CBC/NoPadding`  | Specifies the transformation in the form *Algorithm*`/`*Mode*`/`*Padding*. Supported transformations are listed in a table below.
KeySizeInBits                 | `256`                | Specifies the algorithm key size, which governs the encryption strength.
MAC                           | `HmacSHA256`         | Specifies the message authentication code (MAC) algorithm `HmacSHA1` or `HmacSHA256`.
PasswordEncryptionKeyFileName | `PassKey.properties` | Specifies a filename in the current directory, a relative pathname, or an absolute pathname. The file is created by this program. If the file already exists, it will be overwritten by the new file.
EncryptedPasswordFileName     | `EncPass.properties` | Specifies a filename in the current directory, a relative pathname, or an absolute pathname. The filename or pathname that must differ from the PasswordEncryptionKeyFileName. The file is created by this program. If the file already exists, it will be overwritten by the new file.
Hostname                      | `whomooz`            | Specifies the database hostname.
Username                      | `guest`              | Specifies the database username.
Password                      | `please`             | Specifies the database password to be encrypted. Unicode characters in the password can be specified with the `\u`*XXXX* escape sequence.


#### Example Commands

The TJEncryptPassword program uses the driver to log on to the specified database using the encrypted password, so the driver must have been installed with the `npm install teradatasql` command.

The following commands assume that the `TJEncryptPassword.ts` program file is located in the current directory. When the driver is installed, the sample programs are placed in the `teradatasql/samples` directory under your `node_modules` installation directory. Change your current directory to the `teradatasql/samples` directory under your `node_modules` installation directory.

The following example commands illustrate using a 256-bit AES key, and using the HmacSHA256 algorithm.

 `npx ts-node TJEncryptPassword.ts AES/CBC/NoPadding 256 HmacSHA256 PassKey.properties EncPass.properties whomooz guest please`

#### Password Encryption Key File Format

You are not required to use the TJEncryptPassword.ts program to create the files containing the password encryption key and encrypted password. You can develop your own software to create the necessary files, but the files must match the format expected by the driver.

The password encryption key file is a text file in Java Properties file format, using the ISO 8859-1 character encoding.

The file must contain the following string properties:

Property                                          | Description
------------------------------------------------- | ---
`version=1`                                       | The version number must be `1`. This property is required.
`transformation=`*Algorithm*`/`*Mode*`/`*Padding* | Specifies the transformation in the form *Algorithm*`/`*Mode*`/`*Padding*. Supported transformations are listed in a table below. This property is required.
`algorithm=`*Algorithm*                           | This value must correspond to the *Algorithm* portion of the transformation. This property is required.
`match=`*MatchValue*                              | The password encryption key and encrypted password files must contain the same match value. The match values are compared to ensure that the two specified files are related to each other, serving as a "sanity check" to help avoid configuration errors. This property is required.
`key=`*HexDigits*                                 | This value is the password encryption key, encoded as hex digits. This property is required.
`mac=`*MACAlgorithm*                              | Specifies the message authentication code (MAC) algorithm `HmacSHA1` or `HmacSHA256`. Stored Password Protection performs Encrypt-then-MAC for protection from a padding oracle attack. This property is required.
`mackey=`*HexDigits*                              | This value is the MAC key, encoded as hex digits. This property is required.

The TJEncryptPassword.ts program uses a timestamp as a shared match value, but a timestamp is not required. Any shared string can serve as a match value. The timestamp is not related in any way to the encryption of the password, and the timestamp cannot be used to decrypt the password.

#### Encrypted Password File Format

The encrypted password file is a text file in Java Properties file format, using the ISO 8859-1 character encoding.

The file must contain the following string properties:

Property                                          | Description
------------------------------------------------- | ---
`version=1`                                       | The version number must be `1`. This property is required.
`match=`*MatchValue*                              | The password encryption key and encrypted password files must contain the same match value. The match values are compared to ensure that the two specified files are related to each other, serving as a "sanity check" to help avoid configuration errors. This property is required.
`password=`*HexDigits*                            | This value is the encrypted password, encoded as hex digits. This property is required.
`params=`*HexDigits*                              | This value contains the cipher algorithm parameters, if any, encoded as hex digits. Some ciphers need algorithm parameters that cannot be derived from the key, such as an initialization vector. This property is optional, depending on whether the cipher algorithm has associated parameters.
`hash=`*HexDigits*                                | This value is the expected message authentication code (MAC), encoded as hex digits. After encryption, the expected MAC is calculated using the ciphertext, transformation name, and algorithm parameters if any. Before decryption, the driver calculates the MAC using the ciphertext, transformation name, and algorithm parameters if any, and verifies that the calculated MAC matches the expected MAC. If the calculated MAC differs from the expected MAC, then either or both of the files may have been tampered with. This property is required.

While `params` is technically optional, an initialization vector is required by all three block cipher modes `CBC`, `CFB`, and `OFB` that are supported by the driver. ECB (Electronic Codebook) does not require `params`, but ECB is not supported by the driver.

#### Transformation, Key Size, and MAC

A transformation is a string that describes the set of operations to be performed on the given input, to produce transformed output. A transformation specifies the name of a cryptographic algorithm such as AES, followed by a feedback mode and padding scheme.

The driver supports the following transformations and key sizes.

Transformation              | Key Size
--------------------------- | ---
`AES/CBC/NoPadding`         | 128
`AES/CBC/NoPadding`         | 192
`AES/CBC/NoPadding`         | 256
`AES/CBC/PKCS5Padding`      | 128
`AES/CBC/PKCS5Padding`      | 192
`AES/CBC/PKCS5Padding`      | 256
`AES/CFB/NoPadding`         | 128
`AES/CFB/NoPadding`         | 192
`AES/CFB/NoPadding`         | 256
`AES/CFB/PKCS5Padding`      | 128
`AES/CFB/PKCS5Padding`      | 192
`AES/CFB/PKCS5Padding`      | 256
`AES/OFB/NoPadding`         | 128
`AES/OFB/NoPadding`         | 192
`AES/OFB/NoPadding`         | 256
`AES/OFB/PKCS5Padding`      | 128
`AES/OFB/PKCS5Padding`      | 192
`AES/OFB/PKCS5Padding`      | 256

Stored Password Protection uses a symmetric encryption algorithm such as AES, in which the same secret key is used for encryption and decryption of the password. Stored Password Protection does not use an asymmetric encryption algorithm such as RSA, with separate public and private keys.

CBC (Cipher Block Chaining) is a block cipher encryption mode. With CBC, each ciphertext block is dependent on all plaintext blocks processed up to that point. CBC is suitable for encrypting data whose total byte count exceeds the algorithm's block size, and is therefore suitable for use with Stored Password Protection.

Stored Password Protection hides the password length in the encrypted password file by extending the length of the UTF8-encoded password with trailing null bytes. The length is extended to the next 512-byte boundary.

* A block cipher with no padding, such as `AES/CBC/NoPadding`, may only be used to encrypt data whose byte count after extension is a multiple of the algorithm's block size. The 512-byte boundary is compatible with many block ciphers. AES, for example, has a block size of 128 bits (16 bytes), and is therefore compatible with the 512-byte boundary.
* A block cipher with padding, such as `AES/CBC/PKCS5Padding`, can be used to encrypt data of any length. However, CBC with padding is vulnerable to a "padding oracle attack", so Stored Password Protection performs Encrypt-then-MAC for protection from a padding oracle attack. MAC algorithms `HmacSHA1` and `HmacSHA256` are supported.
* The driver does not support block ciphers used as byte-oriented ciphers via modes such as `CFB8` or `OFB8`.

The strength of the encryption depends on your choice of cipher algorithm and key size.

* AES uses a 128-bit (16 byte), 192-bit (24 byte), or 256-bit (32 byte) key.

#### Sharing Files with the Teradata JDBC Driver

This driver and the Teradata JDBC Driver can share the files containing the password encryption key and encrypted password, if you use a transformation, key size, and MAC algorithm that is supported by both drivers.

* Recommended choices for compatibility are `AES/CBC/NoPadding` and `HmacSHA256`.
* Use a 256-bit key if your Java environment has the Java Cryptography Extension (JCE) Unlimited Strength Jurisdiction Policy Files from Oracle.
* Use a 128-bit key if your Java environment does not have the Unlimited Strength Jurisdiction Policy Files.
* Use `HmacSHA1` for compatibility with JDK 1.4.2.

#### File Locations

For the `ENCRYPTED_PASSWORD(` syntax of the driver, each filename must be preceded by the `file:` prefix.
The *PasswordEncryptionKeyFileName* must be separated from the *EncryptedPasswordFileName* by a single comma. The files can be located in the current directory, specified with a relative path, or specified with an absolute path.


Example for files in the current directory:

    ENCRYPTED_PASSWORD(file:JohnDoeKey.properties,file:JohnDoePass.properties)

Example with relative paths:

    ENCRYPTED_PASSWORD(file:../dir1/JohnDoeKey.properties,file:../dir2/JohnDoePass.properties)

Example with absolute paths on Windows:

    ENCRYPTED_PASSWORD(file:c:/dir1/JohnDoeKey.properties,file:c:/dir2/JohnDoePass.properties)

Example with absolute paths on Linux:

    ENCRYPTED_PASSWORD(file:/dir1/JohnDoeKey.properties,file:/dir2/JohnDoePass.properties)

#### Processing Sequence

The two filenames specified for an encrypted password must be accessible to the driver and must conform to the properties file formats described above. The driver raises an exception if the file is not accessible, or the file does not conform to the required file format.

The driver verifies that the match values in the two files are present, and match each other. The driver raises an exception if the match values differ from each other. The match values are compared to ensure that the two specified files are related to each other, serving as a "sanity check" to help avoid configuration errors. The TJEncryptPassword program uses a timestamp as a shared match value, but a timestamp is not required. Any shared string can serve as a match value. The timestamp is not related in any way to the encryption of the password, and the timestamp cannot be used to decrypt the password.

Before decryption, the driver calculates the MAC using the ciphertext, transformation name, and algorithm parameters if any, and verifies that the calculated MAC matches the expected MAC. The driver raises an exception if the calculated MAC differs from the expected MAC, to indicate that either or both of the files may have been tampered with.

Finally, the driver uses the decrypted password to log on to the database.

<a id="LogonMethods"></a>

### Logon Authentication Methods

The following table describes the logon authentication methods selected by the `logmech` connection parameter.

`logmech` | Description | Usage and Requirements
----------|-------------|---
`BEARER`  | OIDC Client Credentials Grant with JWT Bearer Token for client authentication | `user`, `password`, and `logdata` must all be omitted when using this method.<br/>`jws_private_key` is required when using this method. `jws_cert` is also needed for Identity Providers that require an "x5t" header thumbprint.<br/>`oidc_clientid` is commonly used to override the default Client ID when using this method.<br/>`oidc_scope`, `oidc_token`, and `jws_algorithm` are optional parameters when using this method.<br/>The database user must have the "logon with null password" permission.<br/>The database must be configured with Identity Provider information for Federated Authentication. These tasks are covered in the reference Teradata Vantage&trade; Security Administration.
`BROWSER` | Browser Authentication, also known as OIDC Authorization Code Flow with Proof Key for Code Exchange (PKCE) | `user`, `password`, and `logdata` must all be omitted when using Browser Authentication.<br/>`browser`, `browser_tab_timeout`, `browser_timeout`, `oidc_clientid`, `oidc_scope`, and `oidc_token` are optional parameters when using this method.<br/>Browser Authentication is supported for Windows and macOS. Browser Authentication is not supported for other operating systems.<br/>The database user must have the "logon with null password" permission.<br/>The database must be configured with Identity Provider information for Federated Authentication. These tasks are covered in the reference Teradata Vantage&trade; Security Administration.
`CODE`    | OIDC Device Code Flow, also known as OIDC Device Authorization Grant | `user`, `password`, and `logdata` must all be omitted when using this method.<br/>`code_append_file`, `oidc_clientid`, `oidc_scope`, and `oidc_token` are optional parameters when using this method.<br/>The database user must have the "logon with null password" permission.<br/>The database must be configured with Identity Provider information for Federated Authentication. These tasks are covered in the reference Teradata Vantage&trade; Security Administration.
`CRED`    | OIDC Client Credentials Grant with client_secret_post for client authentication | `user`, `password`, `oidc_clientid`, and `oidc_scope` must all be omitted when using this method.<br/>`logdata` must contain the Client Credentials Grant request HTTP POST Form Data encoded as Content-Type application/x-www-form-urlencoded.<br/>`oidc_token` is an optional parameter when using this method.<br/>The database user must have the "logon with null password" permission.<br/>The database must be configured with Identity Provider information for Federated Authentication. These tasks are covered in the reference Teradata Vantage&trade; Security Administration.
`JWT`     | JSON Web Token (JWT) | `logdata` must contain `token=` followed by the JSON Web Token.<br/>The database user must have the "logon with null password" permission.<br/>Your application must obtain a valid JWT from a User Service that is accessible to your application. The database must be configured to trust JWTs issued by your User Service. These tasks are covered in the reference Teradata Vantage&trade; Security Administration.
`KRB5`    | Kerberos V5 | Requires a significant number of administration tasks on the machine that is running the driver.<br/>For Kerberos Single Sign On (SSO), the database user must have the "logon with null password" permission.
`LDAP`    | Lightweight Directory Access Protocol (LDAP) | Requires a significant administration effort to set up the LDAP environment. These tasks are covered in the reference Teradata Vantage&trade; Security Administration.<br/>Once they are complete, LDAP can be used without any additional work required on the machine that is running the driver.
`ROPC`    | OIDC Resource Owner Password Credentials (ROPC) | `logdata` must be omitted when using this method.<br/>`user` and `password` are required when using this method.<br/>`oidc_clientid`, `oidc_scope`, and `oidc_token` are optional parameters when using this method.<br/>The database user must have the "logon with null password" permission.<br/>The database must be configured with Identity Provider information for Federated Authentication. These tasks are covered in the reference Teradata Vantage&trade; Security Administration.
`SECRET`  | OIDC Client Credentials Grant with client_secret_basic for client authentication | `user` and `password` must be omitted when using this method.<br/>`logdata` must contain the client secret.<br/>`oidc_clientid` is commonly used to override the default Client ID when using this method.<br/>`oidc_scope` and `oidc_token` are optional parameters when using this method.<br/>The database user must have the "logon with null password" permission.<br/>The database must be configured with Identity Provider information for Federated Authentication. These tasks are covered in the reference Teradata Vantage&trade; Security Administration.
`TD2`     | Teradata Method 2 | Does not require any special setup, and can be used immediately.
`TDNEGO`  | Teradata Negotiating Mechanism | Automatically selects the appropriate logon authentication method.

<a id="ClientAttributes"></a>

### Client Attributes

Client Attributes record a variety of information about the client system and client software in the system tables `DBC.SessionTbl` and `DBC.EventLog`. Client Attributes are intended to be a replacement for the information recorded in the `LogonSource` column of the system tables `DBC.SessionTbl` and `DBC.EventLog`.

The Client Attributes are recorded at session logon time. Subsequently, the system views `DBC.SessionInfoV` and `DBC.LogOnOffV` can be queried to obtain information about the client system and client software on a per-session basis. Client Attribute values may be recorded in the database in either mixed-case or in uppercase, depending on the session character set and other factors. Analysis of recorded Client Attributes must flexibly accommodate either mixed-case or uppercase values.

Warning: The information in this section is subject to change in future releases of the driver. Client Attributes can be "mined" for information about client system demographics; however, any applications that parse Client Attribute values must be changed if Client Attribute formats are changed in the future.

Client Attributes are not intended to be used for workload management. Instead, query bands are intended for workload management. Any use of Client Attributes for workload management may break if Client Attributes are changed, or augmented, in the future.

Client Attribute            | Source   | Description
--------------------------- | -------- | ---
`MechanismName`             | database | The connection's logon mechanism; for example, TD2, LDAP, etc.
`ClientIpAddress`           | database | The client IP address, as determined by the database
`ClientTcpPortNumber`       | database | The connection's client TCP port number, as determined by the database
`ClientIPAddrByClient`      | driver   | The client IP address, as determined by the driver
`ClientPortByClient`        | driver   | The connection's client TCP port number, as determined by the driver
`ClientProgramName`         | driver   | The client program name, followed by a streamlined call stack
`ClientSystemUserId`        | driver   | The client user name
`ClientOsName`              | driver   | The client operating system name
`ClientProcThreadId`        | driver   | The client process ID
`ClientVmName`              | driver   | Node.js runtime information
`ClientTdHostName`          | driver   | The database hostname as specified by the application, without any COP suffix
`ClientCOPSuffixedHostName` | driver   | The COP-suffixed database hostname chosen by the driver
`ServerIPAddrByClient`      | driver   | The database node's IP address, as determined by the driver
`ServerPortByClient`        | driver   | The destination port number of the TCP connection to the database node, as determined by the driver
`ClientConfType`            | driver   | The confidentiality type, as determined by the driver<br/>`V` - TLS used for encryption, with full certificate verification<br/>`C` - TLS used for encryption, with Certificate Authority (CA) verification<br/>`R` - TLS used for encryption, with no certificate verification<br/>`E` - TLS was not attempted, and TDGSS used for encryption<br/>`U` - TLS was not attempted, and TDGSS encryption depends on central administration<br/>`F` - TLS was attempted, but the TLS handshake failed, so this is a fallback to using TDGSS for encryption<br/>`H` - SSLMODE was set to PREFER, but a non-TLS connection was made, and TDGSS encryption depends on central administration
`ServerConfType`            | database | The confidentiality type, as determined by the database<br/>`T` - TLS used for encryption<br/>`E` - TDGSS used for encryption<br/>`U` - Data transfer is unencrypted
`ClientConfVersion`         | database | The TLS version as determined by the database, if this is an HTTPS/TLS connection
`ClientConfCipherSuite`     | database | The TLS cipher as determined by the database, if this is an HTTPS/TLS connection
`ClientAttributesEx`        | driver   | Additional Client Attributes are available in this column as a list of name=value pairs, each terminated by a semicolon. Individual values can be accessed using the `NVP` system function.<br/>`NODEJS` - The Node.js version<br/>`GO` - The Go version<br/>`SCS` - The session character set<br/>`CCS` - The client character set<br/>`LOB` - Y/N indicator for LOB support<br/>`SIP` - Y/N indicator for StatementInfo parcel support<br/>`TM` - The transaction mode indicator A (ANSI) or T (TERA)<br/>`ENC` - Y/N indicator for `encryptdata` connection parameter<br/>`DP` - The `dbs_port` connection parameter<br/>`HP` - The `https_port` connection parameter<br/>`SSL` - Numeric level corresponding to `sslmode`<br/>`SSLM` - The `sslmode` connection parameter<br/>`CERT` - The database TLS certificate status<br/>`BA` - Y/N indicator for Browser Authentication<br/>`LM` - The logon authentication method<br/>`JWS` - The JSON Web Signature (JWS) algorithm<br/>`JH` - JWT header parameters to identify signature key<br/><br/>The `CERT` and `IDPC` attributes indicate the TLS certificate status of an HTTPS/TLS connection. When the attribute indicates the TLS certificate is valid (`V`) or invalid (`I`), then additional TLS certificate status details are provided as a series of comma-separated two-letter codes.<br/>`U` - the TLS certificate status is unavailable<br/>`V` - the TLS certificate status is valid<br/>`I` - the TLS certificate status is invalid<br/>`PU` - sslca PEM file is unavailable for server certificate verification<br/>`PA` - server certificate was verified using sslca PEM file<br/>`PR` - server certificate was rejected using sslca PEM file<br/>`DU` - sslcapath PEM directory is unavailable for server certificate verification<br/>`DA` - server certificate was verified using sslcapath PEM directory<br/>`DR` - server certificate was rejected using sslcapath PEM directory<br/>`TA` - server certificate was verified by the system<br/>`TR` - server certificate was rejected by the system<br/>`CY` - server certificate passed VERIFY-CA check<br/>`CN` - server certificate failed VERIFY-CA check<br/>`HU` - server hostname is unavailable for server certificate matching, because database IP address was specified<br/>`HY` - server hostname matches server certificate<br/>`HN` - server hostname does not match server certificate<br/>`RU` - resolved server hostname is unavailable for server certificate matching, because database IP address was specified<br/>`RY` - resolved server hostname matches server certificate<br/>`RN` - resolved server hostname does not match server certificate<br/>`IY` - IP address matches server certificate<br/>`IN` - IP address does not match server certificate<br/>`FY` - server certificate passed VERIFY-FULL check<br/>`FN` - server certificate failed VERIFY-FULL check<br/>`SU` - certificate revocation check status is unavailable<br/>`SG` - certificate revocation check status is good<br/>`SR` - certificate revocation check status is revoked

#### LogonSource Column

The `LogonSource` column is obsolete and has been superseded by Client Attributes. The `LogonSource` column may be deprecated and subsequently removed in future releases of the database.

When the driver establishes a connection to the database, the driver composes a string value that is stored in the `LogonSource` column of the system tables `DBC.SessionTbl` and `DBC.EventLog`. The `LogonSource` column is included in system views such as `DBC.SessionInfoV` and `DBC.LogOnOffV`. All `LogonSource` values are recorded in the database in uppercase.

The driver follows the format documented in the Teradata Data Dictionary, section "System Views Columns Reference", for network-attached `LogonSource` values. Network-attached `LogonSource` values have eight fields, separated by whitespace. The database composes fields 1 through 3, and the driver composes fields 4 through 8.

Field | Source   | Description
----- | -------- | ---
1     | database | The string `(TCP/IP)` to indicate the connection type
2     | database | The connection's client TCP port number, in hexadecimal
3     | database | The client IP address, as determined by the database
4     | driver   | The database hostname as specified by the application, without any COP suffix
5     | driver   | The client process ID
6     | driver   | The client user name
7     | driver   | The client program name
8     | driver   | The string `01 LSS` to indicate the `LogonSource` string version `01`

<a id="UserStartup"></a>

### User STARTUP SQL Request

`CREATE USER` and `MODIFY USER` commands provide `STARTUP` clauses for specifying SQL commands to establish initial session settings. The following table lists several of the SQL commands that may be used to establish initial session settings.

Category                 | SQL command
------------------------ | ---
Diagnostic settings      | `DIAGNOSTIC` ... `FOR SESSION`
Session query band       | `SET QUERY_BAND` ... `FOR SESSION`
Unicode Pass Through     | `SET SESSION CHARACTER SET UNICODE PASS THROUGH ON`
Transaction isolation    | `SET SESSION CHARACTERISTICS AS TRANSACTION ISOLATION LEVEL`
Collation sequence       | `SET SESSION COLLATION`
Temporal qualifier       | `SET SESSION CURRENT VALIDTIME AND CURRENT TRANSACTIONTIME`
Date format              | `SET SESSION DATEFORM`
Function tracing         | `SET SESSION FUNCTION TRACE`
Session time zone        | `SET TIME ZONE`

For example, the following command sets a `STARTUP` SQL request for user `susan` to establish read-uncommitted transaction isolation after logon.

    MODIFY USER susan AS STARTUP='SET SESSION CHARACTERISTICS AS TRANSACTION ISOLATION LEVEL RU'

The driver's `runstartup` connection parameter must be `true` to execute the user's `STARTUP` SQL request after logon. The default for `runstartup` is `false`. If the `runstartup` connection parameter is omitted or `false`, then the user's `STARTUP` SQL request will not be executed.

<a id="TransactionMode"></a>

### Transaction Mode

The `tmode` connection parameter enables an application to specify the transaction mode for the connection.
* `"tmode":"ANSI"` provides American National Standards Institute (ANSI) transaction semantics. This mode is recommended.
* `"tmode":"TERA"` provides legacy Teradata transaction semantics. This mode is only recommended for legacy applications that require Teradata transaction semantics.
* `"tmode":"DEFAULT"` provides the default transaction mode configured for the database, which may be either ANSI or TERA mode. `"tmode":"DEFAULT"` is the default when the `tmode` connection parameter is omitted.

While ANSI mode is generally recommended, please note that every application is different, and some applications may need to use TERA mode. The following differences between ANSI and TERA mode might affect a typical user or application:
1. Silent truncation of inserted data occurs in TERA mode, but not ANSI mode. In ANSI mode, the database returns an error instead of truncating data.
2. Tables created in ANSI mode are `MULTISET` by default. Tables created in TERA mode are `SET` tables by default.
3. For tables created in ANSI mode, character columns are `CASESPECIFIC` by default. For tables created in TERA mode, character columns are `NOT CASESPECIFIC` by default.
4. In ANSI mode, character literals are `CASESPECIFIC`. In TERA mode, character literals are `NOT CASESPECIFIC`.

The last two behavior differences, taken together, may cause character data comparisons (such as in `WHERE` clause conditions) to be case-insensitive in TERA mode, but case-sensitive in ANSI mode. This, in turn, can produce different query results in ANSI mode versus TERA mode. Comparing two `NOT CASESPECIFIC` expressions is case-insensitive regardless of mode, and comparing a `CASESPECIFIC` expression to another expression of any kind is case-sensitive regardless of mode. You may explicitly `CAST` an expression to be `CASESPECIFIC` or `NOT CASESPECIFIC` to obtain the character data comparison required by your application.

The Teradata Reference / *SQL Request and Transaction Processing* recommends that ANSI mode be used for all new applications. The primary benefit of using ANSI mode is that inadvertent data truncation is avoided. In contrast, when using TERA mode, silent data truncation can occur when data is inserted, because silent data truncation is a feature of TERA mode.

A drawback of using ANSI mode is that you can only call stored procedures that were created using ANSI mode, and you cannot call stored procedures that were created using TERA mode. It may not be possible to switch over to ANSI mode exclusively, because you may have some legacy applications that require TERA mode to work properly. You can work around this drawback by creating your stored procedures twice, in two different users/databases, once using ANSI mode, and once using TERA mode.

Refer to the Teradata Reference / *SQL Request and Transaction Processing* for complete information regarding the differences between ANSI and TERA transaction modes.


<a id="AutoCommit"></a>

### Auto-Commit

The driver provides auto-commit on and off functionality for both ANSI and TERA mode.

When a connection is first established, it begins with the default auto-commit setting, which is on. When auto-commit is on, the driver is solely responsible for managing transactions, and the driver commits each SQL request that is successfully executed. An application should not execute any transaction management SQL commands when auto-commit is on. An application should not call the `commit` method or the `rollback` method when auto-commit is on.

An application can manage transactions itself by setting the connection's `.autocommit` attribute to `false` to turn off auto-commit.

    con.autocommit = false

When auto-commit is off, the driver leaves the current transaction open after each SQL request is executed, and the application is responsible for committing or rolling back the transaction by calling the `commit` or the `rollback` method, respectively.

Auto-commit remains turned off until the application turns it back on by setting the connection's `.autocommit` attribute to `True`.

    con.autocommit = true

Best practices recommend that an application avoid executing database-vendor-specific transaction management commands such as `BT`, `ET`, `ABORT`, `COMMIT`, or `ROLLBACK`, because such commands differ from one vendor to another. (They even differ between Teradata's two modes ANSI and TERA.) Instead, best practices recommend that an application only call the standard methods `commit` and `rollback` for transaction management.
1. When auto-commit is on in ANSI mode, the driver automatically executes `COMMIT` after every successful SQL request.
2. When auto-commit is off in ANSI mode, the driver does not automatically execute `COMMIT`. When the application calls the `commit` method, then the driver executes `COMMIT`.
3. When auto-commit is on in TERA mode, the driver does not execute `BT` or `ET`, unless the application explicitly executes `BT` or `ET` commands itself, which is not recommended.
4. When auto-commit is off in TERA mode, the driver executes `BT` before submitting the application's first SQL request of a new transaction. When the application calls the `commit` method, then the driver executes `ET` until the transaction is complete.

As part of the wire protocol between the database and Teradata client interface software (such as this driver), each message transmitted from the database to the client has a bit designated to indicate whether the session has a transaction in progress or not. Thus, the client interface software is kept informed as to whether the session has a transaction in progress or not.

In TERA mode with auto-commit off, when the application uses the driver to execute a SQL request, if the session does not have a transaction in progress, then the driver automatically executes `BT` before executing the application's SQL request. Subsequently, in TERA mode with auto-commit off, when the application uses the driver to execute another SQL request, and the session already has a transaction in progress, then the driver has no need to execute `BT` before executing the application's SQL request.

In TERA mode, `BT` and `ET` pairs can be nested, and the database keeps track of the nesting level. The outermost `BT`/`ET` pair defines the transaction scope; inner `BT`/`ET` pairs have no effect on the transaction because the database does not provide actual transaction nesting. To commit the transaction, `ET` commands must be repeatedly executed until the nesting is unwound. The Teradata wire protocol bit (mentioned earlier) indicates when the nesting is unwound and the transaction is complete. When the application calls the `commit` method in TERA mode, the driver repeatedly executes `ET` commands until the nesting is unwound and the transaction is complete.

In rare cases, an application may not follow best practices and may explicitly execute transaction management commands. Such an application must turn off auto-commit before executing transaction management commands such as `BT`, `ET`, `ABORT`, `COMMIT`, or `ROLLBACK`. The application is responsible for executing the appropriate commands for the transaction mode in effect. TERA mode commands are `BT`, `ET`, and `ABORT`. ANSI mode commands are `COMMIT` and `ROLLBACK`. An application must take special care when opening a transaction in TERA mode with auto-commit off. In TERA mode with auto-commit off, when the application executes a SQL request, if the session does not have a transaction in progress, then the driver automatically executes `BT` before executing the application's SQL request. Therefore, the application should not begin a transaction by executing `BT`.

    # TERA mode example showing undesirable BT/ET nesting
    con.autocommit = false
    cur.execute("BT") # BT automatically executed by the driver before this, and produces a nested BT
    cur.execute("insert into mytable1 values(1, 2)")
    cur.execute("insert into mytable2 values(3, 4)")
    cur.execute("ET") # unwind nesting
    cur.execute("ET") # complete transaction

    # TERA mode example showing how to avoid BT/ET nesting
    con.autocommit = false
    cur.execute("insert into mytable1 values(1, 2)") # BT automatically executed by the driver before this
    cur.execute("insert into mytable2 values(3, 4)")
    cur.execute("ET") # complete transaction

Please note that neither previous example shows best practices. Best practices recommend that an application only call the standard methods `commit` and `rollback` for transaction management.

    # Example showing best practice
    con.autocommit = false
    cur.execute("insert into mytable1 values(1, 2)")
    cur.execute("insert into mytable2 values(3, 4)")
    con.commit()

<a id="DataTypes"></a>

### Data Types

The table below lists the Teradata Database data types supported by the Teradata SQL Driver for Node.js, and indicates the corresponding JavaScript data type returned in result set rows.

Teradata Database data type        | Result set JavaScript data type   | With `teradata_values` as `"false"`
---------------------------------- | --------------------------------- | ---
`BIGINT`                           | `BigInt`                          |
`BLOB`                             | `Uint8Array`                      |
`BYTE`                             | `Uint8Array`                      |
`BYTEINT`                          | `Number`                          |
`CHAR`                             | `String`                          |
`CLOB`                             | `String`                          |
`DATE`                             | `String`                          |
`DECIMAL`                          | `Number`                          | `String`
`FLOAT`                            | `Number`                          |
`INTEGER`                          | `Number`                          |
`INTERVAL YEAR`                    | `String`                          |
`INTERVAL YEAR TO MONTH`           | `String`                          |
`INTERVAL MONTH`                   | `String`                          |
`INTERVAL DAY`                     | `String`                          |
`INTERVAL DAY TO HOUR`             | `String`                          |
`INTERVAL DAY TO MINUTE`           | `String`                          |
`INTERVAL DAY TO SECOND`           | `String`                          |
`INTERVAL HOUR`                    | `String`                          |
`INTERVAL HOUR TO MINUTE`          | `String`                          |
`INTERVAL HOUR TO SECOND`          | `String`                          |
`INTERVAL MINUTE`                  | `String`                          |
`INTERVAL MINUTE TO SECOND`        | `String`                          |
`INTERVAL SECOND`                  | `String`                          |
`NUMBER`                           | `Number`                          | `String`
`PERIOD(DATE)`                     | `String`                          |
`PERIOD(TIME)`                     | `String`                          |
`PERIOD(TIME WITH TIME ZONE)`      | `String`                          |
`PERIOD(TIMESTAMP)`                | `String`                          |
`PERIOD(TIMESTAMP WITH TIME ZONE)` | `String`                          |
`SMALLINT`                         | `Number`                          |
`TIME`                             | `String`                          |
`TIME WITH TIME ZONE`              | `String`                          |
`TIMESTAMP`*                       | `Date`                            | `String`
`TIMESTAMP WITH TIME ZONE`         | `String`                          |
`VARBYTE`                          | `Uint8Array`                      |
`VARCHAR`                          | `String`                          |
`XML`                              | `String`                          |

\* The TIMESTAMP value retrieved from the server is regarded as the universal time (i.e., the UTC time) by the Teradata SQL Driver for Node.js.

The table below lists the parameterized SQL bind-value JavaScript data types supported by the Teradata SQL Driver for Node.js, and indicates the corresponding Teradata Database data type transmitted to the server.

Bind-value JavaScript data type   | Teradata Database data type
--------------------------------- | ---
`Boolean`                         |  Not supported
`BigInt`                          | `BIGINT`
`Date`                            | `TIMESTAMP(3)`
`Number`                          | `FLOAT`
`String`                          | `VARCHAR`
`Symbol`                          |  Not supported
`Uint8Array`                      | `VARBYTE`

The Teradata SQL Driver for Node.js transmits the UTC time of the JavaScript Date object to the server as the `TIMESTAMP(3)` value.

Transforms are used for SQL `ARRAY` data values, and they can be transferred to and from the database as `VARCHAR` values.

Transforms are used for structured UDT data values, and they can be transferred to and from the database as `VARCHAR` values.

<a id="NullValues"></a>

## Null Values

SQL `NULL` values received from the Teradata Database are returned in result set rows as JavaScript `null` values.

A JavaScript `null` value bound to a question-mark parameter marker is transmitted to the Teradata Database as a `NULL` `VARCHAR` value.

The database does not provide automatic or implicit conversion of a `NULL` `VARCHAR` value to a different destination data type.

* For `NULL` column values in a batch, the driver will automatically convert the `NULL` values to match the data type of the non-`NULL` values in the same column.
* For solitary `NULL` values, your application may need to explicitly specify the data type with the `teradata_parameter` escape function, in order to avoid database error 3532 for non-permitted data type conversion.

Given a table with a destination column of `BYTE(4)`, the database would reject the following SQL with database error 3532 "Conversion between BYTE data and other types is illegal."

    cur.execute("update mytable set bytecolumn = ?", [null]) // fails with database error 3532

To avoid database error 3532 in this situation, your application must use the the `teradata_parameter` escape function to specify the data type for the question-mark parameter marker.

    cur.execute("{fn teradata_parameter(1, BYTE(4))}update mytable set bytecolumn = ?", [null])

<a id="UndefinedValues"></a>

## Undefined Values

A JavaScript `undefined` value bound to a question-mark parameter marker is transmitted to the Teradata Database as a `NULL` `VARCHAR` value.    

<a id="CharacterExportWidth"></a>

### Character Export Width

The driver always uses the UTF8 session character set, and the `charset` connection parameter is not supported. Be aware of the database's *Character Export Width* behavior that adds trailing space padding to fixed-width `CHAR` data type result set column values when using the UTF8 session character set.

The database `CHAR(`_n_`)` data type is a fixed-width data type (holding _n_ characters), and the database reserves a fixed number of bytes for the `CHAR(`_n_`)` data type in response spools and in network message traffic.

UTF8 is a variable-width character encoding scheme that requires a varying number of bytes for each character. When the UTF8 session character set is used, the database reserves the maximum number of bytes that the `CHAR(`_n_`)` data type could occupy in response spools and in network message traffic. When the UTF8 session character set is used, the database appends padding characters to the tail end of `CHAR(`_n_`)` values smaller than the reserved maximum size, so that the `CHAR(`_n_`)` values all occupy the same fixed number of bytes in response spools and in network message traffic.

Work around this drawback by using `CAST` or `TRIM` in SQL `SELECT` statements, or in views, to convert fixed-width `CHAR` data types to `VARCHAR`.

Given a table with fixed-width `CHAR` columns:

`CREATE TABLE MyTable (c1 CHAR(10), c2 CHAR(10))`

Original query that produces trailing space padding:

`SELECT c1, c2 FROM MyTable`

Modified query with either `CAST` or `TRIM` to avoid trailing space padding:

`SELECT CAST(c1 AS VARCHAR(10)), TRIM(TRAILING FROM c2) FROM MyTable`

Or wrap query in a view with `CAST` or `TRIM` to avoid trailing space padding:

`CREATE VIEW MyView (c1, c2) AS SELECT CAST(c1 AS VARCHAR(10)), TRIM(TRAILING FROM c2) FROM MyTable`

`SELECT c1, c2 FROM MyView`

This technique is also demonstrated in sample program `CharPadding.ts`.

<a id="ModuleConstructors"></a>

### Module Constructors

`teradatasql.connect(` *ConnectionObject* `, ` *ConnectionJSONString* `)`

Creates a connection to the database and returns a Connection object.

The first parameter is an optional JavaScript object that defaults to `{}`. The second argument is an optional JSON string that defaults to `"{}"`. Specify connection parameters as a JavaScript object, a JSON string, or a combination of the two.

When a combination of parameters are specified, connection parameters specified as the JSON string takes precedence over same-named connection parameters specified in the JavaScript object.

---

`teradatasql.date(` *Year* `,` *Month* `,` *Day* `)`

Creates and returns a `string` value in the ‘YYYY-MM-DD’ format.

---

`teradatasql.dateFromTicks(` *Seconds* `)`

Creates and returns a `string` value corresponding to the specified number of seconds after 1970-01-01 00:00:00 in the 'YYYY-MM-DD HH:MM:SS.FFFFFF' format .

---

`teradatasql.timestamp(` *Year* `,` *Month* `,` *Day* `,` *Hour* `,` *Minute* `,` *Second* `)`

Creates and returns a `Date` value.

---

`teradatasql.timestampFromTicks(` *Seconds* `)`

Creates and returns a `Date` value corresponding to the specified number of seconds after 1970-01-01 00:00:00.

<a id="ModuleGlobals"></a>

<a id="ModuleExceptions"></a>

### Module Exceptions

`teradatasql.Error` is the base class for other exceptions.
* `teradatasql.InterfaceError` is raised for errors related to the driver. Not supported yet.
* `teradatasql.DatabaseError` is raised for errors related to the database.
  * `teradatasql.DataError` is raised for data value errors such as division by zero. Not supported yet.
  * `teradatasql.IntegrityError` is raised for referential integrity violations. Not supported yet.
  * `teradatasql.OperationalError` is raised for errors related to the database's operation.
  * `teradatasql.ProgrammingError` is raised for SQL object existence errors and SQL syntax errors. Not supported yet.

<a id="ConnectionAttributes"></a>

### Connection Attributes

`.autocommit`

Read/write `boolean` attribute for the connection's auto-commit setting. Defaults to `true` meaning auto-commit is turned on.

<a id="ConnectionMethods"></a>

### Connection Methods

`.close()`

Closes the Connection.

---

`.commit()`

Commits the current transaction.

---

`.cursor()`

Creates and returns a new Cursor object for the Connection.

---

`.rollback()`

Rolls back the current transaction.

<a id="CursorAttributes"></a>

### Cursor Attributes

`.arraysize`

Read/write `number` attribute specifying the number of rows to fetch at a time with the `.fetchmany()` method and the `.fetchall()` method. Defaults to `1` meaning fetch a single row at a time.

---

`.connection`

Read-only attribute indicating the Cursor's parent Connection object.

---

`.description`

Read-only attribute consisting of a sequence of seven-item sequences that each describe a result set column, available after a SQL request is executed.
* `.description[`*Column*`][0]` provides the column name.
* `.description[`*Column*`][1]` provides the column type code as an object comparable to one of the Type Objects listed below.
* `.description[`*Column*`][2]` provides the column display size in characters. Not implemented yet.
* `.description[`*Column*`][3]` provides the column size in bytes.
* `.description[`*Column*`][4]` provides the column precision if applicable, or `None` otherwise.
* `.description[`*Column*`][5]` provides the column scale if applicable, or `None` otherwise.
* `.description[`*Column*`][6]` provides the column nullability as `True` or `False`.

---

`.rowcount`

Read-only `BigInt` attribute indicating the number of rows returned from, or affected by, the current SQL statement.

<a id="CursorMethods"></a>

### Cursor Methods

`.callproc(` *ProcedureName* `,` *OptionalSequenceOfParameterValues* `)`

Calls the stored procedure specified by *ProcedureName*.
Provide the second argument as a sequence of `IN` and `INOUT` parameter values to bind the values to question-mark parameter markers in the SQL request.
Specifying parameter values as a mapping is not supported.
Returns a result set consisting of the `INOUT` parameter output values, if any, followed by any dynamic result sets.

`OUT` parameters are not supported by this method. Use `.execute` to call a stored procedure with `OUT` parameters.

---

`.close()`

Closes the Cursor.

---

`.execute(` *SQLRequest* `,` *OptionalSequenceOfParameterValues* `, ignoreErrors=` *OptionalSequenceOfIgnoredErrorCodes* `)`

Executes the SQL request.
If a sequence of parameter values is provided as the second argument, the values will be bound to question-mark parameter markers in the SQL request. Specifying parameter values as a mapping is not supported.

---

`.executemany(` *SQLRequest* `,` *SequenceOfSequencesOfParameterValues* `, ignoreErrors=` *OptionalSequenceOfIgnoredErrorCodes* `)`

Executes the SQL request as an iterated SQL request for the batch of parameter values.
The batch of parameter values must be specified as a sequence of sequences. Specifying parameter values as a mapping is not supported.

The `ignoreErrors` parameter is optional. The ignored error codes must be specified as a sequence of integers.

---

`.fetchall()`

Fetches all remaining rows of the current result set.
Returns a sequence of sequences of column values.

---

`.fetchmany(` *OptionalRowCount* `)`

Fetches the next series of rows of the current result set.
The argument specifies the number of rows to fetch. If no argument is provided, then the Cursor's `.arraysize` attribute will determine the number of rows to fetch.
Returns a sequence of sequences of column values, or an empty sequence to indicate that all rows have been fetched.

---

`.fetchone()`

Fetches the next row of the current result set.
Returns a sequence of column values, or `None` to indicate that all rows have been fetched.

---

`.nextset()`

Advances to the next result set.
Returns `True` if another result set is available, or `None` to indicate that all result sets have been fetched.

---

`.setinputsizes(` *SequenceOfTypesOrSizes* `)`

Has no effect.

---

`.setoutputsize(` *Size* `,` *OptionalColumnIndex* `)`

Has no effect.

<a id="TypeObjects"></a>

### Type Objects

`teradatasql.BINARY`

Identifies a SQL `BLOB`, `BYTE`, or `VARBYTE` column as a binary data type when compared with the Cursor's description attribute.

`.description[`*Column*`][1] == teradatasql.BINARY`

---

`teradatasql.DATE`

Identifies a SQL `TIMESTAMP (WITHOUT TIME ZONE)` column as a date data type when compared with the Cursor's description attribute.

`.description[`*Column*`][1] == teradatasql.DATE`

---

`teradatasql.NUMBER`

Identifies a SQL `BIGINT`, `BYTEINT`, `DECIMAL`, `FLOAT`, `INTEGER`, `NUMBER`, or `SMALLINT` column as a numeric data type when compared with the Cursor's description attribute.

`.description[`*Column*`][1] == teradatasql.NUMBER`

---

`teradatasql.STRING`

Identifies a SQL `CHAR`, `CLOB`, `INTERVAL`, `PERIOD`, `VARCHAR`, `DATE`, `TIME`, `TIME WITH TIME ZONE`, or `TIMESTAMP WITH TIME ZONE` column as a character data type when compared with the Cursor's description attribute.

`.description[`*Column*`][1] == teradatasql.STRING`

<a id="EscapeSyntax"></a>

### Escape Syntax

The driver accepts most of the JDBC escape clauses offered by the Teradata JDBC Driver.

#### Date and Time Literals

Date and time literal escape clauses are replaced by the corresponding SQL literal before the SQL request text is transmitted to the database.

Literal Type | Format
------------ | ------
Date         | `{d '`*yyyy-mm-dd*`'}`
Time         | `{t '`*hh:mm:ss*`'}`
Timestamp    | `{ts '`*yyyy-mm-dd hh:mm:ss*`'}`
Timestamp    | `{ts '`*yyyy-mm-dd hh:mm:ss.f*`'}`

For timestamp literal escape clauses, the decimal point and fractional digits may be omitted, or 1 to 6 fractional digits *f* may be specified after a decimal point.

#### Scalar Functions

Scalar function escape clauses are replaced by the corresponding SQL expression before the SQL request text is transmitted to the database.

Numeric Function                       | Returns
-------------------------------------- | ---
`{fn ABS(`*number*`)}`                 | Absolute value of *number*
`{fn ACOS(`*float*`)}`                 | Arccosine, in radians, of *float*
`{fn ASIN(`*float*`)}`                 | Arcsine, in radians, of *float*
`{fn ATAN(`*float*`)}`                 | Arctangent, in radians, of *float*
`{fn ATAN2(`*y*`,`*x*`)}`              | Arctangent, in radians, of *y* / *x*
`{fn CEILING(`*number*`)}`             | Smallest integer greater than or equal to *number*
`{fn COS(`*float*`)}`                  | Cosine of *float* radians
`{fn COT(`*float*`)}`                  | Cotangent of *float* radians
`{fn DEGREES(`*number*`)}`             | Degrees in *number* radians
`{fn EXP(`*float*`)}`                  | *e* raised to the power of *float*
`{fn FLOOR(`*number*`)}`               | Largest integer less than or equal to *number*
`{fn LOG(`*float*`)}`                  | Natural (base *e*) logarithm of *float*
`{fn LOG10(`*float*`)}`                | Base 10 logarithm of *float*
`{fn MOD(`*integer1*`,`*integer2*`)}`  | Remainder for *integer1* / *integer2*
`{fn PI()}`                            | The constant pi, approximately equal to 3.14159...
`{fn POWER(`*number*`,`*integer*`)}`   | *number* raised to *integer* power
`{fn RADIANS(`*number*`)}`             | Radians in *number* degrees
`{fn RAND(`*seed*`)}`                  | A random float value such that 0 &le; value < 1, and *seed* is ignored
`{fn ROUND(`*number*`,`*places*`)}`    | *number* rounded to *places*
`{fn SIGN(`*number*`)}`                | -1 if *number* is negative; 0 if *number* is 0; 1 if *number* is positive
`{fn SIN(`*float*`)}`                  | Sine of *float* radians
`{fn SQRT(`*float*`)}`                 | Square root of *float*
`{fn TAN(`*float*`)}`                  | Tangent of *float* radians
`{fn TRUNCATE(`*number*`,`*places*`)}` | *number* truncated to *places*

String Function                                                | Returns
-------------------------------------------------------------- | ---
`{fn ASCII(`*string*`)}`                                       | ASCII code of the first character in *string*
`{fn CHAR(`*code*`)}`                                          | Character with ASCII *code*
`{fn CHAR_LENGTH(`*string*`)}`                                 | Length in characters of *string*
`{fn CHARACTER_LENGTH(`*string*`)}`                            | Length in characters of *string*
`{fn CONCAT(`*string1*`,`*string2*`)}`                         | String formed by concatenating *string1* and *string2*
`{fn DIFFERENCE(`*string1*`,`*string2*`)}`                     | A number from 0 to 4 that indicates the phonetic similarity of *string1* and *string2* based on their Soundex codes, such that a larger return value indicates greater phonetic similarity; 0 indicates no similarity, 4 indicates strong similarity
`{fn INSERT(`*string1*`,`*position*`,`*length*`,`*string2*`)}` | String formed by replacing the *length*-character segment of *string1* at *position* with *string2*, available beginning with Teradata Database 15.0
`{fn LCASE(`*string*`)}`                                       | String formed by replacing all uppercase characters in *string* with their lowercase equivalents
`{fn LEFT(`*string*`,`*count*`)}`                              | Leftmost *count* characters of *string*
`{fn LENGTH(`*string*`)}`                                      | Length in characters of *string*
`{fn LOCATE(`*string1*`,`*string2*`)}`                         | Position in *string2* of the first occurrence of *string1*, or 0 if *string2* does not contain *string1*
`{fn LTRIM(`*string*`)}`                                       | String formed by removing leading spaces from *string*
`{fn OCTET_LENGTH(`*string*`)}`                                | Length in octets (bytes) of *string*
`{fn POSITION(`*string1*` IN `*string2*`)}`                    | Position in *string2* of the first occurrence of *string1*, or 0 if *string2* does not contain *string1*
`{fn REPEAT(`*string*`,`*count*`)}`                            | String formed by repeating *string* *count* times, available beginning with Teradata Database 15.0
`{fn REPLACE(`*string1*`,`*string2*`,`*string3*`)}`            | String formed by replacing all occurrences of *string2* in *string1* with *string3*
`{fn RIGHT(`*string*`,`*count*`)}`                             | Rightmost *count* characters of *string*, available beginning with Teradata Database 15.0
`{fn RTRIM(`*string*`)}`                                       | String formed by removing trailing spaces from *string*
`{fn SOUNDEX(`*string*`)}`                                     | Soundex code for *string*
`{fn SPACE(`*count*`)}`                                        | String consisting of *count* spaces
`{fn SUBSTRING(`*string*`,`*position*`,`*length*`)}`           | The *length*-character segment of *string* at *position*
`{fn UCASE(`*string*`)}`                                       | String formed by replacing all lowercase characters in *string* with their uppercase equivalents

System Function                         | Returns
--------------------------------------- | ---
`{fn DATABASE()}`                       | Current default database name
`{fn IFNULL(`*expression*`,`*value*`)}` | *expression* if *expression* is not NULL, or *value* if *expression* is NULL
`{fn USER()}`                           | Logon user name, which may differ from the current authorized user name after `SET QUERY_BAND` sets a proxy user

Time/Date Function                                                 | Returns
------------------------------------------------------------------ | ---
`{fn CURDATE()}`                                                   | Current date
`{fn CURRENT_DATE()}`                                              | Current date
`{fn CURRENT_TIME()}`                                              | Current time
`{fn CURRENT_TIMESTAMP()}`                                         | Current date and time
`{fn CURTIME()}`                                                   | Current time
`{fn DAYOFMONTH(`*date*`)}`                                        | Integer from 1 to 31 indicating the day of month in *date*
`{fn EXTRACT(YEAR FROM `*value*`)}`                                | The year component of the date and/or time *value*
`{fn EXTRACT(MONTH FROM `*value*`)}`                               | The month component of the date and/or time *value*
`{fn EXTRACT(DAY FROM `*value*`)}`                                 | The day component of the date and/or time *value*
`{fn EXTRACT(HOUR FROM `*value*`)}`                                | The hour component of the date and/or time *value*
`{fn EXTRACT(MINUTE FROM `*value*`)}`                              | The minute component of the date and/or time *value*
`{fn EXTRACT(SECOND FROM `*value*`)}`                              | The second component of the date and/or time *value*
`{fn HOUR(`*time*`)}`                                              | Integer from 0 to 23 indicating the hour of *time*
`{fn MINUTE(`*time*`)}`                                            | Integer from 0 to 59 indicating the minute of *time*
`{fn MONTH(`*date*`)}`                                             | Integer from 1 to 12 indicating the month of *date*
`{fn NOW()}`                                                       | Current date and time
`{fn SECOND(`*time*`)}`                                            | Integer from 0 to 59 indicating the second of *time*
`{fn TIMESTAMPADD(SQL_TSI_YEAR,`*count*`,`*timestamp*`)}`          | Timestamp formed by adding *count* years to *timestamp*
`{fn TIMESTAMPADD(SQL_TSI_MONTH,`*count*`,`*timestamp*`)}`         | Timestamp formed by adding *count* months to *timestamp*
`{fn TIMESTAMPADD(SQL_TSI_DAY,`*count*`,`*timestamp*`)}`           | Timestamp formed by adding *count* days to *timestamp*
`{fn TIMESTAMPADD(SQL_TSI_HOUR,`*count*`,`*timestamp*`)}`          | Timestamp formed by adding *count* hours to *timestamp*
`{fn TIMESTAMPADD(SQL_TSI_MINUTE,`*count*`,`*timestamp*`)}`        | Timestamp formed by adding *count* minutes to *timestamp*
`{fn TIMESTAMPADD(SQL_TSI_SECOND,`*count*`,`*timestamp*`)}`        | Timestamp formed by adding *count* seconds to *timestamp*
`{fn TIMESTAMPDIFF(SQL_TSI_YEAR,`*timestamp1*`,`*timestamp2*`)}`   | Number of years by which *timestamp2* exceeds *timestamp1*
`{fn TIMESTAMPDIFF(SQL_TSI_MONTH,`*timestamp1*`,`*timestamp2*`)}`  | Number of months by which *timestamp2* exceeds *timestamp1*
`{fn TIMESTAMPDIFF(SQL_TSI_DAY,`*timestamp1*`,`*timestamp2*`)}`    | Number of days by which *timestamp2* exceeds *timestamp1*
`{fn TIMESTAMPDIFF(SQL_TSI_HOUR,`*timestamp1*`,`*timestamp2*`)}`   | Number of hours by which *timestamp2* exceeds *timestamp1*
`{fn TIMESTAMPDIFF(SQL_TSI_MINUTE,`*timestamp1*`,`*timestamp2*`)}` | Number of minutes by which *timestamp2* exceeds *timestamp1*
`{fn TIMESTAMPDIFF(SQL_TSI_SECOND,`*timestamp1*`,`*timestamp2*`)}` | Number of seconds by which *timestamp2* exceeds *timestamp1*
`{fn YEAR(`*date*`)}`                                              | The year of *date*

#### Conversion Functions

Conversion function escape clauses are replaced by the corresponding SQL expression before the SQL request text is transmitted to the database.

Conversion Function                                             | Returns
--------------------------------------------------------------- | ---
`{fn CONVERT(`*value*`, SQL_BIGINT)}`                           | *value* converted to SQL `BIGINT`
`{fn CONVERT(`*value*`, SQL_BINARY(`*size*`))}`                 | *value* converted to SQL `BYTE(`*size*`)`
`{fn CONVERT(`*value*`, SQL_CHAR(`*size*`))}`                   | *value* converted to SQL `CHAR(`*size*`)`
`{fn CONVERT(`*value*`, SQL_DATE)}`                             | *value* converted to SQL `DATE`
`{fn CONVERT(`*value*`, SQL_DECIMAL(`*precision*`,`*scale*`))}` | *value* converted to SQL `DECIMAL(`*precision*`,`*scale*`)`
`{fn CONVERT(`*value*`, SQL_DOUBLE)}`                           | *value* converted to SQL `DOUBLE PRECISION`, a synonym for `FLOAT`
`{fn CONVERT(`*value*`, SQL_FLOAT)}`                            | *value* converted to SQL `FLOAT`
`{fn CONVERT(`*value*`, SQL_INTEGER)}`                          | *value* converted to SQL `INTEGER`
`{fn CONVERT(`*value*`, SQL_LONGVARBINARY)}`                    | *value* converted to SQL `VARBYTE(64000)`
`{fn CONVERT(`*value*`, SQL_LONGVARCHAR)}`                      | *value* converted to SQL `LONG VARCHAR`
`{fn CONVERT(`*value*`, SQL_NUMERIC)}`                          | *value* converted to SQL `NUMBER`
`{fn CONVERT(`*value*`, SQL_SMALLINT)}`                         | *value* converted to SQL `SMALLINT`
`{fn CONVERT(`*value*`, SQL_TIME(`*scale*`))}`                  | *value* converted to SQL `TIME(`*scale*`)`
`{fn CONVERT(`*value*`, SQL_TIMESTAMP(`*scale*`))}`             | *value* converted to SQL `TIMESTAMP(`*scale*`)`
`{fn CONVERT(`*value*`, SQL_TINYINT)}`                          | *value* converted to SQL `BYTEINT`
`{fn CONVERT(`*value*`, SQL_VARBINARY(`*size*`))}`              | *value* converted to SQL `VARBYTE(`*size*`)`
`{fn CONVERT(`*value*`, SQL_VARCHAR(`*size*`))}`                | *value* converted to SQL `VARCHAR(`*size*`)`

#### LIKE Predicate Escape Character

Within a `LIKE` predicate's *pattern* argument, the characters `%` (percent) and `_` (underscore) serve as wildcards.
To interpret a particular wildcard character literally in a `LIKE` predicate's *pattern* argument, the wildcard character must be preceded by an escape character, and the escape character must be indicated in the `LIKE` predicate's `ESCAPE` clause.

`LIKE` predicate escape character escape clauses are replaced by the corresponding SQL clause before the SQL request text is transmitted to the database.

`{escape '`*EscapeCharacter*`'}`

The escape clause must be specified immediately after the `LIKE` predicate that it applies to.

#### Outer Joins

Outer join escape clauses are replaced by the corresponding SQL clause before the SQL request text is transmitted to the database.

`{oj `*TableName* *OptionalCorrelationName* `LEFT OUTER JOIN `*TableName* *OptionalCorrelationName* `ON `*JoinCondition*`}`

`{oj `*TableName* *OptionalCorrelationName* `RIGHT OUTER JOIN `*TableName* *OptionalCorrelationName* `ON `*JoinCondition*`}`

`{oj `*TableName* *OptionalCorrelationName* `FULL OUTER JOIN `*TableName* *OptionalCorrelationName* `ON `*JoinCondition*`}`

#### Stored Procedure Calls

Stored procedure call escape clauses are replaced by the corresponding SQL clause before the SQL request text is transmitted to the database.

`{call `*ProcedureName*`}`

`{call `*ProcedureName*`(`*CommaSeparatedParameterValues...*`)}`

#### Native SQL

When a SQL request contains the native SQL escape clause, all escape clauses are replaced in the SQL request text, and the modified SQL request text is returned to the application as a result set containing a single row and a single VARCHAR column. The SQL request text is not transmitted to the database, and the SQL request is not executed. The native SQL escape clause mimics the functionality of the JDBC API `Connection.nativeSQL` method.

`{fn teradata_nativesql}`

#### Connection Functions

The following table lists connection function escape clauses that are intended for use with the native SQL escape clause `{fn teradata_nativesql}`.

These functions provide information about the connection, or control the behavior of the connection.
Functions that provide information return locally-cached information and avoid a round-trip to the database.
Connection function escape clauses are replaced by the returned information before the SQL request text is transmitted to the database.

Connection Function                           | Returns
--------------------------------------------- | ---
`{fn teradata_amp_count}`                     | Number of AMPs of the database system
`{fn teradata_database_version}`              | Version number of the database
`{fn teradata_driver_version}`                | Version number of the driver
`{fn teradata_get_errors}`                    | Errors from the most recent batch operation
`{fn teradata_get_warnings}`                  | Warnings from an operation that completed with warnings
`{fn teradata_getloglevel}`                   | Current log level
`{fn teradata_go_runtime}`                    | Go runtime version for the Teradata GoSQL Driver
`{fn teradata_logon_sequence_number}`         | Session's Logon Sequence Number, if available
`{fn teradata_program_name}`                  | Executable program name
`{fn teradata_provide(config_response)}`      | Config Response parcel contents in JSON format
`{fn teradata_provide(connection_id)}`        | Connection's unique identifier within the process
`{fn teradata_provide(default_connection)}`   | `false` indicating this is not a stored procedure default connection
`{fn teradata_provide(gateway_config)}`       | Gateway Config parcel contents in JSON format
`{fn teradata_provide(governed)}`             | `true` or `false` indicating the `govern` connection parameter setting
`{fn teradata_provide(host_id)}`              | Session's host ID
`{fn teradata_provide(java_charset_name)}`    | `UTF8`
`{fn teradata_provide(lob_support)}`          | `true` or `false` indicating this connection's LOB support
`{fn teradata_provide(local_address)}`        | Local address of the connection's TCP socket
`{fn teradata_provide(local_port)}`           | Local port of the connection's TCP socket
`{fn teradata_provide(original_hostname)}`    | Original specified database hostname
`{fn teradata_provide(redrive_active)}`       | `true` or `false` indicating whether this connection has Redrive active
`{fn teradata_provide(remote_address)}`       | Hostname (if available) and IP address of the connected database node
`{fn teradata_provide(remote_port)}`          | TCP port number of the database
`{fn teradata_provide(rnp_active)}`           | `true` or `false` indicating whether this connection has Recoverable Network Protocol active
`{fn teradata_provide(session_charset_code)}` | Session character set code `191`
`{fn teradata_provide(session_charset_name)}` | Session character set name `UTF8`
`{fn teradata_provide(sip_support)}`          | `true` or `false` indicating this connection's StatementInfo parcel support
`{fn teradata_provide(transaction_mode)}`     | Session's transaction mode, `ANSI` or `TERA`
`{fn teradata_provide(uses_check_workload)}`  | `true` or `false` indicating whether this connection uses `CHECK WORKLOAD`
`{fn teradata_session_number}`                | Session number

#### Request-Scope Functions

The following table lists request-scope function escape clauses that are intended for use with the Cursor `.execute` or `.executemany` methods.

These functions control the behavior of the corresponding Cursor, and are limited in scope to the particular SQL request in which they are specified.
Request-scope function escape clauses are removed before the SQL request text is transmitted to the database.

Request-Scope Function                                 | Effect
------------------------------------------------------ | ---
`{fn teradata_agkr(`*Option*`)}`                       | Executes the SQL request with Auto-Generated Key Retrieval (AGKR) *Option* `C` (identity column value) or `R` (entire row)
`{fn teradata_clobtranslate(`*Option*`)}`              | Executes the SQL request with CLOB translate *Option* `U` (unlocked) or the default `L` (locked)
`{fn teradata_error_query_count(`*Number*`)}`          | Specifies how many times the driver will attempt to query FastLoad Error Table 1 after a FastLoad operation. Takes precedence over the `error_query_count` connection parameter.
`{fn teradata_error_query_interval(`*Milliseconds*`)}` | Specifies how many milliseconds the driver will wait between attempts to query FastLoad Error Table 1. Takes precedence over the `error_query_interval` connection parameter.
`{fn teradata_error_table_1_suffix(`*Suffix*`)}`       | Specifies the suffix to append to the name of FastLoad error table 1. Takes precedence over the `error_table_1_suffix` connection parameter.
`{fn teradata_error_table_2_suffix(`*Suffix*`)}`       | Specifies the suffix to append to the name of FastLoad error table 2. Takes precedence over the `error_table_2_suffix` connection parameter.
`{fn teradata_error_table_database(`*DbName*`)}`       | Specifies the parent database name for FastLoad error tables 1 and 2. Takes precedence over the `error_table_database` connection parameter.
`{fn teradata_failfast}`                               | Reject ("fail fast") this SQL request rather than delay by a workload management rule or throttle
`{fn teradata_fake_result_sets}`                       | A fake result set containing statement metadata precedes each real result set. Takes precedence over the `fake_result_sets` connection parameter.
`{fn teradata_fake_result_sets_off}`                   | Turns off fake result sets for this SQL request. Takes precedence over the `fake_result_sets` connection parameter.
`{fn teradata_field_quote(`*String*`)}`                | Specifies a single-character string used to quote fields in a CSV file. Takes precedence over the `field_quote` connection parameter.
`{fn teradata_field_sep(`*String*`)}`                  | Specifies a single-character string used to separate fields in a CSV file. Takes precedence over the `field_sep` connection parameter.
`{fn teradata_govern_off}`                             | Teradata workload management rules will reject rather than delay a FastLoad or FastExport. Takes precedence over the `govern` connection parameter.
`{fn teradata_govern_on}`                              | Teradata workload management rules may delay a FastLoad or FastExport. Takes precedence over the `govern` connection parameter.
`{fn teradata_lobselect(`*Option*`)}`                  | Executes the SQL request with LOB select *Option* `S` (spool-scoped LOB locators), `T` (transaction-scoped LOB locators), or the default `I` (inline materialized LOB values)
`{fn teradata_manage_error_tables_off}`                | Turns off FastLoad error table management for this request. Takes precedence over the `manage_error_tables` connection parameter.
`{fn teradata_manage_error_tables_on}`                 | Turns on FastLoad error table management for this request. Takes precedence over the `manage_error_tables` connection parameter.
`{fn teradata_parameter(`*Index*`,`*DataType*`)`       | Transmits parameter *Index* bind values as *DataType*
`{fn teradata_provide(request_scope_column_name_off)}` | Provides the default column name behavior for this SQL request. Takes precedence over the `column_name` connection parameter.
`{fn teradata_provide(request_scope_lob_support_off)}` | Turns off LOB support for this SQL request. Takes precedence over the `lob_support` connection parameter.
`{fn teradata_provide(request_scope_refresh_rsmd)}`    | Executes the SQL request with the default request processing option `B` (both)
`{fn teradata_provide(request_scope_sip_support_off)}` | Turns off StatementInfo parcel support for this SQL request. Takes precedence over the `sip_support` connection parameter.
`{fn teradata_read_csv(`*CSVFileName*`)}`              | Executes a batch insert using the bind parameter values read from the specified CSV file for either a SQL batch insert or a FastLoad
`{fn teradata_request_timeout(`*Seconds*`)}`           | Specifies the timeout for executing the SQL request. Zero means no timeout. Takes precedence over the `request_timeout` connection parameter.
`{fn teradata_require_fastexport}`                     | Specifies that FastExport is required for the SQL request
`{fn teradata_require_fastload}`                       | Specifies that FastLoad is required for the SQL request
`{fn teradata_rpo(`*RequestProcessingOption*`)}`       | Executes the SQL request with *RequestProcessingOption* `S` (prepare), `E` (execute), or the default `B` (both)
`{fn teradata_sessions(`*Number*`)}`                   | Specifies the *Number* of data transfer connections for FastLoad or FastExport. Takes precedence over the `sessions` connection parameter.
`{fn teradata_try_fastexport}`                         | Tries to use FastExport for the SQL request
`{fn teradata_try_fastload}`                           | Tries to use FastLoad for the SQL request
`{fn teradata_untrusted}`                              | Marks the SQL request as untrusted; not implemented yet
`{fn teradata_values_off}`                             | Turns off `teradata_values` for this SQL request. Takes precedence over the `teradata_values` connection parameter. Refer to the [Data Types](#DataTypes) table for details.
`{fn teradata_values_on}`                              | Turns on `teradata_values` for this SQL request. Takes precedence over the `teradata_values` connection parameter. Refer to the [Data Types](#DataTypes) table for details.
`{fn teradata_write_csv(`*CSVFileName*`)}`             | Exports one or more result sets from a SQL request or a FastExport to the specified CSV file or files

The `teradata_field_sep` and `teradata_field_quote` escape functions have a single-character string argument. The string argument must follow SQL literal syntax. The string argument may be enclosed in single-quote (`'`) characters or double-quote (`"`) characters.

To represent a single-quote character in a string enclosed in single-quote characters, you must repeat the single-quote character.

    {fn teradata_field_quote('''')}

To represent a double-quote character in a string enclosed in double-quote characters, you must repeat the double-quote character.

    {fn teradata_field_quote("""")}

<a id="FastLoad"></a>

### FastLoad

The driver offers FastLoad, which opens multiple database connections to transfer data in parallel.

Please be aware that this is an early release of the FastLoad feature. Think of it as a beta or preview version. It works, but does not yet offer all the features that JDBC FastLoad offers. FastLoad is still under active development, and we will continue to enhance it in subsequent builds.

FastLoad has limitations and cannot be used in all cases as a substitute for SQL batch insert:
* FastLoad can only load into an empty permanent table.
* FastLoad cannot load additional rows into a table that already contains rows.
* FastLoad cannot load into a volatile table or global temporary table.
* FastLoad cannot load duplicate rows into a `MULTISET` table with a primary index.
* Do not use FastLoad to load only a few rows, because FastLoad opens extra connections to the database, which is time consuming.
* Only use FastLoad to load many rows (at least 100,000 rows) so that the row-loading performance gain exceeds the overhead of opening additional connections.
* FastLoad does not support all database data types. For example, `BLOB` and `CLOB` are not supported.
* FastLoad requires StatementInfo parcel support to be enabled.
* FastLoad locks the destination table.
* If Online Archive encounters a table being loaded with FastLoad, online archiving of that table will be bypassed.

Your application can bind a single row of data for FastLoad, but that is not recommended because the overhead of opening additional connections causes FastLoad to be slower than a regular SQL `INSERT` for a single row.

How to use FastLoad:
* Auto-commit should be turned off before beginning a FastLoad.
* FastLoad is intended for binding many rows at a time. Each batch of rows must be able to fit into memory.
* When auto-commit is turned off, your application can insert multiple batches in a loop for the same FastLoad.
* Each column's data type must be consistent across every row in every batch over the entire FastLoad.
* The column values of the first row of the first batch dictate what the column data types must be in all subsequent rows and all subsequent batches of the FastLoad.

FastLoad opens multiple data transfer connections to the database. FastLoad evenly distributes each batch of rows across the available data transfer connections, and uses overlapped I/O to send and receive messages in parallel.

To use FastLoad, your application must prepend one of the following escape functions to the `INSERT` statement:
* `{fn teradata_try_fastload}` tries to use FastLoad for the `INSERT` statement, and automatically executes the `INSERT` as a regular SQL statement when the `INSERT` is not compatible with FastLoad.
* `{fn teradata_require_fastload}` requires FastLoad for the `INSERT` statement, and fails with an error when the `INSERT` is not compatible with FastLoad.

Your application can prepend other optional escape functions to the `INSERT` statement:
* `{fn teradata_sessions(`n`)}` specifies the number of data transfer connections to be opened, and is capped at the number of AMPs. The default is the smaller of 8 or the number of AMPs. We recommend avoiding this function to let the driver ask the database how many data transfer connections should be used.
* `{fn teradata_error_table_1_suffix(`suffix`)}` specifies the suffix to append to the name of FastLoad error table 1. The default suffix is `_ERR_1`.
* `{fn teradata_error_table_2_suffix(`suffix`)}` specifies the suffix to append to the name of FastLoad error table 2. The default suffix is `_ERR_2`.
* `{fn teradata_error_table_database(`dbname`)}` specifies the parent database name for FastLoad error tables 1 and 2. By default, the FastLoad error tables reside in the same database as the destination table.
* `{fn teradata_govern_on}` or `{fn teradata_govern_off}` specifies whether Teradata workload management rules may delay or reject the FastLoad. Takes precedence over the `govern` connection parameter.

After beginning a FastLoad, your application can obtain the Logon Sequence Number (LSN) assigned to the FastLoad by prepending the following escape functions to the `INSERT` statement:
* `{fn teradata_nativesql}{fn teradata_logon_sequence_number}` returns the string form of an integer representing the Logon Sequence Number (LSN) for the FastLoad. Returns an empty string if the request is not a FastLoad.

FastLoad does not stop for data errors such as constraint violations or unique primary index violations. After inserting each batch of rows, your application must obtain warning and error information by prepending the following escape functions to the `INSERT` statement:
* `{fn teradata_nativesql}{fn teradata_get_warnings}` returns in one string all warnings generated by FastLoad for the request.
* `{fn teradata_nativesql}{fn teradata_get_errors}` returns in one string all data errors observed by FastLoad for the most recent batch. The data errors are obtained from FastLoad error table 1, for problems such as constraint violations, data type conversion errors, and unavailable AMP conditions.

Your application ends FastLoad by committing or rolling back the current transaction. After commit or rollback, your application must obtain warning and error information by prepending the following escape functions to the `INSERT` statement:
* `{fn teradata_nativesql}{fn teradata_get_warnings}` returns in one string all warnings generated by FastLoad for the commit or rollback. The warnings are obtained from FastLoad error table 2, for problems such as duplicate rows.
* `{fn teradata_nativesql}{fn teradata_get_errors}` returns in one string all data errors observed by FastLoad for the commit or rollback. The data errors are obtained from FastLoad error table 2, for problems such as unique primary index violations.

Warning and error information remains available until the next batch is inserted or until the commit or rollback. Each batch execution clears the prior warnings and errors. Each commit or rollback clears the prior warnings and errors.

<a id="FastExport"></a>

### FastExport

The driver offers FastExport, which opens multiple database connections to transfer data in parallel.

Please be aware that this is an early release of the FastExport feature. Think of it as a beta or preview version. It works, but does not yet offer all the features that JDBC FastExport offers. FastExport is still under active development, and we will continue to enhance it in subsequent builds.

FastExport has limitations and cannot be used in all cases as a substitute for SQL queries:
* FastExport cannot query a volatile table or global temporary table.
* FastExport supports single-statement SQL `SELECT`, and supports multi-statement requests composed of multiple SQL `SELECT` statements only.
* FastExport supports question-mark parameter markers in `WHERE` clause conditions. However, the database does not permit the equal `=` operator for primary or unique secondary indexes, and will return database error 3695 "A Single AMP Select statement has been issued in FastExport".
* Do not use FastExport to fetch only a few rows, because FastExport opens extra connections to the database, which is time consuming.
* Only use FastExport to fetch many rows (at least 100,000 rows) so that the row-fetching performance gain exceeds the overhead of opening additional connections.
* FastExport does not support all database data types. For example, `BLOB` and `CLOB` are not supported.
* For best efficiency, do not use `GROUP BY` and `ORDER BY` clauses with FastExport.
* FastExport's result set ordering behavior may differ from a regular SQL query. In particular, a query containing an ordered analytic function may not produce an ordered result set. Use an `ORDER BY` clause to guarantee result set order.

FastExport opens multiple data transfer connections to the database. FastExport uses overlapped I/O to send and receive messages in parallel.

To use FastExport, your application must prepend one of the following escape functions to the query:
* `{fn teradata_try_fastexport}` tries to use FastExport for the query, and automatically executes the query as a regular SQL query when the query is not compatible with FastExport.
* `{fn teradata_require_fastexport}` requires FastExport for the query, and fails with an error when the query is not compatible with FastExport.

Your application can prepend other optional escape functions to the query:
* `{fn teradata_sessions(`n`)}` specifies the number of data transfer connections to be opened, and is capped at the number of AMPs. The default is the smaller of 8 or the number of AMPs. We recommend avoiding this function to let the driver ask the database how many data transfer connections should be used.
* `{fn teradata_govern_on}` or `{fn teradata_govern_off}` specifies whether Teradata workload management rules may delay or reject the FastExport. Takes precedence over the `govern` connection parameter.

After beginning a FastExport, your application can obtain the Logon Sequence Number (LSN) assigned to the FastExport by prepending the following escape functions to the query:
* `{fn teradata_nativesql}{fn teradata_logon_sequence_number}` returns the string form of an integer representing the Logon Sequence Number (LSN) for the FastExport. Returns an empty string if the request is not a FastExport.

<a id="CSVBatchInserts"></a>

### CSV Batch Inserts

The driver can read batch insert bind values from a CSV (comma separated values) file. This feature can be used with SQL batch inserts and with FastLoad.

To specify batch insert bind values in a CSV file, the application prepends the escape function `{fn teradata_read_csv(`*CSVFileName*`)}` to the `INSERT` statement.

The application can specify batch insert bind values in a CSV file, or specify bind parameter values, but not both together. The driver returns an error if both are specified together.

Considerations when using a CSV file:
* Each record is on a separate line of the CSV file. Records are delimited by line breaks (CRLF). The last record in the file may or may not have an ending line break.
* The first line of the CSV file is a header line. The header line lists the column names separated by the field separator (e.g. `col1,col2,col3`).
* The field separator defaults to the comma character (`,`). You can specify a different field separator character with the `field_sep` connection parameter or with the `teradata_field_sep` escape function. The specified field separator character must match the actual separator character used in the CSV file.
* Each field can optionally be enclosed by the field quote character, which defaults to the double-quote character (e.g. `"abc",123,efg`). You can specify a different field quote character with the `field_quote` connection parameter or with the `teradata_field_quote` escape function. The field quote character must match the actual field quote character used in the CSV file.
* The field separator and field quote characters cannot be set to the same value. The field separator and field quote characters must be legal UTF-8 characters and cannot be line feed (`\n`) or carriage return (`\r`).
* Field quote characters are only permitted in fields enclosed by field quote characters. Field quote characters must not appear inside unquoted fields (e.g. not allowed `ab"cd"ef,1,abc`).
* To include a field quote character in a quoted field, the field quote character must be repeated (e.g. `"abc""efg""dh",123,xyz`).
* Line breaks, field quote characters, and field separators may be included in a quoted field (e.g. `"abc,efg\ndh",123,xyz`).
* Specify a `NULL` value in the CSV file with an empty value between commas (e.g. `1,,456`).
* A zero-length quoted string specifies a zero-length non-`NULL` string, not a `NULL` value (e.g. `1,"",456`).
* Not all data types are supported. For example, `BLOB`, `BYTE`, and `VARBYTE` are not supported.
* A field length greater than 64KB is transmitted to the database as a `DEFERRED CLOB` for a SQL batch insert. A field length greater than 64KB is not supported with FastLoad.

Limitations when using CSV batch inserts:
* Bound parameter values cannot be specified in the execute method when using the escape function `{fn teradata_read_csv(`*CSVFileName*`)}`.
* The CSV file must contain at least one valid record in addition to the header line containing the column names.
* For FastLoad, the insert operation will fail if the CSV file is improperly formatted and a parser error occurs.
* For SQL batch insert, some records may be inserted before a parsing error occurs. A list of the parser errors will be returned. Each parser error will include the line number (starting at line 1) and the column number (starting at zero).
* Using a CSV file with FastLoad has the same limitations and is used the same way as described in the [FastLoad](#FastLoad) section.

<a id="CSVExportResults"></a>

### CSV Export Results

The driver can export query results to CSV files. This feature can be used with SQL query results, with calls to stored procedures, and with FastExport.

To export a result set to a CSV file, the application prepends the escape function `{fn teradata_write_csv(`*CSVFileName*`)}` to the SQL request text.

If the query returns multiple result sets, each result set will be written to a separate file. The file name is varied by inserting the string "_N" between the specified file name and file type extension (e.g. `fileName.csv`, `fileName_1.csv`, `fileName_2.csv`). If no file type extension is specified, then the suffix "_N" is appended to the end of the file name (e.g. `fileName`, `fileName_1`, `fileName_2`).

A stored procedure call that produces multiple dynamic result sets behaves like other SQL requests that return multiple result sets. The stored procedures's output parameter values are exported as the first CSV file.

Example of a SQL request that returns multiple results:

`{fn teradata_write_csv(myFile.csv)}select 'abc' ; select 123`

CSV File Name | Content
------------- | ---
myFile.csv    | First result set
myFile_1.csv  | Second result set

To obtain the metadata for each result set, use the escape function `{fn teradata_fake_result_sets}`. A fake result set containing the metadata will be written to a file preceding each real result set.

Example of a query that returns multiple result sets with metadata:

`{fn teradata_fake_result_sets}{fn teradata_write_csv(myFile.csv)}select 'abc' ; select 123`

CSV File Name | Content
------------- | ---
myFile.csv    | Fake result set containing the metadata for the first result set
myFile_1.csv  | First result set
myFile_2.csv  | Fake result set containing the metadata for the second result set
myFile_3.csv  | Second result set

Exported CSV files have the following characteristics:
* Each record is on a separate line of the CSV file. Records are delimited by line breaks (CRLF).
* Column values are separated by the field separator character, which defaults to the comma character (`,`). You can specify a different field separator character with the `field_sep` connection parameter or with the `teradata_field_sep` escape function.
* The first line of the CSV file is a header line. The header line lists the column names separated by the field separator (e.g. `col1,col2,col3`).
* When necessary, column values are enclosed by the field quote character, which defaults to the double-quote character (`"`). You can specify a different field quote character with the `field_quote` connection parameter or with the `teradata_field_quote` escape function.
* The field separator and field quote characters cannot be set to the same value. The field separator and field quote characters must be legal UTF-8 characters and cannot be line feed (`\n`) or carriage return (`\r`).
* If a column value contains line breaks, field quote characters, and/or field separators in a field, the value is quoted with the field quote character.
* If a column value contains a field quote character, the value is quoted and the field quote character is repeated. For example, column value `abc"def` is exported as `"abc""def"`.
* A `NULL` value is exported to the CSV file as an empty value between field separators (e.g. `123,,456`).
* A non-`NULL` zero-length character value is exported as a zero-length quoted string (e.g. `123,"",456`).

Limitations when exporting to CSV files:
* When the application chooses to export results to a CSV file, the results are not available for the application to fetch in memory.
* A warning is returned if the application specifies an export CSV file for a SQL statement that does not produce a result set.
* Exporting a CSV file with FastExport has the same limitations and is used the same way as described in the [FastExport](#FastExport) section.
* Not all data types are supported. For example, `BLOB`, `BYTE`, and `VARBYTE` are not supported and if one of these column types are present in the result set, an error will be returned.
* `CLOB`, `XML`, `JSON`, and `DATASET STORAGE FORMAT CSV` data types are supported for SQL query results and are exported as string values, but these data types are not supported by FastExport.

<a id="ChangeLog"></a>

### Change Log

`20.0.13` - June 24, 2024
* GOSQL-198 oidc_sslmode connection parameter
* GOSQL-199 sslcrc=ALLOW and PREFER soft fail CRC for VERIFY-CA and VERIFY-FULL
* GOSQL-200 sslcrc=REQUIRE requires CRC for VERIFY-CA and VERIFY-FULL

`20.0.12` - April 30, 2024
* GOSQL-31 Monitor partition

`20.0.11` - April 25, 2024
* GOSQL-193 Device Code Flow and Client Credentials Flow

`20.0.10` - April 10, 2024
* GOSQL-185 Use FIPS-140 Compliant Modules
* Build DLL and shared library with Go 1.20.14
* Build DLL and shared library with Microsoft Go for Windows, Linux Intel, Linux ARM
* Build shared library with golang-fips for macOS Intel, macOS ARM

`20.0.8` - March 18, 2024
* GOSQL-121 Linux ARM support
* GOSQL-184 remove DES and DESede
* NJSD-13 remove DES and DESede

`20.0.7` - February 1, 2024
* GOSQL-189 improved error messages for missing or invalid logmech value
* GOSQL-190 Go TeraGSS accommodate DH/CI bypass flag in JWT token header

`20.0.6` - January 19, 2024
* GOSQL-183 TLS certificate verification for Identity Provider endpoints

`20.0.5` - January 17, 2024
* GOSQL-151 proxy server support

`20.0.4` - January 9, 2024
* Build DLL and shared library with Go 1.20.12

`20.0.3` - December 8, 2023
* Improved exception message for query timeout

`20.0.2` - November 16, 2023
* Build DLL and shared library with Go 1.20.11

`20.0.1` - November 14, 2023
* Correct links for sample programs

`20.0.0` - November 8, 2023
* Initial release
