package io.vimana.vim.core.model.i18n;

import org.jboss.logging.annotations.Message;
import org.jboss.logging.annotations.MessageBundle;

@MessageBundle(projectCode = "VMN-REST-API-")
public interface CreateTransactionMessageBundle {

    CreateTransactionMessageBundle MESSAGES = org.jboss.logging.Messages.getBundle(CreateTransactionMessageBundle.class);
    int BASE = 150;

    int ErrorCodeMissingDeadline = BASE;
    @Message(id = ErrorCodeMissingDeadline, value = "Missing ''deadline'' param = ''{0}''", format= Message.Format.MESSAGE_FORMAT)
    String missingDeadline(String deadline);

    int ErrorCodeIncorrectDeadline = BASE + 1;
    @Message(id = ErrorCodeIncorrectDeadline, value = "Incorrect ''deadline'' param value = ''{0}'' wrong value (or should be bigger 1)", format= Message.Format.MESSAGE_FORMAT)
    String incorrectDeadline(String deadline);

    int ErrorCodeIncorrectEcBlock = BASE + 2;
    @Message(id = ErrorCodeIncorrectEcBlock, value = "ecBlockId ''{0,number,#}'' does not match the block id at ecBlockHeight", format= Message.Format.MESSAGE_FORMAT)
    String incorrectEcBlock(Long ecBlockId);

    int ErrorCodeNotEnoughFunds = BASE + 3;
    @Message(id = ErrorCodeNotEnoughFunds, value = "Not enough funds", format= Message.Format.MESSAGE_FORMAT)
    String notEnoughFunds();

    int ErrorCodeFeatureNotAvailable = BASE + 4;
    @Message(id = ErrorCodeFeatureNotAvailable, value = "Feature not available or something gone wrong", format= Message.Format.MESSAGE_FORMAT)
    String featureNotAvailable();

    int ErrorCodeParseSendMoneyParams = BASE + 5;
    @Message(id = ErrorCodeParseSendMoneyParams, value = "Incorrect values on parsing ''sending money'' params", format= Message.Format.MESSAGE_FORMAT)
    String errorOnParsSendMoneyParams();

    int ErrorCodeSendMoney = BASE + 6;
    @Message(id = ErrorCodeSendMoney, value = "''Sending money'' has failed, something gone wrong", format= Message.Format.MESSAGE_FORMAT)
    String errorOnSendMoney();

    int ErrorCodeMissingTransactionFullHash = BASE + 7;
    @Message(id = ErrorCodeMissingTransactionFullHash, value = "''Approve transaction'' has failed, missing ''transaction full hash'' value", format= Message.Format.MESSAGE_FORMAT)
    String missingTransactionFullHash();

    int ErrorCodeTooManyPhasingVotes = BASE + 8;
    @Message(id = ErrorCodeTooManyPhasingVotes, value = "Can vote for at most ''{0}'' phased transactions at once", format= Message.Format.MESSAGE_FORMAT)
    String errorToManyPhasingVotes(byte maxNumberPhasingVotes);

    int ErrorCodeUnknownFullHash = BASE + 9;
    @Message(id = ErrorCodeUnknownFullHash, value = "Transaction full hash value ''{0}'' was not found in system", format= Message.Format.MESSAGE_FORMAT)
    String unknownTransactionFullHash(String phasedTransactionValue);

    int ErrorCodeParseApproveParams = BASE + 10;
    @Message(id = ErrorCodeParseApproveParams, value = "Incorrect values on parsing ''approve command'' params", format= Message.Format.MESSAGE_FORMAT)
    String errorOnParseApproveParams();

    int ErrorCodeApprove = BASE + 11;
    @Message(id = ErrorCodeApprove, value = "''Approve transaction'' has failed, something gone wrong", format= Message.Format.MESSAGE_FORMAT)
    String errorOnApprove();
}
