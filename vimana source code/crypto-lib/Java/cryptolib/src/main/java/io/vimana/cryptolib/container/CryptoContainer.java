package io.vimana.cryptolib.container;

import io.vimana.cryptolib.CryptoNotValidException;
import io.vimana.cryptolib.vimryptoFactory;
import io.vimana.cryptolib.vimryptoParams;
import io.vimana.cryptolib.vimryptoSym;
import io.vimana.cryptolib.dataformat.AEAD;
import io.vimana.cryptolib.dataformat.AEADMessage;
import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;
import java.util.Arrays;
import java.util.zip.GZIPInputStream;
import java.util.zip.GZIPOutputStream;

/**
 * Binary encrypted container for arbitrary data. It contains open data as AAD
 * and open data could be extracted without proper encryption key. Protected
 * data are gziped and then encrypted with AES256. So it makes extremely
 * difficult or impossible to extract protected data without proper key.
 *
 * @author alukin@gmail.com
 */
public class vimryptoContainer {

    public static final byte[] FILE_MAGIC = {0x0F, 0x0B, 0x0C, 0x69};
    public static final int MAGIC_SIZE = 4;
    public static final int SALT_SIZE = 4; //IV=salt+nonce
    public static final int IV_SIZE = 12; // 4 bytes of salt and 8 bytes of explicit nonce in AEADMEssage
    public static final int BUF_SIZE = 4096;
    public static final int MAX_SIZE = BUF_SIZE * 1024 * 8; //32M
    private byte[] openData;
    private byte[] IV;
    
    vimryptoParams params = vimryptoParams.createSecp521r1();
    private vimryptoFactory ff = new vimryptoFactory(params);

    /**
     * Sets open data for container
     *
     * @param od
     */
    public void setOpenData(byte[] od) {
        openData = od;
    }

    /**
     * gets open data from contaner. It is enough to just call read() and ignore
     * exceptions.
     *
     * @return open data of container
     */
    public byte[] getOpenData() {
        return openData;
    }
    
    /**
     * All 12 bytes of IV. Note that is is ready only after read() or readOpenDataOnly()
     * @return 12 bytes of IV
     */
    public byte[] getFullIV(){
        return IV;
    }
    
    private void composeIV(byte[] salt, byte[] nonce){
        IV=new byte[IV_SIZE];
        System.arraycopy(salt, 0, IV, 0, 4);
        System.arraycopy(nonce, 0, IV, 4, 8);
    }
    /**
     * Reads opan and protected data from container. If key is null or wrong,
     * open data is set anyway, just ignore exceptions. If key is correct,
     * protected data are extracted and open data are verified.
     *
     * @param is input stream
     * @param key 256 bit key
     * @return array of protected data stored in container
     * @throws IOException
     * @throws CryptoNotValidException
     */
    public byte[] read(InputStream is, byte[] key) throws IOException, CryptoNotValidException {
        byte[] magic = new byte[MAGIC_SIZE];
        is.read(magic);
        byte[] salt = new byte[SALT_SIZE];
        is.read(salt);
        if (Arrays.equals(magic, FILE_MAGIC)) {
            byte[] data = new byte[MAX_SIZE];
            int r;
            int sz = 0;
            while ((r = is.read(data, sz, MAX_SIZE - sz)) >= 0) {
                sz = sz + r;
                if (sz > MAX_SIZE) {
                    throw new CryptoNotValidException("Maximum size of container excided");
                }
            }
            return decrypt(Arrays.copyOf(data, sz), key, salt);
        } else {
            throw new CryptoNotValidException("Format error, magic at beginnin does not  match");
        }
    }

    /**
     * Reads open data only from container
     *
     * @param is input stream
     * @return open data as byte array
     * @throws IOException
     * @throws CryptoNotValidException
     */
    public byte[] readOpenDataOnly(InputStream is) throws IOException, CryptoNotValidException {
        byte[] magic = new byte[MAGIC_SIZE];
        is.read(magic);
        byte[] salt = new byte[SALT_SIZE];
        is.read(salt);
        if (Arrays.equals(magic, FILE_MAGIC)) {
            byte[] data = new byte[MAX_SIZE];
            int r;
            int sz = 0;
            while ((r = is.read(data, sz, MAX_SIZE - sz)) >= 0) {
                sz = sz + r;
                if (sz > MAX_SIZE) {
                    throw new CryptoNotValidException("Maximum size of container excided");
                }
            }
            AEADMessage msg = AEADMessage.fromBytes(Arrays.copyOf(data, sz), params);
            composeIV(salt,msg.getExplicitNounce());            
            openData = msg.aatext;
            return openData;
        } else {
            throw new CryptoNotValidException("Format error, magic at beginnin does not  match");
        }
    }

    private byte[] decrypt(byte[] input, byte[] key, byte[] salt) throws CryptoNotValidException, IOException {
        AEADMessage msg = AEADMessage.fromBytes(input, params);
        openData = msg.aatext;
        composeIV(salt,msg.getExplicitNounce());
        vimryptoSym symCrypto = ff.getSymCrypto();
        symCrypto.setSymmetricSalt(salt);
        symCrypto.setSymmetricKey(key);
        AEAD a = symCrypto.decryptSymmetricWithAEAData(input);
        byte[] uncomp = gzipUncompress(a.decrypted);
        openData = Arrays.copyOf(a.plain, a.plain.length);
        return uncomp;
    }

    private byte[] encrypt(byte[] input, byte[] key, byte[] IV) throws IOException, CryptoNotValidException {
        byte[] comp = gzipCompress(input);
        vimryptoSym symCrypto = ff.getSymCrypto();
        symCrypto.setSymmetricIV(IV);
        symCrypto.setSymmetricKey(key);
        AEADMessage am = symCrypto.encryptSymmetricWithAEAData(comp, openData);
        return am.toBytes();
    }

    /**
     * Saves open data (if set) and protected data in ecnrypted container.
     *
     * @param os output stream
     * @param plain protected data
     * @param key 256 bit (32 bytes) key
     * @param IV 12 bytes of initialization vector;
     * @throws IOException
     * @throws CryptoNotValidException
     */
    public void save(OutputStream os, byte[] plain, byte[] key, byte[] IV) throws IOException, CryptoNotValidException {
        os.write(FILE_MAGIC);
        os.write(IV, 0, 4); //first 4 bytes is salt, last 8 is nonce
        byte[] res = encrypt(plain, key, IV);
        os.write(res);
    }

    /**
     * compresses data with GZIP
     *
     * @param uncompressedData plain data
     * @return compressed data
     * @throws IOException
     */
    public byte[] gzipCompress(byte[] uncompressedData) throws IOException {
        ByteArrayOutputStream bos = new ByteArrayOutputStream(uncompressedData.length);
        GZIPOutputStream gzipOS = new GZIPOutputStream(bos);
        gzipOS.write(uncompressedData);
        gzipOS.close();
        byte[] result = bos.toByteArray();
        return result;
    }

    /**
     * uncompresses GZIP data
     *
     * @param compressedData gzip compressed data
     * @return plain uncompressed data
     * @throws IOException
     */
    public byte[] gzipUncompress(byte[] compressedData) throws IOException {
        ByteArrayInputStream bis = new ByteArrayInputStream(compressedData);
        ByteArrayOutputStream bos = new ByteArrayOutputStream();
        GZIPInputStream gzipIS = new GZIPInputStream(bis);
        byte[] buffer = new byte[1024];
        int len;
        while ((len = gzipIS.read(buffer)) != -1) {
            bos.write(buffer, 0, len);
        }
        byte[] result = bos.toByteArray();
        return result;
    }
}
