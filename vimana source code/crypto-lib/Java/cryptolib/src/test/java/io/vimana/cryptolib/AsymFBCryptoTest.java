package io.vimana.cryptolib;

import io.vimana.cryptolib.dataformat.AEAD;
import io.vimana.cryptolib.dataformat.AEADMessage;
import io.vimana.cryptolib.dataformat.FBElGamalEncryptedMessage;
import io.vimana.cryptolib.dataformat.FBElGamalKeyPair;
import io.vimana.cryptolib.impl.KeyReaderImpl;
import io.vimana.cryptolib.impl.AsymJCEElGamalImpl;

import java.io.FileInputStream;
import java.io.IOException;
import java.security.KeyPair;
import java.security.PrivateKey;
import java.security.SecureRandom;
import java.security.cert.CertificateException;
import java.security.cert.X509Certificate;
import io.vimana.cryptolib.impl.AsymJCEImpl;
import java.io.FileOutputStream;
import java.math.BigInteger;
import java.nio.ByteBuffer;
import java.nio.channels.FileChannel;
import org.junit.jupiter.api.AfterAll;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeAll;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.fail;
import static org.junit.jupiter.api.Assertions.assertArrayEquals;
import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertTrue;

/**
 *
 * @author al
 */
public class AsymvimryptoTest {

    private static KeyPair kpAlice;
    private static KeyPair kpBob;
    private static final String PLAIN_FILE = "../../testdata/encrypt_asym_test_plain.bin";
    private static final String SHARED_KEY_ECDHE_FILE = "../../testdata/encrypt_asym_test_key_echdhe.bin";
    private static final String SHARED_KEY_ECDH_FILE = "../../testdata/encrypt_asym_test_key_ecdh.bin";
    private static final String SIGNATURE_ALICE_FILE = "../../testdata/encrypt_asym_test_signature_alice.bin";
    private static final String OUT_FILE_ENCRYPT_ASYM_ALICE = "../../testdata/encrypt_asym_test.bin";
    private static final String OUT_FILE_ENCRYPT_ASYM_AEAD_ALICE = "../../testdata/encrypt_asym_aead_test.bin";
    private static final String OPEN_TEXT = ">>>This is test open text. Should be visisble as is<<<";
    private static SecureRandom srand = new SecureRandom();
    private static int RANDOM_BYTES_NUMBER = 4096;
  
    private static vimryptoParams params = vimryptoParams.createDefault();
    
    public AsymvimryptoTest() {
    }

    private static void writeToFile(ByteBuffer data, String fileName) throws IOException {
        FileChannel out = new FileOutputStream(fileName).getChannel();
        data.rewind();
        out.write(data);
        out.close();
    }

    private static ByteBuffer readFromFile(String fileName) throws IOException {
        FileChannel fChan;
        Long fSize;
        ByteBuffer mBuf;
        fChan = new FileInputStream(fileName).getChannel();
        fSize = fChan.size();
        mBuf = ByteBuffer.allocate(fSize.intValue());
        fChan.read(mBuf);
        fChan.close();
        mBuf.rewind();
        return mBuf;
    }

