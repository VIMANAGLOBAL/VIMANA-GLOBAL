AES.CBC = function () {
	this.aescrypt = new aesCrypt();
	this.aes = new AES(this.aescrypt);
	
	this.getOutput = function(){
		return this.aescrypt.getOutput();
	}
	
	this.getAllMessages = function(lnbrk){
		return this.aescrypt.getAllMessages(lnbrk);
	}
	
	this.isError = function(){
		return this.aescrypt.isError();
	}
}

AES.CBC.prototype.init = function(password, options) {
	if(!options) options = {};
	var aescrypt = this.aescrypt;
	aescrypt.setDefaults();
	var pObj = this.aescrypt.getParams();
	for(var o in options)
		pObj[o] = options[o];
	var k_iv = this.createKeyAndIv({password:password, salt: pObj.salt, bits: pObj.nBits});
	pObj.key = k_iv.key;
	pObj.iv = k_iv.iv;
	pObj.dataOut = '';
	aescrypt.setParams(pObj)
	this.aes.init();
}


AES.CBC.prototype.initEncrypt = function(dataIn, password, options) {
	this.init(password,options);//call standard init
	this.aescrypt.setParams({dataIn:dataIn, encryptIn: AES.CBC.Utils.toByteArray(dataIn)})//setting input for encryption
}

AES.CBC.prototype.initDecrypt = function(crypted, password, options){
	if(!options) options = {};
	var aescrypt = this.aescrypt;
	aescrypt.setParams({dataIn:crypted})
	if(!password)
		aescrypt.appendError('AES.CBC.initFromEncryption: Sorry, can not crypt or decrypt without password.\n');
	var ciphertext = AES.CBC.Utils.decodeBase64(crypted);
	if(ciphertext.indexOf('Salted__') != 0)
		aescrypt.appendError('AES.CBC.initFromCrypt: Sorry, unknown encryption method.\n');
	var salt = ciphertext.substr(8,8);
    options.salt = AES.CBC.Utils.convertToHex(salt);
	this.init(password,options);
	ciphertext = ciphertext.substr(16);
	aescrypt.setParams({decryptIn:AES.CBC.Utils.toByteArray(ciphertext)})
}

AES.CBC.prototype.initByValues = function(dataIn, key, iv, options){
    var pObj = {};
    this.init('',options);//empty password, we are setting key, iv manually
    pObj.dataIn = dataIn;
    pObj.key = key
    pObj.iv = iv
    this.aescrypt.setParams(pObj)
}

AES.CBC.prototype.getAllMessages = function(lnbrk){
    return this.aescrypt.getAllMessages(lnbrk);
}

