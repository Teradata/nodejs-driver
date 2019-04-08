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
const sProcName: string = 'dynrsproc';
const aaoExpectedRows: any[] = [
  [ 1,
    1.23,
    'Seattle',
    new Date ('1980-03-04'),
    '1969-02-11 22:33:44.000000' ],
  [ 2,
    0.025,
    'Oakland',
    new Date('1982-10-30'),
    '2015-12-25 09:10:11.000000' ],
    [ 3,
      45.6,
      'Chicago',
      new Date('1981-05-06'),
      '1932-04-17 20:30:40.000000' ] ];

const aaoExpectedRsmd: any[] = [
  [ 'c0', 'number', null, '4', null, null, true ],
  [ 'c1', 'number', null, '18', '40', '0', true ],
  [ 'c2', 'string', null, '200', null, null, true ],
  [ 'c3', 'Date', null, '4', null, null, true ],
  [ 'c4', 'string', null, '26', '0', '6', true ] ];

let aaoActualRsmd: any[] = [];
let aaoActualRows: any[] = [];

describe('\n\n\nDynamic Result Sets Tests', () => {
  before((done: any) => {
    try {
      logger.infoLogMessage('\n');
      teradataConnection = new TeradataConnection();
      teradataConnection.connect(connParams);
      cursor = teradataConnection.cursor();

      const dQuery: string = 'DROP TABLE ' + sTableName;
      try {
        cursor.execute(dQuery);
      } catch (error) {
        if ((error instanceof OperationalError) &&
            (error.message.indexOf('Object \'' + sTableName + '\' does not exist') > 0)) {
          // ignorble error
        } else {
          logger.errorLogMessage(error.message); // unexpected error
        }
      }
      try {
        const cQuery: string = 'create volatile table ' + sTableName + ' (c0 integer, c1 number, ' +
          'c2 varchar(100), c3 date, c4 timestamp) on commit preserve rows;';
        cursor.execute(cQuery);
      } catch (error) {
        logger.errorLogMessage(error.message); // unexpected error
      }
      cursor.execute('insert into ' + sTableName + ' values (1,  1.23 , \'Seattle\', date \'1980-03-04\', timestamp \'1969-02-11 22:33:44\'); ' +
        'insert into ' + sTableName + ' values (2,  0.025, \'Oakland\', date \'1982-10-30\', timestamp \'2015-12-25 09:10:11\') ;' +
        'insert into ' + sTableName + ' values (3, 45.6  , \'Chicago\', date \'1981-05-06\', timestamp \'1932-04-17 20:30:40\')');

      cursor.execute ('select * from ' + sTableName + ' order by 1');
      aaoActualRsmd = cursor.description;
      aaoActualRows = cursor.fetchall();
    } catch (error) {
      logger.errorLogMessage(error.message); // unexpected error
    }
    expect(aaoActualRsmd).to.deep.equal(aaoExpectedRsmd);
    expect(aaoActualRows).to.deep.equal(aaoExpectedRows);
    done();
  });

  after((done: any) => {
    try {
      let query: string = 'DROP TABLE ' + sTableName;
      cursor.execute(query);

      query = 'DROP PROCEDURE ' + sProcName;
      cursor.execute(query);

    } catch (error) {
      logger.errorLogMessage(error.message); // unexpected error
    } finally {
      teradataConnection.close();
      done();
    }
  });

  // Demonstrate a stored procedure having IN and INOUT parameters.
  // Returns one result set having one row and one column containing the output parameter value.
  it('Test a stored procedure having IN and INOUT parameters', (done: any) => {
    let row1: any[];
    let rsmd1: any[];
    let row2: any[];
    let rsmd2: any[];
    let row3: any[];
    let rsmd3: any[];
    const expectedRow1: any[] = [ [8] ];
    const expectedRsmd1: any[] = [ [ 'p2', 'number', null, '1', null, null, true ] ];
    const expectedRow2: any[] = [ [17] ];
    const expectedRsmd2: any[] = [ [ 'p2', 'number', null, '8', null, null, true ] ];
    const expectedRow3: any[] = [ [24] ];
    const expectedRsmd3: any[] = [ [ 'p2', 'number', null, '8', null, null, true ] ];
    try {
      const procedureQuery: string = 'REPLACE PROCEDURE ' + sProcName +
      ' (in p1 integer, inout p2 integer) begin set p2 = p1 + p2 ; end ; ';
      try {
        cursor.execute(procedureQuery);
      } catch (error) {
        logger.errorLogMessage(error.message); // unexpected error
      }

      cursor.execute('{call ' + sProcName + ' (3, 5)}'); // literal parameter values
      rsmd1 = cursor.description;
      row1 = cursor.fetchall();
      cursor.execute('{call ' + sProcName + ' (?, ?)}', [10, 7]); // bound parameter values
      rsmd2 = cursor.description;
      row2 = cursor.fetchall();
      cursor.callproc(sProcName, [20, 4]); // bound parameter values
      rsmd3 = cursor.description;
      row3 = cursor.fetchall();
    } catch (error) {
      logger.errorLogMessage(error.message); // unexpected error
    } finally {
      expect(rsmd1).to.deep.equal(expectedRsmd1);
      expect(row1).to.deep.equal(expectedRow1);
      expect(rsmd2).to.deep.equal(expectedRsmd2);
      expect(row2).to.deep.equal(expectedRow2);
      expect(rsmd3).to.deep.equal(expectedRsmd3);
      expect(row3).to.deep.equal(expectedRow3);
      done();
    }
  });

  // Demonstrate a stored procedure having one OUT parameter.
  // Returns one result set having one row and one column containing the output parameter value.
  // Only demonstrate .execute because OUT parameters are not supported by .callproc
  // OUT parameters must be unbound.
  it('Test a stored procedure having one OUT parameter', (done: any) => {
    let row1: any[];
    let rsmd1: any[];
    const expectedRow1: any[] = [ ['foobar'] ];
    const expectedRsmd1: any[] = [ [ 'p1', 'string', null, '200', null, null, false ] ];
    try {
      const procedureQuery: string = 'REPLACE PROCEDURE ' + sProcName +
      '  (out p1 varchar(100)) begin set p1 = \'foobar\' ; end ; ';
      try {
        cursor.execute(procedureQuery);
      } catch (error) {
        logger.errorLogMessage(error.message); // unexpected error
      }
      cursor.execute('{call ' + sProcName + ' (?)}');
      rsmd1 = cursor.description;
      row1 = cursor.fetchall();
    } catch (error) {
      logger.errorLogMessage(error.message); // unexpected error
    } finally {
      expect(rsmd1).to.deep.equal(expectedRsmd1);
      expect(row1).to.deep.equal(expectedRow1);
      done();
    }
  });

  // Demonstrate a stored procedure having no parameters that returns one dynamic result set.
  // Returns two result sets.
  // The first result set is empty having no rows or columns, because there are no output parameter values.
  // The second result set is the dynamic result set returned by the stored procedure.
  it('Test a stored procedure having no parameters that returns one dynamic result set', (done: any) => {
    let row1: any[];
    let rsmd1: any[];
    let nextSet1: boolean;
    const expectedRow1: any[] = [];
    const expectedRsmd1: any[] = [];
    const expectedNextSet1: boolean = true;
    let row2: any[];
    let rsmd2: any[];
    let nextSet2: boolean;
    const expectedNextSet2: boolean = false;
    let row3: any[];
    let rsmd3: any[];
    let nextSet3: boolean;
    const expectedRow3: any[] = [];
    const expectedRsmd3: any[] = [];
    const expectedNextSet3: boolean = true;
    let row4: any[];
    let rsmd4: any[];
    let nextSet4: boolean;
    const expectedNextSet4: boolean = false;
    try {
      const procedureQuery: string = 'REPLACE PROCEDURE ' + sProcName + '()' +
      ' dynamic result sets 1' +
      ' begin' +
      '   declare cur1 cursor with return for select * from ' + sTableName + ' order by 1 ;' +
      '   open cur1 ;' +
      ' end ; ';

      try {
        cursor.execute(procedureQuery);
      } catch (error) {
        logger.errorLogMessage(error.message); // unexpected error
      }

      cursor.execute('{call ' + sProcName + '}');
      rsmd1 = cursor.description;
      row1 = cursor.fetchall();
      nextSet1 = cursor.nextset();
      rsmd2 = cursor.description;
      row2 = cursor.fetchall();
      nextSet2 = cursor.nextset();

      cursor.callproc(sProcName);
      rsmd3 = cursor.description;
      row3 = cursor.fetchall();
      nextSet3 = cursor.nextset();
      rsmd4 = cursor.description;
      row4 = cursor.fetchall();
      nextSet4 = cursor.nextset();

    } catch (error) {
      logger.errorLogMessage(error.message); // unexpected error
    } finally {
      expect(rsmd1).to.deep.equal(expectedRsmd1);
      expect(row1).to.deep.equal(expectedRow1);
      expect(nextSet1).equal(expectedNextSet1);
      expect(rsmd2).to.deep.equal(aaoExpectedRsmd);
      expect(row2).to.deep.equal(aaoExpectedRows);
      expect(nextSet2).equal(expectedNextSet2);
      expect(rsmd3).to.deep.equal(expectedRsmd3);
      expect(row3).to.deep.equal(expectedRow3);
      expect(nextSet3).equal(expectedNextSet3);
      expect(rsmd4).to.deep.equal(aaoExpectedRsmd);
      expect(row4).to.deep.equal(aaoExpectedRows);
      expect(nextSet4).equal(expectedNextSet4);
      done();
    }
  });

  // Demonstrate a stored procedure having IN and INOUT parameters that returns two dynamic result sets.
  // Returns three result sets.
  // The first result set has one row and one column containing the output parameter values.
  // The second and third result sets are dynamic result sets returned by the stored procedure.
  it('Test a stored procedure having having IN and INOUT parameters that returns two dynamic result sets', (done: any) => {
    let row1: any[];
    let rsmd1: any[];
    let nextSet1: boolean;
    const expectedRow1: any[] = [ [3, 6] ];
    const expectedRsmd1: any[] =
    [
      [
        'p2',
        'number',
        null,
        '1',
        null,
        null,
        true,
      ],
      [
        'p3',
        'number',
        null,
        '1',
        null,
        null,
        true,
      ],
    ];
    const expectedNextSet1: boolean = true;

    let row2: any[];
    let rsmd2: any[];
    let nextSet2: boolean;
    const expectedNextSet2: boolean = true;

    let row3: any[];
    let rsmd3: any[];
    let nextSet3: boolean;
    const expectedRow3: any[] =
    [ ['Chicago', 3],
      ['Oakland', 2],
      ['Seattle', 1] ];
    const expectedNextSet3: boolean = false;

    let row4: any[];
    let rsmd4: any[];
    let nextSet4: boolean;
    const expectedRow4: any[] = [ [5, 12] ];
    const expectedRsmd4: any[] =
    [
      [
        'p2',
        'number',
        null,
        '8',
        null,
        null,
        true,
      ],
      [
        'p3',
        'number',
        null,
        '8',
        null,
        null,
        true,
      ],
    ];
    const expectedNextSet4: boolean = true;

    let row5: any[];
    let rsmd5: any[];
    let nextSet5: boolean;
    const expectedNextSet5: boolean = true;

    let row6: any[];
    let rsmd6: any[];
    let nextSet6: boolean;
    const expectedRow6: any[] =
    [ ['Chicago', 3],
      ['Oakland', 2],
      ['Seattle', 1] ];
    const expectedNextSet6: boolean = false;

    let row7: any[];
    let rsmd7: any[];
    let nextSet7: boolean;
    const expectedRow7: any[] = [ [13, 20] ];
    const expectedRsmd7: any[] =
    [
      [
        'p2',
        'number',
        null,
        '8',
        null,
        null,
        true,
      ],
      [
        'p3',
        'number',
        null,
        '8',
        null,
        null,
        true,
      ],
    ];
    const expectedNextSet7: boolean = true;

    let row8: any[];
    let rsmd8: any[];
    let nextSet8: boolean;
    const expectedNextSet8: boolean = true;

    let row9: any[];
    let rsmd9: any[];
    let nextSet9: boolean;
    const expectedRow9: any[] =
    [ ['Chicago', 3],
      ['Oakland', 2],
      ['Seattle', 1] ];
    const expectedNextSet9: boolean = false;

    try {
      const procedureQuery: string = 'REPLACE PROCEDURE ' + sProcName + ' (in p1 integer, inout p2 integer, inout p3 integer)' +
      ' dynamic result sets 2' +
      ' begin' +
      '    declare cur1 cursor with return for select * from ' + sTableName + ' order by 1 ;' +
      '    declare cur2 cursor with return for select c2, c0 from ' + sTableName + ' order by 1 ;' +
      '    open cur1 ;' +
      '    open cur2 ;' +
      '    set p2 = p1 + p2 ;' +
      '    set p3 = p1 * p3 ;' +
      ' end ;';

      try {
        cursor.execute(procedureQuery);
      } catch (error) {
        logger.errorLogMessage(error.message); // unexpected error
      }

      cursor.execute('{call ' + sProcName + ' (2, 1, 3)}'); // literal parameter values
      rsmd1 = cursor.description;
      row1 = cursor.fetchall();
      nextSet1 = cursor.nextset();
      rsmd2 = cursor.description;
      row2 = cursor.fetchall();
      nextSet2 = cursor.nextset();
      rsmd3 = cursor.description;
      row3 = cursor.fetchall();
      nextSet3 = cursor.nextset();

      cursor.execute('{call ' + sProcName + ' (?, ?, ?)}', [3, 2, 4]); // bound IN and INOUT parameter values
      rsmd4 = cursor.description;
      row4 = cursor.fetchall();
      nextSet4 = cursor.nextset();
      rsmd5 = cursor.description;
      row5 = cursor.fetchall();
      nextSet5 = cursor.nextset();
      rsmd6 = cursor.description;
      row6 = cursor.fetchall();
      nextSet6 = cursor.nextset();

      cursor.callproc(sProcName, [10, 3, 2]); // bound IN and INOUT parameter values
      rsmd7 = cursor.description;
      row7 = cursor.fetchall();
      nextSet7 = cursor.nextset();
      rsmd8 = cursor.description;
      row8 = cursor.fetchall();
      nextSet8 = cursor.nextset();
      rsmd9 = cursor.description;
      row9 = cursor.fetchall();
      nextSet9 = cursor.nextset();
    } catch (error) {
      logger.errorLogMessage(error.message); // unexpected error
    } finally {
      expect(rsmd1).to.deep.equal(expectedRsmd1);
      expect(row1).to.deep.equal(expectedRow1);
      expect(nextSet1).equal(expectedNextSet1);
      expect(rsmd2).to.deep.equal(aaoExpectedRsmd);
      expect(row2).to.deep.equal(aaoExpectedRows);
      expect(nextSet2).equal(expectedNextSet2);
      expect(rsmd3).to.deep.equal([aaoExpectedRsmd[2], aaoExpectedRsmd[0]]);
      expect(row3).to.deep.equal(expectedRow3);
      expect(nextSet3).equal(expectedNextSet3);
      expect(rsmd4).to.deep.equal(expectedRsmd4);
      expect(row4).to.deep.equal(expectedRow4);
      expect(nextSet4).equal(expectedNextSet4);
      expect(rsmd5).to.deep.equal(aaoExpectedRsmd);
      expect(row5).to.deep.equal(aaoExpectedRows);
      expect(nextSet5).equal(expectedNextSet5);
      expect(rsmd6).to.deep.equal([aaoExpectedRsmd[2], aaoExpectedRsmd[0]]);
      expect(row6).to.deep.equal(expectedRow6);
      expect(nextSet6).equal(expectedNextSet6);
      expect(rsmd7).to.deep.equal(expectedRsmd7);
      expect(row7).to.deep.equal(expectedRow7);
      expect(nextSet7).equal(expectedNextSet7);
      expect(rsmd8).to.deep.equal(aaoExpectedRsmd);
      expect(row8).to.deep.equal(aaoExpectedRows);
      expect(nextSet8).equal(expectedNextSet8);
      expect(rsmd9).to.deep.equal([aaoExpectedRsmd[2], aaoExpectedRsmd[0]]);
      expect(row9).to.deep.equal(expectedRow9);
      expect(nextSet9).equal(expectedNextSet9);
      done();
    }
  });

  // Demonstrate a stored procedure having IN, INOUT, and OUT parameters that returns two dynamic result sets.
  // Returns three result sets.
  // The first result set has one row and two columns containing the output values from the INOUT and OUT parameters.
  // The second and third result sets are dynamic result sets returned by the stored procedure.
  // Only demonstrate .execute because OUT parameters are not supported by .callproc
  // OUT parameters must be unbound.
  it('Test a stored procedure having having IN, INOUT, and OUT parameters that returns two dynamic result sets', (done: any) => {
    let row1: any[];
    let rsmd1: any[];
    let nextSet1: boolean;
    const expectedRow1: any[] = [ [15, 'hello'] ];
    const expectedRsmd1: any[] =
    [
      [
        'p2',
        'number',
        null,
        '1',
        null,
        null,
        true,
      ],
      [
        'p3',
        'string',
        null,
        '200',
        null,
        null,
        false,
      ],
    ];
    const expectedNextSet1: boolean = true;

    let row2: any[];
    let rsmd2: any[];
    let nextSet2: boolean;
    const expectedNextSet2: boolean = true;

    let row3: any[];
    let rsmd3: any[];
    let nextSet3: boolean;
    const expectedRow3: any[] =
    [ ['Chicago', 45.6],
      ['Oakland', 0.025],
      ['Seattle', 1.23] ];
    const expectedNextSet3: boolean = false;

    let row4: any[];
    let rsmd4: any[];
    let nextSet4: boolean;
    const expectedrow4: any[] = [ [27, 'hello'] ];
    const expectedrsmd4: any[] =
    [
      [
        'p2',
        'number',
        null,
        '8',
        null,
        null,
        true,
      ],
      [
        'p3',
        'string',
        null,
        '200',
        null,
        null,
        false,
      ],
    ];
    const expectednextSet4: boolean = true;

    let row5: any[];
    let rsmd5: any[];
    let nextSet5: boolean;
    const expectednextSet5: boolean = true;

    let row6: any[];
    let rsmd6: any[];
    let nextSet6: boolean;
    const expectedrow6: any[] =
    [ ['Chicago', 45.6],
      ['Oakland', 0.025],
      ['Seattle', 1.23] ];
    const expectednextSet6: boolean = false;
    try {
      const procedureQuery: string = 'REPLACE PROCEDURE ' + sProcName + ' (in p1 integer, inout p2 integer, out p3 varchar(100))' +
      ' dynamic result sets 2' +
      ' begin' +
      '     declare cur1 cursor with return for select * from ' + sTableName + ' order by 1 ;' +
      '     declare cur2 cursor with return for select c2, c1 from ' + sTableName + ' order by 1 ;' +
      '     open cur1 ;' +
      '     open cur2 ;' +
      '     set p2 = p1 + p2 ;' +
      '     set p3 = \'hello\' ;' +
      ' end ;' ;

      try {
        cursor.execute(procedureQuery);
      } catch (error) {
        logger.errorLogMessage(error.message); // unexpected error
      }

      cursor.execute('{call ' + sProcName + ' (10, 5, ?)}'); // literal parameter values
      rsmd1 = cursor.description;
      row1 = cursor.fetchall();
      nextSet1 = cursor.nextset();
      rsmd2 = cursor.description;
      row2 = cursor.fetchall();
      nextSet2 = cursor.nextset();
      rsmd3 = cursor.description;
      row3 = cursor.fetchall();
      nextSet3 = cursor.nextset();

      cursor.execute('{call ' + sProcName + ' (?, ?, ?)}', [20, 7]); // bound IN and INOUT parameter values
      rsmd4 = cursor.description;
      row4 = cursor.fetchall();
      nextSet4 = cursor.nextset();
      rsmd5 = cursor.description;
      row5 = cursor.fetchall();
      nextSet5 = cursor.nextset();
      rsmd6 = cursor.description;
      row6 = cursor.fetchall();
      nextSet6 = cursor.nextset();
    } catch (error) {
      logger.errorLogMessage(error.message); // unexpected error
    } finally {
      expect(rsmd1).to.deep.equal(expectedRsmd1);
      expect(row1).to.deep.equal(expectedRow1);
      expect(nextSet1).equal(expectedNextSet1);
      expect(rsmd2).to.deep.equal(aaoExpectedRsmd);
      expect(row2).to.deep.equal(aaoExpectedRows);
      expect(nextSet2).equal(expectedNextSet2);
      expect(rsmd3).to.deep.equal([aaoExpectedRsmd[2], aaoExpectedRsmd[1]]);
      expect(row3).to.deep.equal(expectedRow3);
      expect(nextSet3).equal(expectedNextSet3);
      expect(rsmd4).to.deep.equal(expectedrsmd4);
      expect(row4).to.deep.equal(expectedrow4);
      expect(nextSet4).equal(expectednextSet4);
      expect(rsmd5).to.deep.equal(aaoExpectedRsmd);
      expect(row5).to.deep.equal(aaoExpectedRows);
      expect(nextSet5).equal(expectednextSet5);
      expect(rsmd6).to.deep.equal([aaoExpectedRsmd[2], aaoExpectedRsmd[1]]);
      expect(row6).to.deep.equal(expectedrow6);
      expect(nextSet6).equal(expectednextSet6);
      done();
    }
  });
});
