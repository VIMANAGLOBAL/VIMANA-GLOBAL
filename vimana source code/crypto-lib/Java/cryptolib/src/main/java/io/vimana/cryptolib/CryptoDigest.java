package io.vimana.cryptolib;


/**
 *
 * @author alukin@gmail.com
 */
public interface vimryptoDigest {
    
   /**
    * Default digest algorythm defined by vimryptoParams 
    * @param message
    * @return
     * @throws io.vimana.cryptolib.CryptoNotValidException
    */  
   public byte[] digest(byte[] message) throws CryptoNotValidException; 
   /**
    * Hash algorithms defined in FIPS PUB 180-4. SHA-256
    * @param message
    * @return
    * @throws CryptoNotValidException 
    */
   public byte[] sha256 (byte[] message)throws CryptoNotValidException;
   /**
    * Hash algorithms defined in FIPS PUB 180-4. SHA-512
    * @param message
    * @return
    * @throws CryptoNotValidException 
    */
   public byte[] sha512 (byte[] message)throws CryptoNotValidException;
   /**
    * Permutation-based hash and extendable-output functions as defined in FIPS PUB 202. 
    * SHA-3 256 bit
    * @param message
    * @return
    * @throws CryptoNotValidException 
    */
   public byte[] sha3_256 (byte[] message)throws CryptoNotValidException;
   /**
    * Permutation-based hash and extendable-output functions as defined in FIPS PUB 202. 
    * SHA-3 384 bit
    * @param message
    * @return
    * @throws CryptoNotValidException 
    */
   public byte[] sha3_384 (byte[] message)throws CryptoNotValidException;
   /**
    * Permutation-based hash and extendable-output functions as defined in FIPS PUB 202. 
    * SHA-3 512 bit 
    * @param message
    * @return
    * @throws CryptoNotValidException 
    */
   public byte[] sha3_512 (byte[] message)throws CryptoNotValidException;
   
   public byte[] PBKDF2(String passPhrase, byte[] salt) throws CryptoNotValidException;
}
