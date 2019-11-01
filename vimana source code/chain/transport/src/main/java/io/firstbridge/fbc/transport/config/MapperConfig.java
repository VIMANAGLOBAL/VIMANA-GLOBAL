package io.vimana.vim.transport.config;

import com.fasterxml.jackson.databind.ObjectMapper;

import javax.enterprise.context.ApplicationScoped;
import javax.enterprise.inject.Produces;

/**
 * @author Mike Voloshyn
 */
@ApplicationScoped
public class MapperConfig {

    /**
     * ObjectMapper configuration for using inside services.
     * <p>
     * There will be all configuration for convertation between types.
     *
     * @return
     */
    @Produces
    @ApplicationScoped
    public ObjectMapper mapper() {
        ObjectMapper mapper = new ObjectMapper();
        return mapper;
    }
}
