# Installation

## NPM

You can use [npm](https://www.npmjs.org) to install a compiled version of the plugin
and [dependencies](dependencies.md):

```console
npm install videojs-record
```

If you [download it from Github](https://github.com/collab-project/videojs-record/releases),
you will have to [build the plugin](development.md) the plugin yourself.

## CDN

Using the [unpkg.com](https://unpkg.com) CDN:

```html
<!-- load css -->
<link rel="stylesheet" href="//unpkg.com/videojs-record/dist/css/videojs.record.min.css">

<!-- load script -->
<script src="//unpkg.com/videojs-record/dist/videojs.record.min.js"></script>
```

Alternative CDN locations:

- https://cdn.jsdelivr.net/npm/videojs-record/
- https://cdnjs.com/libraries/videojs-record
- http://www.bootcdn.cn/videojs-record

## Upgrade

Since version 4.0.0 this plugin is compatible with:

- video.js 7.0.5 or newer
- videojs-wavesurfer 3.2.0 or newer

If you want to use this plugin with an older video.js or videojs-wavesurfer version,
check the [archived releases](https://github.com/collab-project/videojs-record/releases)
for a 3.11.x or older release.

Also take a look at the [changelog](changelog.md) when upgrading from a previous
version of videojs-record.
