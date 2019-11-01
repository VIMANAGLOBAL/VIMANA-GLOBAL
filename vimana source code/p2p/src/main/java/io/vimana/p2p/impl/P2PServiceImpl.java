package io.vimana.p2p.impl;

import io.vimana.p2p.iface.P2PService;

/**
 *
 * @author alukin@gmail.com
 */
public class P2PServiceImpl implements P2PService{
    
    private boolean loadNodeCertificate(){
        boolean res = false;
        return res;
    }
    
    private boolean generateNodeCertificate(){
        boolean res = false;
        return res;
    }
    @Override
    public boolean start() {
        boolean res = false;
        if(!loadNodeCertificate()){
            generateNodeCertificate();
        };
        return res;    
    }

    @Override
    public boolean shutdown() {
        boolean res = false;
        return res;    
    }

    @Override
    public boolean suspend() {
        boolean res = false;
        return res;    
    }

    @Override
    public boolean resume() {
        boolean res = false;
        return res;    
    }
    
}
