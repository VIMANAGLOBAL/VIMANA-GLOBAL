package io.vimana.vim.transport;

import io.vimana.vim.transport.annotation.MessageBinder;
import io.vimana.vim.transport.config.PropertyProviderConfig;
import io.vimana.vim.transport.config.TransportBeans;
import io.vimana.vim.transport.data.EventData;
import io.vimana.vim.transport.service.EventMessenger;
import io.vimana.vim.transport.service.impl.*;
import io.vimana.vim.transport.web.socket.PeerWebSocket;
import org.jboss.weld.environment.se.Weld;
import org.jboss.weld.environment.se.WeldContainer;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;


public class P2P implements EventMessenger {

    final static Logger log = LoggerFactory.getLogger(P2P.class);

    public static void main(String[] args) {
        P2P app = new P2P();
        WeldContainer container = app.initContainerAndStartServer();


        //TODO: fire first event in more general way
        container.event().select(new MessageBinder() {
            @Override
            public MessageFrom value() {
                return MessageFrom.START;
            }
        }).fire("initialized!");
    }

    @Override
    public void eventCallback(EventData data) {

    }

    private WeldContainer initContainerAndStartServer() {
        Weld weld = new Weld();
        WeldContainer container = weld
                .disableDiscovery()
                .addBeanClasses(TransportBeans.class, P2P.class, UPnPHelper.class,
                        PropertyProviderConfig.class, CronSheduleService.class,
                        InitializationService.class, DiscoveryService.class,
                        WebSocketConnector.class, PeerWebSocket.class, PeerMessagingService.class, DebugService.class)
                .initialize();
        return container;
    }

}
