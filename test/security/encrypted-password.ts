import 'mocha';
import { expect } from 'chai';
import { TeradataConnection, ITDConnParams } from '../../src/teradata-connection';
import { TeradataCursor } from '../../src/teradata-cursor';
import { connParams } from '../configurations';
import { TeradataLogging } from '../../src/teradata-logging';
import * as fs from 'fs';
import * as crypto from 'crypto';

const logger: TeradataLogging = new TeradataLogging();
const passKeyFile: string = 'PassKey.properties';
const encPassFile: string = 'EncPass.properties';
const match: string = Date.now().toString();
// need to determine based on mac algorithm for Sha1 and Sha256 it is 512 bits
const macBlockSizeBytes: number = 512 / 8;
// This is the type code for a DER octet string
const octetString: any = 0x04;

describe('\n\n\Password Encryption Tests', () => {
  const expectedRows: any[] = [
    ['TD2'],
  ];
  const algorithms: any[] = [
    {name: 'DES', sizes: [64], blockSizeBytes: 8},
    {name: 'DESede', sizes: [192], blockSizeBytes: 8},
    {name: 'AES', sizes: [128, 192, 256], blockSizeBytes: 16},
  ];
  const modes: string[] = ['CBC', 'CFB', 'OFB'];
  const paddings: string[] = ['noPadding', 'PKCS5Padding'];
  const macs: string[] = ['HmacSHA1', 'HmacSHA256'];

  let tests: any[] = [];
  let connParamsCopy: ITDConnParams;
  algorithms.forEach((algorithm: any) => {
    modes.forEach((mode: string) => {
      paddings.forEach((padding: string) => {
        algorithm.sizes.forEach((size: number) => {
          macs.forEach((mac: string) => {
            connParamsCopy = Object.assign({}, connParams);
            tests.push([connParamsCopy, algorithm.name, mode, padding, size, mac, algorithm.blockSizeBytes]);
          });
        });
      });
    });
  });

  tests.forEach((test: any[]) => {
    it('Test Encrypted Password ' + test[1] + '/' + test[2] + '/' + test[3] + '/' + test[4] + '/' + test[5], (done: any) => {
      let res: any[];
      try {
        res = testPasswordEncryption.apply(null, test);
      } catch (error) {
        logger.errorLogMessage(error.message); // unexpected error
      } finally {
        expect(res[0]).to.deep.equal(expectedRows);
        expect(res[1]).equal(res[2]); // Compare the decrypted password with the original one
        fs.unlinkSync(passKeyFile);
        fs.unlinkSync(encPassFile);
      }
      done();
    });
  });
});

describe('\n\n\Logdata Encryption Tests', () => {
  let bLDAPDbsUserExists: boolean = true;
  let connParamsCopy: ITDConnParams;
  try {
    connParamsCopy = Object.assign({}, connParams);
    connParamsCopy.user = 'guestldap';
    connParamsCopy.password = 'passLDAP01';
    const teradataConnection: TeradataConnection = new TeradataConnection();
    teradataConnection.connect(connParamsCopy);
    const cursor: TeradataCursor = teradataConnection.cursor();
    const dQuery: string = 'SELECT USER';
    cursor.execute(dQuery);
    cursor.close();
    teradataConnection.close();
  } catch (error) {
    bLDAPDbsUserExists = false;
  }

  const logMech: string = 'LDAP';
  const expectedRows: any[] = [ [logMech], ];
  const algorithms: any[] = [ {name: 'AES', sizes: [128], blockSizeBytes: 16}, ];
  const modes: string[] = ['CBC'];
  const paddings: string[] = ['noPadding'];
  const macs: string[] = ['HmacSHA1'];

  const logdatas: string[] = [
    'authcid=guestldap password=passLDAP01',
    'password=passLDAP01 authcid=guestldap',
  ];

  let tests: any[] = [];
  algorithms.forEach((algorithm: any) => {
    modes.forEach((mode: string) => {
      paddings.forEach((padding: string) => {
        algorithm.sizes.forEach((size: number) => {
          macs.forEach((mac: string) => {
            logdatas.forEach((logdata: string) => {
              connParamsCopy = Object.assign({}, connParams);
              connParamsCopy.logmech = logMech;
              connParamsCopy.logdata = logdata;
              connParamsCopy.user = '';      // Remove user and password from connection parameters.
              connParamsCopy.password = '';  // Otherwise, it returns 'Failure receiving SSO Response message header' error.
              tests.push([connParamsCopy, algorithm.name, mode, padding, size, mac, algorithm.blockSizeBytes]);
            });
          });
        });
      });
    });
  });

  tests.forEach((test: any[]) => {
    it('Test Encrypted Logdata ' + test[1] + '/' + test[2] + '/' + test[3] + '/' + test[4] + '/' + test[5], (done: any) => {
      if (bLDAPDbsUserExists) {
        let res: any[];
        try {
          res = testPasswordEncryption.apply(null, test);
        } catch (error) {
          logger.errorLogMessage(error.message); // unexpected error
        } finally {
          expect(res[0]).to.deep.equal(expectedRows);
          expect(res[1]).equal(res[2]); // Compare the decrypted password with the original one
          fs.unlinkSync(passKeyFile);
          fs.unlinkSync(encPassFile);
        }
      } else {
        logger.infoLogMessage('Warning: The LDAP user is not set up on the target DBS. Test will not be run.');
      }
      done();
    });
  });
});

