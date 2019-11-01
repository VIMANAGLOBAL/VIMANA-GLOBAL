package io.vimana.p2p.impl;

import io.vimana.cryptolib.CryptoNotValidException;
import io.vimana.cryptolib.csr.CertificateRequestData;
import io.vimana.p2p.iface.PeerId;
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
public class PeerIdImpl implements PeerId{
    private final byte[] id;
    private boolean verified=false;
    private boolean signed=false;
    private KeyPair keys;

    public PeerIdImpl(byte[] id) {
        this.id = id;
    }
        
    @Override
    public byte[] get(){
        return id;
    }
    
    @Override
    public String asHexString(){
        return "";
    }
    
    @Override
    public String asBase64tring(){
        return "";
    }
    
    public static PeerId fromCert(X509Certificate cert){
        PeerIdImpl pid=null;
//        vimertificate cert = new vimertificate(cert);
//        boolean signedByCA = cert.isSignedByOurCA();
        boolean signedByCA = false;
        if(signedByCA){
//            byte[] id = cert.getVIMId().toByteArray();
//            pid = new PeerIdImpl(id);
            pid.signed=true;
            pid.verified=true;
        }else{
           byte[] hash = cert.getPublicKey().getEncoded();
           pid = new PeerIdImpl(hash);
        }
        return pid;
    }

    @Override
    public boolean isVerified() {
        return verified;
    }

    @Override
    public boolean isSigned() {
        return signed;
    }

    @Override
    public boolean generateNewSelfSignedCertificate(String pathToKeyStore, String ksAlias, String ksPassword, String pvtKeyPassword) {
        boolean res = false;
        PeerIdHelper helper = new PeerIdHelper(pathToKeyStore, ksAlias, ksPassword, pvtKeyPassword);
        CertificateRequestData cd = new CertificateRequestData(CertificateRequestData.CSRType.HOST);
        try {
            helper.createSelfSignedPair(cd, pathToKeyStore);
            res=true;
        } catch (IOException ex) {
           log.warn("Can not write keystore to file: {}",pathToKeyStore, ex);
        } catch (CryptoNotValidException ex) {
            log.warn("Invalid crypto parameters",ex);
        } catch (CertificateEncodingException ex) {
            log.warn("Certificate encoding error",ex);
        }

        return res;
    }

    @Override
    public byte[] decryptChallenge(byte[] callenge) {
        return null;
    }

    @Override
    public boolean loadKeys(String pathToKeyStore, String ksAlias, String ksPassword, String pvtKeyPassword) {
       PeerIdHelper helper = new PeerIdHelper(pathToKeyStore, ksAlias, ksPassword, pvtKeyPassword);
       keys = helper.loadKeys();
       return keys!=null;
    }
    
    
}
