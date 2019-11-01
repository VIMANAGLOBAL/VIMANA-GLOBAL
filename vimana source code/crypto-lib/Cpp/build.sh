#!/bin/bash
rm -rf build
mkdir build
cd build
cmake ../vimrypto -DOPENSSL_ROOT_DIR=/usr/local/Cellar/openssl/1.0.2k
make
