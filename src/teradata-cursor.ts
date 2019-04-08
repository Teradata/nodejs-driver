import { TeradataConnection } from './teradata-connection';
import { TeradataLogging } from './teradata-logging';
import { DriverError, OperationalError } from './teradata-exceptions';

const BINARY: string = 'Uint8Array';
const DATE: string = 'Date';
const NUMBER: string = 'number';
const STRING: string = 'string';

export class TeradataCursor {
  // Private properties
  private desc: any[];
  private rowCount: number;
  private arraySize: number = 1;
  private rowNumber: number;
  private conn: TeradataConnection;
  private uRowsHand: number;
  private rowTerminator: string = 'Z';
  private rowTerminatorTA: Uint8Array;
  private abyBindValues: Uint8Array;
  private lib: any;
  private ref: any;
  private byteArray: any;
  private logger: TeradataLogging;

  constructor(connection: TeradataConnection, fastcallLib: any, fastcallRef: any, fastcallByteArray: any) {
    this.conn = connection;
    this.lib = fastcallLib;
    this.ref = fastcallRef;
    this.byteArray = fastcallByteArray;
    this.logger = new TeradataLogging(this.conn.uLog);
    this.rowTerminatorTA = new Uint8Array(this.rowTerminator.length);
    this.rowTerminatorTA[0] = this.rowTerminator.charCodeAt(0);
  }

  // getter methods for all DBAPI 2.0 attributes
  // https://www.python.org/dev/peps/pep-0249/#cursor-attributes

  get description(): any[] {
    return this.desc;
  }

  get rowcount(): number {
    return this.rowCount;
  }

  get rownumber(): number {
    return this.rowNumber;
  }

  get connection(): TeradataConnection {
    return this.conn;
  }

  get uRowsHandle(): number {
    return this.uRowsHand;
  }

  // All DBAPI 2.0 methods
  // https://www.python.org/dev/peps/pep-0249/#cursor-methods

  callproc(procname: string, parameters?: any[]): void {
    this.logger.traceLogMessage('entering callproc()');
    try {
      let sCall: string = '{CALL ' + procname;
      if (parameters) {
        sCall += ' (';
        for (let i: number = 0; i < parameters.length; i++) {
          if (i > 0) {
            sCall += ',';
          }
          sCall += '?';
        }
        sCall += ')';
      }
      sCall += '}';
      this.logger.traceLogMessage('sCall=' + sCall);
      this.execute(sCall, parameters);
    } finally {
      this.logger.traceLogMessage('leaving callproc()');
    }
  }

  close(): void {
    this.logger.traceLogMessage('entering close()');
    try {
      const jsgoCloseRows: any = this.lib.interface.jsgoCloseRows;
      const jsgoFreePointer: any = this.lib.interface.jsgoFreePointer;
      const cStringPtrType: any = this.ref.refType(this.ref.types.char);
      const outputPtrPtr: any = this.ref.alloc(cStringPtrType);

      jsgoCloseRows(this.conn.uLog, this.uRowsHand, outputPtrPtr);

      this.uRowsHand = null; // reset uRowsHandle

      let outputString: Buffer = this.ref.allocCString('');
      outputString = this.ref.deref(outputPtrPtr);
      if (outputString.length > 0) {
        let msg: string = this.ref.readCString(outputString);
        jsgoFreePointer(this.conn.uLog, outputString);
        throw new OperationalError(msg);
      }
    } finally {
      this.logger.traceLogMessage('leaving close()');
    }
  }

  execute(operation: string, parameters?: any[]): void {
    this.logger.traceLogMessage('entering execute()');
    try {
      if ((parameters === undefined) || (parameters === null)) {
        this.executemany(operation, null);
      } else if (Array.isArray(parameters[0])) {
        this.executemany(operation, parameters);
      } else {
        this.executemany(operation, [parameters]);
      }
    } finally {
      this.logger.traceLogMessage('leaving execute()');
    }
  }

