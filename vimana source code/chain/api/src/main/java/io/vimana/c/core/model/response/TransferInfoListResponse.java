
package io.vimana.vim.core.model.response;

import com.fasterxml.jackson.annotation.JsonInclude;
import io.vimana.vim.core.model.CurrencyTransferDTO;
import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;

import java.util.List;

/**
 * Response with list of currency transfer info
 */
@JsonInclude(JsonInclude.Include.NON_NULL)
@ApiModel
public class TransferInfoListResponse extends ResponseBase {

    @ApiModelProperty(value = "Transfer info list", allowEmptyValue = true)
    public List<CurrencyTransferDTO> transfers;

    @Override
    public String toString() {
        return "TransferInfoListResponse{" +
                "transfers=[" + (transfers != null ? transfers.size() : 0) +
                "]}";
    }
}
