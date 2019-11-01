package io.vimana.cryptolib;

import java.security.InvalidKeyException;
import java.security.PrivateKey;
import java.security.PublicKey;

/**
 * This interface provides some weak encryption
 * and strong signature of encrypted message. The purpose is sending of signed message
 * to many recipients.
 * ATTENTION!!! Public key is used for encryption and decryption alongside with 
 * pre-shared secret (salt) known to sender and all recipients.
 * It means that Alice takes her publick key, "salts" it with pre-shared secret,
 * puts it in key derivation function and gets symmetric key and IV (256 bits on key + N bits of iv).
 * Then this symmetric key is used by all participants to encrypt and decrypt message.
 * Message is signed by sender with his private key and can be verified with sender's
 * public key. Exception CryptoNotValidException is thrown in signature can not be verified
 * @author alukin@gmail.com
 */
public interface vimryptoExt {

    /**
     * Set key for AES/GCM which is used for symmetrical encryption.
     *
     * @param key then 128 or 256 bits of key
     * @throws CryptoNotValidException, IllegalArgumentException
     */
    public void setSymmetricKey(byte[] key) throws CryptoNotValidException;

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
    public void setSymmetricIV(byte[] IV);

    /**
     * Set 4 bytes of salt, fixed part of GCM IV
     *
     * @param salt 4 bytes array
     */
    public void setSymmetricSalt(byte[] salt);

    /**
     * set 8 bits of variable part of GCM IV
     *
     * @param explicit_nounce 8 bit array of nounce if explicit_nounce is null
     * random value is generated
     */
    public void setSymmetricNounce(byte[] explicit_nounce) throws CryptoNotValidException;

    /**
     * Sets asymetric keys
     *
     * @param ourPubkey public key from our key pair
     * @param privKey private key from out key pair
     * @param theirPubKey public key of remote party
     * @throws InvalidKeyException
     */
    public void setAsymmetricKeys(PublicKey ourPubkey, PrivateKey privKey, PublicKey theirPubKey) throws InvalidKeyException;

    /**
     * Encrypts message with derived from sender's public key and pre-shaered secret.
     * Signs with sender's private key.
     * @param plain plain text to encrypt
     * @param preSharedSecret 12 bytes of pre-shared secrets known to all participants
     * @return necrypted and signed message.
     */
    byte[] reverseSchemeEncryptAndSign(byte[] plain, byte[] preSharedSecret);
    
    /**
     * Decrypts message with derived from sender's public key and pre-shaered secret.
     * Cheks signature with sender's public key.
     * @param encrypted_and_signed
     * @param preSharedSecret 12 bytes of  pre-shared secrets known to all participants
     * @return decrupted message
     * @throws CryptoNotValidException if signature can not be verified
     */
    byte[] reverseSchemeDecryptAndVerify(byte[] encrypted_and_signed, byte[] preSharedSecret) throws CryptoNotValidException;
    
}
