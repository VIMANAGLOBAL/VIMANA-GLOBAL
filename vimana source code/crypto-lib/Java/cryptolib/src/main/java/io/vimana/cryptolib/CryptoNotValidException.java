package io.vimana.cryptolib;

/**
 *
 * @author alukin@gmail.com
 */
    public final class CryptoNotValidException extends Exception{

        public CryptoNotValidException(String message) {
            super(message);
        }

        public CryptoNotValidException(String message, Throwable cause) {
            super(message, cause);
        }

    }
