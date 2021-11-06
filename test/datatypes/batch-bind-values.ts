import 'mocha';
import { expect } from 'chai';
import { TeradataConnection, ITDConnParams } from '../../src/teradata-connection';
import { TeradataCursor } from '../../src/teradata-cursor';
import { TeradataLogging } from '../../src/teradata-logging';
import { connParams } from '../configurations';

let teradataConnection: TeradataConnection;
let cursor: TeradataCursor;

const testConnParams: ITDConnParams = Object.assign({}, connParams);
const logger: TeradataLogging = new TeradataLogging();
const sTableName: string = 'volatiletable'; // volatile table doesn't need scope

describe('\n\n\nBatch Bind Tests', () => {
  before((done: any) => {
    try {
      logger.infoLogMessage('\n');
      teradataConnection = new TeradataConnection();
      testConnParams.teradata_values = 'false';
      teradataConnection.connect(testConnParams);
      cursor = teradataConnection.cursor();
      const cQuery: string = 'create volatile table ' + sTableName +
        ' (  c1 integer not null ' +
        ' ,  c2 byteint ' +
        ' ,  c3 smallint ' +
        ' ,  c4 integer ' +
        ' ,  c5 bigint ' +
        ' ,  c6 float ' +
        ' ,  c7 varchar(10) ' +
        ' ,  c8 char(8) ' +
        ' ,  c9 varbyte(10) ' +
        ' , c10 byte(5) ' +
        ' , c11 decimal(2) ' +
        ' , c12 decimal(2,1) ' +
        ' , c13 decimal(4) ' +
        ' , c14 decimal(4,2) ' +
        ' , c15 decimal(9) ' +
        ' , c16 decimal(9,3) ' +
        ' , c17 decimal(18) ' +
        ' , c18 decimal(18,4) ' +
        ' , c19 decimal(38) ' +
        ' , c20 decimal(38,5) ' +
        ' , c21 number ' +
        ' , c22 date ' +
        ' , c23 date ' +
        ' , c24 time(0) ' +
        ' , c25 time ' +
        ' , c26 time(0) with time zone ' +
        ' , c27 time with time zone ' +
        ' , c28 timestamp(0) ' +
        ' , c29 timestamp ' +
        ' , c30 timestamp(0) with time zone ' +
        ' , c31 timestamp with time zone ' +
        ' , c32 interval year ' +
        ' , c33 interval year(4) ' +
        ' , c34 interval year to month ' +
        ' , c35 interval year(4) to month ' +
        ' , c36 interval month ' +
        ' , c37 interval month(4) ' +
        ' , c38 interval day ' +
        ' , c39 interval day(4) ' +
        ' , c40 interval day to hour ' +
        ' , c41 interval day(4) to hour ' +
        ' , c42 interval day to minute ' +
        ' , c43 interval day(4) to minute ' +
        ' , c44 interval day to second(0) ' +
        ' , c45 interval day to second ' +
        ' , c46 interval day(4) to second(0) ' +
        ' , c47 interval day(4) to second ' +
        ' , c48 interval hour ' +
        ' , c49 interval hour(4) ' +
        ' , c50 interval hour to minute ' +
        ' , c51 interval hour(4) to minute ' +
        ' , c52 interval hour to second(0) ' +
        ' , c53 interval hour to second ' +
        ' , c54 interval hour(4) to second(0) ' +
        ' , c55 interval hour(4) to second ' +
        ' , c56 interval minute ' +
        ' , c57 interval minute(4) ' +
        ' , c58 interval minute to second(0) ' +
        ' , c59 interval minute to second ' +
        ' , c60 interval minute(4) to second(0) ' +
        ' , c61 interval minute(4) to second ' +
        ' , c62 interval second(2,0) ' +
        ' , c63 interval second ' +
        ' , c64 interval second(4,0) ' +
        ' , c65 interval second(4) ' +
        ' , c66 period(date) ' +
        ' , c67 period(time(0)) ' +
        ' , c68 period(time) ' +
        ' , c69 period(time(0) with time zone) ' +
        ' , c70 period(time with time zone) ' +
        ' , c71 period(timestamp(0)) ' +
        ' , c72 period(timestamp) ' +
        ' , c73 period(timestamp(0) with time zone) ' +
        ' , c74 period(timestamp with time zone) ' +
        ' ) on commit preserve rows';
      cursor.execute(cQuery);
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

  it('Inserts bind values and then selects for same values', (done: any) => {

    const iQuery: string = 'insert into ' + sTableName + ' values ( ' +
      ' ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ' +
      ' ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ' +
      ' ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ' +
      ' ?, ?, ?, ?, ?, ?, ?, ?, ?, ?,' +
      ' ?, ?, ?, ?, ?, ?, ?, ?, ?, ?,' +
      ' ?, ?, ?, ?, ?, ?, ?, ?, ?, ?,' +
      ' ?, ?, ?, ?, ?, ?, ?, ?, ?, ?,' +
      ' ?, ?, ?, ?)';

    const values: any[] =
    [
      [
        1,                                      //  c1 integer
        null,                                   //  c2 byteint
        null,                                   //  c3 smallint
        null,                                   //  c4 integer
        null,                                   //  c5 bigint
        null,                                   //  c6 float
        null,                                   //  c7 varchar(10)
        null,                                   //  c8 char(8)
        null,                                   //  c9 varbyte(10)
        null,                                   // c10 byte(5)
        null,                                   // c11 decimal(2)
        null,                                   // c12 decimal (2,1)
        null,                                   // c13 decimal (4)
        null,                                   // c14 decimal (4,2)
        null,                                   // c15 decimal (9)
        null,                                   // c16 decimal (9,4)
        null,                                   // c17 decimal (18)
        null,                                   // c18 decimal (18,4)
        null,                                   // c19 decimal (38)
        null,                                   // c20 decimal (38,5)
        null,                                   // c21 number
        null,                                   // c22 date
        null,                                   // c23 date
        null,                                   // c24 time
        null,                                   // c25 time
        null,                                   // c26 time(0) with time zone
        null,                                   // c27 time with time zone
        null,                                   // c28 timestamp(0)
        null,                                   // c29 timestamp
        null,                                   // c30 timestamp(0) with time zone
        null,                                   // c31 timestamp with time zone
        null,                                   // c32 interval year
        null,                                   // c33 interval year(4)
        null,                                   // c34 interval year to month
        null,                                   // c35 interval year(4) to month
        null,                                   // c36 interval month
        null,                                   // c37 interval month(4)
        null,                                   // c38 interval day
        null,                                   // c39 interval day(4)
        null,                                   // c40 interval day to hour
        null,                                   // c41 interval day(4) to hour
        null,                                   // c42 interval day to minute
        null,                                   // c43 interval day(4) to minute
        null,                                   // c44 interval day to second(0)
        null,                                   // c45 interval day to second
        null,                                   // c46 interval day(4) to second(0)
        null,                                   // c47 interval day(4) to second
        null,                                   // c48 interval hour
        null,                                   // c49 interval hour(4)
        null,                                   // c50 interval hour to minute
        null,                                   // c51 interval hour(4) to minute
        null,                                   // c52 interval hour to second(0)
        null,                                   // c53 interval hour to second
        null,                                   // c54 interval hour(4) to second(0)
        null,                                   // c55 interval hour(4) to second
        null,                                   // c56 interval minute
        null,                                   // c57 interval minute(4)
        null,                                   // c58 interval minute to second(0)
        null,                                   // c59 interval minute to second
        null,                                   // c60 interval minute(4) to second(0)
        null,                                   // c61 interval minute(4) to second
        null,                                   // c62 interval second(2,0)
        null,                                   // c63 interval second
        null,                                   // c64 interval second(4,0)
        null,                                   // c65 interval second(4)
        null,                                   // c66 period(date)
        null,                                   // c67 period(time(0))
        null,                                   // c68 period(time)
        null,                                   // c69 period(time(0) with time zone)
        null,                                   // c70 period(time with time zone)
        null,                                   // c71 period(timestamp(0))
        null,                                   // c72 period(timestamp)
        null,                                   // c73 period(timestamp(0) with time zone)
        null,                                   // c74 period(timestamp with time zone)
      ],
      [
        2,                                      //  c1 integer
        null,                                   //  c2 byteint
        null,                                   //  c3 smallint
        null,                                   //  c4 integer
        null,                                   //  c5 bigint
        null,                                   //  c6 float
        null,                                   //  c7 varchar(10)
        null,                                   //  c8 char(8)
        null,                                   //  c9 varbyte(10)
        null,                                   // c10 byte(5)
        null,                                   // c11 decimal(2)
        null,                                   // c12 decimal (2,1)
        null,                                   // c13 decimal (4)
        null,                                   // c14 decimal (4,2)
        null,                                   // c15 decimal (9)
        null,                                   // c16 decimal (9,4)
        null,                                   // c17 decimal (18)
        null,                                   // c18 decimal (18,4)
        null,                                   // c19 decimal (38)
        null,                                   // c20 decimal (38,5)
        null,                                   // c21 number
        null,                                   // c22 date
        null,                                   // c23 date
        null,                                   // c24 time
        null,                                   // c25 time
        null,                                   // c26 time(0) with time zone
        null,                                   // c27 time with time zone
        null,                                   // c28 timestamp(0)
        null,                                   // c29 timestamp
        null,                                   // c30 timestamp(0) with time zone
        null,                                   // c31 timestamp with time zone
        null,                                   // c32 interval year
        null,                                   // c33 interval year(4)
        null,                                   // c34 interval year to month
        null,                                   // c35 interval year(4) to month
        null,                                   // c36 interval month
        null,                                   // c37 interval month(4)
        null,                                   // c38 interval day
        null,                                   // c39 interval day(4)
        null,                                   // c40 interval day to hour
        null,                                   // c41 interval day(4) to hour
        null,                                   // c42 interval day to minute
        null,                                   // c43 interval day(4) to minute
        null,                                   // c44 interval day to second(0)
        null,                                   // c45 interval day to second
        null,                                   // c46 interval day(4) to second(0)
        null,                                   // c47 interval day(4) to second
        null,                                   // c48 interval hour
        null,                                   // c49 interval hour(4)
        null,                                   // c50 interval hour to minute
        null,                                   // c51 interval hour(4) to minute
        null,                                   // c52 interval hour to second(0)
        null,                                   // c53 interval hour to second
        null,                                   // c54 interval hour(4) to second(0)
        null,                                   // c55 interval hour(4) to second
        null,                                   // c56 interval minute
        null,                                   // c57 interval minute(4)
        null,                                   // c58 interval minute to second(0)
        null,                                   // c59 interval minute to second
        null,                                   // c60 interval minute(4) to second(0)
        null,                                   // c61 interval minute(4) to second
        null,                                   // c62 interval second(2,0)
        null,                                   // c63 interval second
        null,                                   // c64 interval second(4,0)
        null,                                   // c65 interval second(4)
        null,                                   // c66 period(date)
        null,                                   // c67 period(time(0))
        null,                                   // c68 period(time)
        null,                                   // c69 period(time(0) with time zone)
        null,                                   // c70 period(time with time zone)
        null,                                   // c71 period(timestamp(0))
        null,                                   // c72 period(timestamp)
        null,                                   // c73 period(timestamp(0) with time zone)
        null,                                   // c74 period(timestamp with time zone)
      ],
      [
        3,                                      //  c1 integer
        null,                                   //  c2 byteint
        null,                                   //  c3 smallint
        null,                                   //  c4 integer
        null,                                   //  c5 bigint
        null,                                   //  c6 float
        null,                                   //  c7 varchar(10)
        null,                                   //  c8 char(8)
        null,                                   //  c9 varbyte(10)
        null,                                   // c10 byte(5)
        null,                                   // c11 decimal(2)
        null,                                   // c12 decimal (2,1)
        null,                                   // c13 decimal (4)
        null,                                   // c14 decimal (4,2)
        null,                                   // c15 decimal (9)
        null,                                   // c16 decimal (9,4)
        null,                                   // c17 decimal (18)
        null,                                   // c18 decimal (18,4)
        null,                                   // c19 decimal (38)
        null,                                   // c20 decimal (38,5)
        null,                                   // c21 number
        null,                                   // c22 date
        null,                                   // c23 date
        null,                                   // c24 time
        null,                                   // c25 time
        null,                                   // c26 time(0) with time zone
        null,                                   // c27 time with time zone
        null,                                   // c28 timestamp(0)
        null,                                   // c29 timestamp
        null,                                   // c30 timestamp(0) with time zone
        null,                                   // c31 timestamp with time zone
        null,                                   // c32 interval year
        null,                                   // c33 interval year(4)
        null,                                   // c34 interval year to month
        null,                                   // c35 interval year(4) to month
        null,                                   // c36 interval month
        null,                                   // c37 interval month(4)
        null,                                   // c38 interval day
        null,                                   // c39 interval day(4)
        null,                                   // c40 interval day to hour
        null,                                   // c41 interval day(4) to hour
        null,                                   // c42 interval day to minute
        null,                                   // c43 interval day(4) to minute
        null,                                   // c44 interval day to second(0)
        null,                                   // c45 interval day to second
        null,                                   // c46 interval day(4) to second(0)
        null,                                   // c47 interval day(4) to second
        null,                                   // c48 interval hour
        null,                                   // c49 interval hour(4)
        null,                                   // c50 interval hour to minute
        null,                                   // c51 interval hour(4) to minute
        null,                                   // c52 interval hour to second(0)
        null,                                   // c53 interval hour to second
        null,                                   // c54 interval hour(4) to second(0)
        null,                                   // c55 interval hour(4) to second
        null,                                   // c56 interval minute
        null,                                   // c57 interval minute(4)
        null,                                   // c58 interval minute to second(0)
        null,                                   // c59 interval minute to second
        null,                                   // c60 interval minute(4) to second(0)
        null,                                   // c61 interval minute(4) to second
        null,                                   // c62 interval second(2,0)
        null,                                   // c63 interval second
        null,                                   // c64 interval second(4,0)
        null,                                   // c65 interval second(4)
        null,                                   // c66 period(date)
        null,                                   // c67 period(time(0))
        null,                                   // c68 period(time)
        null,                                   // c69 period(time(0) with time zone)
        null,                                   // c70 period(time with time zone)
        null,                                   // c71 period(timestamp(0))
        null,                                   // c72 period(timestamp)
        null,                                   // c73 period(timestamp(0) with time zone)
        null,                                    // c74 period(timestamp with time zone)
      ],
      [
        4,                                                                          //  c1 integer
        1,                                                                          //  c2 byteint
        3,                                                                          //  c3 smallint
        16,                                                                         //  c4 integer
        101,                                                                        //  c5 bigint
        123.456,                                                                    //  c6 float
        'Row #4',                                                                   //  c7 varchar(10)
        'Row4',                                                                     //  c8 char(8)
        new Uint8Array([0x01, 0x02, 0x03]),                                         //  c9 varbyte(10)
        new Uint8Array([0x04, 0x05, 0x06, 0x07]),                                   // c10 byte(5)
        1.0,                                                                        // c11 decimal(2)
        2.0,                                                                        // c12 decimal (2,1)
        34.0,                                                                       // c13 decimal (4)
        57.0,                                                                       // c14 decimal (4,2)
        890.0,                                                                      // c15 decimal (9)
        1234.0,                                                                     // c16 decimal (9,3)
        6789012345678.0,                                                            // c17 decimal (18)
        901234.56,                                                                  // c18 decimal (18,4)
        78901234567890.0,                                                           // c19 decimal (38)
        -.100,                                                                      // c20 decimal (38,5)
        1.2,                                                                        // c21 number
        '2017-12-25',                                                               // c22 date
        '1999-12-31',                                                               // c23 date
        '11:22:33',                                                                 // c24 time(0)
        '11:22:33.12',                                                              // c25 time
        '11:22:33+04:30',                                                           // c26 time(0) with time zone
        '11:22:33.1+05:00',                                                         // c27 time with time zone
        '1970-01-02 03:04:05',                                                      // c28 timestamp(0)
        '1970-01-02 03:04:05.6',                                                    // c29 timestamp
        '1970-01-02 03:04:05+06:30',                                                // c30 timestamp(0) with time zone
        '1970-01-02 03:04:05.56+06:30',                                             // c31 timestamp with time zone
        '-12',                                                                      // c32 interval year
        '-1234',                                                                    // c33 interval year(4)
        '-12-10',                                                                   // c34 interval year to month
        '-1234-10',                                                                 // c35 interval year(4) to month
        '-12',                                                                      // c36 interval month
        '-1234',                                                                    // c37 interval month(4)
        '-1',                                                                       // c38 interval day
        '-1234',                                                                    // c39 interval day(4)
        '-12 11',                                                                   // c40 interval day to hour
        '-1234 11',                                                                 // c41 interval day(4) to hour
        '-12 11:22',                                                                // c42 interval day to minute
        '-1234 11:22',                                                              // c43 interval day(4) to minute
        '-12 11:22:33',                                                             // c44 interval day to second(0)
        '-12 11:22:33.12',                                                          // c45 interval day to second
        '-1234 11:22:33',                                                           // c46 interval day(4) to second(0)
        '-1234 11:22:33.124',                                                       // c47 interval day(4) to second
        '-12',                                                                      // c48 interval hour
        '-1234',                                                                    // c49 interval hour(4)
        '-12:22',                                                                   // c50 interval hour to minute
        '-1234:22',                                                                 // c51 interval hour(4) to minute
        '-12:22:33',                                                                // c52 interval hour to second(0)
        '-12:22:33.1456',                                                           // c53 interval hour to second
        '-1234:22:33',                                                              // c54 interval hour(4) to second(0)
        '-1234:22:33.1456',                                                         // c55 interval hour(4) to second
        '-12',                                                                      // c56 interval minute
        '-1234',                                                                    // c57 interval minute(4)
        '-12:33',                                                                   // c58 interval minute to second(0)
        '-12:33.4',                                                                 // c59 interval minute to second
        '-1234:33',                                                                 // c60 interval minute(4) to second(0)
        '-1234:33.1',                                                               // c61 interval minute(4) to second
        '-12',                                                                      // c62 interval second(2,0)
        '-12.123456',                                                               // c63 interval second
        '-1234',                                                                    // c64 interval second(4,0)
        '-1234.123456',                                                             // c65 interval second(4)
        '(\'1970-01-02\', \'1973-04-05\')',                                             // c66 period(date)
        '(\'21:22:33\', \'22:33:44\')',                                                 // c67 period(time(0))
        '(\'21:22:33.123456\', \'22:33:44.123456\')',                                   // c68 period(time)
        '(\'11:22:33+05:30\', \'22:33:44+05:30\')',                                     // c69 period(time(0) with time zone)
        '(\'11:22:33.123456+05:30\', \'22:33:44.123456+05:30\')',                       // c70 period(time with time zone)
        '(\'1970-01-02 03:04:05\', \'1976-07-08 09:10:11\')',                           // c71 period(timestamp(0))
        '(\'1970-01-02 03:04:05.01\', \'1976-07-08 09:10:11.123\')',                    // c72 period(timestamp)
        '(\'1970-01-02 03:04:05+05:30\', \'1976-07-08 09:10:11+05:30\')',               // c73 period(timestamp(0) with time zone)
        '(\'1970-01-02 03:04:05.123456+05:30\', \'1976-07-08 09:10:11.123456+05:30\')', // c74 period(timestamp with time zone)
      ],
      [
        5,                                                                          //  c1 integer
        123,                                                                        //  c2 byteint
        12345,                                                                      //  c3 smallint
        123456,                                                                     //  c4 integer
        12345678901,                                                                //  c5 bigint
        123.456,                                                                    //  c6 float
        'Row 5',                                                                    //  c7 varchar(10)
        'Row5----',                                                                 //  c8 char(8)
        new Uint8Array([0x08, 0x09, 0x10, 0x11]),                                   //  c9 varbyte(10)
        new Uint8Array([0x12, 0x13, 0x14, 0x15, 0x16]),                             // c10 byte(5)
        12.0,                                                                       // c11 decimal(2)
        1.2,                                                                        // c12 decimal (2,1)
        1234.0,                                                                     // c13 decimal (4)
        12.34,                                                                      // c14 decimal (4,2)
        123456789.0,                                                                // c15 decimal (9)
        123456.789,                                                                 // c16 decimal (9,3)
        123456789012345678.0,                                                       // c17 decimal (18)
        12345678901234.5678,                                                        // c18 decimal (18,4)
        6789012345678.0,                                                            // c19 decimal (38)
        67890123.45678,                                                             // c20 decimal (38,5)
        123.45,                                                                     // c21 number
        '2050-12-25',                                                               // c22 date
        '1950-12-31',                                                               // c23 date
        '11:22:50',                                                                 // c24 time(0)
        '11:22:33.05',                                                              // c25 time
        '11:22:33+04:30',                                                           // c26 time(0) with time zone
        '11:22:33.1+05:00',                                                         // c27 time with time zone
        '1970-01-02 03:04:05',                                                      // c28 timestamp(0)
        '1970-01-02 03:04:05.6',                                                    // c29 timestamp
        '1970-01-02 03:04:05+06:30',                                                // c30 timestamp(0) with time zone
        '1970-01-02 03:04:05.56+06:30',                                             // c31 timestamp with time zone
        '-12',                                                                      // c32 interval year
        '-1234',                                                                    // c33 interval year(4)
        '-12-10',                                                                   // c34 interval year to month
        '-1234-10',                                                                 // c35 interval year(4) to month
        '-12',                                                                      // c36 interval month
        '-1234',                                                                    // c37 interval month(4)
        '-1',                                                                       // c38 interval day
        '-1234',                                                                    // c39 interval day(4)
        '-12 11',                                                                   // c40 interval day to hour
        '-1234 11',                                                                 // c41 interval day(4) to hour
        '-12 11:22',                                                                // c42 interval day to minute
        '-1234 11:22',                                                              // c43 interval day(4) to minute
        '-12 11:22:33',                                                             // c44 interval day to second(0)
        '-12 11:22:33.12',                                                          // c45 interval day to second
        '-1234 11:22:33',                                                           // c46 interval day(4) to second(0)
        '-1234 11:22:33.124',                                                       // c47 interval day(4) to second
        '-12',                                                                      // c48 interval hour
        '-1234',                                                                    // c49 interval hour(4)
        '-12:22',                                                                   // c50 interval hour to minute
        '-1234:22',                                                                 // c51 interval hour(4) to minute
        '-12:22:33',                                                                // c52 interval hour to second(0)
        '-12:22:33.1456',                                                           // c53 interval hour to second
        '-1234:22:33',                                                              // c54 interval hour(4) to second(0)
        '-1234:22:33.1456',                                                         // c55 interval hour(4) to second
        '-12',                                                                      // c56 interval minute
        '-1234',                                                                    // c57 interval minute(4)
        '-12:33',                                                                   // c58 interval minute to second(0)
        '-12:33.4',                                                                 // c59 interval minute to second
        '-1234:33',                                                                 // c60 interval minute(4) to second(0)
        '-1234:33.1',                                                               // c61 interval minute(4) to second
        '-12',                                                                      // c62 interval second(2,0)
        '-12.123456',                                                               // c63 interval second
        '-1234',                                                                    // c64 interval second(4,0)
        '-1234.123456',                                                             // c65 interval second(4)
        '(\'1970-01-02\', \'1973-04-05\')',                                             // c66 period(date)
        '(\'21:22:33\', \'22:33:44\')',                                                 // c67 period(time(0))
        '(\'21:22:33.123456\', \'22:33:44.123456\')',                                   // c68 period(time)
        '(\'11:22:33+05:30\', \'22:33:44+05:30\')',                                     // c69 period(time(0) with time zone)
        '(\'11:22:33.123456+05:30\', \'22:33:44.123456+05:30\')',                       // c70 period(time with time zone)
        '(\'1970-01-02 03:04:05\', \'1976-07-08 09:10:11\')',                           // c71 period(timestamp(0))
        '(\'1970-01-02 03:04:05.01\', \'1976-07-08 09:10:11.123\')',                    // c72 period(timestamp)
        '(\'1970-01-02 03:04:05+05:30\', \'1976-07-08 09:10:11+05:30\')',               // c73 period(timestamp(0) with time zone)
        '(\'1970-01-02 03:04:05.123456+05:30\', \'1976-07-08 09:10:11.123456+05:30\')', // c74 period(timestamp with time zone)
    ],
    [
        6,                                                                          //  c1 integer
        null,                                                                       //  c2 byteint
        null,                                                                       //  c3 smallint
        null,                                                                       //  c4 integer
        null,                                                                       //  c5 bigint
        null,                                                                       //  c6 float
        null,                                                                       //  c7 varchar(10)
        null,                                                                       //  c8 char(8)
        null,                                                                       //  c9 varbyte(10)
        null,                                                                       // c10 byte(5)
        null,                                                                       // c11 decimal(2)
        null,                                                                       // c12 decimal (2,1)
        null,                                                                       // c13 decimal (4)
        null,                                                                       // c14 decimal (4,2)
        null,                                                                       // c15 decimal (9)
        null,                                                                       // c16 decimal (9,4)
        null,                                                                       // c17 decimal (18)
        null,                                                                       // c18 decimal (18,4)
        null,                                                                       // c19 decimal (38)
        null,                                                                       // c20 decimal (38,5)
        null,                                                                       // c21 number
        null,                                                                       // c22 date
        null,                                                                       // c23 date
        null,                                                                       // c24 time
        null,                                                                       // c25 time
        null,                                                                       // c26 time(0) with time zone
        null,                                                                       // c27 time with time zone
        null,                                                                       // c28 timestamp(0)
        null,                                                                       // c29 timestamp
        null,                                                                       // c30 timestamp(0) with time zone
        null,                                                                       // c31 timestamp with time zone
        null,                                                                       // c32 interval year
        null,                                                                       // c33 interval year(4)
        null,                                                                       // c34 interval year to month
        null,                                                                       // c35 interval year(4) to month
        null,                                                                       // c36 interval month
        null,                                                                       // c37 interval month(4)
        null,                                                                       // c38 interval day
        null,                                                                       // c39 interval day(4)
        null,                                                                       // c40 interval day to hour
        null,                                                                       // c41 interval day(4) to hour
        null,                                                                       // c42 interval day to minute
        null,                                                                       // c43 interval day(4) to minute
        null,                                                                       // c44 interval day to second(0)
        null,                                                                       // c45 interval day to second
        null,                                                                       // c46 interval day(4) to second(0)
        null,                                                                       // c47 interval day(4) to second
        null,                                                                       // c48 interval hour
        null,                                                                       // c49 interval hour(4)
        null,                                                                       // c50 interval hour to minute
        null,                                                                       // c51 interval hour(4) to minute
        null,                                                                       // c52 interval hour to second(0)
        null,                                                                       // c53 interval hour to second
        null,                                                                       // c54 interval hour(4) to second(0)
        null,                                                                       // c55 interval hour(4) to second
        null,                                                                       // c56 interval minute
        null,                                                                       // c57 interval minute(4)
        null,                                                                       // c58 interval minute to second(0)
        null,                                                                       // c59 interval minute to second
        null,                                                                       // c60 interval minute(4) to second(0)
        null,                                                                       // c61 interval minute(4) to second
        null,                                                                       // c62 interval second(2,0)
        null,                                                                       // c63 interval second
        null,                                                                       // c64 interval second(4,0)
        null,                                                                       // c65 interval second(4)
        null,                                                                       // c66 period(date)
        null,                                                                       // c67 period(time(0))
        null,                                                                       // c68 period(time)
        null,                                                                       // c69 period(time(0) with time zone)
        null,                                                                       // c70 period(time with time zone)
        null,                                                                       // c71 period(timestamp(0))
        null,                                                                       // c72 period(timestamp)
        null,                                                                       // c73 period(timestamp(0) with time zone)
        null,                                                                       // c74 period(timestamp with time zone)
    ],
    [
        7,                                                                          //  c1 integer
        56,                                                                         //  c2 byteint
        8901,                                                                       //  c3 smallint
        234567,                                                                     //  c4 integer
        8901234567,                                                                 //  c5 bigint
        1245667.45678901,                                                           //  c6 float
        'Row is a 7',                                                               //  c7 varchar(10)
        'Row7---',                                                                  //  c8 char(8)
        new Uint8Array([0x07, 0x08]),                                               //  c9 varbyte(10)
        new Uint8Array([0x19]),                                                     // c10 byte(5)
        1.0,                                                                        // c11 decimal(2)
        2.0,                                                                        // c12 decimal (2,1)
        12.0,                                                                       // c13 decimal (4)
        4.0,                                                                        // c14 decimal (4,2)
        9.0,                                                                        // c15 decimal (9)
        123456.79,                                                                  // c16 decimal (9,3)
        1234567890123678.0,                                                         // c17 decimal (18)
        12345671234.567,                                                            // c18 decimal (18,4)
        1234567890129012.0,                                                         // c19 decimal (38)
        1234567890.45678,                                                           // c20 decimal (38,5)
        123.45,                                                                     // c21 number
        '2077-12-07',                                                               // c22 date
        '1977-07-01',                                                               // c23 date
        '11:22:07',                                                                 // c24 time(0)
        '11:22:33.12',                                                              // c25 time
        '11:22:33+04:30',                                                           // c26 time(0) with time zone
        '11:22:33.1+05:00',                                                         // c27 time with time zone
        '1977-01-02 03:04:05',                                                      // c28 timestamp(0)
        '1977-01-02 03:04:05.6',                                                    // c29 timestamp
        '1977-01-02 03:04:05+06:30',                                                // c30 timestamp(0) with time zone
        '1977-01-02 03:04:05.56+06:30',                                             // c31 timestamp with time zone
        '-12',                                                                      // c32 interval year
        '-1234',                                                                    // c33 interval year(4)
        '-12-10',                                                                   // c34 interval year to month
        '-1234-10',                                                                 // c35 interval year(4) to month
        '-12',                                                                      // c36 interval month
        '-1234',                                                                    // c37 interval month(4)
        '-1',                                                                       // c38 interval day
        '-1234',                                                                    // c39 interval day(4)
        '-12 11',                                                                   // c40 interval day to hour
        '-1234 11',                                                                 // c41 interval day(4) to hour
        '-12 11:22',                                                                // c42 interval day to minute
        '-1234 11:22',                                                              // c43 interval day(4) to minute
        '-12 11:22:33',                                                             // c44 interval day to second(0)
        '-12 11:22:33.12',                                                          // c45 interval day to second
        '-1234 11:22:33',                                                           // c46 interval day(4) to second(0)
        '-1234 11:22:33.124',                                                       // c47 interval day(4) to second
        '-12',                                                                      // c48 interval hour
        '-1234',                                                                    // c49 interval hour(4)
        '-12:22',                                                                   // c50 interval hour to minute
        '-1234:22',                                                                 // c51 interval hour(4) to minute
        '-12:22:33',                                                                // c52 interval hour to second(0)
        '-12:22:33.1456',                                                           // c53 interval hour to second
        '-1234:22:33',                                                              // c54 interval hour(4) to second(0)
        '-1234:22:33.1456',                                                         // c55 interval hour(4) to second
        '-12',                                                                      // c56 interval minute
        '-1234',                                                                    // c57 interval minute(4)
        '-12:33',                                                                   // c58 interval minute to second(0)
        '-12:33.4',                                                                 // c59 interval minute to second
        '-1234:33',                                                                 // c60 interval minute(4) to second(0)
        '-1234:33.1',                                                               // c61 interval minute(4) to second
        '-12',                                                                      // c62 interval second(2,0)
        '-12.123456',                                                               // c63 interval second
        '-1234',                                                                    // c64 interval second(4,0)
        '-1234.123456',                                                             // c65 interval second(4)
        '(\'1970-01-02\', \'1973-04-05\')',                                             // c66 period(date)
        '(\'21:22:33\', \'22:33:44\')',                                                 // c67 period(time(0))
        '(\'21:22:33.123456\', \'22:33:44.123456\')',                                   // c68 period(time)
        '(\'11:22:33+05:30\', \'22:33:44+05:30\')',                                     // c69 period(time(0) with time zone)
        '(\'11:22:33.123456+05:30\', \'22:33:44.123456+05:30\')',                       // c70 period(time with time zone)
        '(\'1970-01-02 03:04:05\', \'1976-07-08 09:10:11\')',                           // c71 period(timestamp(0))
        '(\'1970-01-02 03:04:05.01\', \'1976-07-08 09:10:11.123\')',                    // c72 period(timestamp)
        '(\'1970-01-02 03:04:05+05:30\', \'1976-07-08 09:10:11+05:30\')',               // c73 period(timestamp(0) with time zone)
        '(\'1970-01-02 03:04:05.123456+05:30\', \'1976-07-08 09:10:11.123456+05:30\')', // c74 period(timestamp with time zone)
    ],
    [
        8,                                                                          //  c1 integer
        1,                                                                          //  c2 byteint
        2,                                                                          //  c3 smallint
        3,                                                                          //  c4 integer
        4,                                                                          //  c5 bigint
        8.0,                                                                        //  c6 float
        '88888888',                                                                 //  c7 varchar(10)
        'Row8',                                                                     //  c8 char(8)
        new Uint8Array([0x01]),                                                     //  c9 varbyte(10)
        new Uint8Array([0x04, 0x05]),                                               // c10 byte(5)
        1.0,                                                                        // c11 decimal(2)
        1.0,                                                                        // c12 decimal (2,1)
        12.0,                                                                       // c13 decimal (4)
        12.0,                                                                       // c14 decimal (4,2)
        123456.0,                                                                   // c15 decimal (9)
        123.4,                                                                      // c16 decimal (9,4)
        123456789012.0,                                                             // c17 decimal (18)
        12345678.56,                                                                // c18 decimal (18,4)
        3456822757661086.0,                                                         // c19 decimal (38)
        12345678901.456,                                                            // c20 decimal (38,5)
        1.2,                                                                        // c21 number
        '2017-12-25',                                                               // c22 date
        '1999-12-31',                                                               // c23 date
        '11:22:33',                                                                 // c24 time(0)
        '11:22:33.12',                                                              // c25 time
        '11:22:33+04:30',                                                           // c26 time(0) with time zone
        '11:22:33.1+05:00',                                                         // c27 time with time zone
        '1970-01-02 03:04:05',                                                      // c28 timestamp(0)
        '1970-01-02 03:04:05.6',                                                    // c29 timestamp
        '1970-01-02 03:04:05+06:30',                                                // c30 timestamp(0) with time zone
        '1970-01-02 03:04:05.56+06:30',                                             // c31 timestamp with time zone
        ' 12',                                                                      // c32 interval year
        ' 1234',                                                                    // c33 interval year(4)
        ' 12-10',                                                                   // c34 interval year to month
        ' 1234-10',                                                                 // c35 interval year(4) to month
        ' 12',                                                                      // c36 interval month
        ' 1234',                                                                    // c37 interval month(4)
        ' 1',                                                                       // c38 interval day
        ' 1234',                                                                    // c39 interval day(4)
        ' 12 11',                                                                   // c40 interval day to hour
        ' 1234 11',                                                                 // c41 interval day(4) to hour
        ' 12 11:22',                                                                // c42 interval day to minute
        ' 1234 11:22',                                                              // c43 interval day(4) to minute
        ' 12 11:22:33',                                                             // c44 interval day to second(0)
        ' 12 11:22:33.12',                                                          // c45 interval day to second
        '-1234 11:22:33',                                                           // c46 interval day(4) to second(0)
        '-1234 11:22:33.124',                                                       // c47 interval day(4) to second
        '-12',                                                                      // c48 interval hour
        '-1234',                                                                    // c49 interval hour(4)
        '-12:22',                                                                   // c50 interval hour to minute
        '-1234:22',                                                                 // c51 interval hour(4) to minute
        '-12:22:33',                                                                // c52 interval hour to second(0)
        '-12:22:33.1456',                                                           // c53 interval hour to second
        '-1234:22:33',                                                              // c54 interval hour(4) to second(0)
        '-1234:22:33.1456',                                                         // c55 interval hour(4) to second
        '-12',                                                                      // c56 interval minute
        '-1234',                                                                    // c57 interval minute(4)
        '-12:33',                                                                   // c58 interval minute to second(0)
        '-12:33.4',                                                                 // c59 interval minute to second
        '-1234:33',                                                                 // c60 interval minute(4) to second(0)
        '-1234:33.1',                                                               // c61 interval minute(4) to second
        '-12',                                                                      // c62 interval second(2,0)
        '-12.123456',                                                               // c63 interval second
        '-1234',                                                                    // c64 interval second(4,0)
        '-1234.123456',                                                             // c65 interval second(4)
        '(\'1970-01-02\', \'1973-04-05\')',                                             // c66 period(date)
        '(\'21:22:33\', \'22:33:44\')',                                                 // c67 period(time(0))
        '(\'21:22:33.123456\', \'22:33:44.123456\')',                                   // c68 period(time)
        '(\'11:22:33+05:30\', \'22:33:44+05:30\')',                                     // c69 period(time(0) with time zone)
        '(\'11:22:33.123456+05:30\', \'22:33:44.123456+05:30\')',                       // c70 period(time with time zone)
        '(\'1970-01-02 03:04:05\', \'1976-07-08 09:10:11\')',                           // c71 period(timestamp(0))
        '(\'1970-01-02 03:04:05.01\', \'1976-07-08 09:10:11.123\')',                    // c72 period(timestamp)
        '(\'1970-01-02 03:04:05+05:30\', \'1976-07-08 09:10:11+05:30\')',               // c73 period(timestamp(0) with time zone)
        '(\'1970-01-02 03:04:05.123456+05:30\', \'1976-07-08 09:10:11.123456+05:30\')', // c74 period(timestamp with time zone)
    ],
    [
        9,                                                                          //  c1 integer
        123,                                                                        //  c2 byteint
        12345,                                                                      //  c3 smallint
        123456,                                                                     //  c4 integer
        12345678901,                                                                //  c5 bigint
        123.456,                                                                    //  c6 float
        '99999',                                                                    //  c7 varchar(10)
        'Row  9',                                                                   //  c8 char(8)
        new Uint8Array([0x01, 0x02, 0x03]),                                         //  c9 varbyte(10)
        new Uint8Array([0x04, 0x05, 0x06]),                                         // c10 byte(5)
        12.0,                                                                       // c11 decimal(2)
        1.2,                                                                        // c12 decimal (2,1)
        123.0,                                                                      // c13 decimal (4)
        1.34,                                                                       // c14 decimal (4,2)
        1234567.0,                                                                  // c15 decimal (9)
        234.54,                                                                     // c16 decimal (9,3)
        12345678901234.0,                                                           // c17 decimal (18)
        1234567890.567,                                                             // c18 decimal (18,4)
        890123456789012.0,                                                          // c19 decimal (38)
        3012345.4567,                                                               // c20 decimal (38,5)
        12.34,                                                                      // c21 number
        '2017-12-25',                                                               // c22 date
        '1999-12-31',                                                               // c23 date
        '11:22:33',                                                                 // c24 time(0)
        '11:22:33.12',                                                              // c25 time
        '11:22:33+04:30',                                                           // c26 time(0) with time zone
        '11:22:33.1+05:00',                                                         // c27 time with time zone
        '1970-01-02 03:04:05',                                                      // c28 timestamp(0)
        '1970-01-02 03:04:05.6',                                                    // c29 timestamp
        '1970-01-02 03:04:05+06:30',                                                // c30 timestamp(0) with time zone
        '1970-01-02 03:04:05.56+06:30',                                             // c31 timestamp with time zone
        '-12',                                                                      // c32 interval year
        '-1234',                                                                    // c33 interval year(4)
        '-12-10',                                                                   // c34 interval year to month
        '-1234-10',                                                                 // c35 interval year(4) to month
        '-12',                                                                      // c36 interval month
        '-1234',                                                                    // c37 interval month(4)
        '-1',                                                                       // c38 interval day
        '-1234',                                                                    // c39 interval day(4)
        '-12 11',                                                                   // c40 interval day to hour
        '-1234 11',                                                                 // c41 interval day(4) to hour
        '-12 11:22',                                                                // c42 interval day to minute
        '-1234 11:22',                                                              // c43 interval day(4) to minute
        '-12 11:22:33',                                                             // c44 interval day to second(0)
        '-12 11:22:33.12',                                                          // c45 interval day to second
        '-1234 11:22:33',                                                           // c46 interval day(4) to second(0)
        '-1234 11:22:33.124',                                                       // c47 interval day(4) to second
        '-12',                                                                      // c48 interval hour
        '-1234',                                                                    // c49 interval hour(4)
        '-12:22',                                                                   // c50 interval hour to minute
        '-1234:22',                                                                 // c51 interval hour(4) to minute
        '-12:22:33',                                                                // c52 interval hour to second(0)
        '-12:22:33.1456',                                                           // c53 interval hour to second
        '-1234:22:33',                                                              // c54 interval hour(4) to second(0)
        '-1234:22:33.1456',                                                         // c55 interval hour(4) to second
        '-12',                                                                      // c56 interval minute
        '-1234',                                                                    // c57 interval minute(4)
        '-12:33',                                                                   // c58 interval minute to second(0)
        '-12:33.4',                                                                 // c59 interval minute to second
        '-1234:33',                                                                 // c60 interval minute(4) to second(0)
        '-1234:33.1',                                                               // c61 interval minute(4) to second
        '-12',                                                                      // c62 interval second(2,0)
        '-12.123456',                                                               // c63 interval second
        '-1234',                                                                    // c64 interval second(4,0)
        '-1234.123456',                                                             // c65 interval second(4)
        '(\'1970-01-02\', \'1973-04-05\')',                                             // c66 period(date)
        '(\'21:22:33\', \'22:33:44\')',                                                 // c67 period(time(0))
        '(\'21:22:33.123456\', \'22:33:44.123456\')',                                   // c68 period(time)
        '(\'11:22:33+05:30\', \'22:33:44+05:30\')',                                     // c69 period(time(0) with time zone)
        '(\'11:22:33.123456+05:30\', \'22:33:44.123456+05:30\')',                       // c70 period(time with time zone)
        '(\'1970-01-02 03:04:05\', \'1976-07-08 09:10:11\')',                           // c71 period(timestamp(0))
        '(\'1970-01-02 03:04:05.01\', \'1976-07-08 09:10:11.123\')',                    // c72 period(timestamp)
        '(\'1970-01-02 03:04:05+05:30\', \'1976-07-08 09:10:11+05:30\')',               // c73 period(timestamp(0) with time zone)
        '(\'1970-01-02 03:04:05.123456+05:30\', \'1976-07-08 09:10:11.123456+05:30\')', // c74 period(timestamp with time zone)
    ],
    [
        10,                                     //  c1 integer
        null,                                   //  c2 byteint
        null,                                   //  c3 smallint
        null,                                   //  c4 integer
        null,                                   //  c5 bigint
        null,                                   //  c6 float
        null,                                   //  c7 varchar(10)
        null,                                   //  c8 char(8)
        null,                                   //  c9 varbyte(10)
        null,                                   // c10 byte(5)
        null,                                   // c11 decimal(2)
        null,                                   // c12 decimal (2,1)
        null,                                   // c13 decimal (4)
        null,                                   // c14 decimal (4,2)
        null,                                   // c15 decimal (9)
        null,                                   // c16 decimal (9,4)
        null,                                   // c17 decimal (18)
        null,                                   // c18 decimal (18,4)
        null,                                   // c19 decimal (38)
        null,                                   // c20 decimal (38,5)
        null,                                   // c21 number
        null,                                   // c22 date
        null,                                   // c23 date
        null,                                   // c24 time
        null,                                   // c25 time
        null,                                   // c26 time(0) with time zone
        null,                                   // c27 time with time zone
        null,                                   // c28 timestamp(0)
        null,                                   // c29 timestamp
        null,                                   // c30 timestamp(0) with time zone
        null,                                   // c31 timestamp with time zone
        null,                                   // c32 interval year
        null,                                   // c33 interval year(4)
        null,                                   // c34 interval year to month
        null,                                   // c35 interval year(4) to month
        null,                                   // c36 interval month
        null,                                   // c37 interval month(4)
        null,                                   // c38 interval day
        null,                                   // c39 interval day(4)
        null,                                   // c40 interval day to hour
        null,                                   // c41 interval day(4) to hour
        null,                                   // c42 interval day to minute
        null,                                   // c43 interval day(4) to minute
        null,                                   // c44 interval day to second(0)
        null,                                   // c45 interval day to second
        null,                                   // c46 interval day(4) to second(0)
        null,                                   // c47 interval day(4) to second
        null,                                   // c48 interval hour
        null,                                   // c49 interval hour(4)
        null,                                   // c50 interval hour to minute
        null,                                   // c51 interval hour(4) to minute
        null,                                   // c52 interval hour to second(0)
        null,                                   // c53 interval hour to second
        null,                                   // c54 interval hour(4) to second(0)
        null,                                   // c55 interval hour(4) to second
        null,                                   // c56 interval minute
        null,                                   // c57 interval minute(4)
        null,                                   // c58 interval minute to second(0)
        null,                                   // c59 interval minute to second
        null,                                   // c60 interval minute(4) to second(0)
        null,                                   // c61 interval minute(4) to second
        null,                                   // c62 interval second(2,0)
        null,                                   // c63 interval second
        null,                                   // c64 interval second(4,0)
        null,                                   // c65 interval second(4)
        null,                                   // c66 period(date)
        null,                                   // c67 period(time(0))
        null,                                   // c68 period(time)
        null,                                   // c69 period(time(0) with time zone)
        null,                                   // c70 period(time with time zone)
        null,                                   // c71 period(timestamp(0))
        null,                                   // c72 period(timestamp)
        null,                                   // c73 period(timestamp(0) with time zone)
        null,                                   // c74 period(timestamp with time zone)
      ],
    ];

    const expectedRows: any[] =
    [
      [ // row 1 contains null values
        1,                                      //  c1 integer
        null,                                   //  c2 byteint
        null,                                   //  c3 smallint
        null,                                   //  c4 integer
        null,                                   //  c5 bigint
        null,                                   //  c6 float
        null,                                   //  c7 varchar(10)
        null,                                   //  c8 char(8)
        null,                                   //  c9 varbyte(10)
        null,                                   // c10 byte(5)
        null,                                   // c11 decimal(2)
        null,                                   // c12 decimal (2,1)
        null,                                   // c13 decimal (4)
        null,                                   // c14 decimal (4,2)
        null,                                   // c15 decimal (9)
        null,                                   // c16 decimal (9,4)
        null,                                   // c17 decimal (18)
        null,                                   // c18 decimal (18,4)
        null,                                   // c19 decimal (38)
        null,                                   // c20 decimal (38,5)
        null,                                   // c21 number
        null,                                   // c22 date
        null,                                   // c23 date
        null,                                   // c24 time
        null,                                   // c25 time
        null,                                   // c26 time(0) with time zone
        null,                                   // c27 time with time zone
        null,                                   // c28 timestamp(0)
        null,                                   // c29 timestamp
        null,                                   // c30 timestamp(0) with time zone
        null,                                   // c31 timestamp with time zone
        null,                                   // c32 interval year
        null,                                   // c33 interval year(4)
        null,                                   // c34 interval year to month
        null,                                   // c35 interval year(4) to month
        null,                                   // c36 interval month
        null,                                   // c37 interval month(4)
        null,                                   // c38 interval day
        null,                                   // c39 interval day(4)
        null,                                   // c40 interval day to hour
        null,                                   // c41 interval day(4) to hour
        null,                                   // c42 interval day to minute
        null,                                   // c43 interval day(4) to minute
        null,                                   // c44 interval day to second(0)
        null,                                   // c45 interval day to second
        null,                                   // c46 interval day(4) to second(0)
        null,                                   // c47 interval day(4) to second
        null,                                   // c48 interval hour
        null,                                   // c49 interval hour(4)
        null,                                   // c50 interval hour to minute
        null,                                   // c51 interval hour(4) to minute
        null,                                   // c52 interval hour to second(0)
        null,                                   // c53 interval hour to second
        null,                                   // c54 interval hour(4) to second(0)
        null,                                   // c55 interval hour(4) to second
        null,                                   // c56 interval minute
        null,                                   // c57 interval minute(4)
        null,                                   // c58 interval minute to second(0)
        null,                                   // c59 interval minute to second
        null,                                   // c60 interval minute(4) to second(0)
        null,                                   // c61 interval minute(4) to second
        null,                                   // c62 interval second(2,0)
        null,                                   // c63 interval second
        null,                                   // c64 interval second(4,0)
        null,                                   // c65 interval second(4)
        null,                                   // c66 period(date)
        null,                                   // c67 period(time(0))
        null,                                   // c68 period(time)
        null,                                   // c69 period(time(0) with time zone)
        null,                                   // c70 period(time with time zone)
        null,                                   // c71 period(timestamp(0))
        null,                                   // c72 period(timestamp)
        null,                                   // c73 period(timestamp(0) with time zone)
        null,                                   // c74 period(timestamp with time zone)
      ], // end row 1
      [  // row 2 contains null values
        2,                                      //  c1 integer
        null,                                   //  c2 byteint
        null,                                   //  c3 smallint
        null,                                   //  c4 integer
        null,                                   //  c5 bigint
        null,                                   //  c6 float
        null,                                   //  c7 varchar(10)
        null,                                   //  c8 char(8)
        null,                                   //  c9 varbyte(10)
        null,                                   // c10 byte(5)
        null,                                   // c11 decimal(2)
        null,                                   // c12 decimal (2,1)
        null,                                   // c13 decimal (4)
        null,                                   // c14 decimal (4,2)
        null,                                   // c15 decimal (9)
        null,                                   // c16 decimal (9,4)
        null,                                   // c17 decimal (18)
        null,                                   // c18 decimal (18,4)
        null,                                   // c19 decimal (38)
        null,                                   // c20 decimal (38,5)
        null,                                   // c21 number
        null,                                   // c22 date
        null,                                   // c23 date
        null,                                   // c24 time
        null,                                   // c25 time
        null,                                   // c26 time(0) with time zone
        null,                                   // c27 time with time zone
        null,                                   // c28 timestamp(0)
        null,                                   // c29 timestamp
        null,                                   // c30 timestamp(0) with time zone
        null,                                   // c31 timestamp with time zone
        null,                                   // c32 interval year
        null,                                   // c33 interval year(4)
        null,                                   // c34 interval year to month
        null,                                   // c35 interval year(4) to month
        null,                                   // c36 interval month
        null,                                   // c37 interval month(4)
        null,                                   // c38 interval day
        null,                                   // c39 interval day(4)
        null,                                   // c40 interval day to hour
        null,                                   // c41 interval day(4) to hour
        null,                                   // c42 interval day to minute
        null,                                   // c43 interval day(4) to minute
        null,                                   // c44 interval day to second(0)
        null,                                   // c45 interval day to second
        null,                                   // c46 interval day(4) to second(0)
        null,                                   // c47 interval day(4) to second
        null,                                   // c48 interval hour
        null,                                   // c49 interval hour(4)
        null,                                   // c50 interval hour to minute
        null,                                   // c51 interval hour(4) to minute
        null,                                   // c52 interval hour to second(0)
        null,                                   // c53 interval hour to second
        null,                                   // c54 interval hour(4) to second(0)
        null,                                   // c55 interval hour(4) to second
        null,                                   // c56 interval minute
        null,                                   // c57 interval minute(4)
        null,                                   // c58 interval minute to second(0)
        null,                                   // c59 interval minute to second
        null,                                   // c60 interval minute(4) to second(0)
        null,                                   // c61 interval minute(4) to second
        null,                                   // c62 interval second(2,0)
        null,                                   // c63 interval second
        null,                                   // c64 interval second(4,0)
        null,                                   // c65 interval second(4)
        null,                                   // c66 period(date)
        null,                                   // c67 period(time(0))
        null,                                   // c68 period(time)
        null,                                   // c69 period(time(0) with time zone)
        null,                                   // c70 period(time with time zone)
        null,                                   // c71 period(timestamp(0))
        null,                                   // c72 period(timestamp)
        null,                                   // c73 period(timestamp(0) with time zone)
        null,                                   // c74 period(timestamp with time zone)
      ], // end row 2
      [  // row 3 contains null values
        3,                                      //  c1 integer
        null,                                   //  c2 byteint
        null,                                   //  c3 smallint
        null,                                   //  c4 integer
        null,                                   //  c5 bigint
        null,                                   //  c6 float
        null,                                   //  c7 varchar(10)
        null,                                   //  c8 char(8)
        null,                                   //  c9 varbyte(10)
        null,                                   // c10 byte(5)
        null,                                   // c11 decimal(2)
        null,                                   // c12 decimal (2,1)
        null,                                   // c13 decimal (4)
        null,                                   // c14 decimal (4,2)
        null,                                   // c15 decimal (9)
        null,                                   // c16 decimal (9,4)
        null,                                   // c17 decimal (18)
        null,                                   // c18 decimal (18,4)
        null,                                   // c19 decimal (38)
        null,                                   // c20 decimal (38,5)
        null,                                   // c21 number
        null,                                   // c22 date
        null,                                   // c23 date
        null,                                   // c24 time
        null,                                   // c25 time
        null,                                   // c26 time(0) with time zone
        null,                                   // c27 time with time zone
        null,                                   // c28 timestamp(0)
        null,                                   // c29 timestamp
        null,                                   // c30 timestamp(0) with time zone
        null,                                   // c31 timestamp with time zone
        null,                                   // c32 interval year
        null,                                   // c33 interval year(4)
        null,                                   // c34 interval year to month
        null,                                   // c35 interval year(4) to month
        null,                                   // c36 interval month
        null,                                   // c37 interval month(4)
        null,                                   // c38 interval day
        null,                                   // c39 interval day(4)
        null,                                   // c40 interval day to hour
        null,                                   // c41 interval day(4) to hour
        null,                                   // c42 interval day to minute
        null,                                   // c43 interval day(4) to minute
        null,                                   // c44 interval day to second(0)
        null,                                   // c45 interval day to second
        null,                                   // c46 interval day(4) to second(0)
        null,                                   // c47 interval day(4) to second
        null,                                   // c48 interval hour
        null,                                   // c49 interval hour(4)
        null,                                   // c50 interval hour to minute
        null,                                   // c51 interval hour(4) to minute
        null,                                   // c52 interval hour to second(0)
        null,                                   // c53 interval hour to second
        null,                                   // c54 interval hour(4) to second(0)
        null,                                   // c55 interval hour(4) to second
        null,                                   // c56 interval minute
        null,                                   // c57 interval minute(4)
        null,                                   // c58 interval minute to second(0)
        null,                                   // c59 interval minute to second
        null,                                   // c60 interval minute(4) to second(0)
        null,                                   // c61 interval minute(4) to second
        null,                                   // c62 interval second(2,0)
        null,                                   // c63 interval second
        null,                                   // c64 interval second(4,0)
        null,                                   // c65 interval second(4)
        null,                                   // c66 period(date)
        null,                                   // c67 period(time(0))
        null,                                   // c68 period(time)
        null,                                   // c69 period(time(0) with time zone)
        null,                                   // c70 period(time with time zone)
        null,                                   // c71 period(timestamp(0))
        null,                                   // c72 period(timestamp)
        null,                                   // c73 period(timestamp(0) with time zone)
        null,                                   // c74 period(timestamp with time zone)
      ], // end row 3
      [  //  row 4 contains non-null values
        4,                                                                   //  c1 integer
        1,                                                                   //  c2 byteint
        3,                                                                   //  c3 smallint
        16,                                                                  //  c4 integer
        '101',                                                               //  c5 bigint
        123.456,                                                             //  c6 float
        'Row #4',                                                            //  c7 varchar(10)
        'Row4            ',                                                  //  c8 char(8)
        new Uint8Array([0x01, 0x02, 0x03]),                                  //  c9 varbyte(10)
        new Uint8Array([0x04, 0x05, 0x06, 0x07, 0x00]),                      // c10 byte(5)
        '1',                                                                 // c11 decimal(2)
        '2.0',                                                               // c12 decimal (2,1)
        '34',                                                                // c13 decimal (4)
        '57.00',                                                             // c14 decimal (4,2)
        '890',                                                               // c15 decimal (9)
        '1234.000',                                                          // c16 decimal (9,3)
        '6789012345678',                                                     // c17 decimal (18)
        '901234.5600',                                                       // c18 decimal (18,4)
        '78901234567890',                                                    // c19 decimal (38)
        '-.10000',                                                           // c20 decimal (38,5)
        '1.2',                                                               // c21 number
        '2017-12-25',                                                        // c22 date
        '1999-12-31',                                                        // c23 date
        '11:22:33',                                                          // c24 time(0)
        '11:22:33.120000',                                                   // c25 time
        '11:22:33+04:30',                                                    // c26 time(0) with time zone
        '11:22:33.100000+05:00',                                             // c27 time with time zone
        '1970-01-02 03:04:05',                                               // c28 timestamp(0)
        '1970-01-02 03:04:05.600000',                                        // c29 timestamp
        '1970-01-02 03:04:05+06:30',                                         // c30 timestamp(0) with time zone
        '1970-01-02 03:04:05.560000+06:30',                                  // c31 timestamp with time zone
        '-12',                                                               // c32 interval year
        '-1234',                                                             // c33 interval year(4)
        '-12-10',                                                            // c34 interval year to month
        '-1234-10',                                                          // c35 interval year(4) to month
        '-12',                                                               // c36 interval month
        '-1234',                                                             // c37 interval month(4)
        ' -1',                                                               // c38 interval day
        '-1234',                                                             // c39 interval day(4)
        '-12 11',                                                            // c40 interval day to hour
        '-1234 11',                                                          // c41 interval day(4) to hour
        '-12 11:22',                                                         // c42 interval day to minute
        '-1234 11:22',                                                       // c43 interval day(4) to minute
        '-12 11:22:33',                                                      // c44 interval day to second(0)
        '-12 11:22:33.120000',                                               // c45 interval day to second
        '-1234 11:22:33',                                                    // c46 interval day(4) to second(0)
        '-1234 11:22:33.124000',                                             // c47 interval day(4) to second
        '-12',                                                               // c48 interval hour
        '-1234',                                                             // c49 interval hour(4)
        '-12:22',                                                            // c50 interval hour to minute
        '-1234:22',                                                          // c51 interval hour(4) to minute
        '-12:22:33',                                                         // c52 interval hour to second(0)
        '-12:22:33.145600',                                                  // c53 interval hour to second
        '-1234:22:33',                                                       // c54 interval hour(4) to second(0)
        '-1234:22:33.145600',                                                // c55 interval hour(4) to second
        '-12',                                                               // c56 interval minute
        '-1234',                                                             // c57 interval minute(4)
        '-12:33',                                                            // c58 interval minute to second(0)
        '-12:33.400000',                                                     // c59 interval minute to second
        '-1234:33',                                                          // c60 interval minute(4) to second(0)
        '-1234:33.100000',                                                   // c61 interval minute(4) to second
        '-12',                                                               // c62 interval second(2,0)
        '-12.123456',                                                        // c63 interval second
        '-1234',                                                             // c64 interval second(4,0)
        '-1234.123456',                                                      // c65 interval second(4)
        '1970-01-02,1973-04-05',                                             // c66 period(date)
        '21:22:33,22:33:44',                                                 // c67 period(time(0))
        '21:22:33.123456,22:33:44.123456',                                   // c68 period(time)
        '11:22:33+05:30,22:33:44+05:30',                                     // c69 period(time(0) with time zone)
        '11:22:33.123456+05:30,22:33:44.123456+05:30',                       // c70 period(time with time zone)
        '1970-01-02 03:04:05,1976-07-08 09:10:11',                           // c71 period(timestamp(0))
        '1970-01-02 03:04:05.010000,1976-07-08 09:10:11.123000',             // c72 period(timestamp)
        '1970-01-02 03:04:05+05:30,1976-07-08 09:10:11+05:30',               // c73 period(timestamp(0) with time zone)
        '1970-01-02 03:04:05.123456+05:30,1976-07-08 09:10:11.123456+05:30', // c74 period(timestamp with time zone)
      ], //  end row 4
      [  //  row 5 contains non-null values
        5,                                                                   //  c1 integer
        123,                                                                 //  c2 byteint
        12345,                                                               //  c3 smallint
        123456,                                                              //  c4 integer
        '12345678901',                                                       //  c5 bigint
        123.456,                                                             //  c6 float
        'Row 5',                                                             //  c7 varchar(10)
        'Row5----        ',                                                  //  c8 char(8)
        new Uint8Array([0x08, 0x09, 0x10, 0x11]),                            //  c9 varbyte(10)
        new Uint8Array([0x12, 0x13, 0x14, 0x15, 0x16]),                      // c10 byte(5)
        '12',                                                                // c11 decimal(2)
        '1.2',                                                               // c12 decimal (2,1)
        '1234',                                                              // c13 decimal (4)
        '12.34',                                                             // c14 decimal (4,2)
        '123456789',                                                         // c15 decimal (9)
        '123456.789',                                                        // c16 decimal (9,3)
        '123456789012345680',                                                // c17 decimal (18)
        '12345678901234.5684',                                               // c18 decimal (18,4)
        '6789012345678',                                                     // c19 decimal (38)
        '67890123.45678',                                                    // c20 decimal (38,5)
        '123.45',                                                            // c21 number
        '2050-12-25',                                                        // c22 date
        '1950-12-31',                                                        // c23 date
        '11:22:50',                                                          // c24 time(0)
        '11:22:33.050000',                                                   // c25 time
        '11:22:33+04:30',                                                    // c26 time(0) with time zone
        '11:22:33.100000+05:00',                                             // c27 time with time zone
        '1970-01-02 03:04:05',                                               // c28 timestamp(0)
        '1970-01-02 03:04:05.600000',                                        // c29 timestamp
        '1970-01-02 03:04:05+06:30',                                         // c30 timestamp(0) with time zone
        '1970-01-02 03:04:05.560000+06:30',                                  // c31 timestamp with time zone
        '-12',                                                               // c32 interval year
        '-1234',                                                             // c33 interval year(4)
        '-12-10',                                                            // c34 interval year to month
        '-1234-10',                                                          // c35 interval year(4) to month
        '-12',                                                               // c36 interval month
        '-1234',                                                             // c37 interval month(4)
        ' -1',                                                               // c38 interval day
        '-1234',                                                             // c39 interval day(4)
        '-12 11',                                                            // c40 interval day to hour
        '-1234 11',                                                          // c41 interval day(4) to hour
        '-12 11:22',                                                         // c42 interval day to minute
        '-1234 11:22',                                                       // c43 interval day(4) to minute
        '-12 11:22:33',                                                      // c44 interval day to second(0)
        '-12 11:22:33.120000',                                               // c45 interval day to second
        '-1234 11:22:33',                                                    // c46 interval day(4) to second(0)
        '-1234 11:22:33.124000',                                             // c47 interval day(4) to second
        '-12',                                                               // c48 interval hour
        '-1234',                                                             // c49 interval hour(4)
        '-12:22',                                                            // c50 interval hour to minute
        '-1234:22',                                                          // c51 interval hour(4) to minute
        '-12:22:33',                                                         // c52 interval hour to second(0)
        '-12:22:33.145600',                                                  // c53 interval hour to second
        '-1234:22:33',                                                       // c54 interval hour(4) to second(0)
        '-1234:22:33.145600',                                                // c55 interval hour(4) to second
        '-12',                                                               // c56 interval minute
        '-1234',                                                             // c57 interval minute(4)
        '-12:33',                                                            // c58 interval minute to second(0)
        '-12:33.400000',                                                     // c59 interval minute to second
        '-1234:33',                                                          // c60 interval minute(4) to second(0)
        '-1234:33.100000',                                                   // c61 interval minute(4) to second
        '-12',                                                               // c62 interval second(2,0)
        '-12.123456',                                                        // c63 interval second
        '-1234',                                                             // c64 interval second(4,0)
        '-1234.123456',                                                      // c65 interval second(4)
        '1970-01-02,1973-04-05',                                             // c66 period(date)
        '21:22:33,22:33:44',                                                 // c67 period(time(0))
        '21:22:33.123456,22:33:44.123456',                                   // c68 period(time)
        '11:22:33+05:30,22:33:44+05:30',                                     // c69 period(time(0) with time zone)
        '11:22:33.123456+05:30,22:33:44.123456+05:30',                       // c70 period(time with time zone)
        '1970-01-02 03:04:05,1976-07-08 09:10:11',                           // c71 period(timestamp(0))
        '1970-01-02 03:04:05.010000,1976-07-08 09:10:11.123000',             // c72 period(timestamp)
        '1970-01-02 03:04:05+05:30,1976-07-08 09:10:11+05:30',               // c73 period(timestamp(0) with time zone)
        '1970-01-02 03:04:05.123456+05:30,1976-07-08 09:10:11.123456+05:30', // c74 period(timestamp with time zone)
      ], //  end row 5
      [  //  row 6 contains null values
        6,                                      //  c1 integer
        null,                                   //  c2 byteint
        null,                                   //  c3 smallint
        null,                                   //  c4 integer
        null,                                   //  c5 bigint
        null,                                   //  c6 float
        null,                                   //  c7 varchar(10)
        null,                                   //  c8 char(8)
        null,                                   //  c9 varbyte(10)
        null,                                   // c10 byte(5)
        null,                                   // c11 decimal(2)
        null,                                   // c12 decimal (2,1)
        null,                                   // c13 decimal (4)
        null,                                   // c14 decimal (4,2)
        null,                                   // c15 decimal (9)
        null,                                   // c16 decimal (9,4)
        null,                                   // c17 decimal (18)
        null,                                   // c18 decimal (18,4)
        null,                                   // c19 decimal (38)
        null,                                   // c20 decimal (38,5)
        null,                                   // c21 number
        null,                                   // c22 date
        null,                                   // c23 date
        null,                                   // c24 time
        null,                                   // c25 time
        null,                                   // c26 time(0) with time zone
        null,                                   // c27 time with time zone
        null,                                   // c28 timestamp(0)
        null,                                   // c29 timestamp
        null,                                   // c30 timestamp(0) with time zone
        null,                                   // c31 timestamp with time zone
        null,                                   // c32 interval year
        null,                                   // c33 interval year(4)
        null,                                   // c34 interval year to month
        null,                                   // c35 interval year(4) to month
        null,                                   // c36 interval month
        null,                                   // c37 interval month(4)
        null,                                   // c38 interval day
        null,                                   // c39 interval day(4)
        null,                                   // c40 interval day to hour
        null,                                   // c41 interval day(4) to hour
        null,                                   // c42 interval day to minute
        null,                                   // c43 interval day(4) to minute
        null,                                   // c44 interval day to second(0)
        null,                                   // c45 interval day to second
        null,                                   // c46 interval day(4) to second(0)
        null,                                   // c47 interval day(4) to second
        null,                                   // c48 interval hour
        null,                                   // c49 interval hour(4)
        null,                                   // c50 interval hour to minute
        null,                                   // c51 interval hour(4) to minute
        null,                                   // c52 interval hour to second(0)
        null,                                   // c53 interval hour to second
        null,                                   // c54 interval hour(4) to second(0)
        null,                                   // c55 interval hour(4) to second
        null,                                   // c56 interval minute
        null,                                   // c57 interval minute(4)
        null,                                   // c58 interval minute to second(0)
        null,                                   // c59 interval minute to second
        null,                                   // c60 interval minute(4) to second(0)
        null,                                   // c61 interval minute(4) to second
        null,                                   // c62 interval second(2,0)
        null,                                   // c63 interval second
        null,                                   // c64 interval second(4,0)
        null,                                   // c65 interval second(4)
        null,                                   // c66 period(date)
        null,                                   // c67 period(time(0))
        null,                                   // c68 period(time)
        null,                                   // c69 period(time(0) with time zone)
        null,                                   // c70 period(time with time zone)
        null,                                   // c71 period(timestamp(0))
        null,                                   // c72 period(timestamp)
        null,                                   // c73 period(timestamp(0) with time zone)
        null,                                   // c74 period(timestamp with time zone)
      ], //  end row 6
      [  //  row 7 contains non-null values
        7,                                                                   //  c1 integer
        56,                                                                  //  c2 byteint
        8901,                                                                //  c3 smallint
        234567,                                                              //  c4 integer
        '8901234567',                                                        //  c5 bigint
        1245667.45678901,                                                    //  c6 float
        'Row is a 7',                                                        //  c7 varchar(10)
        'Row7---         ',                                                  //  c8 char(8)
        new Uint8Array([0x07, 0x08]),                                        //  c9 varbyte(10)
        new Uint8Array([0x19, 0x00, 0x00, 0x00, 0x00]),                      // c10 byte(5)
        '1',                                                                 // c11 decimal(2)
        '2.0',                                                               // c12 decimal (2,1)
        '12',                                                                // c13 decimal (4)
        '4.00',                                                              // c14 decimal (4,2)
        '9',                                                                 // c15 decimal (9)
        '123456.790',                                                        // c16 decimal (9,3)
        '1234567890123678',                                                  // c17 decimal (18)
        '12345671234.5670',                                                  // c18 decimal (18,4)
        '1234567890129012',                                                  // c19 decimal (38)
        '1234567890.45678',                                                  // c20 decimal (38,5)
        '123.45',                                                            // c21 number
        '2077-12-07',                                                        // c22 date
        '1977-07-01',                                                        // c23 date
        '11:22:07',                                                          // c24 time(0)
        '11:22:33.120000',                                                   // c25 time
        '11:22:33+04:30',                                                    // c26 time(0) with time zone
        '11:22:33.100000+05:00',                                             // c27 time with time zone
        '1977-01-02 03:04:05',                                               // c28 timestamp(0)
        '1977-01-02 03:04:05.600000',                                        // c29 timestamp
        '1977-01-02 03:04:05+06:30',                                         // c30 timestamp(0) with time zone
        '1977-01-02 03:04:05.560000+06:30',                                  // c31 timestamp with time zone
        '-12',                                                               // c32 interval year
        '-1234',                                                             // c33 interval year(4)
        '-12-10',                                                            // c34 interval year to month
        '-1234-10',                                                          // c35 interval year(4) to month
        '-12',                                                               // c36 interval month
        '-1234',                                                             // c37 interval month(4)
        ' -1',                                                               // c38 interval day
        '-1234',                                                             // c39 interval day(4)
        '-12 11',                                                            // c40 interval day to hour
        '-1234 11',                                                          // c41 interval day(4) to hour
        '-12 11:22',                                                         // c42 interval day to minute
        '-1234 11:22',                                                       // c43 interval day(4) to minute
        '-12 11:22:33',                                                      // c44 interval day to second(0)
        '-12 11:22:33.120000',                                               // c45 interval day to second
        '-1234 11:22:33',                                                    // c46 interval day(4) to second(0)
        '-1234 11:22:33.124000',                                             // c47 interval day(4) to second
        '-12',                                                               // c48 interval hour
        '-1234',                                                             // c49 interval hour(4)
        '-12:22',                                                            // c50 interval hour to minute
        '-1234:22',                                                          // c51 interval hour(4) to minute
        '-12:22:33',                                                         // c52 interval hour to second(0)
        '-12:22:33.145600',                                                  // c53 interval hour to second
        '-1234:22:33',                                                       // c54 interval hour(4) to second(0)
        '-1234:22:33.145600',                                                // c55 interval hour(4) to second
        '-12',                                                               // c56 interval minute
        '-1234',                                                             // c57 interval minute(4)
        '-12:33',                                                            // c58 interval minute to second(0)
        '-12:33.400000',                                                     // c59 interval minute to second
        '-1234:33',                                                          // c60 interval minute(4) to second(0)
        '-1234:33.100000',                                                   // c61 interval minute(4) to second
        '-12',                                                               // c62 interval second(2,0)
        '-12.123456',                                                        // c63 interval second
        '-1234',                                                             // c64 interval second(4,0)
        '-1234.123456',                                                      // c65 interval second(4)
        '1970-01-02,1973-04-05',                                             // c66 period(date)
        '21:22:33,22:33:44',                                                 // c67 period(time(0))
        '21:22:33.123456,22:33:44.123456',                                   // c68 period(time)
        '11:22:33+05:30,22:33:44+05:30',                                     // c69 period(time(0) with time zone)
        '11:22:33.123456+05:30,22:33:44.123456+05:30',                       // c70 period(time with time zone)
        '1970-01-02 03:04:05,1976-07-08 09:10:11',                           // c71 period(timestamp(0))
        '1970-01-02 03:04:05.010000,1976-07-08 09:10:11.123000',             // c72 period(timestamp)
        '1970-01-02 03:04:05+05:30,1976-07-08 09:10:11+05:30',               // c73 period(timestamp(0) with time zone)
        '1970-01-02 03:04:05.123456+05:30,1976-07-08 09:10:11.123456+05:30', // c74 period(timestamp with time zone)
      ], //  end row 7
      [  //  row 8 contains non-null values
        8,                                                                   //  c1 integer
        1,                                                                   //  c2 byteint
        2,                                                                   //  c3 smallint
        3,                                                                   //  c4 integer
        '4',                                                                 //  c5 bigint
        8.0,                                                                 //  c6 float
        '88888888',                                                          //  c7 varchar(10)
        'Row8            ',                                                  //  c8 char(8)
        new Uint8Array([0x01]),                                              //  c9 varbyte(10)
        new Uint8Array([0x04, 0x05, 0x00, 0x00, 0x00]),                      // c10 byte(5)
        '1',                                                                 // c11 decimal(2)
        '1.0',                                                               // c12 decimal (2,1)
        '12',                                                                // c13 decimal (4)
        '12.00',                                                             // c14 decimal (4,2)
        '123456',                                                            // c15 decimal (9)
        '123.400',                                                           // c16 decimal (9,3)
        '123456789012',                                                      // c17 decimal (18)
        '12345678.5600',                                                     // c18 decimal (18,4)
        '3456822757661086',                                                  // c19 decimal (38)
        '12345678901.45600',                                                 // c20 decimal (38,5)
        '1.2',                                                               // c21 number
        '2017-12-25',                                                        // c22 date
        '1999-12-31',                                                        // c23 date
        '11:22:33',                                                          // c24 time(0)
        '11:22:33.120000',                                                   // c25 time
        '11:22:33+04:30',                                                    // c26 time(0) with time zone
        '11:22:33.100000+05:00',                                             // c27 time with time zone
        '1970-01-02 03:04:05',                                               // c28 timestamp(0)
        '1970-01-02 03:04:05.600000',                                        // c29 timestamp
        '1970-01-02 03:04:05+06:30',                                         // c30 timestamp(0) with time zone
        '1970-01-02 03:04:05.560000+06:30',                                  // c31 timestamp with time zone
        ' 12',                                                               // c32 interval year
        ' 1234',                                                             // c33 interval year(4)
        ' 12-10',                                                            // c34 interval year to month
        ' 1234-10',                                                          // c35 interval year(4) to month
        ' 12',                                                               // c36 interval month
        ' 1234',                                                             // c37 interval month(4)
        '  1',                                                               // c38 interval day
        ' 1234',                                                             // c39 interval day(4)
        ' 12 11',                                                            // c40 interval day to hour
        ' 1234 11',                                                          // c41 interval day(4) to hour
        ' 12 11:22',                                                         // c42 interval day to minute
        ' 1234 11:22',                                                       // c43 interval day(4) to minute
        ' 12 11:22:33',                                                      // c44 interval day to second(0)
        ' 12 11:22:33.120000',                                               // c45 interval day to second
        '-1234 11:22:33',                                                    // c46 interval day(4) to second(0)
        '-1234 11:22:33.124000',                                             // c47 interval day(4) to second
        '-12',                                                               // c48 interval hour
        '-1234',                                                             // c49 interval hour(4)
        '-12:22',                                                            // c50 interval hour to minute
        '-1234:22',                                                          // c51 interval hour(4) to minute
        '-12:22:33',                                                         // c52 interval hour to second(0)
        '-12:22:33.145600',                                                  // c53 interval hour to second
        '-1234:22:33',                                                       // c54 interval hour(4) to second(0)
        '-1234:22:33.145600',                                                // c55 interval hour(4) to second
        '-12',                                                               // c56 interval minute
        '-1234',                                                             // c57 interval minute(4)
        '-12:33',                                                            // c58 interval minute to second(0)
        '-12:33.400000',                                                     // c59 interval minute to second
        '-1234:33',                                                          // c60 interval minute(4) to second(0)
        '-1234:33.100000',                                                   // c61 interval minute(4) to second
        '-12',                                                               // c62 interval second(2,0)
        '-12.123456',                                                        // c63 interval second
        '-1234',                                                             // c64 interval second(4,0)
        '-1234.123456',                                                      // c65 interval second(4)
        '1970-01-02,1973-04-05',                                             // c66 period(date)
        '21:22:33,22:33:44',                                                 // c67 period(time(0))
        '21:22:33.123456,22:33:44.123456',                                   // c68 period(time)
        '11:22:33+05:30,22:33:44+05:30',                                     // c69 period(time(0) with time zone)
        '11:22:33.123456+05:30,22:33:44.123456+05:30',                       // c70 period(time with time zone)
        '1970-01-02 03:04:05,1976-07-08 09:10:11',                           // c71 period(timestamp(0))
        '1970-01-02 03:04:05.010000,1976-07-08 09:10:11.123000',             // c72 period(timestamp)
        '1970-01-02 03:04:05+05:30,1976-07-08 09:10:11+05:30',               // c73 period(timestamp(0) with time zone)
        '1970-01-02 03:04:05.123456+05:30,1976-07-08 09:10:11.123456+05:30', // c74 period(timestamp with time zone)
      ], //  end row 8
      [  //  row 9 contains non-null values
        9,                                                                   //  c1 integer
        123,                                                                 //  c2 byteint
        12345,                                                               //  c3 smallint
        123456,                                                              //  c4 integer
        '12345678901',                                                       //  c5 bigint
        123.456,                                                             //  c6 float
        '99999',                                                             //  c7 varchar(10)
        'Row  9          ',                                                  //  c8 char(8)
        new Uint8Array([0x01, 0x02, 0x03]),                                  //  c9 varbyte(10)
        new Uint8Array([0x04, 0x05, 0x06, 0x00, 0x00]),                      // c10 byte(5)
        '12',                                                                // c11 decimal(2)
        '1.2',                                                               // c12 decimal (2,1)
        '123',                                                               // c13 decimal (4)
        '1.34',                                                              // c14 decimal (4,2)
        '1234567',                                                           // c15 decimal (9)
        '234.540',                                                           // c16 decimal (9,3)
        '12345678901234',                                                    // c17 decimal (18)
        '1234567890.5670',                                                   // c18 decimal (18,4)
        '890123456789012',                                                   // c19 decimal (38)
        '3012345.45670',                                                     // c20 decimal (38,5)
        '12.34',                                                             // c21 number
        '2017-12-25',                                                        // c22 date
        '1999-12-31',                                                        // c23 date
        '11:22:33',                                                          // c24 time(0)
        '11:22:33.120000',                                                   // c25 time
        '11:22:33+04:30',                                                    // c26 time(0) with time zone
        '11:22:33.100000+05:00',                                             // c27 time with time zone
        '1970-01-02 03:04:05',                                               // c28 timestamp(0)
        '1970-01-02 03:04:05.600000',                                        // c29 timestamp
        '1970-01-02 03:04:05+06:30',                                         // c30 timestamp(0) with time zone
        '1970-01-02 03:04:05.560000+06:30',                                  // c31 timestamp with time zone
        '-12',                                                               // c32 interval year
        '-1234',                                                             // c33 interval year(4)
        '-12-10',                                                            // c34 interval year to month
        '-1234-10',                                                          // c35 interval year(4) to month
        '-12',                                                               // c36 interval month
        '-1234',                                                             // c37 interval month(4)
        ' -1',                                                               // c38 interval day
        '-1234',                                                             // c39 interval day(4)
        '-12 11',                                                            // c40 interval day to hour
        '-1234 11',                                                          // c41 interval day(4) to hour
        '-12 11:22',                                                         // c42 interval day to minute
        '-1234 11:22',                                                       // c43 interval day(4) to minute
        '-12 11:22:33',                                                      // c44 interval day to second(0)
        '-12 11:22:33.120000',                                               // c45 interval day to second
        '-1234 11:22:33',                                                    // c46 interval day(4) to second(0)
        '-1234 11:22:33.124000',                                             // c47 interval day(4) to second
        '-12',                                                               // c48 interval hour
        '-1234',                                                             // c49 interval hour(4)
        '-12:22',                                                            // c50 interval hour to minute
        '-1234:22',                                                          // c51 interval hour(4) to minute
        '-12:22:33',                                                         // c52 interval hour to second(0)
        '-12:22:33.145600',                                                  // c53 interval hour to second
        '-1234:22:33',                                                       // c54 interval hour(4) to second(0)
        '-1234:22:33.145600',                                                // c55 interval hour(4) to second
        '-12',                                                               // c56 interval minute
        '-1234',                                                             // c57 interval minute(4)
        '-12:33',                                                            // c58 interval minute to second(0)
        '-12:33.400000',                                                     // c59 interval minute to second
        '-1234:33',                                                          // c60 interval minute(4) to second(0)
        '-1234:33.100000',                                                   // c61 interval minute(4) to second
        '-12',                                                               // c62 interval second(2,0)
        '-12.123456',                                                        // c63 interval second
        '-1234',                                                             // c64 interval second(4,0)
        '-1234.123456',                                                      // c65 interval second(4)
        '1970-01-02,1973-04-05',                                             // c66 period(date)
        '21:22:33,22:33:44',                                                 // c67 period(time(0))
        '21:22:33.123456,22:33:44.123456',                                   // c68 period(time)
        '11:22:33+05:30,22:33:44+05:30',                                     // c69 period(time(0) with time zone)
        '11:22:33.123456+05:30,22:33:44.123456+05:30',                       // c70 period(time with time zone)
        '1970-01-02 03:04:05,1976-07-08 09:10:11',                           // c71 period(timestamp(0))
        '1970-01-02 03:04:05.010000,1976-07-08 09:10:11.123000',             // c72 period(timestamp)
        '1970-01-02 03:04:05+05:30,1976-07-08 09:10:11+05:30',               // c73 period(timestamp(0) with time zone)
        '1970-01-02 03:04:05.123456+05:30,1976-07-08 09:10:11.123456+05:30', // c74 period(timestamp with time zone)
      ], //  end row 9
      [  //  row 10 contains null values
        10,                                     //  c1 integer
        null,                                   //  c2 byteint
        null,                                   //  c3 smallint
        null,                                   //  c4 integer
        null,                                   //  c5 bigint
        null,                                   //  c6 float
        null,                                   //  c7 varchar(10)
        null,                                   //  c8 char(8)
        null,                                   //  c9 varbyte(10)
        null,                                   // c10 byte(5)
        null,                                   // c11 decimal(2)
        null,                                   // c12 decimal (2,1)
        null,                                   // c13 decimal (4)
        null,                                   // c14 decimal (4,2)
        null,                                   // c15 decimal (9)
        null,                                   // c16 decimal (9,4)
        null,                                   // c17 decimal (18)
        null,                                   // c18 decimal (18,4)
        null,                                   // c19 decimal (38)
        null,                                   // c20 decimal (38,5)
        null,                                   // c21 number
        null,                                   // c22 date
        null,                                   // c23 date
        null,                                   // c24 time
        null,                                   // c25 time
        null,                                   // c26 time(0) with time zone
        null,                                   // c27 time with time zone
        null,                                   // c28 timestamp(0)
        null,                                   // c29 timestamp
        null,                                   // c30 timestamp(0) with time zone
        null,                                   // c31 timestamp with time zone
        null,                                   // c32 interval year
        null,                                   // c33 interval year(4)
        null,                                   // c34 interval year to month
        null,                                   // c35 interval year(4) to month
        null,                                   // c36 interval month
        null,                                   // c37 interval month(4)
        null,                                   // c38 interval day
        null,                                   // c39 interval day(4)
        null,                                   // c40 interval day to hour
        null,                                   // c41 interval day(4) to hour
        null,                                   // c42 interval day to minute
        null,                                   // c43 interval day(4) to minute
        null,                                   // c44 interval day to second(0)
        null,                                   // c45 interval day to second
        null,                                   // c46 interval day(4) to second(0)
        null,                                   // c47 interval day(4) to second
        null,                                   // c48 interval hour
        null,                                   // c49 interval hour(4)
        null,                                   // c50 interval hour to minute
        null,                                   // c51 interval hour(4) to minute
        null,                                   // c52 interval hour to second(0)
        null,                                   // c53 interval hour to second
        null,                                   // c54 interval hour(4) to second(0)
        null,                                   // c55 interval hour(4) to second
        null,                                   // c56 interval minute
        null,                                   // c57 interval minute(4)
        null,                                   // c58 interval minute to second(0)
        null,                                   // c59 interval minute to second
        null,                                   // c60 interval minute(4) to second(0)
        null,                                   // c61 interval minute(4) to second
        null,                                   // c62 interval second(2,0)
        null,                                   // c63 interval second
        null,                                   // c64 interval second(4,0)
        null,                                   // c65 interval second(4)
        null,                                   // c66 period(date)
        null,                                   // c67 period(time(0))
        null,                                   // c68 period(time)
        null,                                   // c69 period(time(0) with time zone)
        null,                                   // c70 period(time with time zone)
        null,                                   // c71 period(timestamp(0))
        null,                                   // c72 period(timestamp)
        null,                                   // c73 period(timestamp(0) with time zone)
        null,                                   // c74 period(timestamp with time zone)
      ], //  end row 10
    ];

    let rowCount: number = 0;
    let fetchedRows: any[] = null;
    const sQuery: string = 'SELECT * FROM ' + sTableName + ' ORDER BY 1';

    try {
      cursor.execute(iQuery, values);
      cursor.execute(sQuery);
      rowCount = cursor.rowcount;
      fetchedRows = cursor.fetchall();
    } catch (error) {
      logger.errorLogMessage(error.message);
    } finally {
      expect(fetchedRows).to.deep.equal(expectedRows);
      expect(rowCount).equals(10);
      done();
    }
  });
});
