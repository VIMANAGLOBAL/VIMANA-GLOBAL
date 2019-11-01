package io.vimana.vim.core.model.response;

import com.fasterxml.jackson.annotation.JsonInclude;

@JsonInclude(JsonInclude.Include.NON_NULL)
public class AccountCurrencyCountResponse extends ResponseBase {

    private Long numberOfCurrencies;

    public AccountCurrencyCountResponse(long numberOfCurrencies) {
        this.numberOfCurrencies = numberOfCurrencies;
    }

    public Long getNumberOfCurrencies() {
        return numberOfCurrencies;
    }
}
