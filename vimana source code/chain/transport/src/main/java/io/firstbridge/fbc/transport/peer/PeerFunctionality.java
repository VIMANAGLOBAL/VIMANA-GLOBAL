package io.vimana.vim.transport.peer;

/**
 * @author Mike Voloshyn
 */
public enum PeerFunctionality {

    HALLMARK(1),                    // Hallmarked node
    PRUNABLE(2),                    // Stores expired prunable messages
    API(4),                         // Provides open API access over http
    API_SSL(8),                     // Provides open API access over https
    CORS(16);                       // API CORS enabled

    private final long code;        // Service code - must be a power of 2

    PeerFunctionality(long code) {
        this.code = code;
    }

    public long getCode() {
        return code;
    }
}
