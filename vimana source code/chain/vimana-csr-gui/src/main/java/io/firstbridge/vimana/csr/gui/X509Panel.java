package io.vimana.vimana.csr.gui;

import io.vimana.vim.util.crypto.VimanaAuthorityID;
import io.vimana.vim.util.crypto.VimanaCertificate;
import io.vimana.vim.util.cls.BasicClassificator;
import io.vimana.vim.util.cls.ClsItem;
import io.vimana.vim.util.cls.VimanaClassificators;
import java.math.BigInteger;

/**
 *
 * @author alukin@gmail.com
 */
public class X509Panel extends VCPanel {

    /**
     * Creates new form CSRPanel
     * @param cfh Certificate file handler
     */
    public X509Panel(CsrFileHandler cfh) {
        super(cfh);
        cfh.isCSRFile = false;
        initComponents();
        setCertificate(fileHandler.getCertificate());
    }
    @Override
    public void fillFields() {       
    }
    
    private void setCertificate(VimanaCertificate cert){
        jTextFieldCertPurpose.setText(cert.getCertificatePurpose());
        jTextFieldSubjectCN.setText(cert.getCN());
        jTextFieldIPAddresses.setText(cert.fromList(cert.getIPAddresses()));
        jTextFieldDNSNAmes.setText(cert.fromList(cert.getDNSNames()));
        jTextFieldCountry.setText(cert.getCountry());
        jTextFieldCity.setText(cert.getCity());
        jTextFieldState.setText(cert.getStateOrProvince());
        jTextFieldOrganization.setText(cert.getOrganization());
        jTextFieldOrgUnit.setText(cert.getOrganizationUnit());
        jTextFieldEMail.setText(cert.getEmail());
        jTextFieldVimanaID.setText(cert.getVimanaId().toString(16));
        String hwids="";
        for(BigInteger id: cert.getVimanaHardwareIDs()){
            hwids+=id.toString(16);
            hwids+="\n";            
        }
        jTextAreaHardwareIDs.setText(hwids);
        VimanaAuthorityID vaid=cert.getVimanaAuthorityId();
        BasicClassificator ac = VimanaClassificators.getCls(VimanaClassificators.ACTOR_CLS);
        BasicClassificator rc = VimanaClassificators.getCls(VimanaClassificators.REGION_CLS);
        BasicClassificator bc = VimanaClassificators.getCls(VimanaClassificators.BUSINESS_CLS);
        BasicClassificator auc = VimanaClassificators.getCls(VimanaClassificators.AUTORITY_CLS);
        BasicClassificator oc = VimanaClassificators.getCls(VimanaClassificators.OPERATIONS_CLS);
        BasicClassificator sc = VimanaClassificators.getCls(VimanaClassificators.SUPL_CLS);
        if(vaid!=null){
            ClsItem at = ac.findByValue(vaid.getVimanaActorType().getType());
            jTextFieldActorType.setText(at.name);
            jTextFieldSubType.setText(ac.findByValue(vaid.getVimanaActorType().getSubType(),at.name).name);
            jTextFieldRegionCode.setText(rc.findByValue(vaid.getRegionCode().toString()).name);
            jTextFieldBusinessCode.setText(bc.findByValue(vaid.getBusinessCode()).name);
            jTextFieldauthorityCode.setText(auc.findByValue(vaid.getAuthorityCode()).name);
            jTextFieldOperationCode.setText(oc.findByValue(vaid.getOperationCode()).name);
            jTextFieldSpulementalCode.setText(sc.findByValue(vaid.getSuplementalCode()).name);
        }
    }
    /**
     * This method is called from within the constructor to initialize the form.
     * WARNING: Do NOT modify this code. The content of this method is always
     * regenerated by the Form Editor.
     */
    @SuppressWarnings("unchecked")
    // <editor-fold defaultstate="collapsed" desc="Generated Code">//GEN-BEGIN:initComponents
    private void initComponents() {

        jPanelVimanaAttributes = new javax.swing.JPanel();
        jLabelVimanaId = new javax.swing.JLabel();
        jTextFieldVimanaID = new javax.swing.JTextField();
        jLabelHardwareIDs = new javax.swing.JLabel();
        jLabelAuthorityAttributes = new javax.swing.JLabel();
        jLabelActorType = new javax.swing.JLabel();
        jLabelSubtype = new javax.swing.JLabel();
        jLabelRegionCode = new javax.swing.JLabel();
        jLabelBusinessCode = new javax.swing.JLabel();
        jLabelAuthorityCode = new javax.swing.JLabel();
        jLabelOperationsCode = new javax.swing.JLabel();
        jLabelSuplementalCode = new javax.swing.JLabel();
        jTextFieldActorType = new javax.swing.JTextField();
        jTextFieldSubType = new javax.swing.JTextField();
        jTextFieldRegionCode = new javax.swing.JTextField();
        jTextFieldBusinessCode = new javax.swing.JTextField();
        jTextFieldauthorityCode = new javax.swing.JTextField();
        jTextFieldOperationCode = new javax.swing.JTextField();
        jTextFieldSpulementalCode = new javax.swing.JTextField();
        jScrollPane3 = new javax.swing.JScrollPane();
        jTextAreaHardwareIDs = new javax.swing.JTextArea();
        jPanelGenericAttributes = new javax.swing.JPanel();
        jLabelCertificatePurpose = new javax.swing.JLabel();
        jLabelSubjectCN = new javax.swing.JLabel();
        jTextFieldSubjectCN = new javax.swing.JTextField();
        jLabelCountry = new javax.swing.JLabel();
        jLabelState = new javax.swing.JLabel();
        jLabelCity = new javax.swing.JLabel();
        jLabelOrganization = new javax.swing.JLabel();
        jLabelOrgUnit = new javax.swing.JLabel();
        jLabelEMail = new javax.swing.JLabel();
        jTextFieldOrganization = new javax.swing.JTextField();
        jTextFieldOrgUnit = new javax.swing.JTextField();
        jTextFieldEMail = new javax.swing.JTextField();
        jLabelIPAddress = new javax.swing.JLabel();
        jTextFieldIPAddresses = new javax.swing.JTextField();
        jLabelDNSNames = new javax.swing.JLabel();
        jTextFieldDNSNAmes = new javax.swing.JTextField();
        jTextFieldCountry = new javax.swing.JTextField();
        jTextFieldState = new javax.swing.JTextField();
        jTextFieldCity = new javax.swing.JTextField();
        jTextFieldCertPurpose = new javax.swing.JTextField();
        jPanelPrevCertInfo = new javax.swing.JPanel();
        jScrollPane2 = new javax.swing.JScrollPane();
        jTextAreaPrevCertInfo = new javax.swing.JTextArea();

        setLayout(new java.awt.BorderLayout());

        jPanelVimanaAttributes.setBorder(javax.swing.BorderFactory.createTitledBorder("Vimana Attributes"));

        jLabelVimanaId.setText("VimanaID");

        jTextFieldVimanaID.setEditable(false);
        jTextFieldVimanaID.setText("VimanaID");

        jLabelHardwareIDs.setText("Hardware IDs");

        jLabelAuthorityAttributes.setText("Vimana Authority ID attributes");

        jLabelActorType.setText("Actor Type");

        jLabelSubtype.setText("Subtype");

        jLabelRegionCode.setText("Region code");

        jLabelBusinessCode.setText("Business Code");

        jLabelAuthorityCode.setText("Authority Code");

        jLabelOperationsCode.setText("Operations Code");

        jLabelSuplementalCode.setText("Suplemental Code");

        jTextFieldActorType.setEditable(false);
        jTextFieldActorType.setText("Actor Type");

        jTextFieldSubType.setEditable(false);
        jTextFieldSubType.setText("Actor Subtype");

        jTextFieldRegionCode.setEditable(false);
        jTextFieldRegionCode.setText("Region Code");

        jTextFieldBusinessCode.setEditable(false);
        jTextFieldBusinessCode.setText("Business code");

        jTextFieldauthorityCode.setEditable(false);
        jTextFieldauthorityCode.setText("AutorityCode");

        jTextFieldOperationCode.setEditable(false);
        jTextFieldOperationCode.setText("OperationsCode");

        jTextFieldSpulementalCode.setEditable(false);
        jTextFieldSpulementalCode.setText("SuplementalCode");

        jTextAreaHardwareIDs.setColumns(20);
        jTextAreaHardwareIDs.setRows(5);
        jScrollPane3.setViewportView(jTextAreaHardwareIDs);

        javax.swing.GroupLayout jPanelVimanaAttributesLayout = new javax.swing.GroupLayout(jPanelVimanaAttributes);
        jPanelVimanaAttributes.setLayout(jPanelVimanaAttributesLayout);
        jPanelVimanaAttributesLayout.setHorizontalGroup(
            jPanelVimanaAttributesLayout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING)
            .addGroup(jPanelVimanaAttributesLayout.createSequentialGroup()
                .addGroup(jPanelVimanaAttributesLayout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING)
                    .addGroup(jPanelVimanaAttributesLayout.createSequentialGroup()
                        .addGroup(jPanelVimanaAttributesLayout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING)
                            .addComponent(jLabelActorType)
                            .addComponent(jTextFieldActorType, javax.swing.GroupLayout.PREFERRED_SIZE, javax.swing.GroupLayout.DEFAULT_SIZE, javax.swing.GroupLayout.PREFERRED_SIZE))
                        .addPreferredGap(javax.swing.LayoutStyle.ComponentPlacement.RELATED)
                        .addGroup(jPanelVimanaAttributesLayout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING)
                            .addGroup(jPanelVimanaAttributesLayout.createSequentialGroup()
                                .addGap(1, 1, 1)
                                .addComponent(jTextFieldSubType, javax.swing.GroupLayout.PREFERRED_SIZE, javax.swing.GroupLayout.DEFAULT_SIZE, javax.swing.GroupLayout.PREFERRED_SIZE))
                            .addComponent(jLabelSubtype))
                        .addPreferredGap(javax.swing.LayoutStyle.ComponentPlacement.UNRELATED)
                        .addGroup(jPanelVimanaAttributesLayout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING, false)
                            .addGroup(jPanelVimanaAttributesLayout.createSequentialGroup()
                                .addComponent(jTextFieldRegionCode, javax.swing.GroupLayout.PREFERRED_SIZE, 114, javax.swing.GroupLayout.PREFERRED_SIZE)
                                .addPreferredGap(javax.swing.LayoutStyle.ComponentPlacement.UNRELATED)
                                .addComponent(jTextFieldBusinessCode, javax.swing.GroupLayout.PREFERRED_SIZE, 111, javax.swing.GroupLayout.PREFERRED_SIZE)
                                .addPreferredGap(javax.swing.LayoutStyle.ComponentPlacement.RELATED)
                                .addComponent(jTextFieldauthorityCode, javax.swing.GroupLayout.PREFERRED_SIZE, 121, javax.swing.GroupLayout.PREFERRED_SIZE)
                                .addPreferredGap(javax.swing.LayoutStyle.ComponentPlacement.RELATED)
                                .addComponent(jTextFieldOperationCode))
                            .addGroup(jPanelVimanaAttributesLayout.createSequentialGroup()
                                .addComponent(jLabelRegionCode)
                                .addGap(41, 41, 41)
                                .addComponent(jLabelBusinessCode)
                                .addGap(18, 18, 18)
                                .addComponent(jLabelAuthorityCode)
                                .addGap(27, 27, 27)
                                .addComponent(jLabelOperationsCode)))
                        .addGap(18, 18, 18)
                        .addGroup(jPanelVimanaAttributesLayout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING)
                            .addGroup(jPanelVimanaAttributesLayout.createSequentialGroup()
                                .addComponent(jLabelSuplementalCode)
                                .addGap(0, 0, Short.MAX_VALUE))
                            .addComponent(jTextFieldSpulementalCode)))
                    .addGroup(jPanelVimanaAttributesLayout.createSequentialGroup()
                        .addGroup(jPanelVimanaAttributesLayout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING)
                            .addComponent(jLabelAuthorityAttributes)
                            .addGroup(jPanelVimanaAttributesLayout.createSequentialGroup()
                                .addComponent(jLabelVimanaId)
                                .addGap(38, 38, 38)
                                .addComponent(jTextFieldVimanaID, javax.swing.GroupLayout.PREFERRED_SIZE, 317, javax.swing.GroupLayout.PREFERRED_SIZE)
                                .addGap(61, 61, 61)
                                .addComponent(jLabelHardwareIDs)))
                        .addPreferredGap(javax.swing.LayoutStyle.ComponentPlacement.UNRELATED)
                        .addComponent(jScrollPane3, javax.swing.GroupLayout.DEFAULT_SIZE, 351, Short.MAX_VALUE)))
                .addContainerGap())
        );
        jPanelVimanaAttributesLayout.setVerticalGroup(
            jPanelVimanaAttributesLayout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING)
            .addGroup(jPanelVimanaAttributesLayout.createSequentialGroup()
                .addContainerGap()
                .addGroup(jPanelVimanaAttributesLayout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING)
                    .addGroup(jPanelVimanaAttributesLayout.createSequentialGroup()
                        .addGroup(jPanelVimanaAttributesLayout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING)
                            .addGroup(jPanelVimanaAttributesLayout.createParallelGroup(javax.swing.GroupLayout.Alignment.BASELINE)
                                .addComponent(jLabelVimanaId)
                                .addComponent(jTextFieldVimanaID, javax.swing.GroupLayout.PREFERRED_SIZE, javax.swing.GroupLayout.DEFAULT_SIZE, javax.swing.GroupLayout.PREFERRED_SIZE))
                            .addComponent(jLabelHardwareIDs))
                        .addGap(47, 47, 47)
                        .addComponent(jLabelAuthorityAttributes))
                    .addComponent(jScrollPane3, javax.swing.GroupLayout.PREFERRED_SIZE, 67, javax.swing.GroupLayout.PREFERRED_SIZE))
                .addPreferredGap(javax.swing.LayoutStyle.ComponentPlacement.RELATED)
                .addGroup(jPanelVimanaAttributesLayout.createParallelGroup(javax.swing.GroupLayout.Alignment.BASELINE)
                    .addComponent(jLabelActorType)
                    .addComponent(jLabelSubtype)
                    .addComponent(jLabelRegionCode)
                    .addComponent(jLabelBusinessCode)
                    .addComponent(jLabelAuthorityCode)
                    .addComponent(jLabelOperationsCode)
                    .addComponent(jLabelSuplementalCode))
                .addPreferredGap(javax.swing.LayoutStyle.ComponentPlacement.RELATED)
                .addGroup(jPanelVimanaAttributesLayout.createParallelGroup(javax.swing.GroupLayout.Alignment.BASELINE)
                    .addComponent(jTextFieldActorType, javax.swing.GroupLayout.PREFERRED_SIZE, javax.swing.GroupLayout.DEFAULT_SIZE, javax.swing.GroupLayout.PREFERRED_SIZE)
                    .addComponent(jTextFieldSubType, javax.swing.GroupLayout.PREFERRED_SIZE, javax.swing.GroupLayout.DEFAULT_SIZE, javax.swing.GroupLayout.PREFERRED_SIZE)
                    .addComponent(jTextFieldRegionCode, javax.swing.GroupLayout.PREFERRED_SIZE, javax.swing.GroupLayout.DEFAULT_SIZE, javax.swing.GroupLayout.PREFERRED_SIZE)
                    .addComponent(jTextFieldBusinessCode, javax.swing.GroupLayout.PREFERRED_SIZE, javax.swing.GroupLayout.DEFAULT_SIZE, javax.swing.GroupLayout.PREFERRED_SIZE)
                    .addComponent(jTextFieldauthorityCode, javax.swing.GroupLayout.PREFERRED_SIZE, javax.swing.GroupLayout.DEFAULT_SIZE, javax.swing.GroupLayout.PREFERRED_SIZE)
                    .addComponent(jTextFieldOperationCode, javax.swing.GroupLayout.PREFERRED_SIZE, javax.swing.GroupLayout.DEFAULT_SIZE, javax.swing.GroupLayout.PREFERRED_SIZE)
                    .addComponent(jTextFieldSpulementalCode, javax.swing.GroupLayout.PREFERRED_SIZE, javax.swing.GroupLayout.DEFAULT_SIZE, javax.swing.GroupLayout.PREFERRED_SIZE))
                .addContainerGap(25, Short.MAX_VALUE))
        );

        add(jPanelVimanaAttributes, java.awt.BorderLayout.CENTER);

        jPanelGenericAttributes.setBorder(javax.swing.BorderFactory.createTitledBorder("Generic attributes"));

        jLabelCertificatePurpose.setText("Certificate Purpose");

        jLabelSubjectCN.setLabelFor(jTextFieldSubjectCN);
        jLabelSubjectCN.setText("CN, Common Name");

        jTextFieldSubjectCN.setEditable(false);
        jTextFieldSubjectCN.setText("Please enter Subject CN");

        jLabelCountry.setText("Country");

        jLabelState.setText("State/Province");

        jLabelCity.setText("City");

        jLabelOrganization.setText("Organization");

        jLabelOrgUnit.setText("Org. Unit");

        jLabelEMail.setText("E-mail");

        jTextFieldOrganization.setEditable(false);
        jTextFieldOrganization.setText("Please enter Organization");

        jTextFieldOrgUnit.setEditable(false);
        jTextFieldOrgUnit.setText("Please enter Org unit");

        jTextFieldEMail.setEditable(false);
        jTextFieldEMail.setText("Please neter e-mail");

        jLabelIPAddress.setText("IP addresseses");

        jTextFieldIPAddresses.setEditable(false);
        jTextFieldIPAddresses.setText("IP 4 or IP6 coma separated");

        jLabelDNSNames.setText("DNS names ");

        jTextFieldDNSNAmes.setEditable(false);
        jTextFieldDNSNAmes.setText(" DNS names coma separated");

        jTextFieldCountry.setEditable(false);
        jTextFieldCountry.setText("Cuntry");

        jTextFieldState.setEditable(false);
        jTextFieldState.setText("State/Province/Region");

        jTextFieldCity.setEditable(false);
        jTextFieldCity.setText("City");

        jTextFieldCertPurpose.setEditable(false);
        jTextFieldCertPurpose.setText("Certificate purpose");

        javax.swing.GroupLayout jPanelGenericAttributesLayout = new javax.swing.GroupLayout(jPanelGenericAttributes);
        jPanelGenericAttributes.setLayout(jPanelGenericAttributesLayout);
        jPanelGenericAttributesLayout.setHorizontalGroup(
            jPanelGenericAttributesLayout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING)
            .addGroup(jPanelGenericAttributesLayout.createSequentialGroup()
                .addGroup(jPanelGenericAttributesLayout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING)
                    .addComponent(jLabelCertificatePurpose)
                    .addComponent(jLabelSubjectCN)
                    .addComponent(jLabelIPAddress)
                    .addComponent(jLabelDNSNames))
                .addPreferredGap(javax.swing.LayoutStyle.ComponentPlacement.RELATED)
                .addGroup(jPanelGenericAttributesLayout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING, false)
                    .addComponent(jTextFieldSubjectCN)
                    .addComponent(jTextFieldIPAddresses)
                    .addComponent(jTextFieldDNSNAmes)
                    .addComponent(jTextFieldCertPurpose))
                .addPreferredGap(javax.swing.LayoutStyle.ComponentPlacement.UNRELATED)
                .addGroup(jPanelGenericAttributesLayout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING)
                    .addComponent(jLabelCity)
                    .addComponent(jLabelState)
                    .addComponent(jLabelCountry))
                .addPreferredGap(javax.swing.LayoutStyle.ComponentPlacement.UNRELATED)
                .addGroup(jPanelGenericAttributesLayout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING, false)
                    .addComponent(jTextFieldCountry)
                    .addComponent(jTextFieldState, javax.swing.GroupLayout.DEFAULT_SIZE, 198, Short.MAX_VALUE)
                    .addComponent(jTextFieldCity))
                .addPreferredGap(javax.swing.LayoutStyle.ComponentPlacement.UNRELATED)
                .addGroup(jPanelGenericAttributesLayout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING)
                    .addGroup(jPanelGenericAttributesLayout.createSequentialGroup()
                        .addGroup(jPanelGenericAttributesLayout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING)
                            .addComponent(jLabelOrganization)
                            .addComponent(jLabelOrgUnit))
                        .addGap(3, 3, 3)
                        .addGroup(jPanelGenericAttributesLayout.createParallelGroup(javax.swing.GroupLayout.Alignment.TRAILING)
                            .addComponent(jTextFieldOrgUnit, javax.swing.GroupLayout.Alignment.LEADING)
                            .addComponent(jTextFieldOrganization, javax.swing.GroupLayout.DEFAULT_SIZE, 175, Short.MAX_VALUE)))
                    .addGroup(jPanelGenericAttributesLayout.createSequentialGroup()
                        .addComponent(jLabelEMail)
                        .addPreferredGap(javax.swing.LayoutStyle.ComponentPlacement.UNRELATED)
                        .addComponent(jTextFieldEMail)))
                .addContainerGap())
        );
        jPanelGenericAttributesLayout.setVerticalGroup(
            jPanelGenericAttributesLayout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING)
            .addGroup(jPanelGenericAttributesLayout.createSequentialGroup()
                .addContainerGap()
                .addGroup(jPanelGenericAttributesLayout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING)
                    .addGroup(jPanelGenericAttributesLayout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING)
                        .addComponent(jTextFieldOrganization, javax.swing.GroupLayout.Alignment.TRAILING, javax.swing.GroupLayout.PREFERRED_SIZE, javax.swing.GroupLayout.DEFAULT_SIZE, javax.swing.GroupLayout.PREFERRED_SIZE)
                        .addGroup(jPanelGenericAttributesLayout.createParallelGroup(javax.swing.GroupLayout.Alignment.BASELINE)
                            .addComponent(jLabelCertificatePurpose)
                            .addComponent(jLabelCountry)
                            .addComponent(jLabelOrganization)
                            .addComponent(jTextFieldCertPurpose, javax.swing.GroupLayout.PREFERRED_SIZE, javax.swing.GroupLayout.DEFAULT_SIZE, javax.swing.GroupLayout.PREFERRED_SIZE)))
                    .addComponent(jTextFieldCountry, javax.swing.GroupLayout.Alignment.TRAILING, javax.swing.GroupLayout.PREFERRED_SIZE, javax.swing.GroupLayout.DEFAULT_SIZE, javax.swing.GroupLayout.PREFERRED_SIZE))
                .addGroup(jPanelGenericAttributesLayout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING)
                    .addGroup(jPanelGenericAttributesLayout.createSequentialGroup()
                        .addGap(6, 6, 6)
                        .addGroup(jPanelGenericAttributesLayout.createParallelGroup(javax.swing.GroupLayout.Alignment.BASELINE)
                            .addComponent(jLabelOrgUnit)
                            .addComponent(jTextFieldOrgUnit, javax.swing.GroupLayout.PREFERRED_SIZE, javax.swing.GroupLayout.DEFAULT_SIZE, javax.swing.GroupLayout.PREFERRED_SIZE))
                        .addPreferredGap(javax.swing.LayoutStyle.ComponentPlacement.RELATED)
                        .addComponent(jTextFieldEMail, javax.swing.GroupLayout.PREFERRED_SIZE, javax.swing.GroupLayout.DEFAULT_SIZE, javax.swing.GroupLayout.PREFERRED_SIZE)
                        .addGap(0, 0, Short.MAX_VALUE))
                    .addGroup(jPanelGenericAttributesLayout.createSequentialGroup()
                        .addPreferredGap(javax.swing.LayoutStyle.ComponentPlacement.RELATED)
                        .addGroup(jPanelGenericAttributesLayout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING)
                            .addGroup(jPanelGenericAttributesLayout.createSequentialGroup()
                                .addGroup(jPanelGenericAttributesLayout.createParallelGroup(javax.swing.GroupLayout.Alignment.BASELINE)
                                    .addComponent(jLabelState)
                                    .addComponent(jTextFieldState, javax.swing.GroupLayout.PREFERRED_SIZE, javax.swing.GroupLayout.DEFAULT_SIZE, javax.swing.GroupLayout.PREFERRED_SIZE))
                                .addPreferredGap(javax.swing.LayoutStyle.ComponentPlacement.RELATED)
                                .addGroup(jPanelGenericAttributesLayout.createParallelGroup(javax.swing.GroupLayout.Alignment.BASELINE)
                                    .addComponent(jLabelCity)
                                    .addComponent(jLabelEMail)
                                    .addComponent(jTextFieldCity, javax.swing.GroupLayout.PREFERRED_SIZE, javax.swing.GroupLayout.DEFAULT_SIZE, javax.swing.GroupLayout.PREFERRED_SIZE)))
                            .addGroup(jPanelGenericAttributesLayout.createSequentialGroup()
                                .addGroup(jPanelGenericAttributesLayout.createParallelGroup(javax.swing.GroupLayout.Alignment.BASELINE)
                                    .addComponent(jLabelSubjectCN)
                                    .addComponent(jTextFieldSubjectCN, javax.swing.GroupLayout.PREFERRED_SIZE, javax.swing.GroupLayout.DEFAULT_SIZE, javax.swing.GroupLayout.PREFERRED_SIZE))
                                .addPreferredGap(javax.swing.LayoutStyle.ComponentPlacement.RELATED)
                                .addGroup(jPanelGenericAttributesLayout.createParallelGroup(javax.swing.GroupLayout.Alignment.BASELINE)
                                    .addComponent(jLabelIPAddress)
                                    .addComponent(jTextFieldIPAddresses, javax.swing.GroupLayout.PREFERRED_SIZE, javax.swing.GroupLayout.DEFAULT_SIZE, javax.swing.GroupLayout.PREFERRED_SIZE))))
                        .addPreferredGap(javax.swing.LayoutStyle.ComponentPlacement.RELATED, 10, Short.MAX_VALUE)
                        .addGroup(jPanelGenericAttributesLayout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING)
                            .addComponent(jLabelDNSNames, javax.swing.GroupLayout.Alignment.TRAILING)
                            .addComponent(jTextFieldDNSNAmes, javax.swing.GroupLayout.Alignment.TRAILING, javax.swing.GroupLayout.PREFERRED_SIZE, javax.swing.GroupLayout.DEFAULT_SIZE, javax.swing.GroupLayout.PREFERRED_SIZE)))))
        );

        add(jPanelGenericAttributes, java.awt.BorderLayout.PAGE_START);

        jPanelPrevCertInfo.setBorder(javax.swing.BorderFactory.createTitledBorder("Previous certificate Info"));

        jTextAreaPrevCertInfo.setEditable(false);
        jTextAreaPrevCertInfo.setColumns(20);
        jTextAreaPrevCertInfo.setRows(5);
        jTextAreaPrevCertInfo.setText("Can not access previous certificate");
        jScrollPane2.setViewportView(jTextAreaPrevCertInfo);

        javax.swing.GroupLayout jPanelPrevCertInfoLayout = new javax.swing.GroupLayout(jPanelPrevCertInfo);
        jPanelPrevCertInfo.setLayout(jPanelPrevCertInfoLayout);
        jPanelPrevCertInfoLayout.setHorizontalGroup(
            jPanelPrevCertInfoLayout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING)
            .addComponent(jScrollPane2, javax.swing.GroupLayout.Alignment.TRAILING, javax.swing.GroupLayout.DEFAULT_SIZE, 953, Short.MAX_VALUE)
        );
        jPanelPrevCertInfoLayout.setVerticalGroup(
            jPanelPrevCertInfoLayout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING)
            .addGroup(jPanelPrevCertInfoLayout.createSequentialGroup()
                .addComponent(jScrollPane2, javax.swing.GroupLayout.PREFERRED_SIZE, 126, javax.swing.GroupLayout.PREFERRED_SIZE)
                .addGap(0, 2, Short.MAX_VALUE))
        );

        add(jPanelPrevCertInfo, java.awt.BorderLayout.PAGE_END);
    }// </editor-fold>//GEN-END:initComponents


    // Variables declaration - do not modify//GEN-BEGIN:variables
    private javax.swing.JLabel jLabelActorType;
    private javax.swing.JLabel jLabelAuthorityAttributes;
    private javax.swing.JLabel jLabelAuthorityCode;
    private javax.swing.JLabel jLabelBusinessCode;
    private javax.swing.JLabel jLabelCertificatePurpose;
    private javax.swing.JLabel jLabelCity;
    private javax.swing.JLabel jLabelCountry;
    private javax.swing.JLabel jLabelDNSNames;
    private javax.swing.JLabel jLabelEMail;
    private javax.swing.JLabel jLabelHardwareIDs;
    private javax.swing.JLabel jLabelIPAddress;
    private javax.swing.JLabel jLabelOperationsCode;
    private javax.swing.JLabel jLabelOrgUnit;
    private javax.swing.JLabel jLabelOrganization;
    private javax.swing.JLabel jLabelRegionCode;
    private javax.swing.JLabel jLabelState;
    private javax.swing.JLabel jLabelSubjectCN;
    private javax.swing.JLabel jLabelSubtype;
    private javax.swing.JLabel jLabelSuplementalCode;
    private javax.swing.JLabel jLabelVimanaId;
    private javax.swing.JPanel jPanelGenericAttributes;
    private javax.swing.JPanel jPanelPrevCertInfo;
    private javax.swing.JPanel jPanelVimanaAttributes;
    private javax.swing.JScrollPane jScrollPane2;
    private javax.swing.JScrollPane jScrollPane3;
    private javax.swing.JTextArea jTextAreaHardwareIDs;
    private javax.swing.JTextArea jTextAreaPrevCertInfo;
    private javax.swing.JTextField jTextFieldActorType;
    private javax.swing.JTextField jTextFieldBusinessCode;
    private javax.swing.JTextField jTextFieldCertPurpose;
    private javax.swing.JTextField jTextFieldCity;
    private javax.swing.JTextField jTextFieldCountry;
    private javax.swing.JTextField jTextFieldDNSNAmes;
    private javax.swing.JTextField jTextFieldEMail;
    private javax.swing.JTextField jTextFieldIPAddresses;
    private javax.swing.JTextField jTextFieldOperationCode;
    private javax.swing.JTextField jTextFieldOrgUnit;
    private javax.swing.JTextField jTextFieldOrganization;
    private javax.swing.JTextField jTextFieldRegionCode;
    private javax.swing.JTextField jTextFieldSpulementalCode;
    private javax.swing.JTextField jTextFieldState;
    private javax.swing.JTextField jTextFieldSubType;
    private javax.swing.JTextField jTextFieldSubjectCN;
    private javax.swing.JTextField jTextFieldVimanaID;
    private javax.swing.JTextField jTextFieldauthorityCode;
    // End of variables declaration//GEN-END:variables

}
