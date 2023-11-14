// Copyright 2023 by Teradata Corporation. All rights reserved.
//
// Purpose:    Encrypts a password, saves the encryption key in one file, and saves the encrypted password in a second file
//
//              This program accepts eight command-line arguments:
//
//                1. Transformation - Specifies the transformation in the form Algorithm/Mode/Padding.
//                                    Example: AES/CBC/NoPadding
//
//                2. KeySizeInBits  - Specifies the algorithm key size, which governs the encryption strength.
//                                    Example: 256
//
//                3. MAC            - Specifies the message authentication code (MAC) algorithm HmacSHA1 or HmacSHA256.
//                                    Example: HmacSHA256
//
//                4. PasswordEncryptionKeyFileName - Specifies a filename in the current directory, a relative pathname, or an absolute pathname.
//                                    The file is created by this program. If the file already exists, it will be overwritten by the new file.
//                                    Example: PassKey.properties
//
//                5. EncryptedPasswordFileName - Specifies a filename in the current directory, a relative pathname, or an absolute pathname.
//                                    The filename or pathname that must differ from the PasswordEncryptionKeyFileName.
//                                    The file is created by this program. If the file already exists, it will be overwritten by the new file.
//                                    Example: EncPass.properties
//
//                6. Hostname       - Specifies the Teradata Database hostname.
//                                    Example: whomooz
//
//                7. Username       - Specifies the Teradata Database username.
//                                    Example: guest
//
//                8. Password       - Specifies the Teradata Database password to be encrypted.
//                                    Example: please
//
//              Overview
//              --------
//
//              Stored Password Protection enables an application to provide a connection password in encrypted form to
//              the Teradata SQL Driver for Node.js.
//
//              An encrypted password may be specified in the following contexts:
//                * A login password specified as the "password" connection parameter.
//                * A login password specified within the "logdata" connection parameter.
//
//              If the password, however specified, begins with the prefix "ENCRYPTED_PASSWORD(" then the specified password must follow this format:
//
//                ENCRYPTED_PASSWORD(file:PasswordEncryptionKeyFileName,file:EncryptedPasswordFileName)
//
//              Each filename must be preceded by the "file:"" prefix.
//              The PasswordEncryptionKeyFileName must be separated from the EncryptedPasswordFileName by a single comma.
//              The PasswordEncryptionKeyFileName specifies the name of a properties file that contains the password
//              encryption key and associated information.
//              The EncryptedPasswordFileName specifies the name of a properties file that contains the encrypted password and associated information.
//              The two files are described below.
//
//              Stored Password Protection is offered by the Teradata JDBC Driver and the Teradata SQL Driver for Node.js.
//              The same file format is used by both drivers.
//
//              This program works in conjunction with Stored Password Protection offered by the Teradata JDBC Driver and the
//              Teradata SQL Driver for Node.js. This program creates the files containing the password encryption key and encrypted password,
//              which can be subsequently specified via the "ENCRYPTED_PASSWORD(" syntax.
//
//              You are not required to use this program to create the files containing the password encryption key and encrypted password.
//              You can develop your own software to create the necessary files.
//              The only requirement is that the files must match the format expected by the Teradata SQL Driver for Node.js, which is
//              documented below.
//
//              This program encrypts the password and then immediately decrypts the password, in order to verify that the password can be
//              successfully decrypted. This program mimics the password decryption of the Teradata SQL Driver for Node.js, and is intended
//              to openly illustrate its operation and enable scrutiny by the community.
//
//              The encrypted password is only as safe as the two files. You are responsible for restricting access to the files containing
//              the password encryption key and encrypted password. If an attacker obtains both files, the password can be decrypted.
//              The operating system file permissions for the two files should be as limited and restrictive as possible, to ensure that
//              only the intended operating system userid has access to the files.
//
//              The two files can be kept on separate physical volumes, to reduce the risk that both files might be lost at the same time.
//              If either or both of the files are located on a network volume, then an encrypted wire protocol can be used to access the
//              network volume, such as sshfs, encrypted NFSv4, or encrypted SMB 3.0.
//
//              Example Commands
//              ----------------
//
//              This program uses the Teradata SQL Driver for Node.js to log on to the specified Teradata Database using the encrypted
//              password, so the Teradata SQL Driver for Node.js must have been installed.
//
//              The following example commands illustrate using a 256-bit AES key, and using the HmacSHA256 algorithm.
//
//                node dist/encrypt-password.js AES/CBC/NoPadding 256 HmacSHA256 PassKey.properties EncPass.properties whomooz guest please
//
//              Password Encryption Key File Format
//              -----------------------------------
//
//              You are not required to use the encrypt-password program to create the files containing the password encryption key and
//              encrypted password. You can develop your own software to create the necessary files, but the files must match the format
//              expected by the Teradata SQL Driver for Node.js.
//
//              The password encryption key file is a text file in Java Properties file format, using the ISO 8859-1 character encoding.
//
//              The file must contain the following string properties:
//
//                version=1
//
//                      The version number must be 1.
//                      This property is required.
//
//                transformation=TransformationName
//
//                      Specifies the transformation in the form Algorithm/Mode/Padding.
//                      This property is required.
//                      Example: AES/CBC/NoPadding
//
//                algorithm=AlgorithmName
//
//                      This value must correspond to the Algorithm portion of the transformation.
//                      This property is required.
//                      Example: AES
//
//                match=MatchValue
//
//                      The password encryption key and encrypted password files must contain the same match value.
//                      The match values are compared to ensure that the two specified files are related to each other,
//                      serving as a "sanity check" to help avoid configuration errors.
//                      This property is required. Any shared string can serve as a match value.
//
//                key=HexDigits
//
//                      This value is the password encryption key, encoded as hex digits.
//                      This property is required.
//
//                mac=MACAlgorithmName
//
//                      Specifies the message authentication code (MAC) algorithm HmacSHA1 or HmacSHA256.
//                      Stored Password Protection performs Encrypt-then-MAC for protection from a padding oracle attack.
//                      This property is required.
//
//                mackey=HexDigits
//
//                      This value is the MAC key, encoded as hex digits.
//                      This property is required.
//
//              Encrypted Password File Format
//              ------------------------------
//
//              The encrypted password file is a text file in Java Properties file format, using the ISO 8859-1 character encoding.
//
//              The file must contain the following string properties:
//
//                version=1
//
//                      The version number must be 1.
//                      This property is required.
//
//                match=MatchValue
//
//                      The password encryption key and encrypted password files must contain the same match value.
//                      The match values are compared to ensure that the two specified files are related to each other,
//                      serving as a "sanity check" to help avoid configuration errors.
//                      This property is required. Any shared string can serve as a match value.
//
//                password=HexDigits
//
//                      This value is the encrypted password, encoded as hex digits.
//                      This property is required.
//
//                params=HexDigits
//
//                      This value contains the cipher algorithm parameters, if any, encoded as hex digits.
//                      Some ciphers need algorithm parameters that cannot be derived from the key, such as an initialization vector.
//                      This property is optional, depending on whether the cipher algorithm has associated parameters.
//
//                      While this value is technically optional, an initialization vector is required by all three
//                      block cipher modes CBC, CFB, and OFB that are supported by the Teradata SQL Driver for Node.js.
//                      ECB (Electronic Codebook) does not require params, but ECB is not supported by the Teradata SQL Driver for Node.js.
//
//                hash=HexDigits
//
//                      This value is the expected message authentication code (MAC), encoded as hex digits.
//                      After encryption, the expected MAC is calculated using the ciphertext, transformation name, and algorithm parameters if any.
//                      Before decryption, the Teradata SQL Driver for Node.js calculates the MAC using the ciphertext, transformation name,
//                      and algorithm parameters, if any, and verifies that the calculated MAC matches the expected MAC.
//                      If the calculated MAC differs from the expected MAC, then either or both of the files may have been tampered with.
//                      This property is required.
//
//              Transformation, Key Size, and MAC
//              ---------------------------------
//
//              A transformation is a string that describes the set of operations to be performed on the given input, to produce transformed output.
//              A transformation specifies the name of a cryptographic algorithm such as DES or AES, followed by a feedback mode and padding scheme.
//
//              The Teradata SQL Driver for Node.js supports the following transformations and key sizes.
//
//                 DES/CBC/NoPadding          64
//                 DES/CBC/PKCS5Padding       64
//                 DES/CFB/NoPadding          64
//                 DES/CFB/PKCS5Padding       64
//                 DES/OFB/NoPadding          64
//                 DES/OFB/PKCS5Padding       64
//                 DESede/CBC/NoPadding       192
//                 DESede/CBC/PKCS5Padding    192
//                 DESede/CFB/NoPadding       192
//                 DESede/CFB/PKCS5Padding    192
//                 DESede/OFB/NoPadding       192
//                 DESede/OFB/PKCS5Padding    192
//                 AES/CBC/NoPadding          128
//                 AES/CBC/NoPadding          192
//                 AES/CBC/NoPadding          256
//                 AES/CBC/PKCS5Padding       128
//                 AES/CBC/PKCS5Padding       192
//                 AES/CBC/PKCS5Padding       256
//                 AES/CFB/NoPadding          128
//                 AES/CFB/NoPadding          192
//                 AES/CFB/NoPadding          256
//                 AES/CFB/PKCS5Padding       128
//                 AES/CFB/PKCS5Padding       192
//                 AES/CFB/PKCS5Padding       256
//                 AES/OFB/NoPadding          128
//                 AES/OFB/NoPadding          192
//                 AES/OFB/NoPadding          256
//                 AES/OFB/PKCS5Padding       128
//                 AES/OFB/PKCS5Padding       192
//                 AES/OFB/PKCS5Padding       256
//
//              Stored Password Protection uses a symmetric encryption algorithm such as DES or AES, in which the same secret key is used for
//              encryption and decryption of the password. Stored Password Protection does not use an asymmetric encryption algorithm such as RSA,
//              with separate public and private keys.
//
//              CBC (Cipher Block Chaining) is a block cipher encryption mode. With CBC, each ciphertext block is dependent on all plaintext blocks
//              processed up to that point. CBC is suitable for encrypting data whose total byte count exceeds the algorithm's block size, and is
//              therefore suitable for use with Stored Password Protection.
//
//              Stored Password Protection hides the password length in the encrypted password file by extending the length of the UTF8-encoded
//              password with trailing null bytes. The length is extended to the next 512-byte boundary.
//
//              A block cipher with no padding, such as AES/CBC/NoPadding, may only be used to encrypt data whose byte count after extension is
//              a multiple of the algorithm's block size. The 512-byte boundary is compatible with many block ciphers. AES, for example, has a
//              block size of 128 bits (16 bytes), and is therefore compatible with the 512-byte boundary.
//
//              A block cipher with padding, such as AES/CBC/PKCS5Padding, can be used to encrypt data of any length. However, CBC with padding
//              is vulnerable to a "padding oracle attack", so Stored Password Protection performs Encrypt-then-MAC for protection from a padding
//              oracle attack. MAC algorithms HmacSHA1 and HmacSHA256 are supported.
//
//              The Teradata SQL Driver for Node.js does not support block ciphers used as byte-oriented ciphers via modes such as CFB8 or OFB8.
//
//              The strength of the encryption depends on your choice of cipher algorithm and key size.
//
//              AES uses a 128-bit (16 byte), 192-bit (24 byte), or 256-bit (32 byte) key.
//              DESede uses a 192-bit (24 byte) key. The The Teradata SQL Driver for Node.js does not support a 128-bit (16 byte) key for DESede.
//              DES uses a 64-bit (8 byte) key.
//
//              Sharing Files with the Teradata JDBC Driver
//              -------------------------------------------
//
//              The Teradata SQL Driver for Node.js and the Teradata JDBC Driver can share the files containing the password encryption key and
//              encrypted password, if you use a transformation, key size, and MAC algorithm that is supported by both drivers.
//
//              Recommended choices for compatibility are AES/CBC/NoPadding and HmacSHA256.
//              Use a 256-bit key if your Java environment has the Java Cryptography Extension (JCE) Unlimited Strength Jurisdiction Policy Files
//              from Oracle.
//              Use a 128-bit key if your Java environment does not have the Unlimited Strength Jurisdiction Policy Files.
//              Use HmacSHA1 for compatibility with JDK 1.4.2.
//
//              File Locations
//              --------------
//
//              For the "ENCRYPTED_PASSWORD(" syntax of the Teradata SQL Driver for Node.js, each filename must be preceded by the file: prefix.
//              The PasswordEncryptionKeyFileName must be separated from the EncryptedPasswordFileName by a single comma.
//              The files can be located in the current directory, specified with a relative path, or specified with an absolute path.
//
//              Example for files in the current directory:
//
//                  ENCRYPTED_PASSWORD(file:JohnDoeKey.properties,file:JohnDoePass.properties)
//
//              Example with relative paths:
//
//                  ENCRYPTED_PASSWORD(file:../dir1/JohnDoeKey.properties,file:../dir2/JohnDoePass.properties)
//
//              Example with absolute paths on Windows:
//
//                  ENCRYPTED_PASSWORD(file:c:/dir1/JohnDoeKey.properties,file:c:/dir2/JohnDoePass.properties)
//
//              Example with absolute paths on Linux:
//
//                  ENCRYPTED_PASSWORD(file:/dir1/JohnDoeKey.properties,file:/dir2/JohnDoePass.properties)
//

