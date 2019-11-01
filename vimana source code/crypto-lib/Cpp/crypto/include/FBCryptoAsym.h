#pragma once

#include <string>
#include "KeyInterfaces.h"
#include "X509Certificate.h"

class vimryptoAsym {
public:
    virtual void setAymmetricKeys(PrivateKey& pvtKey, PublicKey& outPubKey, PublicKey& theirPubKey )=0;
};


