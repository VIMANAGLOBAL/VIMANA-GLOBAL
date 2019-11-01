package io.vimana.vim.transport.service;

import io.vimana.vim.transport.config.PropertyProviderConfig;
import io.vimana.vim.transport.config.TransportBeans;
import io.vimana.vim.transport.service.impl.DiscoveryService;
import org.jboss.weld.junit5.EnableWeld;
import org.jboss.weld.junit5.WeldInitiator;
import org.jboss.weld.junit5.WeldSetup;
import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.Test;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import javax.inject.Inject;
import java.net.URI;
import java.util.Set;


@EnableWeld
class DiscoveryServiceTest {
    private final static Logger log = LoggerFactory.getLogger(DiscoveryServiceTest.class);

    @WeldSetup
    private WeldInitiator weld = WeldInitiator.of(DiscoveryService.class, TransportBeans.class, PropertyProviderConfig.class);

    @Inject
    private DiscoveryService discoveryService;

    @Test
    void peerAdressesInializationTest() {
        Set<URI> addresses = discoveryService.getPeerAddresses();
        Assertions.assertTrue(addresses.size() == 0);
    }





}