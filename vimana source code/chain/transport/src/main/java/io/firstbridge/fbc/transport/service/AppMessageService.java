package io.vimana.vim.transport.service;

import io.vimana.vim.transport.peer.P2PMessage;

/**
 * @author Mike Voloshyn
 */
public interface AppMessageService {

    P2PMessage send(P2PMessage msg);

    void sendAsync(P2PMessage msg);

    void retrive(P2PMessage msg);
}
