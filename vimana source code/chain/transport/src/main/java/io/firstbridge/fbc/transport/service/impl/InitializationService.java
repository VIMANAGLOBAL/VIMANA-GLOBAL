package io.vimana.vim.transport.service.impl;


import io.vimana.vim.transport.annotation.Message;
import io.vimana.vim.transport.annotation.Property;
import io.vimana.vim.transport.data.EventData;
import io.vimana.vim.transport.peer.BasePeer;
import io.vimana.vim.transport.service.EventMessenger;
import io.vimana.vim.transport.web.socket.PeerWebSocket;
import lombok.extern.slf4j.Slf4j;
import org.eclipse.jetty.server.Server;
import org.eclipse.jetty.server.ServerConnector;
import org.eclipse.jetty.servlet.ServletContextHandler;
import org.eclipse.jetty.websocket.jsr356.server.deploy.WebSocketServerContainerInitializer;

import javax.enterprise.event.Event;
import javax.enterprise.event.Observes;
import javax.inject.Inject;
import javax.inject.Named;
import javax.inject.Singleton;
import javax.websocket.server.ServerContainer;
import java.net.InetAddress;
import java.util.Optional;

import static io.vimana.vim.transport.annotation.Message.MessageFrom.INIT;
import static io.vimana.vim.transport.annotation.Message.MessageFrom.START;

@Named
@Singleton
@Slf4j
public class InitializationService implements EventMessenger {

    public static final String VERSION = "0.1.6";
    private BasePeer selfInfo;

    @Inject
    @Property("peer.websocket.port")
    private int peerToPeerPort;

    @Inject
    private UPnPHelper upnp;

    @Inject
    @Property("peer.address")
    private String selfAddress;

    @Inject
    @Property("peer.work.mode")
    private Boolean isWorktMode; // default

//    @Inject
    @Message(INIT)
    private Event<EventData<String>> event;

    public void initPeer(@Observes @Message(START) String data) {
        log.debug("Initializing Peer... {}", data);
        selfInfo = initSelfInfo();
        if (isWorktMode) {
            initServer();
            upnp.addPort(peerToPeerPort, "Vimana Global PeerToPeer");
            event.fire(new EventData<>("Initialized!", this));
        }
    }

    private BasePeer initSelfInfo() {
        BasePeer info = new BasePeer();
        info.application = "Proto-Transport app";
        info.platform = getSystemPlatform();
        InetAddress peerHostAddress = upnp.getExternalAddress();
        //validate address from uPnP
        info.shareAddress = upnp.isValidPublicIp(peerHostAddress);
        if (info.shareAddress) {
            info.address = peerHostAddress.toString();
        }
        info.apiPort = peerToPeerPort;
        info.version = VERSION;
        return info;
    }

    private void initServer() {
        Server server = new Server();
        ServerConnector connector = new ServerConnector(server);
        connector.setPort(peerToPeerPort);
        server.addConnector(connector);
        ServletContextHandler context = new ServletContextHandler(ServletContextHandler.SESSIONS);
        context.setContextPath("/");
        server.setHandler(context);
        try {
            ServerContainer wscontainer = WebSocketServerContainerInitializer.configureContext(context);
            wscontainer.addEndpoint(PeerWebSocket.class);
            server.start();
            log.info("Started peer networking server at " + selfAddress);
        } catch (Throwable t) {
            log.error("Failed to start peer networking server", t);
        }
    }

    public BasePeer getSelfInfo() {
        return Optional.ofNullable(selfInfo).orElse(initSelfInfo());
    }

    @Override
    public void eventCallback(EventData data) {

    }

    private String getSystemPlatform() {
        String platform = System.getProperty("os.name") + " " + System.getProperty("os.arch");
        return platform;
    }
}
