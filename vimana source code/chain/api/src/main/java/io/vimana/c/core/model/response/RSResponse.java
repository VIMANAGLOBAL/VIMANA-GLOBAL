package io.vimana.vim.core.model.response;

public class RSResponse extends ResponseBase {
    public String accountRS;
    public String accountLongId;
    public String account;

    public RSResponse(String accountRS, String accountLongId, String account) {
        this.accountRS = accountRS;
        this.accountLongId = accountLongId;
        this.account = account;
    }
}
