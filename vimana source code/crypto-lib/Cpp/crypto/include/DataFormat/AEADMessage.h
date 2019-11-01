/* 
 * File:   AEADMessage.h
 * Author: nemez
 *
 * Created on October 3, 2018, 11:17 AM
 */

#ifndef AEADMESSAGE_H
#define AEADMESSAGE_H

#include <sstream>
#include <string.h>
#include "vimryptoParams.h"
#include <openssl/bio.h>
#include "netinet/in.h"
#include "AEADLayout.h"

#define NONCE_SHIFT 4

/**
 * Defines message format for AEAD with IV, plain authenticated
 * data and encrypted data.
 * specially formated data that includes: 
 *    IV  (12 bytes), (salt+explicit nounce)
 *    unencryped data lenght (4 bytes),
 *    ecnrypted data lenght (4 bytes)
 *    unencrypted data (variable len), 
 *    encrypted data in the rest of message including
 *    last 16 bytes (128 bits) of hmac 
 * @author alukin@gmail.com
 */

#include <vector>
#include "vimryptoParams.h"
#include "global.h"
#include "AEADLayout.h"
#include "AEAD.h"
       
#define MAX_MSG_SIZE 65536;

class AEADMessage {
    /**
     * Maximal size of plain and encrypted parts in sum to prevent DoS attacks
     */
    
private:    
    vimryptoParams cryptoParams;
    int hmacSize;        
    std::vector<Byte> iv; 
    std::vector<Byte> aatext; 
    std::vector<Byte> encrypted;

public: 
    
            
    inline AEADMessage(vimryptoParams cryptoParams) {
    this->cryptoParams = cryptoParams;
    this->hmacSize = cryptoParams.getGcmAuthTagLenBits() / 8; //128 bits
    }

    /**
     * Sets 8 bytes of implicit part on nounce that goes with message
     * @param en 8 bytes of explicit part of IV
     */
    

    void setExplicitNounce(const std::vector<Byte> &nonce) {
        // TODO: check this out carefully
        // if ( sizeof(en) != 8) {
        //    throw "Nounce size must be exactly 8 bytes";
        // }
        // memcpy(iv+NONCE_SHIFT, en, 8);
    }


    std::vector<Byte> getExplicitNounce(){
        return std::vector<Byte>(iv[4], iv[12]);
    }

    std::vector<Byte> getIV(){
        return iv;
    }
           
    void setIV( const std::vector<Byte> &iv) {
        if ( iv.size() != this->cryptoParams.getAesIvLen() ) {
            throw ("IV size mismatch");
        }
        this->iv = iv;
    }

    std::vector<Byte> getEncrypted() {
        return encrypted;
    }
    
    void setEncrypted( std::vector<Byte> &encrypted ) {
        this->encrypted = encrypted;
    }
    
      std::vector<Byte> getAatext () {
        return aatext;
    }
    
    void setAatext( std::vector<Byte> &aatext ) {
        this->aatext = aatext;
    }
    
    std::vector<Byte> getHMAC(){
        return std::vector<Byte>(&encrypted[encrypted.size()-hmacSize],&encrypted[encrypted.size()]); 
    }
           
    static AEADMessage* fromBytes( std::vector<Byte> &message, vimryptoParams cryptoParams) {        
        AEADMessage *res = new AEADMessage(cryptoParams);
        
        if (message.size() <= sizeof(AEADLayout) ) {
            throw ("Packet format mismatch!");
        }
        
        pAEADLayoutIV paeadLayoutIV = (pAEADLayoutIV)message.data();
        
        std::vector<Byte> iv = std::vector<Byte>(paeadLayoutIV->acIV, paeadLayoutIV->acIV+cryptoParams.getAesIvLen());
        
        res->iv.reserve(cryptoParams.getAesIvLen());
        res->iv = iv;
        
        
        int aeadTextLen =    ntohl(  paeadLayoutIV->aeatextLength );
        int encryptedLen =    ntohl(  paeadLayoutIV->encryptedLength );
        
        printf("text len: %d\n", aeadTextLen);
        printf("encrypted len: %d\n", encryptedLen);
        
        
        Byte* pAaTextBegin = (Byte*)message.data() + sizeof( AEADLayoutIV );
        
        // aeadText
        res->aatext = std::vector<Byte>(pAaTextBegin, pAaTextBegin+ aeadTextLen);
        
        //printf("AA: %s\n", res->aatext.data());
        Byte* pEncryptedBegin = (Byte*)message.data()+sizeof( AEADLayoutIV ) + aeadTextLen; 
        
        res->encrypted = std::vector<Byte>(pEncryptedBegin, pEncryptedBegin + encryptedLen); 
#ifdef _CRYPTO_DEBUG
        printf("Encrypted: %d\n", res->encrypted.size());
        BIO_dump_fp(stdout, (const char*)res->encrypted.data(), res->encrypted.size());
 #endif          
        return res;
         
    }

    std::vector<Byte> toBytes(){
        
        // placing IV here
        AEADLayout aeadLayout; 
        memset(&aeadLayout,0x00, sizeof(aeadLayout));
        memcpy(aeadLayout.acNonce, &iv[4],8);
        aeadLayout.encryptedLength = htonl(encrypted.size());
        aeadLayout.aeatextLength = htonl(aatext.size());
        
        Byte* pb = (Byte*)&aeadLayout;
        Byte* pe = (Byte*)&aeadLayout+sizeof(aeadLayout);
        // std::vector<Byte> outBuf(&aeadLayout,&aeadLayout+sizeof(aeadLayout));
        
        std::vector<Byte> outBuf(pb,pe);
        
        // concatenating eead text
        outBuf.insert(outBuf.end(), 
                std::make_move_iterator(aatext.begin()),
                std::make_move_iterator(aatext.end())
                );
        
        // inserting encrypted...         
        outBuf.insert(outBuf.end(),
                std::make_move_iterator(encrypted.begin()),
                std::make_move_iterator(encrypted.end())               
        );
        
        // dumping 
        
#ifdef _CRYPTO_DEBUG
        printf("Outbuf:\n");
        BIO_dump_fp(stdout, (const char*)outBuf.data(), outBuf.size());
#endif        
        return outBuf;
        
    }

    int calcBytesSize() {
        return cryptoParams.getIesIvLen() + 4 + 4 + aatext.size() + encrypted.size();
    }

};


#endif /* AEADMESSAGE_H */

