package io.vimana.vim.transport.events.consumer;

import io.vimana.vim.transport.data.EventData;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import javax.enterprise.event.ObservesAsync;
import java.util.concurrent.atomic.AtomicInteger;

public class CustomEventConsumer {


    public static AtomicInteger recievedEvents = new AtomicInteger(0);
    final static Logger logger = LoggerFactory.getLogger(CustomEventConsumer.class);

    public void onMessage(@ObservesAsync EventData<Long> message) {
        recievedEvents.incrementAndGet();
    }
}
