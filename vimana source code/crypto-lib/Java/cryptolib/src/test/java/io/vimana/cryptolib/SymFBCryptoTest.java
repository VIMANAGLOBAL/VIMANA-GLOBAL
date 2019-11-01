package io.vimana.cryptolib;

import io.vimana.cryptolib.dataformat.AEAD;
import io.vimana.cryptolib.dataformat.AEADMessage;
import io.vimana.cryptolib.impl.SymJCEImpl;
import java.io.FileInputStream;
import java.io.FileOutputStream;
import java.io.IOException;
import java.nio.ByteBuffer;
import java.nio.channels.FileChannel;
import java.security.SecureRandom;
import org.junit.jupiter.api.AfterAll;
import static org.junit.jupiter.api.Assertions.assertArrayEquals;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.junit.jupiter.api.Assertions.fail;
import org.junit.jupiter.api.BeforeAll;
import org.junit.jupiter.api.Test;

/**
 *
 * @author al
 */
public class SymvimryptoTest {

    private static final String PLAIN_FILE = "../../testdata/encrypt_sym_test_plain.bin";
    private static final String KEY_FILE = "../../testdata/encrypt_sym_test_key.bin";
    private static final String OUT_FILE_ENCRYPT_SYM = "../../testdata/encrypt_sym_test.bin";
    private static final String OUT_FILE_ENCRYPT_SYM_AEAD = "../../testdata/encrypt_sym_aead_test.bin";
    private static final String OPEN_TEXT = "This is test open text. Should be visisble as is";
    private static final SecureRandom srand = new SecureRandom();
    private static final int RANDOM_BYTES_NUMBER = 4096;

    private static vimryptoParams params = vimryptoParams.createDefault();
        
    public SymvimryptoTest() {
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
        System.out.println("Preparing random plain file and random salt+key");
        //write random file of plain text
        byte[] rt = new byte[RANDOM_BYTES_NUMBER];
        srand.nextBytes(rt);
        try {
            writeToFile(ByteBuffer.wrap(rt), PLAIN_FILE);

            byte[] key = new byte[256 / 8];
            byte[] salt = new byte[4];
            srand.nextBytes(key);
            srand.nextBytes(salt);
            //write salt+key to file
            ByteBuffer skb = ByteBuffer.allocate(salt.length + key.length);
            skb.put(salt);
            skb.put(key);
            writeToFile(skb, KEY_FILE);

        } catch (IOException ex) {
            fail("Can not write: " + PLAIN_FILE);
        }
    }

    @AfterAll
    public static void tearDownClass() {
    }


    @Test
    public void testEncryptToFile() {
        System.out.println("Testing symmetric encryptio-decryption fith files");
        try {
            //read plain text file
            byte[] plain = readFromFile(PLAIN_FILE).array();

            byte[] key = new byte[256 / 8];
            byte[] salt = new byte[4];
            //read key file: salt+key
            ByteBuffer skb = readFromFile(KEY_FILE);
            skb.get(salt);
            skb.get(key);
            
            vimryptoSym instance_e = new SymJCEImpl(params);
            instance_e.setSymmetricSalt(salt);
            instance_e.setSymmetricNonce(null); //generate random nonce
            instance_e.setSymmetricKey(key);
            byte[] encrypted = instance_e.encryptSymmetric(plain);

            //write encrypted to file prefixed with explicitNounce
            writeToFile(ByteBuffer.wrap(encrypted), OUT_FILE_ENCRYPT_SYM);

            //read encrypted data file into "encrypted" byte array
            encrypted = readFromFile(OUT_FILE_ENCRYPT_SYM).array();
            
            //prepare instance for decription.            
            vimryptoSym instance_d = new SymJCEImpl(params);
            instance_d.setSymmetricSalt(salt);
            instance_d.setSymmetricKey(key);
            //There is no need to call setSymmetricNounce() because nounce
            // is part of encrypted data (prefix of 8 bytes legnth)
            byte[] plain_decrypted = instance_d.decryptSymmetric(encrypted);
            //check that decrypted and plain arrays match
            assertArrayEquals(plain, plain_decrypted);
        } catch (IOException ex) {
            fail("Can not read: " + PLAIN_FILE);
        } catch (CryptoNotValidException ex) {
            fail("Can not encrypt:" + ex.getMessage());
        }

    }

    @Test
    public void testEncryptAEADToFile() {
        System.out.println("Testing symmetric AEAD encryption-decryption fith files");
        try {
            //read plain text file
            byte[] plain = readFromFile(PLAIN_FILE).array();

            byte[] key = new byte[256 / 8];
            byte[] salt = new byte[4];
            //read key file
            //read key file: salt+key
            ByteBuffer skb = readFromFile(KEY_FILE);
            skb.get(salt);
            skb.get(key);
            //encrypt       
            vimryptoSym instance_e = new SymJCEImpl(params);
            instance_e.setSymmetricSalt(salt);
            instance_e.setSymmetricNonce(null); //generate random nonce
            
            byte[] _nonce = instance_e.getSymmetricNounce();
            
            instance_e.setSymmetricKey(key);
            AEADMessage encrypted = instance_e.encryptSymmetricWithAEAData(plain, OPEN_TEXT.getBytes());

            //write encrypted to file prefixed with explicitNounce
            ByteBuffer wrb = ByteBuffer.wrap(encrypted.toBytes());
            writeToFile(wrb, OUT_FILE_ENCRYPT_SYM_AEAD);

            //read encrypted
            byte[] encrypted_buf = readFromFile(OUT_FILE_ENCRYPT_SYM_AEAD).array();

            vimryptoSym instance_d = new SymJCEImpl(params);
            instance_d.setSymmetricSalt(salt);
            instance_d.setSymmetricKey(key);
            AEAD decrypted = instance_d.decryptSymmetricWithAEAData(encrypted_buf);
            //check
            assertTrue(decrypted.hmac_ok);
            assertArrayEquals(decrypted.decrypted, plain);
            assertArrayEquals(decrypted.plain, OPEN_TEXT.getBytes())
                    ;
        } catch (IOException ex) {
            fail("Can not read: " + PLAIN_FILE);
        } catch (CryptoNotValidException ex) {
            fail("Can not encrypt:" + ex.getMessage());
        }
    }

}
