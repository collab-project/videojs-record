#!/bin/bash

export OLD_VERSION=2.5.0
export NEW_VERSION=2.5.1

echo
echo "Update videojs-wavesurfer to v"$NEW_VERSION
echo

# update in examples
if [ "$(uname)" == "Darwin" ]; then
    find . -type f -name '*.html' -exec sed -i '' s/$OLD_VERSION/$NEW_VERSION/ {} +
else
    find examples/ -type f -name '*.html' -exec sed -i "s/$OLD_VERSION/$NEW_VERSION/" {} \;
fi
