package io.vimana.p2p.net.iface;

/**
 *
 * @author alukin@gmail.com
 */
public interface NetProtocol {
    public String getProtocolName();
    public String getRemoteHost();
    public int getRemotePort();
    public void setRemoteHost(String host);
    public void setRemotePort(int port);
    public int send(byte[] bb);
}
