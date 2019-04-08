import 'mocha';
import { expect } from 'chai';
import { TeradataConnection } from '../../src/teradata-connection';
import { TeradataCursor } from '../../src/teradata-cursor';
import { connParams } from '../configurations';
import { TeradataLogging } from '../../src/teradata-logging';
import { OperationalError } from '../../src/teradata-exceptions';

const logger: TeradataLogging = new TeradataLogging();
let teradataConnection: TeradataConnection;
let cursor: TeradataCursor;
const sTableName: string = 'volatiletable';
const sProcedureName: string = 'LrgProcedure';

describe('\n\n\nCreate Procedure Tests', () => {
  before((done: any) => {
    try {
      logger.infoLogMessage('\n');
      teradataConnection = new TeradataConnection();
      teradataConnection.connect(connParams);
      cursor = teradataConnection.cursor();
      const dQuery: string = 'DROP PROCEDURE ' + sProcedureName;
      try {
        cursor.execute(dQuery);
      } catch (error) {
        if ((error instanceof OperationalError) &&
            (error.message.indexOf(sProcedureName + '\' does not exist') > 0)) {
          // ignorble error
        } else {
          logger.errorLogMessage(error.message); // unexpected error
        }
      }
      try {
        const cQuery: string = 'create volatile table ' + sTableName + ' (c1 integer) on commit preserve rows;';
        cursor.execute(cQuery);
      } catch (error) {
        logger.errorLogMessage(error.message); // unexpected error
      }
    } catch (error) {
      logger.errorLogMessage(error.message); // unexpected error
    }
    done();
  });

  after((done: any) => {
    try {
      teradataConnection.close();
    } catch (error) {
      logger.errorLogMessage(error.message); // unexpected error
    } finally {
      done();
    }
  });

  it('Test create stored procedures', (done: any) => {
    const anProcSizes: number []  = [1300, 1000000, 1906000, 2000020];
    let nInsertValue: number = 0;
    let nProcNum: number = 0;
    const expectedErrorCount: number = 4;
    let actualErrorCount: number = 0;
    let actualShowProcedureRows: string[] = [];
    let actualShowProcedureText: string = '';
    let aaoExpectedValues: any[] = []; // dynamic; will be populated
    let aaoActualValues: any[] = [];

    try {
      // Loop through and create/replace procedures with varying lengths that span mulitple messages
      // Verify that the stored procedure compile warning is converted to an error
      for ( let nProcedureSize of anProcSizes) {
        let result: any[] = getProcedure (nProcedureSize, nProcNum, nInsertValue);
        let sSql: string = result[0];
        nInsertValue = result[1];

        try {
          // Test Create/Replace procedure
          cursor.execute(sSql);

          try {
            // show procedure
            cursor.execute('SHOW PROCEDURE ' + sProcedureName);
            actualShowProcedureRows = cursor.fetchall();
            actualShowProcedureText = '';
            for (let row of actualShowProcedureRows) {
              actualShowProcedureText += row;
            }
            // call procedure
            cursor.execute('{call ' + sProcedureName + '()}');
          } catch (error) {
            logger.errorLogMessage(error.message); // unexpected error
          } finally {
            // compare show procedure
            expect(actualShowProcedureText).equal(sSql);
            // drop procedure
            cursor.execute('drop procedure ' + sProcedureName);
          }
        } catch (error) {
          logger.errorLogMessage(error.message); // unexpected error
        }

        // Error testing (using different sizes of stored procedure)
        try {
          sSql = getErrProcedure (nProcedureSize);
          cursor.execute(sSql);

        } catch (error) {
          if ((error instanceof OperationalError) &&
          (error.message.indexOf('Error 5526') > 0)) { // Compile error
            // expected error
            // [Teradata Database] [Error 5526] Stored Procedure is not created/replaced due to error(s).
            logger.traceLogMessage('Ignoring expected 5526 error\n');
            actualErrorCount += 1;
          } else {
            throw error;
          }
        }
        nProcNum += 1;
      }
      aaoExpectedValues = new Array(nInsertValue);
      for (let i: number = 0; i < aaoExpectedValues.length; i++) {
        aaoExpectedValues[i] = [i];
      }
      cursor.execute('select * from ' + sTableName + ' order by 1');
      aaoActualValues = cursor.fetchall();
    } catch (error) {
      logger.errorLogMessage(error.message); // unexpected error
    } finally {
      expect(actualErrorCount).equal(expectedErrorCount);
      expect(aaoActualValues).to.deep.equal(aaoExpectedValues);
      done();
    }
  });
});

function getProcedure (nProcSize: number, nProcNum: number, nInsertValue: number): any[] {
  const result: any[] = [];
  let sProcBody: string = '';
  let sCreate: string = '';

  while (sProcBody.length <= nProcSize) {
      sProcBody += 'INSERT INTO ' + sTableName + ' (' + nInsertValue + ') ' + '/*日strg*/'.repeat(98) + ' ; ';
      nInsertValue += 1;
  }
  if (nProcNum % 4 === 1) {
    sCreate = 'CREATE procedure ';
  } else if (nProcNum % 4 === 3) {
    sCreate = 'create PROCEDURE ';
  } else if (nProcNum % 4 === 2) {
    sCreate = 'REPLACE procedure ';
  } else {
    sCreate = 'replace PROCEDURE ';
  }

  let sSql: string = sCreate + sProcedureName + ' () BEGIN ' + sProcBody + ' END;';
  result.push(sSql);
  result.push(nInsertValue);
  return result;
}

function getErrProcedure (nProcSize: number): string {
  let sSqlErr: string = '';
  let sProcBody: string = '';

  while (sProcBody.length <= nProcSize) {
    sProcBody += ' /*日本語日本語日本語日本語日本語日本語日本語日本語日本語日本語日本語日本語日本語日本語*/ ';
  }
  sSqlErr = 'REPLACE PROCEDURE ' + sProcedureName + '  \n BEGIN \n  ' + sProcBody + ' \n END  ';

  return sSqlErr;
}
