import 'mocha';
import { expect } from 'chai';
import { TeradataConnection } from '../../src/teradata-connection';
import { TeradataCursor } from '../../src/teradata-cursor';
import { connParams } from '../configurations';
import { TeradataLogging } from '../../src/teradata-logging';
import { OperationalError } from '../../src/teradata-exceptions';
import * as child from 'child_process';

const logger: TeradataLogging = new TeradataLogging();
let teradataConnection: TeradataConnection;
let cursor: TeradataCursor;
let hasJavaInstalled: boolean = false;

describe('\n\n\Stored Procedures Tests', () => {
  before((done: any) => {
    try {
      logger.infoLogMessage('\n');
      teradataConnection = new TeradataConnection();
      teradataConnection.connect(connParams);
      cursor = teradataConnection.cursor();

      const dQuery: string = 'DROP TABLE volatiletable';
      try {
        cursor.execute(dQuery);
      } catch (error) {
        if ((error instanceof OperationalError) &&
            (error.message.indexOf('Object \'volatiletable\' does not exist') > 0)) {
          // ignorble error
        } else {
          logger.errorLogMessage(error.message); // unexpected error
        }
      }
      const cQuery: string = 'create volatile table volatiletable (c1 integer) on commit preserve rows';
      cursor.execute(cQuery);
    } catch (error) {
      logger.errorLogMessage(error.message); // unexpected error
    }

    try {
      const dQuery: string = 'DROP PROCEDURE GetLastNameXSP';
      try {
        cursor.execute(dQuery);
      } catch (error) {
        if ((error instanceof OperationalError) &&
            (error.message.indexOf('GetLastNameXSP\' does not exist') > 0)) {
          // ignorble error
        } else {
          logger.errorLogMessage(error.message); // unexpected error
        }
      }
    } catch (error) {
      logger.errorLogMessage(error.message); // unexpected error
    }

    // For Java Tests must compile the jar so have to see if Java is installed
    // and then compile the sample java into a jar
    let query: string;
    child.exec('javac', (err: child.ExecException, stdout: string, stderr: string) => {
     if (stderr && stderr.indexOf('Usage: javac <options> <source files>') > -1) {
      child.exec('javac ' + __dirname + '/java/com/teradata/sample/ProcJava1.java', (err2: child.ExecException, stdout2: string, stderr2: string) => {
          logger.infoLogMessage(stderr2);
          logger.infoLogMessage(stdout2);
          if (!stderr2) {
            child.exec('jar cvf ' + __dirname + '/LargeJar.jar -C ' + __dirname + '/java .',
                        (err3: child.ExecException, stdout3: string, stderr3: string) => {
              logger.infoLogMessage(stderr3);
              logger.infoLogMessage(stdout3);
              if (!stderr3) {
                logger.infoLogMessage('Found Java installed. Will run Java tests');
                hasJavaInstalled = true;
                query = 'DROP PROCEDURE procJava1';
                try {
                  cursor.execute(query);
                } catch (error) {
                  if ((error instanceof OperationalError) &&
                      (error.message.indexOf('procJava1\' does not exist') > 0)) {
                    // ignorble error
                  } else {
                    logger.errorLogMessage(error.message); // unexpected error
                  }
                }
                query = 'call sqlj.remove_jar (\'LargeJar\',0)';
                try {
                  cursor.execute(query);
                } catch (error) {
                  if ((error instanceof OperationalError) &&
                      (error.message.indexOf('LargeJar\' does not exist') > 0)) {
                    // ignorble error
                  } else {
                    logger.errorLogMessage(error.message); // unexpected error
                  }
                }
                done();
              } else {
                hasJavaInstalled = false;
                logger.infoLogMessage('Warning: No Java installed. Not all tests will be run');
                done();
              }
            });
          } else {
            hasJavaInstalled = false;
            logger.infoLogMessage('Warning: No Java installed. Not all tests will be run');
            done();
          }
        });
      } else {
        hasJavaInstalled = false;
        logger.infoLogMessage('Warning: No Java installed. Not all tests will be run');
        done();
      }
    });
  });

  after((done: any) => {
    try {
      let query: string = 'DROP TABLE volatiletable';
      cursor.execute(query);

      query = 'DROP PROCEDURE GetLastNameXSP';
      cursor.execute(query);

      if (hasJavaInstalled) {
        query = 'DROP PROCEDURE procJava1';
        cursor.execute(query);

        query = 'call sqlj.remove_jar (\'LargeJar\',0)';
        cursor.execute(query);
      }
    } catch (error) {
      logger.errorLogMessage(error.message); // unexpected error
    } finally {
      teradataConnection.close();
      done();
    }
  });

  it('Test C External Stored Procedure (XSP)', (done: any) => {
    let row: any[];
    try {
      const procedureQuery: string = 'REPLACE PROCEDURE GetLastNameXSP ' +
        '(INOUT name VARCHAR(30)) ' +
        'LANGUAGE C ' +
        'NO SQL ' +
        'EXTERNAL NAME \'CS!getlastname!test/sprocs/getlastname.c!F!xsp_getlastname\'';
      cursor.execute(procedureQuery);

      const proc: string = 'GetLastNameXSP';
      cursor.callproc(proc, ['Joe Smith']);

      row = cursor.fetchone();
    } catch (error) {
      logger.errorLogMessage(error.message); // unexpected error
    } finally {
      expect(row[0]).equals('Smith');
      done();
    }
  });

  it('Test C External Stored Procedure (XSP) Error Case', (done: any) => {
    const procedureQuery: string = 'REPLACE PROCEDURE GetLastNameXSP ' +
      '(INOUT name VARCHAR(30)) ' +
      'LANGUAGE C ' +
      'NO SQL ' +
      'EXTERNAL NAME \'CS!getlastname_err!test/sprocs/getlastname_err.c!F!xsp_getlastname_err\'';
    let caughtError: boolean = false;
    try {
      cursor.execute(procedureQuery);
    } catch (error) {
      if (error instanceof OperationalError) {
        expect(error.message).includes('Errors encountered in compiling UDF/XSP/UDM/UDT/JAR');
        caughtError = true;
      } else {
        logger.errorLogMessage(error.message); // unexpected error
      }
    } finally {
      expect(caughtError).equals(true);
      done();
    }
  });

  it('Test Java External Stored Procedure (XSP)', (done: any) => {
    if (hasJavaInstalled) {
      let fetchedRow: any[];
      let expectedRow: any[];
      try {
        const installJarQuery: string = 'call sqlj.install_jar(\'cj!' + __dirname + '/LargeJar.jar\',\'LargeJar\',0)';
        cursor.execute(installJarQuery);

        const procedureQuery: string = 'REPLACE PROCEDURE procJava1 ' +
          '(IN p1 INTEGER, IN tableName VARCHAR (60)) ' +
          'LANGUAGE JAVA MODIFIES SQL DATA ' +
          'PARAMETER STYLE JAVA ' +
          'EXTERNAL NAME \'LargeJar:com.teradata.sample.ProcJava1.procJava1\'';
        cursor.execute(procedureQuery);

        const proc: string = 'procJava1';
        cursor.callproc(proc, [123, 'volatiletable']);

        const query: string = 'SELECT * FROM volatiletable ORDER BY 1';
        cursor.execute(query);

        fetchedRow = cursor.fetchone();
        expectedRow = [123];
      } catch (error) {
        logger.errorLogMessage(error.message); // unexpected error
      } finally {
        expect(fetchedRow).to.deep.equal(expectedRow);
      }
    } else {
      logger.infoLogMessage('Warning: No Java installed. Test will not run.');
    }
    done();
  });

  it('Test Java External Stored Procedure (XSP) Error Case on unknown java method', (done: any) => {
    if (hasJavaInstalled) {
      const procedureQuery: string = 'REPLACE PROCEDURE procJava1 ' +
        '(IN p1 INTEGER, IN tableName VARCHAR (60)) ' +
        'LANGUAGE JAVA MODIFIES SQL DATA ' +
        'PARAMETER STYLE JAVA ' +
        'EXTERNAL NAME \'LargeJar:com.teradata.sample.ProcJava1.procJava1.dummy\'';
      let caughtError: boolean = false;
      try {
        cursor.execute(procedureQuery);
      } catch (error) {
        if (error instanceof OperationalError) {
          expect(error.message).includes('A JAVA method in the specified Jar which matches that in the EXTERNAL NAME clause was not found');
          caughtError = true;
        } else {
          logger.errorLogMessage(error.message); // unexpected error
        }
      } finally {
        expect(caughtError).equals(true);
      }
    } else {
      logger.infoLogMessage('Warning: No Java installed. Test will not run.');
    }
    done();
  });

  it('Test Java External Stored Procedure (XSP) Error Case on non exist jar file', (done: any) => {
    if (hasJavaInstalled) {
      const procedureQuery: string = 'REPLACE PROCEDURE procJava1 ' +
        '(IN p1 INTEGER, IN tableName VARCHAR (60)) ' +
        'LANGUAGE JAVA MODIFIES SQL DATA ' +
        'PARAMETER STYLE JAVA ' +
        'EXTERNAL NAME \'ZeroLenJXSP:com.teradata.sample.ProcJava1.procJava1\'';
      let caughtError: boolean = false;
      try {
        cursor.execute(procedureQuery);
      } catch (error) {
        if (error instanceof OperationalError) {
          expect(error.message).includes('Jar \'ZeroLenJXSP\' does not exist');
          caughtError = true;
        } else {
          logger.errorLogMessage(error.message); // unexpected error
        }
      } finally {
        expect(caughtError).equals(true);
      }
    } else {
      logger.infoLogMessage('Warning: No Java installed. Test will not run.');
    }
    done();
  });

  it('Test Java External Stored Procedure (XSP) Error Case on zero-length jar file', (done: any) => {
    if (hasJavaInstalled) {
      const installJarQuery: string = 'call sqlj.install_jar(\'cj!test/sprocs/java/ZeroLenJXSP.jar\',\'ZeroLenJXSP\',0)';
      let caughtError: boolean = false;
      try {
        cursor.execute(installJarQuery);
      } catch (error) {
        if (error instanceof OperationalError) {
          expect(error.message).includes('Error creating UDF/XSP/UDM/UDT/JAR: problem accessing the external file');
          caughtError = true;
        } else {
          logger.errorLogMessage(error.message); // unexpected error
        }
      }
      expect(caughtError).equals(true);
    } else {
      logger.infoLogMessage('Warning: No Java installed. Test will not run.');
    }
    done();
  });
});
