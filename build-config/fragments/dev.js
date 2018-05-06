/**
 * @file dev.js
 * @since 2.2.0
 */

const path = require('path');

module.exports = {
    mode: 'development',
    devtool: 'source-map',
    devServer: {
        contentBase: [path.resolve(__dirname, '..', '..')],
        publicPath: 'localhost:8080/dist/',
        watchContentBase: true
    }
};
