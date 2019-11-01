#include <stdio.h>
    

#include "vimryptoSym.h"
#include "vimryptoParams.h"

#include "vimOpenSSLSym.h"
#include "AEADLayout.h"


#include <stdio.h>
#include <assert.h>

#include <fstream>
#include <vector>
#include <iostream>
#include <iomanip>
#include <iterator> 
#include <openssl/bio.h>
#include <openssl/evp.h>

#include <netinet/in.h>

#include <openssl/evp.h>
#include <openssl/err.h>
#include <openssl/engine.h>

#include <openssl/rand.h>



// static const 
Byte gcm_key[32] = {
    0xee, 0xbc, 0x1f, 0x57, 0x48, 0x7f, 0x51, 0x92, 0x1c, 0x04, 0x65, 0x66,
    0x5f, 0x8a, 0xe6, 0xd1, 0x65, 0x8b, 0xb2, 0x6d, 0xe6, 0xf8, 0xa0, 0x69,
    0xa3, 0x52, 0x02, 0x93, 0xa5, 0x72, 0x07, 0x8f
};

static const unsigned char gcm_iv[] = {
    0x99, 0xaa, 0x3e, 0x68, 0xed, 0x81, 0x73, 0xa0, 0xee, 0xd0, 0x66, 0x84
};

static const unsigned char gcm_pt[] = {
    0xf5, 0x6e, 0x87, 0x05, 0x5b, 0xc3, 0x2d, 0x0e, 0xeb, 0x31, 0xb2, 0xea,
    0xcc, 0x2b, 0xf2, 0xa5
};

static const unsigned char gcm_aad[] = {
    0x4d, 0x23, 0xc3, 0xce, 0xc3, 0x34, 0xb4, 0x9b, 0xdb, 0x37, 0x0c, 0x43,
    0x7f, 0xec, 0x78, 0xde
};

static const unsigned char gcm_ct[] = {
    0xf7, 0x26, 0x44, 0x13, 0xa8, 0x4c, 0x0e, 0x7c, 0xd5, 0x36, 0x86, 0x7e,
    0xb9, 0xf2, 0x17, 0x36
};

static const unsigned char gcm_tag[] = {
    0x67, 0xba, 0x05, 0x10, 0x26, 0x2a, 0xe4, 0x87, 0xd7, 0x37, 0xee, 0x62,
    0x98, 0xf7, 0x7e, 0x0c
};

void aes_gcm_encrypt(void) {
    
    EVP_CIPHER_CTX *ctx;
    int outlen, tmplen;
    unsigned char outbuf[1024];
    printf("AES GCM Encrypt:\n");
    printf("Plaintext:\n");
    BIO_dump_fp(stdout, (const char*)gcm_pt, sizeof (gcm_pt));
    ctx = EVP_CIPHER_CTX_new();
    // Set cipher type and mode 
    EVP_EncryptInit_ex(ctx, EVP_aes_256_gcm(), NULL, NULL, NULL);
    // Set IV length if default 96 bits is not appropriate 
    EVP_CIPHER_CTX_ctrl(ctx, EVP_CTRL_AEAD_SET_IVLEN, sizeof (gcm_iv), NULL);
    // Initialise key and IV 
    EVP_EncryptInit_ex(ctx, NULL, NULL, gcm_key, gcm_iv);
    // Zero or more calls to specify any AAD 
    EVP_EncryptUpdate(ctx, NULL, &outlen, gcm_aad, sizeof (gcm_aad));
    // Encrypt plaintext 
    EVP_EncryptUpdate(ctx, outbuf, &outlen, gcm_pt, sizeof (gcm_pt));
    // Output encrypted block 
    printf("Ciphertext:\n");
    BIO_dump_fp(stdout, (const char*)outbuf, outlen);
    // Finalise: note get no output for GCM 
    EVP_EncryptFinal_ex(ctx, outbuf, &outlen);
    // Get tag 
    EVP_CIPHER_CTX_ctrl(ctx, EVP_CTRL_AEAD_GET_TAG, 16, outbuf);
    // Output tag 
    printf("Tag:\n");
    BIO_dump_fp(stdout, (const char*)outbuf, 16);
    EVP_CIPHER_CTX_free(ctx);
}

  
void aes_gcm_decrypt(void) {
    EVP_CIPHER_CTX *ctx;
    int outlen, tmplen, rv;
    unsigned char outbuf[1024];
    printf("AES GCM Derypt:\n");
    printf("Ciphertext:\n");
    BIO_dump_fp(stdout, (const char*)gcm_ct, sizeof (gcm_ct));
    ctx = EVP_CIPHER_CTX_new();
    // Select cipher 
    EVP_DecryptInit_ex(ctx, EVP_aes_256_gcm(), NULL, NULL, NULL);
    // Set IV length, omit for 96 bits 
    EVP_CIPHER_CTX_ctrl(ctx, EVP_CTRL_AEAD_SET_IVLEN, sizeof (gcm_iv), NULL);
    // Specify key and IV 
    EVP_DecryptInit_ex(ctx, NULL, NULL, gcm_key, gcm_iv);
    // Zero or more calls to specify any AAD 
    EVP_DecryptUpdate(ctx, NULL, &outlen, gcm_aad, sizeof (gcm_aad));
    // Decrypt plaintext 
    EVP_DecryptUpdate(ctx, outbuf, &outlen, gcm_ct, sizeof (gcm_ct));
    // Output decrypted block 
    printf("Plaintext:\n");
    BIO_dump_fp(stdout, (const char*)outbuf, outlen);
    // Set expected tag value. 
    EVP_CIPHER_CTX_ctrl(ctx, EVP_CTRL_AEAD_SET_TAG, sizeof (gcm_tag),
            (void *) gcm_tag);
    // Finalise: note get no output for GCM 
    rv = EVP_DecryptFinal_ex(ctx, outbuf, &outlen);
    //
    // * Print out return value. If this is not successful authentication
    // * failed and plaintext is not trustworthy.
    printf("Tag Verify %s\n", rv > 0 ? "Successful!" : "Failed!");
    EVP_CIPHER_CTX_free(ctx);
}


