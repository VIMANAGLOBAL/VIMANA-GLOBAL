package io.vimana.vim.core.model.response;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonInclude;
import io.vimana.vim.core.model.PhasingOnlyControlDTO;

@JsonInclude(JsonInclude.Include.NON_NULL)
@JsonIgnoreProperties(ignoreUnknown = true)
public class PhasingOnlyControlResponse extends ResponseBase {
    public PhasingOnlyControlDTO[] phasingOnlyControlDTOS;
}
