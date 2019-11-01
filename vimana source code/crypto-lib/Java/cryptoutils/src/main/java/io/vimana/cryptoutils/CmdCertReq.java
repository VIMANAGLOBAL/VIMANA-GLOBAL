package io.vimana.cryptoutils;

import com.beust.jcommander.DynamicParameter;
import com.beust.jcommander.Parameter;
import com.beust.jcommander.Parameters;
import java.util.HashMap;
import java.util.Map;

/**
 *
 * @author alukin@gmail.com
 */

@Parameters(commandDescription = "Create, display, check certificate request")
public class CmdCertReq {

    @Parameter(names = {"--template", "-t"}, description = "Path to  file with default parameters")
    public String template="";
    @Parameter(names = {"--interactive", "-i"}, description = "Interactive mode")
    public Boolean interactive=false;
    @Parameter(names = {"--selfsigned", "-s"}, description = "Create self-signed X.509 certificate")
    public Boolean selfsigned=false;
    @Parameter(names = {"--rqtype", "-r"}, description = "Type of certificate request: personal, host, softsign", validateWith = RqTypeValidator.class)
    public String rqtype="host";   
    @DynamicParameter(names = {"--define","-D"}, description =  "Define property, e.g. certificate parameter. Format: name=value; May be used multiple times. Overwrites template")
    public Map<String, String> params = new HashMap<>();     
    @Parameter(names = {"--password", "-p"}, description = "Set challenge password in CSR")
    public String challengePassword="";
}
