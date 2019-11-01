package io.vimana.vim.core.model.response;

import com.fasterxml.jackson.annotation.JsonInclude;
import io.vimana.vim.core.model.TransactionDTO;
import io.swagger.annotations.ApiModel;

@JsonInclude(JsonInclude.Include.NON_NULL)
@ApiModel
public class CreateTransactionInfoResponse extends ResponseBase {
    public TransactionDTO transactionJSON;
    public String unsignedTransactionBytes;
    public String transaction;
    public String fullHash;
    public String transactionBytes;
    public String signatureHash;
    public Boolean broadcasted;

    @Override
    public String toString() {
        return "CreateTransactionInfoResponse{" +
                "transaction='" + transaction + '\'' +
                ", broadcasted=" + broadcasted +
                '}';
    }
}
