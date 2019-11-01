package io.vimana.vim.core.model.response;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonProperty;
import io.vimana.vim.core.model.AccountAssetDTO;
import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;

import java.util.List;

/**
 * @author isegodin
 */
@JsonInclude(JsonInclude.Include.NON_NULL)
public class AccountAssetListResponse extends ResponseBase {

    @ApiModelProperty(value = "List of account assets")
    @JsonProperty("accountAssets")
    private List<AccountAssetDTO> data;

    public AccountAssetListResponse(List<AccountAssetDTO> data) {
        this.data = data;
    }

    public List<AccountAssetDTO> getData() {
        return data;
    }
}