/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package io.vimana.vimana.csr.gui;

/**
 *
 * @author al
 */
public class ViewDialog extends javax.swing.JDialog {

    /**
     * Creates new form ViewDialog
     */
    public ViewDialog(java.awt.Frame parent, boolean modal) {
        super(parent, modal);
        initComponents();
    }
    
    public void setViewText(String text){
       jTextAreaViewer.setText(text);
    }
    /**
     * This method is called from within the constructor to initialize the form.
     * WARNING: Do NOT modify this code. The content of this method is always
     * regenerated by the Form Editor.
     */
    @SuppressWarnings("unchecked")
    // <editor-fold defaultstate="collapsed" desc="Generated Code">//GEN-BEGIN:initComponents
    private void initComponents() {

        jScrollPaneViewer = new javax.swing.JScrollPane();
        jTextAreaViewer = new javax.swing.JTextArea();

        setDefaultCloseOperation(javax.swing.WindowConstants.DISPOSE_ON_CLOSE);

        jTextAreaViewer.setEditable(false);
        jTextAreaViewer.setColumns(20);
        jTextAreaViewer.setRows(5);
        jScrollPaneViewer.setViewportView(jTextAreaViewer);

        getContentPane().add(jScrollPaneViewer, java.awt.BorderLayout.CENTER);

        pack();
    }// </editor-fold>//GEN-END:initComponents

 
    // Variables declaration - do not modify//GEN-BEGIN:variables
    private javax.swing.JScrollPane jScrollPaneViewer;
    private javax.swing.JTextArea jTextAreaViewer;
    // End of variables declaration//GEN-END:variables
}
