package io.vimana.vim.core.model;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonInclude;

@JsonInclude(JsonInclude.Include.NON_NULL)
@JsonIgnoreProperties(ignoreUnknown = true)
public class vimPropertyDTO {
    public String setterRS;
    public String property;
    public String setter;
    public Object value;
}
