/**
 * @file event.js
 * @since 3.5.0
 */

class Event {}

// video.js
Event.READY = 'ready';
Event.ERROR = 'error';
Event.LOADEDMETADATA = 'loadedmetadata';
Event.LOADSTART = 'loadstart';
Event.USERINACTIVE = 'userinactive';
Event.TIMEUPDATE = 'timeupdate';
Event.DURATIONCHANGE = 'durationchange';
Event.ENDED = 'ended';
Event.PAUSE = 'pause';
Event.PLAY = 'play';
Event.ENTERPIP = 'enterPIP';
Event.LEAVEPIP = 'leavePIP';

// videojs-record
Event.DEVICEREADY = 'deviceReady';
Event.DEVICEERROR = 'deviceError';
Event.STARTRECORD = 'startRecord';
Event.STOPRECORD = 'stopRecord';
Event.FINISHRECORD = 'finishRecord';
Event.RECORDCOMPLETE = 'recordComplete';
Event.PROGRESSRECORD = 'progressRecord';
Event.TIMESTAMP = 'timestamp';
Event.ENUMERATEREADY = 'enumerateReady';
Event.ENUMERATEERROR = 'enumerateError';
Event.AUDIOBUFFERUPDATE = 'audioBufferUpdate';
Event.AUDIOOUTPUTREADY = 'audioOutputReady';
Event.FINISHCONVERT = 'finishConvert';

// dom
Event.ENTERPICTUREINPICTURE = 'enterpictureinpicture';
Event.LEAVEPICTUREINPICTURE = 'leavepictureinpicture';

// after the freeze, any attempts of altering the class will have no result
Object.freeze(Event);

export default Event;
