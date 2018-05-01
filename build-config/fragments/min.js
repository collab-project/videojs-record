/**
 * @since 2.2.0
 */

const path = require('path');
const webpack = require('webpack');
const UglifyJSPlugin = require('uglifyjs-webpack-plugin');

module.exports = {
    optimization: {
        minimizer: [
            new UglifyJSPlugin({
                sourceMap: true
            })
        ]
    }
};
