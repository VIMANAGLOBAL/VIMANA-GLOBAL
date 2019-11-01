import CryptoJS from 'crypto-js';
import crypto from 'crypto';
import {stringToBytes, bytesToString} from 'convert-string'
import {byteArrayToHexString, utf8ToByteArray, hexStringToByteArray, stringToHexString, byteArrayToUtf8} from 'bytey';
import AEADMessage from '../dataformat/AEADMessage'

class SymJCEImpl {

    constructor() {
        this.blockCipherSym;
        this.gcmParameterSpecSym;
        this.symmetrciKey;

        this.saltSymmetic; //first 4 bytes from symmetric key
        this.explicit_nounce_sym = new Int8Array(8);
        this.prev_explicit_nounce_sym = new Int8Array(8);

        this.gcmIVsym = new Int8Array(12);
    }

     setSymmetricKey(key) {
        if (!((key.length === 128 / 8) || (key.length === 256 / 8))) {
        // throw new IllegalArgumentException("Key length must be exactly 16 or 32 or bytes long");
        }
        try {
            this.symmetrciKey = key;
            // this.blockCipherSym = Cipher.getInstance(params.getSymCipher());
        } catch (err) {
            log.warn(err);
            // throw new CryptoNotValidException(ex.getMessage(), ex);
        }
    }

    // setSymmetricIV(IV) {
    //     switch (IV.length) {
    //         case 12:
    //             this.gcmIVsym = Arrays.copyOf(IV, 12);
    //             this.saltSymmetic = Arrays.copyOf(IV, 4);
    //             this.prev_explicit_nounce_sym = explicit_nounce_sym;
    //             this.explicit_nounce_sym = Arrays.copyOfRange(IV, 4, 12);
    //             break;
    //
    //         default:
    //         throw new IllegalArgumentException("IV must be exactly 12 bytes long or 4 bytes of fixed nounce!");
    //     }
    //     this.gcmParameterSpecSym = new GCMParameterSpec(params.getGcmAuthTagLenBits(), IV);
    // }

    getSymmetricIV() {
        return this.gcmIVsym;
    }

    setSymmetricSalt(salt) {
        this.saltSymmetic = salt;
    }

    setSymmetricNounce(explicit_nounce){
        this.explicit_nounce_sym = explicit_nounce;
    }

    getSymmetricNounce() {
        return this.explicit_nounce_sym;
    }

    encryptSymmetric(plain) {
        //TODO: avoid data copy, use BhyteBuffer somehow

        try {
            var salt = this.saltSymmetic;
            var nonce = this.explicit_nounce_sym;
            var key = new Buffer(hexStringToByteArray(this.symmetrciKey));

            var ALGO = 'aes-256-gcm';


            const iv = new Buffer([
                ...hexStringToByteArray(salt),
                ...hexStringToByteArray(nonce)
            ]);

            const cipher = crypto.createCipheriv(ALGO, key, iv, {
                authTagLength: 16
            }).setAutoPadding(false);

            const plainText = new Buffer(hexStringToByteArray(plain));
            let enc = cipher.update(plainText, 'binary');
            cipher.final();

            enc = enc.toString('hex')
            const tag = cipher.getAuthTag().toString('hex');

            return (nonce + enc + tag);

        } catch (err) {
            console.log(err);
        }
    }

    decryptSymmetric(ciphered) {
        const salt = this.saltSymmetic;
        const nonce = ciphered.slice(0,16);
        const cipherText = ciphered.slice(16, ciphered.length - 32);
        var key = new Buffer(hexStringToByteArray(this.symmetrciKey));
        var tag = new Buffer(hexStringToByteArray(ciphered.slice(ciphered.length - 32, ciphered.length)));

        const iv = new Buffer([
            ...hexStringToByteArray(salt),
            ...hexStringToByteArray(nonce)
        ]);

        var ALGO = 'aes-256-gcm';

        const decipher = crypto.createDecipheriv(ALGO, key, iv, {
            authTagLength: 16
        });

        const cipheredText = new Buffer(hexStringToByteArray(cipherText));

        var dec = decipher.update(cipheredText, 'binary');
        dec = dec.toString('hex');

        return dec;
    }

    encryptSymmetricWithAEAData(plaintext, aeadata) {

        var salt = this.saltSymmetic;
        var nonce = this.explicit_nounce_sym;
        var key = new Buffer(hexStringToByteArray(this.symmetrciKey));

            aeadata = new Buffer(utf8ToByteArray(aeadata));

        const iv = new Buffer([
            ...hexStringToByteArray(salt),
            ...hexStringToByteArray(nonce)
        ]);

        const msg = new AEADMessage();

        var ALGO = 'aes-256-gcm';

        const cipher = crypto.createCipheriv(ALGO, key, iv, {
            authTagLength: 16
        });

        cipher.setAAD(aeadata, {
            plaintextLength: Buffer(plaintext).length
            // plaintextLength: 8
        });

        let ciphertext = cipher.update(plaintext, 'binary');
        cipher.final();
        const tag = cipher.getAuthTag();


        // final cipher text
        ciphertext = ciphertext.toString('hex') + tag.toString('hex');

        msg.setAEADParams({
            encrypted : hexStringToByteArray(ciphertext),
            aatext    : hexStringToByteArray(aeadata.toString('hex')),
            hmacSize  : 128,                    //128 bits
            iv        : new Buffer([
                ...([0,0,0,0]),
                ...hexStringToByteArray(nonce)
            ]),                     //12 bytes, RFC 5288;  salt and explicit nounce
        });

        return msg.toBytes();
    }

    decryptSymmetricWithAEAData(cipheredText) {

        var key = new Buffer(hexStringToByteArray(this.symmetrciKey));
        var nonce = this.explicit_nounce_sym;
        var salt = this.saltSymmetic;
        var msg = new AEADMessage();
        var slicedMsg = msg.fromBytes(cipheredText);

        const iv = new Buffer([
            ...hexStringToByteArray(salt),
            ...slicedMsg.nonce
        ]);

        var ALGO = 'aes-256-gcm';

        const decipher = crypto.createDecipheriv(ALGO, key, iv, {
            authTagLength: 16
        });

        var dec = decipher.update(new Buffer(slicedMsg.cipherText), 'binary');
        dec = dec.toString('hex');

        // console.log(byteArrayToUtf8(hexStringToByteArray(dec)));

        return dec;
    }

}

export default SymJCEImpl;