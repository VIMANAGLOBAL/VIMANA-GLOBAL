package io.vimana.vim.util.cls;

import org.junit.jupiter.api.Test;
import static org.junit.jupiter.api.Assertions.*;

/**
 *
 * @author al
 */
public class VimanaClassificatorsTest {
    
    public VimanaClassificatorsTest() {
    }
    

    /**
     * Test of getCls method, of class VimanaClassificators.
     */
    @Test
    public void testGetCls() {
        System.out.println("Classificators test");
        BasicClassificator country_cls = VimanaClassificators.getCls(VimanaClassificators.COUNTRY_CLS);
        ClsItem item = country_cls.getItem("");
        assertEquals("Countries", item.name);
        ClsItem item1 = country_cls.getItem();
        assertEquals(item1.name,"Countries" );        
        ClsItem kyiv = country_cls.getItem("Ukraine","Kyivska");
        assertEquals("Kyivska oblast",kyiv.value);
        ClsItem cn = country_cls.getItem("Ukraine","Chernigivska");
        assertEquals("Chernigivska oblast",cn.value);        
        BasicClassificator auth_cls = VimanaClassificators.getCls(VimanaClassificators.AUTORITY_CLS);
        ClsItem n = auth_cls.findByValue(0);
        assertEquals("None",n.name);
        ClsItem n1 = auth_cls.findByValue("0");
        assertEquals("None",n1.name);
    }
    
}
