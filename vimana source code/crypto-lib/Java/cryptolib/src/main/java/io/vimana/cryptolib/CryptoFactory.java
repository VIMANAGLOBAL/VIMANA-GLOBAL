
package io.vimana.cryptolib;

import io.vimana.cryptolib.impl.AsymJCEImpl;
import io.vimana.cryptolib.impl.JCEDigestImpl;
import io.vimana.cryptolib.impl.KeyReaderImpl;
import io.vimana.cryptolib.impl.KeyWriterImpl;
import io.vimana.cryptolib.impl.SymJCEImpl;

/**
 * Factory that creates configured implementations
 * of vimrypto interfaces
 * @author alukin@gmail.com
 */
public class vimryptoFactory {
    
    public static final String vimrypto_IMPL_JCE="JCE";
    
    private  vimryptoParams params = vimryptoParams.createDefault();
    
    private String impl = vimrypto_IMPL_JCE;

    public vimryptoFactory(vimryptoParams p) {
        params=p;
    }

    /**
     * Creates instance of factory with parameters
     * @param p set of crypto parameters, @see vimrypto
     * @param impl family of implementations, default is JCE 
     * @return  ready to use factory
     */
    public static vimryptoFactory create(vimryptoParams p, String impl){
        vimryptoFactory inst = new vimryptoFactory(p);
        return inst;
    }
     /**
     * Creates instance of factory with parameters
     * @param p set of crypto parameters, @see vimrypto
     * @return  ready to use factory
     */   
    public static vimryptoFactory create(vimryptoParams p){
        return new vimryptoFactory(p);
    }   
    /**
     * Creates default factory that uses vimryptoParams.createDefault()
     * to set crypto parameters
     * @return 
     */
    public static vimryptoFactory createDefault(){
        return new vimryptoFactory(vimryptoParams.createDefault());
    }
    
    public  vimryptoSym getSymCrypto(){
        return new  SymJCEImpl(params);
    }
    
    public vimryptoAsym getAsymCrypto(){
        return new  AsymJCEImpl(params);
    }
    
    public vimryptoDigest getDigesters(){
        return new JCEDigestImpl(params);
    }  
    
    public KeyReader getKeyReader(){
        return new KeyReaderImpl();
    }
    public KeyWriter getKeyWriter(){
        return new KeyWriterImpl();
    }
    
}
