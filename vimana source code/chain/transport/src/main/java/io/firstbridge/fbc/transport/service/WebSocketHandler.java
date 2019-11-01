package io.vimana.vim.transport.service;

import io.vimana.vim.transport.peer.BasePeer;
import io.vimana.vim.transport.peer.P2PMessage;
import io.vimana.vim.transport.peer.TransportLayerInfo;
import io.vimana.vim.transport.web.socket.PeerWebSocket;

import javax.websocket.CloseReason;
import java.util.UUID;

public interface WebSocketHandler {

    void onConnect(PeerWebSocket connection);

    void onDisconnect(PeerWebSocket connection, CloseReason reason);

    void handleMessage(PeerWebSocket connection, TransportLayerInfo request);

    void broadcastMessage(TransportLayerInfo msg);

    void send(P2PMessage request);

    void sendAsync(P2PMessage request);

    //boolean isAlreadyConnected(URI address);

    BasePeer getPeerByUUID(UUID id);

}
