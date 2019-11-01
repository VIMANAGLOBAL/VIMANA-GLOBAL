package io.vimana.cryptolib;

import io.vimana.cryptolib.impl.KeyReaderImpl;

import java.io.FileInputStream;
import java.io.IOException;
import java.security.KeyPair;
import java.security.PrivateKey;
import java.security.SecureRandom;
import java.security.cert.CertificateException;
import java.security.cert.X509Certificate;
import java.util.Arrays;

import io.vimana.cryptolib.dataformat.AEAD;
import io.vimana.cryptolib.dataformat.AEADMessage;
import io.vimana.cryptolib.impl.AsymJCEImpl;
import io.vimana.cryptolib.impl.JCEDigestImpl;
import io.vimana.cryptolib.impl.SymJCEImpl;
import org.bouncycastle.util.encoders.Hex;
import org.junit.jupiter.api.AfterAll;
import org.junit.jupiter.api.AfterEach;
import static org.junit.jupiter.api.Assertions.assertArrayEquals;
import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.junit.jupiter.api.Assertions.fail;
import org.junit.jupiter.api.BeforeAll;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;


/**
 *
 * @author al
 */
public class NoFilesvimryptoTest {
    
    private static KeyPair kpAlice;
    private static KeyPair kpBob;
    private static final SecureRandom srand = new SecureRandom();
    private static final vimryptoParams params = vimryptoParams.createDefault();
    
    public NoFilesvimryptoTest() {
    }
    
