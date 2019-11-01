package io.vimana.cryptolib.container;

import java.util.List;

/**
 * JSON-based encrypted general purpose wallet
 *
 * @author alukin@gmail.com
 */
public class FbWallet extends GenericWallet<FbWalletModel>{

    public FbWallet() {
        wallet = new FbWalletModel();
        walletModelClass=FbWalletModel.class;
    }

    public void addData(DataRecord dr) {
        wallet.data.add(dr);
    }

    public void addKey(KeyRecord kr) {
        wallet.keys.add(kr);
    }

    public DataRecord getData(String alias) {
        DataRecord res = null;
        for (DataRecord dr : wallet.data) {
            if (alias.equals(dr.alias)) {
                res = dr;
                break;
            }
        }
        return res;
    }

    public KeyRecord getKeys(String alias) {
        KeyRecord res = null;
        for (KeyRecord dr : wallet.keys) {
            if (alias.equals(dr.alias)) {
                res = dr;
                break;
            }
        }
        return res;
    }

    public List<KeyRecord> getAllKeys() {
        return wallet.keys;
    }

    public List<DataRecord> getAllData() {
        return wallet.data;
    }

    @Override
    public FbWalletModel getWallet() {
        return wallet;
    }

    @Override
    public void setWallet(FbWalletModel wallet) {
        this.wallet = wallet;
    }
    
  }
