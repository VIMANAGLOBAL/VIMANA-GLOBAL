/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package io.vimana.vimana.csr.gui;

import io.vimana.vim.util.crypto.VimanaCSR;
import io.vimana.vim.util.crypto.VimanaCertificate;
import io.vimana.vim.util.cls.BasicClassificator;
import io.vimana.vim.util.cls.ClsItem;
import io.vimana.vim.util.cls.VimanaClassificators;
import io.vimana.vim.util.crypto.VimanaAuthorityID;
import java.math.BigInteger;
import java.security.SecureRandom;
import java.util.ArrayList;
import java.util.List;
import org.bouncycastle.util.Arrays;

/**
 *
 * @author al
 */
public class CSRPanel extends VCPanel {

    /**
     * Creates new form CSRPanel
     *
     * @param cfh
     */
    public CSRPanel(CsrFileHandler cfh) {
        super(cfh);
        cfh.isCSRFile = true;
        initComponents();
        setupCombos();
        setCSR(cfh.getCSR());
    }

    @Override
    public void fillFields() {
        VimanaCSR csr = fileHandler.getCSR();
        //must be very fisrt
        String certPurpose = (String)jComboBoxCertificatePurpose.getSelectedItem();
        csr.setCertPurpose(certPurpose);
        
        csr.setCN(jTextFieldSubjectCN.getText());
        String ip_str = jTextFieldIPAddresses.getText();
        try {
            csr.setIP(ip_str);
        } catch (IllegalArgumentException ex) {
            errorMessage("IP address error", "Can not parse IP addresses: " + ip_str + " It must be valid IP coma-separated address list");
        }
        String dns_str = jTextFieldDNSNAmes.getText();
        try {
            csr.setDNSNames(dns_str);
        } catch (IllegalArgumentException ex) {
            errorMessage("IP address error", "Can not parse IP addresses: " + ip_str + " It must be valid IP coma-separated address list");
        }
        char[] cp1 = jPasswordFieldChallenge.getPassword();
        char[] cp2 = jPasswordFieldChallenge2.getPassword();
        if (cp1.length > 0) {
            if (!Arrays.areEqual(cp1, cp2)) {
                errorMessage("Challenge password error", "Passwords does not match!");
            } else {
                csr.setChallengePassword(new String(cp1));
            }
        }
        csr.setCountry((String) jComboBoxCountry.getSelectedItem());
        csr.setState((String) jComboBoxState.getSelectedItem());
        csr.setCity((String) jComboBoxCity.getSelectedItem());
        csr.setOrg((String) jTextFieldOrganization.getText());
        csr.setOrgUnit((String) jTextFieldOrgUnit.getText());
        String email = jTextFieldEMail.getText();
        try {
            csr.setEmail(email);
        } catch (IllegalArgumentException ex) {
            errorMessage("Email error", "Can not parse EMail addresses: " + email + " It must be valid e-mail address");
        }

        String vid_str = jTextFieldVimanaID.getText();
        try {
            BigInteger vid = new BigInteger(vid_str, 16);
            csr.setVimanaID(vid);
        } catch (NumberFormatException ex) {
            errorMessage("VimanID error", "Can not parse VimanID: " + vid_str + " It must be HEX number!");
        }
        String hwIds = jTextAreaHardwareIDs.getText();
        try {
            List<BigInteger> idList = listToId(hwIds);
            for (BigInteger id : idList) {
                csr.addVimanaHardwareID(id);
            }
        } catch (NumberFormatException ex) {
            errorMessage("Hardware ID error", "Can not parse Hardware ID: " + hwIds + " It must be HEX number!");
        }
        String actorType = (String)jComboBoxActorType.getSelectedItem();
        String actorSubType = (String)jComboBoxSubType.getSelectedItem();
        String businessCode = (String)jComboBoxBusinessCode.getSelectedItem();
        String regionCode = (String)jComboBoxRegionCode.getSelectedItem();
        String opCode = (String)jComboBoxOperationsCode.getSelectedItem();
        String supCode = (String)jComboBoxSuplementalCode.getSelectedItem();
        VimanaAuthorityID vaid = VimanaAuthorityID.fromStrings(actorType,actorSubType,businessCode,regionCode,opCode,supCode);
    }

    private List<BigInteger> listToId(String list) {
        List<BigInteger> res = new ArrayList<>();
        if (list != null && !list.isEmpty()) {
            boolean hwIdOk = true;
            String[] ids = list.trim().split(",");
            for (String id : ids) {
                BigInteger bid = new BigInteger(id.trim(), 16);
                res.add(bid);
            }
        }
        return res;
    }

