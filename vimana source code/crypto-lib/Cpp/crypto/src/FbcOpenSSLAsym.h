#pragma once
#include "vimryptoAsym.h"
#include "KeyInterfaces.h"

class vimOpenSSLAsym: public vimryptoAsym {
public:
    vimOpenSSLAsym();
    vimOpenSSLAsym(const vimOpenSSLAsym& orig)=delete;
    virtual ~vimOpenSSLAsym();
private:

};


