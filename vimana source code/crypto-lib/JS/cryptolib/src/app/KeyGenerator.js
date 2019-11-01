import EC from 'elliptic';
import {defaultCurve, SALT} from '../app/vimryptoParams';
import pbkdf2 from 'pbkdf2'

/*
*
* Ported from java KeyGegerator.gnerateKeys()
* @author Hryhorii Chaikovskyi
* <hryhorii.chaikovskyi@gmail.com>
* */

const generateKeys = () => {
    const ecSpec = new EC.ec(defaultCurve);
    let pair;
    try {
        pair = ecSpec.genKeyPair();

        console.log(pair);
        // Generate public key
        let pubPoint = pair.getPublic();
        let x = pubPoint.getX();
        let y = pubPoint.getY();

        let pub = pubPoint.encode('hex');                                 // case 1
            pub = { x: x.toString('hex'), y: y.toString('hex') };         // case 2
            pub = { x: x.toBuffer(), y: y.toBuffer() };                   // case 3
            pub = { x: x.toArrayLike(Buffer), y: y.toArrayLike(Buffer) }; // case 3

        let key = ecSpec.keyFromPublic(pub, 'hex');

        console.log(key);
        console.log(pair.priv);

    } catch (err) {
        console.log(err)
    }

    console.log(pair);
    return pair;
}

const generateKeyswithSecretPhrase = (secretPhrase) => {
    let pair = null;
    let salt = new Int8Array([1,2,3,4,5,6,7,8,9,0])

    const spec = new EC.ec(defaultCurve);

    let g;


    return pair;
}

const deriveFromPasssPhrase = (secretPhrase, salt) => {
    let kf;

  //  kf = pbkdf2(secretPhrase, SALT, 16, 128);
  //  kf = kf.toString('hex');

    return kf;

    // try {
    //
    //
    //     // kf = SecretKeyFactory.getInstance(params.getKeyDerivationFn());
    // } catch (err) {
    //     // log.error("Invalid Key derivation algorythm: " + params.getKeyDerivationFn(), ex);
    //     return null;
    // }
    //
    // const keySpecs = {
    //     secretPhrase: secretPhrase.split(),
    //     salt: salt,
    //     pbkdf2Iterations: pbkdf2Iterations,
    //     keyLength: 1024
    // }
    //
    // let secretKey = null;
    //
    // try {
    //     key = kf.generateSecret(specs);
    // } catch (InvalidKeySpecException ex) {
    //     log.error("Can not generate shared key", ex);
    // }


    // return pair;
}




export default {
    generateKeys,
    generateKeyswithSecretPhrase,
    deriveFromPasssPhrase
};