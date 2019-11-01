package io.vimana.cryptolib.impl;

import io.vimana.cryptolib.KeyReader;
import java.io.ByteArrayInputStream;
import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.io.Reader;
import java.security.Key;
import java.security.KeyFactory;
import java.security.KeyPair;
import java.security.KeyStore;
import java.security.KeyStoreException;
import java.security.NoSuchAlgorithmException;
import java.security.Principal;
import java.security.PrivateKey;
import java.security.PublicKey;
import java.security.UnrecoverableKeyException;
import java.security.cert.Certificate;
import java.security.cert.CertificateException;
import java.security.cert.CertificateFactory;
import java.security.cert.X509Certificate;
import java.security.interfaces.ECPublicKey;
import java.security.interfaces.RSAPublicKey;
import java.security.spec.InvalidKeySpecException;
import java.security.spec.PKCS8EncodedKeySpec;
import java.util.Arrays;
import java.util.Enumeration;

import io.vimana.cryptolib.CryptoNotValidException;
import io.vimana.cryptolib.vimryptoParams;
import java.security.NoSuchProviderException;
import java.security.spec.X509EncodedKeySpec;
import org.bouncycastle.asn1.ASN1InputStream;
import org.bouncycastle.asn1.pkcs.PrivateKeyInfo;
import org.bouncycastle.openssl.PEMDecryptorProvider;
import org.bouncycastle.openssl.PEMParser;
import org.bouncycastle.openssl.jcajce.JcaPEMKeyConverter;
import org.bouncycastle.openssl.jcajce.JcePEMDecryptorProviderBuilder;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

/**
 * Reads keys in various formats and returns in the form acceptable by vimrypto
 *
 * @author alukin@gmail.com
 */
public class KeyReaderImpl implements KeyReader {

    private static Logger log = LoggerFactory.getLogger(KeyReaderImpl.class);

    @Override
    public PublicKey extractPublicKeyFromX509(X509Certificate c) throws CertificateException, CryptoNotValidException {

            PublicKey pubKey = c.getPublicKey();
            if (pubKey instanceof RSAPublicKey) {
                // We have an RSA public key, we do not want such old crap
                throw new CryptoNotValidException("We do not support RSA encryption, please use ECC");
            } else if (pubKey instanceof ECPublicKey) {
                // We have an EC public key, it is good
                ECPublicKey ecpk = (ECPublicKey) pubKey;
                return ecpk;
            } else {
                // Unknown key type, should never happen
                throw new CryptoNotValidException("Unknown encryption in certificate, please use ECC");                
            }
    }

    @Override
    public PrivateKey readPrivateKeyPEM(InputStream input) throws IOException {
        Reader rdr = new InputStreamReader(input);
        PrivateKeyInfo parsed = (PrivateKeyInfo) new PEMParser(rdr).readObject();
        JcaPEMKeyConverter converter = new JcaPEMKeyConverter();
        PrivateKey key = converter.getPrivateKey(parsed);
        return key;
    }

    @Override
    public  PrivateKey readEncryptedPrivateKeyPEM(InputStream input, String password) throws IOException {
        Reader rdr = new InputStreamReader(input);
        Object parsed =  new PEMParser(rdr).readObject();
        PEMDecryptorProvider decProv = new JcePEMDecryptorProviderBuilder().build(password.toCharArray());
        JcaPEMKeyConverter converter = new JcaPEMKeyConverter();
        PrivateKey key = converter.getPrivateKey((PrivateKeyInfo) parsed);
        //TODO: decrypt?
        return key;
    }

    @Override
    public  PrivateKey readPrivateKeyPKCS8(InputStream input) {
        try {
            byte[] buffer = new byte[16384];
            int size = input.read(buffer);
            byte[] bytes = Arrays.copyOf(buffer, size);
            /* Check to see if this is in an EncryptedPrivateKeyInfo structure. */
            PKCS8EncodedKeySpec spec = new PKCS8EncodedKeySpec(bytes);
            /*
             * Now it's in a PKCS#8 PrivateKeyInfo structure. Read its Algorithm
             * OID and use that to construct a KeyFactory.
             */
            ASN1InputStream bIn = new ASN1InputStream(new ByteArrayInputStream(spec.getEncoded()));
            PrivateKeyInfo pki = PrivateKeyInfo.getInstance(bIn.readObject());
            String algOid = pki.getPrivateKeyAlgorithm().getAlgorithm().getId();
            PrivateKey pk = KeyFactory.getInstance(algOid).generatePrivate(spec);
            return pk;
        } catch (IOException | NoSuchAlgorithmException | InvalidKeySpecException ex) {
            log.error("Can not read PKCS#8 private key: "+ex);
        } finally {
            try {
                input.close();
            } catch (IOException ex) {
            }
        }
        return null;
    }

