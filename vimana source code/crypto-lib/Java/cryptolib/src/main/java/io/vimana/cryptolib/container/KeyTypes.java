package io.vimana.cryptolib.container;

/**
 * Key types indicator
 * @author alukin@gmail.com
 */
public enum KeyTypes {
    /**
     * PEM encoded public key, private key, certificate, etc
     */
    PEM,
    BITCOIN,
    ETHEREUM,
    OTHER    
}