  executemany(procname: string, seqOfParameters: any[]): void {

    this.logger.traceLogMessage('entering executemany()');
    this.logger.debugLogMessage(seqOfParameters, true);

    try {
      const jsgoCreateRows: any = this.lib.interface.jsgoCreateRows;
      const jsgoFreePointer: any = this.lib.interface.jsgoFreePointer;
      const procnamePtr: any = this.ref.allocCString(procname);

      let abyBindValuesBuffer: Buffer = Buffer.allocUnsafe(0);
      if (seqOfParameters !== null) {
        for (const row of seqOfParameters) {
          this.logger.debugLogMessage(row, true);
          let rowBuffer: Buffer = Buffer.allocUnsafe(0);
          for (const field of row) {
            this.logger.debugLogMessage(field, true);
            let ao: Buffer = Buffer.allocUnsafe(0);
            if (field === undefined) {
              ao = this.serializeNull();
            } else if (field === null) {
              ao = this.serializeNull();
            } else if (typeof field === 'number') {
              ao = this.serializeNumber(field);
            } else if (typeof field === 'string') {
              ao = this.serializeString(field);
            } else if (field instanceof Uint8Array) {
              ao = this.serializeBytes(field);
            } else if (field instanceof Date) {
              ao = this.serializeDate(field);
            } else {
              throw new TypeError('Unexpected data type for IMPORT.');
            }
            this.logger.debugLogMessage(ao, true);
            rowBuffer = Buffer.concat([rowBuffer, ao]);
          } // end of row
          rowBuffer = Buffer.concat([rowBuffer, this.rowTerminatorTA]); // end of row terminator
          this.logger.debugLogMessage(rowBuffer, true);
          abyBindValuesBuffer = Buffer.concat([abyBindValuesBuffer, rowBuffer]);
        } // end of all rows
      } // end if seqOfParameters

      abyBindValuesBuffer = Buffer.concat([abyBindValuesBuffer, this.rowTerminatorTA]); // end of all rows terminator
      this.logger.debugLogMessage(abyBindValuesBuffer, true);

      // Close the current handle *after* the insert row is built/validated.
      // Othereise, the handle becomes invalid without getting a new handle
      // if there is an error thrown above.
      if (this.uRowsHand) {
        this.close();
      }

      // create Uint8Array from Buffer
      const arrayBuffer: ArrayBuffer = abyBindValuesBuffer.buffer.slice(
                                            abyBindValuesBuffer.byteOffset, abyBindValuesBuffer.byteOffset + abyBindValuesBuffer.length);
      this.abyBindValues = new Uint8Array(arrayBuffer);
      for (let i: number = 0; i < abyBindValuesBuffer.length; ++i) {
        this.abyBindValues[i] = abyBindValuesBuffer[i];
      }

      const cStringPtrType: any = this.ref.refType(this.ref.types.char);
      const outputPtrPtr: any = this.ref.alloc(cStringPtrType);
      const rowsHandlePtr: any = this.ref.alloc(this.ref.types.ulonglong);
      jsgoCreateRows(this.conn.uLog, this.conn.uPoolHandle, procnamePtr, this.abyBindValues.length, this.abyBindValues, outputPtrPtr, rowsHandlePtr);

      let outputString: Buffer = this.ref.allocCString('');
      outputString = this.ref.deref(outputPtrPtr);
      if (outputString.length > 0) {
        let msg: string = this.ref.readCString(outputString);
        jsgoFreePointer(this.conn.uLog, outputString);
        throw new OperationalError(msg);
      }

      if (rowsHandlePtr) {
        this.uRowsHand = this.ref.readUInt64LE(rowsHandlePtr);
      } else {
        throw new OperationalError('rowsHandlePtr is null.');
      }

      this._obtainResultMetaData();
    } finally {
      this.logger.traceLogMessage('leaving executemany()');
    }
  } // end executemany

