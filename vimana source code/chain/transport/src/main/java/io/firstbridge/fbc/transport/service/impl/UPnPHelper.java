package io.vimana.vim.transport.service.impl;

/**
 *
 * @author alukin@gmail.com
 */

import lombok.extern.slf4j.Slf4j;
import org.bitlet.weupnp.GatewayDevice;
import org.bitlet.weupnp.GatewayDiscover;

import javax.annotation.PostConstruct;
import javax.enterprise.context.ApplicationScoped;
import java.net.InetAddress;
import java.util.Map;

/**
 * Forward ports using the UPnP protocol.
 */
@ApplicationScoped
@Slf4j
public class UPnPHelper {

    /** UPnP gateway device */
    private  GatewayDevice gateway = null;

    /** Local address */
    private  InetAddress localAddress;

    /** External address */
    private  InetAddress externalAddress;

    public static final int UPnP_TIMEOUT_MS = 2000;
    private static UPnPHelper instance;
    
    private    UPnPHelper(){
        
    }

    /**
     * Add a port to the UPnP mapping
     *
     * @param   port                Port to add
     */
    public synchronized void addPort(int port, String description) {
        if (gateway == null)
            return;
        try {
            if (gateway.addPortMapping(port, port, localAddress.getHostAddress(), "TCP",
                   description))
            {
                log.debug("Mapped port [" + externalAddress.getHostAddress() + "]:" + port);
            } else {
                log.debug("Unable to map port " + port);
            }
        } catch (Exception exc) {
            log.error("Unable to map port " + port + ": " + exc.toString());
        }
    }

    /**
     * Delete a port from the UPnP mapping
     *
     * @param   port                Port to delete
     */
    public synchronized void deletePort(int port) {
        if ( gateway == null)
            return;
        //
        // Delete the port
        //
        try {
            if (gateway.deletePortMapping(port, "TCP")) {
                log.debug("Mapping deleted for port " + port);
            } else {
                log.debug("Unable to delete mapping for port " + port);
            }
        } catch (Exception exc) {
            log.error("Unable to delete mapping for port " + port + ": " + exc.toString());
        }
    }

    /**
     * Return the local address
     *
     * @return                      Local address or null if the address is not available
     */
    public synchronized InetAddress getLocalAddress() {
        return localAddress;
    }

    /**
     * Return the external address
     *
     * @return                      External address or null if the address is not available
     */
    public synchronized InetAddress getExternalAddress() {
        return externalAddress;
    }

    /**
     * Initialize the UPnP support
     */
    @PostConstruct
    private  void init() {
        //
        // Discover the gateway devices on the local network
        //
        try {
            log.info("Looking for UPnP gateway device...");
            GatewayDevice.setHttpReadTimeout(UPnP_TIMEOUT_MS);
            GatewayDiscover discover = new GatewayDiscover();
            discover.setTimeout(UPnP_TIMEOUT_MS);
            Map<InetAddress, GatewayDevice> gatewayMap = discover.discover();
            if (gatewayMap == null || gatewayMap.isEmpty()) {
                log.debug("There are no UPnP gateway devices");
            } else {
                gatewayMap.forEach((addr, device) ->
                        log.debug("UPnP gateway device found on " + addr.getHostAddress()));
                gateway = discover.getValidGateway();
                if (gateway == null) {
                    log.debug("There is no connected UPnP gateway device");
                } else {
                    localAddress = gateway.getLocalAddress();
                    externalAddress = InetAddress.getByName(gateway.getExternalIPAddress());
                    log.debug("Using UPnP gateway device on " + localAddress.getHostAddress());
                    log.info("External IP address is " + externalAddress.getHostAddress());
                }
            }            
        } catch (Exception ex) {
            log.error("Unable to discover UPnP gateway devices: " + ex.toString());
        }
    }

    public boolean isValidPublicIp(InetAddress address) {
        if (address == null) return false;
        return !(address.isSiteLocalAddress() ||
                address.isAnyLocalAddress() ||
                address.isLinkLocalAddress() ||
                address.isLoopbackAddress() ||
                address.isMulticastAddress());
    }
}

