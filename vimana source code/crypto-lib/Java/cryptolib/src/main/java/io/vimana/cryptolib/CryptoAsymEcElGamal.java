package io.vimana.cryptolib;

import io.vimana.cryptolib.dataformat.FBElGamalEncryptedMessage;
import io.vimana.cryptolib.dataformat.FBElGamalKeyPair;
import java.math.BigInteger;
import java.security.InvalidKeyException;
import java.security.KeyPair;
import java.security.PrivateKey;
import java.security.PublicKey;




/**
 *
 * @author nemez
 */
public interface vimryptoAsymEcElGamal {
    
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
     * ElGamal Decryption routine using private key 
     *
     * @param priKey private key in format of java.math.BigInteger
     * @param cryptogram FBElGamalEncryptedMessage container, consisting 
     * of M1 as ECPoint with X,Y coordinates and M2 as BigInteger
     * @return plain text in format of BigInteger
     * @throws CryptoNotValidException
     */

    public BigInteger decryptAsymmetric(BigInteger priKey, FBElGamalEncryptedMessage cryptogram) throws CryptoNotValidException;
    
    /**
     * ElGamal Encryption routine using private key 
     *
     * @param publicKeyX x coordinate of public key, presented as BigInteger
     * @param publicKeyY y coordinate of public key, presented as BigInteger
     * @param plainText  plain text in format of BigInteger
     * @return FBElGamalEncryptedMessage crypto container, consisting 
     * of M1 as ECPoint with X,Y coordinates and M2 as BigInteger     
     * @throws CryptoNotValidException
     */
    
    public FBElGamalEncryptedMessage encryptAsymmetric(BigInteger publicKeyX, BigInteger publicKeyY, BigInteger plainText) throws CryptoNotValidException;
        
    /**
     * ElGamal Keys generation routine
     *
     * @return FBElGamalKeyPair crypto container, consisting 
     * of as public key as ECPoint with X,Y coordinates and 
     * private key as BigInteger         
     */
        
    public FBElGamalKeyPair generateOwnKeys() throws CryptoNotValidException;

    /**
     * ElGamal getter for public key abscissa 
     *
     * @return x coordinate of public as BigInteger
     */
    
    public BigInteger getPublicKeyX();

    /**
     * ElGamal getter for public key ordinate 
     *
     * @return y coordinate of public as BigInteger
     */
        
    public BigInteger getPublicKeyY();
    
    /**
     * ElGamal getter for private key  
     *
     * @return private key as BigInteger
     */
        
    public BigInteger getPrivateKey();
    
    
    
            
    
    
    
}
