package io.vimana.cryptolib.container;

import java.util.ArrayList;
import java.util.List;

/**
 * JSON FbWallet model
 * @author alukin@gmil.com
 */
public class FbWalletModel {
    public String version = "1.0.0";
    public String name="noName";
    public List<KeyRecord> keys=new ArrayList<>();
    public List<DataRecord> data = new ArrayList<>();
}
