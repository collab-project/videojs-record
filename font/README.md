Font
====

This directory contains the generated font used in the videojs-record plugin.

The font provides extra icons used in the plugin.

Continue reading if you want to customize the font.

Prepare
-------

To modify and update the generated fonts, checkout a copy of the video.js
[font](https://github.com/videojs/font) repository:

```
cd /tmp
git clone https://github.com/videojs/font.git
cd font
```

Install the `grunt-cli` and `npm-check-updates` libraries (you might need root user
permissions here):

```
npm install -g grunt-cli npm-check-updates
```

Update `material-design-icons` and `webfonts-generator` to the latest version:

```
ncu --upgrade material-design-icons webfonts-generator
```

Install the dependencies:

```
npm install
```

Edit `lib/grunt.js` and replace `VideoJS` with `videojs-record` (until this
[pull request](https://github.com/videojs/font/pull/25) lands and is released).

Customize
---------

Copy [icons.json](icons.json) and replace it in the root of the `font` repository:

```
cp -v /path/to/videojs-record/font/icons.json /path/to/font/
```

Now run `grunt` to build the fonts and styles:

```
grunt
```

Open `index.html` in a browser to see the fonts in action.

Update
------

Copy the generated `_icons.scss` and font files back to the `videojs-record`
repository:

```
cp -v scss/_icons.scss /path/to/videojs-record/src/css
cp -v fonts/videojs-record.* /path/to/videojs-record/font/
```

If you also want to copy them to the `dist` directory (optional as it's done
again during a build):

```
cd /path/to/videojs-record/
npm run build:fonts
```

References
----------

Check the video.js font project [documentation](https://github.com/videojs/font/blob/master/README.md)
for more information.
