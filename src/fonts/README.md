Font
====

This directory contains the generated font used in the videojs-record plugin.

The font provides extra icons used in the plugin.

Continue reading if you want to customize or generate the font.

Prepare
-------

To modify and update the generated fonts, checkout a copy of the video.js
[font](https://github.com/videojs/font) repository:

```
cd /tmp
git clone https://github.com/videojs/font.git
cd font
```

Install the `grunt-cli` tool if you don't have it already (you might
need root user permissions here):

```
npm install -g grunt-cli
```

Install the dependencies:

```
npm install
```

Customize
---------

Copy [icons.json](icons.json) and replace it in the root of the `font` repository:

```
cp -v /path/to/videojs-record/src/fonts/icons.json /path/to/font/
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
cp -v scss/_icons.scss /path/to/videojs-record/src/css/
cp -v fonts/videojs-record.* /path/to/videojs-record/src/fonts/
```

If you also want to copy them to the `dist` directory (optional as it's done
again during a build):

```
cd /path/to/videojs-record/
npm run build
```

References
----------

Check the video.js font project [documentation](https://github.com/videojs/font/blob/master/README.md)
for more information.
