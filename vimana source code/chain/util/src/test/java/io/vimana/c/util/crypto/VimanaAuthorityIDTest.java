/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package io.vimana.vim.util.crypto;

import java.math.BigInteger;
import org.junit.jupiter.api.BeforeAll;
import org.junit.jupiter.api.Test;
import static org.junit.jupiter.api.Assertions.*;

/**
 *
 * @author al
 */
public class VimanaAuthorityIDTest {
    private static final String authID="01020304050607080910111213141516";
    private static final BigInteger authIdBI=new BigInteger(authID,16);
    private static VimanaAuthorityID instance = new VimanaAuthorityID(authIdBI);
    private static VimanaAuthorityID instance2 = new VimanaAuthorityID(authIdBI);
    
    public VimanaAuthorityIDTest() {
    }
    
    @BeforeAll
    public static void setUpClass() {
        System.out.println("Testing Vimana Authority ID: "+instance);        
    }
    /**
     * Test of getActorType method, of class VimanaAuthorityID.
     */
    @Test
    public void testGetActorType() {
        System.out.println("getActorType");
        int expResult = Integer.parseInt("0102",16);
        int result = instance.getActorType();
        assertEquals(expResult, result);
    }

    /**
     * Test of setActorType method, of class VimanaAuthorityID.
     */
    @Test
    public void testSetActorType() {
        System.out.println("setActorType");
        int at = Integer.parseInt("0102",16);
        instance2.setActorType(at);
        assertEquals(instance.getAuthorityID() ,instance2.getAuthorityID());        
    }

    /**
     * Test of getVimanaActorType method, of class VimanaAuthorityID.
     */
    @Test
    public void testGetVimanaActorType() {
        System.out.println("getVimanaActorType");
        VimanaActorType expResult = new VimanaActorType(Integer.parseInt("0102",16));
        VimanaActorType result = instance.getVimanaActorType();
        assertEquals(expResult, result);
    }

    /**
     * Test of setVimanaActorType method, of class VimanaAuthorityID.
     */
    @Test
    public void testSetVimanaActorType() {
        System.out.println("setVimanaActorType");
        VimanaActorType vat = new VimanaActorType(Integer.parseInt("0102",16));
        instance2.setVimanaActorType(vat);
        VimanaActorType vat2 = instance2.getVimanaActorType();
        assertEquals(vat2, vat);
    }

    /**
     * Test of getRegionCode method, of class VimanaAuthorityID.
     */
    @Test
    public void testGetRegionCode() {
        System.out.println("getRegionCode");
        int expResult = Integer.parseInt("0304",16);
        int result = instance.getRegionCode();
        assertEquals(expResult, result);
    }

    /**
     * Test of setRegionCode method, of class VimanaAuthorityID.
     */
    @Test
    public void testSetRegionCode() {
        System.out.println("setRegionCode");
        int rc = Integer.parseInt("0304",16);
        instance2.setRegionCode(rc);
        assertEquals(instance, instance2);
    }

    /**
     * Test of getBusinessCode method, of class VimanaAuthorityID.
     */
    @Test
    public void testGetBusinessCode() {
        System.out.println("getBusinessCode");
        int expResult = Integer.parseInt("0506",16);
        int result = instance.getBusinessCode();
        assertEquals(expResult, result);
    }

    /**
     * Test of setBusinessCode method, of class VimanaAuthorityID.
     */
    @Test
    public void testSetBusinessCode() {
        System.out.println("setBusinessCode");
        int bc = Integer.parseInt("0506",16);
        instance2.setBusinessCode(bc);
        assertEquals(instance, instance2);
    }

    /**
     * Test of getAuthorityCode method, of class VimanaAuthorityID.
     */
    @Test
    public void testGetAuthorityCode() {
        System.out.println("getAuthorityCode");
        int expResult = Integer.parseInt("0708",16);
        int result = instance.getAuthorityCode();
        assertEquals(expResult, result);
    }

    /**
     * Test of setAuthorityCode method, of class VimanaAuthorityID.
     */
    @Test
    public void testSetAuthorityCode() {
        System.out.println("setAuthorityCode");
        int bc = Integer.parseInt("0708",16);
        instance2.setAuthorityCode(bc);
        assertEquals(instance, instance2);
    }

    /**
     * Test of getOperationCode method, of class VimanaAuthorityID.
     */
    @Test
    public void testGetOperationCode() {
        System.out.println("getOperationCode");
        long expResult = Long.parseLong("09101112",16);
        long result = instance.getOperationCode();
        assertEquals(expResult, result);
    }

    /**
     * Test of setOperationCode method, of class VimanaAuthorityID.
     */
    @Test
    public void testSetOperationCode() {
        System.out.println("setOperationCode");
        long oc = Long.parseLong("09101112",16);
        instance2.setOperationCode(oc);
        assertEquals(instance, instance2);
    }

    /**
     * Test of getSuplementalCode method, of class VimanaAuthorityID.
     */
    @Test
    public void testGetSuplementalCode() {
        System.out.println("getSuplementalCode");
        long expResult = Long.parseLong("13141516",16);
        long result = instance.getSuplementalCode();
        assertEquals(expResult, result);
    }

    /**
     * Test of setSuplementalCode method, of class VimanaAuthorityID.
     */
    @Test
    public void testSetSuplementalCode() {
        System.out.println("setSuplementalCode");
        long oc = Long.parseLong("13141516",16);
        instance2.setSuplementalCode(oc);
        assertEquals(instance, instance2);
    }
    
}
