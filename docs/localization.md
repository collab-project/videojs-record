# Localization

This plugin supports multiple languages. Each language has it's own file
(found in the `src/lang` directory) that contains the translated text.

## Usage

Using a different language, for example Dutch (`nl`), is done by including
the plugin's language file and the Video.js language file:

```html
<script src="videojs-record/dist/lang/nl.js"></script>
<script src="video.js/dist/lang/nl.js"></script>
```

And setting the Video.js player's `language` option:

```javascript
language: "nl"
```

## Contribute

Adding support for an additional language is done by adding a new file with
a filename that consists of the country code and the `.json` extension, eg.
`fr.json`.

The [build script](development.md) compiles the JSON into a usable
language file, eg. `fr.js`.

Check the Video.js `lang` directory for a
[list of supported languages](https://github.com/videojs/video.js/tree/master/lang).

Pull requests to add more languages to this plugin are always welcome!
You can also help out using the Transifex
[online translation tool](https://www.transifex.com/collab/videojs-record/).
