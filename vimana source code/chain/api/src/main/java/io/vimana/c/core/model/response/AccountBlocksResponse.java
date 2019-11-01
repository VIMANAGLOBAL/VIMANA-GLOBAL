package io.vimana.vim.core.model.response;

import com.fasterxml.jackson.annotation.JsonInclude;
import io.vimana.vim.core.model.BlockDTO;
import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;

import java.util.ArrayList;
import java.util.List;

@JsonInclude(JsonInclude.Include.NON_NULL)
@ApiModel(description = "Blocks of Account representation")
public class AccountBlocksResponse extends ResponseBase{
    @ApiModelProperty(value = "List of blocks in account", allowEmptyValue = false)
    public List<BlockDTO> blockDTOS = new ArrayList<>();
}
