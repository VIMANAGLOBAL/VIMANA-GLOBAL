package io.vimana.cryptolib;

/**
 * Check secure random generation speed. It should be fast enough
 * to generate keys quickly. On Linux systems haveged package
 * should be installed to update /dev/random with enough entropy
 * @author alukin@gmail.com
 */
public interface SecureRandomChecker {
    public static Long SECURE_RANDOM_ACCEPTABLE_TIME_MS=50L;
    boolean check();
    
}
