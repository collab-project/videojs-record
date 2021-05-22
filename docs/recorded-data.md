# Get recorded data

Listen for the `finishRecord` event and obtain the recorded data from the
`player.recordedData` object for further processing:

```javascript
// user completed recording and stream is available
player.on('finishRecord', function() {
    // the recordedData object contains the stream data that
    // can be downloaded by the user, stored on server etc.
    console.log('finished recording: ', player.recordedData);
});
```

## Save data

Use the `saveAs` method to show a 'Save as' browser dialog where the user can
choose the storage location for the recorded data. It accepts an object that
contains a mapping between the media type and the filename. For example:

```javascript
player.on('finishRecord', function() {
    // show save as dialog
    player.record().saveAs({'video': 'my-video-file-name.webm'});
});
```

## Convert data

It's possible to process and convert the recorded data in the browser. For example,
adding metadata like duration to recorded WebM files, or using FFmpeg to convert the
data with a different codec.

Read the [converter plugins](plugins#converter) documentation for more information.

### Usage

For example, enable the `ts-ebml` plugin with the `convertEngine` option:

```javascript
record: {
    audio: false,
    video: true,
    maxLength: 5,
    debug: true,
    // use the ts-ebml convert plugin to inject metadata in webm files
    convertEngine: 'ts-ebml'
}
```

And listen for the `finishConvert` event:

```javascript
// converter ready and stream is available
player.on('finishConvert', function() {
    // the convertedData object contains the converted data that
    // can be downloaded by the user, stored on server etc.
    console.log('finished converting: ', player.convertedData);
});
```

If you need to show a 'Save as' browser dialog where the user can download
the converted data, pass `'convert'` to the `saveAs` method:

```javascript
player.on('finishConvert', function() {
    // show save as dialog
    player.record().saveAs({'video': 'my-video-file-name.mp4'}, 'convert');
});
```

If you do not want to convert the data automatically when the user stops recording,
set the `convertAuto` option to false and call `player.record().convert()` manually instead.

## Timestamps

It's also possible to get data during recording with specific time-intervals. This could
be useful in scenarios where you're recording a long clip and planning to upload
recorded blobs to a server periodically, where the clip is stitched together.

### Example

- [online demo](https://collab-project.github.io/videojs-record/demo/timeslice.html)
- [demo source](https://github.com/collab-project/videojs-record/blob/master/examples/timeslice.html)

### Usage

Enable the event with the `timeSlice` option:

```javascript
record: {
    audio: false,
    video: true,
    maxLength: 5,
    debug: true,
    // fire the timestamp event every 2 seconds
    timeSlice: 2000
}
```

And listen for the `timestamp` event. For example:

```javascript
// monitor stream data during recording
player.on('timestamp', function() {
    // timestamps
    console.log('current timestamp: ', player.currentTimestamp);
    console.log('all timestamps: ', player.allTimestamps);

    // stream data
    console.log('array of blobs: ', player.recordedData);
    // or construct a single blob:
    // var blob = new Blob(blobs, {
    //     type: 'video/webm'
    // });
});
```

## Upload data

Upload the recorded data to a server for further processing and storage.

### Example

Check the [simple upload](https://github.com/collab-project/videojs-record/blob/master/examples/upload/simple.html)
example.

### Usage

The example below shows how to upload each recording:

```javascript
player.on('finishRecord', function() {
    // the blob object contains the recorded data that
    // can be downloaded by the user, stored on server etc.
    console.log('finished recording:', player.recordedData);

    var data = player.recordedData;
    var serverUrl = '/upload';
    var formData = new FormData();
    formData.append('file', data, data.name);

    console.log('uploading recording:', data.name);

    fetch(serverUrl, {
        method: 'POST',
        body: formData
    }).then(
        success => console.log('recording upload complete.')
    ).catch(
        error => console.error('an upload error occurred!')
    );
});
```

The example below shows how to 'stream' upload recorded data segments to a server
using the [jQuery](https://jquery.com/) library and the `timestamp` event:

```javascript
var segmentNumber = 0;

player.on('timestamp', function() {
    if (player.recordedData && player.recordedData.length > 0) {
        var binaryData = player.recordedData[player.recordedData.length - 1];

        segmentNumber++;

        var formData = new FormData();
        formData.append('SegmentNumber', segmentNumber);
        formData.append('Data', binaryData);

        $.ajax({
            url: '/api/Test',
            method: 'POST',
            data: formData,
            cache: false,
            processData: false,
            contentType: false,
            success: function (res) {
                console.log("segment: " + segmentNumber);
            }
        });
    }
});
```

Check the [jquery.fileupload](https://github.com/collab-project/videojs-record/blob/master/examples/upload/jquery.fileupload.html) or
[Fine Uploader](https://github.com/collab-project/videojs-record/blob/master/examples/upload/fine-uploader.html)
examples on how to upload the data to a server using these libraries.
