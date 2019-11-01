package io.vimana.vim.util.crypto;

import io.vimana.cryptolib.vimryptoAsym;
import io.vimana.cryptolib.vimryptoParams;
import io.vimana.cryptolib.CryptoNotValidException;
import io.vimana.cryptolib.impl.AsymJCEImpl;
import java.security.InvalidKeyException;
import java.security.PrivateKey;
import java.security.PublicKey;

/**
 * Base class for certificate and CSR
 * @author alukin@gmail.com
 */
public class CertBase {
   protected PublicKey pubKey = null;
   protected PrivateKey pvtKey = null;
    
     public boolean checkKeys(PrivateKey pvtk) {
        boolean res = false;
        try {
            String test = "Lazy Fox jumps ofver snoopy dog";
            vimryptoAsym ac = new AsymJCEImpl(vimryptoParams.createDefault());
            ac.setAsymmetricKeys(pubKey, pvtk, pubKey);
            byte[] enc = ac.encryptAsymmetric(test.getBytes());
            byte[] dec = ac.decryptAsymmetric(enc);
            String test_res = new String(dec);           
            res = test.compareTo(test_res)==0;
        } catch (InvalidKeyException | CryptoNotValidException ex) {
        }
        return res;
    }
     
    public void setPrivateKey(PrivateKey pvtKey) {
        this.pvtKey = pvtKey;
    }


    public PublicKey getPublicKey() {
        return pubKey;
    }

    public PrivateKey getPrivateKey() {
        return pvtKey;
    }     
}
