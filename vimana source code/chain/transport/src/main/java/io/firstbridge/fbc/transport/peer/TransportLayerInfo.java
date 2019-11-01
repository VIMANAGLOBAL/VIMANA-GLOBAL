package io.vimana.vim.transport.peer;

import lombok.AllArgsConstructor;
import lombok.Data;

/**
 * @author Mike Voloshyn
 */

@Data
@AllArgsConstructor
public class TransportLayerInfo {
    private TransportHeader header;
    private String msg;
}
