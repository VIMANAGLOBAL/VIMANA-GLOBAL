package io.vimana.cryptolib.dataformat;

/**
 * Class that represends decryption result of AEAD (unencrypted part) and encrypted part of message
 * @author alukin@gmail.com
 */
public class AEAD {
    /**
     * plain part of AEAD message
     */
    public byte[] plain;
    /**
     * decrypted part of AEAD message
     */
    public byte[] decrypted;
    /**
     * indicator of correctness
     */
    public boolean hmac_ok;
}
