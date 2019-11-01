package io.vimana.cryptolib.impl;

import io.vimana.cryptolib.vimryptoParams;
import io.vimana.cryptolib.vimryptoSym;
import io.vimana.cryptolib.dataformat.AEAD;
import io.vimana.cryptolib.dataformat.AEADMessage;
import io.vimana.cryptolib.CryptoNotValidException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import javax.crypto.*;
import javax.crypto.spec.GCMParameterSpec;
import javax.crypto.spec.SecretKeySpec;
import java.nio.ByteBuffer;
import java.security.*;
import java.util.Arrays;

/**
 * 
 * @author alukin@gmail.com
 */
public class SymJCEImpl  implements vimryptoSym {

    private Logger log = LoggerFactory.getLogger(SymJCEImpl.class);

    private final static SecureRandom random = new SecureRandom();

    Cipher blockCipherSym;
    GCMParameterSpec gcmParameterSpecSym;
    SecretKeySpec symmetrciKey;

    byte[] saltSymmetic; //first 4 bytes from symmetric key
    byte[] explicit_nounce_sym = new byte[8];
    byte[] prev_explicit_nounce_sym = new byte[8];

    byte[] gcmIVsym = new byte[12];

    final vimryptoParams params;

    public SymJCEImpl(vimryptoParams params) {
        this.params = params;
    }

    /**
     * Set key and IV (nounce) for
     *
     * @param key 128 or 256 bits key
     * @throws CryptoNotValidException
     */
    @Override
    public void setSymmetricKey(byte[] key) throws CryptoNotValidException {
        if (!((key.length == 128 / 8) || (key.length == 256 / 8))) {
            throw new IllegalArgumentException("Key length must be exactly 16 or 32 or bytes long");
        }
        try {

            symmetrciKey = new SecretKeySpec(key, "AES");
            blockCipherSym = Cipher.getInstance(params.getSymCipher());
        } catch (NoSuchAlgorithmException | NoSuchPaddingException ex) {
            log.warn(ex.getMessage());
            throw new CryptoNotValidException(ex.getMessage(), ex);
        }
    }

    @Override
    public void setSymmetricIV(byte[] IV) {
        switch (IV.length) {
            case 12:
                gcmIVsym = Arrays.copyOf(IV, 12);
                saltSymmetic = Arrays.copyOf(IV, 4);
                prev_explicit_nounce_sym = explicit_nounce_sym;
                explicit_nounce_sym = Arrays.copyOfRange(IV, 4, 12);
                break;

            default:
                throw new IllegalArgumentException("IV must be exactly 12 bytes long or 4 bytes of fixed nounce!");
        }
        gcmParameterSpecSym = new GCMParameterSpec(params.getGcmAuthTagLenBits(), IV);
    }

    @Override
    public byte[] getSymmetricIV() {
        return gcmIVsym;
    }

    @Override
    public void setSymmetricSalt(byte[] salt) {
        saltSymmetic = Arrays.copyOf(salt, 4);
    }

    @Override
    public void setSymmetricNonce(byte[] explicit_nounce) throws CryptoNotValidException {
        if (Arrays.equals(explicit_nounce_sym, explicit_nounce)) {
            throw new IllegalArgumentException("Nounce reuse detected!");
        }
        //preserve prev nounce for re-use detection
        prev_explicit_nounce_sym = Arrays.copyOf(explicit_nounce_sym, 8);
        if (explicit_nounce == null) {
            random.nextBytes(explicit_nounce_sym);
        } else {
            explicit_nounce_sym = Arrays.copyOf(explicit_nounce, 8);
        }
        if(saltSymmetic==null){
            throw new CryptoNotValidException("Salt is not set, please set it first!");
        }
        ByteBuffer.wrap(gcmIVsym).put(saltSymmetic).put(explicit_nounce_sym);
        gcmParameterSpecSym = new GCMParameterSpec(params.getGcmAuthTagLenBits(), gcmIVsym);
    }

    @Override
    public byte[] getSymmetricNounce() {
        return explicit_nounce_sym;
    }