function testPasswordEncryption(connParamsCopy: ITDConnParams,
                                sAlgorithm: string,
                                sMode: string,
                                sPadding: string,
                                nKeySizeInBits: number,
                                sMac: string,
                                blockSizeBytes: number): any[] {
  let index: any;
  let sPassword: string = '';
  let sPrefix: string = '';
  let sSuffix: string = '';
  if (connParamsCopy.logmech === 'LDAP') {
    const logdata: string = connParamsCopy.logdata;
    const regex: RegExp = /password=(\S+)/;
    let found: any = connParamsCopy.logdata.match(regex);
    if (found.length > 0) {
      sPassword = found[1];
      index = logdata.search(regex);
      sPrefix = logdata.slice(0, index + 'password='.length);
      sSuffix = logdata.slice(index + 'password='.length + sPassword.length);
    }
  } else {
    sPassword = connParamsCopy.password;
  }

  const originalPassword: string = sPassword;
  let transformation: string = sAlgorithm + '/' + sMode + '/' + sPadding; // e.g., 'AES/OFB/PKCS5Padding';
  let fetchedRows: any[];
  const encryptKeys: any[] = createPasswordEncryptionKeyFile(transformation, sAlgorithm, match, sMac, nKeySizeInBits, passKeyFile);
  createEncryptedPasswordFile(transformation, sAlgorithm, match, sMac, sMode, nKeySizeInBits,
    encryptKeys[0], encryptKeys[1], encPassFile, blockSizeBytes, sPassword);

  sPassword = 'ENCRYPTED_PASSWORD(file:' + passKeyFile + ',file:' + encPassFile + ')';
  sPassword = sPrefix + sPassword + sSuffix;
  if (connParamsCopy.logmech === 'LDAP') {
    connParamsCopy.logdata = sPassword;
  } else {
    connParamsCopy.password = sPassword;
  }

  const teradataConnection: TeradataConnection = new TeradataConnection();
  teradataConnection.connect(connParamsCopy);
  const cursor: TeradataCursor = teradataConnection.cursor();

  const sQuery: string = `select upper (S.MechanismName)
                            from DBC.SessionInfoV S join DBC.LogOnOffV L
                            on S.SessionNo = L.SessionNo and S.LogonDate = L.LogonDate and S.LogonTime = L.LogonTime
                            where S.SessionNo = session`;
  cursor.execute(sQuery);
  fetchedRows = cursor.fetchall();
  teradataConnection.close();

  const decryptedPassword: string = decryptPassword(passKeyFile, encPassFile);

  return [fetchedRows, decryptedPassword, originalPassword];
} // testPasswordEncryption

function createPasswordEncryptionKeyFile(sTransformation: string,
                                sAlgorithm: string,
                                sMatch: string,
                                sMac: string,
                                nKeySizeInBits: number,
                                sPassKeyFileName: string): any[] {

  const keySizeBytes: number = nKeySizeInBits / 8;
  const encryptionKey: Buffer = crypto.randomBytes(keySizeBytes);
  const sKeyHexDigits: string = encryptionKey.toString('hex');

  const randomBytesBufMacKey: Buffer = crypto.randomBytes(macBlockSizeBytes);
  const sMacKeyHexDigits: string = randomBytesBufMacKey.toString('hex');

  const fileData: string = '# Teradata SQL Driver password encryption key file\n' +
                    'version=1\n' +
                    'transformation=' + sTransformation + '\n' +
                    'algorithm=' + sAlgorithm + '\n' +
                    'match=' + sMatch + '\n' +
                    'key=' + sKeyHexDigits + '\n' +
                    'mac=' + sMac + '\n' +
                    'mackey=' + sMacKeyHexDigits + '\n';

  fs.writeFileSync(sPassKeyFileName, fileData, { encoding: 'latin1'});
  return [encryptionKey, randomBytesBufMacKey];
} // createPasswordEncryptionKeyFile

