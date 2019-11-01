package io.vimana.cryptolib.impl;

import io.vimana.cryptolib.vimryptoExt;
import io.vimana.cryptolib.vimryptoParams;
import io.vimana.cryptolib.CryptoNotValidException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.nio.ByteBuffer;
import java.security.InvalidKeyException;
import java.security.NoSuchAlgorithmException;
import java.security.PrivateKey;
import java.security.PublicKey;
import java.security.spec.InvalidKeySpecException;
import java.security.spec.KeySpec;
import javax.crypto.SecretKey;
import javax.crypto.SecretKeyFactory;
import javax.crypto.spec.PBEKeySpec;
import org.bouncycastle.util.encoders.Hex;

public class ExtJCEImpl implements vimryptoExt {

    private Logger log = LoggerFactory.getLogger(ExtJCEImpl.class);

    AsymJCEImpl asymJCE;
    SymJCEImpl symJCE;
    vimryptoParams params;
    
    public ExtJCEImpl(vimryptoParams params) {
        asymJCE = new AsymJCEImpl(params);
        symJCE = new SymJCEImpl(params);
    }


    @Override
    public void setSymmetricKey(byte[] key) throws CryptoNotValidException {
        symJCE.setSymmetricKey(key);
    }

    @Override
    public void setSymmetricIV(byte[] IV) {
        symJCE.setSymmetricIV(IV);
    }

    @Override
    public void setSymmetricSalt(byte[] salt) {
        symJCE.setSymmetricSalt(salt);
    }

    @Override
    public void setSymmetricNounce(byte[] explicit_nounce) throws CryptoNotValidException {
        symJCE.setSymmetricNonce(explicit_nounce);
    }

    @Override
    public void setAsymmetricKeys(PublicKey ourPubkey, PrivateKey privKey, PublicKey theirPubKey) throws InvalidKeyException {
        asymJCE.setAsymmetricKeys(ourPubkey, privKey, theirPubKey);
    }

    byte[] constructReverseSchemeKey(byte[] preSharedSecret, PublicKey pk) throws CryptoNotValidException {
        SecretKeyFactory kf;
        try {
            kf = SecretKeyFactory.getInstance(params.getKeyDerivationFn());

        KeySpec specs = new PBEKeySpec(Hex.toHexString(pk.getEncoded()).toCharArray(),
                preSharedSecret, params.getPbkdf2Iterations(), 256);
        SecretKey key = null;

            key = kf.generateSecret(specs);
        return key.getEncoded();            
        } catch (NoSuchAlgorithmException ex) {
            String msg = "Invalid Key derivation algorythm: " + params.getKeyDerivationFn();
            log.error(msg, ex);
            throw new CryptoNotValidException(msg, ex);
        } catch (InvalidKeySpecException ex) {
            String msg = "Can not generate reverse scheme shared key";
            log.error(msg, ex);
            throw new CryptoNotValidException(msg, ex);
        }

    }
    
    @Override
    public byte[] reverseSchemeEncryptAndSign(byte[] plain, byte[] preSharedSecret) {
        try {
            symJCE.setSymmetricKey(constructReverseSchemeKey(preSharedSecret, asymJCE.ourPublicKey));
            symJCE.setSymmetricIV(preSharedSecret);
            byte[] ciphered = symJCE.encryptSymmetric(plain);
            byte[] signature = asymJCE.sign(ciphered);
            ByteBuffer bb = ByteBuffer.allocate(ciphered.length + signature.length);
            bb.putInt(ciphered.length).put(ciphered).put(signature);
            return bb.array();
        } catch (CryptoNotValidException ex) {
            log.error("Can not encrypt.", ex);
        }

        byte[] res = null;
        return res;
    }

    @Override
    public byte[] reverseSchemeDecryptAndVerify(byte[] encrypted_and_signed, byte[] preSharedSecret) throws CryptoNotValidException {
        ByteBuffer bb = ByteBuffer.wrap(encrypted_and_signed);
        int ciphered_len = bb.getInt();
        byte[] ciphered = new byte[ciphered_len];
        bb.get(ciphered);
        byte[] signature = new byte[encrypted_and_signed.length - ciphered_len - Integer.BYTES];
        bb.get(signature);
        if (!asymJCE.verifySignature(ciphered, signature)) {
            throw new CryptoNotValidException("Invalid signature!");
        }
        symJCE.setSymmetricKey(constructReverseSchemeKey(preSharedSecret, asymJCE.theirPublicKey));
        symJCE.setSymmetricIV(preSharedSecret);
        return symJCE.decryptSymmetric(ciphered);
    }

}
