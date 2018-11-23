/**
 * @file browser-shim.js
 * @since 2.0.0
 */

const setSrcObject = function (stream, element, ignoreCreateObjectURL) {
    if ('createObjectURL' in URL && !ignoreCreateObjectURL) {
        try {
            element.src = URL.createObjectURL(stream);
        } catch (e) {
            setSrcObject(stream, element, true);
            return;
        }
    } else if ('srcObject' in element) {
        element.srcObject = stream;
    } else if ('mozSrcObject' in element) {
        element.mozSrcObject = stream;
    } else {
        throw new Error('createObjectURL/srcObject both are not supported.');
    }
};

export default setSrcObject;
