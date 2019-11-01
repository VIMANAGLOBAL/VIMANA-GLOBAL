package io.vimana.vim.core.model.response;

import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;

@ApiModel
public class TransactionCountResponse extends ResponseBase {
    @ApiModelProperty("Number of phased transactions")
    public Integer numberOfPhasedTransactions;
}
