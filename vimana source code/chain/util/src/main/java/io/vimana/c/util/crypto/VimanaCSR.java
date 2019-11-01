package io.vimana.vim.util.crypto;

import io.vimana.cryptolib.vimryptoParams;
import io.vimana.cryptolib.KeyWriter;
import io.vimana.cryptolib.csr.CertificateRequestData;
import io.vimana.cryptolib.csr.KeyGenerator;
import io.vimana.cryptolib.CryptoNotValidException;
import io.vimana.cryptolib.impl.KeyWriterImpl;
import io.vimana.vim.util.cls.BasicClassificator;
import io.vimana.vim.util.cls.ClsItem;
import io.vimana.vim.util.cls.VimanaClassificators;
import java.io.IOException;
import java.math.BigInteger;
import java.security.KeyPair;
import java.security.SecureRandom;
import java.security.cert.X509Certificate;
import java.util.ArrayList;
import java.util.List;
import org.bouncycastle.asn1.x509.SubjectPublicKeyInfo;
import org.bouncycastle.openssl.jcajce.JcaPEMKeyConverter;
import org.bouncycastle.pkcs.PKCS10CertificationRequest;
import org.bouncycastle.util.IPAddress;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

/**
 * Certificate signing request with Vimana-specific attributes
 *
 * @author alukin@gmail.com
 */
public class VimanaCSR extends CertBase{

    private static final Logger log = LoggerFactory.getLogger(VimanaCSR.class);

    public static VimanaCSR fromPKCS10(PKCS10CertificationRequest cr) {
        VimanaCSR res = new VimanaCSR();        
        try {
            VimanaAttributes va = new VimanaAttributes();
            va.setSubject(cr.getSubject());
            va.setAttributes(cr.getAttributes());
            res.setCN(va.getCn());
            res.setVimanaAuthID(va.getVimanaAuthorityId());
            res.setVimanaID(va.getVimanaId());
            res.hwIdList = va.getHardwareIDs();
            res.setCountry(va.getCountry());
            res.setState(va.getState());
            res.setCity(va.getCity());
            res.setOrg(va.getO());
            res.setOrgUnit(va.getOu());

            SubjectPublicKeyInfo pkInfo = cr.getSubjectPublicKeyInfo();
            JcaPEMKeyConverter converter = new JcaPEMKeyConverter();
            res.pubKey = converter.getPublicKey(pkInfo);
           
        } catch (VimanaCertificateException |IOException ex) {
            log.error("Error reading public key frpm PKSC#10",ex);
        }
        return res;
    }

 
    private final CertificateRequestData certData = new CertificateRequestData(CertificateRequestData.CSRType.HOST);
    private boolean allowCertSign = false;
    private String challengePassword = "";
    private BigInteger vimanaID;
    private VimanaAuthorityID vimanaAuthID = new VimanaAuthorityID();
    List<BigInteger> hwIdList = new ArrayList<>();
    private  KeyWriter kw = new KeyWriterImpl();

    public static VimanaCSR fromCertificate(VimanaCertificate cert) {
        VimanaCSR res = new VimanaCSR();
        res.setVimanaAuthorityID(cert.getVimanaAuthorityId().getAuthorityID());
        BigInteger vid = cert.getVimanaId();
        if(vid==null||vid==BigInteger.ZERO){
            vid = new BigInteger(128, new SecureRandom());
        }
        res.setVimanaID(vid);
        res.setCN(cert.getCN());
        res.setEmail(cert.getEmail());
        res.setOrg(cert.getOrganization());
        res.setOrgUnit(cert.getOrganizationUnit());
        res.setCountry(cert.getCountry());
        res.setState(cert.getStateOrProvince());
        res.setCity(cert.getCity());
        res.setIP(cert.fromList(cert.getIPAddresses()));
        res.setDNSNames(cert.fromList(cert.getDNSNames()));
        res.pubKey = cert.getPublicKey();
        res.pvtKey = cert.getPrivateKey();
        for (BigInteger hwid : cert.getVimanaHardwareIDs()) {
            res.hwIdList.add(new BigInteger(hwid.toByteArray()));
        }
        return res;
    }

