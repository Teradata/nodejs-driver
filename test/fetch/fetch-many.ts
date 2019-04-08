import 'mocha';
import { expect } from 'chai';
import { TeradataConnection } from '../../src/teradata-connection';
import { TeradataCursor } from '../../src/teradata-cursor';
import { TeradataLogging } from '../../src/teradata-logging';
import { connParams } from '../configurations';

let teradataConnection: TeradataConnection;
let cursor: TeradataCursor;
const logger: TeradataLogging = new TeradataLogging();

describe('\n\n\nFetch Many Tests', () => {
  before((done: any) => {
    try {
      logger.infoLogMessage('\n');
      teradataConnection = new TeradataConnection();
      teradataConnection.connect(connParams);
      cursor = teradataConnection.cursor();
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
    }
    done();
  });

  it('Test fetch many with Query No. 1', (done: any) => {

    let fetchOneActualValues1: any[] = null;
    let fetchOneActualValues2: any[] = null;
    let fetchOneActualValues3: any[] = null;
    let fetchOneActualValues4: any[] = null;
    const fetchOneExpectedValues1: any[] = [1];
    const fetchOneExpectedValues2: any[] = [2];
    const fetchOneExpectedValues3: any[] = [3];
    const fetchOneExpectedValues4: any[] = [14];

    let fetchManyActualValues1: any[] = null;
    let fetchManyActualValues2: any[] = null;
    const fetchManyExpectedValues1: any[] = [[4], [5], [6], [7], [8], [9], [10], [11], [12], [13]];
    const fetchManyExpectedValues2: any[] = [];

    let fetchAllActualValues1: any[] = null;
    const fetchAllExpectedValues1: any[] = [[15], [16], [17], [18], [19], [20]];

    try {
      cursor.execute('select row_number() over (order by calendar_date) as c1 from sys_calendar.calendar qualify c1 <= 20');
      fetchOneActualValues1 = cursor.fetchone();
      fetchOneActualValues2 = cursor.fetchone();
      fetchOneActualValues3 = cursor.fetchone();
      fetchManyActualValues1 = cursor.fetchmany(10);
      fetchOneActualValues4 = cursor.fetchone();
      fetchAllActualValues1 = cursor.fetchall();
      fetchManyActualValues2 = cursor.fetchmany(null);
    } catch (error) {
      logger.errorLogMessage(error.message); // unexpected error
    }

    expect(fetchOneActualValues1).deep.equal(fetchOneExpectedValues1);
    expect(fetchOneActualValues2).deep.equal(fetchOneExpectedValues2);
    expect(fetchOneActualValues3).deep.equal(fetchOneExpectedValues3);
    expect(fetchManyActualValues1).deep.equal(fetchManyExpectedValues1);
    expect(fetchOneActualValues4).deep.equal(fetchOneExpectedValues4);
    expect(fetchAllActualValues1).deep.equal(fetchAllExpectedValues1);
    expect(fetchManyActualValues2).deep.equal(fetchManyExpectedValues2);
    done();
  });

  it('Test fetch many with Query No. 2', (done: any) => {

    let fetchManyActualValues1: any[] = null;
    let fetchManyActualValues2: any[] = null;
    const fetchManyExpectedValues1: any[] = [];
    const fetchManyExpectedValues2: any[] = [];

    try {
      cursor.execute('select 1 where 1=2');
      fetchManyActualValues1 = cursor.fetchmany(null);
      fetchManyActualValues2 = cursor.fetchmany(null);
    } catch (error) {
      logger.errorLogMessage(error.message); // unexpected error
    }

    expect(fetchManyActualValues1).deep.equal(fetchManyExpectedValues1);
    expect(fetchManyActualValues2).deep.equal(fetchManyExpectedValues2);
    done();
  });

  it('Test fetch many with Query No. 3', (done: any) => {

    let fetchManyActualValues1: any[] = null;
    let fetchManyActualValues2: any[] = null;
    let fetchManyActualValues3: any[] = null;
    let fetchManyActualValues4: any[] = null;
    const fetchManyExpectedValues1: any[] = [[1]];
    const fetchManyExpectedValues2: any[] = [];
    const fetchManyExpectedValues3: any[] = [];
    const fetchManyExpectedValues4: any[] = [];

    try {
      cursor.execute('select 1');
      fetchManyActualValues1 = cursor.fetchmany(null);
      fetchManyActualValues2 = cursor.fetchmany(null);
      fetchManyActualValues3 = cursor.fetchmany(null);
      fetchManyActualValues4 = cursor.fetchmany(null);
    } catch (error) {
      logger.errorLogMessage(error.message); // unexpected error
    }

    expect(fetchManyActualValues1).deep.equal(fetchManyExpectedValues1);
    expect(fetchManyActualValues2).deep.equal(fetchManyExpectedValues2);
    expect(fetchManyActualValues3).deep.equal(fetchManyExpectedValues3);
    expect(fetchManyActualValues4).deep.equal(fetchManyExpectedValues4);
    done();
  });

  it('Test fetch many with Query No. 4', (done: any) => {

    let fetchManyActualValues1: any[] = null;
    let fetchManyActualValues2: any[] = null;
    let fetchManyActualValues3: any[] = null;
    const fetchManyExpectedValues1: any[] = [[1], [2], [3]];
    const fetchManyExpectedValues2: any[] = [];
    const fetchManyExpectedValues3: any[] = [];

    try {
      cursor.execute('select row_number() over (order by calendar_date) as c1 from sys_calendar.calendar qualify c1 <= 3');
      fetchManyActualValues1 = cursor.fetchmany(10);
      fetchManyActualValues2 = cursor.fetchmany(10);
      fetchManyActualValues3 = cursor.fetchmany(null);
    } catch (error) {
      logger.errorLogMessage(error.message); // unexpected error
    }

    expect(fetchManyActualValues1).deep.equal(fetchManyExpectedValues1);
    expect(fetchManyActualValues2).deep.equal(fetchManyExpectedValues2);
    expect(fetchManyActualValues3).deep.equal(fetchManyExpectedValues3);
    done();
  });
});
