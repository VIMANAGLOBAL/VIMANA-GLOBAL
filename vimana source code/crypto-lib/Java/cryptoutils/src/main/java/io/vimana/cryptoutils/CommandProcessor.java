package io.vimana.cryptoutils;

import io.vimana.cryptolib.vimryptoParams;
import io.vimana.cryptolib.KeyReader;
import io.vimana.cryptolib.KeyWriter;
import io.vimana.cryptolib.csr.CertificateRequestData;
import io.vimana.cryptolib.csr.KeyGenerator;
import io.vimana.cryptolib.CryptoNotValidException;
import io.vimana.cryptolib.container.PKCS12KeyStore;
import io.vimana.cryptolib.impl.KeyReaderImpl;
import io.vimana.cryptolib.impl.KeyWriterImpl;
import java.io.BufferedReader;
import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.security.KeyPair;
import java.security.cert.CertificateEncodingException;
import java.security.cert.X509Certificate;
import java.util.List;
import java.util.Properties;
import javax.net.ssl.TrustManager;
import javax.net.ssl.X509TrustManager;
import org.bouncycastle.pkcs.PKCS10CertificationRequest;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

/**
 * Processing of commands in Main
 * @author alukin@gmail.com
 */
public class CommandProcessor {
    private static final Logger log = LoggerFactory.getLogger(CommandProcessor.class);
    
    private final String pathToKeyStore;
    private final String ksAlias;
    private final String ksPassword;
    private final String pvtKeyPassword;
    private final boolean useKeyStore;
    PKCS12KeyStore ks;
    
    TrustManager[] trustAllCerts = new TrustManager[] {new X509TrustManager() {
                @Override
                public java.security.cert.X509Certificate[] getAcceptedIssuers() {
                    return null;
                }
                @Override
                public void checkClientTrusted(X509Certificate[] certs, String authType) {
                }
                @Override
                public void checkServerTrusted(X509Certificate[] certs, String authType) {
                }
            }
     }; 
    
    public CommandProcessor(String pathToKeyStore, String ksAlias, String ksPassword, String pvtKeyPassword) {
        this.pathToKeyStore = pathToKeyStore;
        this.ksAlias = ksAlias;
        this.ksPassword = ksPassword;
        this.pvtKeyPassword = pvtKeyPassword;
        useKeyStore=isKeystoreOK();
    }
    
    private boolean isKeystoreOK(){
        boolean res = false;
        if(pathToKeyStore!=null && !pathToKeyStore.isEmpty()){
            ks = new PKCS12KeyStore();
            res = ks.createOrOpenKeyStore(pathToKeyStore, ksPassword);
        }
        return res;
    }
    
    public void createCSR(CertificateRequestData cd, String path, String challlengePassword) throws Exception {
        if (path == null || path.isEmpty()) {
            path = "newreq.pem";
        }
        cd.processCertData(false);
        KeyGenerator kg = new KeyGenerator(vimryptoParams.createDefault());
        KeyPair kp = kg.generateKeys();
        PKCS10CertificationRequest cr = kg.createX509CertificateRequest(kp, cd, false,challlengePassword);
        KeyWriter kw = new KeyWriterImpl();
        kw.writeCertificateRequestPEM(path, cr);
        int idx = path.indexOf('.');
        if (idx < 0) {
            idx = path.length();
        }
        String key_path = path.substring(0, idx) + "_pvtkey.pem";
        kw.writePvtKeyPEM(key_path, kp.getPrivate());
        log.info("Certificate request written to file: " + path + ", private key is in file: " + key_path + "\n\n\t"
                + "Please keep your private key safe and in secret!");
    }

    public void createSelfSignedPair(CertificateRequestData cd, String path) throws IOException, CryptoNotValidException, CertificateEncodingException {
        if (path == null || path.isEmpty()) {
            path = "newcert.pem";
        }
        cd.processCertData(true);
        KeyGenerator kg = new KeyGenerator(vimryptoParams.createDefault());
        KeyPair kp = kg.generateKeys();
        X509Certificate cert = kg.createSerlfSignedX509v3(kp, cd);
        KeyWriter kw = new KeyWriterImpl();
        if(useKeyStore){
           ks.addPrivateKey(kp.getPrivate(), ksAlias, pvtKeyPassword, cert, cert);
           ks.save(pathToKeyStore,ksPassword);
        }
        kw.writeX509CertificatePEM( path, cert);
        int idx = path.indexOf('.');
        if (idx < 0) {
            idx = path.length();
        }
        String key_path = path.substring(0, idx) + "_pvtkey.pem";
        kw.writePvtKeyPEM(key_path, kp.getPrivate());
        log.info("Certificate written to file: " + path + ", private key is in file: " + key_path + "\n\n\t"
                + "Please keep your private key safe and in secret!");
    }

    public  Properties readProperties(String path) throws FileNotFoundException, IOException {
        Properties prop = new Properties();
        InputStream input;
        input = new FileInputStream(path);
        prop.load(input);
        return prop;
    }

    public Properties addDefined(Properties p, CmdCertReq certreq) {
        certreq.params.keySet().forEach((key) -> {
            p.put(key, certreq.params.get(key));
        });
        return p;
    }

    public String readStdIn(String prompt) {
        String res = "";
        BufferedReader br = null;

        try {
            System.out.println(prompt);
            br = new BufferedReader(new InputStreamReader(System.in));
            res = br.readLine();
        } catch (IOException ex) {
            log.error("Can not read stdin", ex);
        }
        return res;
    }

    public boolean checkRequiredProperties(CertificateRequestData cd, boolean interactive) {
        boolean res = false;
        List<String> undefined = cd.checkNotSetParameters();
        if (interactive) {
            for (String param : undefined) {
                cd.addProperty(param, readStdIn("Please enter value of: " + param));
            }
            res = true;
        } else {
            res = undefined.isEmpty();
        }
        return res;
    }

    public void displayX509(String infile) {
        try {
            InputStream is = new FileInputStream(infile);
            KeyReader kr = new KeyReaderImpl();
            X509Certificate cert = kr.readX509CertPEMorDER(is);

            System.out.println("==================================================");
            System.out.println("=            CERTIFICATE TO_STRING               =");
            System.out.println("==================================================");
            System.out.println();
            System.out.println(cert);
            System.out.println();
            // log.error("X509 functionality  is not implemented yet");
        } catch (FileNotFoundException ex) {
            log.error("Can not read file: {}", infile, ex);
        }
    }
    
}
