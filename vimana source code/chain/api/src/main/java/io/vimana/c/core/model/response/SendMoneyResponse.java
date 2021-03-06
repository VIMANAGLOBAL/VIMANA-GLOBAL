package io.vimana.vim.core.model.response;

import com.fasterxml.jackson.annotation.JsonInclude;
import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;

@JsonInclude(JsonInclude.Include.NON_NULL)
//@ApiModel(description = "Information about transaction's broadcast operation")
@ApiModel
public class SendMoneyResponse extends ResponseBase {
    @ApiModelProperty("Transaction full hash")
    public String fullHash;
    @ApiModelProperty("Transaction id as string")
    public String transaction;

    @Override
    public String toString() {
        return "SendMoneyResponse{" +
                "fullHash='" + fullHash + '\'' +
                ", transaction='" + transaction + '\'' +
                '}';
    }
}
