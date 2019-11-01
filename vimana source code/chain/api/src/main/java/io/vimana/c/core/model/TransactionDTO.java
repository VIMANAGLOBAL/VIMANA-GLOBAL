package io.vimana.vim.core.model;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.databind.JsonNode;

@JsonInclude(JsonInclude.Include.NON_NULL)
public class TransactionDTO {

    public Byte type;
    public Byte subtype;
    public Boolean phased;
    public Integer timestamp;
    public Short deadline;
    public String senderPublicKey;
    public String recipient;
    public String recipientRS;
    public String amountNQT;
    public String feeNQT;
    public String referencedTransactionFullHash;
    public String signature;
    public String signatureHash;
    public String fullHash;
    public String transaction;
    public Byte version;
    public String sender;
    public String senderRS;
    public Long height;
    public String ecBlockId;
    public Long ecBlockHeight;
    public String block;
    public Integer confirmations;
    public Integer blockTimestamp;
    public Short transactionIndex;
    public Boolean approved;
    public String result;
    public Integer executionHeight;
    public JsonNode attachment;


    public String amountATM;
    public String feeATM;
    public String encryptedTransaction;

}
