import 'mocha';
import { expect } from 'chai';
import { TeradataConnection, ITDConnParams } from '../../src/teradata-connection';
import { TeradataCursor } from '../../src/teradata-cursor';
import { TeradataLogging } from '../../src/teradata-logging';
import { connParams } from '../configurations';
import { OperationalError } from '../../src/teradata-exceptions';

const logger: TeradataLogging = new TeradataLogging();

describe('\n\n\nTest AutoCommit', () => {
  const tests: any[] = [{mode: 'ANSI'},
                        {mode: 'TERA'} ];
  tests.forEach((test: any) => {
    let teradataConnection1: TeradataConnection;
    let cursor1: TeradataCursor;
    const connParamsCopy: ITDConnParams = Object.assign({}, connParams);
    connParamsCopy.tmode = test.mode;
    const bInAnsiMode: boolean = ('ANSI' === test.mode);
    let bAutoCommit: boolean = true;

    before((done: any) => {
      try {
        teradataConnection1 = new TeradataConnection();
        teradataConnection1.connect(connParamsCopy);
        cursor1 = teradataConnection1.cursor();
      } catch (error) {
        logger.errorLogMessage(error.message); // unexpected error
      }
      done();
    });

    after((done: any) => {
      try {
        cursor1.close();
        teradataConnection1.close();
      } catch (error) {
        logger.errorLogMessage(error.message); // unexpected error
      }
      done();
    });

    it('Test \'' + test.mode + '\' mode: validate AutoCommit', (done: any) => {
      validateAutoCommit(cursor1, true);
      if (!bInAnsiMode) {
        cursor1.execute('{fn teradata_nativesql}{fn teradata_autocommit_off}'); // turn AutoCommit off
        validateAutoCommit(cursor1, false);
        bAutoCommit = false;
      }
      done();
    });

    it('Test \'' + test.mode + '\' mode: test UDF AutoCommit', (done: any) => {
      let gotExpectedError: boolean = false;
      try {
        // This will always fail so no need to drop it
        cursor1.execute('create function myudfbad(integer) returns integer ' +
            'LANGUAGE C NO SQL PARAMETER STYLE SQL EXTERNAL NAME \'CS!udfbad!test/sprocs/getlastname_err.c!F!udfbad\'');
      } catch (error) {
        if ((error instanceof OperationalError) &&
            (error.message.indexOf('Errors encountered in compiling UDF/XSP/UDM/UDT/JAR') > 0)) {
              gotExpectedError = true;
              // it is necessary to commit since the error was originally returned as a warning
              if (!bAutoCommit) {
                cursor1.execute('{fn teradata_commit}');
              }
        } else {
          logger.errorLogMessage(error.message); // unexpected error
        }
      }
      expect(gotExpectedError).equal(true);
      done();
    });

    it('Test \'' + test.mode + '\' mode: test Create Procedure AutoCommit', (done: any) => {
      // Error case
      const badProcedureQuery: string = 'REPLACE PROCEDURE GetLastNameXSP ' +
      '(INOUT name VARCHAR(30)) ' +
      'LANGUAGE C ' +
      'NO SQL ' +
      'EXTERNAL NAME \'CS!getlastname_err!test/sprocs/getlastname_err.c!F!xsp_getlastname_err\'';
      let gotExpectedError: boolean = false;
      try {
        cursor1.execute(badProcedureQuery);
      } catch (error) {
        if (error instanceof OperationalError) {
          expect(error.message).includes('Errors encountered in compiling UDF/XSP/UDM/UDT/JAR');
          gotExpectedError = true;
          if (!bAutoCommit) {
            cursor1.execute('{fn teradata_commit}');
          }
        } else {
          logger.errorLogMessage(error.message); // unexpected error
        }
      } finally {
        expect(gotExpectedError).equals(true);
      }

      // Pre-test cleanup
      try {
        cursor1.execute('DROP PROCEDURE GetLastNameXSP');
      } catch (error) {
        if ((error instanceof OperationalError) &&
            (error.message.indexOf('Stored Procedure ') > 0)) {
          // ignore error
        } else {
          logger.errorLogMessage(error.message); // unexpected error
        }
      }
      if (!bAutoCommit) {
        cursor1.execute('{fn teradata_commit}');
      }

      // Good case
      const goodProcedureQuery: string = 'REPLACE PROCEDURE GetLastNameXSP ' +
        '(INOUT name VARCHAR(30)) ' +
        'LANGUAGE C ' +
        'NO SQL ' +
        'EXTERNAL NAME \'CS!getlastname!test/sprocs/getlastname.c!F!xsp_getlastname\'';
      try {
        cursor1.execute(goodProcedureQuery);
      } catch (error) {
        logger.errorLogMessage(error.message); // unexpected error
      }

      if (!bAutoCommit) {
        cursor1.execute('{fn teradata_commit}');
      }

      let sActual: string = '';
      try {
        const proc: string = 'GetLastNameXSP';
        cursor1.callproc(proc, ['Joe Smith']);
        const row: any[] = cursor1.fetchone();
        sActual = row[0];
      } catch (error) {
        logger.errorLogMessage(error.message); // unexpected error
      }
      expect(sActual).equals('Smith');

      // Post-test cleanup
      try {
        cursor1.execute('DROP PROCEDURE GetLastNameXSP');
      } catch (error) {
        if ((error instanceof OperationalError) &&
            (error.message.indexOf('Stored Procedure ') > 0)) {
          // ignore error
        } else {
          logger.errorLogMessage(error.message); // unexpected error
        }
      }
      if (!bAutoCommit) {
        cursor1.execute('{fn teradata_commit}');
      }
      done();
    });

    it('Test \'' + test.mode + '\' mode: test Create/Drop Table AutoCommit', (done: any) => {
      const sTableName: string = 'testTbl';
      bAutoCommit = true;

      // Create the second connection and the second cursor
      let teradataConnection2: TeradataConnection;
      let cursor2: TeradataCursor ;
      try {
        teradataConnection2 = new TeradataConnection();
        teradataConnection2.connect(connParamsCopy);
        cursor2 = teradataConnection2.cursor();
        try {
          validateAutoCommit(cursor2, true);

          if (!bInAnsiMode) {
            cursor2.execute('{fn teradata_nativesql}{fn teradata_autocommit_off}'); // turn AutoCommit off
            validateAutoCommit(cursor2, false);
            bAutoCommit = false;
          }

          // drop table using the second cursor
          try {
            cursor2.execute('drop table ' + sTableName);
          } catch (error) {
            if ((error instanceof OperationalError) &&
                (error.message.indexOf('Object ') > 0)) {
              // ignore error
            } else {
              logger.errorLogMessage(error.message); // unexpected error
            }
          }
          if (!bAutoCommit) {
            cursor2.execute('{fn teradata_commit}');
          }

          // Since there is no manual commit after this create, the table should be created
          // for Ansi Mode (autocommit on) and not for Tera Mode (autocommit off)
          cursor2.execute('create table ' + sTableName + '(  c1 integer not null) ');

        } catch (error) {
          logger.errorLogMessage(error.message); // unexpected error
        } finally {
          cursor2.close();
        }
      } catch (error) {
        logger.errorLogMessage(error.message); // unexpected error
      } finally {
        teradataConnection2.close();
      }

      // drop table using the primary cursor
      let errorSave: any = null;
      try {
        cursor1.execute('drop table ' + sTableName);
      } catch (error) {
        errorSave = error;
      }

      let nErrorCode: number = null;
      if ((errorSave instanceof OperationalError) &&
      (errorSave.message.indexOf('Object ') > 0)) {
        nErrorCode = 3807;
      } else {
        nErrorCode = 0;
      }

      // Verify results
      if (bAutoCommit) {
        expect(errorSave).equal(null);
      } else {
        expect(nErrorCode).equal(3807);
      }

      if (!bAutoCommit) {
        cursor1.execute('{fn teradata_commit}');
      }
      done();
    });

    it('Test \'' + test.mode + '\' mode: test KeepResponse With AutoCommit', (done: any) => {
      const sTableName: string = 'volatiletable'; // volatile table doesn't need scope
      const nNumOfRows: number = 50;
      let aaoActualValues: any[] = null;
      let aaoExpectedValues: any[] = [];
      try {
        cursor1.execute('create volatile table ' + sTableName + ' (c1 integer, c2 char (64000)) on commit preserve rows');
        if (!bAutoCommit) {
          cursor1.execute('{fn teradata_commit}');
        }
        insertRowsAutoCommit(cursor1, nNumOfRows, sTableName, bAutoCommit);
        testKeepResponseWithAutoCommit(teradataConnection1, sTableName, bAutoCommit);

        for (let i: number = 0; i < nNumOfRows; i++) {
          aaoExpectedValues.push([i, i.toString()]);
        }
        cursor1.execute('select * from ' + sTableName + ' order by 1');
        aaoActualValues = cursor1.fetchall();
      } catch (error) {
        logger.errorLogMessage(error.message); // unexpected error
      }

      // trim trailing blanks off the char value because of Teradata's export width feature
      for (let n: number = 0; n < aaoActualValues.length; n++) {
        aaoActualValues[n][1] = aaoActualValues[n][1].trim();
      }
      expect(aaoActualValues).deep.equal(aaoExpectedValues);
      done();
    });
  });
});

