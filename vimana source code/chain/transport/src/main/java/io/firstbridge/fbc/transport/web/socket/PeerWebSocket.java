package io.vimana.vim.transport.web.socket;

import com.fasterxml.jackson.databind.ObjectMapper;
import io.vimana.vim.transport.peer.P2PMessage;
import io.vimana.vim.transport.peer.TransportHeader;
import io.vimana.vim.transport.peer.TransportLayerInfo;
import io.vimana.vim.transport.config.InjectionConfig;
import io.vimana.vim.transport.service.AppMessageService;
import io.vimana.vim.transport.service.WebSocketHandler;
import io.vimana.vim.transport.service.impl.PeerMessagingService;
import lombok.extern.slf4j.Slf4j;

import javax.inject.Inject;
import javax.websocket.*;
import javax.websocket.server.ServerEndpoint;
import java.net.URI;
import java.util.Arrays;
import java.util.UUID;

@Slf4j
@ServerEndpoint(value = "/",
        configurator = InjectionConfig.class)
@ClientEndpoint
public class PeerWebSocket {

    private Session session;
    private UUID connectionID;
    private WebSocketHandler handler;
    private AppMessageService appHandler;
    private ObjectMapper mapper = new ObjectMapper();

    public void setMapper(ObjectMapper mapper) {
        this.mapper = mapper;
    }

    @Inject
    public void setHandler(PeerMessagingService handler) {
        this.handler = handler;
    }

    @Inject
    public void setAppHandler(AppMessageService appHandler) {
        this.appHandler = appHandler;
    }

    @OnOpen
    public void onWebSocketConnect(Session session) {
        this.session = session;
        handler.onConnect(this);
    }

    @OnMessage
    public void onWebSocketTextMessage(String message) {
        log.debug("Retrieve WebSocketTextMessage...");
        byte[] msgBytes = message.getBytes();
        TransportLayerInfo transportInfo;
        TransportHeader msgHeader = new TransportHeader(Arrays.copyOf(msgBytes, TransportHeader.HEADER_SIZE));
        String transportMessage = new String(Arrays.copyOfRange(msgBytes, TransportHeader.HEADER_SIZE, msgHeader.getApplicationDataOffset()));
        String appMessage = new String(Arrays.copyOfRange(msgBytes, TransportHeader.HEADER_SIZE + msgHeader.getApplicationDataOffset(), msgBytes.length));
        if (!transportMessage.isEmpty()) {
            //to transport handler
            log.debug("handling message on Transport level...");
            transportInfo = new TransportLayerInfo(msgHeader, transportMessage);
            handler.handleMessage(this, transportInfo);
            if (!appMessage.isEmpty()) {
                log.debug("handling message on App level...");
                P2PMessage msg = new P2PMessage();
                msg.setTransportInfo(transportInfo);
                msg.setAppMessage(appMessage);
                msg.setAddresse(handler.getPeerByUUID(connectionID));
                appHandler.retrive(msg);
            }
        }
    }

    @OnMessage
    public void processUpload(byte[] b) {
        log.debug("Binary data retrieved...");
    }

    @OnMessage
    public void onWebSocketPingMessage(PongMessage message) {
        log.debug("Ping-Pong message retrieved...");
    }

    @OnClose
    public void onWebSocketClose(CloseReason reason) {
        handler.onDisconnect(this, reason);
    }

    @OnError
    public void onWebSocketError(Throwable cause) {
        cause.printStackTrace(System.err);
    }


    public void connect(URI endpointURI) {
        try {
            //TODO: check if already has connection
            WebSocketContainer container = ContainerProvider.getWebSocketContainer();
            container.connectToServer(this, endpointURI);
        } catch (Exception e) {
            throw new RuntimeException(e);
        }
    }

    public Session getSession() {
        return session;
    }


    public UUID getConnectionID() {
        return connectionID;
    }

    public void setConnectionID(UUID connectionID) {
        this.connectionID = connectionID;
    }
}