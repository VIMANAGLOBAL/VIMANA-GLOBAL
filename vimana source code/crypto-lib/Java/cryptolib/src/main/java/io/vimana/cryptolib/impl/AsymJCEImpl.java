package io.vimana.cryptolib.impl;

import io.vimana.cryptolib.vimryptoAsym;
import io.vimana.cryptolib.vimryptoParams;
import io.vimana.cryptolib.csr.KeyGenerator;
import io.vimana.cryptolib.dataformat.AEAD;
import io.vimana.cryptolib.dataformat.AEADMessage;
import io.vimana.cryptolib.CryptoNotValidException;
import org.bouncycastle.jce.spec.IESParameterSpec;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import javax.crypto.spec.GCMParameterSpec;
import javax.crypto.spec.SecretKeySpec;
import java.nio.ByteBuffer;
import java.security.*;
import java.security.spec.InvalidKeySpecException;
import java.security.spec.X509EncodedKeySpec;
import java.util.Arrays;
import java.util.Collections;
import java.util.List;
import javax.crypto.BadPaddingException;
import javax.crypto.Cipher;
import javax.crypto.IllegalBlockSizeException;
import javax.crypto.KeyAgreement;
import javax.crypto.ShortBufferException;

public class AsymJCEImpl  extends AsymCommonImpl implements vimryptoAsym {

    private final static Logger log = LoggerFactory.getLogger(AsymJCEImpl.class);

    private final SecureRandom random = new SecureRandom();

    public AsymJCEImpl(vimryptoParams params) {
        super(params);
    }


    @Override
    public byte[] calculateSharedKey() {
        try {
            byte[] skh=doCalcualteShared(ourPublicKey, privateKey, theirPublicKey);
            sharedKey = new SecretKeySpec(skh, "AES");
            return sharedKey.getEncoded();
        } catch (NoSuchAlgorithmException | InvalidKeyException ex) {
            log.error(ex.getMessage());
        }
        return null;
    }

    @Override
    public byte[] encryptAsymmetric(byte[] plain) throws CryptoNotValidException {
        try {
            byte[] iv = new byte[params.getAesIvLen()];
            random.nextBytes(iv);

            gcmParameterSpecAsym = new GCMParameterSpec(params.getGcmAuthTagLenBits(), iv);
            blockCipherAsym.init(Cipher.ENCRYPT_MODE, sharedKey, gcmParameterSpecAsym);
            byte[] encrypted = new byte[blockCipherAsym.getOutputSize(plain.length)];
            int updateSize = blockCipherAsym.update(plain, 0, plain.length, encrypted);
            blockCipherAsym.doFinal(encrypted, updateSize);
            ByteBuffer bb = ByteBuffer.allocate(encrypted.length + params.getAesIvLen());
            bb.put(iv).put(encrypted);
            return bb.array();
        } catch (ShortBufferException | IllegalBlockSizeException | BadPaddingException
                | InvalidKeyException | InvalidAlgorithmParameterException ex) {
            log.warn(ex.getMessage());
            throw new CryptoNotValidException("Invalid asymmetric key", ex);
        }
    }

    @Override
    public byte[] decryptAsymmetric(byte[] ciphered) throws CryptoNotValidException {
        try {
            byte[] iv = Arrays.copyOf(ciphered, params.getAesIvLen());
            gcmParameterSpecAsym = new GCMParameterSpec(params.getGcmAuthTagLenBits(), iv);

            blockCipherAsym.init(Cipher.DECRYPT_MODE, sharedKey, gcmParameterSpecAsym);
            byte[] decrypted = new byte[blockCipherAsym.getOutputSize(ciphered.length - params.getAesIvLen())];
            int updateSize = blockCipherAsym.update(ciphered, params.getAesIvLen(), ciphered.length - params.getAesIvLen(), decrypted);
            blockCipherAsym.doFinal(decrypted, updateSize);
            return decrypted;
        } catch (ShortBufferException | IllegalBlockSizeException | BadPaddingException
                | InvalidKeyException | InvalidAlgorithmParameterException ex) {
            log.warn(ex.getMessage());
            throw new CryptoNotValidException("Invalid asymmetric key", ex);
        }
    }

