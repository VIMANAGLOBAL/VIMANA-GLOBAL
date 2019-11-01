package io.vimana.vim.transport.service.impl;

import io.vimana.vim.transport.config.TransportBeans;
import io.vimana.vim.transport.peer.BasePeer;
import io.vimana.vim.transport.URIException;
import io.vimana.vim.transport.annotation.Message;
import io.vimana.vim.transport.annotation.Property;
import io.vimana.vim.transport.data.EventData;
import io.vimana.vim.transport.service.EventMessenger;
import lombok.extern.slf4j.Slf4j;

import javax.annotation.PostConstruct;
import javax.enterprise.context.ApplicationScoped;
import javax.enterprise.event.Event;
import javax.enterprise.event.Observes;
import javax.inject.Inject;
import javax.inject.Named;
import javax.inject.Singleton;
import java.net.URI;
import java.net.URISyntaxException;
import java.util.*;
import java.util.stream.Collectors;

import static io.vimana.vim.transport.annotation.Message.MessageFrom.*;


/**
 * This service retrieves configs and DB for well known peers and send it to {@link WebSocketConnector}
 */

@Named
@Singleton
@Slf4j
public class DiscoveryService implements EventMessenger {

    private Set<URI> peerAddresses = new HashSet<>();

    private Map<String, BasePeer> allFoundedPeers;

    private Map<UUID, BasePeer> connections;

    private TransportBeans transportBeans;

    @Inject
    @Property("peer.wellKnownPeers")
    private String peersPropertyString;

    @Inject
    @Property("peer.websocket.port")
    private int websocketPort;

    @Inject
    @Property("peer.standalone")
    private boolean isStandalone;

    @Inject
    @Message(DISCOVERY)
    private Event<EventData<Set<URI>>> event;

    @Inject
    public DiscoveryService(TransportBeans transportBeans) {
        this.transportBeans = transportBeans;
        this.allFoundedPeers = this.transportBeans.allKnownPeers();
        this.connections = this.transportBeans.connections();
    }

    public void onInitEvent(@Observes @Message(INIT) EventData data) {
        log.debug("received Initializetion complete event...");
        doDiscover();
    }

    public void onCronEvent(@Observes @Message(CRON) EventData data) {
        log.debug("received event from {} ...", data.getSender());
        peerAddresses.clear();
        doDiscover();
        data.getSender().eventCallback(new EventData("DONE", this));
    }

    public void createPeer(String address) {

    }

    public void findPeer(String address) {

    }


    /**
     * Main method.
     * Used for collecting all addresses into one Set{@link Set}
     * After collect fires event to Connection Service {@link WebSocketConnector}
     */
    private void doDiscover() {
        log.debug("Discovering peers...");
        //TODO: new code for discovery here

        peerAddresses.addAll(allFoundedPeers.values().stream()
                .filter(peer -> peer.getShareAddress())//filter peers that can be used for incomming connection
                .filter(peer -> !connections.values().stream()
                        .map(conn -> conn.getAddress())
                        .collect(Collectors.toList())
                        .contains(peer.getAddress()))// filter peers that are not already connected TODO: use not address, but Vimana ID
                .map(peer ->
                        buildURI(peer.getAddress(), peer.getApiPort())
                                .orElseThrow(URIException::new))
                .collect(Collectors.toSet()));
        log.debug("Connected Peers: {}", connections.size());

        if (peerAddresses.isEmpty()) {
            log.debug("Nothing new discovered!");
            return;
        }
        log.debug("peers to connect: {}", peerAddresses);
        event.fire(new EventData<>(peerAddresses, this));
    }


    /**
     * Retrieving some addresses from properties file
     */
    @PostConstruct
    public void retrivePeersAddressesFromProperties() {
        if (isStandalone) {
            log.debug("This peer is standalone application");
        } else {
            log.debug("Retrieving peers addresses from properties");
            peerAddresses.addAll(Arrays.asList(peersPropertyString
                    .split(";"))
                    .stream()
                    .map(peerAddresses -> (buildURI(peerAddresses, websocketPort))
                            .orElseThrow(URIException::new))
                    .collect(Collectors.toSet()));
        }
    }

    /**
     * Retrieving some addresses from DB
     */
    public void retrivePeersFromDB() {
        log.debug("'{}' peers were loaded from the database.", "EMPTY");
    }


    /**
     * Building URI from HOST and port parameter
     *
     * @param address
     * @param webSocketPort
     * @return
     */
    private Optional<URI> buildURI(String address, int webSocketPort) {
        try {
            return Optional.of(new URI("ws://" + address + ":" + webSocketPort + "/vimana"));
        } catch (URISyntaxException e) {
            log.error("URI has problems with syntaxException", e);
            return Optional.empty();
        }
    }

    @Override
    public void eventCallback(EventData data) {

    }

    public void addNewFoundedPeers(BasePeer newFoundedPeer) {
        //TODO: change to use Vimana ID or other transport IDs/ not an address
        allFoundedPeers.put(newFoundedPeer.getAddress(), newFoundedPeer);
    }

    /**
     * Getter for peerAddresses
     *
     * @return Set<URI>
     */
    public Set<URI> getPeerAddresses() {
        return peerAddresses;
    }


}
