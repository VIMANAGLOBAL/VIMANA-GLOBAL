//'use strict'

require('ts-node/register');
//const fs = require('fs');
//

const { Certificate, PrivateKey } = require('@fidm/x509');
import {byteArrayToHexString, utf8ToByteArray, hexStringToByteArray, stringToHexString, byteArrayToUtf8} from 'bytey';


export default class  OurKeyReader  {
        
    constructor() {
        
    }
    
    // public PublicKey extractPublicKeyFromX509(X509Certificate c)
    extractPublicKeyFromX509( CertInPem ) {
        console.log('extractPublicKeyFromX509 placeholder');        
    }
    
    
    // public PrivateKey readPrivateKeyPEM(InputStream input)
    readPrivateKeyPEM() {
        console.log('readPrivateKeyPEM placeholder');
    }
    
    // public  PrivateKey readEncryptedPrivateKeyPEM(InputStream input, String password)
    readEncryptedPrivateKeyPEM() {
        console.log('readEncryptedPrivateKeyPEM placeholder');
    }
    
    // public  PrivateKey readPrivateKeyPKCS8(InputStream input)
    readPrivateKeyPKCS8() {
        console.log('readPrivateKeyPKCS8 placeholder');
    }
    
    // public  PrivateKey readPrivateKeyPKCS12(String PKCS12filePath, String password, String keyPassword, String alias)
    readPrivateKeyPKCS12() {
        console.log('readPrivateKeyPKCS12 placeholder');
    }
    
    // public PublicKey readPublicKeyPKCS12(String PKCS12filePath, String password, String alias)
    readPublicKeyPKCS12() {
        console.log('readPublicKeyPKCS12 placeholder');
    }
    
    
    // KeyPair readPKCS12File(String path, String password, String alias)
    readPKCS12File() {
        console.log('readPKCS12File placeholder');
    }
    
    // public static X509Certificate getCertFromPKCS12File(String path, String password, String alias)
    getCertFromPKCS12File() {
        console.log('getCertFromPKCS12File placeholder');
    }
    
    // public  X509Certificate readX509CertPEMorDER(InputStream is)
    readX509CertPEMorDER() {
         console.log('readX509CertPEMorDER placeholder');
    } 
 
    // public  PrivateKey deserializePrivateKey(byte[] keyBytes)
    deserializePrivateKey( keyData ) {
        console.log('deserializePrivateKey');
        const processedPrivateKey = PrivateKey.fromPEM( keyData ); 
        return processedPrivateKey;
    } 

    // public PublicKey deserializePublicKey(byte[] keyBytes)    
    deserializePublicKey( Cert ) {       
        console.log('deserializePublicKey');        
        const processedCertRaw = Certificate.fromPEM( Cert );            
        return processedCertRaw;
    }
    
    
    figureOutAttribute (cert, oid, fieldname ) {        
        const attributes = cert.subject.attributes;
        // console.log(attributes);
        var returnValue ='';        
        attributes.forEach(function (arrayItem) {
            if ( arrayItem.oid == oid && fieldname == arrayItem.name ) {
                returnValue = arrayItem.value;
            }
        });
        return returnValue;
    }

};


