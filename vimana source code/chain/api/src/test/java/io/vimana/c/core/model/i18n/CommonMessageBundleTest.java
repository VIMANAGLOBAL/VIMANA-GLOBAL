package io.vimana.vim.core.model.i18n;

import org.junit.jupiter.api.Test;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertTrue;

class CommonMessageBundleTest {
    private static final Logger log = LoggerFactory.getLogger(CommonMessageBundleTest.class);

    @Test
    void incorrectAdminPassword() {
        String result = CommonMessageBundle.MESSAGES.incorrectAdminPassword();
        log.info(result);
        assertNotNull(result);
        assertTrue(result.contains("Admin's password"));
        assertTrue(!result.contains("{"));
    }

    @Test
    void missingSecretPhrase() {
        String result = CommonMessageBundle.MESSAGES.missingSecretPhrase();
        log.info(result);
        assertNotNull(result);
        assertTrue(!result.contains("{"));
    }

    @Test
    void missingMandatoryParameter() {
        String result = CommonMessageBundle.MESSAGES.missingMandatoryParameter("paramName", "paramValue");
        log.info(result);
        assertNotNull(result);
        assertTrue(!result.contains("{"));
    }
}