package io.vimana.vim.core.model;

import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import com.fasterxml.jackson.databind.ser.std.ToStringSerializer;

/**
 * @author isegodin
 */
public class AccountAssetBalanceDTO {

    public String asset;

    @JsonSerialize(using = ToStringSerializer.class)
    public Long balanceQNT;
}
