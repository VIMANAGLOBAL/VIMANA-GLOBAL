package io.vimana.vim.core.model.response;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonInclude;
import io.vimana.vim.core.model.LessorDTO;

@JsonInclude(JsonInclude.Include.NON_NULL)
@JsonIgnoreProperties(ignoreUnknown = true)
public class AccountLessorsResponse {
    public LessorDTO[] lessorDTOS;
    public String accountRS;
    public long requestProcessingTime;
    public String account;
    public long height;
}
