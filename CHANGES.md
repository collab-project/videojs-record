videojs-record changelog
========================

1.6.2 - 2017/05/27
------------------

- Use video.js AMD module name (#123, #136)
- Bump required version for videojs-wavesurfer to 1.3.3 for the correct
  video.js AMD module name


1.6.1 - 2017/04/09
------------------

- Use `videojs.registerPlugin` in video.js 6.0.0 and newer
- Bumped required version for videojs-wavesurfer to 1.3.2 to support video.js
  6.0.0 and newer


1.6.0 - 2017/02/26
------------------

- Added `pause` and `resume` methods (#61)
- Added `getDuration` and `getCurrentTime` methods (#129)
- Added `progressRecord` event that fires continuously during recording (#128)
- Added support for `MediaStreamTrack.takePhoto` for image-only mode (#96)
- Plugin fixes for opus-recorder 0.5.0
- NPM package now includes `dist` directory with minified files
- Fix for ignoring missing player elements (#118 by @stragari)
- Bumped required version for videojs-wavesurfer to 1.3.1 for `getDuration`
  and `getCurrentTime` methods


1.5.2 - 2017/01/15
------------------

- Include CSS file for bower (#107 by @abrarahmedbcg)


1.5.1 - 2016/12/02
------------------

- Added `saveAs` method that shows a browser dialog window where the user can store
  the recorded media locally (#97)


1.5.0 - 2016/09/30
------------------

- Added `audioMimeType` and `videoMimeType` settings for H264 support (#92)
- Listening for `tap` events to support touch on mobile (#71)
- Bumped required version for videojs-wavesurfer to 1.2.6 and wavesurfer.js to
  1.2.0 for access to their `exportImage` method (#91)


1.4.0 - 2016/05/25
------------------

- Added `reset` method to reset the plugin without destroying it (#73)
- Releasing existing object URLs (#70)


1.3.0 - 2016/03/25
------------------

- Added `enumerateDevices` API (#16)
- Preventing invalid or negative value in `formatTime` (#46 by @zang)


1.2.0 - 2016/02/27
------------------

- Added compatibility for single file recording introduced in Chrome 49+ (by
  @zang)
- Preferring `navigator.mediaDevices.getUserMedia` instead of deprecated
  `navigator.getUserMedia` if available
- Stop using deprecated `MediaStream.stop()`; use `MediaStreamTrack.stop()`
  instead
- Added `audioRecorderType` and `videoRecorderType` options
- Bumped required version for videojs-wavesurfer to 1.1.0, wavesurfer.js to
  1.0.57 and recordrtc to 5.2.9 for microphone and Chrome fixes
- Fixes for latest release of the libvorbis.js plugin (1.1.1). This also
  removes the `audioModuleURL` option
- IE8 font fixes


1.1.0 - 2016/01/19
------------------

- Moved support for other audio recorders to separate source files
- Support for Opus using opus-recorder (#43)
- Support for MP3 using lamejs (#40)
- Support for recorder.js (#33)
- New settings: `audioChannels`, `frameWidth` and `frameHeight` (#35)
- Disabled video.js `loop` option permanently (#42)
- Disabled native controls for better Firefox mobile compatibility (#19)
- Added CSS for controlbar on mobile in examples (#19)
- Improved check for `getUserMedia` browser support (#38 by @xlc)
- Close `AudioContext` on stop in libvorbis.js plugin (#36, #37 by @xlc)
- Required version for RecordRTC is 5.2.7 now
- Required version for videojs-wavesurfer is 1.0.6 now
- Required version for wavesurfer.js and wavesurfer.microphone.js is 1.0.50 now
- Ability to add audio and video constraints (#30 by @alsar)
- Added filename and timestamp to recorded file object (#29)
- Added upload examples for the jquery.fileupload and Fine Uploader libraries (#29)


1.0.3 - 2015/12/20
------------------

- Fixed wrong module require for browserify (#28 by @alsar)


1.0.2 - 2015/10/19
------------------

- Added animated recording indicator (by @ikbensiep)
- Fixed `destroy`


1.0.1 - 2015/10/15
------------------

- Fixed AMD/Node/browser global dependency for video.js


1.0.0 - 2015/10/14
------------------

- Support for video.js 5
- Dropped support for video.js 4.x


0.9.3 - 2015/10/12
------------------

- Added translations for Afrikaans, German, Spanish, Finnish, Frisian, French,
  Galician, Italian, Portugese, Russian and Swedish


0.9.2 - 2015/10/06
------------------

- Bumped minimum version for wavesurfer.js (1.0.44) and videojs-wavesurfer
  (0.9.9) for microphone updates (#12)
- Fixed stop/getDevice in audio-only mode (#12)


0.9.1 - 2015/10/04
------------------

- Make sure bower and npm only download video.js v4.x (#15) because v5.0 is
  not supported yet (#6)
- Add `stopDevice` for disabling the webcam/microphone device (#12)
- Do something about new [mediastream deprecation warnings](https://developers.google.com/web/updates/2015/07/mediastream-deprecations) in Chrome 45 (#12)
- Fixed issue with missing `isChrome`


0.9.0 - 2015/09/25
------------------

- Support for libvorbis.js in audio-only mode (#8)
- Set default audio sample rate to 44100 (#7)


0.8.4 - 2015/08/27
------------------

- Examples fixes: wavesurfer changed domain name to wavesurfer-js.org


0.8.3 - 2015/07/30
------------------

- Added support for animated GIF recordings (#2)
- Both audio and video streams are now available when recording audio/video
  simultaneously in the Chrome browser (#4)
- Audio playback now works when recording both audio and video in the Chrome
  browser (#4)


0.8.2 - 2015/03/30
------------------

- Fixed `debug` option


0.8.1 - 2015/03/30
------------------

- Removed duplicate `stopRecord` event trigger for image-only mode


0.8.0 - 2015/03/30
------------------

- Switched to `MRecordRTC` to enable recording audio/video blobs (in
  Firefox >= 29 only at time of this release)
- Hide fullscreen button in image-only example


0.7.0 - 2015/03/28
------------------

- Added support for images (#1)


0.6.0 - 2015/03/23
------------------

- Documentation fixes


0.5.0 - 2015/02/21
------------------

- Added `destroy` method for cleaning up
- Added `debug` option to control console logging (in RecordRTC)


0.4.0 - 2015/02/19
------------------

- Compatibility fixes for Video.js 4.12.0


0.3.0 - 2015/02/11
------------------

- Added Dutch translation
- Disable controls during waveform rendering
- Added `deviceReady` event
- Documentation fixes


0.2.0 - 2015/01/07
------------------

- Bugfixes


0.1.0 - 2015/01/06
------------------

- Initial release
