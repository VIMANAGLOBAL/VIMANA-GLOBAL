package io.vimana.cryptolib.impl;

import io.vimana.cryptolib.KeyWriter;
import java.io.FileWriter;
import java.io.IOException;
import java.io.StringWriter;
import java.security.PrivateKey;
import java.security.PublicKey;
import java.security.cert.CertificateEncodingException;
import java.security.cert.X509Certificate;
import org.bouncycastle.pkcs.PKCS10CertificationRequest;
import org.bouncycastle.util.io.pem.PemObject;
import org.bouncycastle.util.io.pem.PemWriter;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

/**
 * Write different keys in standard formats
 *
 * @author al
 */
public class KeyWriterImpl implements KeyWriter {
    private static Logger log = LoggerFactory.getLogger(KeyWriterImpl.class);
    
    @Override
    public void writePvtKeyPEM(String path, PrivateKey key) throws IOException {
        try (PemWriter writer = new PemWriter(new FileWriter(path))) {
            writer.writeObject(new PemObject("PRIVATE KEY", key.getEncoded()));
            //TODO: encrypted? "ENCRYPTED PRIVATE KEY"
        }
    }

    @Override
    public void writePvtKeyPKCS12(String path) {
        throw new UnsupportedOperationException("Not supported yet."); 
    }

    @Override
    public void writeCertificateRequestPEM(String path, PKCS10CertificationRequest cr) throws IOException {
        try (PemWriter writer = new PemWriter(new FileWriter(path))) {
            byte[] enc = cr.getEncoded();
            writer.writeObject(new PemObject("CERTIFICATE REQUEST", enc));
        }
    }

    @Override
    public void writeX509CertificatePEM(String path, X509Certificate certificate) throws IOException {
        if (certificate == null) {
            throw new IllegalArgumentException("certificate must be defined.");
        }
        try (PemWriter writer = new PemWriter(new FileWriter(path))) {
                writer.writeObject(new PemObject("CERTIFICATE", certificate.getEncoded()));
        } catch (CertificateEncodingException e) {
            throw new RuntimeException("Problem wirh a certificate", e);
        }
    }

    @Override
    public void addX509CertToPKCS12(X509Certificate certificate, String pathToJKS, String alias, String jksPassword) {
        throw new UnsupportedOperationException("Not supported yet."); 
    }
    
    @Override
    public byte[] serializePublicKey(PublicKey pubk){
        return pubk.getEncoded();
    }
    
    @Override
    public byte[] serializePrivateKey(PrivateKey privk){
       return privk.getEncoded();
    }

    @Override
    public String getCertificateRequestPEM(PKCS10CertificationRequest cr) throws IOException {
         StringWriter sw = new StringWriter(2048);
         PemWriter writer = new PemWriter(sw);
         byte[] enc = cr.getEncoded();
         writer.writeObject(new PemObject("CERTIFICATE REQUEST", enc));
         writer.flush();
         return sw.toString();
    }

    @Override
    public String getPvtKeyPEM(PrivateKey key) throws IOException {
        StringWriter sw = new StringWriter(2048);
        PemWriter writer = new PemWriter(sw);
        writer.writeObject(new PemObject("PRIVATE KEY", key.getEncoded()));
        writer.flush();
        return sw.toString();
    }

    @Override
    public String getX509CertificatePEM(X509Certificate certificate) throws IOException {
        if (certificate == null) {
            throw new IllegalArgumentException("certificate must be defined.");
        }
        StringWriter sw = new StringWriter();
        try (PemWriter writer = new PemWriter(sw)) {
            writer.writeObject(new PemObject("CERTIFICATE", certificate.getEncoded()));
            writer.flush();
        } catch (CertificateEncodingException e) {
            throw new RuntimeException("Problem wirh a certificate", e);
        }
        return sw.toString();
    }
}
