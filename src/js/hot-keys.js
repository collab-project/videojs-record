/**
 * @file hot-keys.js
 * @since 3.5.2
 */

/**
 * Default keyhandler.
 *
 * @param {object} event - Event containing key info.
 * @returns {void}
 * @private
 */
const defaultKeyHandler = function(event) {
    // `x` key
    if (event.which === 88) {
        console.log('x');
    }
    // `y` key
    if (event.which === 89) {
        console.log('y');
    }
};

export default defaultKeyHandler;
