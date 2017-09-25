/**
 * @file log.js
 */

const ERROR = 'error';
const WARN = 'warn';

/**
 * Log message (if the debug option is enabled).
 */
const log = function(args, logType, debug)
{
    if (debug === true) {
        if (logType === ERROR) {
            videojs.log.error(args);
        } else if (logType === WARN) {
            videojs.log.warn(args);
        } else {
            videojs.log(args);
        }
    }
}

export default log;
