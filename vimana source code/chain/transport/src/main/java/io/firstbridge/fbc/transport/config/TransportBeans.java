package io.vimana.vim.transport.config;

import io.vimana.vim.transport.peer.BasePeer;

import javax.enterprise.context.ApplicationScoped;
import javax.enterprise.inject.Produces;
import javax.inject.Singleton;
import java.util.HashMap;
import java.util.Map;
import java.util.UUID;

@Singleton
public class TransportBeans {

    /**
     * All Peers and their info
     *
     * @return
     */
    @Produces
    public Map<String, BasePeer> allKnownPeers() {
        Map<String, BasePeer> peers = new HashMap<>();
        return peers;
    }

    /**
     * Map for getting connected peer information by Connection Id;
     *
     * @return
     */
    @Produces
    public Map<UUID, BasePeer> connections() {
        Map<UUID, BasePeer> connections = new HashMap<>();
        return connections;
    }
}
