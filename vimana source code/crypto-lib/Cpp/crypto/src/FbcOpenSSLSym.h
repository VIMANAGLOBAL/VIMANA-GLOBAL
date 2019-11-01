#pragma once

#include <vector>

#include "vimryptoSym.h"

#include "openssl/evp.h"
#include "global.h"

#define SYMMETRIC_KEY_SIZE      32
#define SYMMETRIC_IV_FULL_SIZE  16
#define SYMMETRIC_IV_SIZE       12
#define NONCE_SHIFT              4
#define NONCE_SIZE               4
#define SALT_SYMMETRIC_SIZE      4
#define EXPLICIT_NONCE_SIZE      8




class vimOpenSSLSym : public vimryptoSym{
    
public:
    
    vimOpenSSLSym(vimryptoParams *params);  
    vimOpenSSLSym(const vimOpenSSLSym& orig)=delete;
    ~vimOpenSSLSym();
    
    void setSymmetricKey( std::vector<Byte> &key  );
    void setSymmetricIV( std::vector<Byte> &IV );
    std::vector<Byte> getSymmetricIV();
    void setSymmetricSalt(std::vector<Byte> &salt );
    void setSymmetricNounce( std::vector<Byte> &explicit_nounce );
    std::vector<Byte> getSymmetricNounce();
    std::vector<Byte> encryptSymmetric( std::vector<Byte> &plain );
    std::vector<Byte> decryptSymmetric( std::vector<Byte> &ciphered );
    AEADMessage encryptSymmetricWithAEAData( std::vector<Byte> &plain, std::vector<Byte> &aeadata );
    AEAD decryptSymmetricWithAEAData( std::vector<Byte> &message );
          
private:
        
    std::vector<Byte> saltSymmetic;
    std::vector<Byte> explicit_nounce_sym;
    std::vector<Byte> prev_explicit_nounce_sym;
    std::vector<Byte> gcmIVsym;
    std::vector<Byte> symmetricKey;
    
    EVP_CIPHER_CTX *ctx;
    const EVP_CIPHER *cipher;
    
    vimryptoParams *params;    
};
