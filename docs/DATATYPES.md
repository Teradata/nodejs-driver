## Data Types

The table below lists the Teradata Database data types supported by the Teradata SQL Driver for Node.js, and indicates the corresponding Javascript data type returned in result set rows.

Teradata Database data type        | Result set Javascript data type   | With `teradata_values` as `"false"`
---------------------------------- | --------------------------------- | ---
`BIGINT`                           | `string`                          |
`BLOB`                             | `Uint8Array`                      |
`BYTE`                             | `Uint8Array`                      |
`BYTEINT`                          | `number`                          |
`CHAR`                             | `string`                          |
`CLOB`                             | `string`                          |
`DATE`                             | `date`                            | `string`
`DECIMAL`                          | `number`                          | `string`
`FLOAT`                            | `number`                          |
`INTEGER`                          | `number`                          |
`INTERVAL YEAR`                    | `string`                          |
`INTERVAL YEAR TO MONTH`           | `string`                          |
`INTERVAL MONTH`                   | `string`                          |
`INTERVAL DAY`                     | `string`                          |
`INTERVAL DAY TO HOUR`             | `string`                          |
`INTERVAL DAY TO MINUTE`           | `string`                          |
`INTERVAL DAY TO SECOND`           | `string`                          |
`INTERVAL HOUR`                    | `string`                          |
`INTERVAL HOUR TO MINUTE`          | `string`                          |
`INTERVAL HOUR TO SECOND`          | `string`                          |
`INTERVAL MINUTE`                  | `string`                          |
`INTERVAL MINUTE TO SECOND`        | `string`                          |
`INTERVAL SECOND`                  | `string`                          |
`NUMBER`                           | `number`                          | `string`
`PERIOD(DATE)`                     | `string`                          |
`PERIOD(TIME)`                     | `string`                          |
`PERIOD(TIME WITH TIME ZONE)`      | `string`                          |
`PERIOD(TIMESTAMP)`                | `string`                          |
`PERIOD(TIMESTAMP WITH TIME ZONE)` | `string`                          |
`SMALLINT`                         | `number`                          |
`TIME`                             | `string`                          |
`TIME WITH TIME ZONE`              | `string`                          |
`TIMESTAMP`                        | `string`                          |
`TIMESTAMP WITH TIME ZONE`         | `string`                          |
`VARBYTE`                          | `Uint8Array`                      |
`VARCHAR`                          | `string`                          |

The table below lists the parameterized SQL bind-value Javascript data types supported by the Teradata SQL Driver for Node.js, and indicates the corresponding Teradata Database data type transmitted to the server.

Bind-value Javascript data type   | Teradata Database data type
--------------------------------- | ---
`boolean`                         |  Not supported
`date`                            | `DATE`
`number`                          | `FLOAT`
`string`                          | `VARCHAR`
`symbol`                          |  Not supported
`Uint8Array`                      | `VARBYTE`

Transforms are used for SQL `ARRAY` data values, and they can be transferred to and from the database as `VARCHAR` values.

Transforms are used for structured UDT data values, and they can be transferred to and from the database as `VARCHAR` values.

<a name="NullValues"></a>

## Null Values

SQL `NULL` values received from the Teradata Database are returned in result set rows as Javascript `null` values.

A Javascript `null` value bound to a question-mark parameter marker is transmitted to the Teradata Database as a `NULL` `VARCHAR` value.

## Undefined Values

A Javascript `undefined` value bound to a question-mark parameter marker is transmitted to the Teradata Database as a `NULL` `VARCHAR` value.
