import KeyGenerator from "../../src/app/KeyGenerator"
import assert from 'assert'
import {
    SALT
} from '../../src/app/vimryptoParams';
import crypto from 'crypto';
import log from '../../lgo-config'
import SymJCEImpl from '../../src/app/impl/SymJCEImpl';
import baUtil from 'byte-array-util';

import {hexStringToByteArray, utf8ToByteArray, byteArrayToHexString} from 'bytey'

import testData     from '../../testdata/EncryptSymmetric';
import testDataAEAD from '../../testdata/EncryptSymmetricWithAEAData';

const fs = require('fs')

const { Certificate, PrivateKey } = require('@fidm/x509');


//mport {byteArrayToHexString, utf8ToByteArray, hexStringToByteArray, stringToHexString, byteArrayToUtf8} from 'bytey';



// import Certificate from "/home/nemez/soft/PKIjs/src/Certificate";

describe("encryptSymmetricTest", () => {
    it("works", () => {

        log('encryptSymmetricTest','info','pending...');

        let plain_text     = testData.plainTextBytes;
        let key            = testData.key;
        let salt           = testData.salt; //iv=salt+nounce 12 bytes
        let explicitNounce = testData.nonce;

        const instance1 = new SymJCEImpl();
        instance1.setSymmetricKey(key);
        instance1.setSymmetricSalt(salt);
        instance1.setSymmetricNounce(explicitNounce);

        const encrypted = instance1.encryptSymmetric(plain_text);

        log('encryptSymmetricTest','info','OK');

        const secretPhrase = '1234567890 and or 0987654321';

        const pair = KeyGenerator.deriveFromPasssPhrase(secretPhrase, SALT);

        assert.equal(testData.encrypted,encrypted);

    })
});

describe("decryptSymmetricTest", () => {
    it("works", () => {

        log('decryptSymmetricTest','info','pending...');

        let cipherText = testData.encrypted;

        const decryptingInstance = new SymJCEImpl();
        decryptingInstance.setSymmetricKey(testData.key);
        decryptingInstance.setSymmetricSalt(testData.salt);

        const plainText = decryptingInstance.decryptSymmetric(cipherText);

        log('decryptSymmetricTest','info','OK');

        assert.equal(testData.plainTextBytes,plainText);

    })
});

describe("encryptSymmetricWithAEAData", () => {
    it("work", () => {

        log('encryptSymmetricWithAEAData', 'info', 'pending...');

        var plain_text = testDataAEAD.plain_text;

        var key   = testDataAEAD.key;
        var salt  = testDataAEAD.salt;
        var nonce = testDataAEAD.nonce;

        const instance1 = new SymJCEImpl();

        instance1.setSymmetricKey(key);
        instance1.setSymmetricSalt(salt);
        instance1.setSymmetricNounce(nonce);

        var adata = testDataAEAD.aead;

        // <msg> = hexstring
        var msg = instance1.encryptSymmetricWithAEAData(plain_text, adata);

        assert.equal(testDataAEAD.encrypted,msg);

        log('encryptSymmetricWithAEAData', 'info', 'OK');

    })
});

describe("decryptSymmetricWithAEAData", () => {
    it("work", () => {

        log('decryptSymmetricWithAEAData', 'info', 'pending...');

        var plain_text_hex = byteArrayToHexString(utf8ToByteArray(testDataAEAD.plain_text));

        var key   = testDataAEAD.key;
        var salt  = testDataAEAD.salt;
        var nonce = testDataAEAD.nonce;
        var encrypted = testDataAEAD.encrypted;

        const instance2 = new SymJCEImpl();

        instance2.setSymmetricKey(key);
        instance2.setSymmetricSalt(salt);

        // <msg> = hexstring
        var msg = instance2.decryptSymmetricWithAEAData(hexStringToByteArray(encrypted));

        assert.equal(msg, testDataAEAD.plain_text_hex);

        log('decryptSymmetricWithAEAData', 'info', 'OK');

    })
});

      
import OurKeyReader from "../../src/app/impl/KeyReaderImpl"
import EC from 'elliptic';


describe("testSomeoRoutines", () => {
    it("work", () => {
        
      var file = fs.readFileSync(__dirname + '/../../../testdata/cert2018/test1_cert1.pem');   
            
      console.log('------------ DESERIALISE PUBLIC TEST --------------------');       
            
      const x = new OurKeyReader;
      var publicCert = x.deserializePublicKey( file ); //fs.readFileSync('/home/nemez/soft/x509/example/al_cn_ua.pem') );
      console.log("serial: %s", publicCert.serialNumber);
      
      var publicKey = publicCert.publicKey;
      
      console.log("Public Key: %s", publicKey.algo);      
      console.log(publicKey);

        
      // deserialising private               
      console.log('------------ DESERIALISE PRIVATE TEST --------------------');       

      var pfile = fs.readFileSync(__dirname + '/../../../testdata/cert2018/test1_pvtkey.pem');              
      var privateKey = x.deserializePrivateKey(pfile);      

      console.log("Private Key: %s", privateKey);      
      console.log(privateKey);
      
      
            
      console.log('-------- PUBLIC / PRIVATE RELATION TEST ------------------');       
      
      const data = Buffer.allocUnsafe(100)
      const signature = privateKey.sign(data, 'sha512')

      console.log("Signature: " );
      console.log(signature)

      console.log( "signature verification: %s", publicCert.publicKey.verify(data, signature, 'sha512')); 
      
      assert.ok(publicCert.publicKey.verify(data, signature, 'sha512') );
        
      console.log('-------------- FIELDS VALIDATION TEST ---------------------');       
  
        
      var toCheckCertFile = fs.readFileSync(__dirname + '/../../../testdata/cert2018/al_cn_ua.pem');
      
      const toCheckCert = x.deserializePublicKey( toCheckCertFile );
      
      console.log("cert toCheck: " );
      console.log(toCheckCert);
      
      const businesCatValue = x.figureOutAttribute(toCheckCert, '2.5.4.15', 'businessCategory');
      
      if (businesCatValue=='') {
        console.error("Business category read error (from cert) ");
      } else {
        console.log("Business category: %s", businesCatValue);
      }
            
      assert.equal( businesCatValue, '00032da0e32e07b61c9f0251fe627a9c');
      
      const businesCatDup = x.figureOutAttribute(toCheckCert, '0.9.2342.19200300.100.1.1', '0.9.2342.19200300.100.1.1');
      
      if (businesCatDup=='') {
        console.error("Business category duplicator read error (from cert) ");
      } else {
        console.log("Business category duplicator: %s", businesCatDup);
      }
            
      assert.equal( businesCatDup, '0002da0e32e07b61c9f0251fe627a9c');

      const commonNameValue = x.figureOutAttribute(toCheckCert, '2.5.4.3', 'commonName');
      
      if (commonNameValue=='') {
        console.error("Common name read error (from cert) ");
      } else {
        console.log("Common name: %s", commonNameValue);
      }
            
      assert.equal( commonNameValue, 'al.cn.ua');

      const organizationNameValue = x.figureOutAttribute(toCheckCert, '2.5.4.10', 'organizationName');
      
      if (commonNameValue=='') {
        console.error("Organization name read error (from cert) ");
      } else {
        console.log("Organization name: %s", organizationNameValue);
      }
            
      assert.equal( organizationNameValue, 'vimana');
     
        
      //region Parsing raw data as a X.509 certificate object
    const asn1 = asn1js.fromBER(buffer);
    const certificate = new Certificate({ schema: asn1.result });
    //endregion  
        
      log('testSomeoRoutines', 'info', 'OK');


    })
});
