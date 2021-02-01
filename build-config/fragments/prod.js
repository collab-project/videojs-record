/**
 * @file prod.js
 * @since 2.2.0
*/

const TerserPlugin = require('terser-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');
const RemoveEmptyScriptsPlugin = require('webpack-remove-empty-scripts');

module.exports = {
    mode: 'production',
    optimization: {
        minimize: true,
        minimizer: [
            new TerserPlugin({
                parallel: true,
                terserOptions: {
                    output: {
                        // preserve license comments
                        comments: /@license/i,
                    }
                },
                extractComments: false
            }),
            new CssMinimizerPlugin()
        ]
    },
    plugins: [
        new RemoveEmptyScriptsPlugin(),
        new MiniCssExtractPlugin({
            filename: 'css/videojs.record.min.css',
            chunkFilename: 'css/[id].css'
        })
    ]
};
