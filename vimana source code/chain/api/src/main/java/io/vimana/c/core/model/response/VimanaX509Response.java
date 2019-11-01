package io.vimana.vim.core.model.response;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonInclude;
import io.vimana.vim.core.model.VimanaX509Info;
import io.swagger.annotations.ApiModel;
import java.util.ArrayList;
import java.util.List;

/**
 *
 * @author alukin@gmail.com
 */
@JsonInclude(JsonInclude.Include.NON_NULL)
@JsonIgnoreProperties(ignoreUnknown = true)
@ApiModel
public class VimanaX509Response extends ResponseBase{
    public String vimanaId;
    public List<VimanaX509Info> x509info = new ArrayList<>();
}
