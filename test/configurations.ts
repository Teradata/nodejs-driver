import { ITDConnParams } from '../src/teradata-connection';

export const connParams: ITDConnParams = {
  host: '127.0.0.1',
  log: '0',
  password: 'TD01',
  user: 'TD01',
};

export const badConnParams: ITDConnParams = {
  host: 'foo',
  log: '1',
  password: 'foobar',
  user: 'bar',
};
