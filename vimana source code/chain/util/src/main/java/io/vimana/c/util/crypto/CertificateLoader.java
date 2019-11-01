
package io.vimana.vim.util.crypto;

import io.vimana.cryptolib.KeyReader;
import io.vimana.cryptolib.impl.KeyReaderImpl;
import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.io.FileReader;
import java.io.IOException;
import java.security.cert.X509Certificate;
import org.bouncycastle.openssl.PEMParser;
import org.bouncycastle.pkcs.PKCS10CertificationRequest;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;


/**
 * Loads all provided actor's certificates
 * @author alukin@gmail.com
 */
public class CertificateLoader {
    private static final String CA_CHAIN = "VIRA-chain.pem";
    
    static final Logger logger = LoggerFactory.getLogger(CertificateLoader.class);

    public CertificateLoader() {
        //TODO: load CA cain
    }

    
    public VimanaCSR loadCSR(String path){
        PKCS10CertificationRequest cr;
        VimanaCSR res = null;
        FileReader fr;
        try {
            fr = new FileReader(path);
            PEMParser parser = new PEMParser(fr);
            cr = (PKCS10CertificationRequest)parser.readObject();
            res = VimanaCSR.fromPKCS10(cr);            
        } catch (IOException ex) {
            logger.error("Can not read PKCS#10 file: "+path,ex);
        }
        return res;
    }
    
    public VimanaCertificate loadCertificate(String path){
        VimanaCertificate res = null;
        try {
            KeyReader kr = new KeyReaderImpl();
            X509Certificate cert = kr.readX509CertPEMorDER(new FileInputStream(path));
            res =  new VimanaCertificate(cert);
        } catch (FileNotFoundException | VimanaCertificateException ex) {
            logger.error("Can not load certificate", ex);
        }
        return res;
    }
    
    public boolean verifyCertificate(VimanaCertificate vc){
        return true;
        //TODO: verify against CA chain, validity date and so on
    }
    
 }
