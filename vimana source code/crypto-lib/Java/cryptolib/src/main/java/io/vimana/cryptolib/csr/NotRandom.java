package io.vimana.cryptolib.csr;

import java.security.SecureRandom;

/**
 * This class is used to generate determinisctic ECC keys based on passphrase
 * just by replacing SecureRandom class. 
 * Note, that ist is not desirable to use such approach.
 * @author alukin@gmail.com
 */
public class NotRandom extends SecureRandom{
    private byte[] seed;
    @Override
    public void nextBytes(byte[] bytes) {
        int idx = 0;
        for(int i=0; i<bytes.length; i++){
            bytes[i]=seed[idx];
            idx++;
            if(idx>=seed.length){
                idx=0;
            }
        }
    }

    @Override
    public synchronized void setSeed(byte[] seed) {
       this.seed=seed;
    }
    
}
