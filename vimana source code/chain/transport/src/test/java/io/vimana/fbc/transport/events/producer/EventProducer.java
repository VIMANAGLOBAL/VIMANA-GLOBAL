package io.vimana.vim.transport.events.producer;

import io.vimana.vim.transport.data.EventData;
import io.vimana.vim.transport.service.EventMessenger;
import org.jboss.weld.events.WeldEvent;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import javax.inject.Inject;
import java.util.concurrent.atomic.AtomicInteger;

public class EventProducer extends Thread implements EventMessenger {

    public static AtomicInteger firedEvents = new AtomicInteger(0);
    @Inject
    WeldEvent<EventData<Long>> event;

    public static int getCountOfEventsFiredSuccesfully() {
        return firedEvents.get();
    }

    final static Logger logger = LoggerFactory.getLogger(EventProducer.class);
    int n_e = 10000;

    public void setNE(int ne) {
        n_e=ne;
    }
    
    @Override
    public void run() {
        for (int i = 0; i < n_e; i++)
            fireEvent();
    }


    public void fireEvent() {
        long start_time = System.nanoTime();
        event.fireAsync(new EventData<>(start_time, this));
        firedEvents.incrementAndGet();

    }

    @Override
    public void eventCallback(EventData data) {

    }
}
