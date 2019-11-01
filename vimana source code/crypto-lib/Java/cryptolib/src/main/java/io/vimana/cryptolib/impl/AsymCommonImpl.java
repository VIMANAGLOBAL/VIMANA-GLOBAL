package io.vimana.cryptolib.impl;

import io.vimana.cryptolib.vimryptoAsym;
import io.vimana.cryptolib.vimryptoParams;
import java.security.InvalidKeyException;
import java.security.KeyPair;
import java.security.NoSuchAlgorithmException;
import java.security.PrivateKey;
import java.security.PublicKey;
import java.security.SecureRandom;
import java.security.Signature;
import java.security.SignatureException;
import javax.crypto.Cipher;
import javax.crypto.NoSuchPaddingException;
import javax.crypto.spec.GCMParameterSpec;
import javax.crypto.spec.SecretKeySpec;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

/**
 *
 * @author al
 */
public abstract class AsymCommonImpl implements vimryptoAsym{
    
    private final static Logger log = LoggerFactory.getLogger(AsymCommonImpl.class);
    private final SecureRandom random = new SecureRandom();
    
    protected Cipher blockCipherAsym;
    protected GCMParameterSpec gcmParameterSpecAsym;
    protected PrivateKey privateKey;
    protected PublicKey ourPublicKey;
    protected PublicKey theirPublicKey;
    protected SecretKeySpec sharedKey;
    protected Cipher iescCipher;
    protected KeyPair ephemeralKeys;
            
    final vimryptoParams params;

    public AsymCommonImpl(vimryptoParams params) {
        this.params = params;
    } 
    
    public vimryptoParams getParams(){
        return params;
    }
    
    @Override
    public void setAsymmetricKeys(PublicKey ourPubkey, PrivateKey privKey, PublicKey theirPubKey) throws InvalidKeyException {
        this.ourPublicKey = ourPubkey;
        this.privateKey = privKey;
        this.theirPublicKey = theirPubKey;
        try {
            blockCipherAsym = Cipher.getInstance(params.getAsymCipher());
            iescCipher = Cipher.getInstance(params.getAsymEciesCipher());
            calculateSharedKey();
        } catch (NoSuchAlgorithmException | NoSuchPaddingException ex) {
            log.error("Can not create cipher for " + params.getAsymCipher());
        }
    }  

    @Override
    public void setOurKeyPair(KeyPair keyPair) {
        this.ourPublicKey = keyPair.getPublic();
        this.privateKey = keyPair.getPrivate();
    }

    @Override
    public void setTheirPublicKey(PublicKey theirPublicKey) {
        this.theirPublicKey = theirPublicKey;
    }

    @Override
    public boolean verifySignature(byte[] message, byte[] signature) {
        try {
            Signature sig = Signature.getInstance(params.getSignatureAlgorythm());
            sig.initVerify(theirPublicKey);
            sig.update(message);
            return sig.verify(signature);
        } catch (NoSuchAlgorithmException | InvalidKeyException | SignatureException ex) {
            log.warn("Signature check exception", ex);
        }
        return false;
    }    
}
