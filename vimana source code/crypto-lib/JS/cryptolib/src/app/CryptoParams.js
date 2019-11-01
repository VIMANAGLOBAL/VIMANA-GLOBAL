export const signatureSchema = "EC"; //EC only for Oracle provider;
export const defaultCurve = "p521";
export const symCipher = "AES/GCM/PKCS5Padding";
export const asymCipher = "AES/GCM/PKCS5Padding";
export const asymEciesCipher = "ECIESwithAES-CBC";
export const digester = "SHA-512";
export const signatureAlgorythm = "SHA512withECDSA";
export const keyDerivationFn = "PBKDF2WithHmacSHA256"; //produces 256 bit key
export const pbkdf2Iterations = 16;
export const gcmAuthTagLenBits = 128; //128 bits
export const aesIvLen = 12; //12 bytes
export const iesIvLen = 16; //16 bytes
export const aesKeyLen = 256 / 8; //32 bytes
export const aesGcmSaltLen = 4; //4 of 12 bytes
export const aesGcmNounceLen = 8; //8 of 12 bytes
export const keyAgreementDigester = "SHA-256";

export const SALT = '\u0001\u0002\u0003\u0004\u0005\u0006\u0007\u0008\u0009\u0000';