    public VimanaCSR() {
        vimanaID = new BigInteger(128, new SecureRandom());
    }

    public BigInteger getVimanaID() {
        return vimanaID;
    }

    public void setVimanaID(BigInteger id) {
        vimanaID = id;
        certData.setSubjectAttribute("UID", vimanaID.toString(16));
    }

    public VimanaAuthorityID getVimanaAuthorityID() {
        return vimanaAuthID;
    }

    public List<BigInteger> getVimanaHardwareIDs() {
        return hwIdList;
    }

    public void setVimanaAuthorityID(BigInteger id) {
        vimanaAuthID = new VimanaAuthorityID(id);
        certData.setSubjectAttribute("businessCategory", vimanaAuthID.getAuthorityID().toString(16));
    }

    public VimanaAuthorityID getVimanaAuthID() {
        return vimanaAuthID;
    }

    public void setVimanaAuthID(VimanaAuthorityID vimanaAuthID) {
        this.vimanaAuthID = vimanaAuthID;
        certData.setSubjectAttribute("businessCategory", vimanaAuthID.getAuthorityID().toString(16));
    }
    
    public String getHwIdString(){
        StringBuilder attr = new StringBuilder();
        String dash;
        int sz = hwIdList.size();
        for(int i=0;i<sz;i++){
           dash = (i==sz-1) ? "" : "-"; 
           attr.append(hwIdList.get(i).toString(16));
           attr.append(dash);
        }
        return attr.toString();
    }
    
    public void addVimanaHardwareID(BigInteger id) {
          hwIdList.add(id);
          certData.setSubjectAttribute("DN", getHwIdString());
    }

    public String getCN() {
        String res = certData.getSubjectAttribute("CN");
        if(res==null){
            res="";
        }
        return res;
    }

    public void setCN(String cn) {
          certData.setSubjectAttribute("CN", cn);
    }

    public String getEmial() {
        String res =  certData.getSubjectAttribute("emailAddress");
        if(res==null){
            res="";
        }
        return res;        
    }

    public void setEmail(String email) {
        certData.setSubjectAttribute("emailAddress", email);
    }

    public String getIP() {
        return certData.getExtendedAttribute("subjaltnames.ipaddress");
    }

    public String getDNSNames() {
        return certData.getExtendedAttribute("subjaltnames.dnsname");
    }

    public void setIP(String ip) {
        if(ip!=null && !ip.isEmpty()){
        if(isValidIPAddresList(ip)){
            certData.setExtendedAttribute("subjaltnames.ipaddress", ip);
        }else{
            throw new IllegalArgumentException("Invalid IP4 or IP6 addres: "+ip);
        }
        }
    }

    public void setDNSNames(String n) {
       if(n!=null && !n.isEmpty()){
        if(isVaidDNSNameList(n)){
          certData.setExtendedAttribute("subjaltnames.dnsname", n);
        }else{
            throw new IllegalArgumentException("Invalid DNS name: "+n); 
        }
       }
    }

    public String getOrgUnit() {
        return certData.getSubjectAttribute("OU");
    }

    public void setOrgUnit(String ou) {
        certData.setSubjectAttribute("OU", ou);
    }

    public String getOrg() {
        return certData.getSubjectAttribute("O");
    }

    public void setOrg(String o) {
        certData.setSubjectAttribute("O", o);
    }

    public void setCountry(String c) {
        certData.setSubjectAttribute("C", c);
    }

    public String getCountry() {
        return certData.getSubjectAttribute("C");
    }

    public void setState(String c) {
        certData.setSubjectAttribute("ST", c);
    }

    public String getState() {
        return certData.getSubjectAttribute("ST");
    }

    public void setCity(String c) {
        certData.setSubjectAttribute("L", c);
    }

    public String getCity() {
        return certData.getSubjectAttribute("L");
    }

