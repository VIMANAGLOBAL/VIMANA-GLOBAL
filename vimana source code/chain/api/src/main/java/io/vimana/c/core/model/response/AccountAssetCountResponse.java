package io.vimana.vim.core.model.response;

import com.fasterxml.jackson.annotation.JsonInclude;

@JsonInclude(JsonInclude.Include.NON_NULL)
public class AccountAssetCountResponse extends ResponseBase {

    private Long numberOfAssets;

    public AccountAssetCountResponse(long numberOfAssets) {
        this.numberOfAssets = numberOfAssets;
    }

    public Long getNumberOfAssets() {
        return numberOfAssets;
    }
}
