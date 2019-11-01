package io.vimana.vim.core.model.request;

import io.swagger.annotations.ApiModel;
import org.jboss.resteasy.annotations.jaxrs.FormParam;

@ApiModel
public class ApproveTransactionForm extends CreateTransactionForm {
    // approve operation fields only
    @FormParam("transactionFullHash")
    public String transactionFullHash;
    @FormParam("revealedSecret")
    public String revealedSecret;
    @FormParam("revealedSecretText")
    public String revealedSecretText;
    @FormParam("revealedSecretIsText")
    public Boolean revealedSecretIsText;

}
