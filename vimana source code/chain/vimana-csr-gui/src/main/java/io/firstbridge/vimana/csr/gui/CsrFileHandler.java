package io.vimana.vimana.csr.gui;

import io.vimana.cryptolib.KeyReader;
import io.vimana.cryptolib.impl.KeyReaderImpl;
import io.vimana.vim.util.FilePath;
import io.vimana.vim.util.crypto.CertificateHolder;
import io.vimana.vim.util.crypto.CertificateLoader;
import io.vimana.vim.util.crypto.VimanaCSR;
import io.vimana.vim.util.crypto.VimanaCertificate;
import java.io.File;
import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.io.FileOutputStream;
import java.io.IOException;
import java.security.PrivateKey;
import javax.swing.JFileChooser;
import javax.swing.JFrame;
import javax.swing.JOptionPane;
import javax.swing.filechooser.FileNameExtensionFilter;
import javax.swing.filechooser.FileSystemView;

/**
 * Handles certificate, CSR and private key file open/save
 *
 * @author alukin@gmail.com
 */
public class CsrFileHandler {

    VimanaCertificate vc;
    VimanaCSR vcsr = new VimanaCSR();
    VimanaCertificate prevVC;
    String pvtKeyPem = "";
    String selfSignedPem = "";
    String pkcsPem = "";
    String filePath = "";
    FileFormatEnum fileFormat = FileFormatEnum.UNKNOWN;
    String alias = "";
    String storePass = "";
    boolean isCSRFile = true;

    public int openFileDialog(String title) {
        String message = "Unkown file format";
        int res = -1;
        JFileChooser jfc = new JFileChooser(FileSystemView.getFileSystemView().getHomeDirectory());
        jfc.setDialogTitle(title);
        jfc.setFileSelectionMode(JFileChooser.FILES_AND_DIRECTORIES);
        jfc.setFileFilter(new FileNameExtensionFilter("Keys tore or PEM", "jks", "pem", "p12"));
        int returnValue = jfc.showOpenDialog(null);
        if (returnValue == JFileChooser.APPROVE_OPTION) {
            String path = jfc.getSelectedFile().getPath();
            CryptoFileFormat cff = new CryptoFileFormat();
            FileFormatEnum ff = cff.getFileFormat(path);
            switch (ff) {
                case PEM_CSR:
                    loadPemCSR(path);
                    tryLoadPrivateKey(path);
                    break;
                case PEM_X509:
                    loadPemX509(path);
                    tryLoadPrivateKey(path);
                    break;
                case PEM_KEY:
                    loadPrivateKeyPem(path);
                    break;
                case PEM_KEY_ENCR:
                    loadPrivateKeyPemEncr(path);
                    break;
                case PKCS12:
                    loadPKCS12(path);
                    break;
                default: {
                    JOptionPane.showMessageDialog(new JFrame(), message, "File format Error",
                            JOptionPane.ERROR_MESSAGE);
                }
            }

            res = 0;
        }
        return res;
    }

    public VimanaCertificate getCertificate() {
        return vc;
    }

    public VimanaCSR getCSR() {
        return vcsr;
    }

    public boolean saveAs(String proposed) {
        boolean res = false;
        JFileChooser jfc = new JFileChooser(FileSystemView.getFileSystemView().getHomeDirectory()) {
            @Override
            public void approveSelection() {
                String fn = chekExtension(getSelectedFile().getPath(), "pem");
                File f = new File(fn);
                if (f.exists() && getDialogType() == SAVE_DIALOG) {
                    int result = JOptionPane.showConfirmDialog(this, "The file exists, overwrite?", "Existing file", JOptionPane.YES_NO_CANCEL_OPTION);
                    switch (result) {
                        case JOptionPane.YES_OPTION:
                            super.approveSelection();
                            return;
                        case JOptionPane.NO_OPTION:
                            return;
                        case JOptionPane.CLOSED_OPTION:
                            return;
                        case JOptionPane.CANCEL_OPTION:
                            cancelSelection();
                            return;
                    }
                }
                super.approveSelection();
            }

        };
        jfc.setSelectedFile(new File(proposed));
        jfc.setDialogTitle("Choose a file to save");
        jfc.setFileSelectionMode(JFileChooser.FILES_AND_DIRECTORIES);

        jfc.setFileFilter(
                new FileNameExtensionFilter("PEM files", "pem"));
        int returnValue = jfc.showSaveDialog(null);

        if (returnValue == JFileChooser.APPROVE_OPTION) {
            String path = jfc.getSelectedFile().getPath();
            if (isCSRFile) {
                filePath = chekExtension(path, "pem");
                res = writeCSRArtefacts(filePath);
            } else {
                errorWin("File save error", "X509 saving is not implemented yet");
            }
        }
        return res;
    }

