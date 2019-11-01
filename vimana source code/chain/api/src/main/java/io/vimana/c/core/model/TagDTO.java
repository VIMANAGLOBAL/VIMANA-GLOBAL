package io.vimana.vim.core.model;

import com.fasterxml.jackson.annotation.JsonInclude;

@JsonInclude(JsonInclude.Include.NON_NULL)
public class TagDTO {
    public String tag;
    public Integer height;
    public Integer count;
}