function createEncryptedPasswordFile(sTransformation: string,
                                sAlgorithm: string,
                                sMatch: string,
                                sMac: string,
                                sMode: string,
                                nKeySizeInBits: number,
                                keyBuffer: Buffer,
                                abyMacKey: Buffer,
                                sEncPassFileName: string,
                                blockSizeBytes: number,
                                sPassword: string): void {

  let abyPassword: Buffer = Buffer.from(sPassword, 'utf8');
  const iv: Buffer = crypto.randomBytes(blockSizeBytes);
  let abyASN1EncodedIV: Buffer = Buffer.allocUnsafe(2);
  abyASN1EncodedIV[0] = octetString;
  abyASN1EncodedIV[1] = iv.length;
  abyASN1EncodedIV = Buffer.concat([abyASN1EncodedIV, iv], abyASN1EncodedIV.length + iv.length);
  const sASN1EncodedIVHexDigits: string = abyASN1EncodedIV.toString('hex');

  // convert Java algorithm names to Node.js names
  const nodeAlgorithmName: string = convertJavaNamestoNodeJs(sAlgorithm, nKeySizeInBits, sMode);
  const cipher: crypto.Cipher = crypto.createCipheriv(nodeAlgorithmName, keyBuffer, iv);

  // zero-pad the password to the next 512-byte boundary and append null bytes to next 512 boundary
  const nPlaintextByteCount: number = (Math.floor(abyPassword.length / 512) + 1) * 512;
  const nTrailerByteCount: number = nPlaintextByteCount - abyPassword.length;
  const emptyBuffer: Buffer = Buffer.alloc(nTrailerByteCount);
  abyPassword = Buffer.concat([abyPassword, emptyBuffer], abyPassword.length + emptyBuffer.length);

  let abyEncryptedPassword: Buffer = cipher.update(abyPassword);
  const finalCipher: Buffer = cipher.final();
  abyEncryptedPassword = Buffer.concat([abyEncryptedPassword, finalCipher], abyEncryptedPassword.length + finalCipher.length);

  const sEncryptedPasswordHexDigits: string = abyEncryptedPassword.toString('hex');
  const sTransformationBuffer: Buffer = Buffer.from(sTransformation, 'utf8');
  const abyContentLength: number = abyEncryptedPassword.length + sTransformationBuffer.length + abyASN1EncodedIV.length;
  const abyContent: Buffer = Buffer.concat([abyEncryptedPassword, sTransformationBuffer, abyASN1EncodedIV], abyContentLength);
  sMac = sMac.slice(4).toLowerCase();
  const hmac: crypto.Hmac = crypto.createHmac(sMac, abyMacKey);
  hmac.update(abyContent);
  const sHashHexDigits: string = hmac.digest('hex');

  const fileData: string = '# Teradata SQL Driver encrypted password file\n' +
                    'version=1\n' +
                    'match=' + sMatch + '\n' +
                    'password=' + sEncryptedPasswordHexDigits + '\n' +
                    'params=' + sASN1EncodedIVHexDigits + '\n' +
                    'hash=' + sHashHexDigits + '\n';

  fs.writeFileSync(sEncPassFileName, fileData, { encoding: 'latin1' });
} // createEncryptedPasswordFile

function convertJavaNamestoNodeJs(sName: string, nKeySizeInBits: number = 0, sMode: string = ''): string {
  // for list of available cypher names in node.js run command: openssl list -cipher-algorithms

  if (sName === 'DES') {
    sName = 'des-' + sMode.toLowerCase(); // e.g., 'des-cbc'
  } else if (sName === 'DESede') {
    sName = 'des-ede3-' + sMode.toLowerCase(); // e.g., 'des-ede3-cbc'
  } else if (sName === 'AES') {
    sName = 'aes-' + nKeySizeInBits.toString() + '-' + sMode.toLowerCase(); // e.g., 'aes-128-ofb'
  }
  return sName;
} // convertJavaNamestoNodeJs

function loadPropertiesFile (sFileName: string): any {
  interface IProperties {
    [key: string]: string; // index signature
  }
  let properties: IProperties = {};
  const content: string = fs.readFileSync(sFileName, { encoding: 'latin1' });
  const lines: string [] = content.split('\n');
  lines.forEach((line: string) => {
    line = line.trim();
    if (line.indexOf('#') !== 0) {
      const asTokens: string[] = line.split('=', 2);
      if (asTokens.length === 2) {
        const sKey: string = asTokens[0];
        const sValue: string = asTokens[1];
        properties[sKey] = sValue;
      }
    }
  });
  return properties;
}

