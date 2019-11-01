package io.vimana.cryptolib;

import io.vimana.cryptolib.impl.SecureRandomCheckerImpl;
import static org.junit.jupiter.api.Assertions.assertTrue;
import org.junit.jupiter.api.Test;


/**
 *
 * @author al
 */
public class SecureRandomTest {
    
    public SecureRandomTest() {
    }
    
    @Test
    public void secureRandomSpeed() {
        System.out.println("SecureRandom speed");
        SecureRandomCheckerImpl srck = new SecureRandomCheckerImpl();
        boolean res = srck.check();
        if(!res){
          System.out.println("SecureRandom speed is not enough. Please install \"haveged\" package");  
        }else{
            System.out.println("SecureRandom speed is OK."+SecureRandomCheckerImpl.GET_ITERATIONS+ " iteration took " +srck.getDuration+" ms");
        }
        assertTrue(res);
    }
}
