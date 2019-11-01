package io.vimana.cryptolib.csr;

import java.security.KeyPair;
import java.security.PrivateKey;
import java.security.PublicKey;

/**
 * Utility class to wrap keys ins standard structures
 *
 * @author alukin@gmail.com
 */
public class KeyWrapper {

    /**
     * Wrap bytes of keys into PublicKey and PrivateKey
     *
     * @param pub public key bytes
     * @param pvt private key bytes
     * @param type type of key,
     * https://docs.oracle.com/en/java/javase/11/docs/specs/security/standard-names.html
     * @param subType sub-type of key, e.g. elliptic curve name
     * @return Key pair
     */
    public KeyPair wrap(byte[] pub, byte[] pvt, String type, String subType) {
        KeyPair kp = null;
        PublicKey pubKey = wrapPublic(pub, type, subType);
        PrivateKey privKey = wrapPrivate(pvt, type, subType);
        if(privKey!=null && pubKey!=null){
            kp = new KeyPair(pubKey, privKey);
        }
        return kp;
    }
    
    public PrivateKey wrapPrivate(byte[] pvt, String type, String subType) {
        PrivateKey privateKey = null;
        //EllipticCurve curve = new EllipticCurve
        //PKCS8EncodedKeySpec
        return privateKey;
    }
    
    public PublicKey wrapPublic(byte[] pub, String type, String subType) {
        PublicKey publicKey = null;

        return publicKey;
    }

}