    private void setupCombos() {
        BasicClassificator cp = VimanaClassificators.getCls(VimanaClassificators.CERTPURPOSE_CLS);
        jComboBoxActorType.removeAllItems();
        for (ClsItem item : cp.getAllChilds()) {
            jComboBoxCertificatePurpose.addItem(item.name);
        }        
        BasicClassificator ac = VimanaClassificators.getCls(VimanaClassificators.ACTOR_CLS);
        jComboBoxActorType.removeAllItems();
        for (ClsItem item : ac.getAllChilds()) {
            jComboBoxActorType.addItem(item.name);
        }
        jComboBoxSubType.removeAllItems();
        String at = (String) jComboBoxActorType.getSelectedItem();
        for (ClsItem item : ac.getAllChilds(at)) {
            jComboBoxSubType.addItem(item.name);
        }
        jComboBoxRegionCode.removeAllItems();
        BasicClassificator rc = VimanaClassificators.getCls(VimanaClassificators.REGION_CLS);
        for (ClsItem item : rc.getAllChilds()) {
            jComboBoxRegionCode.addItem(item.name);
        }

        BasicClassificator bc = VimanaClassificators.getCls(VimanaClassificators.BUSINESS_CLS);
        jComboBoxBusinessCode.removeAllItems();
        for (ClsItem item : bc.getAllChilds()) {
            jComboBoxBusinessCode.addItem(item.name);
        }
        BasicClassificator auc = VimanaClassificators.getCls(VimanaClassificators.AUTORITY_CLS);
        jComboBoxAuthorityCode.removeAllItems();
        for (ClsItem item : auc.getAllChilds()) {
            jComboBoxAuthorityCode.addItem(item.name);
        }
        BasicClassificator oc = VimanaClassificators.getCls(VimanaClassificators.OPERATIONS_CLS);
        jComboBoxOperationsCode.removeAllItems();
        for (ClsItem item : oc.getAllChilds()) {
            jComboBoxOperationsCode.addItem(item.name);
        }
        BasicClassificator sc = VimanaClassificators.getCls(VimanaClassificators.SUPL_CLS);
        jComboBoxSuplementalCode.removeAllItems();
        for (ClsItem item : sc.getAllChilds()) {
            jComboBoxSuplementalCode.addItem(item.name);
        }
        BasicClassificator cc = VimanaClassificators.getCls(VimanaClassificators.COUNTRY_CLS);
        jComboBoxCountry.removeAllItems();
        for (ClsItem item : cc.getAllChilds()) {
            jComboBoxCountry.addItem(item.name);
        }
        jComboBoxState.removeAllItems();
        String cat = (String) jComboBoxCountry.getSelectedItem();
        for (ClsItem item : cc.getAllChilds(cat)) {
            jComboBoxState.addItem(item.name);
        }
        jComboBoxCity.removeAllItems();
        String pcat = (String) jComboBoxState.getSelectedItem();
        for (ClsItem item : cc.getAllChilds(cat, pcat)) {
            jComboBoxCity.addItem(item.name);
        }
        BigInteger vid = new BigInteger(128, new SecureRandom());
        jTextFieldVimanaID.setText(vid.toString(16));
    }

    public void setPrevCert(VimanaCertificate cert) {
        VimanaCSR newCSR = fileHandler.newCSR(cert);
        setCSR(newCSR);
        jTextAreaPrevCertInfo.setText(cert.toString());
    }

