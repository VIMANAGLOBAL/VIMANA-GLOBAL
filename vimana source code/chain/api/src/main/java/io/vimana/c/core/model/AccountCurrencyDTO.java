package io.vimana.vim.core.model;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import com.fasterxml.jackson.databind.ser.std.ToStringSerializer;

/**
 * @author isegodin
 */
@JsonInclude(JsonInclude.Include.NON_NULL)
public class AccountCurrencyDTO {

    public String account;
    public String accountRS;
    public String currency;

    @JsonSerialize(using = ToStringSerializer.class)
    public Long units;

    @JsonSerialize(using = ToStringSerializer.class)
    public Long unconfirmedUnits;

    /*
     * Additional fields
     */

    /*
     * Currency fields
     */
    public String name;
    public String code;
    public Integer type;
    public Byte decimals;
    public Integer issuanceHeight;
    public String issuerAccount;
    public String issuerAccountRS;


}
