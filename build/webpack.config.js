'use strict';

const path = require("path");
const HtmlWebpackPlugin = require('html-webpack-plugin');

function resolve(dir) {
    return path.resolve(__dirname, dir)
}


module.exports = {
    mode: "development",
    entry: resolve("../src/index.tsx"),
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
        })
    ],
    context: path.resolve(__dirname, './'),
    resolve: {
        extensions: [".ts", ".js", ".tsx", ".jsx"]
    },

    // devtool: "inline-source-map"
};