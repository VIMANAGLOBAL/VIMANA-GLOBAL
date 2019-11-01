#!/bin/sh
# Defive versions
NEW_VERSION=0.2.4
NEW_MIN_COMPAT=0.2.0
NEW_MAX_COMPAT=0.2.99

# set versions in parent pom and in all childs
echo "New version is: $NEW_VERSION"
echo "Changing Maven's POM files"
mvn versions:set -DnewVersion=${NEW_VERSION}

# set verions in Constants.java (application hardcoded version)
CONST_PATH=vim-util/src/main/java/io/vimana/vim/util/Constants.java
echo "Changing Constants in $CONST_PATH"
VER_STR="VERSION"
MIN_VER_STR="MIN_VERSION ="
MAX_VER_STR="public static final String MAX_VERSION ="
sed -i -e "s/\ VERSION.*/ VERSION = \"$NEW_VERSION\";/g" ${CONST_PATH}
sed -i -e "s/\ MIN_VERSION.*/ MIN_VERSION = \"$NEW_MIN_COMPAT\";/g" ${CONST_PATH}
sed -i -e "s/\ MAX_VERSION.*/ MAX_VERSION = \"$NEW_MAX_COMPAT\";/g" ${CONST_PATH}

#set version in shell scripts
scripts="vim-run.sh vim-start.sh"

for script in $scripts ; do
  fname=bin/$script
  echo "Changing $fname"
  sed -i -e "s/^vim_VERSION.*/vim_VERSION=\"$NEW_VERSION\"/g" $fname
done
