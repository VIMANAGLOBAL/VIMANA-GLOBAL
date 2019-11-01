
package io.vimana.vim.core.model.response;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.databind.JsonNode;
import io.vimana.vim.core.model.TransactionDTO;
import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;

/**
 *  Signed transaction data
 */
@JsonInclude(JsonInclude.Include.NON_NULL)
//@ApiModel(description = "Single transaction data, optional attachment data is included")
@ApiModel
public class SignTransactionInfo extends ResponseBase {
    // additional fields
    @ApiModelProperty(value = "True if Transaction is verified, empty otherwise", allowEmptyValue = true)
    public Boolean verify;
    @ApiModelProperty(value = "False if Transaction is not valid, empty otherwise", allowEmptyValue = true)
    public Boolean validate;
    @ApiModelProperty(value = "Transaction Id")
    public String transaction;
    @ApiModelProperty(value = "Transaction full Hash")
    public String fullHash;
    @ApiModelProperty(value = "Transaction signature Hash")
    public String signatureHash;
    @ApiModelProperty(value = "Transaction")
    public TransactionDTO transactionJSON;
    @ApiModelProperty("Transaction's bytes representation")
    public String transactionBytes;
    public JsonNode prunableAttachmentJSON;

    public SignTransactionInfo() {
    }

    @Override
    public String toString() {
        return "TransactionVerifiedInfoResponse{" +
                '}';
    }
}

