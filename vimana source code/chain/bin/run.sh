#!/bin/sh
###########################################
# Runs Vimana blockchain in foreground
###########################################
vim_VERSION="0.2.4"
#Use default Java
JAVA=java

SCRIPT=`realpath -s $0`
SCRIPT_DIR=`dirname $SCRIPT`
TOP_DIR=`dirname $SCRIPT_DIR`
LIB_DIR=`realpath -s ${TOP_DIR}/lib`

if [ -d "${LIB_DIR}" ] ; then
    JAR_NAME=$TOP_DIR/vim-exec-${vim_VERSION}.jar
    echo "Using path to executable JAR: $JAR_NAME"
else
    JAR_DIR=${TOP_DIR}/vim-exec/target
    JAR_NAME=$JAR_DIR/vim-exec-${vim_VERSION}.jar
    echo "Running in dev environment. Using path to executable JAR: $JAR_NAME"
fi

CLSPTH="$JAR_NAME\
$JAR_DIR/../:conf"

#run in foreground
${JAVA} -cp ${CLSPTH} -jar ${JAR_NAME}
 
