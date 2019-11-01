package io.vimana.vim.transport.service.impl;


import io.vimana.vim.transport.data.EventData;
import io.vimana.vim.transport.service.EventMessenger;
import lombok.extern.slf4j.Slf4j;

import javax.inject.Named;
import javax.inject.Singleton;

@Singleton
@Named
@Slf4j
public class DebugService implements EventMessenger {

    /**
     * Logs dead events
     */
   /* @SuppressWarnings("unused")
    @Subscribe
    public void onDeadEvent(DeadEvent event) {
        logger.error("Dead event  typeOf: {} ", event.getEvent().getClass().getSimpleName());
    }*/
    @Override
    public void eventCallback(EventData data) {

    }
}
