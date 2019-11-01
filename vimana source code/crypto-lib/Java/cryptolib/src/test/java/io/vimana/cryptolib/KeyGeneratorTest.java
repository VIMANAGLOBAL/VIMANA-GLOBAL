package io.vimana.cryptolib;

import io.vimana.cryptolib.csr.KeyGenerator;
import java.security.KeyPair;
import java.security.Security;
import org.bouncycastle.jce.provider.BouncyCastleProvider;
import org.bouncycastle.util.encoders.Hex;
import org.junit.jupiter.api.AfterAll;
import org.junit.jupiter.api.AfterEach;
import static org.junit.jupiter.api.Assertions.assertArrayEquals;
import org.junit.jupiter.api.BeforeAll;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

/**
 *
 * @author al
 */
public class KeyGeneratorTest {
    private static byte[] salt = {1,2,3,4,5,6,7,8,9,0};
    private static vimryptoParams params = vimryptoParams.createDefault();
        
    public KeyGeneratorTest() {
    }
    
    @BeforeAll
    public static void setUpClass() {
        //this will work with JDK 1.8 updat 162 and later.
        //Otherwiswe you should download unlimited policy from oracle
        Security.setProperty("crypto.policy", "unlimited");
        Security.addProvider(new BouncyCastleProvider());

    }
    
    @AfterAll
    public static void tearDownClass() {
    }
    
    @BeforeEach
    public void setUp() {
    }
    
    @AfterEach
    public void tearDown() {
    }

    /**
     * Test of generateKeys method, of class KeyGenerator.
     */
    @Test
    public void testGenerateKeys_0args() {
        System.out.println("generateKeys");
    }

    /**
     * Test of generateKeys method, of class KeyGenerator.
     */
    @Test
    public void testGenerateKeys_String() throws Exception {
        System.out.println("generateKeys");
        String secretPhrase = "1234567890";
        KeyGenerator keyGenerator = new KeyGenerator(params);
        KeyPair result1 = keyGenerator.generateKeys(secretPhrase,salt);
        KeyPair result2 = keyGenerator.generateKeys(secretPhrase,salt);
        System.out.println(Hex.toHexString(result1.getPublic().getEncoded()));
        System.out.println(Hex.toHexString(result2.getPublic().getEncoded()));
        assertArrayEquals(result1.getPublic().getEncoded(), result2.getPublic().getEncoded());
        assertArrayEquals(result1.getPrivate().getEncoded(), result2.getPrivate().getEncoded());
    }

    /**
     * Test of deriveFromPasssPhrase method, of class KeyGenerator.
     */
    @Test
    public void testDeriveFromPasssPhrase() throws Exception {
        System.out.println("deriveFromPasssPhrase");
        KeyGenerator keyGenerator = new KeyGenerator(params);
        String secretPhrase = "1234567890 and or 0987654321";
        byte[] result1 = keyGenerator.deriveFromPasssPhrase(secretPhrase, salt, 2000);
        byte[] result2 = keyGenerator.deriveFromPasssPhrase(secretPhrase, salt, 2000);
        assertArrayEquals(result1, result2);
    }

    /**
     * Test of createX509CertificateRequest method, of class KeyGenerator.
     */
    @Test
    public void testCreateX509CertificateRequest() throws Exception {
        //TODO: implement
        System.out.println("createX509CertificateRequest");
    }

    /**
     * Test of createSerlfSignedX509v3 method, of class KeyGenerator.
     */
    @Test
    public void testCreateSerlfSignedX509v3() throws Exception {
        //TODO: implement
        System.out.println("createSerlfSignedX509v3");
    }

}
