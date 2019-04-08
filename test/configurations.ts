import { ITDConnParams } from '../src/teradata-connection';

export const connParams: ITDConnParams = {
  host: '<host>',
  log: '1',
  password: '<password>',
  user: '<username>',
};

export const badConnParams: ITDConnParams = {
  host: 'foo',
  log: '1',
  password: 'foobar',
  user: 'bar',
};