size_t detectFileSize(char* name) {
  std::ifstream file (name, std::ios::in|std::ios::binary|std::ios::ate);
  size_t size;
  if (file.is_open())
  {
    size = file.tellg();
    return size;
  }    
    
}


#define ENCRYPT_ASYM_TEST_KEY_ECHDHE    "../testdata/encrypt_asym_test_key_echdhe.bin" 
#define ENCRYPT_SYM_TEST                "../testdata/encrypt_sym_test.bin"      
#define ENCRYPT_SYM_TEST_PLAIN          "../testdata/encrypt_sym_test_plain.bin"
#define ENCRYPT_ASYM_TEST_KEY_ECDH      "../testdata/encrypt_asym_test_key_ecdh.bin"  
#define ENCRYPT_SYM_AEAD_TEST           "../testdata/encrypt_sym_aead_test.bin"         
#define ENCRYPT_SYM_TEST_KEY            "../testdata/encrypt_sym_test_key.bin"

Byte OPEN_TEXT[49] = "This is test open text. Should be visisble as is";


std::vector<Byte> readFile(const char* filename)
{
    // open the file:
    std::ifstream file(filename, std::ios::binary);

    // Stop eating new lines in binary mode!!!
    file.unsetf(std::ios::skipws);

    // get its size:
    std::streampos fileSize;

    file.seekg(0, std::ios::end);
    fileSize = file.tellg();
    file.seekg(0, std::ios::beg);

    // reserve capacity
    std::vector<Byte> vec;
    vec.reserve(fileSize);

    // read the data:
    vec.insert(vec.begin(),
               std::istream_iterator<Byte>(file),
               std::istream_iterator<Byte>());

    return vec;
}

void dumpVector( std::string preamble, std::vector<Byte> &v ) {
    std::cout << preamble;
    for (auto x : v) {
        std::cout << std::hex << std::setw(2) << std::setfill('0') << (unsigned)x << " ";
    }
    std::cout << std::endl;    
}

