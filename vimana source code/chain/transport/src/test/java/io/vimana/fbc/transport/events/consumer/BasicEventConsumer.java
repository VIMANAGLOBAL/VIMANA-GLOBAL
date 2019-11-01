package io.vimana.vim.transport.events.consumer;

import io.vimana.vim.transport.data.EventData;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import javax.enterprise.event.ObservesAsync;
import java.util.concurrent.atomic.AtomicInteger;
import java.util.concurrent.atomic.AtomicLong;

public class BasicEventConsumer {


    public static AtomicInteger receivedEvents= new AtomicInteger(0);
    public static AtomicLong totalTransferTime = new AtomicLong(0);
    final static Logger logger = LoggerFactory.getLogger(BasicEventConsumer.class);

    public  void cleanEvenets() {
        receivedEvents.set(0);
    }

    public void onMessage(@ObservesAsync EventData<Long> message) {
        long recieved_time = System.nanoTime();
        //logger.info("{} ms",recieved_time - message);
        totalTransferTime.addAndGet(recieved_time - message.getData());

        receivedEvents.incrementAndGet();

    }
}
