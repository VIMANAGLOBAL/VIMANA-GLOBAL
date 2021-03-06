package io.vimana.cryptoutils;

import com.beust.jcommander.Parameter;

/**
 * Command line arguments for cryptoutils
 * @author alukin@gmail.com
 * @see http://jcommander.org/
 */
public class CmdLineArgs {
    
    //Main parameter
    @Parameter(description = "Command to run. gencsr, savecert, genself")    
    public String command;
    
    @Parameter(names = {"--debug", "-d"}, description = "Debug mode")
    public boolean debug = false;
    @Parameter(names = {"--verbose", "-v"}, description = "Verbosity level 0-9")
    public Integer verbose = 1;
    @Parameter(names = "--help", help = true, description = "Print help message")
    public boolean help;
     @Parameter(names = {"--keypass", "-p"}, description = "Passphrase for private key encryption") //password = true)
    public String keypass;
    @Parameter(names = {"--storefile", "-f"}, description = "Path to PKCS#12 key store file. If not set, PEM output is default")
    public String storefile;
    @Parameter(names = {"--storealias", "-a"}, description = "Alias in PKCS#12 key store")
    public String storealias;
    @Parameter(names = {"--storepass", "-s"}, description = "Passphrase for key store") //password = true)
    public String storepass;
    @Parameter(names = {"--out", "-o"}, description = "Output path. Defaults: newcert.pem, newreq.pem, newcert_pvtkey.pem")
    public String outfile="";
     @Parameter(names = {"--input", "-i"}, description = "Input path")
    public String infile="newcert.pem";    

}