void runGcmEncryptExample()
{           
    vimryptoParams *vimryptoParams = vimryptoParams::createSecp521r1();
    vimOpenSSLSym *vimOpenSSLSym = new vimOpenSSLSym(vimryptoParams);   
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                            
    int keyFileSize = detectFileSize( ENCRYPT_SYM_TEST_KEY );
     printf("key file size: %d\n", keyFileSize);
    
//    std::vector<Byte> keyData = readFile(ENCRYPT_SYM_TEST_KEY);    
    
    std::vector<Byte> keyData = std::vector<Byte>(gcm_key,gcm_key+32);
    dumpVector("Encryption Key: ", keyData );
    
    int plainFileSize = detectFileSize( ENCRYPT_SYM_TEST_PLAIN );
    printf("plain file size: %d\n", plainFileSize);
    
    // std::vector<Byte> plain = readFile(ENCRYPT_SYM_TEST_PLAIN);

    std::vector<Byte> plain = std::vector<Byte>(gcm_pt,gcm_pt+16);
    dumpVector("Plaintext : ", plain );

    
//    // generating salt... 
//    unsigned char _salt[4];
//    unsigned char _nonce[8];
//    
//    int rc = RAND_bytes((Byte*)_salt, 4);
//    assert(1 == rc);
//    std::vector<Byte> salt(_salt,_salt+4);
//    dumpVector("Generated salt: ", salt );
//    
//    // nonce
//    rc = RAND_bytes((Byte*)_nonce, 8);
//    assert(1 == rc);
//    std::vector<Byte> nonce(_nonce,_nonce+8);
//    dumpVector("Generated nonce: ", nonce );
    
    std::vector<Byte> IV(gcm_iv,gcm_iv+12);
    dumpVector("IV: ", IV);
    
    
//    vimOpenSSLSym->setSymmetricSalt(salt);
//    vimOpenSSLSym->setSymmetricNounce(nonce);
    
    vimOpenSSLSym->setSymmetricIV(IV);    
    vimOpenSSLSym->setSymmetricKey(keyData);
    
    
    std::vector<Byte> encryptedData = vimOpenSSLSym->encryptSymmetric(plain);
    
    std::vector<Byte> restored = vimOpenSSLSym->decryptSymmetric(encryptedData);
    
    
    
}

//void runGcmEncryptExample() {    
//}

