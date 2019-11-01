package io.vimana.vim.core.model.i18n;

import org.junit.jupiter.api.Test;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import static org.junit.jupiter.api.Assertions.*;

class TransactionsMessageBundleTest {
    private static final Logger log = LoggerFactory.getLogger(TransactionsMessageBundleTest.class);

    private void logAndCheckResult(String result, boolean b) {
        log.info(result);
        assertNotNull(result);
        assertTrue(b);
    }

    @Test
    void missingTransactionParams() {
        String transactionId = "AnyTransactionId3534534";
        String fullHash = "AnyHashValue$%$%^&454";
        String result = TransactionsMessageBundle.MESSAGES.missingTransactionParams(transactionId, fullHash);
        logAndCheckResult(result, result.contains(transactionId));
        assertTrue(result.contains(fullHash));
        assertTrue(!result.contains("{"));
    }

    @Test
    void notFoundTransaction() {
        String transactionId = "AnyTransactionId3534534";
        String fullHash = "AnyHashValue$%$%^&454";
        String result = TransactionsMessageBundle.MESSAGES.notFoundTransaction(transactionId, fullHash);
        logAndCheckResult(result, result.contains(transactionId));
        assertTrue(result.contains(fullHash));
        assertTrue(!result.contains("{"));
    }

    @Test
    void noPrunedTransactionFound() {
        String transactionId = "AnyTransactionId3534534";
        String result = TransactionsMessageBundle.MESSAGES.noPrunedTransactionFound(transactionId);
        logAndCheckResult(result, result.contains(transactionId));
        assertTrue(!result.contains("{"));
    }

    @Test
    void errorRequeueUnconfirmedTransaction() {
        String result = TransactionsMessageBundle.MESSAGES.errorRequeueUnconfirmedTransaction();
        logAndCheckResult(result, !result.contains("{"));
    }

    @Test
    void errorRebroadcastUnconfirmedTransaction() {
        String result = TransactionsMessageBundle.MESSAGES.errorRebroadcastUnconfirmedTransaction();
        logAndCheckResult(result, !result.contains("{"));
    }

    @Test
    void errorVoterPhasedTransactions() {
        String account = "SomeAccVal_45645674";
        String firstIndex = "45645674";
        String lastIndex = "4";
        String result = TransactionsMessageBundle.MESSAGES.errorVoterPhasedTransactions(account, firstIndex, lastIndex);
        logAndCheckResult(result, !result.contains("{"));
    }

    @Test
    void failedSendTransaction() {
        String result = TransactionsMessageBundle.MESSAGES.failedSendTransaction();
        logAndCheckResult(result, !result.contains("{"));
    }

    @Test
    void failedBroadcastTransaction() {
        String result = TransactionsMessageBundle.MESSAGES.failedBroadcastTransaction();
        logAndCheckResult(result, !result.contains("{"));
    }

    @Test
    void failedParseTransaction() {
        String result = TransactionsMessageBundle.MESSAGES.failedParseTransaction();
        logAndCheckResult(result, !result.contains("{"));
    }

    @Test
    void errorUnconfirmedTransactions() {
        String result = TransactionsMessageBundle.MESSAGES.errorUnconfirmedTransactions("34567", "0", "10");
        logAndCheckResult(result, !result.contains("{"));
    }

    @Test
    void errorGetScheduledTransactions() {
        String result = TransactionsMessageBundle.MESSAGES.errorGetScheduledTransactions("34567");
        logAndCheckResult(result, !result.contains("{"));
    }

    @Test
    void errorSigningTransactions() {
        String result = TransactionsMessageBundle.MESSAGES.errorSigningTransactions();
        logAndCheckResult(result, !result.contains("{"));
    }

    @Test
    void errorClearUnconfirmedTransaction() {
        String result = TransactionsMessageBundle.MESSAGES.errorClearUnconfirmedTransaction();
        logAndCheckResult(result, !result.contains("{"));
    }
}