    public boolean save() {
        boolean res = false;
        if (filePath.isEmpty()) {
            res = saveAs(getProposedName());
        } else {
            if (isCSRFile) {
                writeCSRArtefacts(filePath);
            } else {
                //do nothing with cert
            }
        }
        return res;
    }

    private boolean writeCSRArtefacts(String path) {
        boolean res = false;
        pkcsPem = vcsr.getPemPKCS10();
        pvtKeyPem = vcsr.getPrivateKeyPEM();
        selfSignedPem = vcsr.getSelfSignedX509PEM();
        res = writeFile(CertificateHolder.csrFileName(path), pkcsPem);
        res = res && writeFile(CertificateHolder.pvtKeyFileName(path), pvtKeyPem);
        res = res && writeFile(CertificateHolder.selfSignedFileName(path), selfSignedPem);
        return res;
    }

    private void loadPemX509(String path) {
        CertificateLoader cl = new CertificateLoader();
        vc = cl.loadCertificate(path);
        filePath = path;
        isCSRFile = false;
    }

    public void loadPemCSR(String path) {
        CertificateLoader cl = new CertificateLoader();
        vcsr = cl.loadCSR(path);
        isCSRFile = true;
        filePath = path;
    }

    public VimanaCSR newCSR(VimanaCertificate cert) {
        prevVC = cert;
        vcsr = VimanaCSR.fromCertificate(cert);
        return vcsr;
    }

    private void loadPKCS12(String path) {
        String message = "PKCS#12 (JKS) file format is not supported yet";
        errorWin("File load error", message);
    }

    public String generateSelfSigned() {
        if (vcsr != null) {
            selfSignedPem = vcsr.getSelfSignedX509PEM();
            pvtKeyPem = vcsr.getPrivateKeyPEM();
        }
        return selfSignedPem;
    }

    private boolean writeFile(String path, String content) {
        if (content.isEmpty()) {
            return true;
        }
        FileOutputStream fos = null;
        boolean res = false;
        try {
            fos = new FileOutputStream(path);
            fos.write(content.getBytes());
            res = true;
        } catch (FileNotFoundException ex) {
            errorWin("Fire write error", "File not found: " + path);
        } catch (IOException ex) {
            errorWin("Fire write error", "File write error: " + path);
        } finally {
            try {
                fos.close();
            } catch (IOException ex) {
                errorWin("Fire write error", "File close error: " + path);
            }
        }
        return res;
    }

    private void loadPrivateKeyPem(String path) {
        KeyReader kr = new KeyReaderImpl();
        boolean keyOK = false;
        try {
            PrivateKey pvtKey = kr.readPrivateKeyPEM(new FileInputStream(path));
            if (isCSRFile) {

                keyOK = vcsr.checkKeys(pvtKey);
                if (keyOK) {
                    vcsr.setPrivateKey(pvtKey);
                } else {
                    errorWin("Key error", "Private key is not from this CSR");
                }
            } else {
                keyOK = vc.checkKeys(pvtKey);
                if (keyOK) {
                    vc.setPrivateKey(pvtKey);
                } else {
                    errorWin("Key error", "Private key is not from this X.509");
                }
            }

        } catch (IOException ex) {
            errorWin("Private KEy error", "Can not load private key" + path);
        }
    }

    private void loadPrivateKeyPemEncr(String path) {
        errorWin("Not implemented", "Sorry, encrypted key reading is not implememted yet");
    }

    private String chekExtension(String fn, String ext) {
        String res = fn;
        FilePath fp = new FilePath(fn);
        String fn_ext = fp.getExtension();
        if (!fn_ext.equalsIgnoreCase(ext)) {
            res = fp.addExtension(ext);
        }
        return res;
    }

  
     
    public void errorWin(String title, String message) {
        JOptionPane.showMessageDialog(new JFrame(), message, title,
                JOptionPane.ERROR_MESSAGE);
    }

    private void tryLoadPrivateKey(String path) {
        if (OptionsSingleton.getInstance().isLoadPrivateKey()) {
            String pkn = CertificateHolder.pvtKeyFileName(path);
            File pkf = new File(path);
            if (pkf.exists() & pkf.canRead()) {
                loadPrivateKeyPem(pkn);
            } else {
                openFileDialog("Load private key");
            }
        }
    }

    public String getProposedName() {
        String res = "Untitled.pem";
        //TODO: JKS
        if (isCSRFile) {
            res = vcsr.getCN() + "_req.pem";
        } else {
            res = vc.getCN() + "_cert.pem";
        }
        return res;
    }

}
