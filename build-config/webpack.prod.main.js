/**
 * @since 2.2.0
 */

const merge = require('webpack-merge');
const path = require('path');

const common = require('./fragments/common');
const prod = require('./fragments/prod');
const main = require('./fragments/main');

module.exports = merge(common, prod, main, {
    output: {
        filename: 'videojs.record.min.js'
    }
});