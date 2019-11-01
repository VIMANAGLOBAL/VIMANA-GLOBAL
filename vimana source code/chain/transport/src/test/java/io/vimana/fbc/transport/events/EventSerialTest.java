package io.vimana.vim.transport.events;

import io.vimana.vim.transport.events.consumer.BasicEventConsumer;
import io.vimana.vim.transport.events.consumer.CustomEventConsumer;
import io.vimana.vim.transport.events.producer.EventProducer;
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
import java.util.concurrent.TimeUnit;

@EnableWeld
public class EventSerialTest {

    final static Logger logger = LoggerFactory.getLogger(EventSerialTest.class);

    @WeldSetup
    public WeldInitiator weld = WeldInitiator.of(WeldInitiator.createWeld()
            .beanClasses(BasicEventConsumer.class, CustomEventConsumer.class, ParalelEventProducer.class,
                    EventProducer.class));

    @Inject
    Instance<EventProducer> producers;

    @Inject
    Instance<ParalelEventProducer> paralelEventProducers;

    @Inject
    BasicEventConsumer basicEventConsumer;

    @Inject
    CustomEventConsumer customEventConsumer;

    static void shutdownAndAwaitTermination(ExecutorService pool, int timeout) {
        pool.shutdown(); // Disable new tasks from being submitted
        try {
            // Wait a while for existing tasks to terminate
            if (!pool.awaitTermination(timeout, TimeUnit.SECONDS)) {
                pool.shutdownNow(); // Cancel currently executing tasks
                // Wait a while for tasks to respond to being cancelled
                if (!pool.awaitTermination(timeout, TimeUnit.SECONDS)) {
                    System.err.println("Pool did not terminate");
                }
            }
            //let current thread work much longer to complete it's work
          Thread.sleep(timeout*100);
        } catch (InterruptedException ie) {
            // (Re-)Cancel if current thread also interrupted
            pool.shutdownNow();
            // Preserve interrupt status
            Thread.currentThread().interrupt();
        }
    }

    @BeforeEach
    void cleanCounters() {
        EventProducer.firedEvents.set(0);
        BasicEventConsumer.receivedEvents.set(0);
        CustomEventConsumer.recievedEvents.set(0);
        BasicEventConsumer.totalTransferTime.set(0);
    }

    @Test
    void deliveryTimeTest() {
        int n_threads = 4;
        int n_events = 10000;
        ExecutorService executor = Executors.newFixedThreadPool(n_threads);
        //make list to exlide instantiation time
        List<EventProducer> pl = new ArrayList<>();
        // runs n_threas threads each of ther  fires async n_events events.
        for (int i = 0; i < n_threads; i++) {
            EventProducer p = producers.get();
            p.setNE(n_events/n_threads);
            pl.add(p);
        }
        pl.forEach((p) -> executor.execute(p));
        shutdownAndAwaitTermination(executor,30);
        long recievedEvents = BasicEventConsumer.receivedEvents.get();
        long totalTransferTime = BasicEventConsumer.totalTransferTime.get() / 1000;
        double avgTransferTime = (double) totalTransferTime / recievedEvents;
        logger.info("RecievedEvents {} ", recievedEvents);
        logger.info("total concurent transfer time {} microseconds ", totalTransferTime);
        logger.info("Avg transfer time {} microseconds with serial strategy", avgTransferTime);
    }


    @Test
    void transactionsPerSecTest() throws InterruptedException {

        int n_threads = 4;
        int n_events = 50000;
        ExecutorService executor = Executors.newFixedThreadPool(n_threads);
        //make list to exlide instantiation time
        List<EventProducer> pl = new ArrayList<>();
        // runs n_threas threads each of ther  fires async n_events events.
        long start_time = System.nanoTime();
        for (int i = 0; i < n_threads; i++) {
            EventProducer p = producers.get();
            p.setNE(n_events / n_threads);
            pl.add(p);
        }
        pl.forEach((p) -> executor.execute(p));
        //let it comlpete or shutdown after timeout
        shutdownAndAwaitTermination(executor, 30);

        long end_time = System.nanoTime();
        double duration_s = (end_time - start_time) / 1000000000.0;// seconds
        double duration_ms = (end_time - start_time) / 1000000.0;// milliseconds
        double duration_us = (end_time - start_time) / 1000.0; // microseconds
        double submitted_per_s = EventProducer.getCountOfEventsFiredSuccesfully() / duration_s;
        double received_per_s_1 = BasicEventConsumer.receivedEvents.get() / duration_s;
        double received_per_s_2 = CustomEventConsumer.recievedEvents.get() / duration_s;

        logger.info("=== Execution time {} seconds", duration_s);
        logger.info("=== Events submmitted: {}, per second: {}", EventProducer.getCountOfEventsFiredSuccesfully(), submitted_per_s);
        logger.info("=== Events succesfully recieved: {}. {} events per second", BasicEventConsumer.receivedEvents.get(), received_per_s_1);
        logger.info("=== Events succesfully recieved: {}. {} eventsper second", CustomEventConsumer.recievedEvents.get(), received_per_s_2);

    }

    @Test
    void initializationTimeTest() {

        int n_threads = 4;
        int n_events = 1000;
        ExecutorService executor = Executors.newFixedThreadPool(n_threads);
        //make list to exlide instantiation time
        List<EventProducer> pl = new ArrayList<>();
        // runs n_threas threads each of ther  fires async n_events events.
        long start_time = System.nanoTime();
        for (int i = 0; i < n_threads; i++) {
            EventProducer p = producers.get();
            p.setNE(n_events / n_threads);
            pl.add(p);
        }
        long end_time = System.nanoTime();
        double duration_s = (end_time - start_time) / 1000.0;
        logger.info("=== Execution time {} microseconds", duration_s);
    }


}
