package io.vimana.vim.transport.service.impl;

import io.vimana.vim.transport.annotation.Message;
import io.vimana.vim.transport.annotation.Property;
import io.vimana.vim.transport.data.EventData;
import io.vimana.vim.transport.service.EventMessenger;
import lombok.extern.slf4j.Slf4j;

import javax.annotation.PostConstruct;
import javax.enterprise.context.ApplicationScoped;
import javax.enterprise.event.Event;
import javax.enterprise.event.Observes;
import javax.inject.Inject;
import javax.inject.Named;
import java.util.Timer;
import java.util.TimerTask;

import static io.vimana.vim.transport.annotation.Message.MessageFrom.CRON;
import static io.vimana.vim.transport.annotation.Message.MessageFrom.START;


/**
 * Service that performs CRON jobs in Transport app.
 * As result of each call fires Event{@link Event} with data{@link EventData}
 * TODO: add some methods to change intervals, delays of executing.
 */

@Named
@ApplicationScoped
@Slf4j
public class CronSheduleService implements EventMessenger {

    private Timer timer;

    @Inject
    @Property("peer.discovery.interval")
    private long discoveryInterval;

    @Inject
    @Message(CRON)
    private Event<EventData<String>> event;

    /**
     * Wraps creating of abstract {@link TimerTask}
     * For using in lamda functions
     *
     * @param runnableTask that will be wrapped
     * @return TimerTask
     */
    private static TimerTask wrap(Runnable runnableTask) {
        return new TimerTask() {
            @Override
            public void run() {
                runnableTask.run();
            }
        };
    }

    /**
     * Reciving event to start Cron Service with some data/configuration
     * TODO: put here some configuration
     *
     * @param data
     */
    public void onStartEvent(@Observes @Message(START) String data) {
        log.debug("Starting cron service...");
    }

    /**
     * Sheduling work in Discovery Service {@link DiscoveryService}
     */
    @PostConstruct
    private void sheduleDiscovery() {
        timer = new Timer(this.getClass().getSimpleName());
        timer.scheduleAtFixedRate(wrap(() -> event.fire(new EventData<>("cron", this))),
                discoveryInterval,
                discoveryInterval);

    }

    @Override
    public void eventCallback(EventData data) {
        log.debug("callback from {} with status {}", data.getSender().getClass().getSimpleName(), data.getData());

    }
}
