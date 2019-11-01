package io.vimana.vim.core.model;

/**
 * @author isegodin
 */
public class AccountLeaseDTO {

    public String account;
    public String accountRS;

    public String currentLessee;
    public String currentLesseeRS;
    public Integer currentHeightFrom;
    public Integer currentHeightTo;

    public String nextLessee;
    public String nextLesseeRS;
    public Integer nextHeightFrom;
    public Integer nextHeightTo;

    /**
     * Additional fields
     */

    public Long effectiveBalance;

}