    @BeforeAll
    public static void setUpClass() {
        try {
            KeyReaderImpl kr = new KeyReaderImpl();
            X509Certificate test1_cert = kr.readX509CertPEMorDER( new FileInputStream("../../testdata/cert2018/test1_cert.pem"));
            PrivateKey test1_priv = kr.readPrivateKeyPEM(new FileInputStream("../../testdata/cert2018/test1_pvtkey.pem"));
            kpAlice = new KeyPair(kr.extractPublicKeyFromX509(test1_cert), test1_priv);
 
            X509Certificate test2_cert = kr.readX509CertPEMorDER( new FileInputStream("../../testdata/cert2018/test2_cert.pem"));
            PrivateKey test2_priv = kr.readPrivateKeyPEM(new FileInputStream("../../testdata/cert2018/test2_pvtkey.pem"));
            kpBob = new KeyPair(kr.extractPublicKeyFromX509(test2_cert), test2_priv);
            
        } catch (IOException | CertificateException | CryptoNotValidException ex) {
            fail("Can not read public or private key files");
        }
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
     * Test of setSymmetricKey method, of class vimrypto.
     */
    @Test
    public void testSetSymmetricKey() throws Exception {
        System.out.println("setSymmetricKey");
        byte[] key = new byte[256/8];
        srand.nextBytes(key);
        vimryptoSym instance = new SymJCEImpl(params);
        try{
          instance.setSymmetricKey(key);
        }catch(Exception e){
            fail("Can not set symmetric key!");
        }
    }

    /**
     * Test of setSymmetricIV method, of class vimrypto.
     */
    @Test
    public void testSetSymmetricIV() {
        System.out.println("setSymmetricIV");
        byte[] IV = new byte[12];
        srand.nextBytes(IV);
        vimryptoSym instance = new SymJCEImpl(params);
        try{
          instance.setSymmetricIV(IV);
        }catch(Exception e){
            fail("Can not set symmertic IV");
        }

      //  fail("The test case is a prototype.");
    }

    /**
     * Test of setSymmetricSalt method, of class vimrypto.
     */
    @Test
    public void testSetSymmetricSaltAndNounce() {
        System.out.println("setSymmetricSalt");
        byte[] key = new byte[12];
        byte[] salt; 
        byte[] nounce; 
        srand.nextBytes(key);
        salt = Arrays.copyOfRange(key, 0,4);
        nounce = Arrays.copyOfRange(key, 4, 12);
        vimryptoSym instance = new SymJCEImpl(params);
        try{
          instance.setSymmetricSalt(salt);
          instance.setSymmetricNonce(nounce);
        }catch(Exception e){
            fail("Can not set salt");
        }
        try{
            instance.setSymmetricNonce(nounce);
            fail("N ounce reuse not detected");
        }catch(Exception e){      
        }
       byte[] k = instance.getSymmetricIV();
       assertArrayEquals(key, k);
    }


    /**
     * Test of encryptSymmetric method, of class vimrypto.
     */
    @Test
    public void testEncryptSymmetric() throws Exception {
        System.out.println("encryptSymmetric");
        String plain_text = "Red fox jumps over lazy dog";
        byte[] key = new byte[256/8];
        byte[] salt = new byte[4]; //iv=salt+nounce 12 bytes
        byte[] explicitNounce = new byte[8];
        srand.nextBytes(key);
        srand.nextBytes(salt);
        srand.nextBytes(explicitNounce);
        vimryptoSym instance1 = new SymJCEImpl(params);
        instance1.setSymmetricSalt(salt);
        instance1.setSymmetricNonce(explicitNounce);
        instance1.setSymmetricKey(key);        
        byte[] encrypted = instance1.encryptSymmetric(plain_text.getBytes());
        
        //in real life we must set salt and key; nounce is prefix of encrypted message
        vimryptoSym instance2 = new SymJCEImpl(params);
        instance2.setSymmetricKey(key);
        instance2.setSymmetricSalt(salt);
        //ready to decrypt
        byte[] plain = instance2.decryptSymmetric(encrypted);
        String text = new String(plain);
        assertEquals(plain_text, text);
    }

    /**
     * Test of encryptSymmetricWithAEAData method, of class vimrypto.
     */
    @Test
    public void testEncryptSymmetricWithAEAData() throws Exception {

        System.out.println("encryptSymmetricWithAEAData");
        String plain_text = "Red fox jumps over lazy dog";

        byte[] key = new byte[256/8];
        byte[] salt = new byte[4];
        byte[] nonce = new byte[8];
        srand.nextBytes(key);
        srand.nextBytes(salt);
        srand.nextBytes(nonce);

        vimryptoSym instance1 = new SymJCEImpl(params);
        instance1.setSymmetricKey(key);
        instance1.setSymmetricSalt(salt);
        instance1.setSymmetricNonce(nonce);
        String adata = "<<<TEXT TO STAY OPEN>>>";
        AEADMessage msg = instance1.encryptSymmetricWithAEAData(plain_text.getBytes(), adata.getBytes());

        /* use instance2 with IV set from msg.getIV() */
        vimryptoSym instance2 = new SymJCEImpl(params);
        instance2.setSymmetricKey(key);
        instance2.setSymmetricSalt(salt);

        AEAD plain = instance2.decryptSymmetricWithAEAData(msg.toBytes());
        String text = new String(plain.decrypted);       
        assertEquals(plain_text, text);        

    }

    /**
     * Test of encryptAsymmetric method, of class vimrypto.
     */
    @Test
    public void testEncryptAsymmetricIES() throws Exception  {
        System.out.println("encryptAsymmetricIES");
        String plain ="Red fox Jumps over Lazy Dog";
        
        vimryptoAsym instance1 = new AsymJCEImpl(params);
        instance1.setAsymmetricKeys(kpAlice.getPublic(), kpAlice.getPrivate(), kpBob.getPublic());
        byte[] encrypted = instance1.encryptAsymmetricIES(plain.getBytes());

        vimryptoAsym instance2 = new AsymJCEImpl(params);
        instance2.setAsymmetricKeys(kpBob.getPublic(), kpBob.getPrivate(), kpAlice.getPublic());        
        byte[] decrypted = instance2.decryptAsymmetricIES(encrypted);
        
        String text = new String(decrypted);
        assertEquals(plain, text);
    }
    
/**
 * Test shared key generation
 * @throws Exception 
 */
    @Test
    public void testCalculateSharedKey() throws Exception{
        
        System.out.println("calculateSharedKey");
        vimryptoAsym instance1 = new AsymJCEImpl(params);
        instance1.setAsymmetricKeys(kpAlice.getPublic(), kpAlice.getPrivate(), kpBob.getPublic());

        vimryptoAsym instance2 = new AsymJCEImpl(params);
        instance2.setAsymmetricKeys(kpBob.getPublic(), kpBob.getPrivate(), kpAlice.getPublic());        
        
        byte[] sharedKey1 = instance1.calculateSharedKey();
        byte[] sharedKey2 = instance2.calculateSharedKey();
        System.out.println(Hex.toHexString(sharedKey1));
        System.out.println(Hex.toHexString(sharedKey2));
        assertArrayEquals(sharedKey1, sharedKey2);
    }
    /**
     * Test of encryptAsymmetric method, of class vimrypto.
     */
    @Test
    public void testEncryptAsymmetric() throws Exception  {
        System.out.println("encryptAsymmetric");    
        String plain ="Red fox Jumps over Lazy Dog";
        
        vimryptoAsym instance1 = new AsymJCEImpl(params);
        instance1.setAsymmetricKeys(kpAlice.getPublic(), kpAlice.getPrivate(), kpBob.getPublic());
        byte[] encrypted = instance1.encryptAsymmetric(plain.getBytes());
        
        vimryptoAsym instance2 = new AsymJCEImpl(params);
        instance2.setAsymmetricKeys(kpBob.getPublic(), kpBob.getPrivate(), kpAlice.getPublic());
        byte[] decrypted = instance2.decryptAsymmetric(encrypted);
        
        String text = new String(decrypted);
        assertEquals(plain, text);
    }
    
    /**
     * Test of encryptAsymmetricWithAEAData method, of class vimrypto.
     */
    @Test
    public void testEncryptAsymmetricWithAEAData() throws Exception {
        System.out.println("encryptAsymmetricWithAEAData");
        String plain ="Red fox Jumps over Lazy Dog";
        String open ="<<<OPEN TEXT>>>";
        
        vimryptoAsym instance1 = new AsymJCEImpl(params);
        instance1.setAsymmetricKeys(kpAlice.getPublic(), kpAlice.getPrivate(), kpBob.getPublic());
        AEADMessage encrypted = instance1.encryptAsymmetricWithAEAData(plain.getBytes(),open.getBytes());
        
        vimryptoAsym instance2 = new AsymJCEImpl(params);
        instance2.setAsymmetricKeys(kpBob.getPublic(), kpBob.getPrivate(), kpAlice.getPublic());
        
        AEAD decrypted = instance2.decryptAsymmetricWithAEAData(encrypted.toBytes());
        
        String text = new String(decrypted.decrypted);
        String open_r = new String(decrypted.plain);
        String open_e = new String(encrypted.aatext);
        assertEquals(plain, text);
        assertEquals(open, open_r);
        assertEquals(open, open_e);
    }


    /**
     * Test of digest method, of class vimrypto.
     */
    @Test
    public void testDigest() throws Exception {
        System.out.println("digest");
        String msg="Test message";
        vimryptoDigest instance = new JCEDigestImpl(params);
        byte[] expResult = Hex.decode("48418241a4d779508a6b98e623328a68f7f0bf27fd101bb2c89384827bfc07403fefd5855576f1824fcd7acd233541514240c2bcf0fa9732ebb8f166a7c38bdf");
        byte[] result = instance.digest(msg.getBytes());
        System.out.println(Hex.toHexString(result));
        assertArrayEquals(expResult, result);
    }

    /**
     * Test of sign method, of class vimrypto.
     */
    @Test
    public void testSign() throws Exception {
        System.out.println("sign");

        vimryptoAsym instance1 = new AsymJCEImpl(params);
        instance1.setAsymmetricKeys(kpAlice.getPublic(), kpAlice.getPrivate(), kpBob.getPublic());

        vimryptoAsym instance2 = new AsymJCEImpl(params);
        instance2.setAsymmetricKeys(kpBob.getPublic(), kpBob.getPrivate(), kpAlice.getPublic());
        
        String plain ="Red fox Jumps over Lazy Dog";
        byte[] signature = instance1.sign(plain.getBytes());
        boolean res = instance2.verifySignature(plain.getBytes(), signature);
        assertTrue(res);
    }
    
    /**
     * Test emphimeral key ECDH key agreement 
     */
    @Test
    public void testECDHE() throws Exception{
        System.out.println("ECDHE keys");
        vimryptoAsym instance1 = new AsymJCEImpl(params);
        instance1.setAsymmetricKeys(kpAlice.getPublic(), kpAlice.getPrivate(), kpBob.getPublic());

        vimryptoAsym instance2 = new AsymJCEImpl(params);
        instance2.setAsymmetricKeys(kpBob.getPublic(), kpBob.getPrivate(), kpAlice.getPublic());
        
        byte[] aliceSignedKJey = instance1.ecdheStep1();
        byte[] bobSignedKJey = instance2.ecdheStep1();
        
        byte[] sharedKeyAlice = instance1.ecdheStep2(bobSignedKJey);
        byte[] sharedKeyBob = instance2.ecdheStep2(aliceSignedKJey);
        assertArrayEquals(sharedKeyAlice, sharedKeyBob);
    }

    
}
