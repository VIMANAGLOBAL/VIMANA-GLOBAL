package io.vimana.vim.transport.config;

import javax.enterprise.inject.spi.CDI;
import javax.websocket.server.ServerEndpointConfig.Configurator;

/**
 * Instantiates WebSocket end-point with a custom injector so that @Inject can be
 * used normally.
 */
public class InjectionConfig extends Configurator {

    public InjectionConfig() {

    }

    @Override
    public <T> T getEndpointInstance(Class<T> endpointClass) throws InstantiationException {
        return CDI.current().select(endpointClass).get();
    }
}
