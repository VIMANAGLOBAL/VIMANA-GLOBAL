package io.vimana.vim.core.model.i18n;

import org.jboss.logging.annotations.Message;
import org.jboss.logging.annotations.MessageBundle;

@MessageBundle(projectCode = "VMN-COMMON-")
public interface CommonMessageBundle {

    CommonMessageBundle MESSAGES = org.jboss.logging.Messages.getBundle(CommonMessageBundle.class);
    int BASE = 50;

    int ErrorIncorrectAdminPassword = BASE;
    @Message(id = ErrorIncorrectAdminPassword, value =
            "Missing or incorrect mandatory Admin's password", format= Message.Format.MESSAGE_FORMAT)
    String incorrectAdminPassword();

    int ErrorIncorrectMissingSecretPhrase = BASE + 1;
    @Message(id = ErrorIncorrectMissingSecretPhrase, value =
            "SecretPhrase is not specified or not submitted", format= Message.Format.MESSAGE_FORMAT)
    String missingSecretPhrase();

    int ErrorMissingOrIncorrectParameter = BASE + 2;
    @Message(id = ErrorMissingOrIncorrectParameter, value =
            "Missing or incorrect (mandatory) parameter: ''{0}'' = ''{1}''", format= Message.Format.MESSAGE_FORMAT)
    String missingMandatoryParameter(String parameterName, String parameterValue);

}
