function aesCrypt(){

	function getRandomBytes(len){
		if(!len) len = 8;
		var bytes = new Array(len);
		var field = [];
		for(var i=0;i<256;i++) field[i] = i;
		for(i=0;i<bytes.length;i++)
		bytes[i] = field[Math.floor(Math.random()*field.length)];
		return bytes
	}

	this.setDefaults = function(){
		this.params.nBits = 256;
		this.params.salt = getRandomBytes(8);
		this.params.salt = AES.CBC.Utils.byteArray2String(this.params.salt);
		this.params.salt = AES.CBC.Utils.convertToHex(this.params.salt);
		this.params.blockSize = 16;
		this.params.UTF8 = true;
		this.params.A0_PAD = true;
	}

	this.debug = true;
	this.params = {};
	this.params.dataIn = '';
	this.params.dataOut = '';
	this.params.decryptIn = '';
	this.params.decryptOut = '';
	this.params.encryptIn = '';
	this.params.encryptOut = '';
	this.params.key = '';
	this.params.iv = '';
	this.params.clear = true;
	this.setDefaults();
	this.errors = '';
	this.warnings = '';
	this.infos = '';
	this.debugMsg = '';

	this.setParams = function(pObj){
		if(!pObj) pObj = {};
		for(var p in pObj)
		this.params[p] = pObj[p];
	}
	
	this.getParams = function(){
		return this.params;
	}
  
	this.getParam = function(p){
		return this.params[p] || '';
	}
	
	this.clearParams = function(){
		this.params= {};
	}
	
	this.getNBits = function(){
		return this.params.nBits;
	}
  
	this.getOutput = function(){
		return this.params.dataOut;
	}
  
	this.setError = function(str){
		this.error = str;
	}
  
	this.appendError = function(str){
		this.errors += str;
		return '';
	}
  
  this.getErrors = function(){
    return this.errors;
  }
  
  this.isError = function(){
    if(this.errors.length>0)
      return true;
    return false
  }
  
  this.appendInfo = function(str){
    this.infos += str;
    return '';
  }
  
  this.getInfos = function()
  {
    return this.infos;
  }
  
  this.setDebug = function(flag){
    this.debug = flag;
  }
  
  this.appendDebug = function(str)
  {
    this.debugMsg += str;
    return '';
  }
  
  this.isDebug = function(){
    return this.debug;
  }
  
  this.getRandomBytes = function(len){
    return getRandomBytes(len);
  }
  
}

function getRandomBytes(len){
	if(!len) len = 8;
	var bytes = new Array(len);
	var field = [];
	for(var i=0;i<256;i++) field[i] = i;
	for(i=0;i<bytes.length;i++)
	bytes[i] = field[Math.floor(Math.random()*field.length)];
	return bytes
}