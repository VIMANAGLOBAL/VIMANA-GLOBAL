/* 
 * File:   Ivimrypto.h
 * Author: alukin@gmail.con
 *
 * Created on June 7, 2018, 7:16 PM
 */
#pragma once

#include <string>
#include <vector>
#include "AEADMessage.h"
#include "DataFormat/AEAD.h"
#include "global.h"

//using namespace std;

class vimryptoSym {

 /**
 * Set key and IV for AES/GCM which is used for symmetrical encryption.
 * @param key then 128, 192 or 256 bits of key
 * @param sz size in bytes
 * @throws CryptoNotValidException,  IllegalArgumentException
 */            
    virtual void setSymmetricKey( std::vector<Byte> &key )=0;

/**
     *
     * @param IV Initialization vector variable part, 4+8=12 bytes, or salt and
     * @param sz size in bytes
     * explicit_nounce used to init GCM. So it could be 4 bytes of "fixed"
     * nounce or full 12 bytes. In case of 4 bytes random 8 bytes generated for
     * nonce_explicit From RFC 5288: AES-GCM security requires that the counter
     * is never reused. The IV construction in Section 3 is designed to prevent
     * counter reuse. Implementers should also understand the practical
     * considerations of IV handling outlined in Section 9 of [GCM]. In this
     * class IV is 12 bytes as defined in RFC 5116 struct { opaque salt[4];
     * opaque nonce_explicit[8]; } GCMNonce; Salt is "fixed" part of IV and
     * comes with key, nounce_explicit is "variable" part of IV and comes with
     * message. So IV in this method should be 12 bytes long
     */
    virtual void setSymmetricIV(std::vector<Byte> &IV)=0;
    
    
    
     /**
     * 12 bytes of salt + nounce
     *
     * @return IV consisting of salt and nounce
     */
    virtual std::vector<Byte> getSymmetricIV()=0;

    /**
     * Set 4 bytes of salt, fixed part of GCM IV
     *
     * @param salt 4 bytes array
     * @param sz size in bytes
     */
    virtual void setSymmetricSalt( std::vector<Byte> &salt ) =0;

    /**
     * set 8 bits of variable part of GCM IV
     *
     * @param explicit_nounce 8 bit array of nounce if explicit_nounce is null
     * @param sz size in bytes
     * random value is generated
     * @throws io.vimana.cryptolib.exception.CryptoNotValidException if salt is not set
     */
    virtual void setSymmetricNounce( std::vector<Byte> &explicit_nounce )=0;

    /**
     * get 8 bytes of variable part of GCM IV
     *
     * @return b bytes array
     */
    virtual std::vector<Byte> getSymmetricNounce()=0;

    /**
     * Encrypt using keys abd IV set by setSymmetricKey(), setSymmetricSalt(),
     * setSymmetricNounce();
     *
     * @param plain plain text to encrypt
     * @return ciphered text. Note: to be able to decrypt this message, not only
     * key, but salt and nounce_explicit must be know to receiving party! So
     * salt (4bytes) goes with key, and nounce (8bytes) prefixes message.
     * @throws CryptoNotValidException
     */
    virtual std::vector<Byte> encryptSymmetric( std::vector<Byte> &plain)=0;

    /**
     * Decrypt using using symmetric key and salt. Note, that nounce (8 bytes)
     * is part of message, placed in first 8 bytes of it.
     *
     * @param ciphered ciphered text prefixed with 8 bytes of nonce_explicit.
     * @param sz size in bytes
     * @return decrypted text
     * @throws CryptoNotValidException
     */
    virtual std::vector<Byte> decryptSymmetric( std::vector<Byte> &ciphered )=0;

    /**
     * Encrypt plain text, using keys abd IV setted by setSymmetricKeyIV(); add
     * unencrypted authenticated associated data
     *
     * @param plain plain text to encrypt
     * @param aeadata data to add unencrypted but authenticated by HMAC
     * @return AEADMessage that can be serialized tu byte[]
     * @throws CryptoNotValidException
     */
    virtual AEADMessage encryptSymmetricWithAEAData( std::vector<Byte> &plain, std::vector<Byte> &aeadata )=0;
    /**
     * Decrypt AEAD message
     *
     * @param message specially formated message, @see AEADMessage
     * @param sz size in bytes
     * @return decrypted and verified data in AEAD structure
     * @throws CryptoNotValidException
     */
    virtual AEAD decryptSymmetricWithAEAData( std::vector<Byte> &message )=0;

};


