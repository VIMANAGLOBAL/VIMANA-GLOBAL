package io.vimana.vim.transport.data;

import io.vimana.vim.transport.service.EventMessenger;
import lombok.AllArgsConstructor;
import lombok.Data;


@Data
@AllArgsConstructor
public class EventData<T> {

    T data;
    EventMessenger sender;
}
