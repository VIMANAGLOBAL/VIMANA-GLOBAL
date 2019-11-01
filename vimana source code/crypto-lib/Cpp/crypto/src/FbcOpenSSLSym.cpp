#include "vimOpenSSLSym.h"

#include <iostream>
#include <unistd.h>


template <typename T> 
inline T operator+(const T & a, const T & b)
{
    T res = a;
    res.insert(res.end(), b.begin(), b.end());
    return res;
}

vimOpenSSLSym::vimOpenSSLSym(vimryptoParams *params) {

    this->params = params;
    
    ctx = EVP_CIPHER_CTX_new();     unsigned char outbuf[1024];
    
    switch (params->getAesKeyLen()) {
        case 32 : {
            cipher  = EVP_aes_256_gcm ();
            break;
        }
        case 16: {
            cipher  = EVP_aes_128_gcm ();
            break;
        }
        default : {
            throw("Improper AES Key Length!");
        } 
            
    };
    

}

vimOpenSSLSym::~vimOpenSSLSym() {
    EVP_CIPHER_CTX_free(ctx);
}

    
void vimOpenSSLSym::setSymmetricKey( std::vector<Byte> &key ) {
    

    size_t sz = key.size();
        
    if (!((sz != 16 ) || (sz != 32))) 
        throw ("Key length must be exactly 16 or 32 or bytes long");
            
    if (sz > SYMMETRIC_KEY_SIZE) 
        throw ("Key length is exceeded");
   
    symmetricKey = key;
        
}

    
void vimOpenSSLSym::setSymmetricIV( std::vector<Byte> &IV) {
          
    size_t sz = IV.size();
    
    switch ( sz ) {
            case 12: {                                               
                this->gcmIVsym = std::vector<Byte>(IV.begin(), IV.end());
                this->saltSymmetic = std::vector<Byte>(IV.begin(),IV.begin()+4);
                // prev_explicit_nounce_sym = explicit_nounce_sym;
                this->explicit_nounce_sym = std::vector<Byte>(IV.begin()+4, IV.end());
                break;
            }
            default: {
                throw ("IV must be exactly 12 bytes long or 4 bytes of fixed nounce!");
            }
        }
    
}
           
std::vector<Byte> vimOpenSSLSym::getSymmetricIV() {
    return gcmIVsym;
}

    
void vimOpenSSLSym::setSymmetricSalt( std::vector<Byte> &salt ) {
    // checking whether it is a vector of a suitable size

    if (salt.size() != 4) {
        throw ("salt should be 4 bytes");
    }

    this->saltSymmetic = std::vector<Byte>( salt.begin(), salt.end() );
}

    
void vimOpenSSLSym::setSymmetricNounce( std::vector<Byte> &explicit_nounce ) {    

    // checking size if 8
    if (explicit_nounce.size() != 8) {
        throw ("explicit nounce should be 4 bytes");
    }
    
    if (explicit_nounce_sym == explicit_nounce) {
        throw("Nonce reuse detected!");
    }
    
    this->prev_explicit_nounce_sym = this->explicit_nounce_sym;
    this->explicit_nounce_sym = explicit_nounce; 

}
    
