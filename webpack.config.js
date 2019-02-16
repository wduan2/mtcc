const resolve = require('path').resolve;
const webpack = require('webpack');
const CompressionPlugin = require('compression-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const OptimizeCSSAssetsPlugin = require("optimize-css-assets-webpack-plugin");

// webpack build require absolute path
const BUILD_DIR = resolve(__dirname, 'public');
const PUBLIC_PATH = resolve(__dirname, '/');
const SRC_DIR = resolve(__dirname, 'src');

const devmode = process.env.NODE_ENV !== 'production';

module.exports = {
    mode: devmode ? 'development' : 'production',
    // be able to debug with the source code
    devtool: devmode ? 'source-map' : 'none',
    entry: { 
        index: `${SRC_DIR}/index.js`
    },
    output: {
        filename: '[name].bundle.js',
        path: BUILD_DIR,
        publicPath: PUBLIC_PATH
    },
    optimization: {
        splitChunks: {
            chunks: 'all'
        }
    },
    plugins: [
        new webpack.HotModuleReplacementPlugin(),
        new MiniCssExtractPlugin({
            filename: '[name].css',
            chunkFilename: '[id].css'
        }),
        // generate the index.html
        new HtmlWebpackPlugin({
            title: 'MTCC',
            template: SRC_DIR + '/index.ejs'
        }),
        new OptimizeCSSAssetsPlugin(),
        new CompressionPlugin()
    ],
    module: {
        rules: [
            {
                test: /\.jsx?$/,
                use: 'babel-loader',
                include: SRC_DIR
            },
            {
                test: /\.css$/,
                use: [
                    MiniCssExtractPlugin.loader,
                    // load css as module
                    'css-loader?modules&sourceMap&localIdentName="[name]__[local]__[hash:base64:5]"'
                ]
            }
        ]
    },
    resolve: {
        extensions: ['.js', '.jsx', '.json', 'css']
    },
    // IMPORTANT: the Html-Webpack-Plugin WILL NOT write files to the local
    // file system when it is used by the Webpack-Development-Server
    devServer: {
        host: '0.0.0.0',
        disableHostCheck: true,
        contentBase: BUILD_DIR,
        compress: false,
        port: 9000,
        inline: false, // no need when HotModuleReplacement is used
        historyApiFallback: true
    }
};
