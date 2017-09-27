Font
====

This directory contains the generated fonts used in the videojs-record plugin.

Setup
-----

To modify and update the generated fonts, checkout a copy of the video.js
[font](https://github.com/videojs/font) repository:

```
cd /tmp
git clone https://github.com/videojs/font.git
cd font
```

Install the dependencies:

```
npm install -g grunt-cli
npm install
```

Edit `lib/grunt.js` and replace `VideoJS` with `videojs-record` (until this
[pull request](https://github.com/videojs/font/pull/25) lands and is released).

Customize
---------

Copy the `icons.json` file from the `videojs-record` repository to
the root of the `font` repository:

```
cp /path/to/videojs-record/src/css/icons.json /path/to/font/
```

Now run `grunt` to build the fonts and styles:

```
grunt
```

Now copy the generated `_icons.scss` and font files back to the `videojs-record`
repository:

```
cp -v scss/_icons.scss /path/to/videojs-record/src/scss
cp -v fonts/videojs-record.* /path/to/videojs-record/font
```

References
----------

See the videojs `font` project documentation for more info:
https://github.com/videojs/font/blob/master/README.md
