package io.vimana.vim.transport.service.impl;


import io.vimana.vim.transport.annotation.Message;
import io.vimana.vim.transport.data.EventData;
import io.vimana.vim.transport.service.Connector;
import io.vimana.vim.transport.service.EventMessenger;
import io.vimana.vim.transport.web.socket.PeerWebSocket;
import lombok.extern.slf4j.Slf4j;

import javax.enterprise.event.Observes;
import javax.enterprise.inject.spi.CDI;
import javax.inject.Singleton;
import java.net.URI;
import java.util.Set;

import static io.vimana.vim.transport.annotation.Message.MessageFrom.DISCOVERY;

/**
 * Service that used for connecting to new peers
 */

@Singleton
@Slf4j
public class WebSocketConnector implements Connector, EventMessenger {

    private void onEvent(@Observes @Message(DISCOVERY) EventData<Set> data) {
        log.debug("received event from: {} with data {}", data.getSender().getClass().getSimpleName(), data.getData());
        connectPeers(data.getData());
    }


    /**
     * lamda function that Connect peers to the application.
     */
    @Override
    public void connectPeers(Set<URI> peersAdresses) {
        log.debug("Connecting to peers, size[{}]...", (peersAdresses != null ? peersAdresses.size() : -1));
        peersAdresses
                .forEach(uri ->
                        connectToPeer(uri));
    }

    /**
     * Basic connection method that used to create connection to Peer address(in general)
     *
     * @param uri address of Peer
     */

    @Override
    public void connectToPeer(URI uri) {
        log.debug("Connecting to peer {}...", uri != null ? uri.toString() : "empty uri");
        CDI.current().select(PeerWebSocket.class).get()
                .connect(uri);
    }


    @Override
    public void eventCallback(EventData data) {

    }
}
