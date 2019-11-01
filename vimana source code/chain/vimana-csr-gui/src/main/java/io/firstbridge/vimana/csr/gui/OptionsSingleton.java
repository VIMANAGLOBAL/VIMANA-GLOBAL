package io.vimana.vimana.csr.gui;

/**
 *
 * @author alukin@gmail.cpom
 */
public class OptionsSingleton {
    private boolean loadPrivateKey = true;
    
    private OptionsSingleton() {
    }
    
    public static OptionsSingleton getInstance() {
        return OptionsSingletonHolder.INSTANCE;
    }
    
    private static class OptionsSingletonHolder {
        private static final OptionsSingleton INSTANCE = new OptionsSingleton();
    }

    public boolean isLoadPrivateKey() {
        return loadPrivateKey;
    }

    public void setLoadPrivateKey(boolean loadPrivateKey) {
        this.loadPrivateKey = loadPrivateKey;
    }
    
}
