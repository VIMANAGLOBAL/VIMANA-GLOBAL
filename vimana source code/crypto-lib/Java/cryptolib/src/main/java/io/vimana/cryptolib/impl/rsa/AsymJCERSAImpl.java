package io.vimana.cryptolib.impl.rsa;

import io.vimana.cryptolib.vimryptoAsym;
import io.vimana.cryptolib.vimryptoParams;
import io.vimana.cryptolib.dataformat.AEAD;
import io.vimana.cryptolib.dataformat.AEADMessage;
import io.vimana.cryptolib.CryptoNotValidException;
import io.vimana.cryptolib.impl.AsymCommonImpl;
import java.security.PublicKey;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

/**
 * RSA based implementaion of vimrypto interface
 * @author alukin@gmail.com
 */
public class AsymJCERSAImpl  extends AsymCommonImpl implements vimryptoAsym{
    private Logger log = LoggerFactory.getLogger(AsymJCERSAImpl.class);


    public AsymJCERSAImpl(vimryptoParams params) {
        super(params);
    }


    @Override
    public void setTheirPublicKey(PublicKey theirPublicKey) {
        throw new UnsupportedOperationException("Not supported yet."); //To change body of generated methods, choose Tools | Templates.
    }

    @Override
    public byte[] calculateSharedKey() {
        throw new UnsupportedOperationException("Not supported yet."); //To change body of generated methods, choose Tools | Templates.
    }

    @Override
    public byte[] encryptAsymmetricIES(byte[] plain) throws CryptoNotValidException {
        throw new UnsupportedOperationException("Not supported yet."); //To change body of generated methods, choose Tools | Templates.
    }

    @Override
    public byte[] decryptAsymmetricIES(byte[] ciphered) throws CryptoNotValidException {
        throw new UnsupportedOperationException("Not supported yet."); //To change body of generated methods, choose Tools | Templates.
    }

    @Override
    public byte[] encryptAsymmetric(byte[] plain) throws CryptoNotValidException {
        throw new UnsupportedOperationException("Not supported yet."); //To change body of generated methods, choose Tools | Templates.
    }

    @Override
    public byte[] decryptAsymmetric(byte[] ciphered) throws CryptoNotValidException {
        throw new UnsupportedOperationException("Not supported yet."); //To change body of generated methods, choose Tools | Templates.
    }

    @Override
    public AEADMessage encryptAsymmetricWithAEAData(byte[] plain, byte[] aeadata) throws CryptoNotValidException {
        throw new UnsupportedOperationException("Not supported yet."); //To change body of generated methods, choose Tools | Templates.
    }

    @Override
    public AEAD decryptAsymmetricWithAEAData(byte[] message) throws CryptoNotValidException {
        throw new UnsupportedOperationException("Not supported yet."); //To change body of generated methods, choose Tools | Templates.
    }

    @Override
    public byte[] sign(byte[] message) throws CryptoNotValidException {
        throw new UnsupportedOperationException("Not supported yet."); //To change body of generated methods, choose Tools | Templates.
    }

    @Override
    public boolean verifySignature(byte[] message, byte[] signature) {
        throw new UnsupportedOperationException("Not supported yet."); //To change body of generated methods, choose Tools | Templates.
    }

    @Override
    public byte[] ecdheStep1() throws CryptoNotValidException {
        throw new UnsupportedOperationException("Not supported yet."); //To change body of generated methods, choose Tools | Templates.
    }

    @Override
    public byte[] ecdheStep2(byte[] signedEphemeralPubKey) throws CryptoNotValidException {
        throw new UnsupportedOperationException("Not supported yet."); //To change body of generated methods, choose Tools | Templates.
    }
    
}
