package io.vimana.vim.core.model.response;

import io.swagger.annotations.ApiModel;

@ApiModel
public class TokenResponse extends ResponseBase{
    public String account;
    public String accountRS;
    public Integer timestamp;
    public Boolean valid;
    public String token;

}
