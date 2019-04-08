## Connection Parameters

The following table lists the connection parameters currently offered by the Teradata Node.js DB-API Driver.

Our goal is consistency for the connection parameters offered by the Teradata SQL Driver for Python and the Teradata JDBC Driver, with respect to connection parameter names and functionality. For comparison, Teradata JDBC Driver connection parameters are [documented here](http://developer.teradata.com/doc/connectivity/jdbc/reference/current/jdbcug_chapter_2.html#BGBHDDGB).

Parameter          | Default     | Type           | Description
------------------ | ----------- | -------------- | ---
`account`          |             | string         | Specifies the Teradata Database account. Equivalent to the Teradata JDBC Driver `ACCOUNT` connection parameter.
`column_name`      | `"false"`   | quoted boolean | Controls the behavior of cursor `.description` sequence `name` items. Equivalent to the Teradata JDBC Driver `COLUMN_NAME` connection parameter. False specifies that a cursor `.description` sequence `name` item provides the AS-clause name if available, or the column name if available, or the column title. True specifies that a cursor `.description` sequence `name` item provides the column name if available, but has no effect when StatementInfo parcel support is unavailable.
`dbs_port`         | `"1025"`    | quoted integer | Specifies Teradata Database port number. Equivalent to the Teradata JDBC Driver `DBS_PORT` connection parameter.
`encryptdata`      | `"false"`   | quoted boolean | Controls encryption of data exchanged between the Teradata Database and the Teradata Node.js DB-API Driver. Equivalent to the Teradata JDBC Driver `ENCRYPTDATA` connection parameter.
`fake_result_sets` | `"false"`   | quoted boolean | Controls whether a fake result set containing statement metadata precedes each real result set.
`host`             |             | string         | Specifies the Teradata Database hostname. Note that COP Discovery is not implemented yet.
`lob_support`      | `"true"`    | quoted boolean | Controls LOB support. Equivalent to the Teradata JDBC Driver `LOB_SUPPORT` connection parameter.
`log`              | `"0"`       | quoted integer | Controls debug logging. Somewhat equivalent to the Teradata JDBC Driver `LOG` connection parameter. This parameter's behavior is subject to change in the future. This parameter's value is currently defined as an integer in which the 1-bit governs function and method tracing, the 2-bit governs debug logging, and the 4-bit governs transmit and receive message hex dumps.
`logdata`          |             | string         | Specifies extra data for the chosen logon authentication method. Equivalent to the Teradata JDBC Driver `LOGDATA` connection parameter.
`logmech`          | `"TD2"`     | string         | Specifies the logon authentication method. Equivalent to the Teradata JDBC Driver `LOGMECH` connection parameter. Possible values are `TD2` (the default), `LDAP`, `KRB5` for Kerberos, or `TDNEGO`. Note that JWT authentication is not supported yet.
`max_message_body` | `"2097000"` | quoted integer | Not fully implemented yet and intended for future usage. Equivalent to the Teradata JDBC Driver `MAX_MESSAGE_BODY` connection parameter.
`partition`        | `"DBC/SQL"` | string         | Specifies the Teradata Database Partition. Equivalent to the Teradata JDBC Driver `PARTITION` connection parameter.
`password`         |             | string         | Specifies the Teradata Database password. Equivalent to the Teradata JDBC Driver `PASSWORD` connection parameter.
`sip_support`      | `"true"`    | quoted boolean | Controls whether StatementInfo parcel is used. Equivalent to the Teradata JDBC Driver `SIP_SUPPORT` connection parameter.
`teradata_values`  | `"true"`    | quoted boolean | Controls whether `str` or a more specific Python data type is used for certain Result set column value types. Refer to the table below for details.
`tmode`            | `"DEFAULT"` | string         | Specifies the transaction mode. Equivalent to the Teradata JDBC Driver TMODE connection parameter. Possible values are `DEFAULT` (the default), `ANSI`, or `TERA`.
`user`             |             | string         | Specifies the Teradata Database username. Equivalent to the Teradata JDBC Driver `USER` connection parameter.
