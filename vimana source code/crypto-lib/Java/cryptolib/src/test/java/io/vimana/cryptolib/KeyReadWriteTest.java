package io.vimana.cryptolib;

import io.vimana.cryptolib.csr.KeyGenerator;
import io.vimana.cryptolib.impl.KeyWriterImpl;
import io.vimana.cryptolib.impl.KeyReaderImpl;
import java.security.KeyPair;
import java.security.PrivateKey;
import java.security.PublicKey;
import java.security.Security;
import org.bouncycastle.jce.provider.BouncyCastleProvider;
import org.junit.jupiter.api.AfterAll;
import org.junit.jupiter.api.AfterEach;
import static org.junit.jupiter.api.Assertions.assertArrayEquals;
import org.junit.jupiter.api.BeforeAll;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;


/**
 *
 * @author alukin@gmail.com
 */
public class KeyReadWriteTest {
    private static KeyPair kp;
    private static vimryptoParams params = vimryptoParams.createDefault();

    public KeyReadWriteTest() {
    }
    
    @BeforeAll
    public static void setUpClass() {
        Security.setProperty("crypto.policy", "unlimited");
        Security.addProvider(new BouncyCastleProvider());

        KeyGenerator kg = new KeyGenerator(params);
        kp=kg.generateKeys();
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

     @Test
     public void testPublicKeySerialization() throws CryptoNotValidException {
         KeyWriter kw = new KeyWriterImpl();
         KeyReader kr = new KeyReaderImpl();
         byte[] s = kw.serializePublicKey(kp.getPublic());
         PublicKey pubk = kr.deserializePublicKey(s);
         assertArrayEquals(kp.getPublic().getEncoded(), pubk.getEncoded());
     }
     
     @Test
     public void testPrivateKeySerialization() throws CryptoNotValidException {
         KeyWriter kw = new KeyWriterImpl();
         KeyReader kr = new KeyReaderImpl();         
         byte[] s = kw.serializePrivateKey(kp.getPrivate());
         PrivateKey pk = kr.deserializePrivateKey(s);
         assertArrayEquals(kp.getPrivate().getEncoded(), pk.getEncoded());
         
     }
}
