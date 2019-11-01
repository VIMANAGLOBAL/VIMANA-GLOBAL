package io.vimana.cryptolib.dataformat;

import io.vimana.cryptolib.vimryptoParams;

import java.nio.ByteBuffer;
import java.util.Arrays;

/**
 * Defines message format for AEAD with IV, plain authenticated
 * data and encrypted data.
 * specially formated data that includes: 
 *    IV  (12 bytes), (salt+explicit nounce)
 *    unencryped data lenght (4 bytes),
 *    ecnrypted data lenght (4 bytes)
 *    unencrypted data (variable len), 
 *    encrypted data in the rest of message including
 *    last 16 bytes (128 bits) of hmac 
 * @author alukin@gmail.com
 */
public class AEADMessage {
    /**
     * Maximal size of plain and encrypted parts in sum to prevent DoS attacks
     */
    public static final int MAX_MSG_SIZE = 65536;

    public byte[] aatext = new byte[0];
    public byte[] encrypted;

    private final int hmacSize;
    private final byte[] iv; //12 bytes = 4 of salt + 8 of nonce

    private final vimryptoParams cryptoParams;

    public AEADMessage(vimryptoParams cryptoParams) {
        this.cryptoParams = cryptoParams;
        this.hmacSize = cryptoParams.getGcmAuthTagLenBits() / 8; //128 bits
        this.iv = new byte[cryptoParams.getAesIvLen()]; //12 bytes, RFC 5288;  salt and explicit nounce
    }

    /**
     * Sets 8 bytes of implicit part on nounce that goes with message
     * @param en 8 bytes of explicit part of IV
     */
    public void setExplicitNounce(byte[] en){
        if(en.length!=8){
            throw new IllegalArgumentException("Nounce size must be exactly 8 bytes");
        }
        Arrays.fill(iv, (byte)0);
        System.arraycopy(en, 0, iv, 4, 8);       
    }

    
    public byte[] getExplicitNounce(){
        return Arrays.copyOfRange(iv, 4, 12);
    }

    public byte[] getIV(){
        return iv;
    }
    
    public void setIV(byte[] ivv){
       if(ivv.length != cryptoParams.getAesIvLen()){
            throw new IllegalArgumentException("Nounce size must be exactly 8 bytes");
        }
       System.arraycopy(ivv, 0, iv, 0, cryptoParams.getAesIvLen());
    }
    
    public byte[] getHMAC(){
      return Arrays.copyOfRange(encrypted, encrypted.length - hmacSize -1,encrypted.length-1);
    }
    
    public static AEADMessage fromBytes(byte[] message, vimryptoParams cryptoParams){
        AEADMessage res = new AEADMessage(cryptoParams);
        ByteBuffer bb = ByteBuffer.wrap(message);
        bb.get(res.iv);
        int txtlen = bb.getInt();
        int enclen = bb.getInt();
        //prevent overflow attack
        if(txtlen+enclen > MAX_MSG_SIZE){
            throw new IllegalArgumentException("Declared message size is too big: " + (txtlen + enclen));
        }
        res.aatext = new byte[txtlen];
        res.encrypted = new byte[enclen];
        bb.get(res.aatext);
        bb.get(res.encrypted);
        return res;
    }
    
    public byte[] toBytes(){
        int capacity = calcBytesSize();
        ByteBuffer bb = ByteBuffer.allocate(capacity);
        bb.put(iv);
        bb.putInt(aatext.length);
        bb.putInt(encrypted.length);
        bb.put(aatext);
        bb.put(encrypted); //hmac is 16 bytes tail of encrypted
        return bb.array();
    }

    public int calcBytesSize() {
        return iv.length + 4 + 4 + aatext.length + encrypted.length;
    }

}
