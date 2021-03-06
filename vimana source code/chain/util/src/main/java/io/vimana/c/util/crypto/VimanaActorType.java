
package io.vimana.vim.util.crypto;

import java.nio.ByteBuffer;
import java.nio.ByteOrder;
import java.util.Arrays;

/**
 *
 * @author alukin@gmail.com
 */
public class VimanaActorType {
   
    private int[] at={0,0};

    public VimanaActorType(int atype) {
        ByteBuffer bb = ByteBuffer.allocate(4).order(ByteOrder.BIG_ENDIAN).putInt(atype);
        at[0]=bb.get(2);
        at[1]=bb.get(3);
    }

    public VimanaActorType() {        
    }

    public Integer getValue() {
        return at[0]<<8|at[1];
    }
    
    public Integer getType(){
        return at[0];
    }
    
    public Integer getSubType(){
        return at[1];
    }
    public void setType(int t){
        at[0]= t & 0xFF;
    }
    public void setSubType(int t){
        at[1] = t & 0xFF;
    }    
    @Override
    public boolean equals(Object obj) {
                if (obj == null) {
            return false;
        }

        if (!VimanaActorType.class.isAssignableFrom(obj.getClass())) {
            return false;
        }

        final VimanaActorType other = (VimanaActorType) obj;
        if ((this.at == null) ? (other.at != null) : !Arrays.equals(this.at,other.at)) {
            return false;
        }

        return true; 
    }

    @Override
    public int hashCode() {
        return at.hashCode(); 
    }
    
}
