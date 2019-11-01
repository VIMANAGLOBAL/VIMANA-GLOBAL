package io.vimana.vim.core.model.response;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonProperty;
import io.vimana.vim.core.model.AccountCurrencyDTO;
import io.swagger.annotations.ApiModelProperty;

import java.util.List;

/**
 * @author isegodin
 */
@JsonInclude(JsonInclude.Include.NON_NULL)
public class AccountCurrencyListResponse extends ResponseBase {

    @ApiModelProperty(value = "List of account currencies")
    @JsonProperty("accountCurrencies")
    private List<AccountCurrencyDTO> data;

    public AccountCurrencyListResponse(List<AccountCurrencyDTO> data) {
        this.data = data;
    }

    public List<AccountCurrencyDTO> getData() {
        return data;
    }
}