    @BeforeAll
    public static void setUpClass() {
        try {
            System.out.println("Reading certificates and keys for asymmetric crypto tests");
            KeyReaderImpl kr = new KeyReaderImpl();
            X509Certificate test1_cert = kr.readX509CertPEMorDER(new FileInputStream("../../testdata/cert2018/test1_cert.pem"));
            PrivateKey test1_priv = kr.readPrivateKeyPEM(new FileInputStream("../../testdata/cert2018/test1_pvtkey.pem"));
            kpAlice = new KeyPair(kr.extractPublicKeyFromX509(test1_cert), test1_priv);

            X509Certificate test2_cert = kr.readX509CertPEMorDER(new FileInputStream("../../testdata/cert2018/test2_cert.pem"));
            PrivateKey test2_priv = kr.readPrivateKeyPEM(new FileInputStream("../../testdata/cert2018/test2_pvtkey.pem"));
            kpBob = new KeyPair(kr.extractPublicKeyFromX509(test2_cert), test2_priv);

            System.out.println("Preparing random plain file for asymmetric crypto tests");
            //write random file of plain text
            byte[] rt = new byte[RANDOM_BYTES_NUMBER];
            srand.nextBytes(rt);

            writeToFile(ByteBuffer.wrap(rt), PLAIN_FILE);
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

    @Test
    public void testECDHE() throws Exception {
        System.out.println("ECDHE keys writing to file: " + SHARED_KEY_ECDHE_FILE);
        vimryptoAsym instance1 = new AsymJCEImpl(params);
        instance1.setAsymmetricKeys(kpAlice.getPublic(), kpAlice.getPrivate(), kpBob.getPublic());

        vimryptoAsym instance2 = new AsymJCEImpl(params);
        instance2.setAsymmetricKeys(kpBob.getPublic(), kpBob.getPrivate(), kpAlice.getPublic());

        byte[] aliceSignedKey = instance1.ecdheStep1();
        byte[] bobSignedKey = instance2.ecdheStep1();

        byte[] sharedKeyAlice = instance1.ecdheStep2(bobSignedKey);
        byte[] sharedKeyBob = instance2.ecdheStep2(aliceSignedKey);
        assertArrayEquals(sharedKeyAlice, sharedKeyBob);
        writeToFile(ByteBuffer.wrap(sharedKeyBob), SHARED_KEY_ECDHE_FILE);
    }

    @Test
    public void testECDH() throws Exception {
        System.out.println("ECDH keys writing to file: " + SHARED_KEY_ECDH_FILE);
        vimryptoAsym instance1 = new AsymJCEImpl(params);
        instance1.setAsymmetricKeys(kpAlice.getPublic(), kpAlice.getPrivate(), kpBob.getPublic());

        vimryptoAsym instance2 = new AsymJCEImpl(params);
        instance2.setAsymmetricKeys(kpBob.getPublic(), kpBob.getPrivate(), kpAlice.getPublic());

        byte[] sharedKeyAlice = instance1.calculateSharedKey();
        byte[] sharedKeyBob = instance2.calculateSharedKey();
        assertArrayEquals(sharedKeyAlice, sharedKeyBob);
        writeToFile(ByteBuffer.wrap(sharedKeyBob), SHARED_KEY_ECDH_FILE);
    }

    @Test
    public void testSign() throws Exception {
        System.out.println("tesing signing");

        vimryptoAsym instance1 = new AsymJCEImpl(params);
        instance1.setAsymmetricKeys(kpAlice.getPublic(), kpAlice.getPrivate(), kpBob.getPublic());

        vimryptoAsym instance2 = new AsymJCEImpl(params);
        instance2.setAsymmetricKeys(kpBob.getPublic(), kpBob.getPrivate(), kpAlice.getPublic());

        ByteBuffer plain = readFromFile(PLAIN_FILE);
        byte[] signature = instance1.sign(plain.array());
        boolean res = instance2.verifySignature(plain.array(), signature);
        ByteBuffer sb = ByteBuffer.wrap(signature);
        
        writeToFile(sb, SIGNATURE_ALICE_FILE);
        
        assertTrue(res);
    }

    /**
     * Test of encryptAsymmetric method, of class vimrypto.
     */
    @Test
    public void testEncryptAsymmetric() throws Exception {
        System.out.println("encryptAsymmetric");
        ByteBuffer plain = readFromFile(PLAIN_FILE); 

        vimryptoAsym instance1 = new AsymJCEImpl(params);
        instance1.setAsymmetricKeys(kpAlice.getPublic(), kpAlice.getPrivate(), kpBob.getPublic());
        byte[] encrypted = instance1.encryptAsymmetric(plain.array());
        ByteBuffer eb = ByteBuffer.wrap(encrypted);
        
        writeToFile(eb,OUT_FILE_ENCRYPT_ASYM_ALICE );
        
        vimryptoAsym instance2 = new AsymJCEImpl(params);
        instance2.setAsymmetricKeys(kpBob.getPublic(), kpBob.getPrivate(), kpAlice.getPublic());
        byte[] decrypted = instance2.decryptAsymmetric(encrypted);

        
        assertArrayEquals(plain.array(), decrypted);
    }

    /**
     * Test of encryptAsymmetricWithAEAData method, of class vimrypto.
     */
    @Test
    public void testEncryptAsymmetricWithAEAData() throws Exception {
        System.out.println("encryptAsymmetricWithAEAData");
        ByteBuffer plain = readFromFile(PLAIN_FILE); 
        String open = OPEN_TEXT;

        vimryptoAsym instance1 = new AsymJCEImpl(params);
        instance1.setAsymmetricKeys(kpAlice.getPublic(), kpAlice.getPrivate(), kpBob.getPublic());
        AEADMessage encrypted = instance1.encryptAsymmetricWithAEAData(plain.array(), open.getBytes());
        ByteBuffer eb = ByteBuffer.wrap(encrypted.toBytes());
        
        writeToFile(eb, OUT_FILE_ENCRYPT_ASYM_AEAD_ALICE);
        
        vimryptoAsym instance2 = new AsymJCEImpl(params);
        instance2.setAsymmetricKeys(kpBob.getPublic(), kpBob.getPrivate(), kpAlice.getPublic());

        AEAD decrypted = instance2.decryptAsymmetricWithAEAData(encrypted.toBytes());

        String open_r = new String(decrypted.plain);
        String open_e = new String(encrypted.aatext);
        assertArrayEquals(plain.array(), decrypted.decrypted);
        assertEquals(open, open_r);
        assertEquals(open, open_e);
    }
    
    /**
     * Test of testEncryptAsymmetricElGamal method, of class vimrypto.
     */
    @Test
    public void testEncryptAsymmetricElGamal() throws Exception {
        System.out.println("testEncryptAsymmetricElGamal");
        
        AsymJCEElGamalImpl instance1 = new AsymJCEElGamalImpl(params);
 
/*               
        System.out.println("Alice key: " + kpAlice.getPublic().toString());

        instance1.setAsymmetricKeys(kpAlice.getPublic(), kpAlice.getPrivate(), kpBob.getPublic());
        
        instance1.doInternalTesting();
*/
 
        
    }
    
    
    @Test
    public void testEncryptAsymmetricElGamalSeparateKeys() throws Exception {
        System.out.println("testEncryptAsymmetricElGamal");
        
        
        

    AsymJCEElGamalImpl instanceOfAlice = new AsymJCEElGamalImpl(params);
    instanceOfAlice.setCurveParameters();


    
    FBElGamalKeyPair aliceKeys = instanceOfAlice.generateOwnKeys();
   
    BigInteger alicePrivateKey = aliceKeys.getPrivateKey();
    
    // distributed stuff
    BigInteger alicePublicKeyX = aliceKeys.getPrivateKeyX();
    BigInteger alicePublicKeyY = aliceKeys.getPrivateKeyY();
    
    System.out.println("Alice, privateKey : " + alicePrivateKey.toString() );
    System.out.println("Alice, public.X   : " + alicePublicKeyX.toString() );
    System.out.println("Alice, public.Y   : " + alicePublicKeyY.toString() );
   
    // transferring Alice's public key to the side of BOB
    // Alice's private key should be left on her side 
    // and under no circumstances should it be exposed
    
    AsymJCEElGamalImpl instanceOfBob = new AsymJCEElGamalImpl(params);
    instanceOfBob.setCurveParameters();
    
    // generating random plaintext
    
    BigInteger plainText = new BigInteger( instanceOfBob.getECDomainParameters().getN().bitLength() - 1, new SecureRandom());
    System.out.println("plainText: " + plainText.toString(16) );
    
    
    FBElGamalEncryptedMessage cryptogram = instanceOfBob.encryptAsymmetric(alicePublicKeyX, alicePublicKeyY, plainText);

    
    String m2str = cryptogram.getM2().toString(16);

    String m1xstr = cryptogram.getM1().getRawXCoord().toBigInteger().toString(16);
    String m1ystr = cryptogram.getM1().getRawYCoord().toBigInteger().toString(16);

    
    System.out.println("M1.X: " + m1xstr);
    System.out.println("M1.Y: " + m1ystr);
    System.out.println("M2. : " + m2str );
    
    // decrypting this information. 
    
    BigInteger restored = instanceOfAlice.decryptAsymmetric( alicePrivateKey, cryptogram);    
    System.out.println("restored : " + restored.toString(16));
    

    // Input: m1xstr = x coordinate of m1 as string
    // m1xstr = y coordinate of m1 as string
    // m2str = m2 as tring

    // creating cryptogram data class instance: 
    FBElGamalEncryptedMessage cryptogram1 = new FBElGamalEncryptedMessage();    
    cryptogram1.setM2( new BigInteger(m2str,16)); 

    org.bouncycastle.math.ec.ECPoint.Fp _M1 = 
            instanceOfBob.extrapolateECPoint(
                    new BigInteger(m1xstr,16),
                    new BigInteger(m1ystr,16));
    // setting M1 to the instance of cryptogram
    cryptogram1.setM1(_M1);
    // decrypting
    BigInteger restored1 = instanceOfAlice.decryptAsymmetric( alicePrivateKey, cryptogram1);    
    System.out.println("restored1 : " + restored1.toString(16));    
    
    }

    
    
    
    

}