std::vector<Byte> vimOpenSSLSym::getSymmetricNounce() {
    return this->explicit_nounce_sym;

}

    
std::vector<Byte> vimOpenSSLSym::encryptSymmetric( std::vector<Byte> &plain ) {
     
    int sz =  plain.size();
           
    Byte *pkey = (Byte*)&symmetricKey[0];
    Byte *pIV =  (Byte*)&gcmIVsym[0];
    Byte *pt =   (Byte*)&plain[0];

    int outlen=0;
    
    unsigned char *outbuf = new unsigned char[sz+16];
    
    EVP_EncryptInit_ex(ctx,  cipher, NULL, NULL, NULL);
    // Set IV length if default 96 bits is not appropriate 
    EVP_CIPHER_CTX_ctrl(ctx, EVP_CTRL_AEAD_SET_IVLEN, gcmIVsym.size(),NULL);
    // Initialize key and IV 
    EVP_EncryptInit_ex(ctx, NULL, NULL, pkey, pIV);
    // Encrypt plaintext
    EVP_EncryptUpdate(ctx, outbuf, &outlen, pt, plain.size());
    // Output encrypted block 

#ifdef __CRYPTO_DEBUG
    printf("Ciphertext: %d\n", outlen);
    BIO_dump_fp(stdout, ( const char*)outbuf, outlen);
#endif    
    int olen = outlen;
    // Finalize: note get no output for GCM 
    EVP_EncryptFinal_ex(ctx, outbuf, &outlen);

    unsigned char tag[16];    
    // NO AEAD
    EVP_CIPHER_CTX_ctrl(ctx, EVP_CTRL_AEAD_GET_TAG, 16, tag);        

    
#ifdef __CRYPTO_DEBUG
    printf("Tag:\n");
    BIO_dump_fp(stdout, (const char*)tag, 16);
#endif    
 
    std::vector<Byte>_tag = std::vector<Byte>(&tag[0], &tag[16]);    
    std::vector<Byte>rv = std::vector<Byte>(&outbuf[0], &outbuf[olen]);
 
    rv.insert(
        rv.end(),        
        std::make_move_iterator(_tag.begin()),
        std::make_move_iterator(_tag.end())
    );
    return rv;
}

    
std::vector<Byte>  vimOpenSSLSym::decryptSymmetric(  std::vector<Byte> &ciphered ) {

    Byte *pkey = (Byte*)&symmetricKey[0];
    Byte *pIV =  (Byte*)&gcmIVsym[0];
            
    int outlen=0;
    int sz = ciphered.size();
    
    unsigned char *outbuf = new unsigned char[sz+16];

#ifdef __CRYPTO_DEBUG    
    printf("Ciphertext[%d]:\n",sz);    
    BIO_dump_fp(stdout, (const char*)ciphered.data(), sz);
#endif

    // Select cipher 
    EVP_DecryptInit_ex(ctx, cipher, NULL, NULL, NULL);
    // Set IV length, omit for 96 bits 
    EVP_CIPHER_CTX_ctrl(ctx, EVP_CTRL_AEAD_SET_IVLEN, gcmIVsym.size(), NULL);
    // Specify key and IV 
    EVP_EncryptInit_ex(ctx, NULL, NULL, pkey, pIV);

    // Decrypt plaintext 
    EVP_DecryptUpdate(ctx, outbuf, &outlen, ciphered.data(), sz-16);
    
    // Output decrypted block 
#ifdef __CRYPTO_DEBUG     
    printf("Plaintext:\n");     
    BIO_dump_fp(stdout, (const char*)outbuf, outlen);
#endif
          
    return std::vector<Byte>(std::make_move_iterator(outbuf), std::make_move_iterator(outbuf+outlen));
}   
    
