package io.vimana.cryptolib.impl;

import java.security.SecureRandom;

/**
 *
 * @author al
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
