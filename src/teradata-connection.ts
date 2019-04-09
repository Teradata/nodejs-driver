// Get the Teradata Native Binding
let fastcall: any;
/* tslint:disable-next-line */
// let platform: string = (typeof window !== 'undefined' && (<any>window)['process']) ? 'electron' : 'node';
let platform: string = 'node';
let abiVersion: string = process.versions.modules;

if (process.platform === 'win32') {
  /* tslint:disable-next-line */
  fastcall = require('teradata-prebuilt-fastcall-win32-' + platform + '-v' + abiVersion);
} else if (process.platform === 'darwin') {
  /* tslint:disable-next-line */
  fastcall = require('teradata-prebuilt-fastcall-darwin-' + platform + '-v' + abiVersion);
} else if (process.platform === 'freebsd') {
  /* tslint:disable-next-line */
  fastcall = require('teradata-prebuilt-fastcall-freebsd-' + platform + '-v' + abiVersion);
} else if (process.platform === 'linux') {
  /* tslint:disable-next-line */
  fastcall = require('teradata-prebuilt-fastcall-linux-' + platform + '-v' + abiVersion);
}

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
  private library: any;
  private ref: any;
  private byteArray: any;
  private logLevel: number;
  private logger: TeradataLogging;
  private sVersionNumber: string = '425ed53096b71d851d115e4dfcc12562f53c968a'; // Version Number

  constructor() {
    this.poolHandle = null;
    this.library = fastcall.Library;
    this.ref = fastcall.ref;
    const ArrayType: any = fastcall.ArrayType;
    this.byteArray = new ArrayType('byte');
    this.logLevel = 0;
    this.logger = new TeradataLogging(this.logLevel);

    // Setup function call mode for fastcall.library
    const options: {} = {
      defaultCallMode: 1, // callMode.sync
      syncMode: 0,        // defs.syncMode.none
    };

    // Setup libpath for fastcall.library
    let libpath: string = '';
    if (process.platform === 'win32') {
      libpath = __dirname + '/node_modules/teradata-nativelib-win32/teradatasql.dll';
    } else if (process.platform === 'darwin') {
      libpath = __dirname + '/node_modules/teradata-nativelib-darwin/teradatasql.dylib';
    } else if (process.platform === 'freebsd' || process.platform === 'linux') {
      libpath = __dirname + '/node_modules/teradata-nativelib-linux/teradatasql.so';
    }

    // Load native library with libpath and options
    this.lib = new this.library(libpath, options);

    // Declare functions
    this.lib.function({jsgoCreateConnection: ['void', ['long', 'char*', 'char*', 'char**', this.ref.refType(this.ref.types.ulonglong)]]});
    this.lib.function({jsgoCloseConnection: ['void', ['long', 'long', 'char**']]});
    this.lib.function({jsgoCreateRows: ['void', ['long', 'long', 'char*', 'long', 'void*', 'char**', this.ref.refType(this.ref.types.ulonglong)]] });
    this.lib.function({jsgoFetchRow: ['void', ['long', 'long', 'char**', this.ref.refType(this.ref.types.int), 'void**']] });
    this.lib.function({jsgoResultMetaData: ['void', ['long', 'long', 'char**',
                                         this.ref.refType(this.ref.types.ulonglong), this.ref.refType(this.ref.types.int), 'void**']] });
    this.lib.function({jsgoNextResult: ['void', ['long', 'long', 'char**', 'char*']] });
    this.lib.function({jsgoCloseRows: ['void', ['long', 'long', 'char**']] });
    this.lib.function({jsgoFreePointer: ['void', ['long', 'void*']] });
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
      const jsgoFreePointer: any = this.lib.interface.jsgoFreePointer;
      const inputString: any = this.ref.allocCString(JSON.stringify(databaseConnParams));
      const sVersionNumberPtr: any = this.ref.allocCString(this.sVersionNumber);
      const cStringPtrType: any = this.ref.refType(this.ref.types.char);
      const jsgoCreateConnection: any = this.lib.interface.jsgoCreateConnection;
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
      const jsgoCloseConnection: any = this.lib.interface.jsgoCloseConnection;
      const jsgoFreePointer: any = this.lib.interface.jsgoFreePointer;
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
