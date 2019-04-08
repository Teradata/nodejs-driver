
export class TeradataLogging {
  private traceLog: boolean = false;
  private debugLog: boolean = false;
  private dumpLog: boolean = false;

  constructor(logLevel: number = 0) {
    // normally don't allow bitwise operations but are here
    /* tslint:disable-next-line */
    this.traceLog = (logLevel & 1) !== 0;
    /* tslint:disable-next-line */
    this.debugLog = (logLevel & 2) !== 0;
    /* tslint:disable-next-line */
    this.dumpLog = (logLevel & 4) !== 0;
  }

  infoLogMessage(message: any, jsonStringify?: boolean): void {
    if (jsonStringify) {
      message = JSON.stringify(message);
    }
    /* tslint:disable-next-line */
    console.log(message);
  }

  errorLogMessage(message: any, jsonStringify?: boolean): void {
    if (jsonStringify) {
      message = JSON.stringify(message);
    }
    /* tslint:disable-next-line */
    console.log(message);
  }

  traceLogMessage(message: any, jsonStringify?: boolean): void {
    if (this.traceLog) {
      if (jsonStringify) {
        message = JSON.stringify(message);
      }
      /* tslint:disable-next-line */
      console.log(message);
    }
  }

  debugLogMessage(message: any, jsonStringify?: boolean): void {
    if (this.debugLog) {
      if (jsonStringify) {
        message = JSON.stringify(message);
      }
      /* tslint:disable-next-line */
      console.log(message);
    }
  }

  dumpLogMessage(message: any, jsonStringify?: boolean): void {
    if (this.dumpLog) {
      if (jsonStringify) {
        message = JSON.stringify(message);
      }
      /* tslint:disable-next-line */
      console.log(message);
    }
  }
}
