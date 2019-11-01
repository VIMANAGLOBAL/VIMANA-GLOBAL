#pragma once

#include <string>
#include <vecor>
#include "global.h"

class vimryptoExt {
public:
    
        /**
     * Set key for AES/GCM which is used for symmetrical encryption.
     *
     * @param key then 128 or 256 bits of key
     * @throws CryptoNotValidException, IllegalArgumentException
     */
    void setSymmetricKey(std::vector<Byte> &key)=0; 

    /**
     *
     * @param IV Initialization vector variable part, 4+8=12 bytes, or salt and
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
    void setSymmetricIV(std::vector &IV)=0;

    /**
     * Set 4 bytes of salt, fixed part of GCM IV
     *
     * @param salt 4 bytes array
     */
    void setSymmetricSalt(std::vector &salt)=0;

    /**
     * set 8 bits of variable part of GCM IV
     *
     * @param explicit_nounce 8 bit array of nounce if explicit_nounce is null
     * random value is generated
     */
    void setSymmetricNounce( std::vector &explicit_nounce)=0;// throws CryptoNotValidException;

    /**
     * Sets asymetric keys
     *
     * @param ourPubkey public key from our key pair
     * @param privKey private key from out key pair
     * @param theirPubKey public key of remote party
     * @throws InvalidKeyException
     */
//    void setAsymmetricKeys(PublicKey ourPubkey, PrivateKey privKey, PublicKey theirPubKey);// throws InvalidKeyException;

    /**
     * Encrypts message with derived from sender's public key and pre-shaered secret.
     * Signs with sender's private key.
     * @param plain plain text to encrypt
     * @param preSharedSecret 12 bytes of pre-shared secrets known to all participants
     * @return necrypted and signed message.
     */
    unsigned char* reverseSchemeEncryptAndSign(std::vector &plain, std::vector &preSharedSecret)=0;
    
    /**
     * Decrypts message with derived from sender's public key and pre-shaered secret.
     * Cheks signature with sender's public key.
     * @param encrypted_and_signed
     * @param preSharedSecret 12 bytes of  pre-shared secrets known to all participants
     * @return decrupted message
     * @throws CryptoNotValidException if signature can not be verified
     */
    std::vector reverseSchemeDecryptAndVerify(std::vector &encrypted_and_signed, &std::vector preSharedSecret)=0;
   
};