  fetchone(): any[] {
    this.logger.traceLogMessage('entering fetchone()');
    try {
      return this.next();
    } catch (error) {
      if ((error instanceof OperationalError) &&
      (error.message === 'StopIteration')) {
        return null;
      } else {
        throw error;
      }
    } finally {
      this.logger.traceLogMessage('leaving fetchone()');
    }
  }

  fetchmany(nDesiredRowCount?: number): any[] {
    this.logger.traceLogMessage('entering fetchmany()');
    try {
      if (!nDesiredRowCount) {
        nDesiredRowCount = this.arraySize;
      }

      const rows: any[] = new Array();
      let nObservedRowCount: number = 0;
      let aRow: any[] = this.fetchone();
      while (aRow) { // while a row is not null
        rows.push(aRow);
        nObservedRowCount += 1;
        if (nObservedRowCount === nDesiredRowCount) {
          break;
        } else {
          aRow = this.fetchone();
        }
      }
      return rows;
    } finally {
      this.logger.traceLogMessage('leaving fetchmany()');
    }
  }

  fetchall(): any[] {
    this.logger.traceLogMessage('entering fetchall()');
    try {
      const rows: any[] = new Array();
      let aRow: any[] = this.fetchone();
      while (aRow) {
        rows.push(aRow);
        aRow = this.fetchone();
      }
      return rows;
    } finally {
      this.logger.traceLogMessage('leaving fetchall()');
    }
  }

  nextset(): boolean {
    this.logger.traceLogMessage('entering nextset()');
    try {
      if (this.uRowsHandle) {
        const jsgoNextResult: any = this.lib.interface.jsgoNextResult;
        const jsgoFreePointer: any = this.lib.interface.jsgoFreePointer;
        const cStringPtrType: any = this.ref.refType(this.ref.types.char);
        const outputPtrPtr: any = this.ref.alloc(cStringPtrType);
        const availPtr: any = this.ref.allocCString('C');

        jsgoNextResult(this.conn.uLog, this.uRowsHand, outputPtrPtr, availPtr);

        let outputString: Buffer = this.ref.allocCString('');
        outputString = this.ref.deref(outputPtrPtr);
        if (outputString.length > 0) {
          let msg: string = this.ref.readCString(outputString);
          jsgoFreePointer(this.conn.uLog, outputString);
          throw new OperationalError(msg);
        }

        if (this.ref.readCString(availPtr) === 'Y') {
          this._obtainResultMetaData();
          return true;
        } else {
          this.desc = null;
          this.rowCount = -1;
          return false;
        }
      } else {
        return false;
      }
    } finally {
      this.logger.traceLogMessage('leaving nextset()');
    }
  } // end nextset

  setinputsizes(sizes: number): void {
    // do something
  }

  setoutputsize(size: number, column: number): void {
    // do something
  }

