#pragma once

#include <string>

class vimryptoParams {
/*    
protected:
    const std::string DEFAULT_CURVE;// = "secp521r1";
    const std::string SYM_CIPHER;// = "AES/GCM/PKCS5Padding";
    const std::string ASYM_CIPHER; // = "AES/GCM/PKCS5Padding";
    const std::string ASYM_ECIES_CIPHER; // = "ECIESwithAES-CBC";
    const std::string DIGESTER; // = "SHA-512";
    const std::string SIGNATURE_ALGORYTHM; // = "SHA512withECDSA"; 
    const std::string KEY_DERIVATION_FN; // ="PBKDF2WithHmacSHA256"; //produces 256 bit key
    const int PBKDF2_ITERATIONS; // = 128;
    const int GCM_AUTH_TAG_LEN_BITS; // = 128; //128 bits
    const int AES_IV_LEN;// = 12; //12 bytes
    const int IES_IV_LEN;// = 16; //12 bytes
    const int AES_KEY_LEN;// = 256/8; //32 bytes
    const int AES_GCM_SALT_LEN;// = 4; //12 bytes    
    const int AES_GCM_NOUNCE_LEN ;//= 8; //12 bytes 
 */
    
    
    
protected: 
    
    std::string signatureSchema;
    std::string defaultCurve;
    std::string symCipher;
    std::string asymCipher;
    std::string asymEciesCipher;
    std::string digester;
    std::string signatureAlgorythm;
    std::string keyDerivationFn;
    int pbkdf2Iterations;
    int gcmAuthTagLenBits;
    int aesIvLen;
    int iesIvLen;
    int aesKeyLen;
    int aesGcmSaltLen;
    int aesGcmNounceLen;
    std::string keyAgreementDigester; 
        
public:    
    static inline vimryptoParams* createSecp521r1() {

        vimryptoParams *params = new vimryptoParams();

        params->signatureSchema = "EC"; //EC only for Oracle provider;
        params->defaultCurve = "secp521r1";
        params->symCipher = "AES/GCM/PKCS5Padding";
        params->asymCipher = "AES/GCM/PKCS5Padding";
        params->asymEciesCipher = "ECIESwithAES-CBC";
        params->digester = "SHA-512";
        params->signatureAlgorythm = "SHA512withECDSA";
        params->keyDerivationFn = "PBKDF2WithHmacSHA256"; //produces 256 bit key
        params->pbkdf2Iterations = 16;
        params->gcmAuthTagLenBits = 128; //128 bits
        params->aesIvLen = 12; //12 bytes
        params->iesIvLen = 16; //16 bytes
        params->aesKeyLen = 256 / 8; //32 bytes
        params->aesGcmSaltLen = 4; //4 of 12 bytes
        params->aesGcmNounceLen = 8; //8 of 12 bytes
        params->keyAgreementDigester = "SHA-256";
        
        return params;
    }
    
    
    std::string getSignatureSchema() {
        return signatureSchema;
    }

    std::string getDefaultCurve() {
        return defaultCurve;
    }

    std::string getSymCipher() {
        return symCipher;
    }

    std::string getAsymCipher() {
        return asymCipher;
    }

    std::string getAsymEciesCipher() {
        return asymEciesCipher;
    }

    std::string getDigester() {
        return digester;
    }

    std::string getSignatureAlgorythm() {
        return signatureAlgorythm;
    }

    std::string getKeyDerivationFn() {
        return keyDerivationFn;
    }

    int getPbkdf2Iterations() {
        return pbkdf2Iterations;
    }

    int getGcmAuthTagLenBits() {
        return gcmAuthTagLenBits;
    }

    int getAesIvLen() {
        return aesIvLen;
    }

    int getIesIvLen() {
        return iesIvLen;
    }

    int getAesKeyLen() {
        return aesKeyLen;
    }

    int getAesGcmSaltLen() {
        return aesGcmSaltLen;
    }

    int getAesGcmNounceLen() {
        return aesGcmNounceLen;
    }

    std::string getKeyAgreementDigester() {
        return keyAgreementDigester;
    }
 
    
};


