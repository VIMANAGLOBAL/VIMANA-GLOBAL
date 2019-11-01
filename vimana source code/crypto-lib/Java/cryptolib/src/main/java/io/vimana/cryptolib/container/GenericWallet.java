package io.vimana.cryptolib.container;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import io.vimana.cryptolib.CryptoNotValidException;
import io.vimana.cryptolib.vimryptoDigest;
import io.vimana.cryptolib.vimryptoFactory;
import io.vimana.cryptolib.vimryptoParams;
import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;

/**
 * JSON-based encrypted general purpose wallet
 *
 * @author alukin@gmail.com
 * @param <T> Model ow wallet
 */
public class GenericWallet<T> {

    private final ObjectMapper mapper = new ObjectMapper();
    protected T wallet = null;
    private byte[] openData;
    private byte[] container_iv;
    Class walletModelClass;
    
/**
 *  Gets open data of wallet even if key is wrong
 * @return 
 */
    public byte[] getOpenData() {
        return openData;
    }
/**
 * Sets open data for wallet
 * @param openData 
 */
    public void setOpenData(byte[] openData) {
        this.openData = openData;
    }
    
    public byte[] getContanerIV(){
        return container_iv;
    }
    
    protected GenericWallet(){
    
    }
    public GenericWallet(Class walletModelClass) {
        this.walletModelClass=walletModelClass;
    }

    public void openFile(String path, byte[] key) throws FileNotFoundException, IOException, CryptoNotValidException {
        try(FileInputStream fis = new FileInputStream(path)) {
            openStream(fis, key);
        }
    }

    /**
     * Get only open data.
     * @param path
     * @throws FileNotFoundException
     * @throws IOException
     * @throws CryptoNotValidException
     */
    public void readOpenData(String path) throws FileNotFoundException, IOException, CryptoNotValidException {
        try(FileInputStream fis = new FileInputStream(path)) {
            vimryptoContainer c = new vimryptoContainer();
            this.openData = c.readOpenDataOnly(fis);
            this.container_iv = c.getFullIV();
        }
    }

    /**
     * Get only open data.
     * @throws FileNotFoundException
     * @throws IOException
     * @throws CryptoNotValidException
     */
    public void readOpenData(InputStream is) throws FileNotFoundException, IOException, CryptoNotValidException {
        try {
            vimryptoContainer c = new vimryptoContainer();
            this.openData = c.readOpenDataOnly(is);
            this.container_iv = c.getFullIV();
        } catch (Exception ex){
            throw ex;
        } finally {
            is.close();
        }
    }

    public void openStream(InputStream is, byte[] key) throws IOException, CryptoNotValidException {
        vimryptoContainer c = new vimryptoContainer();
        try {
            byte[] data = c.read(is, key);
            openData = c.getOpenData();
            container_iv = c.getFullIV();
            wallet = (T)mapper.readValue(data, walletModelClass);
        } catch (IOException | CryptoNotValidException e) {
            //try to read open data anyway and re-throw
            openData = c.getOpenData();
            throw e;
        }
    }

    public void saveFile(String path, byte[] key, byte[] IV) throws FileNotFoundException, IOException, JsonProcessingException, CryptoNotValidException {
        try(FileOutputStream fos = new FileOutputStream(path)) {
            saveStream(fos, key, IV);
        }
    }

    public void saveStream(OutputStream os, byte[] key, byte[] IV) throws JsonProcessingException, IOException, CryptoNotValidException {
        vimryptoContainer c = new vimryptoContainer();
        c.setOpenData(openData);
        c.save(os, mapper.writeValueAsBytes(wallet), key, IV);
    }

    public byte[] keyFromPassPhrase(String passPhrase, byte[] salt) throws CryptoNotValidException {
        vimryptoFactory f = new vimryptoFactory(vimryptoParams.createDefault());
        vimryptoDigest d = f.getDigesters();
        return d.PBKDF2(passPhrase, salt);
    }
    
    public T getWallet() {
        return wallet;
    }

    public void setWallet(T wallet) {
        this.wallet = wallet;
    }
    
  }