  next(): any[] {
    this.logger.traceLogMessage('entering next()');
    try {
      if (this.uRowsHandle) {
        const jsgoFetchRow: any = this.lib.interface.jsgoFetchRow;
        const jsgoFreePointer: any = this.lib.interface.jsgoFreePointer;
        const cStringPtrType: any = this.ref.refType(this.ref.types.char);
        const outputPtrPtr: any = this.ref.alloc(cStringPtrType);
        const columnValuesByteCountPtr: any = this.ref.alloc(this.ref.types.int);
        const outByteArray: any = this.ref.refType(this.byteArray);
        const byteArrayPtrPtr: any = this.ref.alloc(outByteArray);

        jsgoFetchRow(this.conn.uLog, this.uRowsHand, outputPtrPtr, columnValuesByteCountPtr, byteArrayPtrPtr);

        let outputString: Buffer = this.ref.allocCString('');
        outputString = this.ref.deref(outputPtrPtr);
        if (outputString.length > 0) {
          let msg: string = this.ref.readCString(outputString);
          jsgoFreePointer(this.conn.uLog, outputString);
          throw new OperationalError(msg);
        }

        const rowsLength: number = this.ref.deref(columnValuesByteCountPtr);
        const byteArrayPtr: any = this.ref.deref(byteArrayPtrPtr);

        if (byteArrayPtr.length !== 0) { // indicate there is a row
          const row: any[] = [];
          let i: number = 0;
          const byteBuffer: Buffer = Buffer.from(this.ref.reinterpret(byteArrayPtr, rowsLength, 0));
          while (byteBuffer[i] !== 'Z'.charCodeAt(0)) { // Z=row terminator
            let iNew: number = 0;
            if (byteBuffer[i] === 'B'.charCodeAt(0)) { // B=bytes
              iNew = this.deserializeBytes(byteBuffer, i, row);
            } else if (byteBuffer[i] === 'D'.charCodeAt(0)) { // D=double/float
              iNew = this.deserializeDouble(byteBuffer, i, row);
            } else if (byteBuffer[i] === 'I'.charCodeAt(0)) { // I=integer
              iNew = this.deserializeInt(byteBuffer, i, row);
            } else if (byteBuffer[i] === 'L'.charCodeAt(0)) { // L=long
              iNew = this.deserializeLong(byteBuffer, i, row);
            } else if (byteBuffer[i] === 'M'.charCodeAt(0)) { // M=double/float
              iNew = this.deserializeNumber(byteBuffer, i, row);
            } else if (byteBuffer[i] === 'N'.charCodeAt(0)) { // N=null
              iNew = this.deserializeNull(byteBuffer, i, row);
            } else if (byteBuffer[i] === 'S'.charCodeAt(0)) { // S=string
              iNew = this.deserializeString(byteBuffer, i, row);
            } else if (byteBuffer[i] === 'U'.charCodeAt(0)) { // U=date
              iNew = this.deserializeDate(byteBuffer, i, row);
            } else if (byteBuffer[i] === 'V'.charCodeAt(0)) { // V=time
              iNew = this.deserializeTime(byteBuffer, i, row);
            } else if (byteBuffer[i] === 'W'.charCodeAt(0)) { // W=time with time zone
              iNew = this.deserializeTimeWithTimeZone(byteBuffer, i, row);
            } else if (byteBuffer[i] === 'X'.charCodeAt(0)) { // X=timestamp
              iNew = this.deserializeTimestamp(byteBuffer, i, row);
            } else if (byteBuffer[i] === 'Y'.charCodeAt(0)) { // Y=timestamp with time zone
              iNew = this.deserializeTimestampWithTimeZone(byteBuffer, i, row);
            } else {
              throw new OperationalError('Unknown Data Type:' + String.fromCharCode(byteBuffer[i]) + '.');
            }
            i = iNew;
          } // end while
          this.logger.dumpLogMessage(row, true);
          jsgoFreePointer(this.conn.uLog, byteArrayPtr);
          return row;
        } // end if rowsLength > 0
      } // end if uRowsHandle

      // throw StopIteration
      this.logger.debugLogMessage('End of rows', false);
      throw new OperationalError('StopIteration');

    } finally {
      this.logger.traceLogMessage('leaving next()');
    }
  } // end next

