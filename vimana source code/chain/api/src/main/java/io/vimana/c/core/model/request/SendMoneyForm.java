package io.vimana.vim.core.model.request;

import io.swagger.annotations.ApiModel;
import org.jboss.resteasy.annotations.jaxrs.FormParam;

@ApiModel
public class SendMoneyForm extends CreateTransactionForm {
    // send money fields
    @FormParam("recipient")
    public String recipient;
    @FormParam("amountNQT")
    public Long amountNQT;


    @Override
    public String toString() {
        return "SendMoneyForm{" +
                "recipient='" + recipient + '\'' +
                ", amountNQT='" + amountNQT + '\'' +
                '}';
    }
}
