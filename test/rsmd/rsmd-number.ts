import 'mocha';
import { expect } from 'chai';
import { TeradataConnection, ITDConnParams } from '../../src/teradata-connection';
import { TeradataCursor } from '../../src/teradata-cursor';
import { TeradataLogging } from '../../src/teradata-logging';
import { OperationalError } from '../../src/teradata-exceptions';
import { connParams } from '../configurations';

let teradataConnection1: TeradataConnection;
let cursor1: TeradataCursor;
let teradataConnection2: TeradataConnection;
let cursor2: TeradataCursor;

const connParams1: ITDConnParams = Object.assign({}, connParams);
connParams1.teradata_values = 'true';
const connParams2: ITDConnParams = Object.assign({}, connParams);
connParams2.teradata_values = 'false';

const logger: TeradataLogging = new TeradataLogging();
const sTableName: string = 'T1';

describe('\n\n\nMetadata Tests for Teradata \'number\' data types', () => {
  before((done: any) => {
    try {
      logger.infoLogMessage('\n');

      teradataConnection1 = new TeradataConnection();
      teradataConnection1.connect(connParams1);
      cursor1 = teradataConnection1.cursor();

      teradataConnection2 = new TeradataConnection();
      teradataConnection2.connect(connParams2);
      cursor2 = teradataConnection2.cursor();

      try {
        const dQuery: string = 'DROP TABLE T1';
        cursor1.execute(dQuery);
      } catch (error) {
        if ((error instanceof OperationalError) &&
          (error.message.indexOf('Object \'T1\' does not exist') > 0)) {
            // ignorble error
        } else {
          logger.errorLogMessage(error.message); // unexpected error
        }
      }

      const cQuery: string = 'create table ' + sTableName
        + ' (c1 number, c2 number(*), c3 number(*,7), c4 number(10), c5 number(20,5))';
      cursor1.execute(cQuery);

    } catch (error) {
      logger.errorLogMessage(error.message); // unexpected error
    } finally {
      done();
    }
  });

  after((done: any) => {
    try {
      cursor2.close();
      cursor1.close();
      teradataConnection2.close();
      teradataConnection1.close();
    } catch (error) {
      logger.errorLogMessage(error.message); // unexpected error
    } finally {
      done();
    }
  });

  it('Retrieve metadata for \'Select * \'', (done: any) => {
    const aaoExpectedDescription1: any[] =
      [ [ 'c1', 'number', null, '18', '40', '0', true ],
        [ 'c2', 'number', null, '18', '40', '0', true ],
        [ 'c3', 'number', null, '18', '40', '7', true ],
        [ 'c4', 'number', null, '18', '10', '0', true ],
        [ 'c5', 'number', null, '18', '20', '5', true ] ];
    const aaoExpectedDescription2: any[] =
      [ [ 'c1', 'string', null, '18', '40', '0', true ],
        [ 'c2', 'string', null, '18', '40', '0', true ],
        [ 'c3', 'string', null, '18', '40', '7', true ],
        [ 'c4', 'string', null, '18', '10', '0', true ],
        [ 'c5', 'string', null, '18', '20', '5', true ] ];
    try {
      const sQuery: string = 'SELECT * FROM ' + sTableName;
      cursor1.execute(sQuery);
      cursor2.execute(sQuery);
    } catch (error) {
      logger.errorLogMessage(error.message); // unexpected error
    } finally {
      expect(cursor1.description).to.deep.equal(aaoExpectedDescription1);
      expect(cursor2.description).to.deep.equal(aaoExpectedDescription2);
      done();
    }
  });
});
