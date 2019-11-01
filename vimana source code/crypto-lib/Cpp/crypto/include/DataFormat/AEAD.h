/* 
 * File:   AEAD.h
 * Author: nemez
 *
 * Created on October 3, 2018, 11:15 AM
 */

#ifndef AEAD_H
#define AEAD_H

class AEAD {
    /**
     * plain part of AEAD message
     */
public:
    std::vector<Byte> plain;
    /**
     * decrypted part of AEAD message
     */
    std::vector<Byte> decrypted;
    /**
     * indicator of correctness
     */
    bool hmac_ok;
};



#endif /* AEAD_H */

