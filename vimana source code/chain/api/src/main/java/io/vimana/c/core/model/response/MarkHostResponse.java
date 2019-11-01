package io.vimana.vim.core.model.response;

import io.swagger.annotations.ApiModel;

@ApiModel
public class MarkHostResponse extends ResponseBase {

    public String hallmark;

    public MarkHostResponse(String hallmark) {
        this.hallmark = hallmark;
    }
}
