package io.vimana.vim.transport.annotation;


import javax.inject.Qualifier;
import java.lang.annotation.Retention;
import java.lang.annotation.Target;

import static java.lang.annotation.ElementType.*;
import static java.lang.annotation.RetentionPolicy.RUNTIME;

@Qualifier
@Target({METHOD, FIELD, PARAMETER, TYPE})
@Retention(RUNTIME)
public @interface Message {

    MessageFrom value();

    public enum MessageFrom {
        ANY, CRON, START, INIT, DISCOVERY, CONNECT, DISCONNECT, MESSAGE;
    }
}
