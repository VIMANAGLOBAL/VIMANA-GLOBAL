package io.vimana.vim.core.model.response;

public class LongConvertResponce extends ResponseBase {

    public String stringId;
    public String longId;

    public LongConvertResponce(String stringId, String longId) {
        this.stringId = stringId;
        this.longId = longId;
    }
}