main()
{
    printf("GCM Example: \n");
    
  //  runGcmEncryptExample(); 
  //  runGcmDecryptExample();
    
    // aes_gcm_encrypt();
    // aes_gcm_decrypt();
    
    // reading byte sequencs from correspoinding files... 
    std::ifstream keyfile("../testdata/encrypt_sym_test_key.bin", std::ios::in | std::ios::binary | std::ios::ate);
    std::streamsize size = keyfile.tellg();
    keyfile.seekg(0, std::ios::beg);
    
    // reading salt.. 
    unsigned char *salt = new unsigned char[4];
    memset(salt,0x00,4); 
    if (keyfile.read((char*)salt, 4)) {

        printf("salt read: success: %d\n", size);
        for (int i=0;i<4;i++) {
            printf("%.2X ",salt[i]);
        }        
        printf("\n");        
    }
    
    std::vector<Byte> _saltData = std::vector<Byte>(salt,salt+4);
    
    unsigned char *keyData = new unsigned char[size-4];
    memset(keyData,0x00,size-4);

    if (keyfile.read((char*)keyData, size-4)) {        
        printf("file read: success: %d\n", size-4);
        for (int i=0;i<size-4;i++) {
            printf("%.2X ",keyData[i]);
        }        
        printf("\n");
    } else {
        printf("file read: error\n");
    }
    
    std::vector<Byte> _keyData = std::vector<Byte>(keyData,keyData+size-4);
    keyfile.close();
        
    std::ifstream plainfile("../testdata/encrypt_sym_test_plain.bin", std::ios::in | std::ios::binary | std::ios::ate);
    size = plainfile.tellg();
    plainfile.seekg(0, std::ios::beg);
                
    unsigned char *plainData = new unsigned char[size];
    memset(plainData,0x00,size);
    
    if (plainfile.read((char*)plainData, size)) {
        printf("file read: success: %d\n", size);
//        for (int i=0;i<size;i++) {
//            printf("%.2X ",plainData[i]);
//        }        
//        printf("\n");
    } else {
        printf("file read: error\n");
    }
    
    std::vector<Byte> _plainData = std::vector<Byte>(plainData, plainData+size);    
    plainfile.close();
    
    std::ifstream encryptedfile("../testdata/encrypt_sym_test.bin", std::ios::in | std::ios::binary | std::ios::ate);
    size = encryptedfile.tellg();
    encryptedfile.seekg(0, std::ios::beg);
    
    unsigned char *nonceData = new unsigned char[8];
    memset(nonceData,0x00,8);
  
    if (encryptedfile.read((char*)nonceData, 8)) {    
        printf("file read: success: %d\n", 8);
        for (int i=0;i<8;i++) {
            printf("%.2X ",nonceData[i]);
        }        
        printf("\n");
 
    } else {
         printf("nonce file read: error\n");
         printf("Oh dear, something went wrong with read()! %s\n", strerror(errno));
    }

    printf("size: %d\n", size );
    unsigned char *encryptedData = new unsigned char[size-8];

    if (encryptedfile.read((char*)encryptedData, size-8)) {    
        printf("file read: success: %d\n", size-8);
//        for (int i=0;i<size-8;i++) {
//            printf("%.2X ",encryptedData[i]);
//        }        
//        printf("\n");         
    } else {
        printf("nonce file read: error\n");
        printf("Oh dear, something went wrong with read()! %s\n", strerror(errno));
    }
    
    std::vector<Byte> _encryptedData = std::vector<Byte>(encryptedData,encryptedData+size-8);
    printf("encrypted.size: %d\n", _encryptedData.size() );
        
    encryptedfile.close();
    
    std::vector<Byte> _nonceData = std::vector<Byte>(nonceData,nonceData+8);
        
    std::vector<Byte> _IV;
    
    _IV.insert(_IV.end(),salt, salt+4); 
    _IV.insert(_IV.end(),nonceData, nonceData+8);

    vimryptoParams *vimryptoParams = vimryptoParams::createSecp521r1();

    vimOpenSSLSym *vimOpenSSLSym = new vimOpenSSLSym(vimryptoParams);   

    
    vimOpenSSLSym->setSymmetricIV(_IV);    
        
    dumpVector("IV: ", _IV);
    
    vimOpenSSLSym->setSymmetricKey(_keyData);
    dumpVector("key: ", _keyData);
    
    printf("============== TEST 1 : Symmetric encryption, no AAD ================= \n");
    
    std::vector<Byte> cryptogram = vimOpenSSLSym->encryptSymmetric(_plainData);
    
    printf("inc.size: %d\n" , _encryptedData.size() );
    printf("calc.size: %d\n" , cryptogram.size() );
    
    if (_encryptedData.size() == cryptogram.size() ) {    
        if ( memcmp( cryptogram.data(),_encryptedData.data(), cryptogram.size() ) == 0 ) {
            printf("Bingo!! Vectors are validated\n");
        } else {
            printf("Holy crap! Something went wrong\n");
        }
    } else {
        printf("Error in validation: sizes of the cryptogram and the etalon are different");
    }

    printf("============== TEST 2 : Symmetric decryption, no AAD ================= \n");
        
    vimOpenSSLSym->setSymmetricIV(_IV);    
        
    dumpVector("IV: ", _IV);
    
    vimOpenSSLSym->setSymmetricKey(_keyData);
    dumpVector("key: ", _keyData);
    
    
    std::vector<Byte> decrypted=        vimOpenSSLSym->decryptSymmetric(cryptogram);
    
    // check this out 
    if (decrypted.size() == _plainData.size() ) {    
        if ( memcmp( decrypted.data(),_plainData.data(), decrypted.size() ) == 0 ) {
            printf("Checking plain vs decrypted: OK!!\n");
        } else {
            printf("Shoot happens. Decryption routine mismatch!\n");
        }
    } else {
        printf("Error in validation: sizes of the decrypted and the plain are different");
    }
    
     
    std::vector<Byte> testKeyInternal =  std::vector<Byte>( std::make_move_iterator( gcm_key ), std::make_move_iterator(gcm_key+32) );    
            
    std::vector<Byte> testIvInternal = std::vector<Byte>(gcm_iv,gcm_iv+12);
    
    std::vector<Byte> testPlain = std::vector<Byte>(gcm_pt,gcm_pt+16);
    std::vector<Byte> testAAD = std::vector<Byte>(gcm_aad,gcm_aad+16);
    std::vector<Byte> testCryptogram = std::vector<Byte>(gcm_ct,gcm_ct+16);
    std::vector<Byte> testTag = std::vector<Byte>(gcm_tag,gcm_tag+16);
    std::vector<Byte> testOpenText = std::vector<Byte>(OPEN_TEXT,OPEN_TEXT+48);
        
            
    printf("============== TEST 3 : Symmetric encryption, With AAD ================= \n");
    
    std::ifstream encrypted_aead_file("../testdata/encrypt_sym_aead_test.bin", std::ios::in | std::ios::binary | std::ios::ate);
    size = encrypted_aead_file.tellg();
    encrypted_aead_file.seekg(0, std::ios::beg);
    
    unsigned char *aeadNonceData = new unsigned char[8];
    memset(aeadNonceData,0x00,8);
    
    AEADLayout AEADLayoutData;
    memset((void*)&AEADLayoutData,0x00,sizeof(AEADLayoutData));
    
  
    if (encrypted_aead_file.read((char*)&AEADLayoutData, sizeof(AEADLayoutData))) {    
        printf("layout file read: success: %d\n", sizeof(AEADLayoutData));
//        for (int i=0;i<8;i++) {
//            printf("%.2X ",aeadNonceData[i]);
//        }        
//        printf("\n");
    } else {
         printf("aead nonce file read: error\n");
         printf("Oh dear, something went wrong with read()! %s\n", strerror(errno));
    }
    
    // printf("encrypted data size: %X\n", htonl(AEADLayoutData.aeatextLength));
    // printf("encrypted data size: %X\n", AEADLayoutData.encryptedLength);
    int aaelen = htonl(AEADLayoutData.aeatextLength);
    int encryptedLength = htonl(AEADLayoutData.encryptedLength);

    printf("aa data len: %d\n", aaelen);
    printf("encrypted size: %d\n", encryptedLength);

    unsigned char *_aadata = new unsigned char[aaelen];
    
    unsigned char *_encrypted = new unsigned char[encryptedLength];
        
    if (encrypted_aead_file.read((char*)_aadata, aaelen)) {    
        printf("aadata read: success\n");
    } else {
         printf("aadata read: error\n");
         printf("Oh dear, something went wrong with read()! %s\n", strerror(errno));
    }

    if (encrypted_aead_file.read((char*)_encrypted, encryptedLength)) {    
        printf("Encrypted read: success\n");
    } else {
         printf("aadata read: error\n");
         printf("Oh shit, something went wrong with read()! %s\n", strerror(errno));
    }
    
    // creating vectors: 
    
    std::vector<Byte> aeadEncryptedData(_encrypted,_encrypted+encryptedLength);
    
    // dumping..         
    //BIO_dump_fp(stdout, (const char*)aeadEncryptedData.data(), encryptedLength);

        
    encrypted_aead_file.close();

    vimOpenSSLSym *vimOpenSSLSymInternal = new vimOpenSSLSym(vimryptoParams);
        
    std::vector<Byte> _IV_aead;
    _IV_aead.insert(_IV_aead.begin(),salt, salt+4); 
    _IV_aead.insert(_IV_aead.end(),AEADLayoutData.acNonce, AEADLayoutData.acNonce+8);
    
    vimOpenSSLSymInternal->setSymmetricIV(_IV_aead);
    dumpVector("IV(aead): ", _IV_aead);

    vimOpenSSLSymInternal->setSymmetricKey(_keyData);
    dumpVector("key: ", _keyData);
    
//    vimOpenSSLSymInternal->setSymmetricIV(testIvInternal);        
//    vimOpenSSLSymInternal->setSymmetricKey(testKeyInternal);    
    // vimOpenSSLSymInternal->encryptSymmetricWithAEAData(testPlain, testAAD);
    
    AEADMessage aeadMessage = vimOpenSSLSymInternal->encryptSymmetricWithAEAData(_plainData,testOpenText);
    
    // checking whether vectors are the same
    
    if (aeadMessage.getEncrypted().size() == aeadEncryptedData.size()) {
        printf("Vectors matching\n");
        
        if ( memcmp ( aeadEncryptedData.data(), aeadMessage.getEncrypted().data(), aeadEncryptedData.size()) == 0 ) {
            printf("Cool! full coinsidence!\n");
        } else {
            printf("shit happens!\n");
        }
        
    }
            
    
        
    printf("============== TEST 4 : Symmetric decryption, With AAD ================= \n");

    // decrypting this crap
    
    vimOpenSSLSymInternal->setSymmetricIV(_IV_aead);
    vimOpenSSLSymInternal->setSymmetricKey(_keyData);
    
    //std::vector<Byte> decryptionResult = aeadMessage.getEncrypted();
    // converting to bytes
    std::vector<Byte> _cryptogram = aeadMessage.toBytes();
        
    AEAD res = vimOpenSSLSymInternal->decryptSymmetricWithAEAData( _cryptogram );
    
    printf("hmac check: %d\n", res.hmac_ok);

    // check this out 
    if (res.decrypted.size() == _plainData.size() ) {    
        if ( memcmp( res.decrypted.data(),_plainData.data(), res.decrypted.size() ) == 0 ) {
            printf("Let's dance! Checking plain vs decrypted: OK!!\n");
        } else {
            printf("That's the way the cookie crumbles. Decryption routine mismatch!\n");
        }
    } else {
        printf("Error in validation: sizes of the decrypted and the plain are different");
    }

    
    // compare plaintexts: 
    
    
    
    
    
}   