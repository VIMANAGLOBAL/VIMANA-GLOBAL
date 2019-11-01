//import implement, { Interface, type } from 'implement-js'

const implementjs = require('implement-js')
//const implement = implementjs.default
const { Interface, type } = implementjs

const KeyReader = Interface('KeyReader')({
    extractPublicKeyFromX509: type('function'),
    readEncryptedPrivateKeyPEM: type('function'),
    readX509CertPEMorDER: type('function'),
    readPKCS12File: type('function'),
    readPrivateKeyPEM: type('function'),
    readPrivateKeyPKCS12: type('function'),
    readPrivateKeyPKCS8: type('function'),
    readPublicKeyPKCS12: type('function'),
    deserializePrivateKey: type('function'),
    deserializePublicKey: type('function')    
}, {
    error: true,
    strict: true
})

