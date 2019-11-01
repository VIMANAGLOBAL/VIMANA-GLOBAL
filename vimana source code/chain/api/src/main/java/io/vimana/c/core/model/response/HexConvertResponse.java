package io.vimana.vim.core.model.response;

public class HexConvertResponse extends ResponseBase {

    public String text;
    public String binary;

    public HexConvertResponse(String text, String binary) {
        this.text = text;
        this.binary = binary;
    }
}