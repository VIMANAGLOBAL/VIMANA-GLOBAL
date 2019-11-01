package io.vimana.cryptolib.impl;

import io.vimana.cryptolib.vimryptoDigest;
import io.vimana.cryptolib.vimryptoParams;
import io.vimana.cryptolib.CryptoNotValidException;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.security.spec.InvalidKeySpecException;
import javax.crypto.SecretKey;
import javax.crypto.SecretKeyFactory;
import javax.crypto.spec.PBEKeySpec;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

/**
 *
 * @author al
 */
public class JCEDigestImpl implements vimryptoDigest{
    
    private Logger log = LoggerFactory.getLogger(JCEDigestImpl.class);
    
    final vimryptoParams params;

    public JCEDigestImpl(vimryptoParams params) {
        this.params = params;
    }
    
    @Override
    public byte[] digest(byte[] message)  throws CryptoNotValidException{
        try {
            MessageDigest hash = MessageDigest.getInstance(params.getDigester());
            hash.update(message);
            return hash.digest();
        } catch (NoSuchAlgorithmException ex) {
            throw new CryptoNotValidException("No "+params.getDigester()+" defined",ex);
        }
    }    

    @Override
    public byte[] sha256(byte[] message) throws CryptoNotValidException{
        try {
            MessageDigest hash = MessageDigest.getInstance("SHA-256");
            hash.update(message);
            return hash.digest();
        } catch (NoSuchAlgorithmException ex) {
            throw new CryptoNotValidException("No SHA-256 defined",ex);
        }
    }

    @Override
    public byte[] sha512(byte[] message)  throws CryptoNotValidException{
        try {
            MessageDigest hash = MessageDigest.getInstance("SHA-512");
            hash.update(message);
            return hash.digest();
        } catch (NoSuchAlgorithmException ex) {
            throw new CryptoNotValidException("No SHA-512 defined",ex);
        }        
    }

    @Override
    public byte[] sha3_256(byte[] message)  throws CryptoNotValidException{
        try {
            MessageDigest hash = MessageDigest.getInstance("SHA3-256");
            hash.update(message);
            return hash.digest();
        } catch (NoSuchAlgorithmException ex) {
            throw new CryptoNotValidException("No SH3A-256 defined",ex);
        }        
    }

    @Override
    public byte[] sha3_384(byte[] message) throws CryptoNotValidException {
        try {
            MessageDigest hash = MessageDigest.getInstance("SHA3-384");
            hash.update(message);
            return hash.digest();
        } catch (NoSuchAlgorithmException ex) {
            throw new CryptoNotValidException("No SH3A-384 defined",ex);
        }     
    }

    @Override
    public byte[] sha3_512(byte[] message) throws CryptoNotValidException {
        try {
            MessageDigest hash = MessageDigest.getInstance("SHA3-512");
            hash.update(message);
            return hash.digest();
        } catch (NoSuchAlgorithmException ex) {
            throw new CryptoNotValidException("No SH3A-512 defined",ex);
        } 
    }

    @Override
    public byte[] PBKDF2(String passPhrase, byte[] salt)  throws CryptoNotValidException
    {
        if(salt==null){
            throw new CryptoNotValidException("Salt can not be null, lenght is 12 bytes for PBKDF2");
        }
        try {
            SecretKeyFactory skf = SecretKeyFactory.getInstance(vimryptoParams.KEY_DERIVATION_FN);
            PBEKeySpec spec = new PBEKeySpec( passPhrase.toCharArray(), salt, vimryptoParams.PBKDF2_ITERATIONS, vimryptoParams.PBKDF2_KEYELEN);
            SecretKey key = skf.generateSecret(spec);
            
            byte[] res = key.getEncoded( );
            return res; 
        } catch (NoSuchAlgorithmException ex) {
            //ignore, we use constants
        } catch (InvalidKeySpecException ex) {
            throw new CryptoNotValidException("Possibly invaliud salt lenght for PBKDF2");
        }
        return null;
    }
}