// @ts-ignore
import { TeradataConnection, TeradataCursor, ITDConnParams, OperationalError } from "teradatasql";

import * as fs from "fs";
import * as crypto from "crypto";

type Row = any[] | null;

function convertJavaNames(sName: string, nKeySizeInBits: number = 0, sMode: string = ""): string {
    // for list of available cypher names in node.js run command: openssl list -cipher-algorithms
    if (sName === "DES") {
        sName = "des-" + sMode.toLowerCase(); // e.g., 'des-cbc'
    } else if (sName === "DESede") {
        sName = "des-ede3-" + sMode.toLowerCase(); // e.g., 'des-ede3-cbc'
    } else if (sName === "AES") {
        sName = "aes-" + nKeySizeInBits.toString() + "-" + sMode.toLowerCase(); // e.g., 'aes-128-ofb'
    }
    return sName;
} // convertJavaNames

function createPasswordEncryptionKeyFile(
    sTransformation: string,
    sAlgorithm: string,
    sMatch: string,
    sMac: string,
    nKeySizeInBits: number,
    sPassKeyFileName: string
): Buffer[] {
    // Create encryption key
    const nKeySizeInBytes: number = nKeySizeInBits / 8;
    const abyKey: Buffer = crypto.randomBytes(nKeySizeInBytes);

    // Create MAC key
    const nMacBlockSizeBytes: number = 64;
    const abyMacKey: Buffer = crypto.randomBytes(nMacBlockSizeBytes);

    const sKeyHexDigits: string = abyKey.toString("hex");
    const sMacKeyHexDigits: string = abyMacKey.toString("hex");
    const fileData: string =
        "# Teradata SQL Driver password encryption key file\n" +
        "version=1\n" +
        "transformation=" +
        sTransformation +
        "\n" +
        "algorithm=" +
        sAlgorithm +
        "\n" +
        "match=" +
        sMatch +
        "\n" +
        "key=" +
        sKeyHexDigits +
        "\n" +
        "mac=" +
        sMac +
        "\n" +
        "mackey=" +
        sMacKeyHexDigits +
        "\n";

    const asTransformationParts: string[] = sTransformation.split("/");
    if (asTransformationParts.length !== 3) {
        console.log(">>> Invalid transformation: " + sTransformation);
        process.exit(1);
    }

    fs.writeFileSync(sPassKeyFileName, fileData, { encoding: "latin1" }); // Latin-1 stands for ISO-8859-1
    return [abyKey, abyMacKey];
} // createPasswordEncryptionKeyFile

