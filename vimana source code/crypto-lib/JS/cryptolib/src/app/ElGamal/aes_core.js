AES = function(env) {
	this.env = (env) ? env : new aesCrypt();
	this.blockSize = 16;  // block size fixed at 16 bytes / 128 bits (Nb=4) for AES
	this.ShiftRowTabInv; //initialized by init()
	this.xtime; //initialized by init()
	this.SBox = new Array(
		99,124,119,123,242,107,111,197,48,1,103,43,254,215,171,
		118,202,130,201,125,250,89,71,240,173,212,162,175,156,164,114,192,183,253,
		147,38,54,63,247,204,52,165,229,241,113,216,49,21,4,199,35,195,24,150,5,154,
		7,18,128,226,235,39,178,117,9,131,44,26,27,110,90,160,82,59,214,179,41,227,
		47,132,83,209,0,237,32,252,177,91,106,203,190,57,74,76,88,207,208,239,170,
		251,67,77,51,133,69,249,2,127,80,60,159,168,81,163,64,143,146,157,56,245,
		188,182,218,33,16,255,243,210,205,12,19,236,95,151,68,23,196,167,126,61,
		100,93,25,115,96,129,79,220,34,42,144,136,70,238,184,20,222,94,11,219,224,
		50,58,10,73,6,36,92,194,211,172,98,145,149,228,121,231,200,55,109,141,213,
		78,169,108,86,244,234,101,122,174,8,186,120,37,46,28,166,180,198,232,221,
		116,31,75,189,139,138,112,62,181,102,72,3,246,14,97,53,87,185,134,193,29,
		158,225,248,152,17,105,217,142,148,155,30,135,233,206,85,40,223,140,161,
		137,13,191,230,66,104,65,153,45,15,176,84,187,22
	);
	this.SBoxInv = new Array(
		82,9,106,213,48,54,165,56,191,64,163,158,129,243,215,
		251,124,227,57,130,155,47,255,135,52,142,67,68,196,222,233,203,84,123,148,50,
		166,194,35,61,238,76,149,11,66,250,195,78,8,46,161,102,40,217,36,178,118,91,
		162,73,109,139,209,37,114,248,246,100,134,104,152,22,212,164,92,204,93,101,
		182,146,108,112,72,80,253,237,185,218,94,21,70,87,167,141,157,132,144,216,
		171,0,140,188,211,10,247,228,88,5,184,179,69,6,208,44,30,143,202,63,15,2,193,
		175,189,3,1,19,138,107,58,145,17,65,79,103,220,234,151,242,207,206,240,180,
		230,115,150,172,116,34,231,173,53,133,226,249,55,232,28,117,223,110,71,241,
		26,113,29,41,197,137,111,183,98,14,170,24,190,27,252,86,62,75,198,210,121,32,
		154,219,192,254,120,205,90,244,31,221,168,51,136,7,199,49,177,18,16,89,39,
		128,236,95,96,81,127,169,25,181,74,13,45,229,122,159,147,201,156,239,160,224,
		59,77,174,42,245,176,200,235,187,60,131,83,153,97,23,43,4,126,186,119,214,38,
		225,105,20,99,85,33,12,125
	);
	this.ShiftRowTab = new Array(0,5,10,15,4,9,14,3,8,13,2,7,12,1,6,11);
}

AES.prototype.init = function() {
	this.env.setParams({blockSize:this.blockSize});
	this.ShiftRowTabInv = new Array(16);
	for(var i = 0; i < 16; i++)
		this.ShiftRowTabInv[this.ShiftRowTab[i]] = i;
	this.xtime = new Array(256);
	for(i = 0; i < 128; i++) {
		this.xtime[i] = i << 1;
		this.xtime[128 + i] = (i << 1) ^ 0x1b;
	}
}

AES.prototype.expandKey = function(input) {
	var key = input.slice();
	var kl = key.length, ks, Rcon = 1;
	switch (kl) {
		case 16: ks = 16 * (10 + 1); break;
		case 24: ks = 16 * (12 + 1); break;
		case 32: ks = 16 * (14 + 1); break;
		default: alert("AESCore.expandKey: Only key lengths of 16, 24 or 32 bytes allowed!");
    }
	for(var i = kl; i < ks; i += 4) {
		var temp = key.slice(i - 4, i);
		if (i % kl == 0) {
			temp = new Array(this.SBox[temp[1]] ^ Rcon, this.SBox[temp[2]],
			this.SBox[temp[3]], this.SBox[temp[0]]);
			if ((Rcon <<= 1) >= 256)
				Rcon ^= 0x11b;
		} else if ((kl > 24) && (i % kl == 16))
			temp = new Array(this.SBox[temp[0]], this.SBox[temp[1]],
		this.SBox[temp[2]], this.SBox[temp[3]]);
		for(var j = 0; j < 4; j++)
			key[i + j] = key[i + j - kl] ^ temp[j];
	}
	return key;
}
  
