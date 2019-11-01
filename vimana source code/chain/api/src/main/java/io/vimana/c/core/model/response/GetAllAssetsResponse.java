package io.vimana.vim.core.model.response;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonInclude;
import io.vimana.vim.core.model.AssetDTO;

@JsonInclude(JsonInclude.Include.NON_NULL)
@JsonIgnoreProperties(ignoreUnknown = true)
public class GetAllAssetsResponse extends ResponseBase{
    public AssetDTO[] assetDTOS;
}
