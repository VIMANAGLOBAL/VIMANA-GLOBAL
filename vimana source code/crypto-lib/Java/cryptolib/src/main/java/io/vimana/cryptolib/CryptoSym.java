package io.vimana.cryptolib;

import io.vimana.cryptolib.dataformat.AEAD;
import io.vimana.cryptolib.dataformat.AEADMessage;


/**
 * Interface to crypto routines
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
public interface vimryptoSym {

    /**
     * Set key for AES/GCM which is used for symmetrical encryption.
     *
     * @param key then 128 or 256 bits of key   0x67, 0xba, 0x05, 0x10, 0x26, 0x2a, 0xe4, 0x87, 0xd7, 0x37, 0xee, 0x62,
    0x98, 0xf7, 0x7e, 0x0c
     * @throws CryptoNotValidException, IllegalArgumentException
     */
    public void setSymmetricKey(byte[] key) throws CryptoNotValidException;

    /**
     *
     * @param IV Initialization vector variable part, 4+8=12 bytes, or salt and
     * explicit_nonce used to init GCM. So it could be 4 bytes of "fixed"
     * nonce or full 12 bytes. In case of 4 bytes random 8 bytes generated for
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
     * 12 bytes of salt + nounce
     *
     * @return IV consisting of salt and nounce
     */
    public byte[] getSymmetricIV();

    /**
     * Set 4 bytes of salt, fixed part of GCM IV
     *
     * @param salt 4 bytes array
     */
    public void setSymmetricSalt(byte[] salt);

    /**
     * set 8 bits of variable part of GCM IV
     *
     * @param explicit_nonce 8 bit array of nounce if explicit_nounce is null
     * random value is generated
     * @throws io.vimana.cryptolib.CryptoNotValidException
     */
    public void setSymmetricNonce(byte[] explicit_nonce) throws CryptoNotValidException;

    /**
     * get 8 bytes of variable part of GCM IV
     *
     * @return b bytes array
     */
    public byte[] getSymmetricNounce();

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
    public byte[] encryptSymmetric(byte[] plain) throws CryptoNotValidException;

    /**
     * Decrypt using using symmetric key and salt. Note, that nounce (8 bytes)
     * is part of message, placed in first 8 bytes of it.
     *
     * @param ciphered ciphered text prefixed with 8 bytes of nonce_explicit.
     * @return decrypted text
     * @throws CryptoNotValidException
     */
    public byte[] decryptSymmetric(byte[] ciphered) throws CryptoNotValidException;

    /**
     * Encrypt plain text, using keys abd IV setted by setSymmetricKeyIV(); add
     * unencrypted authenticated associated data
     *
     * @param plain plain text to encrypt
     * @param aeadata data to add unencrypted but authenticated by HMAC
     * @return AEADMessage that can be serialized tu byte[]
     * @throws CryptoNotValidException
     */
    public AEADMessage encryptSymmetricWithAEAData(byte[] plain, byte[] aeadata) throws CryptoNotValidException;

    /**
     * Decrypt AEAD message
     *
     * @param message specially formated message, @see AEADMessage
     * @return decrypted and verified data in AEAD structure
     * @throws CryptoNotValidException
     */
    public AEAD decryptSymmetricWithAEAData(byte[] message) throws CryptoNotValidException;

}
