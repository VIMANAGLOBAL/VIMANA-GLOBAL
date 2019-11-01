package io.vimana.cryptolib.impl;

import io.vimana.cryptolib.vimryptoAsymEcElGamal;
import io.vimana.cryptolib.vimryptoParams;
import io.vimana.cryptolib.dataformat.FBElGamalEncryptedMessage;
import io.vimana.cryptolib.dataformat.FBElGamalKeyPair;
import io.vimana.cryptolib.CryptoNotValidException;

import java.math.BigInteger;
import java.security.InvalidKeyException;
import java.security.KeyPair;
import java.security.PrivateKey;
import java.security.PublicKey;
import java.security.SecureRandom;

import javax.crypto.Cipher;
import org.bouncycastle.asn1.sec.SECNamedCurves;
import org.bouncycastle.asn1.x9.X9ECParameters;
import org.bouncycastle.crypto.AsymmetricCipherKeyPair;

import org.bouncycastle.crypto.generators.ECKeyPairGenerator;
import org.bouncycastle.crypto.params.ECDomainParameters;
import org.bouncycastle.crypto.params.ECKeyGenerationParameters;
import org.bouncycastle.crypto.params.ECPrivateKeyParameters;
import org.bouncycastle.crypto.params.ECPublicKeyParameters;


import org.bouncycastle.jcajce.provider.asymmetric.ec.BCECPrivateKey;
import org.bouncycastle.jce.ECNamedCurveTable;
import org.bouncycastle.jce.spec.ECNamedCurveParameterSpec;

import org.bouncycastle.math.ec.ECCurve;
import org.bouncycastle.math.ec.ECFieldElement;
import org.bouncycastle.math.ec.ECPoint;
// import org.bouncycastle.math.ec.ECPoint;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import sun.security.ec.ECPublicKeyImpl;

/**
 *
 * @author nemez
 */
public class AsymJCEElGamalImpl  implements vimryptoAsymEcElGamal {
        
    private Logger log = LoggerFactory.getLogger(AsymJCEImpl.class);

    SecureRandom random = new SecureRandom();

    Cipher blockCipherAsym;

    PrivateKey privateKey;
    PublicKey ourPublicKey;
    PublicKey theirPublicKey;
    
    KeyPair ourKeyPair;
      
    vimryptoParams params;
    
    ECDomainParameters eCDomainParameters;
    ECCurve.Fp curve;
    
    ECPublicKeyParameters _theirPublicKey;
    ECPublicKeyParameters _ourPublicKey;
    ECPrivateKeyParameters _privateKey;
    
    public ECCurve.Fp getCurve() {
        return curve;
    }
    
    public ECPoint.Fp extrapolateECPoint(BigInteger x, BigInteger y) {
        
        ECFieldElement.Fp __x = (ECFieldElement.Fp) curve.fromBigInteger(x);//  new ECFieldElement.Fp( curve.getQ(), cryptogram.getM1().getXCoord().toBigInteger() );
        ECFieldElement.Fp __y = (ECFieldElement.Fp) curve.fromBigInteger(y); // new ECFieldElement.Fp( curve.getQ(), cryptogram.getM1().getXCoord().toBigInteger() );
                
        org.bouncycastle.math.ec.ECPoint.Fp pkz   = new org.bouncycastle.math.ec.ECPoint.Fp( curve,
            __x, 
            __y, 
            false
            );
        return pkz; 
        
    }
    
    
    public ECDomainParameters getECDomainParameters() {
        return eCDomainParameters;
    }

      
    public AsymJCEElGamalImpl(vimryptoParams params) {
        this.params = params;
    }
        
       
    public void setCurveParameters() {
                
        String curveID = params.getDefaultCurve();
               
        ECNamedCurveParameterSpec spec = ECNamedCurveTable.getParameterSpec(curveID);
        ECCurve __curveEntry =   spec.getCurve();
        
        BigInteger fieldSize = __curveEntry.getField().getCharacteristic();
        BigInteger coefA =  __curveEntry.getA().toBigInteger();
        BigInteger coefB =  __curveEntry.getB().toBigInteger();
        BigInteger curveOrder = __curveEntry.getOrder();

        ECCurve.Fp curve = new ECCurve.Fp(
            fieldSize, // q
            coefA,
            coefB
        ); 
        
        this.curve = curve;
        
        ECPoint Gx = spec.getG();

        ECDomainParameters dparams = new ECDomainParameters(
                curve,
                Gx,
                curveOrder);
        this.eCDomainParameters = dparams; 
    }
    
    @Override
    public void setAsymmetricKeys(PublicKey ourPubkey, PrivateKey privKey, PublicKey theirPubKey) throws InvalidKeyException {
        
        System.out.println("priv alg: " + privKey.getAlgorithm());
        System.out.println("priv fmt: " + privKey.getFormat());

        System.out.println("publ alg: " + ourPubkey.getAlgorithm());
        System.out.println("publ fmt: " + privKey.getFormat());

        setCurveParameters();        
        setPrivateKey(privKey);
        setMyPublicKey(ourPubkey);        
        setHisPublicKey(theirPubKey);
                        
    }
    
    
    public void setAsymmetricKeysBC(ECPublicKeyParameters ourPubkey, ECPrivateKeyParameters privKey, ECPublicKeyParameters theirPubKey) throws InvalidKeyException {

        setCurveParameters();        
        setPrivateKeyBC(privKey);
        setMyPublicKeyBC(ourPubkey);        
        setHisPublicKeyBC(theirPubKey);
                        
    }
    
    
    