function createEncryptedPasswordFile(
    sTransformation: string,
    sAlgorithm: string,
    sMatch: string,
    sMac: string,
    sMode: string,
    nKeySizeInBits: number,
    abyKey: Buffer,
    abyMacKey: Buffer,
    sEncPassFileName: string,
    nCipherBlockSizeInBytes: number,
    sPassword: string
): void {
    let abyPassword: Buffer = Buffer.from(sPassword, "utf8");

    // Create an initialization vector for the cipher
    const abyIV: Buffer = crypto.randomBytes(nCipherBlockSizeInBytes);

    // Encode the initialization vector as an octet string in der-format
    const octetStringTag: number = 0x04; // The tag value for an octet string in der-format is 0x04
    let abyASN1EncodedIV: Buffer = Buffer.allocUnsafe(2);
    abyASN1EncodedIV[0] = octetStringTag;
    abyASN1EncodedIV[1] = abyIV.length;
    abyASN1EncodedIV = Buffer.concat([abyASN1EncodedIV, abyIV], abyASN1EncodedIV.length + abyIV.length);

    // Zero-pad the password to the next 512-byte boundary and append null bytes to next 512 boundary
    const nPlaintextByteCount: number = (Math.floor(abyPassword.length / 512) + 1) * 512;
    const nTrailerByteCount: number = nPlaintextByteCount - abyPassword.length;
    const emptyBuffer: Buffer = Buffer.alloc(nTrailerByteCount);
    abyPassword = Buffer.concat([abyPassword, emptyBuffer], abyPassword.length + emptyBuffer.length);

    // Create cipher and encrypt password
    const nodeAlgorithmName: string = convertJavaNames(sAlgorithm, nKeySizeInBits, sMode);
    const cipher: crypto.Cipher = crypto.createCipheriv(nodeAlgorithmName, abyKey, abyIV);
    let abyEncryptedPassword: Buffer = cipher.update(abyPassword);
    const finalCipher: Buffer = cipher.final();
    abyEncryptedPassword = Buffer.concat([abyEncryptedPassword, finalCipher], abyEncryptedPassword.length + finalCipher.length);

    // Create hex for encrypted password
    const sEncryptedPasswordHexDigits: string = abyEncryptedPassword.toString("hex");

    // Create hex for parameters
    const sASN1EncodedIVHexDigits: string = abyASN1EncodedIV.toString("hex");

    // Create hex for 'hash' (using MAC key)
    // The purpose of 'hash' is to be used to verify the integrity of encrypted password/parameters
    const abyTransformation: Buffer = Buffer.from(sTransformation, "utf8");
    const abyContentLength: number = abyEncryptedPassword.length + abyTransformation.length + abyASN1EncodedIV.length;
    const abyContent: Buffer = Buffer.concat([abyEncryptedPassword, abyTransformation, abyASN1EncodedIV], abyContentLength);
    sMac = sMac.slice(4).toLowerCase(); // e.g., slice 'HmacSHA256' to 'SHA256'
    const hmac: crypto.Hmac = crypto.createHmac(sMac, abyMacKey);
    hmac.update(abyContent);
    const sHashHexDigits: string = hmac.digest("hex");

    const fileData: string =
        "# Teradata SQL Driver encrypted password file\n" +
        "version=1\n" +
        "match=" +
        sMatch +
        "\n" +
        "password=" +
        sEncryptedPasswordHexDigits +
        "\n" +
        "params=" +
        sASN1EncodedIVHexDigits +
        "\n" +
        "hash=" +
        sHashHexDigits +
        "\n";

    fs.writeFileSync(sEncPassFileName, fileData, { encoding: "latin1" });
} // createEncryptedPasswordFile

