#!/bin/bash

export OLD_VERSION=6.7.3
export NEW_VERSION=6.8.0

echo
echo "Update video.js to v"$NEW_VERSION
echo

# check if language files exist
#wget --delete-after https://vjs.zencdn.net/$NEW_VERSION/lang/nl.js

# update videojs in examples and documentation
if [ "$(uname)" == "Darwin" ]; then
    find . -type f -name '*.html' -exec sed -i '' s/$OLD_VERSION/$NEW_VERSION/ {} +
else
    find examples/ -type f -name '*.html' -exec sed -i "s/$OLD_VERSION/$NEW_VERSION/" {} \;
fi

#git commit -am "bump videojs to $NEW_VERSION in examples"
