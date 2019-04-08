import 'mocha';
import { expect } from 'chai';
import { TeradataConnection } from '../../src/teradata-connection';
import { TeradataCursor } from '../../src/teradata-cursor';
import { TeradataLogging } from '../../src/teradata-logging';
import { connParams } from '../configurations';

let teradataConnection: TeradataConnection;
let cursor: TeradataCursor;
const sTableName: string = 'volatiletable';
const logger: TeradataLogging = new TeradataLogging();

describe('\n\n\nFetch on Closed Rows Tests', () => {
  before((done: any) => {
    try {
      logger.infoLogMessage('\n');
      teradataConnection = new TeradataConnection();
      teradataConnection.connect(connParams);
      cursor = teradataConnection.cursor();

      const cQuery: string = 'create volatile table ' + sTableName +
        '(  c1 integer ) on commit preserve rows';
      cursor.execute(cQuery);
      cursor.execute('insert into ' + sTableName + ' (c1) values (1)');
      cursor.execute('insert into ' + sTableName + ' (c1) values (2)');
      cursor.execute('insert into ' + sTableName + ' (c1) values (3)');
      cursor.execute('insert into ' + sTableName + ' (c1) values (4)');
      cursor.execute('insert into ' + sTableName + ' (c1) values (5)');
    } catch (error) {
      logger.errorLogMessage(error.message); // unexpected error
    } finally {
      done();
    }
  });

  after((done: any) => {
    try {
      cursor.close();
      teradataConnection.close();
    } catch (error) {
      logger.errorLogMessage(error.message); // unexpected error
    } finally {
      done();
    }
  });

  it('Test fetch on closed rows with a single statement', (done: any) => {
    const sQuery: string = 'SELECT * FROM ' + sTableName + ' ORDER BY 1';
    const fetchManyExpectedValues1: any[] = [[1], [2]];
    const fetchManyExpectedValues2: any[] = [[3], [4], [5]];
    const fetchManyExpectedValues3: any[] = [];
    let fetchManyActualValues1: any[] = null;
    let fetchManyActualValues2: any[] = null;
    let fetchManyActualValues3: any[] = null;

    try {
      cursor.execute(sQuery);

      // returns first 2 rows
      fetchManyActualValues1 = cursor.fetchmany(2);

      // returns the remaining 3 rows
      fetchManyActualValues2 = cursor.fetchmany(4);

      // No more rows so it returns an empty result set not an error for closed rows
      fetchManyActualValues3 = cursor.fetchmany(2);
    } catch (error) {
      logger.errorLogMessage(error.message); // unexpected error
    }

    expect(fetchManyActualValues1).to.deep.equal(fetchManyExpectedValues1);
    expect(fetchManyActualValues2).to.deep.equal(fetchManyExpectedValues2);
    expect(fetchManyActualValues3).to.deep.equal(fetchManyExpectedValues3);
    done();
  });

  it('Test fetch on closed rows with multiple statements', (done: any) => {
    const sQuery: string = 'select 123; select * from ' + sTableName + ' order by 1; select 123, \'abc\'';
    const fetchManyExpectedValues1: any[] = [[123]];
    const fetchManyExpectedValues2: any[] = [];
    const fetchManyExpectedValues3: any[] = [[1], [2], [3], [4], [5]];
    const fetchManyExpectedValues4: any[] = [];
    const fetchManyExpectedValues5: any[] = [[123, 'abc']];
    const fetchManyExpectedValues6: any[] = [];
    const fetchManyExpectedValues7: any[] = [];
    let fetchManyActualValues1: any[] = null;
    let fetchManyActualValues2: any[] = null;
    let fetchManyActualValues3: any[] = null;
    let fetchManyActualValues4: any[] = null;
    let fetchManyActualValues5: any[] = null;
    let fetchManyActualValues6: any[] = null;
    let fetchManyActualValues7: any[] = null;

    try {
      cursor.execute(sQuery);

      // Fetch the first result set
      fetchManyActualValues1 = cursor.fetchmany(2);

      // No more rows so it returns an empty list
      fetchManyActualValues2 = cursor.fetchmany(2);

      cursor.nextset();

      // Fetch the second result set
      fetchManyActualValues3 = cursor.fetchmany(10);

      // No more rows so it returns an empty list
      fetchManyActualValues4 = cursor.fetchmany(10);

      cursor.nextset();

      // Fetch the third result set
      fetchManyActualValues5 = cursor.fetchmany(3);

      // No more rows so it returns an empty list
      fetchManyActualValues6 = cursor.fetchmany(0);

      // No more rows so it returns an empty list
      fetchManyActualValues7 = cursor.fetchmany(1);

    } catch (error) {
      logger.errorLogMessage(error.message); // unexpected error
    }

    expect(fetchManyActualValues1).to.deep.equal(fetchManyExpectedValues1);
    expect(fetchManyActualValues2).to.deep.equal(fetchManyExpectedValues2);
    expect(fetchManyActualValues3).to.deep.equal(fetchManyExpectedValues3);
    expect(fetchManyActualValues4).to.deep.equal(fetchManyExpectedValues4);
    expect(fetchManyActualValues5).to.deep.equal(fetchManyExpectedValues5);
    expect(fetchManyActualValues6).to.deep.equal(fetchManyExpectedValues6);
    expect(fetchManyActualValues7).to.deep.equal(fetchManyExpectedValues7);
    done();
  });
});
