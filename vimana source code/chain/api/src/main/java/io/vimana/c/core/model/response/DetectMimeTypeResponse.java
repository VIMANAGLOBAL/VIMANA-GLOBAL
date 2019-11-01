package io.vimana.vim.core.model.response;

public class DetectMimeTypeResponse extends ResponseBase  {

    public String type;

    public DetectMimeTypeResponse(String type) {
        this.type = type;
    }
}
