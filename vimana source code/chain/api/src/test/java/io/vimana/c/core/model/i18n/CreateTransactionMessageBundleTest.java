package io.vimana.vim.core.model.i18n;

import org.junit.jupiter.api.Test;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import static io.vimana.vim.core.model.i18n.CreateTransactionMessageBundle.MESSAGES;
import static org.junit.jupiter.api.Assertions.*;

class CreateTransactionMessageBundleTest {
    private static final Logger log = LoggerFactory.getLogger(CreateTransactionMessageBundleTest.class);

    private CreateTransactionMessageBundle messages = MESSAGES;

    private void logAndCheckResult(String result) {
        log.info(result);
        assertNotNull(result);
        assertTrue(!result.contains("{"));
    }

    @Test
    void missingDeadline() {
        String result = messages.missingDeadline("deadline_param");
        logAndCheckResult(result);
    }

    @Test
    void incorrectDeadline() {
        String result = messages.incorrectDeadline("deadline_param");
        logAndCheckResult(result);
    }

    @Test
    void incorrectEcBlock() {
        String result = messages.incorrectEcBlock(45646L);
        logAndCheckResult(result);
    }

    @Test
    void notEnoughFunds() {
        String result = messages.notEnoughFunds();
        logAndCheckResult(result);
    }

    @Test
    void featureNotAvailable() {
        String result = messages.featureNotAvailable();
        logAndCheckResult(result);
    }

    @Test
    void errorOnParsSendMoneyParams() {
        String result = messages.errorOnParsSendMoneyParams();
        logAndCheckResult(result);
    }

    @Test
    void errorOnSendMoney() {
        String result = messages.errorOnSendMoney();
        logAndCheckResult(result);
    }

    @Test
    void missingTransactionFullHash() {
        String result = messages.missingTransactionFullHash();
        logAndCheckResult(result);
    }

    @Test
    void errorToManyPhasingVotes() {
        String result = messages.errorToManyPhasingVotes((byte)10);
        logAndCheckResult(result);
    }

    @Test
    void unknownTransactionFullHash() {
        String result = messages.unknownTransactionFullHash("456789dfghj");
        logAndCheckResult(result);
    }

    @Test
    void errorOnParseApproveParams() {
        String result = messages.errorOnParseApproveParams();
        logAndCheckResult(result);
    }

    @Test
    void errorOnApprove() {
        String result = messages.errorOnApprove();
        logAndCheckResult(result);

    }
}