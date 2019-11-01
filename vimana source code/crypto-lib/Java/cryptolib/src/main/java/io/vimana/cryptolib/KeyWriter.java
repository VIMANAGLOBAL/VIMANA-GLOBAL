package io.vimana.cryptolib;

import java.io.IOException;
import java.security.PrivateKey;
import java.security.PublicKey;
import java.security.cert.X509Certificate;
import org.bouncycastle.pkcs.PKCS10CertificationRequest;

/**
 *
 * @author al
 */
public interface KeyWriter {

    public  void addX509CertToPKCS12(X509Certificate certificate, String pathToJKS, String alias, String jksPassword);

    public  byte[] serializePrivateKey(PrivateKey privk);

    public  byte[] serializePublicKey(PublicKey pubk);

    public  void writeCertificateRequestPEM(String path, PKCS10CertificationRequest cr) throws IOException;

    public  void writePvtKeyPEM(String path, PrivateKey key) throws IOException;
    
    public  String getPvtKeyPEM(PrivateKey key) throws IOException;
    
    public  void writePvtKeyPKCS12(String path);

    public  void writeX509CertificatePEM(String path, X509Certificate certificate) throws IOException;
    
    public  String  getX509CertificatePEM(X509Certificate certificate) throws IOException;

    public String getCertificateRequestPEM(PKCS10CertificationRequest cr)  throws IOException;
    
}
