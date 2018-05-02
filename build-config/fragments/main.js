/**
 * @file main.js
 * @since 2.2.0
 */

const path = require('path');

module.exports = {
    entry: {
        'videojs.record': path.resolve(
            __dirname, '..', '..', 'src', 'js', 'videojs.record.js'
        )
    },
    output: {
        path: path.resolve(__dirname, '../', '../', 'dist'),
        filename: '[name].js',
        library: 'VideojsRecord'
    }
};
