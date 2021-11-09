// Get the Teradata Native Binding
/* tslint:disable-next-line */
let ffi: any = require('ffi-napi');
/* tslint:disable-next-line */
let ref: any = require('ref-napi');
/* tslint:disable-next-line */
let ArrayType: any = require('ref-array-di')(ref);

import { TeradataCursor } from './teradata-cursor';
import { TeradataLogging } from './teradata-logging';
import { OperationalError } from './teradata-exceptions';

export interface ITDConnParams {
  account?: string;
  column_name?: string;
  dbs_port?: string;
  encryptdata?: string;
  fake_result_sets?: string;
  lob_support?: string;
  host: string;
  log?: string;
  logdata?: string;
  logmech?: string;
  max_message_body?: string;
  partition?: string;
  password: string;
  sip_support?: string;
  teradata_values?: string;
  tmode?: string;
  user: string;
}

export class TeradataConnection {

  private poolHandle: number;
  private lib: any;
  private ref: any;
  private byteArray: any;
  private logLevel: number;
  private logger: TeradataLogging;
  private sVersionNumber: string = '42659830765e8ee7b720b821cd0b35677b82dbd5'; // Version Number

  constructor() {
    this.poolHandle = null;
    this.ref = ref;
    this.byteArray = new ArrayType(this.ref.types.byte);
    this.logLevel = 0;
    this.logger = new TeradataLogging(this.logLevel);

    // find @teradataprebuilt/nativelib-${process.platform} and remove index.js from the path
    let pathToTeradataPrebuilt = require.resolve(`@teradataprebuilt/nativelib-${process.platform}`).slice(0,-9);

    // Load native library with libpath and declare functions
    this.lib = ffi.Library(`${pathToTeradataPrebuilt}/teradatasql`,
      {
        'jsgoCreateConnection': ['void', ['long', 'char*', 'char*', 'char**', this.ref.refType(this.ref.types.ulonglong)]],
        'jsgoCloseConnection': ['void', ['long', 'long', 'char**']],
        'jsgoCreateRows': ['void', ['long', 'long', 'char*', 'long', 'void*', 'char**', this.ref.refType(this.ref.types.ulonglong)]],
        'jsgoFetchRow': ['void', ['long', 'long', 'char**', this.ref.refType(this.ref.types.int), 'void**']],
        'jsgoResultMetaData': ['void', ['long', 'long', 'char**',
          this.ref.refType(this.ref.types.ulonglong), this.ref.refType(this.ref.types.int), 'void**']],
        'jsgoNextResult': ['void', ['long', 'long', 'char**', 'char*']],
        'jsgoCloseRows': ['void', ['long', 'long', 'char**']],
        'jsgoFreePointer': ['void', ['long', 'void*']],
      });
  }

  // All DBAPI 2.0 methods
  // https://www.python.org/dev/peps/pep-0249/#connection-objects

  get uLog(): number {
    return this.logLevel;
  }

  get uPoolHandle(): number {
    return this.poolHandle;
  }

  public cursor(): TeradataCursor {
    return new TeradataCursor(this, this.lib, this.ref, this.byteArray);
  }

  public connect(databaseConnParams: ITDConnParams): void {
    this.logLevel = (databaseConnParams.log ? Number(databaseConnParams.log) : 0);
    this.logger = new TeradataLogging(this.logLevel);
    this.logger.traceLogMessage('entering connect()');
    try {
      const jsgoFreePointer: any = this.lib.jsgoFreePointer;
      const inputString: any = this.ref.allocCString(JSON.stringify(databaseConnParams));
      const sVersionNumberPtr: any = this.ref.allocCString(this.sVersionNumber);
      const cStringPtrType: any = this.ref.refType(this.ref.types.char);
      const jsgoCreateConnection: any = this.lib.jsgoCreateConnection;
      const poolHandlePtr: any = this.ref.alloc(this.ref.types.ulonglong);
      const outputPtrPtr: any = this.ref.alloc(cStringPtrType);

      jsgoCreateConnection(this.uLog, sVersionNumberPtr, inputString, outputPtrPtr, poolHandlePtr);

      let outputString: Buffer = this.ref.allocCString('');
      outputString = this.ref.deref(outputPtrPtr);
      if (outputString.length > 0) {
        let msg: string = this.ref.readCString(outputString);
        jsgoFreePointer(this.uLog, outputString);
        throw new OperationalError(msg);
      }
      this.poolHandle = this.ref.readUInt64LE(poolHandlePtr);
    } finally {
      this.logger.traceLogMessage('leaving connect()');
    }
  }

  public close(): void {
    this.logger.traceLogMessage('entering close()');
    try {
      const jsgoCloseConnection: any = this.lib.jsgoCloseConnection;
      const jsgoFreePointer: any = this.lib.jsgoFreePointer;
      const cStringPtrType: any = this.ref.refType(this.ref.types.char);
      const outputPtrPtr: any = this.ref.alloc(cStringPtrType);

      jsgoCloseConnection(this.uLog, this.poolHandle, outputPtrPtr);

      let outputString: Buffer = this.ref.allocCString('');
      outputString = this.ref.deref(outputPtrPtr);
      if (outputString.length > 0) {
        let msg: string = this.ref.readCString(outputString);
        jsgoFreePointer(this.uLog, outputString);
        throw new OperationalError(msg);
      }
    } finally {
      this.logger.traceLogMessage('leaving close()');
    }
  }

  commit(): void {
    // do something
  }

  rollback(): void {
    // do something
  }
}
