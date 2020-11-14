# Browser support

| Browser | Version | Features | Related ticket(s) |
|-------------|-------------|-------------|-------------|
| Firefox | Stable / Aurora / Nightly | Audio + Video + Image + Screen + Screen w/ Audio | |
| Chrome | Stable / Canary / Beta / Dev | Audio + Video + Image + Screen + Screen w/ Audio | |
| Chrome iOS | Not supported | Not supported: missing `getUserMedia` | |
| Opera | Stable / NEXT | Audio + Video + Image + Screen | |
| Android | Chrome / Firefox / Opera | Audio + Video + Image | |
| Safari | Stable / Beta / Preview | Audio + Video + Image + Screen | [#332](https://github.com/collab-project/videojs-record/issues/332) |
| Safari iOS | Stable / Beta | Audio + Image | [#332](https://github.com/collab-project/videojs-record/issues/332) |
| Microsoft Edge | Based on Chromium (Windows 7/8/10 and MacOS) | audio + video + screen | |
| Microsoft Edge | Old deprecated versions | Audio + Image | [#178](https://github.com/collab-project/videojs-record/issues/178) |

## Browser API {docsify-ignore}

Current browser API support for this library:

```
╔═════════════════╤══════════════╤═══════════════╤══════════╤═════════════════╗
║ Browser         │ getUserMedia │ MediaRecorder │ WebAudio │ getDisplayMedia ║
╟─────────────────┼──────────────┼───────────────┼──────────┼─────────────────╢
║ Chrome Desktop  │ ✔            │ ✔             │ ✔        │ ✔               ║
╟─────────────────┼──────────────┼───────────────┼──────────┼─────────────────╢
║ Android Chrome  │ ✔            │ ✔             │ ✔        │ ?               ║
╟─────────────────┼──────────────┼───────────────┼──────────┼─────────────────╢
║ Firefox Desktop │ ✔            │ ✔             │ ✔        │ ✔               ║
╟─────────────────┼──────────────┼───────────────┼──────────┼─────────────────╢
║ Android Firefox │ ✔            │ ✖             │ ✔        │ ?               ║
╟─────────────────┼──────────────┼───────────────┼──────────┼─────────────────╢
║ Edge            │ ✔            │ ✔             │ ✔        │ ✔               ║
╟─────────────────┼──────────────┼───────────────┼──────────┼─────────────────╢
║ iOS Safari      │ ✔            │ ✖             │ ✔        │ ?               ║
╟─────────────────┼──────────────┼───────────────┼──────────┼─────────────────╢
║ Safari Desktop  │ ✔            │ ✖             │ ✔        │ ?               ║
╟─────────────────┼──────────────┼───────────────┼──────────┼─────────────────╢
║ Opera Mobile    │ ✔            │ ✖             │ ✔        │ ?               ║
╟─────────────────┼──────────────┼───────────────┼──────────┼─────────────────╢
║ Opera Desktop   │ ✔            │ ✔             │ ✔        │ ?               ║
╚═════════════════╧══════════════╧═══════════════╧══════════╧═════════════════╝
```

The report is generated using the data pulled from https://caniuse.com at time of writing.

If you want to generate a table like this with the latest data, read the instructions
below.

### Installation

Install the dependencies:

```console
npm install caniuse-api table log-symbols
```

### Usage

Now copy the script below into a new file, e.g. `browser-support.js` and run
that file with node.js to generate and display the report in the console:

```console
node browser-support.js
```

### Script

```javascript
const table = require('table');
const caniuse = require('caniuse-api');
const logSymbols = require('log-symbols');

// query caniuse for supported API's
let mediaRecorder_support = caniuse.getSupport('mediarecorder');
let getUserMedia_support = caniuse.getSupport('stream');
let webAudio_support = caniuse.getSupport('audio-api');

// table headers
let data = [['Browser', 'getUserMedia', 'MediaRecorder', 'WebAudio', 'getDisplayMedia']];

// browser mapping
let browsers = {
    'chrome': 'Chrome Desktop',
    'and_chr': 'Android Chrome',
    'firefox': 'Firefox Desktop',
    'and_ff': 'Android Firefox',
    'edge': 'Edge',
    'ios_saf': 'iOS Safari',
    'safari': 'Safari Desktop',
    'op_mob': 'Opera Mobile',
    'opera': 'Opera Desktop'
};

function checkSupport(target) {
    if (target) {
        if (target.y) {
            return logSymbols.success;
        } else if (target.n) {
            return logSymbols.error;
        }
    } else {
        return '?';
    }
}

let keys = Object.keys(browsers);
let index, browserId, browserName, mrSupport, gumSupport;
for (index=0; index < keys.length; index++) {
    browserId = keys[index];
    browserName = browsers[browserId];
    mrSupport = checkSupport(mediaRecorder_support[browserId]);
    gumSupport = checkSupport(getUserMedia_support[browserId]);
    waSupport = checkSupport(webAudio_support[browserId]);
    gdmSupport = checkSupport();

    data.push([browserName, gumSupport, mrSupport, waSupport, gdmSupport]);
};

// render table
let output = table.table(data);
console.log(output);
```
