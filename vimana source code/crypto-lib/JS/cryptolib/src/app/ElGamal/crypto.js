var myPrivateKeyStr = "";
var myPrivateKeyObj = new Object();
var myPrivateKeyBig = new BigInteger();

var myPublicKeyStr = "";
var myPublicKeyObj = new Object();
var myPublicKeyBig = new BigInteger();

var myHashcodeStr = sha256_digest("sum.im");
var mySignature = "";


var rng;
var c; 
var EcCryptoCtx;

function do_init()
{
	rng = new SecureRandom();
	c = getSECCurveByName( "secp256r1" );
	EcCryptoCtx = new ECAsymCrypto ( c, rng );
}

function generateKeys(login, token, passphrase, setOnServer){
	var myPrivateKeyHex = sha256_digest(login+token+passphrase);
	//console.log(myPrivateKeyHex)
	myPrivateKeyObj.type = "pri";
	myPrivateKeyObj.val = myPrivateKeyHex;
	myPrivateKeyStr = JSON.stringify(myPrivateKeyObj);
	myPrivateKeyBig = PrivFromJsonHex(myPrivateKeyStr);
	EcCryptoCtx.SetPrivate(myPrivateKeyBig);
	EcCryptoCtx.CalculatePublic();

	myPublicKeyStr = EcCryptoCtx.GetPublicHex();
	myPublicKeyBig = EcCryptoCtx.GetPublic();
	myPublicKeyObj = JSON.parse(myPublicKeyStr);
	if(!setOnServer){
		ecdsaSign();
	} else {
		sendPublic();
	}
	return;
}

var encryptedCurrentAccount = false;

function enableEncryption(){
	if(typeof(publicKeys[currentAccount]) != "undefined"){
		alert("encryption enabled");
		encryptedCurrentAccount = true;
		//
		$('#encryptedFlag').css("background-color", "green");
		//
	} else {
		alert("user has not key");
	}
}

function sendPublic(){
	wsAuth.send("setpublickey"+sep+login+sep+session+sep+myPublicKeyStr);
	return;
}

function ecdsaSign(){
	mySignature = EcCryptoCtx.GenerateSignatureParametric(myHashcodeStr, myPrivateKeyStr);
	wsAuth.send("ecdsa"+sep+login+sep+session+sep+mySignature);
	return;
}

function set_temp_pub()
{
    var tempPubJson = "{\"type\":\"pub\",\"x\":\"74a1966d57ff58be8f8a967e2f4edfffcba494469aedcb622db60ef1d4d64773\",\"y\":\"9a446ab2d22c89ffdff9781b7c202eec4dfbbdf4469d190afafd196cd92c341c\"}";
    EcCryptoCtx.SetPublicHex(tempPubJson);
    document.ecdhtest.Pub_json.value = tempPubJson; 

    var pub = EcCryptoCtx.GetPublic();
    document.ecdhtest.Pub_x.value = pub.getX().toBigInteger().toString(16);
    document.ecdhtest.Pub_y.value = pub.getY().toBigInteger().toString(16);
}

function encryptAESKey(message, publickey, destination)
{
	var key = AES.CBC.Utils.convertToHex(AES.CBC.Utils.byteArray2String(getRandomBytes(32)));
	console.log(key);
	var iv = AES.CBC.Utils.convertToHex(AES.CBC.Utils.byteArray2String(getRandomBytes(16)));
	console.log(iv);
	var EcCryptoCtxTemp = new ECAsymCrypto(c, rng);
	EcCryptoCtxTemp.SetPublicHex(publickey);
	var plainkey = new BigInteger();
	plainkey.fromRadix(key, 16);
	EcCryptoCtxTemp.SetPlainText(plainkey);
    EcCryptoCtxTemp.Encrypt();
	
    var m1 = EcCryptoCtxTemp.GetCipherTextM1(); 
    var m2 = EcCryptoCtxTemp.GetCipherTextM2();
	var encrypted = new Object();
	encrypted.m1x = m1.getX().toBigInteger().toString(16);
	encrypted.m1y = m1.getY().toBigInteger().toString(16);
    encrypted.m2 = m2.toString(16);
	encrypted.message = AESEncode(key, iv, message);
	console.log(encrypted.message);
	encrypted.iv = iv;
	if(destination){
		encrypted.destination = login;
	} else {
		encrypted.destination = currentAccount;
	}
    var encryptedStr = JSON.stringify(encrypted);
	delete EcCryptoCtxTemp;
	return encryptedStr;
}

function decryptAESKey(message, privatekey){
	var EcCryptoCtxTemp = new ECAsymCrypto(c, rng);
	privatekeyBig = PrivFromJsonHex(privatekey);
	EcCryptoCtxTemp.SetCipherTextHex(message);
	EcCryptoCtxTemp.SetPrivate(privatekeyBig);
	var parsedMessage = JSON.parse(message);
    EcCryptoCtxTemp.Decrypt();
	var aeskey = EcCryptoCtxTemp.GetRestoredText().toString(16);
	console.log(aeskey);
	console.log(parsedMessage.iv);
	console.log(parsedMessage.message);
	var decryptedStr = AESDecode(aeskey, parsedMessage.iv, parsedMessage.message);
	console.log(decryptedStr);
	delete EcCryptoCtxTemp;
	return decryptedStr;
}

function AESEncode(key, iv, plain){
	var bits = 256;
	var aes = new AES.CBC();
	var result = '';
	var params = {nBits:bits};
	
	if(plain.length>0){
		//result = aes.encryptText(plain, password, params);
		aes.initByValues(plain, key, iv, params)
		result = aes.encrypt();
		result = AES.CBC.Utils.fragment(result, 64);
	}
	
	return result;
}

function AESDecode(key, iv, crypted){
	var bits = 256;
	var aes = new AES.CBC();
	var result = '';
	var params = {nBits:bits};
	
	if(crypted.length > 0){
		aes.initByValues(crypted, key, iv, params);
		result = aes.decrypt();
		var re = new RegExp(String.fromCharCode(10), 'g');
		//result = aes.decryptText(AES.CBC.Utils.stripLineFeeds(crypted), password, params);
	}
	
	return result;
}

do_init();