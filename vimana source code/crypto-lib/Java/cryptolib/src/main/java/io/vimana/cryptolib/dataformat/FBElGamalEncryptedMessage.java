package io.vimana.cryptolib.dataformat;

import java.math.BigInteger;
import org.bouncycastle.math.ec.ECPoint;

 
public class FBElGamalEncryptedMessage {
     
    private ECPoint.Fp M1;
    private BigInteger M2; 
     
    public ECPoint.Fp getM1() {
        return M1; 
    }
     
    public void setM1(ECPoint.Fp M1) {
        this.M1 = M1; 
    }
     
    public BigInteger getM2() {
        return M2; 
    }
     
    public void setM2(BigInteger M2) {
        this.M2 = M2; 
    }
    
}