  private _obtainResultMetaData(): void {
    this.logger.traceLogMessage('entering _obtainResultMetaData()');
    try {
      const jsgoResultMetaData: any = this.lib.interface.jsgoResultMetaData;
      const jsgoFreePointer: any = this.lib.interface.jsgoFreePointer;
      const cStringPtrType: any = this.ref.refType(this.ref.types.char);
      const outputPtrPtr: any = this.ref.alloc(cStringPtrType);
      const metaDataByteCountPtr: any = this.ref.alloc(this.ref.types.int);
      const outByteArray: any = this.ref.refType(this.byteArray);
      const byteArrayPtrPtr: any = this.ref.alloc(outByteArray);
      const uActivityCount: any = this.ref.alloc(this.ref.types.ulonglong);

      jsgoResultMetaData(this.conn.uLog, this.uRowsHand, outputPtrPtr, uActivityCount, metaDataByteCountPtr, byteArrayPtrPtr);

      let outputString: Buffer = this.ref.allocCString('');
      outputString = this.ref.deref(outputPtrPtr);
      if (outputString.length > 0) {
        let msg: string = this.ref.readCString(outputString);
        jsgoFreePointer(this.conn.uLog, outputString);
        throw new OperationalError(msg);
      }

      this.rowCount = this.ref.readUInt64LE(uActivityCount);

      const byteArrayPtr: any = this.ref.deref(byteArrayPtrPtr);
      const metadataLength: number = this.ref.deref(metaDataByteCountPtr);

      if (metadataLength > 0) {
        this.desc = [];
        let i: number = 0;
        const pcColumnMetaData: Buffer = Buffer.from(this.ref.reinterpret(byteArrayPtr, metadataLength, 0));

        while (pcColumnMetaData[i] !== 'Z'.charCodeAt(0)) { // Z=row terminator
          const columnDesc: any[] = [];

          // (1) Column name
          i = this.deserializeString (pcColumnMetaData, i, columnDesc);

          i = this.deserializeString (pcColumnMetaData, i, null); // discard Type name

          // (2) Type code
          i = this.deserializeString (pcColumnMetaData, i, columnDesc);

          if (columnDesc[columnDesc.length - 1] === 'b') { // typeCode b=bytes
            columnDesc[columnDesc.length - 1] = BINARY;
          } else if (columnDesc[columnDesc.length - 1] === 'd') { // typeCode d=double
            columnDesc[columnDesc.length - 1] = NUMBER;
          } else if ((columnDesc[columnDesc.length - 1] === 'i') ||
                     (columnDesc[columnDesc.length - 1] === 'l')) { // typeCode i=integer (int32), l=long (int64)
            columnDesc[columnDesc.length - 1] = NUMBER;
          } else if (columnDesc[columnDesc.length - 1] === 'm') { // typeCode m=number
            columnDesc[columnDesc.length - 1] = NUMBER;
          } else if (columnDesc[columnDesc.length - 1] === 's') { // typeCode s=string
            columnDesc[columnDesc.length - 1] = STRING;
          } else if (columnDesc[columnDesc.length - 1] === 'u') { // typeCode u=date
            columnDesc[columnDesc.length - 1] = DATE;
          } else if (columnDesc[columnDesc.length - 1] === 'v' ||
                     columnDesc[columnDesc.length - 1] === 'w') { // typeCode v=time, w=time with time zone
            columnDesc[columnDesc.length - 1] = STRING;
          } else if (columnDesc[columnDesc.length - 1] === 'x' ||
                     columnDesc[columnDesc.length - 1] === 'y') { // typeCode x=timestamp, y=timestamp with time zone
            columnDesc[columnDesc.length - 1] = STRING;
          }

          // (3) Display size
          columnDesc.push(null); // not provided

          // (4) Max byte count
          i = this.deserializeLong (pcColumnMetaData, i, columnDesc);

          // (5) Precision
          i = this.deserializeLong (pcColumnMetaData, i, columnDesc);

          // (6) Scale
          i = this.deserializeLong (pcColumnMetaData, i, columnDesc);

          // (7) Nullable
          i = this.deserializeBool (pcColumnMetaData, i, columnDesc);

          this.logger.dumpLogMessage(columnDesc, false);
          this.desc.push(columnDesc);
        } // end while

        jsgoFreePointer(this.conn.uLog, byteArrayPtr);

      } // end if rowsLength > 0

    } finally {
      this.logger.traceLogMessage('leaving _obtainResultMetaData()');
    }
  }

  private deserializeBool(pc: Buffer, i: number, row: any[]): number {
    this.logger.debugLogMessage('deserializing bool');
    if ((pc[i] === 'T'.charCodeAt(0)) || (pc[i] === 'F'.charCodeAt(0))) { // T=true, F=false
      if (row) {
        row.push((pc[i] === 'T'.charCodeAt(0)));
      }
      return i + 1;
    } else if (pc[i] === 'N'.charCodeAt(0)) { // N=null
      return this.deserializeNull(pc, i, row);
    } else {
      throw new OperationalError('Expected column type T/F/N.');
      return 0;
    }
  }

