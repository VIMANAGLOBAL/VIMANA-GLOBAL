package io.vimana.vim.transport.service;

import io.vimana.vim.transport.config.PropertyProviderConfig;
import io.vimana.vim.transport.config.TransportBeans;
import io.vimana.vim.transport.service.impl.DiscoveryService;
import io.vimana.vim.transport.service.impl.InitializationService;
import io.vimana.vim.transport.service.impl.UPnPHelper;
import org.jboss.weld.junit5.EnableWeld;
import org.jboss.weld.junit5.WeldInitiator;
import org.jboss.weld.junit5.WeldSetup;
import org.junit.jupiter.api.Test;

import javax.inject.Inject;

import static org.junit.jupiter.api.Assertions.assertNotNull;

@EnableWeld
class InitializationServiceTest {

    @WeldSetup
    public WeldInitiator weld = WeldInitiator.of(InitializationService.class, UPnPHelper.class,
            DiscoveryService.class, TransportBeans.class, PropertyProviderConfig.class);

    @Inject
    InitializationService service;

    @Test
    void getSelfInfo() {
        assertNotNull(service.getSelfInfo());
    }

}