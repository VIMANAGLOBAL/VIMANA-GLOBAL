package io.vimana.vim.transport;

public class UPnPException extends RuntimeException {

    private static final String ERROR_MESSAGE = "uPnP can't discover external address!";

    public UPnPException() {
        super(ERROR_MESSAGE);
    }

    public UPnPException(String message) {
        super(message);
    }
}