function loadPropertiesFile(sFileName: string): {} {
    interface IProperties {
        [key: string]: string;
    }
    const properties: IProperties = {};
    const content: string = fs.readFileSync(sFileName, { encoding: "latin1" });
    const lines: string[] = content.split("\n");
    lines.forEach((line: string): void => {
        line = line.trim();
        if (line.indexOf("#") !== 0) {
            const asTokens: string[] = line.split("=", 2);
            if (asTokens.length === 2) {
                const sKey: string = asTokens[0];
                const sValue: string = asTokens[1];
                properties[sKey] = sValue;
            }
        }
    });
    return properties;
} // loadPropertiesFile

function decryptPassword(sPassKeyFileName: string, sEncPassFileName: string): void {
    interface IMapPassKey {
        [key: string]: string;
    }

    interface IMapEncPass {
        [key: string]: string;
    }
    const mapPassKey: IMapPassKey = loadPropertiesFile(sPassKeyFileName);
    const mapEncPass: IMapEncPass = loadPropertiesFile(sEncPassFileName);

    const algorithmString: string = "algorithm";
    const hashString: string = "hash";
    const keyString: string = "key";
    const macString: string = "mac";
    const mackeyString: string = "mackey";
    const matchString: string = "match";
    const paramsString: string = "params";
    const passwordString: string = "password";
    const transformationString: string = "transformation";
    const versionString: string = "version";

    if (mapPassKey[versionString] !== "1") {
        console.log("Unrecognized version %s in file %s", mapPassKey[versionString], sPassKeyFileName);
        process.exit(1);
    }

    if (mapEncPass[versionString] !== "1") {
        console.log("Unrecognized version %s in file %s", mapPassKey[versionString], sEncPassFileName);
        process.exit(1);
    }

    if (mapPassKey[matchString] !== mapEncPass[matchString]) {
        console.log("Match value differs between files %s and %s", sPassKeyFileName, sEncPassFileName);
        process.exit(1);
    }

    const sTransformation: string = mapPassKey[transformationString];
    const sAlgorithm: string = mapPassKey[algorithmString];
    const sKeyHexDigits: string = mapPassKey[keyString];
    const sMACAlgorithm: string = mapPassKey[macString];
    const sMacKeyHexDigits: string = mapPassKey[mackeyString];

    // While params is technically optional, an initialization vector is required by all three block
    // cipher modes CBC, CFB, and OFB that are supported by the Teradata SQL Driver for Node.js.
    // ECB does not require params, but ECB is not supported by the Teradata SQL Driver for Node.js.
    const abyTransformation: Buffer = Buffer.from(sTransformation, "utf8");
    const abyKey: Buffer = Buffer.from(sKeyHexDigits, "hex");
    const abyMacKey: Buffer = Buffer.from(sMacKeyHexDigits, "hex");
    const abyEncryptedPassword: Buffer = Buffer.from(mapEncPass[passwordString], "hex");
    const abyASN1EncodedIV: Buffer = Buffer.from(mapEncPass[paramsString], "hex"); // required for CBC, CFB, and OFB

    // Verify algorithm is part of transformation
    const asTransformationParts: string[] = sTransformation.split("/");
    const sMode: string = asTransformationParts[1];
    if (sAlgorithm !== asTransformationParts[0]) {
        console.log("Algorithm differs from transformation in file %s", sPassKeyFileName);
        process.exit(1);
    }

    // Verify the hash value produced from encrypted password/params having the same value as the recorded one.
    const abyContentLength: number = abyEncryptedPassword.length + abyTransformation.length + abyASN1EncodedIV.length;
    const abyContent: Buffer = Buffer.concat([abyEncryptedPassword, abyTransformation, abyASN1EncodedIV], abyContentLength);
    const sMac: string = sMACAlgorithm.slice(4).toLowerCase(); // e.g., slice 'HmacSHA256' to 'SHA256'
    const hmac: crypto.Hmac = crypto.createHmac(sMac, abyMacKey); // Use MAC key
    hmac.update(abyContent);
    const hashHexDigits: string = hmac.digest("hex"); // Produce hash value
    const sHashHexDigits: string = mapEncPass[hashString]; // Read the recorded hash value
    if (hashHexDigits !== sHashHexDigits) {
        console.log("Hash mismatch indicates possible tampering with file %s or %s", sPassKeyFileName, sEncPassFileName);
        process.exit(1);
    }

    // Create decipher and decrypt the encrypted password
    //    1. Lookup the Node.js algorithm name
    const nKeySizeInBytes: number = abyKey.length;
    const nKeySizeInBits: number = nKeySizeInBytes * 8;
    const nodeAlgorithmName: string = convertJavaNames(sAlgorithm, nKeySizeInBits, sMode);
    //    2. Retrieve the initialization vector value from 'params'
    //       The params is encoded as octet string in der-format:
    //         - The first byte is the id tag of the octet string (i.e., 0x04).
    //         - The second byte is the length of payload (iv).
    //         - The payload starts at the third byte of the octect string.
    const abyIV: Buffer = abyASN1EncodedIV.slice(2, 2 + abyASN1EncodedIV[1]);
    //    3. Create the decipher
    const decipher: crypto.Decipher = crypto.createDecipheriv(nodeAlgorithmName, abyKey, abyIV);
    //    4. Decrypt the password
    const decrypted: Buffer = decipher.update(abyEncryptedPassword);
    const finalCipher: Buffer = decipher.final();
    const abyPassword: Buffer = Buffer.concat([decrypted, finalCipher], decrypted.length + finalCipher.length);
    //    5. The password was zero-padded before it was encrypted.
    //       Trim trailing zero byptes to obtain the original password.
    const sPassword: string = abyPassword.slice(0, abyPassword.indexOf("\x00")).toString("utf8");

    console.log("Decrypted password: %s", sPassword);
} // decryptPassword

