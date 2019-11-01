package io.vimana.vim.transport.service;

import io.vimana.vim.transport.config.PropertyProviderConfig;
import io.vimana.vim.transport.config.TransportBeans;
import io.vimana.vim.transport.service.impl.DiscoveryService;
import io.vimana.vim.transport.service.impl.InitializationService;
import io.vimana.vim.transport.service.impl.PeerMessagingService;
import io.vimana.vim.transport.service.impl.UPnPHelper;
import io.vimana.vim.transport.service.impl.WebSocketConnector;
import io.vimana.vim.transport.web.socket.PeerWebSocket;
import org.jboss.weld.junit5.EnableWeld;
import org.jboss.weld.junit5.WeldInitiator;
import org.jboss.weld.junit5.WeldSetup;
import org.junit.jupiter.api.Disabled;
import org.junit.jupiter.api.Test;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import javax.inject.Inject;

import static org.junit.jupiter.api.Assertions.assertThrows;

@Disabled
@EnableWeld
class WebSocketConnectorTest {

    final static Logger logger = LoggerFactory.getLogger(io.vimana.vim.transport.service.DiscoveryServiceTest.class);

    @WeldSetup
    public WeldInitiator weld = WeldInitiator.of(WebSocketConnector.class, TransportBeans.class,
                    PeerWebSocket.class, DiscoveryService.class,
                    PropertyProviderConfig.class, InitializationService.class,
                    PeerMessagingService.class, InitializationService.class, UPnPHelper.class);

    @Inject
    WebSocketConnector connector;

    @Inject
    PeerMessagingService messagingHandler;

    @Test
    void connectToPeer() {
        PeerWebSocket client = new PeerWebSocket();
        //  client.connect();
        //  client.onWebSocketConnect();
        //message handler  added client socket to connected Peers set.
      /*  assertNotNull(messagingHandler.getConnections());
        assertFalse(messagingHandler.getConnections().isEmpty());*/
    }

    @Test
    void connectThrowingNullPoint() {
        assertThrows(RuntimeException.class, () -> {
            connector.connectToPeer(null);
        });
    }
}