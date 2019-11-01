package io.vimana.vim.transport.events;

import io.vimana.vim.transport.events.consumer.BasicEventConsumer;
import io.vimana.vim.transport.events.producer.ParalelEventProducer;
import org.jboss.weld.junit5.EnableWeld;
import org.jboss.weld.junit5.WeldInitiator;
import org.jboss.weld.junit5.WeldSetup;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import javax.enterprise.inject.Instance;
import javax.inject.Inject;
import java.util.ArrayList;
import java.util.List;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;

@EnableWeld
public class EventsParalelTest {

    final static Logger logger = LoggerFactory.getLogger(EventsParalelTest.class);
    @WeldSetup
    public WeldInitiator weld = WeldInitiator.of(WeldInitiator.createWeld()
            .beanClasses(BasicEventConsumer.class, ParalelEventProducer.class));
    @Inject
    Instance<ParalelEventProducer> paralelEventProducers;

    @Inject
    BasicEventConsumer basicEventConsumer;

    @BeforeEach
    void cleanCounters() {
        ParalelEventProducer.firedEvents.set(0);
        BasicEventConsumer.receivedEvents.set(0);
        BasicEventConsumer.totalTransferTime.set(0);
    }

    @Test
    void deliveryTimeTestParalel() {
        int n_threads = 4;
        int n_events = 10000;
        ExecutorService executor = Executors.newFixedThreadPool(n_threads);
        //make list to exlide instantiation time
        List<ParalelEventProducer> pl = new ArrayList<>();
        // runs n_threas threads each of ther  fires async n_events events.
        for (int i = 0; i < n_threads; i++) {
            ParalelEventProducer p = paralelEventProducers.get();
            p.setNE(n_events / n_threads);
            pl.add(p);
        }
        pl.forEach((p) -> executor.execute(p));
        EventSerialTest.shutdownAndAwaitTermination(executor, 30);
        long recievedEvents = BasicEventConsumer.receivedEvents.get();
        double totalTransferTime = (double) BasicEventConsumer.totalTransferTime.get() / 1000;
        double avgTransferTime = totalTransferTime / recievedEvents;
        logger.info("RecievedEvents {} ", recievedEvents);
        logger.info("total concurent transfer time {} microseconds ", totalTransferTime);
        logger.info("Avg transfer time {} microseconds with paralel strategy", avgTransferTime);
    }

    @Test
    void transactionsPerSecTest() throws InterruptedException {
        int n_threads = 4;
        int n_events = 50000;
        ExecutorService executor = Executors.newFixedThreadPool(n_threads);
        //make list to exlide instantiation time
        List<ParalelEventProducer> pl = new ArrayList<>();
        // runs n_threas threads each of ther  fires async n_events events.
        long start_time = System.nanoTime();
        for (int i = 0; i < n_threads; i++) {
            ParalelEventProducer p = paralelEventProducers.get();
            p.setNE(n_events / n_threads);
            pl.add(p);
        }
        pl.forEach((p) -> executor.execute(p));
        //let it comlpete or shutdown after timeout
        EventSerialTest.shutdownAndAwaitTermination(executor, 30);

        long end_time = System.nanoTime();
        double duration_s = (end_time - start_time) / 1000000000.0;// seconds
        double duration_ms = (end_time - start_time) / 1000000.0;// milliseconds
        double duration_us = (end_time - start_time) / 1000.0; // microseconds
        double submitted_per_s = ParalelEventProducer.getCountOfEventsFiredSuccesfully() / duration_s;
        double received_per_s_1 = BasicEventConsumer.receivedEvents.get() / duration_s;

        logger.info("=== Execution time {} seconds", duration_s);
        logger.info("=== Events submmitted: {}. {} events per second", ParalelEventProducer.getCountOfEventsFiredSuccesfully(), submitted_per_s);
        logger.info("=== Events succesfully recieved: {}. {} events per second", BasicEventConsumer.receivedEvents.get(), received_per_s_1);

    }

}
