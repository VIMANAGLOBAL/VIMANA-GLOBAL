package io.vimana.vim.util.crypto;

import java.io.FileNotFoundException;
import java.math.BigInteger;
import java.util.List;

import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.AfterAll;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.BeforeAll;
import org.junit.jupiter.api.Test;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import static org.junit.jupiter.api.Assertions.*;

/**
 *
 * @author al
 */
public class VimanaCertificateTest {
    private static final Logger log = LoggerFactory.getLogger(VimanaCertificateTest.class);

    private static VimanaCertificate vc;
    private static final String CERT_PATH="./src/test/resources/test1-cert.pem";
    
    public VimanaCertificateTest() {
    }
    
    @BeforeAll
    static void setUpClass() {
        log.debug("Testing Vimana certificate loading and verification");
        try {
            vc = VimanaCertificate.loadPEMFromPath(CERT_PATH);
        } catch (FileNotFoundException ex) {
            log.error("Can not read test certificate! ", ex.getMessage());
        } catch (VimanaCertificateException ex) {
            log.error("Can not parse certificate! ", ex.getMessage());
        }
    }
    
    @AfterAll
    public static void tearDownClass() {
    }
    
    @BeforeEach
    public void setUp() {
    }
    
    @AfterEach
    public void tearDown() {
    }

    /**
     * Test of loadPEMFromPath method, of class VimanaCertificate.
     */
    @Test
    public void testLoadPEMFromPath() throws Exception {
        log.debug("Loading certificate from {}", CERT_PATH);
        VimanaCertificate result = VimanaCertificate.loadPEMFromPath(CERT_PATH);
        assertNotNull(result);
    }

    /**
     * Test of getVimanaID method, of class VimanaCertificate.
     */
    @Test
    public void testGetVimanaId() {
        log.debug("getVimanaID");
        BigInteger expResult = new BigInteger("0002da0e32e07b61c9f0251fe627a9c",16);
        BigInteger result = vc.getVimanaId();
        assertEquals(expResult, result);
    }

    /**
     * Test of getVimanaAuthorityID method, of class VimanaCertificate.
     */
    @Test
    public void testGetVimanaAuthorityID() {
        log.debug("getVimanaAuthorityID");
        BigInteger expResult = new BigInteger("00032da0e32e07b61c9f0251fe627a9c",16);
        BigInteger result = vc.getVimanaAuthorityId().getAuthorityID();
        assertEquals(expResult, result);
    }

    /**
     * Test of getVimanaHardwareIDs method, of class VimanaCertificate.
     */
    @Test
    public void testGetVimanaHardwareIDs() {
        log.debug("getVimanaHardwareIDs");
        BigInteger expResult = new BigInteger("00042da0e32e07b61c9f0251fe627a9c",16);
        List<BigInteger> result = vc.getVimanaHardwareIDs();
        assertEquals(expResult, result.get(0));
    }
    
}
