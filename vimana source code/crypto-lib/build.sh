#!/bin/bash
# Please never disable tests. Tests are intergral and very important part
# of library build process
DISABLE_TESTS=false
MVN_ARGS=""

if $DISABLE_TESTS ; then
echo "======================================================================"
echo "!!!!!!!!!!!!         Warning! Tests are disabled!      !!!!!!!!!!!!!!!"
echo "======================================================================"
MVN_ARGS="-DskipTests"
fi
#build Java library
cd Java
mvn install ${MVN_ARGS}
cd ..
