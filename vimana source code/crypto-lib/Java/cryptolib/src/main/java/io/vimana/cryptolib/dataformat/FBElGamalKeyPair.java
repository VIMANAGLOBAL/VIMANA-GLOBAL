package io.vimana.cryptolib.dataformat;

import java.math.BigInteger;
import org.bouncycastle.math.ec.ECPoint;

/**
 *
 * @author nemez
 */
public class FBElGamalKeyPair {
    
    private ECPoint publicKey;
    private BigInteger privateKey; 
     
    public ECPoint getPublicKey() {
        return publicKey; 
    }
     
    public void setPublicKey(ECPoint pubk) {
        this.publicKey = pubk; 
    }
     
    public BigInteger getPrivateKey() {
        return privateKey; 
    }

    public void setPrivateKey( BigInteger prik ) {
        privateKey = prik; 
    }
    
    public BigInteger getPrivateKeyX() {
        return publicKey.getAffineXCoord().toBigInteger();
    }

    public BigInteger getPrivateKeyY() {
        return publicKey.getAffineYCoord().toBigInteger();
    }
    
}
