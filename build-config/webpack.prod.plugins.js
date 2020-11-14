/**
 * @since 2.2.0
 */

const { merge } = require('webpack-merge');
const path = require('path');

const common = require('./fragments/common');
const prod = require('./fragments/prod');
const plugins = require('./fragments/plugins');

module.exports = merge(common, prod, plugins, {
    output: {
        filename: 'videojs.record.[name].min.js'
    }
});