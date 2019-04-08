export class Warning extends Error {
  constructor(message?: string) {
    super(message);
    const actualProto: OperationalError = new.target.prototype;
    Object.setPrototypeOf(this, actualProto);
  }
}

export class MakeError extends Error {
  constructor(message?: string) {
    super(message);
    const actualProto: OperationalError = new.target.prototype;
    Object.setPrototypeOf(this, actualProto);
  }
}

export class InterfaceError extends Error {
  constructor(message?: string) {
    super(message);
    const actualProto: OperationalError = new.target.prototype;
    Object.setPrototypeOf(this, actualProto);
  }
}

export class DriverError extends Error {
  constructor(message?: string) {
    super(message);
    const actualProto: OperationalError = new.target.prototype;
    Object.setPrototypeOf(this, actualProto);
  }
}

export class DatabaseError extends Error {
  constructor(message?: string) {
    super(message);
    const actualProto: OperationalError = new.target.prototype;
    Object.setPrototypeOf(this, actualProto);
  }
}

export class DataError extends DatabaseError {
  constructor(message?: string) {
    super(message);
    const actualProto: OperationalError = new.target.prototype;
    Object.setPrototypeOf(this, actualProto);
  }
}

export class IntegrityError extends DatabaseError {
  constructor(message?: string) {
    super(message);
    const actualProto: OperationalError = new.target.prototype;
    Object.setPrototypeOf(this, actualProto);
  }
}

export class OperationalError extends DatabaseError {
  constructor(message?: string) {
    super(message);
    const actualProto: OperationalError = new.target.prototype;
    Object.setPrototypeOf(this, actualProto);
  }
}

export class NotSupportedError extends DatabaseError {
  constructor(message?: string) {
    super(message);
    const actualProto: OperationalError = new.target.prototype;
    Object.setPrototypeOf(this, actualProto);
  }
}

export class ProgrammingError extends DatabaseError {
  constructor(message?: string) {
    super(message);
    const actualProto: OperationalError = new.target.prototype;
    Object.setPrototypeOf(this, actualProto);
  }
}
