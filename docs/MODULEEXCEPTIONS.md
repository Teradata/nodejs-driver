## Module Exceptions


`Error` is the base class for other exceptions.
* `InterfaceError` is raised for errors related to the driver. Not supported yet.
* `DatabaseError` is raised for errors related to the database.
  * `DataError` is raised for data value errors such as division by zero. Not supported yet.
  * `IntegrityError` is raised for referential integrity violations. Not supported yet.
  * `OperationalError` is raised for errors related to the database's operation.
  * `ProgrammingError` is raised for SQL object existence errors and SQL syntax errors. Not supported yet.