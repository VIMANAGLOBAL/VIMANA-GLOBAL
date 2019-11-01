package io.vimana.vim.core.model;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonInclude;
import io.swagger.annotations.ApiModel;

@JsonInclude(JsonInclude.Include.NON_NULL)
@JsonIgnoreProperties(ignoreUnknown = true)
@ApiModel
public class CurrencyTransferDTO {
    public String transfer;
    public String currency;
    public String sender;
    public String senderRS;
    public String recipient;
    public String recipientRS;
    public String units;

    public String name;
    public String code;
    public Integer type;
    public Byte decimals;
    public Integer issuanceHeight;
    public Long issuerAccount;
    public String issuerAccountRS;
    public Integer height;
    public Boolean phased;
    public Integer transactionHeight;
    public Integer confirmations;

    @Override
    public String toString() {
        return "CurrencyTransferDTO{" +
                "transfer='" + transfer + '\'' +
                ", currency='" + currency + '\'' +
                ", sender='" + sender + '\'' +
                ", senderRS='" + senderRS + '\'' +
                ", recipient='" + recipient + '\'' +
                ", recipientRS='" + recipientRS + '\'' +
                ", units='" + units + '\'' +
                ", name='" + name + '\'' +
                ", code='" + code + '\'' +
                ", type=" + type +
                ", decimals=" + decimals +
                ", issuanceHeight=" + issuanceHeight +
                ", issuerAccount=" + issuerAccount +
                ", issuerAccountRS='" + issuerAccountRS + '\'' +
                ", height=" + height +
                ", phased=" + phased +
                ", transactionHeight=" + transactionHeight +
                ", confirmations=" + confirmations +
                '}';
    }
}
