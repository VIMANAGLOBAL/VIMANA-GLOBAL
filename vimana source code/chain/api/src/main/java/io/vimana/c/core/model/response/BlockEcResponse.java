
package io.vimana.vim.core.model.response;

import com.fasterxml.jackson.annotation.JsonInclude;
import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;

/**
 * Response EC block info
 */
@JsonInclude(JsonInclude.Include.NON_NULL)
//@ApiModel(description = "Block's info with three fields")
@ApiModel
public class BlockEcResponse extends ResponseBase {
    @ApiModelProperty("EC block id")
    public String ecBlockId;
    @ApiModelProperty("EC block height")
    public Integer ecBlockHeight;
    @ApiModelProperty("Block timestamp")
    public String timestamp;

    @Override
    public String toString() {
        return "BlockEcResponse{" +
                "ecBlockId='" + ecBlockId + '\'' +
                ", ecBlockHeight='" + ecBlockHeight + '\'' +
                ", timestamp='" + timestamp + '\'' +
                '}';
    }
}
