package io.vimana.p2p.iface;

import javax.inject.Singleton;

/**
 *
 * @author alukin@gmail.com
 */
@Singleton
public interface P2PService {
    public boolean start();
    public boolean shutdown();
    public boolean suspend();
    public boolean resume();
}
