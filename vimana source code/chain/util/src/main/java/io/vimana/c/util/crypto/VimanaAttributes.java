package io.vimana.vim.util.crypto;

import java.math.BigInteger;
import java.util.ArrayList;
import java.util.List;
import org.bouncycastle.asn1.pkcs.Attribute;
import org.bouncycastle.asn1.x500.X500Name;

/**
 * PKCS#10 and X.509 attribute parser
 *
 * @author alukin@gmail.com
 */
public class VimanaAttributes {

    private BigInteger vimanaId = BigInteger.ZERO;
    private VimanaAuthorityID vimanaAuthorityId = new VimanaAuthorityID();
    private final List<BigInteger> vimanaHardwareIDs = new ArrayList<>();
    private String cn = "";
    private String o = "";
    private String ou = "";
    private String country = "";
    private String state = "";
    private String city = "";
    private String eMail = "";

    public VimanaAttributes() {
    }

    public void setAttributes(Attribute[] aa) {

    }

    public void setSubject(X500Name sn) throws VimanaCertificateException {
        String name = sn.toString();
        setSubjectStr(name);
    }

    public void setSubjectStr(String name) throws VimanaCertificateException {
        System.out.println("NAME: " + name);
        String[] names = name.split(",");
        try {
            for (String name1 : names) {
                String[] nvs = name1.split("=");
                String an = nvs[0].trim();
                String av = nvs.length>1 ? nvs[1].trim():"";
                if (an.equalsIgnoreCase("CN")) {
                    cn = av;
                } else if (an.equalsIgnoreCase("O")) {
                    o = av;
                } else if (an.equalsIgnoreCase("OU")) {
                    ou = av;
                } else if (an.equalsIgnoreCase("C")) {
                    country = av;
                } else if (an.equalsIgnoreCase("ST")) {
                    state = av;
                } else if (an.equalsIgnoreCase("L")) {
                    city = av;
                } else if (an.equalsIgnoreCase("EMAILADDRESS")) {
                    eMail = av;
                } else if (an.trim().equalsIgnoreCase("UID")) {
                    vimanaId = new BigInteger(av, 16);
                } else if (an.equalsIgnoreCase("businessCategory")
                        || an.equalsIgnoreCase("OID.2.5.4.15")) {
                    vimanaAuthorityId = new VimanaAuthorityID(new BigInteger(av, 16));
                } else if (an.equalsIgnoreCase("DNQ")
                        || an.equalsIgnoreCase("OID.2.5.4.46")
                        || an.equalsIgnoreCase("DN")) {
                    String[] ids = av.split("-");
                    for (String hwid : ids) {
                        BigInteger bid = new BigInteger(hwid.trim(), 16);
                        vimanaHardwareIDs.add(bid);
                    }
                }
            }
        } catch (NumberFormatException ex) {
            throw new VimanaCertificateException(ex.getMessage());
        }
    }

    public BigInteger getVimanaId() {
        return vimanaId;
    }

    public void setVimanaId(BigInteger vimanaId) {
        this.vimanaId = vimanaId;
    }

    public VimanaAuthorityID getVimanaAuthorityId() {
        return vimanaAuthorityId;
    }

    public void setVimanaAuthorityId(VimanaAuthorityID vimanaAuthorityId) {
        this.vimanaAuthorityId = vimanaAuthorityId;
    }

    public String getCn() {
        return cn;
    }

    public void setCn(String cn) {
        this.cn = cn;
    }

    public String getO() {
        return o;
    }

    public void setO(String o) {
        this.o = o;
    }

    public String getOu() {
        return ou;
    }

    public void setOu(String ou) {
        this.ou = ou;
    }

    public String getCountry() {
        return country;
    }

    public void setCountry(String country) {
        this.country = country;
    }

    public String getState() {
        return state;
    }

    public void setState(String state) {
        this.state = state;
    }

    public String getCity() {
        return city;
    }

    public void setCity(String city) {
        this.city = city;
    }

    public String geteMail() {
        return eMail;
    }

    public void seteMail(String eMail) {
        this.eMail = eMail;
    }

    public List<BigInteger> getHardwareIDs() {
        return vimanaHardwareIDs;
    }
}
