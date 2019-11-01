package io.vimana.vim.transport.peer;

import lombok.Data;

import java.util.UUID;

/**
 * @author Mike Voloshyn
 */

@Data
public class BasePeer {

    enum State {
        NON_CONNECTED, CONNECTED, DISCONNECTED
    }

    /**
     * Application name. Used to check if
     * this application is compatible to other similar applications.
     * Should be matched exactly.
     */
    public String application;
    /**
     * Coma separated list of services provided by application.
     */
    public String services;
    /**
     * Current version of application. Rule of version numbering
     * is standard 3-number. Example: 1.3.5
     * First one is major release number, second - minor release
     * number, third - bugfix edition.
     */
    public String version;
    /**
     * Is this application address should be visible externally?
     * In some cases Peer address cant be accessed, so we need to mark this.
     * For example: when Peer is behind more than one NAT we can't open and use port forwarding(uPnP).
     * Used for preventing blacklisting Peer.
     */
    public Boolean shareAddress;

    /**
     * Address, which we get from undelying connection layer.
     */
    public String address;
    /**
     * Platform that application is running on
     */
    public String platform;
    /**
     * Port of API accessible via HTTP protocol.
     * If <-0, then port is unavailable.
     */
    public Integer apiPort = 0;
    /**
     * Last connection attempt time
     */
    public Integer lastConnectAttempt = 0;

    /**
     * Unique id of websocket. Null if no connection,
     */
    public UUID webSocketId;

    /**
     * TODO: desc by Oleksiy
     */
    public byte[] vimanaId;

}
