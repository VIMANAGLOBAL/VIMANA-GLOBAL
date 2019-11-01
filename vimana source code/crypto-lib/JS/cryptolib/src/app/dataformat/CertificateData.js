
class CertificateData {
  constructor(name) {
        this.certificateVersion = 2; 
        this.issuerCommonName = 'VI-RA';
        this.certificateSerial = 123456; 
        this.subjectCommonName = "al.cn.ua";
        this.countryName = "UA";
        this.businessCategory = "00032da0e32e07b61c9f0251fe627a9c";
        this.dnQualifier = '00042da0e32e07b61c9f0251fe627a9c';
        this.UID = "0002da0e32e07b61c9f0251fe627a9c";
        this.organizationalUnitName = 'FB-cn';
        this.ortanizationName =  'vimana';

  }

  speak() {
    console.log("fuck");
  }
}

//class Dog extends Animal {
//  speak() {
//    console.log(this.name + ' лает.');
//  }
//}


module.exports = CertificateData;