if (process.argv.length !== 10) {
    console.log(
        "Parameters: Transformation KeySizeInBits MAC PasswordEncryptionKeyFileName EncryptedPasswordFileName" + " Hostname Username Password"
    );
    process.exit(1);
}
const sTransformation: string = process.argv[2];
const sKeySizeInBits: string = process.argv[3];
const sMac: string = process.argv[4];
const sPassKeyFileName: string = process.argv[5];
const sEncPassFileName: string = process.argv[6];
const sHostname: string = process.argv[7];
const sUsername: string = process.argv[8];
let sPassword: string = process.argv[9];

const asTransformationParts: string[] = sTransformation.split("/");
if (asTransformationParts.length !== 3) {
    console.log("Invalid transformation: " + sTransformation);
    process.exit(1);
}

const sAlgorithm: string = asTransformationParts[0];
const sMode: string = asTransformationParts[1];
const sPadding: string = asTransformationParts[2];

if (["DES", "DESede", "AES"].indexOf(sAlgorithm) < 0) {
    console.log("Unknown algorithm " + sAlgorithm);
    process.exit(1);
}

if (["CBC", "CFB", "OFB"].indexOf(sMode) < 0) {
    console.log("Unknown mode " + sMode);
    process.exit(1);
}

if (["PKCS5Padding", "NoPadding"].indexOf(sPadding) < 0) {
    console.log("Unknown padding " + sPadding);
    process.exit(1);
}

