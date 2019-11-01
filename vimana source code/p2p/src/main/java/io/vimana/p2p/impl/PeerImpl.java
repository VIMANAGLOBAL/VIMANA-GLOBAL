package io.vimana.p2p.impl;

import io.vimana.p2p.iface.Peer;
import io.vimana.p2p.iface.PeerId;

/**
 *
 * @author alukin@gmail.com
 */
public class PeerImpl implements Peer{
    private PeerId id;
    @Override
    public PeerId getPeerId() {
        return id;
    }
    
}
