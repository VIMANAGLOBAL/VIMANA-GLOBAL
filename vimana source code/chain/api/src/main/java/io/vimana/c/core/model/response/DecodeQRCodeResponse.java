package io.vimana.vim.core.model.response;

public class DecodeQRCodeResponse extends ResponseBase {

    public String qrCodeData;

    public DecodeQRCodeResponse(String qrCodeData) {
        this.qrCodeData = qrCodeData;
    }

}
