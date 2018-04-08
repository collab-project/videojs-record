/**
 * @since 2.2.0
 */

const path = require('path');
const webpack = require('webpack');

module.exports = {
    plugins: [
        new webpack.optimize.UglifyJsPlugin({
            sourceMap: true
        })
    ]
};