    @Override
    public byte[] encryptAsymmetricIES(byte[] plain) throws CryptoNotValidException {
        try {
            byte[] iv = new byte[params.getIesIvLen()];
            random.nextBytes(iv);
            IESParameterSpec parameterSpec = new IESParameterSpec(null, null, params.getAesKeyLen() * 8, params.getAesKeyLen() * 8, iv);

            iescCipher.init(Cipher.ENCRYPT_MODE, theirPublicKey, parameterSpec);

            byte[] encrypted = iescCipher.doFinal(plain);

            ByteBuffer bb = ByteBuffer.allocate(encrypted.length + params.getIesIvLen());
            bb.put(iv).put(encrypted);
            return bb.array();
        } catch (InvalidKeyException | InvalidAlgorithmParameterException
                | IllegalBlockSizeException | BadPaddingException ex) {
            log.warn(ex.getMessage());
            throw new CryptoNotValidException("Invalid asymmetric key", ex);
        }
    }

    @Override
    public byte[] decryptAsymmetricIES(byte[] ciphered) throws CryptoNotValidException {
        try {
            byte[] iv = Arrays.copyOf(ciphered, params.getIesIvLen());
            IESParameterSpec parameterSpec = new IESParameterSpec(null, null, params.getAesKeyLen() * 8, params.getAesKeyLen() * 8, iv);

            iescCipher.init(Cipher.DECRYPT_MODE, privateKey, parameterSpec);
            byte[] decrypted = iescCipher.doFinal(ciphered, params.getIesIvLen(), ciphered.length - params.getIesIvLen());
            return decrypted;
        } catch (IllegalBlockSizeException | BadPaddingException
                | InvalidKeyException | InvalidAlgorithmParameterException ex) {
            log.warn(ex.getMessage());
            throw new CryptoNotValidException("Invalid asymmetric key", ex);
        }
    }

    @Override
    public AEADMessage encryptAsymmetricWithAEAData(byte[] plain, byte[] aeadata) throws CryptoNotValidException {
        try {
            byte[] iv = new byte[params.getAesIvLen()];
            random.nextBytes(iv);

            gcmParameterSpecAsym = new GCMParameterSpec(params.getGcmAuthTagLenBits(), iv);

            AEADMessage msg = new AEADMessage(params);
            blockCipherAsym.init(Cipher.ENCRYPT_MODE, sharedKey, gcmParameterSpecAsym);
            if(aeadata != null) {
                blockCipherAsym.updateAAD(aeadata);
                msg.aatext = aeadata;
            }
            msg.encrypted = new byte[blockCipherAsym.getOutputSize(plain.length)];
            int updateSize = blockCipherAsym.update(plain, 0, plain.length, msg.encrypted);
            blockCipherAsym.doFinal(msg.encrypted, updateSize);
            msg.setIV(iv);
            return msg;
        } catch (ShortBufferException | IllegalBlockSizeException | BadPaddingException
                | InvalidKeyException | InvalidAlgorithmParameterException ex) {
            log.warn(ex.getMessage());
            throw new CryptoNotValidException("Invalid asymmetric key", ex);
        }
    }

    @Override
    public AEAD decryptAsymmetricWithAEAData(byte[] message) throws CryptoNotValidException {
        AEAD res = new AEAD();
        AEADMessage msg = AEADMessage.fromBytes(message, params);
        gcmParameterSpecAsym = new GCMParameterSpec(params.getGcmAuthTagLenBits(), msg.getIV());
        try {
            blockCipherAsym.init(Cipher.DECRYPT_MODE, sharedKey, gcmParameterSpecAsym);
            blockCipherAsym.updateAAD(msg.aatext);
            res.decrypted = new byte[blockCipherAsym.getOutputSize(msg.encrypted.length)];
            int updateSize = blockCipherAsym.update(msg.encrypted, 0, msg.encrypted.length, res.decrypted);
            blockCipherAsym.doFinal(res.decrypted, updateSize);
            res.plain = msg.aatext;
            res.hmac_ok = true;
            return res;
        } catch (ShortBufferException | IllegalBlockSizeException | BadPaddingException
                | InvalidKeyException | InvalidAlgorithmParameterException ex) {
            log.warn(ex.getMessage());
            throw new CryptoNotValidException("Invalid symmetric key", ex);
        }
    }

