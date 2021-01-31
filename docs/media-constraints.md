# Media constraints

[Media stream constraints](https://developer.mozilla.org/en-US/docs/Web/API/MediaDevices/getUserMedia#Parameters)
allow you to specify the types of media to request, along with any requirements
for each type.

The following example shows how to change the camera or screen resolution to 1280 by 720
pixels:

```javascript
let options = {
    controls: true,
    bigPlayButton: false,
    loop: false,
    // dimensions of video.js player
    fluid: false,
    width: 640,
    height: 480,
    plugins: {
        record: {
            maxLength: 5,
            debug: true,
            audio: false,
            video: {
                // video media constraints: set resolution of camera
                width: { min: 640, ideal: 640, max: 1280 },
                height: { min: 480, ideal: 480, max: 920 }
            },
            // dimensions of captured video frames
            frameWidth: 640,
            frameHeight: 480
        }
    }
};

let player = videojs('myVideo', options);
```
