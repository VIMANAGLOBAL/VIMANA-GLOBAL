const vimryptoAsym = Interface('vimryptoAsym')({
    
//    seats: type('number'),
//    passengers: type('array', [type('object', Passenger)]),
//    beep: type('function')

// public void setAsymmetricKeys(PublicKey ourPubkey, PrivateKey privKey, PublicKey theirPubKey) throws InvalidKeyException;
    
   setAsymmetricKeys: type('function'),        
   setOurKeyPair: type('function'),
   setTheirPublicKey: type('function'),
   calculateSharedKey: type('function'),
   encryptAsymmetricIES: type('function'),
   decryptAsymmetricIES: type('function'),
   encryptAsymmetric: type('function'),
   decryptAsymmetric: type('function'),
   encryptAsymmetricWithAEAData: type('function'),
   decryptAsymmetricWithAEAData: type('function'),
   sign: type('function'),
   verifySignature: type('function'),
   ecdheStep1: type('function'),
   ecdheStep2: type('function')
    
}, {
    error: true,
    strict: true
})