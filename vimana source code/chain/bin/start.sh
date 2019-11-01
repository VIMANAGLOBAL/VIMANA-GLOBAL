#!/bin/sh
##########################################
# Starts Vimana blockchain in background
#########################################
vim_VERSION="0.2.4"
#Use default Java
JAVA=java

APPLICATION="vmn"

OUT_FILE=/tmp/${APPLICATION}.log

if [ -e ~/.${APPLICATION}/vmn.pid ]; then
    PID=`cat ~/.${APPLICATION}/vmn.pid`
    ps -p $PID > /dev/null
    STATUS=$?
    if [ $STATUS -eq 0 ]; then
        echo "VMN server already running"
        exit 1
    fi
fi
mkdir -p ~/.${APPLICATION}/

SCRIPT=`realpath -s $0`
SCRIPT_DIR=`dirname $SCRIPT`
TOP_DIR=`dirname $SCRIPT_DIR`
LIB_DIR=`realpath -s ${TOP_DIR}/lib`

if [ -d "${LIB_DIR}" ] ; then
    echo "Using path to executable JAR: $JAR_NAME"
    JAR_NAME=$TOP_DIR/vim-exec-${vim_VERSION}.jar
else
    JAR_DIR=${TOP_DIR}/vim-exec/target
    JAR_NAME=$JAR_DIR/vim-exec-${vim_VERSION}.jar
    echo "Running in dev environment. Using path to executable JAR: $JAR_NAME"
fi

CLSPTH="$JAR_NAME\
$JAR_DIR/../:conf"

#run in background
nohup ${JAVA} -cp ${CLSPTH} -jar $JAR_NAME > ${OUT_FILE} 2>&1 &
echo $! > ~/.${APPLICATION}/vmn.pid
cd - > /dev/null
