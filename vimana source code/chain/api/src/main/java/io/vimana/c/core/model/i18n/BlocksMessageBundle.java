package io.vimana.vim.core.model.i18n;

import org.jboss.logging.annotations.Message;
import org.jboss.logging.annotations.MessageBundle;

@MessageBundle(projectCode = "VMN-REST-API-")
public interface BlocksMessageBundle {

    BlocksMessageBundle MESSAGES = org.jboss.logging.Messages.getBundle(BlocksMessageBundle.class);
    int BASE = 100;

    int ErrorCodeBlockNotFoundById = BASE + 5;
    @Message(id = ErrorCodeBlockNotFoundById, value = "Block is not found by supplied ''block'' param = ''{0}''", format= Message.Format.MESSAGE_FORMAT)
    String blockNotFoundById(String blockId);

    int ErrorCodeBlockIncorrectByHeight = BASE + 6;
    @Message(id = ErrorCodeBlockIncorrectByHeight, value = "Block can''t be found by height or height is incorrect ''height'' param = ''{0,number,#}''", format= Message.Format.MESSAGE_FORMAT)
    String blockIncorrectByHeight(Integer heightValue);

    int ErrorCodeBlockIncorrectByTimestamp = BASE + 7;
    @Message(id = ErrorCodeBlockIncorrectByTimestamp, value = "Block can''t be found by timestamp or value is incorrect ''timestamp'' param = ''{0}''", format= Message.Format.MESSAGE_FORMAT)
    String blockIncorrectByTimestamp(String timestamp);

    int ErrorCodeBlockUnknownByParameters = BASE + 8;
    @Message(id = ErrorCodeBlockUnknownByParameters, value = "Unknown or not found Block by params : blockId=''{0}'' / height=''{1,number,#}'' / timestamp=''{2}''", format= Message.Format.MESSAGE_FORMAT)
    String blockUnknownByParameters(String blockId, Integer heightValue, Integer timestamp);

    int ErrorCodeIncorrectIndexParams = BASE + 9;
    @Message(id = ErrorCodeIncorrectIndexParams, value = "Incorrect one or several incoming parameters for retrieving Block list : firstIndex=''{0}'' / lastIndex=''{1}'' / timestamp=''{2}''", format= Message.Format.MESSAGE_FORMAT)
    String blockListIncorrectIndexParams(String firstIndex, String lastIndex, String timestamp);

    int ErrorCodeBlockIdsIncorrectParams = BASE + 10;
    @Message(id = ErrorCodeBlockIdsIncorrectParams, value = "Incorrect one or several incoming parameters for retrieving Block IDs/List : account=''{0}'' / firstIndex=''{1}'' / lastIndex=''{2}'' / timestamp=''{3}''", format= Message.Format.MESSAGE_FORMAT)
    String blockIdsIncorrectParams(String account, String firstIndex, String lastIndex, String timestamp);

    int ErrorCodeBlockCountIncorrectAccountId = BASE + 11;
    @Message(id = ErrorCodeBlockCountIncorrectAccountId, value = "Incorrect parameter : account=''{0}''", format= Message.Format.MESSAGE_FORMAT)
    String blockCountIncorrectAccountId(String account);

}

