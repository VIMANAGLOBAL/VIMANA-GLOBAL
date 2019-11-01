package io.vimana.p2p.iface;

/**
 *
 * @author alukin@gmail.com
 */
public interface PeerId {
    public byte[] get();
    public String asHexString();
    public String asBase64tring();
    public boolean isVerified();
    public boolean isSigned();
    public boolean generateNewSelfSignedCertificate(String pathToKeyStore, String ksAlias, String ksPassword, String pvtKeyPassword);
    public boolean loadKeys(String pathToKeyStore, String ksAlias, String ksPassword, String pvtKeyPassword);
    public byte[] decryptChallenge(byte[] callenge);
}
