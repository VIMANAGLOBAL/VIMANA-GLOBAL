package io.vimana.cryptolib;

import io.vimana.cryptolib.dataformat.AEAD;
import io.vimana.cryptolib.dataformat.AEADMessage;
import java.security.InvalidKeyException;
import java.security.KeyPair;
import java.security.PrivateKey;
import java.security.PublicKey;


/**
 * Interface to asymmetric crypto routines
 *
 * @author alukin@gmail.com REFERENCES: [1]
 * https://tools.ietf.org/rfc/rfc5288.txt AES Galois Counter Mode (GCM) Cipher
 * Suites for TLS [2] https://tools.ietf.org/html/draft-ietf-tls-tls13-28 TLS
 * 1.3 draft [3] https://tools.ietf.org/html/rfc5246 TLS 1.2 [4]
 * https://tools.ietf.org/html/rfc5116 An Interface and Algorithms for
 * Authenticated Encryption [5] https://tools.ietf.org/html/rfc4106 The Use of
 * Galois/Counter Mode (GCM) in IPsec Encapsulating Security Payload (ESP) [6]
 * https://tools.ietf.org/html/rfc7748 Elliptic Curves for Security
 */
public interface vimryptoAsym {
//=================== asymetrric block ======================
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
     * Key pair with our (PublicKey, PrivateKey)
     * @param keyPair
     */
    public void setOurKeyPair(KeyPair keyPair);

    /**
     * set their public key
     * @param theirPublicKey
     */
    public void setTheirPublicKey(PublicKey theirPublicKey);
    
    /**
     * Calulate shared key usable by both ends of encryption
     * @return encoded shared key
     */
    public byte[] calculateSharedKey();
    /**
     * Encrypt using shared key derived from assymeric keys and ECIES (AES-CBC)
     *
     * @param plain plain text
     * @return encrypted text prefixed with 16 bytes of IV
     * @throws CryptoNotValidException
     */
    public byte[] encryptAsymmetricIES(byte[] plain) throws CryptoNotValidException;

    /**
     * Decrypt using shared key derived from assymetric keys and ECIES (AES-CBC)
     *
     * @param ciphered encrypted text prefixed with 16 bytes of IV
     * @return plain text
     * @throws CryptoNotValidException
     */
    public byte[] decryptAsymmetricIES(byte[] ciphered) throws CryptoNotValidException;

    /**
     * Encrypt using shared key derived from assymeric keys and AES-GCM with
     * random IV.Note that all 12 bytes of IV will prefix message.
     *
     * @param plain plain text
     * @return encrypted text prefixed with 12 bytes of IV
     * @throws CryptoNotValidException
     */
    public byte[] encryptAsymmetric(byte[] plain) throws CryptoNotValidException;

    /**
     * Decrypt using shared key derived from assymetric keys and AES-GCM with
     * random IV
     *
     * @param ciphered encrypted text prefixed with 12 bytes of IV
     * @return plain text
     * @throws CryptoNotValidException
     */
    public byte[] decryptAsymmetric(byte[] ciphered) throws CryptoNotValidException;

    /**
     * Encrypt plain text, using keys derived from assymertic keys; add
     * unencrypted authenticated associated data
     *
     * @param plain plain text to encrypt
     * @param aeadata data to add unencrypted but authenticated by HMAC
     * @return specially formated data that includes IV length in bytes
     * (4bytes), IV itself (variable part), unencryped data lenght (4 bytes),
     * unencrypted data and then encrypted data in the rest of message;
     * @throws CryptoNotValidException
     */
    public AEADMessage encryptAsymmetricWithAEAData(byte[] plain, byte[] aeadata) throws CryptoNotValidException;

    /**
     * Decrypt AEAD message ciphered with key derived from assymetric keys
     *
     * @param message specially formated message, @see AEADMessage
     * @return decrypted and verified data in AEAD structure
     * @throws CryptoNotValidException
     */
    public AEAD decryptAsymmetricWithAEAData(byte[] message) throws CryptoNotValidException;

    /**
     * Sign message using private key
     *
     * @param message input message. No matter encrypted or not.
     * @return signature bytes
     * @throws io.vimana.cryptolib.exception.CryptoNotValidException
     */
    public byte[] sign(byte[] message) throws CryptoNotValidException;

    /**
     * Verifies signature using theirPublicKey
     *
     * @param message message bytes
     * @param signature signature bytes
     * @return true if message is authentic false otherwise
     */
    public boolean verifySignature(byte[] message, byte[] signature);
    
    /**
     * Performs ephemeral key EC Diffie-Hallman step1:
     * generates temporary key pair, signs teporary public key with
     * real private key.
     * @return signerd temporal public key. Format: size of key: integer; nyte[] key; byte[] signature 
     * @throws io.vimana.cryptolib.exception.CryptoNotValidException 
     */
    public byte[] ecdheStep1() throws CryptoNotValidException;
    
    /**
     * Performs step 2 of  ephemeral key EC Diffie-Hallman:
     * takes signed key form other side, verifies signature,
     * makes ECDH using temporary keys, hashes and returns
     * shared key.This key then should be used for symmetric encryption.
     * @param signedEphemeralPubKey signed shared key from other side
     * @return shared key
     * @throws io.vimana.cryptolib.exception.CryptoNotValidException
     */
    public byte[] ecdheStep2(byte[] signedEphemeralPubKey)  throws CryptoNotValidException;
    /**
     * Get current parameters of this crypto implementation
     * @return current parameters of crypto
     */
    public vimryptoParams getParams();
}