if (["HmacSHA1", "HmacSHA256"].indexOf(sMac) < 0) {
    console.log("Unknown MAC algorithm " + sMac);
    process.exit(1);
}

if (!sPassword) {
    console.log("Password cannot be zero length");
    process.exit(1);
}

const nKeySizeInBits: number = parseInt(sKeySizeInBits, 10);
const match: string = Date.now().toString();
let nCipherBlockSizeInBytes: number = 0;

if (sAlgorithm === "AES") {
    nCipherBlockSizeInBytes = 16;
} else {
    nCipherBlockSizeInBytes = 8;
}

const encryptKeys: Buffer[] = createPasswordEncryptionKeyFile(sTransformation, sAlgorithm, match, sMac, nKeySizeInBits, sPassKeyFileName);

createEncryptedPasswordFile(
    sTransformation,
    sAlgorithm,
    match,
    sMac,
    sMode,
    nKeySizeInBits,
    encryptKeys[0],
    encryptKeys[1],
    sEncPassFileName,
    nCipherBlockSizeInBytes,
    sPassword
);

decryptPassword(sPassKeyFileName, sEncPassFileName);

sPassword = "ENCRYPTED_PASSWORD(file:" + sPassKeyFileName + ",file:" + sEncPassFileName + ")";

const connParams: ITDConnParams = {
    host: sHostname,
    password: sPassword,
    user: sUsername,
};

try {
    const con: TeradataConnection = new TeradataConnection();
    con.connect(connParams);
    const cur: TeradataCursor = con.cursor();
    cur.execute("select user, session");
    const row: Row = cur.fetchone();
    console.log(row);
    cur.close();
    con.close();
} catch (error) {
    if (error instanceof OperationalError) {
        console.log(error.message);
    } else {
        console.log(error);
    }
}