AES.prototype.encrypt = function(input, key) {
	var l = key.length;
	var block = input.slice();
	this.addRoundKey(block, key.slice(0, 16));
	for(var i = 16; i < l - 16; i += 16) {
		this.subBytes(block);
		this.shiftRows(block);
		this.mixColumns(block);
		this.addRoundKey(block, key.slice(i, i + 16));
	}
	this.subBytes(block);
	this.shiftRows(block);
	this.addRoundKey(block, key.slice(i, l));
    return block;
}

AES.prototype.decrypt = function(input, key) {
	var l = key.length;
	var block = input.slice();
	this.addRoundKey(block, key.slice(l - 16, l));
	this.shiftRows(block, 1);
	this.subBytes(block, 1);
	for(var i = l - 32; i >= 16; i -= 16) {
		this.addRoundKey(block, key.slice(i, i + 16));
		this.mixColumns_Inv(block);
		this.shiftRows(block, 1);
		this.subBytes(block, 1);
	}
	this.addRoundKey(block, key.slice(0, 16));
	return block;
}

AES.prototype.subBytes = function(state, inv) {
	var box = (typeof(inv) == 'undefined') ? this.SBox.slice() : this.SBoxInv.slice();
	for(var i = 0; i < 16; i++)
		state[i] = box[state[i]];
}
  
AES.prototype.addRoundKey = function(state, rkey) {
	for(var i = 0; i < 16; i++)
		state[i] ^= rkey[i];
}
  
AES.prototype.shiftRows = function(state, inv) {
	var shifttab = (typeof(inv) == 'undefined') ? this.ShiftRowTab.slice() : this.ShiftRowTabInv.slice();
	var h = new Array().concat(state);
	for(var i = 0; i < 16; i++)
		state[i] = h[shifttab[i]];
}
  
AES.prototype.mixColumns = function(state) {
	for(var i = 0; i < 16; i += 4) {
		var s0 = state[i + 0], s1 = state[i + 1];
		var s2 = state[i + 2], s3 = state[i + 3];
		var h = s0 ^ s1 ^ s2 ^ s3;
		state[i + 0] ^= h ^ this.xtime[s0 ^ s1];
		state[i + 1] ^= h ^ this.xtime[s1 ^ s2];
		state[i + 2] ^= h ^ this.xtime[s2 ^ s3];
		state[i + 3] ^= h ^ this.xtime[s3 ^ s0];
	}
}
  
AES.prototype.mixColumns_Inv = function(state) {
	for(var i = 0; i < 16; i += 4) {
		var s0 = state[i + 0], s1 = state[i + 1];
		var s2 = state[i + 2], s3 = state[i + 3];
		var h = s0 ^ s1 ^ s2 ^ s3;
		var xh = this.xtime[h];
		var h1 = this.xtime[this.xtime[xh ^ s0 ^ s2]] ^ h;
		var h2 = this.xtime[this.xtime[xh ^ s1 ^ s3]] ^ h;
		state[i + 0] ^= h1 ^ this.xtime[s0 ^ s1];
		state[i + 1] ^= h2 ^ this.xtime[s1 ^ s2];
		state[i + 2] ^= h1 ^ this.xtime[s2 ^ s3];
		state[i + 3] ^= h2 ^ this.xtime[s3 ^ s0];
	}
}
  
AES.prototype.xOr_Array = function( a1, a2 ){
	var i;
	var res = Array();
	for( i=0; i<a1.length; i++ )
		res[i] = a1[i] ^ a2[i];
	return res;
}
  
AES.prototype.getCounterBlock = function(){
	var ctrBlk = new Array(this.blockSize);
	var nonce = (new Date()).getTime();
	var nonceSec = Math.floor(nonce/1000);
	var nonceMs = nonce%1000;
	for (var i=0; i<4; i++) ctrBlk[i] = (nonceSec >>> i*8) & 0xff;
	for (var i=0; i<4; i++) ctrBlk[i+4] = nonceMs & 0xff;
    
	return ctrBlk.slice();
}

