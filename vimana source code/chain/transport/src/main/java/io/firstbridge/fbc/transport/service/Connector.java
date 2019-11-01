package io.vimana.vim.transport.service;


import java.net.URI;
import java.util.Set;

public interface Connector {


    /**
     * Get the list of Peers and their data.
     */

    void connectPeers(Set<URI> peersAdresses);

    void connectToPeer(URI address);

}
