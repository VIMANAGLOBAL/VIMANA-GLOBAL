package io.vimana.vim.core.model.response;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import com.fasterxml.jackson.databind.ser.std.ToStringSerializer;
import io.vimana.vim.core.model.AccountAssetBalanceDTO;
import io.vimana.vim.core.model.AccountAssetUnconfirmedBalanceDTO;
import io.vimana.vim.core.model.AccountCurrencyDTO;
import io.vimana.vim.core.model.AccountLeaseDTO;

import java.util.List;
import java.util.Set;

/**
 * @author isegodin
 */
@JsonInclude(JsonInclude.Include.NON_NULL)
public class AccountResponse extends ResponseBase {

    public String name;
    public String description;
    public String account;
    public String accountRS;
    public String publicKey;

    @JsonSerialize(using = ToStringSerializer.class)
    public Long balanceNQT;

    @JsonSerialize(using = ToStringSerializer.class)
    public Long forgedBalanceNQT;

    @JsonSerialize(using = ToStringSerializer.class)
    public Long unconfirmedBalanceNQT;

    /**
     * ControlType
     */
    public Set<String> accountControls;

    /**
     * Fields of AccountLease
     */

    public String currentLessee;
    public String currentLesseeRS;
    public Integer currentLeasingHeightFrom;
    public Integer currentLeasingHeightTo;
    public String nextLessee;
    public String nextLesseeRS;
    public Integer nextLeasingHeightFrom;
    public Integer nextLeasingHeightTo;

    /**
     * Extra fields, loaded on demand
     */
    public List<String> lessors;
    public List<String> lessorsRS;
    public List<AccountLeaseDTO> lessorsInfo;

    public Long effectiveBalance;

    @JsonSerialize(using = ToStringSerializer.class)
    public Long guaranteedBalance;

    public List<AccountAssetBalanceDTO> assetBalances;
    public List<AccountAssetUnconfirmedBalanceDTO> unconfirmedAssetBalances;

    public List<AccountCurrencyDTO> accountCurrencies;

}
