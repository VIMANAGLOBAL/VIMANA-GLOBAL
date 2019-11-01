package io.vimana.cryptolib;

import java.security.Provider;
import java.security.Security;
import org.bouncycastle.jce.provider.BouncyCastleProvider;

/**
 * Configuration parameters for all vimrypto library
 *
 * @author alukin@gmail.com
 */
public class vimryptoParams {

    public static String KEY_DERIVATION_FN = "PBKDF2WithHmacSHA256"; //produces 256 bit key
    public static final int PBKDF2_ITERATIONS = 16;
    public static final int PBKDF2_KEYELEN = 256; //256 bits for AES

    public static final int GCM_AUTH_TAG_LEN_BITS = 128; //128 bits 
    public static final int AES_IV_LEN = 12; //12 bytes

    protected String signatureSchema;
    protected String defaultCurve;
    protected String symCipher;
    protected String asymCipher;
    protected String asymEciesCipher;
    protected String digester;
    protected String signatureAlgorythm;
    protected String keyDerivationFn;
    protected int pbkdf2Iterations;
    protected int gcmAuthTagLenBits;
    protected int aesIvLen;
    protected int iesIvLen;
    protected int aesKeyLen;
    protected int aesGcmSaltLen;
    protected int aesGcmNounceLen;
    protected String keyAgreementDigester;
    private static final Provider provider;
//register bouncy castle provider
    static{
        //this will work with JDK 1.8 updat 162 and later.
        //Otherwiswe you should download unlimited policy from oracle
        Security.setProperty("crypto.policy", "unlimited");
        provider =new BouncyCastleProvider();
        Security.addProvider(provider);
    }
    
    public static Provider getProvider(){
        return provider;
    }
    
    protected vimryptoParams() {
    }

    static public vimryptoParams createDefault() {
        return createSecp521r1();
    }

    static public vimryptoParams createSecp521r1() {

        vimryptoParams params = new vimryptoParams();

        params.signatureSchema = "EC"; //EC only for Oracle provider;
        params.defaultCurve = "secp521r1";
        params.symCipher = "AES/GCM/PKCS5Padding";
        params.asymCipher = "AES/GCM/PKCS5Padding";
        params.asymEciesCipher = "ECIESwithAES-CBC";
        params.digester = "SHA-512";
        params.signatureAlgorythm = "SHA512withECDSA";
        params.keyDerivationFn = "PBKDF2WithHmacSHA256"; //produces 256 bit key
        params.pbkdf2Iterations = 16;
        params.gcmAuthTagLenBits = 128; //128 bits
        params.aesIvLen = 12; //12 bytes
        params.iesIvLen = 16; //16 bytes
        params.aesKeyLen = 256 / 8; //32 bytes
        params.aesGcmSaltLen = 4; //4 of 12 bytes
        params.aesGcmNounceLen = 8; //8 of 12 bytes
        params.keyAgreementDigester = "SHA-256";
        return params;

    }

    static public vimryptoParams createRSAn(int keylen) {

        vimryptoParams params = new vimryptoParams();

        params.signatureSchema = "RSA";
        params.defaultCurve = "";
        params.symCipher = "AES/GCM/PKCS5Padding";
        params.asymCipher = "AES/GCM/PKCS5Padding";
        params.asymEciesCipher = "ECIESwithAES-CBC";
        if (keylen <= 4096) {
            params.digester = "SHA-512";
            params.signatureAlgorythm = "SHA512withECDSA";
            params.keyDerivationFn = "PBKDF2WithHmacSHA256"; //produces 256 bit key
            params.pbkdf2Iterations = 16;
            params.gcmAuthTagLenBits = 128; //128 bits
            params.aesIvLen = 12; //12 bytes
            params.iesIvLen = 16; //16 bytes
            params.aesKeyLen = 256 / 8; //32 bytes
            params.aesGcmSaltLen = 4; //4 of 12 bytes
            params.aesGcmNounceLen = 8; //8 of 12 bytes
            params.keyAgreementDigester = "SHA-256";
        } else {
            params.digester = "SHA-256";
            params.signatureAlgorythm = "SHA512withECDSA";
            params.keyDerivationFn = "PBKDF2WithHmacSHA256"; //produces 256 bit key
            params.pbkdf2Iterations = 16;
            params.gcmAuthTagLenBits = 128; //128 bits
            params.aesIvLen = 12; //12 bytes
            params.iesIvLen = 16; //16 bytes
            params.aesKeyLen = 256 / 8; //32 bytes
            params.aesGcmSaltLen = 4; //4 of 12 bytes
            params.aesGcmNounceLen = 8; //8 of 12 bytes
            params.keyAgreementDigester = "SHA-256";

        }
        return params;

    }

