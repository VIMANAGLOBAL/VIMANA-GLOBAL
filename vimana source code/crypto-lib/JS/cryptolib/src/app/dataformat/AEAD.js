const AEAD = function() {
    /**
     * plain part of AEAD message
     */
    this.plain;
    /**
     * decrypted part of AEAD message
     */
    this.decrypted;
    /**
     * indicator of correctness
     */
    this.hmac_ok;
}

module.exports = AEAD;