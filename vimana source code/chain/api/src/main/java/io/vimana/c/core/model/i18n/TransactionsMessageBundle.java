package io.vimana.vim.core.model.i18n;

import org.jboss.logging.annotations.Message;
import org.jboss.logging.annotations.MessageBundle;

@MessageBundle(projectCode = "VMN-REST-API-")
public interface TransactionsMessageBundle {

    TransactionsMessageBundle MESSAGES = org.jboss.logging.Messages.getBundle(TransactionsMessageBundle.class);
    int BASE = 120;

    int ErrorMissingTransactionParams = BASE + 5;
    @Message(id = ErrorMissingTransactionParams, value =
            "Missing or incorrect mandatory parameters transactionId = ''{0}'', fullHash=''{1}''", format= Message.Format.MESSAGE_FORMAT)
    String missingTransactionParams(String transactionId, String fullHash);

    int ErrorCodeNotFoundTransaction = BASE + 6;
    @Message(id = ErrorCodeNotFoundTransaction, value =
            "Transaction can''t be found by ''id'' = ''{0}'' or by ''fullHash'' = ''{1}''", format= Message.Format.MESSAGE_FORMAT)
    String notFoundTransaction(String transactionId, String fullHash);

    int ErrorCodeNoFoundPrunedTransaction = BASE + 7;
    @Message(id = ErrorCodeNoFoundPrunedTransaction, value = "Pruned transaction data not currently available from any peer by ''id'' param = ''{0}''", format= Message.Format.MESSAGE_FORMAT)
    String noPrunedTransactionFound(String transactionId);

    int ErrorCodeRequeueUnconfirmedTransaction = BASE + 8;
    @Message(id = ErrorCodeRequeueUnconfirmedTransaction, value = "Error on requeue unconfirmed Transactions", format= Message.Format.MESSAGE_FORMAT)
    String errorRequeueUnconfirmedTransaction();

    int ErrorCodeRebroadcastUnconfirmedTransaction = BASE + 9;
    @Message(id = ErrorCodeRebroadcastUnconfirmedTransaction, value = "Error on rebroadcasting all unconfirmed Transactions", format= Message.Format.MESSAGE_FORMAT)
    String errorRebroadcastUnconfirmedTransaction();

    int ErrorCodeVoterPhasedTransactions = BASE + 10;
    @Message(id = ErrorCodeVoterPhasedTransactions, value = "Error on retrieving Voter Phased Transactions by ''{0}'',  ''{1}'',  ''{2}''", format= Message.Format.MESSAGE_FORMAT)
    String errorVoterPhasedTransactions(String account, String firstIndex, String lastIndex);

    int ErrorCodeFailedSendTransaction = BASE + 11;
    @Message(id = ErrorCodeFailedSendTransaction, value = "Failed to send transaction", format= Message.Format.MESSAGE_FORMAT)
    String failedSendTransaction();

    int ErrorCodeFailedBroadcast = BASE + 12;
    @Message(id = ErrorCodeFailedBroadcast, value = "Failed to broadcast transaction", format= Message.Format.MESSAGE_FORMAT)
    String failedBroadcastTransaction();

    int ErrorCodeParseTransaction = BASE + 13;
    @Message(id = ErrorCodeParseTransaction, value = "Failed to parse transaction", format= Message.Format.MESSAGE_FORMAT)
    String failedParseTransaction();

    int ErrorCodeUnconfirmedTransactions = BASE + 14;
    @Message(id = ErrorCodeUnconfirmedTransactions, value = "Error on retrieving Unconfirmed Transactions (or Ids) by accountIds = ''{0}'',  firstIndex=''{1}'',  lastIndex=''{2}''", format= Message.Format.MESSAGE_FORMAT)
    String errorUnconfirmedTransactions(String account, String firstIndex, String lastIndex);

    int ErrorCodeGetScheduledTransactions = BASE + 15;
    @Message(id = ErrorCodeGetScheduledTransactions, value = "Error on retrieving scheduled Transactions by accountId = ''{0}''", format= Message.Format.MESSAGE_FORMAT)
    String errorGetScheduledTransactions(String account);

    int ErrorCodeSigningTransactions = BASE + 16;
    @Message(id = ErrorCodeSigningTransactions, value = "Error on signing Transaction by supplied data", format= Message.Format.MESSAGE_FORMAT)
    String errorSigningTransactions();

    int ErrorCodeClearUnconfirmedTransaction = BASE + 17;
    @Message(id = ErrorCodeClearUnconfirmedTransaction, value = "Error on clear all unconfirmed Transactions", format= Message.Format.MESSAGE_FORMAT)
    String errorClearUnconfirmedTransaction();


}

