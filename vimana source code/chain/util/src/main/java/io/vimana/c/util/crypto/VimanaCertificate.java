package io.vimana.vim.util.crypto;

import io.vimana.cryptolib.KeyReader;
import io.vimana.cryptolib.KeyWriter;
import io.vimana.cryptolib.impl.KeyReaderImpl;
import io.vimana.cryptolib.impl.KeyWriterImpl;
import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.io.IOException;
import java.math.BigInteger;
import java.security.cert.X509Certificate;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

/**
 * Represents X.509 certificate with Vimana-specific attributes and signed by
 * Vimana CA or self-signed
 *
 * @author alukin@gmail.com
 */
public class VimanaCertificate extends CertBase {

    private static final Logger log = LoggerFactory.getLogger(VimanaCertificate.class);

    private final X509Certificate certificate;
    private final VimanaAttributes va  = new VimanaAttributes();

    public static VimanaCertificate loadPEMFromPath(String path) throws FileNotFoundException, VimanaCertificateException {
        KeyReader kr = new KeyReaderImpl();
        X509Certificate cert = kr.readX509CertPEMorDER(new FileInputStream(path));
        VimanaCertificate vc = new VimanaCertificate(cert);
        vc.parseAttributes();
        return vc;
    }

    public VimanaCertificate(X509Certificate certificate) throws VimanaCertificateException {
        if (certificate == null) {
            throw new VimanaCertificateException("Null certificate");
        }
        this.certificate = certificate;
        parseAttributes();
        pubKey = certificate.getPublicKey();
    }

    public final void parseAttributes() throws VimanaCertificateException {
        va.setSubjectStr(certificate.getSubjectX500Principal().toString());
    }

    public BigInteger getVimanaId() {
        return va.getVimanaId();
    }

    public VimanaAuthorityID getVimanaAuthorityId() {
        return va.getVimanaAuthorityId();
    }

    public List<BigInteger> getVimanaHardwareIDs() {
        return va.getHardwareIDs();
    }

    public String getCN() {
        return va.getCn();
    }

    public String getOrganization() {
        return va.getO();
    }

    public String getOrganizationUnit() {
        return va.getOu();
    }

    public String getCountry() {
        return va.getCountry();
    }

    public String getCity() {
        return va.getCity();
    }

    public String getCertificatePurpose() {
        return "Node";
        //TODO: implement recognitioin from extended attributes
    }

    public List<String> getIPAddresses() {
        return null;
        //TODO: imiplement
    }

    public List<String> getDNSNames() {
        return null;
        //TODO: implement
    }

    public String getStateOrProvince() {
        return null;
    }

    public String getEmail() {
        return null;
    }

    public String fromList(List<String> sl) {
        String res = "";
        for (int i = 0; i < sl.size(); i++) {
            String semicolon = i < sl.size() - 1 ? ";" : "";
            res += sl.get(i) + semicolon;
        }
        return res;
    }

    public List<String> fromString(String l) {
        List<String> res = new ArrayList<>();
        String[] ll = l.split(";");
        for (String s : ll) {
            if (!s.isEmpty()) {
                res.add(s);
            }
        }
        return res;
    }

    @Override
    public String toString() {
        String res = "Vimana X.509 Certificate:\n";
        res += "CN=" + va.getCn() + "\n"
                + "VimanaID=" + getVimanaId().toString(16) + "\n";
        for (BigInteger hwid : getVimanaHardwareIDs()) {
            res += "Vimana HW ID: " + hwid + "\n";
        }
        res += "emailAddress=" + getEmail() + "\n";
        res += "Country=" + getCountry() + " State/Province=" + getStateOrProvince()
                + " City=" + getCity();
        res += "Organization=" + getOrganization() + " Org. Unit=" + getOrganizationUnit() + "\n";
        res += "IP address=" + fromList(getIPAddresses()) + "\n";
        res += "DNS names=" + fromList(getDNSNames()) + "\n";
        return res;
    }

    public String getPEM() {
        String res = "";
        KeyWriter kw = new KeyWriterImpl();
        try {
            res = kw.getX509CertificatePEM(certificate);
        } catch (IOException ex) {
            log.error("Can not get certificate PEM", ex);
        }
        return res;
    }

    public boolean isValid(Date date) {
        boolean dateOK=false;
        Date start = certificate.getNotBefore();
        Date end = certificate.getNotAfter();
        if (date != null && start != null && end != null) {
            if (date.after(start) && date.before(end)) {
                dateOK = true;
            } else {
                dateOK = false;
            }
        }
        //TODO: implement more checks
        return dateOK;
    }

    public BigInteger getSerial() {
        return certificate.getSerialNumber();
    }
}