AES.CBC.prototype.createKeyAndIv = function(pObj){
    var aescrypt = this.aescrypt;
    var retObj = {};
    var count = 1;//openssl rounds
    var miter = "3";
    if(!pObj) pObj = {};
    if(!pObj.salt) {
      pObj.salt = aescrypt.getRandomBytes(8);
      pObj.salt = AES.CBC.Utils.convertToHex(AES.CBC.Utils.byteArray2String(pObj.salt));
      aescrypt.setParams({salt: pObj.salt});
    }
    var data00 = pObj.password + AES.CBC.Utils.convertFromHex(pObj.salt);
    var hashtarget = '';
    var result = '';
    var keymaterial = [];
    var loop = 0;
    keymaterial[loop++] = data00;
    for(var j=0; j<miter; j++){
      if(j == 0)
        result = data00;   	//initialize
      else {
        hashtarget = AES.CBC.Utils.convertFromHex(result);
        hashtarget += data00;
        result = hashtarget;
      }
      for(var c=0; c<count; c++){
        result = AES.MD5(result);
      }
      keymaterial[loop++] = result;
    }
    switch(pObj.bits){
      case 128://128 bit
        retObj.key = keymaterial[1];
        retObj.iv = keymaterial[2];
        break;
      case 192://192 bit
        retObj.key = keymaterial[1] + keymaterial[2].substr(0,16);
        retObj.iv = keymaterial[3];
        break;
      case 256://256 bit
        retObj.key = keymaterial[1] + keymaterial[2];
        retObj.iv = keymaterial[3];
        break;
       default:
         aescrypt.appendError('AES.CBC.createKeyAndIv: Sorry, only 128, 192 and 256 bits are supported.\nBits('+typeof(pObj.bits)+') = '+pObj.bits);
    }
    return retObj;
  }

  AES.CBC.prototype.encryptRaw = function(byteArray) {
    var aescrypt = this.aescrypt;
    var aes = this.aes;
    var p = aescrypt.getParams(); //get parameters for operation set by init
    if(!byteArray)
      byteArray = p.encryptIn;
    aescrypt.setParams({encryptIn: byteArray});
    if(!p.dataIn) aescrypt.setParams({dataIn:byteArray});
    var iv = AES.CBC.Utils.convertFromHex(p.iv);
    //PKCS5 paddding
    var charDiv = p.blockSize - ((byteArray.length+1) % p.blockSize);
    if(p.A0_PAD)
      byteArray[byteArray.length] = 10
    for(var c=0;c<charDiv;c++) byteArray[byteArray.length] = charDiv;
    var nBytes = Math.floor(p.nBits/8);  // nr of bytes in key
    var keyBytes = new Array(nBytes);
    var key = AES.CBC.Utils.convertFromHex(p.key);
    for (var i=0; i<nBytes; i++) {
      keyBytes[i] = isNaN(key.charCodeAt(i)) ? 0 : key.charCodeAt(i);
    }
    // generate key schedule
    var keySchedule = aes.expandKey(keyBytes);
    var blockCount = Math.ceil(byteArray.length/p.blockSize);
    var ciphertxt = new Array(blockCount);  // ciphertext as array of strings
    var textBlock = [];
    var state = AES.CBC.Utils.toByteArray(iv);
    for (var b=0; b<blockCount; b++) {
      // XOR last block and next data block, then encrypt that
      textBlock = byteArray.slice(b*p.blockSize, b*p.blockSize+p.blockSize);
      state = aes.xOr_Array(state, textBlock);
      state = aes.encrypt(state.slice(), keySchedule);  // -- encrypt block --
      ciphertxt[b] = AES.CBC.Utils.byteArray2String(state);
    }
    var ciphertext = ciphertxt.join('');
    aescrypt.setParams({dataOut:ciphertext, encryptOut:ciphertext});

    //remove all parameters from enviroment for more security is debug off
    if(!aescrypt.isDebug() && aescrypt.clear) aescrypt.clearParams();
   return ciphertext || '';
  }

 AES.CBC.prototype.encrypt = function(plaintext) {
    var aescrypt = this.aescrypt;
    var salt = '';
    var p = aescrypt.getParams(); //get parameters for operation set by init
    if(!plaintext)
      plaintext = p.dataIn;
    if(p.UTF8)
      plaintext = AES.CBC.Utils.encodeUTF8(plaintext);
    aescrypt.setParams({dataIn:plaintext, encryptIn: AES.CBC.Utils.toByteArray(plaintext)});
    var ciphertext = this.encryptRaw()
    //salt = 'Salted__' + AES.CBC.Utils.convertFromHex(p.salt);
    //ciphertext = salt  + ciphertext;
    ciphertext = AES.CBC.Utils.encodeBase64(ciphertext);  // encode in base64
    aescrypt.setParams({dataOut:ciphertext});
    //remove all parameters from enviroment for more security is debug off
    if(!aescrypt.isDebug() && aescrypt.clear) aescrypt.clearParams();

    return ciphertext || '';
  }

  AES.CBC.prototype.encryptText = function(dataIn,password,options) {
   this.initEncrypt(dataIn, password, options);
   return this.encrypt();
  }

