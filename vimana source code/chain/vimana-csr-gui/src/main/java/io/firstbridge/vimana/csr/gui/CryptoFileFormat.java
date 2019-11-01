package io.vimana.vimana.csr.gui;

import java.io.File;
import java.io.FileNotFoundException;
import java.util.Scanner;
import java.util.logging.Level;
import java.util.logging.Logger;
import java.util.regex.Pattern;

/**
 *
 * @author alukin@gmail.com
 */
public class CryptoFileFormat {

    public final static String CSR_PEM_HEADER = "-----BEGIN CERTIFICATE REQUEST-----";
    public final static String CSR_PEM_FOOTER = "-----END CERTIFICATE REQUEST-----";    
    public final static String CSR_PEM_HEADER_JKS = "-----BEGIN NEW CERTIFICATE REQUEST-----";
    public final static String CSR_PEM_FOOTER_JKS = "-----END NEW CERTIFICATE REQUEST-----";
    public final static String CERT_PEM_HEADER = "-----BEGIN CERTIFICATE----";
    public final static String CERT_PEM_FOOTER = "-----END CERTIFICATE----";
    public final static String ENCRYPTED_KEY_PEM_HEADER = "-----BEGIN ENCRYPTED PRIVATE KEY-----";
    public final static String ENCRYPTED_KEY_PEM_FOOTER = "-----BEGIN ENCRYPTED PRIVATE KEY-----";
    public final static String RSA_NP_KEY_PEM_HEADER = "-----BEGIN RSA PRIVATE KEY-----";
    public final static String RSA_NP_KEY_PEM_FOOTER = "-----END RSA PRIVATE KEY-----";
    public final static String ECC_NP_KEY_PEM_HEADER = "-----BEGIN PRIVATE KEY----";
    public final static String ECC_NP_KEY_PEM_FOOTER = "-----END PRIVATE KEY----";

    public final static String[] PEM_EXT = {".pem", ".cer"};
    public final static String[] PKCS12_EXT = {".p12", ".jks"};

    private boolean oneOf(String s, String[] a) {
        boolean found = false;
        for (String ae : a) {
            if (s.equalsIgnoreCase(ae)) {
                found = true;
                break;
            }
        }
        return found;
    }

    private FileFormatEnum decidePEM(String path) throws FileNotFoundException {
        boolean found = false;
        String txt = null;
        String target ="-----BEGIN";
        Pattern pattern = Pattern.compile("(?m)\\Q" + target + "\\E.*$");
        Scanner txtscan = new Scanner(new File(path));
        while ((txt = txtscan.findWithinHorizon(pattern, 0)) != null) {
          found = true;
          break;
        }
        if(!found){
            return FileFormatEnum.UNKNOWN;
        }
        if(txt.startsWith(CSR_PEM_HEADER)){
            return FileFormatEnum.PEM_CSR;            
        }
        if(txt.startsWith(CSR_PEM_HEADER_JKS)){
            return FileFormatEnum.PEM_CSR;            
        }        
        if(txt.startsWith(CERT_PEM_HEADER)){
            return FileFormatEnum.PEM_X509;
        }
        if(txt.startsWith(ENCRYPTED_KEY_PEM_HEADER)){
            return FileFormatEnum.PEM_KEY_ENCR;
        }
        if(txt.startsWith(RSA_NP_KEY_PEM_HEADER)){
            return FileFormatEnum.PEM_KEY_RSA;
        }
        if(txt.startsWith(ECC_NP_KEY_PEM_HEADER)){
            return FileFormatEnum.PEM_KEY;
        }
        return FileFormatEnum.UNKNOWN;
    }

    public FileFormatEnum getFileFormat(String path){
        FileFormatEnum res = FileFormatEnum.UNKNOWN;
        String ext = path.substring(path.lastIndexOf("."));
        if (oneOf(ext, PEM_EXT)) {
            try {
                res = decidePEM(path);
            } catch (FileNotFoundException ex) {
                res = FileFormatEnum.UNKNOWN;
            }
        } else if (oneOf(ext, PKCS12_EXT)) {
            res = FileFormatEnum.PKCS12;
        }
        return res;
    }

    public CryptoFileFormat() {
    }

}
