'use strict';

const path = require("path");
const HtmlWebpackPlugin = require('html-webpack-plugin');
const webpack = require('webpack');

function resolve(dir) {
    return path.resolve(__dirname, dir)
}

const cfg = {
    mode: "development",
    entry: resolve("../src/index.tsx"),
    optimization: {
        splitChunks: {
            cacheGroups: {
                vendor: {
                    test: /[\\/]node_modules[\\/](react|react-dom|react-router|react-router-dom)[\\/]/,
                    name: 'vendor',
                    chunks: "all",
                }
            }
        }
    },
    output: {
        path: resolve("../dist"),
        filename: "[name].js",
    },
    module: {
        rules: [
            {
                test: /\.ts(x?)$/,
                use: ["ts-loader"],

                exclude: [resolve("../node_modules")]
            },
            // {
            //     test: /\.js(x?)$/,
            //     use: ["babel-loader"],
            //     exclude: [resolve("../node_modules")]
            // }
        ]
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: resolve("../src/index.html"),
        }),
    ],
    context: path.resolve(__dirname, './'),
    resolve: {
        extensions: [".ts", ".js", ".tsx", ".jsx"]
    },

    // devtool: "inline-source-map"
};

// if (config.build.bundleAnalyzerReport) {
//     const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
//     cfg.plugins.push(new BundleAnalyzerPlugin());
// }


module.exports = cfg;