package io.vimana.vim.core.model.request;

import io.swagger.annotations.ApiModel;
import org.jboss.resteasy.annotations.jaxrs.FormParam;

/**
 * Base class with many common form fields used in several POST methods.
 */
@ApiModel
public class CreateTransactionForm {
    // common fields for many transaction related operations
    @FormParam("deadline")
    public String deadline;
    @FormParam("referencedTransactionFullHash")
    public String referencedTransactionFullHash;
    @FormParam("secretPhrase")
    public String secretPhrase; // account retrieving
    @FormParam("publicKey")
    public String publicKey; // account retrieving
    @FormParam("recipientPublicKey")
    public String recipientPublicKey;
    @FormParam("broadcast")
    public Boolean broadcast;
    @FormParam("encryptedMessageIsPrunable")
    public Boolean encryptedMessageIsPrunable;
    @FormParam("messageIsPrunable")
    public Boolean messageIsPrunable;
    @FormParam("phased")
    public Boolean phased;
    @FormParam("messageToEncryptIsText")
    public Boolean messageToEncryptIsText;
    @FormParam("compressMessageToEncrypt")
    public Boolean compressMessageToEncrypt;
    @FormParam("encryptedMessageData")
    public String encryptedMessageData;
    @FormParam("encryptedMessageNonce")
    public String encryptedMessageNonce;
    @FormParam("messageToEncrypt")
    public String messageToEncrypt;
    @FormParam("encrypt_message")
    public String encrypt_message;

    @FormParam("messageToEncryptToSelfIsText")
    public Boolean messageToEncryptToSelfIsText;
    @FormParam("compressMessageToEncryptToSelf")
    public Boolean compressMessageToEncryptToSelf;
    @FormParam("encryptToSelfMessageData")
    public String encryptToSelfMessageData;
    @FormParam("encryptToSelfMessageNonce")
    public String encryptToSelfMessageNonce;
    @FormParam("messageToEncryptToSelf")
    public String messageToEncryptToSelf;

    @FormParam("message")
    public String message;
    @FormParam("messageIsText")
    public Boolean messageIsText;
    @FormParam("feeNQT")
    public Long feeNQT;
    @FormParam("ecBlockHeight")
    public Integer ecBlockHeight;
    @FormParam("ecBlockId")
    public Long ecBlockId;

    @Override
    public String toString() {
        return "CreateTransactionForm{" +
                "deadline='" + deadline + '\'' +
                ", referencedTransactionFullHash='" + referencedTransactionFullHash + '\'' +
                ", secretPhrase='" + secretPhrase + '\'' +
                ", publicKey='" + publicKey + '\'' +
                ", recipientPublicKey='" + recipientPublicKey + '\'' +
                ", broadcast=" + broadcast +
                ", encryptedMessageIsPrunable=" + encryptedMessageIsPrunable +
                ", messageIsPrunable=" + messageIsPrunable +
                ", feeNQT=" + feeNQT +
                ", message=" + message +
                ", compressMessageToEncrypt=" + compressMessageToEncrypt +
                ", messageToEncrypt='" + messageToEncrypt + '\'' +
                '}';
    }
}