    public String getChallengePassword() {
        return challengePassword;
    }

    public void setChallengePassword(String challengePassword) {
        this.challengePassword = challengePassword;
    }

    public String getPemPKCS10() {
        String pem = "";
        try {
            certData.processCertData(false);
            if(pvtKey==null){
                newKeyPair();
            }
            KeyPair kp = new KeyPair(pubKey, pvtKey);
            KeyGenerator kg = new KeyGenerator(vimryptoParams.createDefault());
            PKCS10CertificationRequest cr = kg.createX509CertificateRequest(kp, certData, false, challengePassword);
            pem = kw.getCertificateRequestPEM(cr);
        } catch (IOException ex) {
            log.error("Can not generate PKSC10 CSR", ex);
        } catch (CryptoNotValidException ex) {
            log.error("Can not generate PKSC10 CSR, Invalid data", ex);
        }
        return pem;
    }

    public String getPrivateKeyPEM() {
        String pem = "";
        try {
            pem = kw.getPvtKeyPEM(pvtKey);
        } catch (IOException ex) {
            log.error("Can not get PEM of private key", ex);
        }
        return pem;
    }

    public String getSelfSignedX509PEM() {
        String pem = "";
        try {
            certData.processCertData(true);
            if(pvtKey==null){
                newKeyPair();
            }
            KeyPair kp = new KeyPair(pubKey, pvtKey);
            KeyGenerator kg = new KeyGenerator(vimryptoParams.createDefault());
            X509Certificate cert = kg.createSerlfSignedX509v3(kp, certData);
            pem = kw.getX509CertificatePEM(cert);            
        } catch (CryptoNotValidException | IOException ex) {
            log.error("Can not generate self-signed PEM", ex);
        }
        return pem;
    }
    
    public static boolean isValidIPAddresList(String ipList){
       boolean res = true;
       String[] addr = ipList.split(",");
       for(String a: addr){
           res = IPAddress.isValid(a)||IPAddress.isValidWithNetMask(a);
           if(!res){
               break;
           }
       }
       return res;
    }
    
    public static boolean isVaidDNSNameList(String nameList){
        boolean res = true;
        String[] names = nameList.split(",");
        String pattern = "^(([a-zA-Z0-9]|[a-zA-Z0-9][a-zA-Z0-9\\-]*[a-zA-Z0-9])\\.)*([A-Za-z0-9]|[A-Za-z0-9][A-Za-z0-9\\-]*[A-Za-z0-9])$";
        for (String n: names){
            res = n.matches(pattern);
            if(!res){
                break;
            }
        }
        return res;
    }
    
    @Override
    public String toString(){
        String res = "Vimana X.509 Certificate:\n";
        res+=   "CN="+getCN()+"\n"
               +"VimanaID="+getVimanaID().toString(16)+"\n";
        for(BigInteger hwid: getVimanaHardwareIDs()){
                res+="Vimana HW ID: "+hwid+"\n";
        }
        res+="emailAddress="+getEmial()+"\n";
        res+="Country="+getCountry()+ " State/Province="+getState()
                +" City="+getCity();
        res+="Organization="+getOrg()+" Org. Unit="+getOrgUnit()+"\n";
        res+="IP address="+getIP()+"\n";
        res+="DNS names="+getDNSNames()+"\n";
        return res; 
    }

    private void newKeyPair() {
        KeyGenerator kg = new KeyGenerator(vimryptoParams.createDefault());
        KeyPair kp = kg.generateKeys();
        pubKey = kp.getPublic();
        pvtKey = kp.getPrivate();
    }

    public void setCertPurpose(String certPurpose) {
        BasicClassificator cps = VimanaClassificators.getCls(VimanaClassificators.CERTPURPOSE_CLS);
        ClsItem item = cps.getItem(certPurpose);
        if(item==null){
          certData.setCSRType(CertificateRequestData.CSRType.HOST);
        }else{
            certData.setCSRType(CertificateRequestData.CSRType.valueOf(item.value));
        }
    }

}
