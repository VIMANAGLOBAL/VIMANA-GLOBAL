package io.vimana.vim.core.model.response;

public class EncodeQRCodeResponse extends ResponseBase {

    public String qrCodeBase64;

    public EncodeQRCodeResponse(String qrCodeBase64) {
        this.qrCodeBase64 = qrCodeBase64;
    }
}