    @Override
    public  PrivateKey readPrivateKeyPKCS12(String PKCS12filePath, String password, String keyPassword, String alias) throws KeyStoreException, IOException, FileNotFoundException, NoSuchAlgorithmException, CertificateException, UnrecoverableKeyException {
        KeyPair kp = readPKCS12File(PKCS12filePath, password, alias);
        return kp.getPrivate();
    }

    @Override
    public PublicKey readPublicKeyPKCS12(String PKCS12filePath, String password, String alias) throws KeyStoreException, IOException, FileNotFoundException, NoSuchAlgorithmException, CertificateException, UnrecoverableKeyException {
        KeyPair kp = readPKCS12File(PKCS12filePath, password, alias);
        return kp.getPublic();
    }

    @Override
    public KeyPair readPKCS12File(String path, String password, String alias) throws KeyStoreException, FileNotFoundException, IOException, NoSuchAlgorithmException, CertificateException, UnrecoverableKeyException {
        KeyStore ks = KeyStore.getInstance("PKCS12",vimryptoParams.getProvider());
        FileInputStream fis = new FileInputStream(path);
        ks.load(fis, password.toCharArray());

        Enumeration aliasEnum = ks.aliases();

        Key key = null;
        Certificate cert = null;
        KeyPair kp = null;
        while (aliasEnum.hasMoreElements()) {
            String keyName = (String) aliasEnum.nextElement();
            if (keyName.compareToIgnoreCase(alias) == 0) {
                key = ks.getKey(keyName, password.toCharArray());
                cert = ks.getCertificate(keyName);
                kp = new KeyPair(cert.getPublicKey(), (PrivateKey) key);
            }

        }

        return kp;
    }

    public static X509Certificate getCertFromPKCS12File(String path, String password, String alias) throws KeyStoreException, FileNotFoundException, IOException, NoSuchAlgorithmException, CertificateException {
        X509Certificate c = null;
        KeyStore p12 = KeyStore.getInstance("PKCS12",vimryptoParams.getProvider());
        p12.load(new FileInputStream(path), password.toCharArray());
        Enumeration e = p12.aliases();
        while (e.hasMoreElements()) {
            String calias = (String) e.nextElement();
            if (alias.compareTo(calias) == 0) {
                c = (X509Certificate) p12.getCertificate(alias);
                Principal subject = c.getSubjectDN();
                String subjectArray[] = subject.toString().split(",");
                for (String s : subjectArray) {
                    String[] str = s.trim().split("=");
                    String key = str[0];
                    String value = str[1];
                    System.out.println(key + " - " + value);
                }
                break;
            }
        }
        return c;
    }

    @Override
    public  X509Certificate readX509CertPEMorDER(InputStream is) {
        X509Certificate cert = null;
        try {
            CertificateFactory fact = CertificateFactory.getInstance("X.509");
            cert = (X509Certificate) fact.generateCertificate(is);           
        } catch (CertificateException ex) {
            log.error("Can not read X.509 certificate",ex);
        }
        return cert;
    }
    
    /**
     * Reads public key from most standard and compatible representation (ASN.1 in X509)
     * Compatible with OpenSSL.
     * @param keyBytes bytes of public key
     * @return re-constructed public key
     * @throws io.vimana.cryptolib.CryptoNotValidException
     */
    @Override
    public PublicKey deserializePublicKey(byte[] keyBytes) throws CryptoNotValidException{
        try {
            X509EncodedKeySpec spec = new X509EncodedKeySpec(keyBytes);
            KeyFactory kf = KeyFactory.getInstance("ECDSA", "BC");
            return kf.generatePublic(spec);
        } catch (NoSuchAlgorithmException | NoSuchProviderException | InvalidKeySpecException ex) {
            throw new CryptoNotValidException("Unsupported or invalid ECC public key", ex);
        }
    }
    
    /**
     * Reads private key from most standard and compatible representation (ASN.1 in PKSC#8)
     * Compatible with OpenSSL.
     * @param keyBytes bytes of private key
     * @return re-constructed private key
     * @throws io.vimana.cryptolib.CryptoNotValidException
     */
    @Override
    public  PrivateKey deserializePrivateKey(byte[] keyBytes) throws CryptoNotValidException{
        try {
            PKCS8EncodedKeySpec spec =  new PKCS8EncodedKeySpec(keyBytes);
            KeyFactory kf = KeyFactory.getInstance("ECDSA", "BC");
            return kf.generatePrivate(spec);
        } catch (NoSuchAlgorithmException | NoSuchProviderException | InvalidKeySpecException ex) {
            throw new CryptoNotValidException("Unsupported or invalid ECC public key", ex);
        }
    }
}