function decryptPassword(sPassKeyFileName: string, sEncPassFileName: string): string {

  interface IMapPassKey {
    [key: string]: string; // index signature
  }

  interface IMapEncPass {
    [key: string]: string; // index signature
  }
  const mapPassKey: IMapPassKey = loadPropertiesFile(sPassKeyFileName);
  const mapEncPass: IMapEncPass = loadPropertiesFile(sEncPassFileName);

  const keyAlgorithm: string      = 'algorithm';
  const keyKey: string            = 'key';
  const keyHash: string           = 'hash';
  const keyMac: string            = 'mac';
  const keyMackey: string         = 'mackey';
  const keyMatch: string          = 'match';
  const keyPassword: string       = 'password';
  const keyParams: string         = 'params';
  const keyTransformation: string = 'transformation';
  const keyVersion: string        = 'version';

  if (mapPassKey[keyVersion] !== '1') {
    throw new Error('Unrecognized version ' + mapPassKey[keyVersion] + ' in file '
      + sPassKeyFileName);
  }

  if (mapEncPass[keyVersion] !== '1') {
    throw new Error('Unrecognized version ' +  mapEncPass[keyVersion] + ' in file '
      + sEncPassFileName);
  }

  if (mapPassKey[keyMatch] !== mapEncPass[keyMatch] ) {
    throw new Error('Match value differs between files ' + sPassKeyFileName
      + ' and ' + sEncPassFileName);
  }

  const sAlgorithm: string            = mapPassKey[keyAlgorithm];
  const sMACAlgorithm: string         = mapPassKey[keyMac];
  const sTransformation: string       = mapPassKey[keyTransformation];
  const sTransformationBuffer: Buffer = Buffer.from(sTransformation, 'utf8');
  const abyKey: Buffer                = Buffer.from(mapPassKey[keyKey], 'hex');
  const abyMacKey: Buffer             = Buffer.from(mapPassKey[keyMackey], 'hex');
  const abyEncryptedPassword: Buffer  = Buffer.from(mapEncPass[keyPassword], 'hex');
  const abyASN1EncodedIV: Buffer      = Buffer.from(mapEncPass[keyParams], 'hex');

  const asTransformationParts: string[] = sTransformation.split ('/');
  const sMode: string = asTransformationParts [1];

  if (sAlgorithm !== asTransformationParts [0]) {
    throw new Error('Algorithm differs from transformation in file ' + sPassKeyFileName);
  }

  // While params is technically optional, an initialization vector is required by all three block
  // cipher modes CBC, CFB, and OFB that are supported by the Teradata SQL Driver for Node.js.
  // ECB does not require params, but ECB is not supported by the Teradata SQL Driver for Node.js.

  const sHashHexDigits: string = mapEncPass [keyHash];

  const abyContentLength: number = abyEncryptedPassword.length + sTransformationBuffer.length + abyASN1EncodedIV.length;
  const abyContent: Buffer = Buffer.concat([abyEncryptedPassword, sTransformationBuffer, abyASN1EncodedIV], abyContentLength);
  const sMac: string = sMACAlgorithm.slice(4).toLowerCase();
  const hmac: crypto.Hmac = crypto.createHmac(sMac, abyMacKey);
  hmac.update(abyContent);
  const hashHexDigits: string = hmac.digest('hex');

  if (sHashHexDigits !== hashHexDigits) {
    throw new Error('Hash mismatch indicates possible tampering with file '
      + sPassKeyFileName + ' or ' + sEncPassFileName);
  }

  const nKeySizeInBytes: number = abyKey.length;
  const nKeySizeInBits: number = nKeySizeInBytes * 8;
  const nodeAlgorithmName: string = convertJavaNamestoNodeJs(sAlgorithm, nKeySizeInBits, sMode);
  const iv: Buffer = abyASN1EncodedIV.slice(2, 2 + abyASN1EncodedIV[1]);
  const decipher: crypto.Decipher = crypto.createDecipheriv(nodeAlgorithmName, abyKey, iv);
  const decrypted: Buffer = decipher.update(abyEncryptedPassword);
  const finalCipher: Buffer = decipher.final();
  const abyPassword: Buffer = Buffer.concat([decrypted, finalCipher], decrypted.length + finalCipher.length);
  const sPassword: string = abyPassword.slice(0, abyPassword.indexOf('\x00')).toString('utf8');

  return sPassword;
} // decryptPassword