AEADMessage vimOpenSSLSym::encryptSymmetricWithAEAData( std::vector<Byte> &plain, std::vector<Byte> &aeadata) {

    Byte *pkey = (Byte*)&symmetricKey[0];
    Byte *pIV =  (Byte*)&gcmIVsym[0];
    Byte *pt =   (Byte*)&plain[0];
    
    int sz = plain.size();
        
    int outlen, tmplen;
    unsigned char *outbuf=new unsigned char[sz+16];//[10240];
    unsigned char tag[16];
#ifdef __CRYPTO_DEBUG
    printf("AES GCM AEAD Encrypt:\n");
    printf("Plaintext:\n");
    BIO_dump_fp(stdout, (const char*)pt, sz);
#endif    
    // Set cipher type and mode 
    EVP_EncryptInit_ex(ctx, cipher, NULL, NULL, NULL);
    // Set IV length if default 96 bits is not appropriate 
    EVP_CIPHER_CTX_ctrl(ctx, EVP_CTRL_AEAD_SET_IVLEN, gcmIVsym.size(), NULL);                
    // Initialise key and IV 
    EVP_EncryptInit_ex(ctx, NULL, NULL, pkey, pIV);
    // Zero or more calls to specify any AAD    
    EVP_EncryptUpdate(ctx, NULL, &outlen, aeadata.data(),  aeadata.size());    
    // Encrypt plaintext 
    EVP_EncryptUpdate(ctx, outbuf, &outlen, pt, sz);
    
    int olen = outlen;

#ifdef __CRYPTO_DEBUG    
    // Output encrypted block 
    printf("Ciphertext:\n");
    BIO_dump_fp(stdout, (const char*)outbuf, outlen);
#endif    
    // Finalize: note get no output for GCM 
    EVP_EncryptFinal_ex(ctx, outbuf, &outlen);        
    // Get tag 
    EVP_CIPHER_CTX_ctrl(ctx, EVP_CTRL_AEAD_GET_TAG, 16, tag);

#ifdef __CRYPTO_DEBUG
    // Output tag 
    printf("Tag:\n");
    BIO_dump_fp(stdout, (const char*)tag, 16);
#endif        
    std::vector<Byte>_tag = std::vector<Byte>(&tag[0], &tag[16]);    
    std::vector<Byte>encrypted = std::vector<Byte>(&outbuf[0], &outbuf[olen]);
 
    encrypted.insert(
        encrypted.end(),        
        std::make_move_iterator(_tag.begin()),
        std::make_move_iterator(_tag.end())
    );
        
    AEADMessage res(*params);
    res.setIV(gcmIVsym);        
    res.setEncrypted(encrypted);
    res.setAatext(aeadata);
#ifdef __CRYPTO_DEBUG    
    printf("encrypted:\n");
    BIO_dump_fp(stdout, (const char*)encrypted.data(), encrypted.size());
#endif                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    
    return res;
}

    
AEAD vimOpenSSLSym::decryptSymmetricWithAEAData( std::vector<Byte> &message) {

    // AEAD ... = fromBytes
    
    AEADMessage *msg = AEADMessage::fromBytes(message, *params);
        
    Byte *pkey = (Byte*)&symmetricKey[0];
    Byte *pIV =  (Byte*)&gcmIVsym[0];   
    Byte *pMessage = (Byte*)msg->getEncrypted().data();
    
    int outlen, rv, sz = msg->getEncrypted().size();
    unsigned char* outbuf=new unsigned char[sz+16];
    // unsigned char *gcm_aad = new unsigned char[16];
    unsigned char *tag = new unsigned char[16];
    memset(tag, 0x00, 16);
#ifdef _CRYPTO_DEBUG    
    printf("AES GCM Derypt %d:\n", sz);
    printf("IV size: %d\n", gcmIVsym.size());
    printf("Ciphertext:\n");
    BIO_dump_fp(stdout, (const char*)pMessage, sz);
#endif
   
    // Select cipher 
    EVP_DecryptInit_ex(ctx, cipher, NULL, NULL, NULL);
    // Set IV length, omit for 96 bits 
    EVP_CIPHER_CTX_ctrl(ctx, EVP_CTRL_AEAD_SET_IVLEN, gcmIVsym.size(), NULL);
    // Specify key and IV 
    EVP_DecryptInit_ex(ctx, NULL, NULL, pkey, pIV);

    EVP_DecryptUpdate(ctx, NULL, &outlen, msg->getAatext().data(), msg->getAatext().size());
    
    // Decrypt plaintext 
    EVP_DecryptUpdate(ctx, outbuf, &outlen, pMessage, sz-16);

    int olen = outlen;
    // Output decrypted block 

    Byte* ptag = (Byte*)pMessage + sz - 16;

#ifdef _CRYPTO_DEBUG    
    printf("tag:\n");
    BIO_dump_fp(stdout, (const char*)ptag, 16);
#endif
    // Set expected tag value. 
    EVP_CIPHER_CTX_ctrl(ctx, EVP_CTRL_AEAD_SET_TAG, 16,
                        (void *)ptag);

    // Finalise: note get no output for GCM 
    rv = EVP_DecryptFinal_ex(ctx, outbuf, &outlen);

#ifdef _CRYPTO_DEBUG    
    printf("Plaintext:\n");
    BIO_dump_fp(stdout, (const char*)outbuf, olen);    
    // Print out return value. If this is not successful authentication
    // failed and plaintext is not trustworthy.    
    printf("Tag Verify %s\n", rv > 0 ? "Successful!" : "Failed!");
#endif   
    
    AEAD rx;
    
    rx.decrypted = std::vector<Byte>(outbuf, outbuf+olen);
    if (rv > 0) rx.hmac_ok = true; else rx.hmac_ok = false;
    return rx;
}