  private deserializeBytes(pc: Buffer, i: number, row: any[]): number {
    this.logger.debugLogMessage('deserializing bytes');
    if (pc[i] === 'B'.charCodeAt(0)) { // B=bytes
      i += 1;
      const uFourByte: number = pc.readUInt32BE(i);
      if (uFourByte > 0) {
        throw new DriverError('Field length > 2^32 not supported.');
      }
      i += 4;
      const uByteCount: number = pc.readUInt32BE(i);
      i += 4;

      const abyBuffer: Buffer = pc.slice(i, i + uByteCount);
      const abyValue: Uint8Array = new Uint8Array(abyBuffer);
      i += uByteCount;
      if (row) {
        row.push(abyValue);
      }
      return i;
    } else if (pc[i] === 'N'.charCodeAt(0)) { // N=null
      return this.deserializeNull(pc, i, row);
    } else {
      throw new OperationalError('Expected column type B/N.');
      return 0;
    }
  }

  private deserializeCharacterValue(abyTypeCode: number, pc: Buffer, i: number, row: any[]): number {
    if (pc[i] === abyTypeCode) {
      i += 1;

      const uFourByte: number = pc.readUInt32BE(i);
      if (uFourByte > 0) {
        throw new DriverError('Field length > 2^32 not supported.');
      }
      i += 4;

      const uByteCount: number = pc.readUInt32BE(i);
      i += 4;

      const sValue: string = pc.toString('utf8', i, i + uByteCount);
      i += uByteCount;

      if (row) {
        if (abyTypeCode === 'M'.charCodeAt(0)) { // M=number
          row.push(Number(sValue));
        } else if (abyTypeCode === 'U'.charCodeAt(0)) { // U=date
          row.push(new Date(sValue));
        } else {
          row.push(sValue);
        }
      }
      return i;
    } else if (pc[i] === 'N'.charCodeAt(0)) { // N=null
      return this.deserializeNull(pc, i, row);
    } else {
      throw new OperationalError('Expected column type ' + String.fromCharCode(abyTypeCode) + '/N.');
      return 0;
    }
  }

  private deserializeDate(pc: Buffer, i: number, row: any[]): number {
    this.logger.debugLogMessage('deserializing date');
    return this.deserializeCharacterValue('U'.charCodeAt(0), pc, i, row);
  }

  private deserializeDouble(pc: Buffer, i: number, row: any[]): number {
    this.logger.debugLogMessage('deserializing double');
    if (pc[i] === 'D'.charCodeAt(0)) { // D=double/float
      i += 1;
      const dValue: number = pc.readDoubleBE(i);
      i += 8;
      if (row) {
        row.push(dValue);
      }
      return i;
    } else if (pc[i] === 'N'.charCodeAt(0)) { // N=null
      return this.deserializeNull(pc, i, row);
    } else {
      throw new OperationalError('Expected column type D/N.');
      return 0;
    }
  }

  private deserializeInt(pc: Buffer, i: number, row: any[]): number {
    this.logger.debugLogMessage('deserializing int');
    if (pc[i] === 'I'.charCodeAt(0)) { // I=integer
      i += 1;
      const nValue: number = pc.readInt32BE(i);
      i += 4;
      if (row) {
        row.push(nValue);
      }
      return i;
    } else if (pc[i] === 'N'.charCodeAt(0)) { // N=null
      return this.deserializeNull(pc, i, row);
    } else {
      throw new OperationalError('Expected column type I/N.');
      return 0;
    }
  }

  private deserializeLong(pc: Buffer, i: number, row: any[]): number {
    this.logger.debugLogMessage('deserializing long');
    return this.deserializeCharacterValue('L'.charCodeAt(0), pc, i, row);
  }

