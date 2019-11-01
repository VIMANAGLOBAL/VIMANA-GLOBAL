package io.vimana.vim.transport.service;


import io.vimana.vim.transport.data.EventData;

/**
 * Interface that used to register listeners and publish events{@link EventData}
 */
public interface EventMessenger {

    /**
     * Caallback method from event publishing.
     * This method is used to notify sender(EventMessenger) about result of event processing.
     * Also it can be used to produce soft-linking between services to  talk to each other without message brokers.
     *
     * @param data
     */
    void eventCallback(EventData data);

}
