
package io.vimana.vim.core.model.response;

import com.fasterxml.jackson.annotation.JsonInclude;
import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;

import java.util.List;

/**
 * List of TransactionInfo instances with Transaction data + attachments
 */
@JsonInclude(JsonInclude.Include.NON_NULL)
//@ApiModel(description = "List of transaction data with optional attachment data")
@ApiModel
public class TransactionListInfoResponse extends ResponseBase {
    @ApiModelProperty(value = "Transaction list with all info", allowEmptyValue = true)
    public List<TransactionInfo> transactions;
    @ApiModelProperty(value = "Transaction list with all info", allowEmptyValue = true)
    public List<TransactionInfo> unconfirmedTransactions;
    @ApiModelProperty(value = "Transaction list with all info", allowEmptyValue = true)
    public List<TransactionInfo> expectedTransactions;

    @Override
    public String toString() {
        return "TransactionListInfoResponse{" +
                "transactions=[" + (transactions != null ? transactions.size() : -1 ) +
                "]}";
    }
}