AES.CBC.prototype.decryptRaw = function(byteArray) {
    var aes = this.aes;
    var aescrypt = this.aescrypt;
    var p = aescrypt.getParams(); //get parameters for operation set by init
    if(!byteArray)
      byteArray = p.decryptIn;
    aescrypt.setParams({decryptIn: byteArray});
    if(!p.dataIn) aescrypt.setParams({dataIn:byteArray});
    if((p.iv.length/2)<p.blockSize)
      console.log('AES.CBC.decrypt: Sorry, can not decrypt without complete set of parameters.\n Length of key,iv:'+p.key.length+','+p.iv.length);
    var iv = AES.CBC.Utils.convertFromHex(p.iv);
    if(byteArray.length%p.blockSize != 0)
      console.log('AES.CBC.decrypt: Sorry, the encrypted text has the wrong length for aes-cbc mode\n Length of ciphertext:'+byteArray.length+byteArray.length%p.blockSize);
    var nBytes = Math.floor(p.nBits/8);  // nr of bytes in key
    var keyBytes = new Array(nBytes);
    var key = AES.CBC.Utils.convertFromHex(p.key);
    for (var i=0; i<nBytes; i++) {
      keyBytes[i] = isNaN(key.charCodeAt(i)) ? 0 : key.charCodeAt(i);
    }
    // generate key schedule
    var keySchedule = aes.expandKey(keyBytes);
    // separate byteArray into blocks
    var nBlocks = Math.ceil((byteArray.length) / p.blockSize);
    // plaintext will get generated block-by-block into array of block-length strings
    var plaintxt = new Array(nBlocks.length);
    var state = AES.CBC.Utils.toByteArray(iv);
    var ciphertextBlock = [];
    var dec_state = [];
    for (var b=0; b<nBlocks; b++) {
      ciphertextBlock = byteArray.slice(b*p.blockSize, b*p.blockSize+p.blockSize);
      dec_state = aes.decrypt(ciphertextBlock, keySchedule);  // decrypt ciphertext block
      plaintxt[b] = AES.CBC.Utils.byteArray2String(aes.xOr_Array(state, dec_state));
      state = ciphertextBlock.slice(); //save old ciphertext for next round
    }
    
    // join array of blocks into single plaintext string and return it
    var plaintext = plaintxt.join('');
    if(aescrypt.isDebug()) aescrypt.appendDebug('Padding after decryption:'+ AES.CBC.Utils.convertToHex(plaintext) + ':' + plaintext.length + '\n');
    var endByte = plaintext.charCodeAt(plaintext.length-1);
    //remove oppenssl A0 padding eg. 0A05050505
    if(p.A0_PAD){
        plaintext = plaintext.substr(0,plaintext.length-(endByte+1));
    }
    else {
      var div = plaintext.length - (plaintext.length-endByte);
      var firstPadByte = plaintext.charCodeAt(plaintext.length-endByte);
      if(endByte == firstPadByte && endByte == div)
        plaintext = plaintext.substr(0,plaintext.length-endByte);
    }
    aescrypt.setParams({dataOut: plaintext,decryptOut: plaintext});

    //remove all parameters from enviroment for more security is debug off
    if(!aescrypt.isDebug() && aescrypt.clear) aescrypt.clearParams();

   return plaintext || '';
  }

  AES.CBC.prototype.decrypt = function(ciphertext) {
    var aescrypt = this.aescrypt;
    var p = aescrypt.getParams(); //get parameters for operation set by init
    if(ciphertext)
      aescrypt.setParams({dataIn:ciphertext});
    if(!p.decryptIn) {
      var decryptIn = AES.CBC.Utils.decodeBase64(p.dataIn);
      //if(decryptIn.indexOf('Salted__') == 0) decryptIn = decryptIn.substr(16);
      aescrypt.setParams({decryptIn: AES.CBC.Utils.toByteArray(decryptIn)});
    }
    var plaintext = this.decryptRaw();
    if(p.UTF8)
      plaintext = AES.CBC.Utils.decodeUTF8(plaintext);
    if(aescrypt.isDebug()) aescrypt.appendDebug('Removed Padding after decryption:'+ AES.CBC.Utils.convertToHex(plaintext) + ':' + plaintext.length + '\n');
    aescrypt.setParams({dataOut:plaintext});

    if(!aescrypt.isDebug() && aescrypt.clear) aescrypt.clearParams();
    return plaintext || '';
  }

AES.CBC.prototype.decryptText = function(dataIn, password, options) {
	this.initDecrypt(dataIn, password, options);
	return this.decrypt();
}

AES.CBC.Utils = {};

AES.CBC.Utils.encodeBase64 = function(str,utf8encode) {
	if(!str) str = "";
	var b64 = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";
	utf8encode =  (typeof utf8encode == 'undefined') ? false : utf8encode;
	var o1, o2, o3, bits, h1, h2, h3, h4, e=[], pad = '', c, plain, coded;

	plain = utf8encode ? AES.CBC.Utils.encodeUTF8(str) : str;

	c = plain.length % 3;
	if (c > 0) { 
		while (c++ < 3) { 
			pad += '='; 
			plain += '\0'; 
		} 
	}

	for (c=0; c<plain.length; c+=3) {
		o1 = plain.charCodeAt(c);
		o2 = plain.charCodeAt(c+1);
		o3 = plain.charCodeAt(c+2);

		bits = o1<<16 | o2<<8 | o3;

		h1 = bits>>18 & 0x3f;
		h2 = bits>>12 & 0x3f;
		h3 = bits>>6 & 0x3f;
		h4 = bits & 0x3f;

		e[c/3] = b64.charAt(h1) + b64.charAt(h2) + b64.charAt(h3) + b64.charAt(h4);
	}
	coded = e.join('');
	coded = coded.slice(0, coded.length-pad.length) + pad;
	return coded;
}

