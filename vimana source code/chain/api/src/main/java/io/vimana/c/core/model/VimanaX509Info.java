
package io.vimana.vim.core.model;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonInclude;
import io.swagger.annotations.ApiModel;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;

/**
 *
 * @author alukin@gmail.com
 */
@JsonInclude(JsonInclude.Include.NON_NULL)
@JsonIgnoreProperties(ignoreUnknown = true)
@ApiModel
public class VimanaX509Info {
    public String vimanaId;
    public String vimanaAuthorityId;
    public List<String> vimanaHardwareIds = new ArrayList<>();
    public String CN;
    public String O;
    public String OU;
    public String C;
    public String ST;
    public String L;
    public List<String> dnsNames;
    public List<String> ipAddresses;
    public Date validityStart;
    public Date validityEnd;
    public String signedBy;
    public String x509pem;    
}