    public void doInternalTesting() {
        setCurveParameters();     
        
        BigInteger rx = new BigInteger(eCDomainParameters.getN().bitLength() - 1, new SecureRandom());
        // doTest(priKey, pRandom, rand);
        System.out.println("rx: " + rx.toString());
        FBElGamalEncryptedMessage cryptogram = asymEncryptInternal(_ourPublicKey, rx ); 

        System.out.println("M1.X: " + cryptogram.getM1().getRawXCoord().toBigInteger().toString(16));
        System.out.println("M1.Y: " + cryptogram.getM1().getRawYCoord().toBigInteger().toString(16));
        System.out.println("M2. : " + cryptogram.getM2().toString(16));
 
        BigInteger restored = asymDecryptInternal(_privateKey, cryptogram);
                
        System.out.println("restored : " + restored.toString());
        
        if (restored.equals(rx)) {
            System.out.println("Test passed successfully");
        } else {
            System.err.println("Error: ElGamal Encryption scheme is not valid!");
        }
        
    }
    
    
    
    private BigInteger asymDecryptCoreRoutine( BigInteger priKey, FBElGamalEncryptedMessage cryptogram ) {
        ECPoint M1 = cryptogram.getM1();
        BigInteger M2 = cryptogram.getM2();
        BigInteger n = eCDomainParameters.getN(); // priKey.getParameters().getN();
        ECPoint CT = M1.multiply( priKey ).normalize();
        BigInteger _c = CT.getRawXCoord().toBigInteger();
        BigInteger _c_inv = _c.modInverse( n );
        BigInteger restoredText = M2.multiply(_c_inv).mod(n);
        return restoredText;
    }
    
    
    private BigInteger asymDecryptInternal( ECPrivateKeyParameters priKey, FBElGamalEncryptedMessage cryptogram ) {
        return asymDecryptCoreRoutine(priKey.getD(), cryptogram);
    }
    
    private BigInteger asymDecryptInternal( BigInteger priKey, FBElGamalEncryptedMessage cryptogram ) {
        return asymDecryptCoreRoutine(priKey, cryptogram);
    }
    
    

    void setPrivateKeyBC(ECPrivateKeyParameters privKey) {
        this._privateKey = privKey;
    }

    
    void setPrivateKey(PrivateKey privKey) {
        
        this.privateKey = privKey;
        BCECPrivateKey prikey = (BCECPrivateKey)this.privateKey;
                
        ECPrivateKeyParameters priKey = new ECPrivateKeyParameters(
             prikey.getD(),   
             this.eCDomainParameters);        
        this._privateKey = priKey;

    }
    
    void setMyPublicKeyBC(ECPublicKeyParameters myPublicKey) {
        this._ourPublicKey = myPublicKey;
    }
    
    void setMyPublicKey(PublicKey myPublicKey) {
                this.ourPublicKey = myPublicKey;

        ECPublicKeyImpl pkx = (ECPublicKeyImpl)this.ourPublicKey;
                
        java.security.spec.ECPoint ppub = pkx.getW();  
        
        BigInteger X = ppub.getAffineX();
        BigInteger Y = ppub.getAffineY();
                
        ECFieldElement.Fp __x = new ECFieldElement.Fp( curve.getQ(), X );
        ECFieldElement.Fp __y = new ECFieldElement.Fp( curve.getQ(), Y );
                
        ECPoint.Fp pkz   = new ECPoint.Fp( curve,
                __x, 
                __y, 
                false
        );

        ECPublicKeyParameters pubKey = new ECPublicKeyParameters(
                    pkz,
                    this.eCDomainParameters);
        
        this._ourPublicKey = pubKey;
    } 
    
    void setHisPublicKeyBC(ECPublicKeyParameters hisPublicKey) {
        this._theirPublicKey = hisPublicKey;
    }
    
