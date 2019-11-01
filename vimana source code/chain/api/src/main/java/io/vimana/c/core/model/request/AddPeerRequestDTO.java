package io.vimana.vim.core.model.request;

public class AddPeerRequestDTO {
    public String peer; // peer address

    @Override
    public String toString() {
        return "AddPeerRequestDTO{" +
                "peer='" + peer + '\'' +
                '}';
    }
}