AES.MD5 = function(string) {
	function RotateLeft(lValue, iShiftBits) {
		return (lValue<<iShiftBits) | (lValue>>>(32-iShiftBits));
	}

	function AddUnsigned(lX,lY) {
		var lX4,lY4,lX8,lY8,lResult;
		lX8 = (lX & 0x80000000);
		lY8 = (lY & 0x80000000);
		lX4 = (lX & 0x40000000);
		lY4 = (lY & 0x40000000);
		lResult = (lX & 0x3FFFFFFF)+(lY & 0x3FFFFFFF);
		if (lX4 & lY4) {
			return (lResult ^ 0x80000000 ^ lX8 ^ lY8);
		}
		
		if (lX4 | lY4) {
			if (lResult & 0x40000000) {
				return (lResult ^ 0xC0000000 ^ lX8 ^ lY8);
			} else {
				return (lResult ^ 0x40000000 ^ lX8 ^ lY8);
			}
		} else {
			return (lResult ^ lX8 ^ lY8);
		}
	}

	function F(x,y,z) { return (x & y) | ((~x) & z); }
	function G(x,y,z) { return (x & z) | (y & (~z)); }
	function H(x,y,z) { return (x ^ y ^ z); }
	function I(x,y,z) { return (y ^ (x | (~z))); }

	function FF(a,b,c,d,x,s,ac) {
		a = AddUnsigned(a, AddUnsigned(AddUnsigned(F(b, c, d), x), ac));
		return AddUnsigned(RotateLeft(a, s), b);
	};

	function GG(a,b,c,d,x,s,ac) {
		a = AddUnsigned(a, AddUnsigned(AddUnsigned(G(b, c, d), x), ac));
		return AddUnsigned(RotateLeft(a, s), b);
	};

	function HH(a,b,c,d,x,s,ac) {
		a = AddUnsigned(a, AddUnsigned(AddUnsigned(H(b, c, d), x), ac));
		return AddUnsigned(RotateLeft(a, s), b);
	};

	function II(a,b,c,d,x,s,ac) {
		a = AddUnsigned(a, AddUnsigned(AddUnsigned(I(b, c, d), x), ac));
		return AddUnsigned(RotateLeft(a, s), b);
	};

	function ConvertToWordArray(string) {
		var lWordCount;
		var lMessageLength = string.length;
		var lNumberOfWords_temp1=lMessageLength + 8;
		var lNumberOfWords_temp2=(lNumberOfWords_temp1-(lNumberOfWords_temp1 % 64))/64;
		var lNumberOfWords = (lNumberOfWords_temp2+1)*16;
		var lWordArray=Array(lNumberOfWords-1);
		var lBytePosition = 0;
		var lByteCount = 0;
		while ( lByteCount < lMessageLength ) {
			lWordCount = (lByteCount-(lByteCount % 4))/4;
			lBytePosition = (lByteCount % 4)*8;
			lWordArray[lWordCount] = (lWordArray[lWordCount] | (string.charCodeAt(lByteCount)<<lBytePosition));
			lByteCount++;
		}
		lWordCount = (lByteCount-(lByteCount % 4))/4;
		lBytePosition = (lByteCount % 4)*8;
		lWordArray[lWordCount] = lWordArray[lWordCount] | (0x80<<lBytePosition);
		lWordArray[lNumberOfWords-2] = lMessageLength<<3;
		lWordArray[lNumberOfWords-1] = lMessageLength>>>29;
		return lWordArray;
	};

	function WordToHex(lValue) {
		var WordToHexValue="",WordToHexValue_temp="",lByte,lCount;
		for (lCount = 0;lCount<=3;lCount++) {
			lByte = (lValue>>>(lCount*8)) & 255;
			WordToHexValue_temp = "0" + lByte.toString(16);
			WordToHexValue = WordToHexValue + WordToHexValue_temp.substr(WordToHexValue_temp.length-2,2);
		}
		return WordToHexValue;
	};

	var x=Array();
	var k,AA,BB,CC,DD,a,b,c,d;
	var S11=7, S12=12, S13=17, S14=22;
	var S21=5, S22=9 , S23=14, S24=20;
	var S31=4, S32=11, S33=16, S34=23;
	var S41=6, S42=10, S43=15, S44=21;

	x = ConvertToWordArray(string);
	a = 0x67452301; b = 0xEFCDAB89; c = 0x98BADCFE; d = 0x10325476;

	for (k=0;k<x.length;k+=16) {
		AA=a; BB=b; CC=c; DD=d;
		a=FF(a,b,c,d,x[k+0], S11,0xD76AA478);
		d=FF(d,a,b,c,x[k+1], S12,0xE8C7B756);
		c=FF(c,d,a,b,x[k+2], S13,0x242070DB);
		b=FF(b,c,d,a,x[k+3], S14,0xC1BDCEEE);
		a=FF(a,b,c,d,x[k+4], S11,0xF57C0FAF);
		d=FF(d,a,b,c,x[k+5], S12,0x4787C62A);
		c=FF(c,d,a,b,x[k+6], S13,0xA8304613);
		b=FF(b,c,d,a,x[k+7], S14,0xFD469501);
		a=FF(a,b,c,d,x[k+8], S11,0x698098D8);
		d=FF(d,a,b,c,x[k+9], S12,0x8B44F7AF);
		c=FF(c,d,a,b,x[k+10],S13,0xFFFF5BB1);
		b=FF(b,c,d,a,x[k+11],S14,0x895CD7BE);
		a=FF(a,b,c,d,x[k+12],S11,0x6B901122);
		d=FF(d,a,b,c,x[k+13],S12,0xFD987193);
		c=FF(c,d,a,b,x[k+14],S13,0xA679438E);
		b=FF(b,c,d,a,x[k+15],S14,0x49B40821);
		a=GG(a,b,c,d,x[k+1], S21,0xF61E2562);
		d=GG(d,a,b,c,x[k+6], S22,0xC040B340);
		c=GG(c,d,a,b,x[k+11],S23,0x265E5A51);
		b=GG(b,c,d,a,x[k+0], S24,0xE9B6C7AA);
		a=GG(a,b,c,d,x[k+5], S21,0xD62F105D);
		d=GG(d,a,b,c,x[k+10],S22,0x2441453);
		c=GG(c,d,a,b,x[k+15],S23,0xD8A1E681);
		b=GG(b,c,d,a,x[k+4], S24,0xE7D3vim8);
		a=GG(a,b,c,d,x[k+9], S21,0x21E1CDE6);
		d=GG(d,a,b,c,x[k+14],S22,0xC33707D6);
		c=GG(c,d,a,b,x[k+3], S23,0xF4D50D87);
		b=GG(b,c,d,a,x[k+8], S24,0x455A14ED);
		a=GG(a,b,c,d,x[k+13],S21,0xA9E3E905);
		d=GG(d,a,b,c,x[k+2], S22,0xFCEFA3F8);
		c=GG(c,d,a,b,x[k+7], S23,0x676F02D9);
		b=GG(b,c,d,a,x[k+12],S24,0x8D2A4C8A);
		a=HH(a,b,c,d,x[k+5], S31,0xFFFA3942);
		d=HH(d,a,b,c,x[k+8], S32,0x8771F681);
		c=HH(c,d,a,b,x[k+11],S33,0x6D9D6122);
		b=HH(b,c,d,a,x[k+14],S34,0xFDE5380C);
		a=HH(a,b,c,d,x[k+1], S31,0xA4BEEA44);
		d=HH(d,a,b,c,x[k+4], S32,0x4BDECFA9);
		c=HH(c,d,a,b,x[k+7], S33,0xF6BB4B60);
		b=HH(b,c,d,a,x[k+10],S34,0xBEBvim70);
		a=HH(a,b,c,d,x[k+13],S31,0x289B7EC6);
		d=HH(d,a,b,c,x[k+0], S32,0xEAA127FA);
		c=HH(c,d,a,b,x[k+3], S33,0xD4EF3085);
		b=HH(b,c,d,a,x[k+6], S34,0x4881D05);
		a=HH(a,b,c,d,x[k+9], S31,0xD9D4D039);
		d=HH(d,a,b,c,x[k+12],S32,0xE6DB99E5);
		c=HH(c,d,a,b,x[k+15],S33,0x1FA27CF8);
		b=HH(b,c,d,a,x[k+2], S34,0xC4AC5665);
		a=II(a,b,c,d,x[k+0], S41,0xF4292244);
		d=II(d,a,b,c,x[k+7], S42,0x432AFF97);
		c=II(c,d,a,b,x[k+14],S43,0xAB9423A7);
		b=II(b,c,d,a,x[k+5], S44,0xFC93A039);
		a=II(a,b,c,d,x[k+12],S41,0x655B59C3);
		d=II(d,a,b,c,x[k+3], S42,0x8F0CCC92);
		c=II(c,d,a,b,x[k+10],S43,0xFFEFF47D);
		b=II(b,c,d,a,x[k+1], S44,0x85845DD1);
		a=II(a,b,c,d,x[k+8], S41,0x6FA87E4F);
		d=II(d,a,b,c,x[k+15],S42,0xFE2CE6E0);
		c=II(c,d,a,b,x[k+6], S43,0xA3014314);
		b=II(b,c,d,a,x[k+13],S44,0x4E0811A1);
		a=II(a,b,c,d,x[k+4], S41,0xF7537E82);
		d=II(d,a,b,c,x[k+11],S42,0xBD3AF235);
		c=II(c,d,a,b,x[k+2], S43,0x2AD7D2BB);
		b=II(b,c,d,a,x[k+9], S44,0xEB86D391);
		a=AddUnsigned(a,AA);
		b=AddUnsigned(b,BB);
		c=AddUnsigned(c,CC);
		d=AddUnsigned(d,DD);
	}
	var temp = WordToHex(a)+WordToHex(b)+WordToHex(c)+WordToHex(d);
	return temp.toLowerCase();
}