    static public vimryptoParams createSecp256k1() {

        vimryptoParams params = new vimryptoParams();

        params.signatureSchema = "EC"; //EC only for Oracle provider;
        params.defaultCurve = "secp256k1";
        params.symCipher = "AES/GCM/PKCS5Padding";
        params.asymCipher = "AES/GCM/PKCS5Padding";
        params.asymEciesCipher = "ECIESwithAES-CBC";
        params.digester = "SHA-256";
        params.signatureAlgorythm = "SHA256withECDSA";
        params.keyDerivationFn = "PBKDF2WithHmacSHA256"; //produces 256 bit key
        params.pbkdf2Iterations = 16;
        params.gcmAuthTagLenBits = 128; //128 bits
        params.aesIvLen = 12; //12 bytes
        params.iesIvLen = 16; //16 bytes
        params.aesKeyLen = 128 / 8; //32 bytes
        params.aesGcmSaltLen = 4; //4 of 12 bytes
        params.aesGcmNounceLen = 8; //8 of 12 bytes
        params.keyAgreementDigester = "SHA-256";
        return params;
    }

    static public vimryptoParams createPrime256v1() {

        vimryptoParams params = new vimryptoParams();

        params.signatureSchema = "EC"; //EC only for Oracle provider;
        params.defaultCurve = "prime256v1";
        params.symCipher = "AES/GCM/PKCS5Padding";
        params.asymCipher = "AES/GCM/PKCS5Padding";
        params.asymEciesCipher = "ECIESwithAES-CBC";
        params.digester = "SHA-256";
        params.signatureAlgorythm = "SHA256withECDSA";
        params.keyDerivationFn = "PBKDF2WithHmacSHA256"; //produces 256 bit key
        params.pbkdf2Iterations = 16;
        params.gcmAuthTagLenBits = 128; //128 bits
        params.aesIvLen = 12; //12 bytes
        params.iesIvLen = 16; //16 bytes
        params.aesKeyLen = 128 / 8; //32 bytes
        params.aesGcmSaltLen = 4; //4 of 12 bytes
        params.aesGcmNounceLen = 8; //8 of 12 bytes
        params.keyAgreementDigester = "SHA-256";
        return params;
    }

    public String getSignatureSchema() {
        return signatureSchema;
    }

    public String getDefaultCurve() {
        return defaultCurve;
    }

    public String getSymCipher() {
        return symCipher;
    }

    public String getAsymCipher() {
        return asymCipher;
    }

    public String getAsymEciesCipher() {
        return asymEciesCipher;
    }

    public String getDigester() {
        return digester;
    }

    public String getSignatureAlgorythm() {
        return signatureAlgorythm;
    }

    public String getKeyDerivationFn() {
        return keyDerivationFn;
    }

    public int getPbkdf2Iterations() {
        return pbkdf2Iterations;
    }

    public int getGcmAuthTagLenBits() {
        return gcmAuthTagLenBits;
    }

    public int getAesIvLen() {
        return aesIvLen;
    }

    public int getIesIvLen() {
        return iesIvLen;
    }

    public int getAesKeyLen() {
        return aesKeyLen;
    }

    public int getAesGcmSaltLen() {
        return aesGcmSaltLen;
    }

    public int getAesGcmNounceLen() {
        return aesGcmNounceLen;
    }

    public String getKeyAgreementDigester() {
        return keyAgreementDigester;
    }

}
