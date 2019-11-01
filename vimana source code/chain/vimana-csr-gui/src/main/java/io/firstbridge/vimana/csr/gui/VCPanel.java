
package io.vimana.vimana.csr.gui;

import javax.swing.JOptionPane;

/**
 *
 * @author alukin@gmail.com
 */
public abstract class VCPanel  extends javax.swing.JPanel {
    
   CsrFileHandler fileHandler;
   protected boolean isModified=false;
   
   public CsrFileHandler getFileHandler(){
       return fileHandler;
   }
   public abstract void fillFields();
   
    public VCPanel(CsrFileHandler fileHandler) {
        this.fileHandler = fileHandler;
    }

    void showPEM() {
       fillFields();
       ViewDialog dialog = new ViewDialog(new javax.swing.JFrame(), true);
       if(fileHandler.isCSRFile){
           String pem = fileHandler.getCSR().getPemPKCS10();
           dialog.setTitle("PEM view of CSR: "+fileHandler.getCSR().getCN());
           dialog.setViewText(pem);
           if(!fileHandler.selfSignedPem.isEmpty()){
              ViewDialog dialog2 = new ViewDialog(new javax.swing.JFrame(), true);
              dialog2.setTitle("PEM view of SELF-SIGNED x.509: "+fileHandler.getCSR().getCN());
              dialog.setViewText(fileHandler.selfSignedPem);              
           }
       }else{
           String pem = fileHandler.getCertificate().getPEM();
           dialog.setViewText(pem);
       }
       dialog.setVisible(true);
    }

    void showAsText() {
       fillFields(); 
       ViewDialog dialog = new ViewDialog(new javax.swing.JFrame(), true);
       if(fileHandler.isCSRFile){
           dialog.setViewText(fileHandler.getCSR().toString());
       }else{
           dialog.setViewText(fileHandler.getCertificate().toString());
       }       
       dialog.setVisible(true);       
    }

    void save() {
       fillFields(); 
       if(fileHandler.save()){
        isModified=false;
       }
    }
    
    void saveAs(){
       fillFields(); 
       if(fileHandler.saveAs(fileHandler.getProposedName())){
           isModified=false;
       }
    }
   
    int askSave() {
       int res = 0; 
       if(fileHandler.isCSRFile && isModified){
            res = JOptionPane.showConfirmDialog(null, 
                "File is modified. Save it?", "Save file...",JOptionPane.YES_NO_CANCEL_OPTION);
            if (res==JOptionPane.OK_OPTION){
                save();
            }
	// 0=yes, 1=no, 2=cancel   
       }
       return res;
    } 
    
    void errorMessage(String title, String message){
        fileHandler.errorWin(title, message);
    }

    void selfSign() {
        fillFields();
        if(fileHandler.isCSRFile){
            fileHandler.generateSelfSigned();
        }
    }

    void onClose() {
        if(fileHandler.isCSRFile && isModified){
            fileHandler.save();
        }
    }

}
