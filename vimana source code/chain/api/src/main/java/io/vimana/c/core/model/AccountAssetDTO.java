package io.vimana.vim.core.model;

import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import com.fasterxml.jackson.databind.ser.std.ToStringSerializer;

/**
 * @author isegodin
 */
public class AccountAssetDTO {

    public String account;
    public String accountRS;
    public String asset;

    @JsonSerialize(using = ToStringSerializer.class)
    public Long quantityQNT;

    @JsonSerialize(using = ToStringSerializer.class)
    public Long unconfirmedQuantityQNT;

    /*
     * Additional fields
     */

    /**
     * Asset name
     */
    public String name;

    /**
     * Asset decimals
     */
    public Byte decimals;
}
