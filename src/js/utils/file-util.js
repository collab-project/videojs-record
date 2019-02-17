/**
 * @file file-util.js
 * @since 3.3.0
 */

/**
 * Download `Blob` object in browser.
 *
 * @param {string} fileName - Name for the file to download.
 * @param {blob} data - File data.
 * @returns {void}
 * @private
 */
const downloadBlob = function(fileName, data) {
    if (typeof navigator.msSaveOrOpenBlob !== 'undefined') {
        return navigator.msSaveOrOpenBlob(data, fileName);
    } else if (typeof navigator.msSaveBlob !== 'undefined') {
        return navigator.msSaveBlob(data, fileName);
    }

    let hyperlink = document.createElement('a');
    hyperlink.href = URL.createObjectURL(data);
    hyperlink.download = fileName;

    hyperlink.style = 'display:none;opacity:0;color:transparent;';
    (document.body || document.documentElement).appendChild(hyperlink);

    if (typeof hyperlink.click === 'function') {
        hyperlink.click();
    } else {
        hyperlink.target = '_blank';
        hyperlink.dispatchEvent(new MouseEvent('click', {
            view: window,
            bubbles: true,
            cancelable: true
        }));
    }

    URL.revokeObjectURL(hyperlink.href);
};

/**
 * Read `Blob` as `ArrayBuffer`.
 *
 * @param {(Blob|File)} fileObj - Blob or File object to read.
 * @returns {void}
 * @private
 */
const blobToArrayBuffer = function(fileObj) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => {
            resolve(reader.result);
        };
        reader.onerror = (ev) => {
            reject(ev.error);
        };
        reader.readAsArrayBuffer(fileObj);
    });
};

/**
 * Add filename and timestamp to recorded file object.
 *
 * @param {(Blob|File)} fileObj - Blob or File object to modify.
 * @param {date} [now] - Optional date information, default is
 *    current timestamp.
 * @private
 */
const addFileInfo = function(fileObj, now) {
    if (fileObj instanceof Blob || fileObj instanceof File) {
        // set modification date
        if (now === undefined) {
            now = new Date();
        }
        try {
            fileObj.lastModified = now.getTime();
            fileObj.lastModifiedDate = now;
        } catch (e) {
            if (e instanceof TypeError) {
                // ignore: setting getter-only property "lastModifiedDate"
            } else {
                // re-raise error
                throw e;
            }
        }
        // guess extension name from mime type, e.g. audio/ogg, but
        // any extension is valid here. Chrome also accepts extended
        // mime types like video/webm;codecs=h264,vp9,opus
        let fileExtension = '.' + fileObj.type.split('/')[1];
        if (fileExtension.indexOf(';') > -1) {
            fileExtension = fileExtension.split(';')[0];
        }

        // use timestamp in filename, e.g. 1451180941326.ogg
        try {
            fileObj.name = now.getTime() + fileExtension;
        } catch (e) {
            if (e instanceof TypeError) {
                // ignore: setting getter-only property "name"
            } else {
                // re-raise error
                throw e;
            }
        }
    }
};

export {
    downloadBlob, blobToArrayBuffer, addFileInfo
};