    void setHisPublicKey(PublicKey hisPublicKey) {
                
        this.theirPublicKey = hisPublicKey;

        ECPublicKeyImpl pkx = (ECPublicKeyImpl)this.theirPublicKey;
                
        java.security.spec.ECPoint ppub = pkx.getW();  
        
        BigInteger X = ppub.getAffineX();
        BigInteger Y = ppub.getAffineY();
                
        ECFieldElement.Fp __x = new ECFieldElement.Fp( curve.getQ(), X );
        ECFieldElement.Fp __y = new ECFieldElement.Fp( curve.getQ(), Y );
                
        ECPoint.Fp pkz   = new ECPoint.Fp( curve,
                __x, 
                __y, 
                false
        );

        ECPublicKeyParameters pubKey = new ECPublicKeyParameters(
                    pkz,
                    this.eCDomainParameters);
        
        this._theirPublicKey = pubKey;
    } 
       
    
    private FBElGamalEncryptedMessage asymEncryptInternalCore( ECPublicKeyParameters pubKey, BigInteger value ) {
        
        BigInteger k = new BigInteger("0"), 
                ZERO=new BigInteger("0"),
                ONE=new BigInteger("1");

        SecureRandom rx = new SecureRandom();
        ECPoint Base = pubKey.getParameters().getG();
        
        BigInteger n = pubKey.getParameters().getN();
        
        do {
            BigInteger Modulus = n;
            k = new BigInteger(521, rx);
            k = k.mod(Modulus);
        } while ((k.compareTo(ZERO) == 0) || (k.compareTo(ONE) == 0));

        // System.out.println("K: " + k.toString(16) );
        
        ECPoint.Fp CB = (ECPoint.Fp)Base.multiply(k).normalize();
        
        ECPoint publicKey = pubKey.getQ().normalize();
        ECPoint CS = publicKey.multiply(k).normalize();
        BigInteger cx = CS.getRawXCoord().toBigInteger();// x();
        ECPoint.Fp M1 = CB;
        BigInteger M2 = value.multiply(cx).mod(n);
        
        FBElGamalEncryptedMessage encryptedMessage = new FBElGamalEncryptedMessage();
        
        encryptedMessage.setM1(M1);
        encryptedMessage.setM2(M2);
        
        return encryptedMessage;         
        
    }
    
    private FBElGamalEncryptedMessage asymEncryptInternal( ECPublicKeyParameters pubKey, BigInteger value)
    {
        return asymEncryptInternalCore(pubKey,value);
    }
    
    private FBElGamalEncryptedMessage asymEncryptInternal( BigInteger pubKeyX, BigInteger pubKeyY, BigInteger value)
    {                        
   
        ECFieldElement.Fp __x = new ECFieldElement.Fp( curve.getQ(), pubKeyX );
        ECFieldElement.Fp __y = new ECFieldElement.Fp( curve.getQ(), pubKeyY );
                
        ECPoint.Fp pkz   = new ECPoint.Fp( curve,
                __x, 
                __y, 
                false
        );

        ECPublicKeyParameters pubKey = new ECPublicKeyParameters(
                    pkz,
                    this.eCDomainParameters);
        
        return asymEncryptInternalCore(pubKey,value);
    }
    


    @Override
    public void setOurKeyPair(KeyPair keyPair) {
        this.ourKeyPair = keyPair;
        setMyPublicKey(keyPair.getPublic());
        setMyPublicKey(keyPair.getPublic());
    }

    @Override
    public void setTheirPublicKey(PublicKey theirPublicKey) {
        setHisPublicKey(theirPublicKey);
    }

    @Override
    public byte[] encryptAsymmetric(byte[] plain) throws CryptoNotValidException {
        throw new UnsupportedOperationException("Not supported yet."); //To change body of generated methods, choose Tools | Templates.
        
    }

    @Override
    public byte[] decryptAsymmetric(byte[] ciphered) throws CryptoNotValidException {
        throw new UnsupportedOperationException("Not supported yet."); //To change body of generated methods, choose Tools | Templates.
    
    }

    @Override
    public BigInteger decryptAsymmetric(BigInteger priKey, FBElGamalEncryptedMessage cryptogram) throws CryptoNotValidException {
        return asymDecryptInternal(priKey, cryptogram);
    }

    @Override
    public FBElGamalEncryptedMessage encryptAsymmetric(BigInteger publicKeyX, BigInteger publicKeyY, BigInteger plainText) throws CryptoNotValidException {
        return asymEncryptInternal(publicKeyX, publicKeyY, plainText);
    }

    @Override
    public FBElGamalKeyPair generateOwnKeys() throws CryptoNotValidException {

        X9ECParameters xparams = SECNamedCurves.getByName("secp521r1");
        ECKeyPairGenerator kpGen = new ECKeyPairGenerator();

        kpGen.init(new ECKeyGenerationParameters(eCDomainParameters, new SecureRandom()));

        AsymmetricCipherKeyPair myKeyPair; 

        myKeyPair = kpGen.generateKeyPair();
    
        _privateKey = (ECPrivateKeyParameters) myKeyPair.getPrivate(); 
        _ourPublicKey = (ECPublicKeyParameters) myKeyPair.getPublic();
        
        FBElGamalKeyPair rx = new FBElGamalKeyPair();
        rx.setPrivateKey( _privateKey.getD() );
        rx.setPublicKey( _ourPublicKey.getQ() );

        return rx; 
        
    }

    @Override
    public BigInteger getPublicKeyX() {
        return this._ourPublicKey.getQ().getAffineXCoord().toBigInteger();

    }

    @Override
    public BigInteger getPublicKeyY() {
        return this._ourPublicKey.getQ().getAffineYCoord().toBigInteger();
    }

    @Override
    public BigInteger getPrivateKey() {
        return this._privateKey.getD();
    }
    
}
