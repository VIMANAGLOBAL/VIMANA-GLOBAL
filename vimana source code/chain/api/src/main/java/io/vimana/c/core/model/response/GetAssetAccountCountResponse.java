package io.vimana.vim.core.model.response;

import com.fasterxml.jackson.annotation.JsonInclude;

@JsonInclude(JsonInclude.Include.NON_NULL)
public class GetAssetAccountCountResponse extends ResponseBase{
        public Long numberOfAccounts;

}
