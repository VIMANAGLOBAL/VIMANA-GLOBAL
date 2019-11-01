package io.vimana.cryptolib;

import java.io.FileNotFoundException;
import java.io.IOException;
import java.io.InputStream;
import java.security.KeyPair;
import java.security.KeyStoreException;
import java.security.NoSuchAlgorithmException;
import java.security.PrivateKey;
import java.security.PublicKey;
import java.security.UnrecoverableKeyException;
import java.security.cert.CertificateException;
import java.security.cert.X509Certificate;


/**
 * Reads keys in various formats and returns in the form acceptable by vimrypto
 *
 * @author alukin@gmail.com
 */
public interface KeyReader {

    public  PublicKey extractPublicKeyFromX509(X509Certificate c) throws CertificateException, CryptoNotValidException;

    public  PrivateKey readEncryptedPrivateKeyPEM(InputStream input, String password) throws IOException;
    
    public  X509Certificate readX509CertPEMorDER(InputStream is);
    
    public  KeyPair readPKCS12File(String path, String password, String alias) throws KeyStoreException, FileNotFoundException, IOException, NoSuchAlgorithmException, CertificateException, UnrecoverableKeyException;

    public  PrivateKey readPrivateKeyPEM(InputStream input) throws IOException;

    public  PrivateKey readPrivateKeyPKCS12(String PKCS12filePath, String password, String keyPassword, String alias) throws KeyStoreException, IOException, FileNotFoundException, NoSuchAlgorithmException, CertificateException, UnrecoverableKeyException;

    public  PrivateKey readPrivateKeyPKCS8(InputStream input);

    public  PublicKey readPublicKeyPKCS12(String PKCS12filePath, String password, String alias) throws KeyStoreException, IOException, FileNotFoundException, NoSuchAlgorithmException, CertificateException, UnrecoverableKeyException;
     /**
     * Reads private key from most standard and compatible representation (ASN.1 in PKSC#8)
     * Compatible with OpenSSL.
     * @param keyBytes bytes of private key
     * @return re-constructed private key
     * @throws io.vimana.cryptolib.exception.CryptoNotValidException
     */
    public  PrivateKey deserializePrivateKey(byte[] keyBytes) throws CryptoNotValidException;
        /**
     * Reads public key from most standard and compatible representation (ASN.1 in X509)
     * Compatible with OpenSSL.
     * @param keyBytes bytes of public key
     * @return re-constructed public key
     * @throws io.vimana.cryptolib.exception.CryptoNotValidException
     */
    public PublicKey deserializePublicKey(byte[] keyBytes) throws CryptoNotValidException;
}