AES.CBC.Utils.decodeBase64 = function(str,utf8decode) {
	if(!str) str = "";
	var b64 = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";
	utf8decode =  (typeof utf8decode == 'undefined') ? false : utf8decode;
	var o1, o2, o3, h1, h2, h3, h4, bits, d=[], plain, coded;

	coded = utf8decode ? AES.CBC.Utils.decodeUTF8(str) : str;

	for (var c=0; c<coded.length; c+=4) {
		h1 = b64.indexOf(coded.charAt(c));
		h2 = b64.indexOf(coded.charAt(c+1));
		h3 = b64.indexOf(coded.charAt(c+2));
		h4 = b64.indexOf(coded.charAt(c+3));

		bits = h1<<18 | h2<<12 | h3<<6 | h4;

		o1 = bits>>>16 & 0xff;
		o2 = bits>>>8 & 0xff;
		o3 = bits & 0xff;

		d[c/4] = String.fromCharCode(o1, o2, o3);
		if (h4 == 0x40) d[c/4] = String.fromCharCode(o1, o2);
		if (h3 == 0x40) d[c/4] = String.fromCharCode(o1);
	}
	plain = d.join('');
	plain = utf8decode ? AES.CBC.Utils.decodeUTF8(plain) : plain
	return plain;
}

AES.CBC.Utils.encodeUTF8 = function(str) {
	if(!str) str = "";
	str = str.replace(/[\u0080-\u07ff]/g, function(c) {
			var cc = c.charCodeAt(0);
			return String.fromCharCode(0xc0 | cc>>6, 0x80 | cc&0x3f); 
		}
    );
	str = str.replace(/[\u0800-\uffff]/g, function(c) {
			var cc = c.charCodeAt(0);
			return String.fromCharCode(0xe0 | cc>>12, 0x80 | cc>>6&0x3F, 0x80 | cc&0x3f); 
		}
    );
	return str;
}

AES.CBC.Utils.decodeUTF8 = function(str) {
	if(!str) str = "";
	str = str.replace(/[\u00c0-\u00df][\u0080-\u00bf]/g, function(c) {
			var cc = (c.charCodeAt(0)&0x1f)<<6 | c.charCodeAt(1)&0x3f;
			return String.fromCharCode(cc); 
		}
    );
	str = str.replace(/[\u00e0-\u00ef][\u0080-\u00bf][\u0080-\u00bf]/g, function(c) {
			var cc = ((c.charCodeAt(0)&0x0f)<<12) | ((c.charCodeAt(1)&0x3f)<<6) | ( c.charCodeAt(2)&0x3f);
			return String.fromCharCode(cc); 
		}
	);
	return str;
}

AES.CBC.Utils.convertToHex = function(str) {
	if(!str) str = "";
	var hs ='';
	var hv ='';
	for (var i=0; i<str.length; i++) {
		hv = str.charCodeAt(i).toString(16);
		hs += (hv.length == 1) ? '0'+hv : hv;
	}
	return hs;
}

AES.CBC.Utils.convertFromHex = function(str){
	if(!str) str = "";
	var s = "";
	for(var i= 0;i<str.length;i+=2){
		s += String.fromCharCode(parseInt(str.substring(i,i+2),16));
	}
	return s
}

AES.CBC.Utils.stripLineFeeds = function(str){
	if(!str) str = "";
	var s = '';
	s = str.replace(/\n/g,'');
	s = s.replace(/\r/g,'');
	return s;
}

AES.CBC.Utils.toByteArray = function(str){
	if(!str) str = "";
	var ba = [];
	for(var i=0;i<str.length;i++)
		ba[i] = str.charCodeAt(i);
	return ba;
}

AES.CBC.Utils.fragment = function(str,length,lf){
	if(!str) str = "";
	if(!length || length>=str.length) return str;
	if(!lf) lf = '\n'
	var tmp='';
	for(var i=0;i<str.length;i+=length)
		tmp += str.substr(i,length) + lf;
	return tmp;
}

AES.CBC.Utils.formatHex = function(str,length){
	if(!str) str = "";
	if(!length) length = 45;
	var str_new='';
	var j = 0;
	var hex = str.toLowerCase();
	for(var i=0;i<hex.length;i+=2)
		str_new += hex.substr(i,2) +':';
	hex = this.fragment(str_new,length);
	return hex;
}

AES.CBC.Utils.byteArray2String = function(b){
	var s = '';
	for(var i=0;i<b.length;i++){
		s += String.fromCharCode(b[i]);
	}
	return s;
}