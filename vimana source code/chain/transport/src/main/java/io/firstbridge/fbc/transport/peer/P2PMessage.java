package io.vimana.vim.transport.peer;

import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * @author Mykhailo Voloshyn
 */

@Data
@NoArgsConstructor
public class P2PMessage {

    private TransportLayerInfo transportInfo;
    private String appMessage;
    private BasePeer addresse;

    public TransportLayerInfo getTransportInfo() {
        return transportInfo;
    }

    public void setTransportInfo(TransportLayerInfo transportInfo) {
        this.transportInfo = transportInfo;
    }

    public String getAppMessage() {
        return appMessage;
    }

    public void setAppMessage(String appMessage) {
        this.appMessage = appMessage;
    }

    public BasePeer getAddresse() {
        return addresse;
    }

    public void setAddresse(BasePeer addresse) {
        this.addresse = addresse;
    }
}
