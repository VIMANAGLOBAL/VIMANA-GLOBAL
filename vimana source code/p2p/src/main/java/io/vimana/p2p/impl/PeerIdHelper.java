package io.vimana.p2p.impl;

import io.vimana.cryptolib.CryptoNotValidException;
import io.vimana.cryptolib.vimryptoParams;
import io.vimana.cryptolib.KeyWriter;
import io.vimana.cryptolib.container.PKCS12KeyStore;
import io.vimana.cryptolib.csr.CertificateRequestData;
import io.vimana.cryptolib.csr.KeyGenerator;
import io.vimana.cryptolib.impl.KeyWriterImpl;
import java.io.IOException;
import java.security.KeyPair;
import java.security.cert.CertificateEncodingException;
import java.security.cert.X509Certificate;
import lombok.extern.slf4j.Slf4j;

/**
 *
 * @author alukin@gmail.com
 */
@Slf4j
public class PeerIdHelper {

    private final String pathToKeyStore;
    private final String ksAlias;
    private final String ksPassword;
    private final String pvtKeyPassword;
    private PKCS12KeyStore ks;

    public PeerIdHelper(String pathToKeyStore, String ksAlias, String ksPassword, String pvtKeyPassword) {
        this.pathToKeyStore = pathToKeyStore;
        this.ksAlias = ksAlias;
        this.ksPassword = ksPassword;
        this.pvtKeyPassword = pvtKeyPassword;
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

        ks.addPrivateKey(kp.getPrivate(), ksAlias, pvtKeyPassword, cert, cert);
        ks.save(pathToKeyStore, ksPassword);

        kw.writeX509CertificatePEM(path, cert);
        int idx = path.indexOf('.');
        if (idx < 0) {
            idx = path.length();
        }
        String key_path = path.substring(0, idx) + "_pvtkey.pem";
        kw.writePvtKeyPEM(key_path, kp.getPrivate());
        log.info("Certificate written to file: " + path + ", private key is in file: " + key_path + "\n\n\t"
                + "Please keep your private key safe and in secret!");
    }
    
    public KeyPair loadKeys(){
        KeyPair kp = null;
        return kp;
    }
}
