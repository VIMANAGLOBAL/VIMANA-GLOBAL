package io.vimana.vim.transport.service.impl;

import io.vimana.vim.transport.config.TransportBeans;
import io.vimana.vim.transport.peer.BasePeer;
import io.vimana.vim.transport.peer.P2PMessage;
import io.vimana.vim.transport.peer.TransportHeader;
import io.vimana.vim.transport.peer.TransportLayerInfo;
import io.vimana.vim.transport.NotFoundException;
import io.vimana.vim.transport.annotation.Message;
import io.vimana.vim.transport.annotation.Property;
import io.vimana.vim.transport.data.EventData;
import io.vimana.vim.transport.service.EventMessenger;
import io.vimana.vim.transport.service.WebSocketHandler;
import io.vimana.vim.transport.web.socket.PeerWebSocket;
import lombok.extern.slf4j.Slf4j;

import javax.enterprise.event.Observes;
import javax.inject.Inject;
import javax.inject.Named;
import javax.inject.Singleton;
import javax.websocket.CloseReason;
import java.io.IOException;
import java.util.HashMap;
import java.util.Map;
import java.util.Optional;
import java.util.UUID;

import static io.vimana.vim.transport.annotation.Message.MessageFrom.CRON;


@Singleton
@Slf4j
@Named
public class PeerMessagingService implements WebSocketHandler, EventMessenger {
    @Inject
    @Property("peer.protocol")
    private int protocol;

    private Map<UUID, BasePeer> connections;
    private Map<UUID, PeerWebSocket> sockets = new HashMap<>();

    private InitializationService initService;
    private DiscoveryService discoveryService;
    private TransportBeans transportBeans;

    @Inject
    public PeerMessagingService(InitializationService initService, DiscoveryService discoveryService,
                                TransportBeans transportBeans) {
        this.initService = initService;
        this.discoveryService = discoveryService;
        this.transportBeans = transportBeans;
        this.connections = this.transportBeans.connections();
    }

    @Inject
    public void setDiscoveryService(DiscoveryService discoveryService) {
        this.discoveryService = discoveryService;
    }

    @Inject
    public void setInitService(InitializationService initService) {
        this.initService = initService;
    }

    @Override
    public void onConnect(PeerWebSocket connection) {
        connection.setConnectionID(UUID.randomUUID());
        sockets.put(connection.getConnectionID(), connection);
        log.debug("new websocket connection ... id [{}]", connection.getConnectionID());
        log.debug("Sending to remote self info...");
        connection.getSession().getAsyncRemote().sendText(initService.getSelfInfo().toString());
    }

    @Override
    public void onDisconnect(PeerWebSocket connection, CloseReason reason) {
        log.debug("Disconnect " + connection.getSession().getRequestURI() + " connection ...Reason :" + reason);
        connections.remove(connection.getConnectionID());
        sockets.remove(connection.getConnectionID());
    }

    public Map<UUID, BasePeer> getConnections() {
        return connections;
    }

    @Override
    public void eventCallback(EventData data) {
        //here some callback
    }

/*    public void getConnectedPeersEvent(@Observes @Message(DISCOVERY) EventData<String> data) {
        data.getSender().eventCallback(new EventData<>(connections.values(), this));
    }*/

    public void onCronEvent(@Observes @Message(CRON) EventData<BasePeer> data) {
        log.debug("received CRON event");

        //TODO:
     /*   P2PMessage message = new P2PMessage();
        message.setTransportInfo(new TransportLayerInfo()data.getData().toString());
        broadcastMessage(message);
        data.getSender().eventCallback(new EventData<>("DONE", this));*/
    }


    /**
     * handler method for handling and saving data from connections
     *
     * @param connection connections
     * @param request    that represents this msg
     */
    @Override
    public void handleMessage(PeerWebSocket connection, TransportLayerInfo request) {
        log.debug("received new info: {} from connection # {} . Saved for future Discovery", request, connection.getConnectionID());
        UUID connectionId = connection.getConnectionID();
        //check is already connected
        if (connections.containsKey(connectionId)) {
            //TODO: here must be verification in more general way
        } else {

        }

    }

    @Override
    public void broadcastMessage(TransportLayerInfo msg) {
        connections.keySet().stream()
                .map(s -> sockets.get(s))
                .forEach(socket -> socket
                        .getSession().getAsyncRemote()
                        .sendObject(msg));
    }

    @Override
    public void send(P2PMessage request) {
        String msg = packMessage(request.getAppMessage());
        try {
            Optional.ofNullable(sockets.get(request.getAddresse().getWebSocketId()))
                    .orElseThrow(() -> new NotFoundException("Don't have active peer connection"))
                    .getSession().getBasicRemote()
                    .sendText(msg); //void. no callback
        } catch (IOException e) {
            e.printStackTrace();
        }
    }

    @Override
    public void sendAsync(P2PMessage request) {
        String msg = packMessage(request.getAppMessage());
        Optional.ofNullable(sockets.get(request.getAddresse().getWebSocketId()))
                .orElseThrow(() -> new NotFoundException("Don't have active peer connection"))
                .getSession().getAsyncRemote()
                .sendText(msg); //.future callback
    }

    @Override
    public BasePeer getPeerByUUID(UUID id) {
        return connections.get(id);
    }

    private String packMessage(String appMessage) {
        TransportHeader header = new TransportHeader()
                .setFlags(0)
                .setApplicationProtocol(protocol)
                .setApplicationDataOffset(0)
                .setReserved(0);
        return header + appMessage;
    }
}