    @Override
    public byte[] sign(byte[] message) throws CryptoNotValidException {
        try {
            Signature sig = Signature.getInstance(params.getSignatureAlgorythm());
            sig.initSign(privateKey);
            sig.update(message);
            return sig.sign();
        } catch (NoSuchAlgorithmException | InvalidKeyException | SignatureException ex) {
            log.error("Signingg error", ex);
            throw new CryptoNotValidException("Signing error", ex);
        }
    }

    @Override
    public byte[] ecdheStep1() throws CryptoNotValidException{
        KeyGenerator kg = new KeyGenerator(params);       
        ephemeralKeys = kg.generateKeys();
        byte[] signature = sign(ephemeralKeys.getPublic().getEncoded());
        byte[] key = ephemeralKeys.getPublic().getEncoded();
        int cap = Integer.BYTES+key.length+signature.length;
        ByteBuffer bb = ByteBuffer.allocate(cap);
        bb.putInt(key.length);
        bb.put(key);
        bb.put(signature);
        return bb.array();
    }

    @Override
    public byte[] ecdheStep2(byte[] signedEphemeralPubKey)  throws CryptoNotValidException{
        ByteBuffer bb = ByteBuffer.wrap(signedEphemeralPubKey);
        int keySize = bb.getInt();
        byte[] key = new byte[keySize];        
        byte[] signature = new byte[signedEphemeralPubKey.length-keySize-Integer.BYTES];
        bb.get(key);
        bb.get(signature);
        boolean ok = verifySignature(key, signature);
        if(!ok){
             throw new CryptoNotValidException("ECDHE public key signaature is nit valid!");
        }
        KeyFactory kf;
        try {
            kf = KeyFactory.getInstance("ECDSA", "BC");
            PublicKey theirPub = kf.generatePublic(new X509EncodedKeySpec(key));   
            byte[] skh = doCalcualteShared(ephemeralKeys.getPublic(), ephemeralKeys.getPrivate(), theirPub);
            SecretKeySpec sk = new SecretKeySpec(skh, "AES");
            ephemeralKeys=null; //allow GC to clean tmp keys
            return sk.getEncoded();
        } catch (NoSuchAlgorithmException | InvalidKeySpecException | InvalidKeyException | NoSuchProviderException ex ) {
            String msg = "Something wrong with public key from otgher side";
            log.error(msg, ex);
            throw new CryptoNotValidException(msg, ex);
        }
    }
    
    private byte[] doCalcualteShared(PublicKey ourPub, PrivateKey ourPriv, PublicKey theirPub) throws NoSuchAlgorithmException, InvalidKeyException{
            KeyAgreement keyAgreement = KeyAgreement.getInstance("ECDH");
            keyAgreement.init(ourPriv);
            keyAgreement.doPhase(theirPub, true);
            byte[] sk = keyAgreement.generateSecret();
            MessageDigest hash = MessageDigest.getInstance(params.getKeyAgreementDigester());
            hash.update(sk);
            // Simple deterministic ordering of keys to get same result on both ends
            List<ByteBuffer> keys = Arrays.asList(ByteBuffer.wrap(ourPublicKey.getEncoded()), ByteBuffer.wrap(theirPublicKey.getEncoded()));
            Collections.sort(keys);
            hash.update(keys.get(0));
            hash.update(keys.get(1));
            byte[] skh = hash.digest();  
            return skh;
    }
}