  private deserializeNull(pc: Buffer, i: number, row: any[]): number {
    this.logger.debugLogMessage('deserializing null');
    if (pc[i] === 'N'.charCodeAt(0)) { // N=null
      if (row) {
        row.push(null);
      }
      return i + 1;
    } else {
      throw new OperationalError('Expected column type N.');
      return 0;
    }
  }

  private deserializeNumber(pc: Buffer, i: number, row: any[]): number {
    this.logger.debugLogMessage('deserializing number');
    return this.deserializeCharacterValue('M'.charCodeAt(0), pc, i, row);
  }

  private deserializeString(pc: Buffer, i: number, row: any[]): number {
    this.logger.debugLogMessage('deserializing string');
    return this.deserializeCharacterValue('S'.charCodeAt(0), pc, i, row);
  }

  private deserializeTime(pc: Buffer, i: number, row: any[]): number {
    this.logger.debugLogMessage('deserializing time');
    return this.deserializeCharacterValue('V'.charCodeAt(0), pc, i, row);
  }

  private deserializeTimeWithTimeZone(pc: Buffer, i: number, row: any[]): number {
    this.logger.debugLogMessage('deserializing time with time zone');
    return this.deserializeCharacterValue('W'.charCodeAt(0), pc, i, row);
  }

  private deserializeTimestamp(pc: Buffer, i: number, row: any[]): number {
    this.logger.debugLogMessage('deserializing timestamp');
    return this.deserializeCharacterValue('X'.charCodeAt(0), pc, i, row);
  }

  private deserializeTimestampWithTimeZone(pc: Buffer, i: number, row: any[]): number {
    this.logger.debugLogMessage('deserializing timestamp with time zone');
    return this.deserializeCharacterValue('Y'.charCodeAt(0), pc, i, row);
  }

  private serializeBytes(arr: Uint8Array): Buffer {
    this.logger.debugLogMessage('serializing bytes');
    let ao: Buffer = Buffer.alloc(9);
    ao.writeUInt8('B'.charCodeAt(0), 0);
    if (arr.length > Math.pow(2, 32)) {
      throw new DriverError('Field length > 2^32 not supported.');
    }
    ao.writeUInt32BE(arr.length, 5);
    const buf: Buffer = Buffer.from(arr);
    ao = Buffer.concat([ao, buf]);
    return ao;
  }

  private serializeCharacterValue(abyTypeCode: number, s: string): Buffer {
    const aby: Buffer = Buffer.from(s, 'utf8');
    let ao: Buffer = Buffer.alloc(9);
    ao.writeUInt8(abyTypeCode, 0);
    if (aby.byteLength > Math.pow(2, 32)) {
      throw new DriverError('Field length > 2^32 not supported.');
    }
    ao.writeUInt32BE(aby.byteLength, 5);
    ao = Buffer.concat([ao, aby]);
    return ao;
  }

  private serializeDate(d: Date): Buffer {
    this.logger.debugLogMessage('serializing date');
    const s: string = d.toISOString().slice(0, 10); // example output: 2011-10-05T14:48:00.000Z
    return this.serializeCharacterValue('U'.charCodeAt(0), s);
  }

  private serializeNull(): Buffer {
    this.logger.debugLogMessage('serializing null');
    const ao: Buffer = Buffer.alloc(1);
    ao.writeUInt8('N'.charCodeAt(0), 0);
    return ao;
  }

  private serializeNumber(num: number): Buffer {
    this.logger.debugLogMessage('serializing number');
    const ao: Buffer = Buffer.alloc(9);
    ao.writeUInt8('D'.charCodeAt(0), 0);
    ao.writeDoubleBE(num, 1);
    return ao;
  }

  private serializeString(s: string): Buffer {
    this.logger.debugLogMessage('serializing string');
    return this.serializeCharacterValue('S'.charCodeAt(0), s);
  }
}
