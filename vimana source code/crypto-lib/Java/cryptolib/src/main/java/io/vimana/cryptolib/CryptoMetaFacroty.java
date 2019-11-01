package io.vimana.cryptolib;

import java.security.PublicKey;
import java.security.cert.X509Certificate;
import java.security.interfaces.RSAPublicKey;

/**
 * Purpose of this meta-factory is to create crypto factory
 * with set of parameters consistent for certain crypto system.
 * All we need to guess parameters is X.509 certificate or public key
 * @author alukin@gmail.com
 */
public class CryptoMetaFacroty {
   public static vimryptoFactory createFacrory(PublicKey pubKey){
       vimryptoParams params;
       String algo = pubKey.getAlgorithm();
       if("RSA".equalsIgnoreCase(algo)){
           RSAPublicKey rpk = (RSAPublicKey)pubKey;
           int bitLength = rpk.getModulus().bitLength();
           params = vimryptoParams.createRSAn(bitLength);
       }else if("EC".equalsIgnoreCase(algo)){
           params=vimryptoParams.createDefault();
       }else{
           params=vimryptoParams.createDefault();           
       }
       return vimryptoFactory.create(params);
   } 
   
   public static vimryptoFactory createFacrory(X509Certificate cert){
       PublicKey pk = cert.getPublicKey();
       return createFacrory(pk);
   }    
}
