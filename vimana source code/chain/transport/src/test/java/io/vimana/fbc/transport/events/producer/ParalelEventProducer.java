package io.vimana.vim.transport.events.producer;

import io.vimana.vim.transport.data.EventData;
import io.vimana.vim.transport.service.EventMessenger;
import org.jboss.weld.events.WeldEvent;
import org.jboss.weld.events.WeldNotificationOptions;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import javax.inject.Inject;
import java.util.concurrent.atomic.AtomicInteger;

public class ParalelEventProducer extends Thread implements EventMessenger {

    final static Logger logger = LoggerFactory.getLogger(EventProducer.class);
    public static AtomicInteger firedEvents = new AtomicInteger(0);
    @Inject
    WeldEvent<EventData<Long>> event;
    int n_e = 10000;

    public static int getCountOfEventsFiredSuccesfully() {
        return firedEvents.get();
    }

    public void setNE(int ne) {
        n_e = ne;
    }

    @Override
    public void run() {
        for (int i = 0; i < n_e; i++)
            fireEventParalel();
    }


    public void fireEventParalel() {
        long start_time = System.nanoTime();
        event.fireAsync(new EventData<>(start_time, this), WeldNotificationOptions.withParallelMode());
        firedEvents.incrementAndGet();

    }

    @Override
    public void eventCallback(EventData data) {

    }
}