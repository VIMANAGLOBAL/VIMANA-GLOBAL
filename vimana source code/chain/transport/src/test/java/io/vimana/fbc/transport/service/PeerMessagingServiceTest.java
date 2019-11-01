package io.vimana.vim.transport.service;

import io.vimana.vim.transport.config.PropertyProviderConfig;
import io.vimana.vim.transport.config.TransportBeans;
import io.vimana.vim.transport.service.impl.DiscoveryService;
import io.vimana.vim.transport.service.impl.InitializationService;
import io.vimana.vim.transport.service.impl.PeerMessagingService;
import io.vimana.vim.transport.service.impl.UPnPHelper;
import io.vimana.vim.transport.service.impl.WebSocketConnector;
import org.jboss.weld.junit5.EnableWeld;
import org.jboss.weld.junit5.WeldInitiator;
import org.jboss.weld.junit5.WeldSetup;
import org.junit.jupiter.api.Test;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;


@EnableWeld
class PeerMessagingServiceTest {
    private final static Logger log = LoggerFactory.getLogger(PeerMessagingServiceTest.class);

    @WeldSetup
    public WeldInitiator weld = WeldInitiator.of(WebSocketConnector.class, TransportBeans.class,
                    DiscoveryService.class, InitializationService.class,
                    PropertyProviderConfig.class, PeerMessagingService.class, UPnPHelper.class);

    @Test
    void onConnect() {
    }

    @Test
    void onDisconnect() {
    }

    @Test
    void handleMessage() {
    }

    @Test
    void sendHelloTo() {
    }
}