function validateAutoCommit(cur: TeradataCursor, sExpectedAutoCommit: boolean): void {

  let res: string = null;
  try {
     cur.execute('{fn teradata_nativesql}{fn teradata_autocommit}');
     const rows: any[] = cur.fetchall();
     res = rows[0][0];
  } catch (error) {
    logger.errorLogMessage(error.message); // unexpected error
  }
  const sActualAutoCommit: boolean = (res === 'true');
  if (sActualAutoCommit !== sExpectedAutoCommit) {
    throw new OperationalError('Expected AutoCommit to be ' + sExpectedAutoCommit);
  }
} // end validateAutoCommit

function insertRowsAutoCommit(cursor: TeradataCursor,
  nNumOfRows: number, sTableName: string, bAutoCommit: boolean): void {

    cursor.execute('insert into ' + sTableName + ' (c1, c2) values (0, \'0\')');

    // embed transactions
    if (!bAutoCommit) {
      cursor.execute('BT');
    }

    cursor.execute('insert into ' + sTableName + ' (c1, c2) values (1, \'1\')');
    cursor.execute('insert into ' + sTableName + ' (c1, c2) values (2, \'2\')');

    if (!bAutoCommit) {
      cursor.execute('BT');
    }

    for (let i: number = 3; i < nNumOfRows; i++) {
      cursor.execute('insert into ' + sTableName + ' (c1, c2) values (' + i.toString() + ', \'' + i.toString() + '\')');
    }
    if (!bAutoCommit) {
      cursor.execute('{fn teradata_commit}');
    }
} // end insertRowsAutoCommit

function testKeepResponseWithAutoCommit(con: TeradataConnection,
  sTableName: string, bAutoCommit: boolean): void {

  // Make sure the COMMITs do not impact the maximum number of open requests per session
  let aCur: any[] = [];
  let bGotLimitExceededError: boolean = false;
  try {
    for (let i: number = 0; i < 16; i++) {
      const cur: TeradataCursor = con.cursor();
      aCur.push(cur);
      cur.execute('select * from ' + sTableName + ' order by 1');
      if (!bAutoCommit) {
        cur.execute('{fn teradata_commit}');
      }
    }
  } catch (error) {
    // expected: [Error 3130] Response limit exceeded.
    bGotLimitExceededError = true;
  } finally {
    let nCursors: number = 0;
    if (bGotLimitExceededError) {
      nCursors = aCur.length - 1;
    } else {
      nCursors = aCur.length;
    }
    try {
      for (let n: number = 0; n < nCursors; n++) {
        aCur[n].close();
      }
    } catch (error) {
      logger.errorLogMessage(error.message); // unexpected error
    }
  }
} // end testKeepResponseWithAutoCommit
