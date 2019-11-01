import {byteArrayToHexString, utf8ToByteArray, hexStringToByteArray, stringToHexString} from 'bytey';


class AEADMessage {
    /**
     * Maximal size of plain and encrypted parts in sum to prevent DoS attacks
     */

    constructor() {

        this.MAX_MSG_SIZE = 65536;

        this.aatext;
        this.encrypted;
        this.hmacSize;
        this.iv;
        this.cryptoParams;
        this.explicitNounce;

    }

    setAEADParams(cryptoParams) {
        this.encrypted = cryptoParams.encrypted;
        this.aatext    = cryptoParams.aatext;
        this.hmacSize  = cryptoParams.hmacSize; //128 bits
        this.iv        = cryptoParams.iv;       //12 bytes, RFC 5288;  salt and explicit nounce
    }

    /**
     * Sets 8 bytes of implicit part on nounce that goes with message
     * @param en 8 bytes of explicit part of IV
     */
    setExplicitNounce(nonce){
        this.explicitNounce = nonce;
    }


    getExplicitNounce(){
        return this.explicitNounce;
    }

    getIV(){
        return this.iv;
    }

    setIV(iv){
        return this.iv;
    }

    getHMAC(){
        return Arrays.copyOfRange(encrypted, encrypted.length - hmacSize -1,encrypted.length-1);
    }

    // returns bytes
    fromBytes(message){

        let iv           = message.slice(0, 12);
        let salt         = message.slice(0,4);
        let nonce        = message.slice(4, 12);
        let aatextPos    = message.slice(12, 16)[3];
        let aatext       = message.slice(20, 20 + aatextPos);
        let cipherText   = message.slice(20 + aatextPos, message.length - 16);
        let authTag      = message.slice(message.length - 16, message.length);

        return {
            aatext,
            cipherText,
            iv,
            salt,
            nonce,
            authTag
        }

    }

    toBytes() {
        // let capacity = calcBytesSize(encrypted);
        let bb = [
            ...this.iv,            // 12 bytes
            ...[0,0,0],            // 4 bytes
            this.aatext.length,
            ...[0,0,0],            // 4 bytes
            this.encrypted.length,
            ...this.aatext,        //
            ...this.encrypted
        ];

        return byteArrayToHexString(bb);
    }

    calcBytesSize() {
        return iv.length + 4 + 4 + aatext.length + encrypted.length;



    }

}

export default AEADMessage;
