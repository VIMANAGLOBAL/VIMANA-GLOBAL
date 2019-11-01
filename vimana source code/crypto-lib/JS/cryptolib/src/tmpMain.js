
const fs = require('fs');

const pkijs = require('pkijs');
const asn1js = require('asn1js');

const WebCrypto = require("node-webcrypto-ossl");
const webcrypto = new WebCrypto();
    
const CertificateData = require('./app/dataformat/CertificateData');

let certificateBuffer = new ArrayBuffer(0); 
let privateKeyBuffer = new ArrayBuffer(0);


let publicKey;
let privateKey;

const CryptoEngine = pkijs.CryptoEngine;
pkijs.setEngine("newEngine", webcrypto, new CryptoEngine({ name: "", crypto: webcrypto, subtle: webcrypto.subtle }));


function createCertificateInternal( cd ) {
    
    // const CertificateData = csm.CertificateData;
    
    //var cd = new CertificateData();
    
   //  const certificateData = new CertifcateData;
    
//    const certificateVersion = csm.CertificateData.getVersion();
   
    

              
    const certificateVersion =  cd.certificateVersion;
    const issuerCommonName = cd.issuerCommonName;
    const certificateSerial = cd.certificateSerial;    
    const subjectCommonName = cd.subjectCommonName;
    const countryName = cd.countryName; 
    const businessCategory = cd.businessCategory;
    const dnQualifier = cd.dnQualifier;
    const UID =  cd.UID;
    const organizationalUnitName = cd.organizationalUnitName;
    const ortanizationName = cd.ortanizationName;
    
    //region Initial variables
    let sequence = Promise.resolve();

    const certificate = new pkijs.Certificate();
    const AttributeTypeAndValue = pkijs.AttributeTypeAndValue;
    const getAlgorithmParameters = pkijs.getAlgorithmParameters;

    //endregion

    //region Get a "crypto" extension
    const crypto = pkijs.getCrypto();
    if (typeof crypto === "undefined") {
        console.log("undefined crypto");
		return Promise.reject("No WebCrypto extension found");
    }
	//endregion

	//region Put a static values 
	certificate.version = certificateVersion;

	certificate.serialNumber = new asn1js.Integer({ value: certificateSerial });

        // issuer...
	certificate.issuer.typesAndValues.push(new AttributeTypeAndValue({
		type: "2.5.4.6", // Country name
		value: new asn1js.PrintableString({ value: countryName })
	}));

	certificate.issuer.typesAndValues.push(new AttributeTypeAndValue({
		type: "2.5.4.3", // Common name
		value: new asn1js.BmpString({ value: issuerCommonName })
	}));
        
        // subject
	certificate.subject.typesAndValues.push(new AttributeTypeAndValue({
		type: "2.5.4.6", // Country name
		value: new asn1js.PrintableString({ value: countryName })
	}));
	certificate.subject.typesAndValues.push(new AttributeTypeAndValue({
		type: "2.5.4.3", // Common name
		value: new asn1js.BmpString({ value: subjectCommonName })
	}));
        
	certificate.subject.typesAndValues.push(new AttributeTypeAndValue({
		type: "2.5.4.15", // Business category
		value: new asn1js.BmpString({ value: businessCategory })
	}));
        
        certificate.subject.typesAndValues.push(new AttributeTypeAndValue({
		type: "2.5.4.46", // Business category
		value: new asn1js.BmpString({ value: dnQualifier })
	}));
        
        certificate.subject.typesAndValues.push(new AttributeTypeAndValue({
		type: "0.9.2342.19200300.100.1.1", // Business category
		value: new asn1js.BmpString({ value: UID })
	}));
        
        certificate.subject.typesAndValues.push(new AttributeTypeAndValue({
		type: "2.5.4.11", // Business category
		value: new asn1js.BmpString({ value: organizationalUnitName})
	}));
        
        certificate.subject.typesAndValues.push(new AttributeTypeAndValue({
		type: "2.5.4.10", // Business category
		value: new asn1js.BmpString({ value: ortanizationName})
	}));

	certificate.notBefore.value = new Date(2016, 1, 1);
	certificate.notAfter.value = new Date(2021, 1, 1);

	certificate.extensions = []; // Extensions are not a part of certificate by default, it's an optional array
        // endregion

	//region "BasicConstraints" extension
	const basicConstr = new pkijs.BasicConstraints({
		cA: true,
		pathLenConstraint: 3
	});
	
	certificate.extensions.push(new pkijs.Extension({
		extnID: "2.5.29.19",
		critical: true,
		extnValue: basicConstr.toSchema().toBER(false),
		parsedValue: basicConstr // Parsed value for well-known extensions
	}));
	//endregion 
	
	//region "KeyUsage" extension 
	const bitArray = new ArrayBuffer(1);
	const bitView = new Uint8Array(bitArray);
	
	bitView[0] |= 0x02; // Key usage "cRLSign" flag
	bitView[0] |= 0x04; // Key usage "keyCertSign" flag
	
	const keyUsage = new asn1js.BitString({ valueHex: bitArray });
	
	certificate.extensions.push(new pkijs.Extension({
		extnID: "2.5.29.15",
		critical: false,
		extnValue: keyUsage.toBER(false),
		parsedValue: keyUsage // Parsed value for well-known extensions
	}));
	//endregion

	//region "ExtendedKeyUsage" extension
	const extKeyUsage = new pkijs.ExtKeyUsage({
		keyPurposes: [
			"2.5.29.37.0",       // anyExtendedKeyUsage
			"1.3.6.1.5.5.7.3.1", // id-kp-serverAuth
			"1.3.6.1.5.5.7.3.2", // id-kp-clientAuth
			"1.3.6.1.5.5.7.3.3", // id-kp-codeSigning
			"1.3.6.1.5.5.7.3.4", // id-kp-emailProtection
			"1.3.6.1.5.5.7.3.8", // id-kp-timeStamping
			"1.3.6.1.5.5.7.3.9", // id-kp-OCSPSigning
			"1.3.6.1.4.1.311.10.3.1", // Microsoft Certificate Trust List signing
			"1.3.6.1.4.1.311.10.3.4"  // Microsoft Encrypted File System
		]
	});
	
	certificate.extensions.push(new pkijs.Extension({
		extnID: "2.5.29.37",
		critical: false,
		extnValue: extKeyUsage.toSchema().toBER(false),
		parsedValue: extKeyUsage // Parsed value for well-known extensions
	}));
	//endregion
        
        console.log("before keygen");
        //region Create a new key pair
	sequence = sequence.then(() =>
	{
        //region Get default algorithm parameters for key generation
       const algorithm = getAlgorithmParameters("ECDSA", "generatekey");
       if("hash" in algorithm.algorithm)
        algorithm.algorithm.hash.name = "SHA-512";
       algorithm.algorithm.namedCurve = "P-521";
       //endregion
       return crypto.generateKey( algorithm.algorithm, true, algorithm.usages);
	});
	//endregion

	//region Store new key in an interim variables
	sequence = sequence.then(keyPair =>
	{
        //region keypair assingation
                 console.log("assign keypair");
		publicKey = keyPair.publicKey;
		privateKey = keyPair.privateKey;
		//endregion
	}, error => Promise.reject(`Error during key generation: ${error}`));
	//endregion

	//region Exporting public key into "subjectPublicKeyInfo" value of certificate 
	sequence = sequence.then(() => {
	    //region ipubkey
	    console.log("import pubkey");
	    certificate.subjectPublicKeyInfo.importKey(publicKey);
	    //endregion
        },error => Promise.reject(`Error during exporting public key: ${error}`));
	//endregion

        //region Signing final certificate 
        sequence = sequence.then(() => 
                certificate.sign(privateKey, "SHA-512")
            ,error => Promise.reject(`Error during exporting public key: ${error}`));
        //endregion 
        
        sequence = sequence.then(() =>       
            certificateBuffer = certificate.toSchema(true).toBER(false)
        , error => Promise.reject(`Error during signing: ${error}`));
        //endregion 

        //region Exporting private key 
        sequence = sequence.then(() => 
                crypto.exportKey("pkcs8", privateKey)
            );
        
        sequence = sequence.then((result) => 
            privateKeyBuffer = result
        , error => Promise.reject(`Error during exporting of private key: ${error}`));

    Promise.resolve();

    return sequence;
}
//*********************************************************************************
function formatPEM(pemString)
{
	/// <summary>Format string in order to have each line with length equal to 63</summary>
	/// <param name="pemString" type="String">String to format</param>
	
	const stringLength = pemString.length;
	let resultString = "";
	
	for(let i = 0, count = 0; i < stringLength; i++, count++)
	{
		if(count > 63)
		{
			resultString = `${resultString}\r\n`;
			count = 0;
		}
		
		resultString = `${resultString}${pemString[i]}`;
	}
	
	return resultString;
}

function createCertificate()
{
    console.log("==== create Certificate =====");
    
    var cd = new CertificateData();

    createCertificateInternal(cd).then( () =>
	{
        console.log("create certificate success");
//        console.log(Cert);
        

	    const certificateString = String.fromCharCode.apply(null, new Uint8Array(certificateBuffer));

		let resultString = "-----BEGIN CERTIFICATE-----\r\n";
		resultString = `${resultString}${formatPEM(btoa(certificateString))}`;
		resultString = `${resultString}\r\n-----END CERTIFICATE-----\r\n`;

		const privateKeyString = String.fromCharCode.apply(null, new Uint8Array(privateKeyBuffer));

		resultString = `${resultString}\r\n-----BEGIN PRIVATE KEY-----\r\n`;
		resultString = `${resultString}${formatPEM(btoa(privateKeyString))}`;
		resultString = `${resultString}\r\n-----END PRIVATE KEY-----\r\n`;

        console.log(resultString);

        console.log("Private key exported successfully!");

    }, error =>
    {
        console.log("create certificate error");
        if(error instanceof Object)
        console.error(error.message);
    else
        console.error(error);
    });

};




console.log('cert creation start', 'info', 'pending...');
createCertificate();
console.log('cert reading end', 'info', 'OK');
