package io.vimana.vim.core.model;

import io.vimana.vim.core.model.response.ResponseBase;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonInclude;

@JsonInclude(JsonInclude.Include.NON_NULL)
@JsonIgnoreProperties(ignoreUnknown = true)
public class Peers extends ResponseBase{
    public String[] peers;
}
