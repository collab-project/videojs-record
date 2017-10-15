const path = require('path');
const dist_test = path.resolve(__dirname, '..', 'dist-test');

module.exports = {
    entry: './test/webpack-test.js',
    output: {
        path: dist_test,
        filename: 'webpack-test.js'
    }
};