    public void setCSR(VimanaCSR csr) {
        jTextFieldVimanaID.setText(csr.getVimanaID().toString(16));
        jTextFieldSubjectCN.setText(csr.getCN());
        String hwids = "";
        for (BigInteger id : csr.getVimanaHardwareIDs()) {
            hwids += id.toString(16) + "\n";
        }
        jTextAreaHardwareIDs.setText(hwids);
        jTextFieldDNSNAmes.setText(csr.getDNSNames());
        jTextFieldEMail.setText(csr.getEmial());
        jTextFieldIPAddresses.setText(csr.getIP());
        jTextFieldOrgUnit.setText(csr.getOrgUnit());
        jTextFieldOrganization.setText(csr.getOrg());
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
        jComboBoxActorType = new javax.swing.JComboBox<>();
        jLabelSubtype = new javax.swing.JLabel();
        jComboBoxSubType = new javax.swing.JComboBox<>();
        jLabelRegionCode = new javax.swing.JLabel();
        jComboBoxRegionCode = new javax.swing.JComboBox<>();
        jLabelBusinessCode = new javax.swing.JLabel();
        jComboBoxBusinessCode = new javax.swing.JComboBox<>();
        jLabelAuthorityCode = new javax.swing.JLabel();
        jComboBoxAuthorityCode = new javax.swing.JComboBox<>();
        jLabelOperationsCode = new javax.swing.JLabel();
        jComboBoxOperationsCode = new javax.swing.JComboBox<>();
        jLabelSuplementalCode = new javax.swing.JLabel();
        jComboBoxSuplementalCode = new javax.swing.JComboBox<>();
        jScrollPaneHwIds = new javax.swing.JScrollPane();
        jTextAreaHardwareIDs = new javax.swing.JTextArea();
        jPanelGenericAttributes = new javax.swing.JPanel();
        jLabelCertificatePurpose = new javax.swing.JLabel();
        jComboBoxCertificatePurpose = new javax.swing.JComboBox<>();
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
        jComboBoxCountry = new javax.swing.JComboBox<>();
        jComboBoxState = new javax.swing.JComboBox<>();
        jComboBoxCity = new javax.swing.JComboBox<>();
        jLabelIPAddress = new javax.swing.JLabel();
        jTextFieldIPAddresses = new javax.swing.JTextField();
        jLabelDNSNames = new javax.swing.JLabel();
        jTextFieldDNSNAmes = new javax.swing.JTextField();
        jLabelChallengePass = new javax.swing.JLabel();
        jLabelChallengePass2 = new javax.swing.JLabel();
        jPasswordFieldChallenge = new javax.swing.JPasswordField();
        jPasswordFieldChallenge2 = new javax.swing.JPasswordField();
        jPanelPrevCertInfo = new javax.swing.JPanel();
        jButtonLoadPrevCert = new javax.swing.JButton();
        jScrollPanePrevCert = new javax.swing.JScrollPane();
        jTextAreaPrevCertInfo = new javax.swing.JTextArea();

        setLayout(new java.awt.BorderLayout());

        jPanelVimanaAttributes.setBorder(javax.swing.BorderFactory.createTitledBorder("Vimana Attributes"));

        jLabelVimanaId.setText("Vimana ID");

        jTextFieldVimanaID.addActionListener(new java.awt.event.ActionListener() {
            public void actionPerformed(java.awt.event.ActionEvent evt) {
                jTextFieldVimanaIDActionPerformed(evt);
            }
        });

        jLabelHardwareIDs.setText("Hardware IDs");

        jLabelAuthorityAttributes.setText("Vimana Authority ID attributes");

        jLabelActorType.setText("Actor Type");

        jComboBoxActorType.setModel(new javax.swing.DefaultComboBoxModel<>(new String[] { "Item 1", "Item 2", "Item 3", "Item 4" }));
        jComboBoxActorType.addActionListener(new java.awt.event.ActionListener() {
            public void actionPerformed(java.awt.event.ActionEvent evt) {
                jComboBoxActorTypeActionPerformed(evt);
            }
        });

        jLabelSubtype.setText("Subtype");

        jComboBoxSubType.setModel(new javax.swing.DefaultComboBoxModel<>(new String[] { "Item 1", "Item 2", "Item 3", "Item 4" }));

        jLabelRegionCode.setText("Region code");

        jComboBoxRegionCode.setModel(new javax.swing.DefaultComboBoxModel<>(new String[] { "Item 1", "Item 2", "Item 3", "Item 4" }));

        jLabelBusinessCode.setText("Business Code");

        jComboBoxBusinessCode.setModel(new javax.swing.DefaultComboBoxModel<>(new String[] { "Item 1", "Item 2", "Item 3", "Item 4" }));

        jLabelAuthorityCode.setText("Authority Code");

        jComboBoxAuthorityCode.setModel(new javax.swing.DefaultComboBoxModel<>(new String[] { "Item 1", "Item 2", "Item 3", "Item 4" }));

        jLabelOperationsCode.setText("Operations Code");

        jComboBoxOperationsCode.setModel(new javax.swing.DefaultComboBoxModel<>(new String[] { "Item 1", "Item 2", "Item 3", "Item 4" }));
        jComboBoxOperationsCode.addActionListener(new java.awt.event.ActionListener() {
            public void actionPerformed(java.awt.event.ActionEvent evt) {
                jComboBoxOperationsCodeActionPerformed(evt);
            }
        });

        jLabelSuplementalCode.setText("Suplemental Code");

        jComboBoxSuplementalCode.setModel(new javax.swing.DefaultComboBoxModel<>(new String[] { "Item 1", "Item 2", "Item 3", "Item 4" }));

        jTextAreaHardwareIDs.setColumns(20);
        jTextAreaHardwareIDs.setRows(5);
        jScrollPaneHwIds.setViewportView(jTextAreaHardwareIDs);

        javax.swing.GroupLayout jPanelVimanaAttributesLayout = new javax.swing.GroupLayout(jPanelVimanaAttributes);
        jPanelVimanaAttributes.setLayout(jPanelVimanaAttributesLayout);
        jPanelVimanaAttributesLayout.setHorizontalGroup(
            jPanelVimanaAttributesLayout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING)
            .addGroup(jPanelVimanaAttributesLayout.createSequentialGroup()
                .addGroup(jPanelVimanaAttributesLayout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING)
                    .addGroup(jPanelVimanaAttributesLayout.createSequentialGroup()
                        .addComponent(jLabelAuthorityAttributes)
                        .addGap(0, 0, Short.MAX_VALUE))
                    .addGroup(jPanelVimanaAttributesLayout.createSequentialGroup()
                        .addGap(2, 2, 2)
                        .addGroup(jPanelVimanaAttributesLayout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING)
                            .addGroup(jPanelVimanaAttributesLayout.createSequentialGroup()
                                .addGroup(jPanelVimanaAttributesLayout.createParallelGroup(javax.swing.GroupLayout.Alignment.TRAILING)
                                    .addGroup(javax.swing.GroupLayout.Alignment.LEADING, jPanelVimanaAttributesLayout.createSequentialGroup()
                                        .addComponent(jLabelActorType)
                                        .addGap(41, 41, 41)
                                        .addComponent(jLabelSubtype)
                                        .addGap(58, 58, 58)
                                        .addComponent(jLabelRegionCode)
                                        .addGap(49, 49, 49)
                                        .addComponent(jLabelBusinessCode))
                                    .addGroup(jPanelVimanaAttributesLayout.createSequentialGroup()
                                        .addComponent(jLabelVimanaId)
                                        .addGap(38, 38, 38)
                                        .addComponent(jTextFieldVimanaID, javax.swing.GroupLayout.PREFERRED_SIZE, 360, javax.swing.GroupLayout.PREFERRED_SIZE)))
                                .addPreferredGap(javax.swing.LayoutStyle.ComponentPlacement.UNRELATED)
                                .addComponent(jLabelHardwareIDs)
                                .addPreferredGap(javax.swing.LayoutStyle.ComponentPlacement.UNRELATED)
                                .addComponent(jScrollPaneHwIds, javax.swing.GroupLayout.DEFAULT_SIZE, 340, Short.MAX_VALUE))
                            .addGroup(jPanelVimanaAttributesLayout.createSequentialGroup()
                                .addComponent(jComboBoxActorType, 0, javax.swing.GroupLayout.DEFAULT_SIZE, Short.MAX_VALUE)
                                .addPreferredGap(javax.swing.LayoutStyle.ComponentPlacement.RELATED)
                                .addComponent(jComboBoxSubType, javax.swing.GroupLayout.PREFERRED_SIZE, 107, javax.swing.GroupLayout.PREFERRED_SIZE)
                                .addGap(9, 9, 9)
                                .addComponent(jComboBoxRegionCode, javax.swing.GroupLayout.PREFERRED_SIZE, 120, javax.swing.GroupLayout.PREFERRED_SIZE)
                                .addPreferredGap(javax.swing.LayoutStyle.ComponentPlacement.UNRELATED)
                                .addComponent(jComboBoxBusinessCode, javax.swing.GroupLayout.PREFERRED_SIZE, 120, javax.swing.GroupLayout.PREFERRED_SIZE)
                                .addPreferredGap(javax.swing.LayoutStyle.ComponentPlacement.RELATED)
                                .addGroup(jPanelVimanaAttributesLayout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING)
                                    .addComponent(jComboBoxAuthorityCode, javax.swing.GroupLayout.PREFERRED_SIZE, 120, javax.swing.GroupLayout.PREFERRED_SIZE)
                                    .addComponent(jLabelAuthorityCode))
                                .addPreferredGap(javax.swing.LayoutStyle.ComponentPlacement.RELATED)
                                .addGroup(jPanelVimanaAttributesLayout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING)
                                    .addComponent(jLabelOperationsCode)
                                    .addComponent(jComboBoxOperationsCode, javax.swing.GroupLayout.PREFERRED_SIZE, 138, javax.swing.GroupLayout.PREFERRED_SIZE))
                                .addGap(18, 18, 18)
                                .addGroup(jPanelVimanaAttributesLayout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING)
                                    .addComponent(jLabelSuplementalCode)
                                    .addComponent(jComboBoxSuplementalCode, javax.swing.GroupLayout.PREFERRED_SIZE, 152, javax.swing.GroupLayout.PREFERRED_SIZE))))))
                .addContainerGap())
        );
        jPanelVimanaAttributesLayout.setVerticalGroup(
            jPanelVimanaAttributesLayout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING)
            .addGroup(jPanelVimanaAttributesLayout.createSequentialGroup()
                .addGroup(jPanelVimanaAttributesLayout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING)
                    .addGroup(jPanelVimanaAttributesLayout.createSequentialGroup()
                        .addComponent(jScrollPaneHwIds, javax.swing.GroupLayout.PREFERRED_SIZE, 58, javax.swing.GroupLayout.PREFERRED_SIZE)
                        .addPreferredGap(javax.swing.LayoutStyle.ComponentPlacement.UNRELATED)
                        .addComponent(jLabelAuthorityAttributes))
                    .addGroup(jPanelVimanaAttributesLayout.createSequentialGroup()
                        .addContainerGap()
                        .addGroup(jPanelVimanaAttributesLayout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING)
                            .addGroup(jPanelVimanaAttributesLayout.createParallelGroup(javax.swing.GroupLayout.Alignment.BASELINE)
                                .addComponent(jLabelVimanaId)
                                .addComponent(jTextFieldVimanaID, javax.swing.GroupLayout.PREFERRED_SIZE, javax.swing.GroupLayout.DEFAULT_SIZE, javax.swing.GroupLayout.PREFERRED_SIZE))
                            .addComponent(jLabelHardwareIDs))))
                .addPreferredGap(javax.swing.LayoutStyle.ComponentPlacement.UNRELATED)
                .addGroup(jPanelVimanaAttributesLayout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING)
                    .addGroup(jPanelVimanaAttributesLayout.createParallelGroup(javax.swing.GroupLayout.Alignment.BASELINE)
                        .addComponent(jLabelBusinessCode)
                        .addComponent(jLabelAuthorityCode)
                        .addComponent(jLabelOperationsCode)
                        .addComponent(jLabelSuplementalCode)
                        .addComponent(jLabelActorType))
                    .addGroup(jPanelVimanaAttributesLayout.createParallelGroup(javax.swing.GroupLayout.Alignment.BASELINE)
                        .addComponent(jLabelSubtype, javax.swing.GroupLayout.PREFERRED_SIZE, 15, javax.swing.GroupLayout.PREFERRED_SIZE)
                        .addComponent(jLabelRegionCode)))
                .addPreferredGap(javax.swing.LayoutStyle.ComponentPlacement.RELATED)
                .addGroup(jPanelVimanaAttributesLayout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING, false)
                    .addGroup(jPanelVimanaAttributesLayout.createParallelGroup(javax.swing.GroupLayout.Alignment.BASELINE)
                        .addComponent(jComboBoxActorType, javax.swing.GroupLayout.PREFERRED_SIZE, javax.swing.GroupLayout.DEFAULT_SIZE, javax.swing.GroupLayout.PREFERRED_SIZE)
                        .addComponent(jComboBoxSubType, javax.swing.GroupLayout.PREFERRED_SIZE, javax.swing.GroupLayout.DEFAULT_SIZE, javax.swing.GroupLayout.PREFERRED_SIZE)
                        .addComponent(jComboBoxRegionCode, javax.swing.GroupLayout.PREFERRED_SIZE, javax.swing.GroupLayout.DEFAULT_SIZE, javax.swing.GroupLayout.PREFERRED_SIZE)
                        .addComponent(jComboBoxBusinessCode, javax.swing.GroupLayout.PREFERRED_SIZE, javax.swing.GroupLayout.DEFAULT_SIZE, javax.swing.GroupLayout.PREFERRED_SIZE)
                        .addComponent(jComboBoxSuplementalCode, javax.swing.GroupLayout.PREFERRED_SIZE, javax.swing.GroupLayout.DEFAULT_SIZE, javax.swing.GroupLayout.PREFERRED_SIZE)
                        .addComponent(jComboBoxAuthorityCode, javax.swing.GroupLayout.PREFERRED_SIZE, javax.swing.GroupLayout.DEFAULT_SIZE, javax.swing.GroupLayout.PREFERRED_SIZE))
                    .addComponent(jComboBoxOperationsCode))
                .addContainerGap(javax.swing.GroupLayout.DEFAULT_SIZE, Short.MAX_VALUE))
        );

        add(jPanelVimanaAttributes, java.awt.BorderLayout.CENTER);

        jPanelGenericAttributes.setBorder(javax.swing.BorderFactory.createTitledBorder("Generic attributes"));

        jLabelCertificatePurpose.setLabelFor(jComboBoxCertificatePurpose);
        jLabelCertificatePurpose.setText("Certificate Purpose");

        jComboBoxCertificatePurpose.addActionListener(new java.awt.event.ActionListener() {
            public void actionPerformed(java.awt.event.ActionEvent evt) {
                jComboBoxCertificatePurposeActionPerformed(evt);
            }
        });

        jLabelSubjectCN.setLabelFor(jTextFieldSubjectCN);
        jLabelSubjectCN.setText("CN, Common Name");

        jTextFieldSubjectCN.addActionListener(new java.awt.event.ActionListener() {
            public void actionPerformed(java.awt.event.ActionEvent evt) {
                jTextFieldSubjectCNActionPerformed(evt);
            }
        });

        jLabelCountry.setText("Country");

        jLabelState.setText("State/Province");

        jLabelCity.setLabelFor(jComboBoxCity);
        jLabelCity.setText("City");

        jLabelOrganization.setText("Organization");

        jLabelOrgUnit.setText("Org. Unit");

        jLabelEMail.setText("E-mail");

        jTextFieldOrgUnit.addActionListener(new java.awt.event.ActionListener() {
            public void actionPerformed(java.awt.event.ActionEvent evt) {
                jTextFieldOrgUnitActionPerformed(evt);
            }
        });

        jComboBoxCountry.setModel(new javax.swing.DefaultComboBoxModel<>(new String[] { "Item 1", "Item 2", "Item 3", "Item 4" }));
        jComboBoxCountry.addActionListener(new java.awt.event.ActionListener() {
            public void actionPerformed(java.awt.event.ActionEvent evt) {
                jComboBoxCountryActionPerformed(evt);
            }
        });

        jComboBoxState.setModel(new javax.swing.DefaultComboBoxModel<>(new String[] { "Item 1", "Item 2", "Item 3", "Item 4" }));
        jComboBoxState.addActionListener(new java.awt.event.ActionListener() {
            public void actionPerformed(java.awt.event.ActionEvent evt) {
                jComboBoxStateActionPerformed(evt);
            }
        });

        jComboBoxCity.setModel(new javax.swing.DefaultComboBoxModel<>(new String[] { "Item 1", "Item 2", "Item 3", "Item 4" }));
        jComboBoxCity.addActionListener(new java.awt.event.ActionListener() {
            public void actionPerformed(java.awt.event.ActionEvent evt) {
                jComboBoxCityActionPerformed(evt);
            }
        });

        jLabelIPAddress.setText("IP addresseses");

        jTextFieldIPAddresses.addActionListener(new java.awt.event.ActionListener() {
            public void actionPerformed(java.awt.event.ActionEvent evt) {
                jTextFieldIPAddressesActionPerformed(evt);
            }
        });

        jLabelDNSNames.setText("DNS names ");

        jTextFieldDNSNAmes.addActionListener(new java.awt.event.ActionListener() {
            public void actionPerformed(java.awt.event.ActionEvent evt) {
                jTextFieldDNSNAmesActionPerformed(evt);
            }
        });

        jLabelChallengePass.setText("Challenge pass");

        jLabelChallengePass2.setText("Repeat pass");

        jPasswordFieldChallenge.addActionListener(new java.awt.event.ActionListener() {
            public void actionPerformed(java.awt.event.ActionEvent evt) {
                jPasswordFieldChallengeActionPerformed(evt);
            }
        });

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
                .addGroup(jPanelGenericAttributesLayout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING)
                    .addComponent(jComboBoxCertificatePurpose, 0, 115, Short.MAX_VALUE)
                    .addComponent(jTextFieldSubjectCN)
                    .addComponent(jTextFieldIPAddresses)
                    .addComponent(jTextFieldDNSNAmes))
                .addPreferredGap(javax.swing.LayoutStyle.ComponentPlacement.RELATED)
                .addGroup(jPanelGenericAttributesLayout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING)
                    .addComponent(jLabelCity)
                    .addComponent(jLabelState)
                    .addComponent(jLabelCountry)
                    .addComponent(jLabelChallengePass))
                .addPreferredGap(javax.swing.LayoutStyle.ComponentPlacement.UNRELATED)
                .addGroup(jPanelGenericAttributesLayout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING, false)
                    .addComponent(jComboBoxCity, 0, 198, Short.MAX_VALUE)
                    .addComponent(jComboBoxCountry, 0, javax.swing.GroupLayout.DEFAULT_SIZE, Short.MAX_VALUE)
                    .addComponent(jComboBoxState, 0, 198, Short.MAX_VALUE)
                    .addComponent(jPasswordFieldChallenge2))
                .addPreferredGap(javax.swing.LayoutStyle.ComponentPlacement.UNRELATED)
                .addGroup(jPanelGenericAttributesLayout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING)
                    .addGroup(jPanelGenericAttributesLayout.createSequentialGroup()
                        .addGroup(jPanelGenericAttributesLayout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING)
                            .addComponent(jLabelOrganization)
                            .addComponent(jLabelChallengePass2))
                        .addPreferredGap(javax.swing.LayoutStyle.ComponentPlacement.RELATED)
                        .addGroup(jPanelGenericAttributesLayout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING)
                            .addComponent(jTextFieldOrganization, javax.swing.GroupLayout.DEFAULT_SIZE, 229, Short.MAX_VALUE)
                            .addComponent(jPasswordFieldChallenge)))
                    .addGroup(jPanelGenericAttributesLayout.createSequentialGroup()
                        .addGroup(jPanelGenericAttributesLayout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING)
                            .addComponent(jLabelEMail)
                            .addComponent(jLabelOrgUnit))
                        .addPreferredGap(javax.swing.LayoutStyle.ComponentPlacement.RELATED)
                        .addGroup(jPanelGenericAttributesLayout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING)
                            .addComponent(jTextFieldOrgUnit)
                            .addComponent(jTextFieldEMail))))
                .addContainerGap())
        );
        jPanelGenericAttributesLayout.setVerticalGroup(
            jPanelGenericAttributesLayout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING)
            .addGroup(jPanelGenericAttributesLayout.createSequentialGroup()
                .addContainerGap()
                .addGroup(jPanelGenericAttributesLayout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING)
                    .addGroup(jPanelGenericAttributesLayout.createParallelGroup(javax.swing.GroupLayout.Alignment.BASELINE)
                        .addComponent(jLabelCertificatePurpose)
                        .addComponent(jComboBoxCertificatePurpose, javax.swing.GroupLayout.PREFERRED_SIZE, javax.swing.GroupLayout.DEFAULT_SIZE, javax.swing.GroupLayout.PREFERRED_SIZE)
                        .addComponent(jLabelChallengePass)
                        .addComponent(jLabelChallengePass2)
                        .addComponent(jPasswordFieldChallenge2, javax.swing.GroupLayout.PREFERRED_SIZE, javax.swing.GroupLayout.DEFAULT_SIZE, javax.swing.GroupLayout.PREFERRED_SIZE))
                    .addComponent(jPasswordFieldChallenge, javax.swing.GroupLayout.Alignment.TRAILING, javax.swing.GroupLayout.PREFERRED_SIZE, javax.swing.GroupLayout.DEFAULT_SIZE, javax.swing.GroupLayout.PREFERRED_SIZE))
                .addPreferredGap(javax.swing.LayoutStyle.ComponentPlacement.UNRELATED)
                .addGroup(jPanelGenericAttributesLayout.createParallelGroup(javax.swing.GroupLayout.Alignment.TRAILING)
                    .addGroup(jPanelGenericAttributesLayout.createSequentialGroup()
                        .addGroup(jPanelGenericAttributesLayout.createParallelGroup(javax.swing.GroupLayout.Alignment.TRAILING)
                            .addGroup(jPanelGenericAttributesLayout.createParallelGroup(javax.swing.GroupLayout.Alignment.BASELINE)
                                .addComponent(jLabelSubjectCN)
                                .addComponent(jTextFieldSubjectCN, javax.swing.GroupLayout.PREFERRED_SIZE, javax.swing.GroupLayout.DEFAULT_SIZE, javax.swing.GroupLayout.PREFERRED_SIZE))
                            .addComponent(jLabelCountry))
                        .addGap(18, 18, 18)
                        .addGroup(jPanelGenericAttributesLayout.createParallelGroup(javax.swing.GroupLayout.Alignment.BASELINE)
                            .addComponent(jLabelIPAddress)
                            .addComponent(jTextFieldIPAddresses, javax.swing.GroupLayout.PREFERRED_SIZE, javax.swing.GroupLayout.DEFAULT_SIZE, javax.swing.GroupLayout.PREFERRED_SIZE)
                            .addComponent(jLabelState)))
                    .addGroup(jPanelGenericAttributesLayout.createSequentialGroup()
                        .addGroup(jPanelGenericAttributesLayout.createParallelGroup(javax.swing.GroupLayout.Alignment.BASELINE)
                            .addComponent(jComboBoxCountry, javax.swing.GroupLayout.PREFERRED_SIZE, javax.swing.GroupLayout.DEFAULT_SIZE, javax.swing.GroupLayout.PREFERRED_SIZE)
                            .addComponent(jLabelOrganization)
                            .addComponent(jTextFieldOrganization, javax.swing.GroupLayout.PREFERRED_SIZE, javax.swing.GroupLayout.DEFAULT_SIZE, javax.swing.GroupLayout.PREFERRED_SIZE))
                        .addPreferredGap(javax.swing.LayoutStyle.ComponentPlacement.UNRELATED)
                        .addGroup(jPanelGenericAttributesLayout.createParallelGroup(javax.swing.GroupLayout.Alignment.BASELINE)
                            .addComponent(jComboBoxState, javax.swing.GroupLayout.PREFERRED_SIZE, javax.swing.GroupLayout.DEFAULT_SIZE, javax.swing.GroupLayout.PREFERRED_SIZE)
                            .addComponent(jLabelOrgUnit)
                            .addComponent(jTextFieldOrgUnit, javax.swing.GroupLayout.PREFERRED_SIZE, javax.swing.GroupLayout.DEFAULT_SIZE, javax.swing.GroupLayout.PREFERRED_SIZE))))
                .addPreferredGap(javax.swing.LayoutStyle.ComponentPlacement.UNRELATED)
                .addGroup(jPanelGenericAttributesLayout.createParallelGroup(javax.swing.GroupLayout.Alignment.BASELINE)
                    .addComponent(jLabelDNSNames)
                    .addComponent(jTextFieldDNSNAmes, javax.swing.GroupLayout.PREFERRED_SIZE, javax.swing.GroupLayout.DEFAULT_SIZE, javax.swing.GroupLayout.PREFERRED_SIZE)
                    .addComponent(jLabelCity)
                    .addComponent(jComboBoxCity, javax.swing.GroupLayout.PREFERRED_SIZE, javax.swing.GroupLayout.DEFAULT_SIZE, javax.swing.GroupLayout.PREFERRED_SIZE)
                    .addComponent(jLabelEMail)
                    .addComponent(jTextFieldEMail, javax.swing.GroupLayout.PREFERRED_SIZE, javax.swing.GroupLayout.DEFAULT_SIZE, javax.swing.GroupLayout.PREFERRED_SIZE))
                .addGap(0, 13, Short.MAX_VALUE))
        );

        add(jPanelGenericAttributes, java.awt.BorderLayout.PAGE_START);

        jPanelPrevCertInfo.setBorder(javax.swing.BorderFactory.createTitledBorder("Previous certificate Info"));

        jButtonLoadPrevCert.setText("Load");
        jButtonLoadPrevCert.setActionCommand("LoadPrevCert");
        jButtonLoadPrevCert.addActionListener(new java.awt.event.ActionListener() {
            public void actionPerformed(java.awt.event.ActionEvent evt) {
                jButtonLoadPrevCertActionPerformed(evt);
            }
        });

        jTextAreaPrevCertInfo.setEditable(false);
        jTextAreaPrevCertInfo.setColumns(20);
        jTextAreaPrevCertInfo.setRows(5);
        jTextAreaPrevCertInfo.setText("Previous certificate is not loaded");
        jScrollPanePrevCert.setViewportView(jTextAreaPrevCertInfo);

        javax.swing.GroupLayout jPanelPrevCertInfoLayout = new javax.swing.GroupLayout(jPanelPrevCertInfo);
        jPanelPrevCertInfo.setLayout(jPanelPrevCertInfoLayout);
        jPanelPrevCertInfoLayout.setHorizontalGroup(
            jPanelPrevCertInfoLayout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING)
            .addGroup(jPanelPrevCertInfoLayout.createSequentialGroup()
                .addComponent(jButtonLoadPrevCert)
                .addGap(18, 18, 18)
                .addComponent(jScrollPanePrevCert, javax.swing.GroupLayout.DEFAULT_SIZE, 851, Short.MAX_VALUE)
                .addContainerGap())
        );
        jPanelPrevCertInfoLayout.setVerticalGroup(
            jPanelPrevCertInfoLayout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING)
            .addGroup(jPanelPrevCertInfoLayout.createSequentialGroup()
                .addGroup(jPanelPrevCertInfoLayout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING)
                    .addComponent(jButtonLoadPrevCert)
                    .addComponent(jScrollPanePrevCert, javax.swing.GroupLayout.PREFERRED_SIZE, 131, javax.swing.GroupLayout.PREFERRED_SIZE))
                .addContainerGap())
        );

        add(jPanelPrevCertInfo, java.awt.BorderLayout.PAGE_END);
    }// </editor-fold>//GEN-END:initComponents

    private void jComboBoxCountryActionPerformed(java.awt.event.ActionEvent evt) {//GEN-FIRST:event_jComboBoxCountryActionPerformed
        BasicClassificator cc = VimanaClassificators.getCls(VimanaClassificators.COUNTRY_CLS);
        isModified =true;
    }//GEN-LAST:event_jComboBoxCountryActionPerformed

    private void jButtonLoadPrevCertActionPerformed(java.awt.event.ActionEvent evt) {//GEN-FIRST:event_jButtonLoadPrevCertActionPerformed
        CsrFileHandler cfh = new CsrFileHandler();
        if (cfh.openFileDialog("Load Previous Certificate") >= 0) {
            setPrevCert(cfh.getCertificate());
        }
        isModified =true;
    }//GEN-LAST:event_jButtonLoadPrevCertActionPerformed

    private void jComboBoxStateActionPerformed(java.awt.event.ActionEvent evt) {//GEN-FIRST:event_jComboBoxStateActionPerformed
        isModified =true;
    }//GEN-LAST:event_jComboBoxStateActionPerformed

    private void jComboBoxCityActionPerformed(java.awt.event.ActionEvent evt) {//GEN-FIRST:event_jComboBoxCityActionPerformed
        isModified =true;
    }//GEN-LAST:event_jComboBoxCityActionPerformed

    private void jComboBoxCertificatePurposeActionPerformed(java.awt.event.ActionEvent evt) {//GEN-FIRST:event_jComboBoxCertificatePurposeActionPerformed
         isModified =true;
    }//GEN-LAST:event_jComboBoxCertificatePurposeActionPerformed

    private void jPasswordFieldChallengeActionPerformed(java.awt.event.ActionEvent evt) {//GEN-FIRST:event_jPasswordFieldChallengeActionPerformed
         isModified =true;
    }//GEN-LAST:event_jPasswordFieldChallengeActionPerformed

    private void jComboBoxOperationsCodeActionPerformed(java.awt.event.ActionEvent evt) {//GEN-FIRST:event_jComboBoxOperationsCodeActionPerformed
         isModified =true;
    }//GEN-LAST:event_jComboBoxOperationsCodeActionPerformed

    private void jComboBoxActorTypeActionPerformed(java.awt.event.ActionEvent evt) {//GEN-FIRST:event_jComboBoxActorTypeActionPerformed
        BasicClassificator ac = VimanaClassificators.getCls(VimanaClassificators.ACTOR_CLS);
        String at = (String) jComboBoxActorType.getSelectedItem();
        jComboBoxSubType.removeAllItems();
        for (ClsItem item : ac.getAllChilds(at)) {
            jComboBoxSubType.addItem(item.name);
        }
    }//GEN-LAST:event_jComboBoxActorTypeActionPerformed

    private void jTextFieldSubjectCNActionPerformed(java.awt.event.ActionEvent evt) {//GEN-FIRST:event_jTextFieldSubjectCNActionPerformed
        isModified =true;
    }//GEN-LAST:event_jTextFieldSubjectCNActionPerformed

    private void jTextFieldIPAddressesActionPerformed(java.awt.event.ActionEvent evt) {//GEN-FIRST:event_jTextFieldIPAddressesActionPerformed
         isModified =true;
    }//GEN-LAST:event_jTextFieldIPAddressesActionPerformed

    private void jTextFieldDNSNAmesActionPerformed(java.awt.event.ActionEvent evt) {//GEN-FIRST:event_jTextFieldDNSNAmesActionPerformed
         isModified =true;
    }//GEN-LAST:event_jTextFieldDNSNAmesActionPerformed

    private void jTextFieldOrgUnitActionPerformed(java.awt.event.ActionEvent evt) {//GEN-FIRST:event_jTextFieldOrgUnitActionPerformed
         isModified =true;
    }//GEN-LAST:event_jTextFieldOrgUnitActionPerformed

    private void jTextFieldVimanaIDActionPerformed(java.awt.event.ActionEvent evt) {//GEN-FIRST:event_jTextFieldVimanaIDActionPerformed
         isModified =true;
    }//GEN-LAST:event_jTextFieldVimanaIDActionPerformed


    // Variables declaration - do not modify//GEN-BEGIN:variables
    private javax.swing.JButton jButtonLoadPrevCert;
    private javax.swing.JComboBox<String> jComboBoxActorType;
    private javax.swing.JComboBox<String> jComboBoxAuthorityCode;
    private javax.swing.JComboBox<String> jComboBoxBusinessCode;
    private javax.swing.JComboBox<String> jComboBoxCertificatePurpose;
    private javax.swing.JComboBox<String> jComboBoxCity;
    private javax.swing.JComboBox<String> jComboBoxCountry;
    private javax.swing.JComboBox<String> jComboBoxOperationsCode;
    private javax.swing.JComboBox<String> jComboBoxRegionCode;
    private javax.swing.JComboBox<String> jComboBoxState;
    private javax.swing.JComboBox<String> jComboBoxSubType;
    private javax.swing.JComboBox<String> jComboBoxSuplementalCode;
    private javax.swing.JLabel jLabelActorType;
    private javax.swing.JLabel jLabelAuthorityAttributes;
    private javax.swing.JLabel jLabelAuthorityCode;
    private javax.swing.JLabel jLabelBusinessCode;
    private javax.swing.JLabel jLabelCertificatePurpose;
    private javax.swing.JLabel jLabelChallengePass;
    private javax.swing.JLabel jLabelChallengePass2;
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
    private javax.swing.JPasswordField jPasswordFieldChallenge;
    private javax.swing.JPasswordField jPasswordFieldChallenge2;
    private javax.swing.JScrollPane jScrollPaneHwIds;
    private javax.swing.JScrollPane jScrollPanePrevCert;
    private javax.swing.JTextArea jTextAreaHardwareIDs;
    private javax.swing.JTextArea jTextAreaPrevCertInfo;
    private javax.swing.JTextField jTextFieldDNSNAmes;
    private javax.swing.JTextField jTextFieldEMail;
    private javax.swing.JTextField jTextFieldIPAddresses;
    private javax.swing.JTextField jTextFieldOrgUnit;
    private javax.swing.JTextField jTextFieldOrganization;
    private javax.swing.JTextField jTextFieldSubjectCN;
    private javax.swing.JTextField jTextFieldVimanaID;
    // End of variables declaration//GEN-END:variables

}
