package io.vimana.cryptolib.impl;

import io.vimana.cryptolib.SecureRandomChecker;
import java.security.SecureRandom;

/**
 * Check if SecureRandom is fast enoug
 * @author alukin@gmail.com
 */
public class SecureRandomCheckerImpl implements SecureRandomChecker {
    SecureRandom srand = null;
    
    public Long initDuration=0L;
    public Long getDuration = 0L;
    public static int GET_SIZE=512;
    public static int GET_ITERATIONS=32;
    
    public SecureRandomCheckerImpl() {
        Long begin = System.currentTimeMillis();
        srand=new SecureRandom();
        Long end = System.currentTimeMillis();
        initDuration = end-begin;
    }
    
    @Override
    public boolean check(){
       byte[] rnd = new byte[GET_SIZE];
       Long begin = System.currentTimeMillis();
       for(int i=0; i<GET_ITERATIONS;i++){
           srand.nextBytes(rnd);
       }
       Long end = System.currentTimeMillis();
       getDuration = end-begin;
       boolean res = (getDuration<SECURE_RANDOM_ACCEPTABLE_TIME_MS);
       return res;
    }
            
}