    @Override
    public byte[] encryptSymmetric(byte[] plain) throws CryptoNotValidException {
        if (Arrays.hashCode(explicit_nounce_sym) == Arrays.hashCode(prev_explicit_nounce_sym)) {
            throw new IllegalArgumentException("IV reuse detected! please use 4 bytes IV then expicit_nounce vill be generated");
        }
        //TODO: avoid data copy, use BhyteBuffer somehow
        try {
            blockCipherSym.init(Cipher.ENCRYPT_MODE, symmetrciKey, gcmParameterSpecSym);
            byte[] encrypted = new byte[blockCipherSym.getOutputSize(plain.length)];
            int updateSize = blockCipherSym.update(plain, 0, plain.length, encrypted);
            blockCipherSym.doFinal(encrypted, updateSize);
            ByteBuffer bb = ByteBuffer.allocate(encrypted.length + params.getAesGcmNounceLen());
            bb.put(explicit_nounce_sym).put(encrypted);
            return bb.array();
        } catch (ShortBufferException | IllegalBlockSizeException | BadPaddingException
                | InvalidKeyException | InvalidAlgorithmParameterException ex) {
            log.warn(ex.getMessage());
            throw new CryptoNotValidException("Invalid symmetric key", ex);
        }
    }

    @Override
    public byte[] decryptSymmetric(byte[] ciphered) throws CryptoNotValidException {
        try {
            setSymmetricNonce(Arrays.copyOf(ciphered, params.getAesGcmNounceLen()));
            blockCipherSym.init(Cipher.DECRYPT_MODE, symmetrciKey, gcmParameterSpecSym);
            byte[] decrypted = new byte[blockCipherSym.getOutputSize(ciphered.length - params.getAesGcmNounceLen())];
            int updateSize = blockCipherSym.update(ciphered, params.getAesGcmNounceLen(), ciphered.length - params.getAesGcmNounceLen(), decrypted);
            blockCipherSym.doFinal(decrypted, updateSize);
            return decrypted;
        } catch (ShortBufferException | IllegalBlockSizeException | BadPaddingException
                | InvalidKeyException | InvalidAlgorithmParameterException ex) {
            log.warn(ex.getMessage());
            throw new CryptoNotValidException("Invalid symmetric key", ex);
        }
    }

    @Override
    public AEADMessage encryptSymmetricWithAEAData(byte[] plain, byte[] aeadata) throws CryptoNotValidException {
        if (Arrays.hashCode(explicit_nounce_sym) == Arrays.hashCode(prev_explicit_nounce_sym)) {
            throw new IllegalArgumentException("IV reuse detected! please use 4 bytes IV then expicit_nounce vill be generated");
        }
        try {
            AEADMessage msg = new AEADMessage(params);
            blockCipherSym.init(Cipher.ENCRYPT_MODE, symmetrciKey, gcmParameterSpecSym);
            if(aeadata != null) {
                blockCipherSym.updateAAD(aeadata);
                msg.aatext = aeadata;
            }
            msg.encrypted = new byte[blockCipherSym.getOutputSize(plain.length)];
            int updateSize = blockCipherSym.update(plain, 0, plain.length, msg.encrypted);
            blockCipherSym.doFinal(msg.encrypted, updateSize);
            msg.setExplicitNounce(explicit_nounce_sym);
            return msg;
        } catch (ShortBufferException | IllegalBlockSizeException | BadPaddingException
                | InvalidKeyException | InvalidAlgorithmParameterException ex) {
            log.warn(ex.getMessage());
            throw new CryptoNotValidException("Invalid symmetric key", ex);
        }
    }

    @Override
    public AEAD decryptSymmetricWithAEAData(byte[] message) throws CryptoNotValidException {
        AEAD res = new AEAD();
        AEADMessage msg = AEADMessage.fromBytes(message, params);
        setSymmetricNonce(msg.getExplicitNounce());
        try {
            blockCipherSym.init(Cipher.DECRYPT_MODE, symmetrciKey, gcmParameterSpecSym);
            blockCipherSym.updateAAD(msg.aatext);
            res.decrypted = new byte[blockCipherSym.getOutputSize(msg.encrypted.length)];
            int updateSize = blockCipherSym.update(msg.encrypted, 0, msg.encrypted.length, res.decrypted);
            blockCipherSym.doFinal(res.decrypted, updateSize);
            res.plain = msg.aatext;
            res.hmac_ok = true;
            return res;
        } catch (ShortBufferException | IllegalBlockSizeException | BadPaddingException
                | InvalidKeyException | InvalidAlgorithmParameterException ex) {
            log.warn(ex.getMessage());
            throw new CryptoNotValidException("Invalid symmetric key", ex);
        }
    }

}
