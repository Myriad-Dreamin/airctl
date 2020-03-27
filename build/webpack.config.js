'use strict';

const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const {TypedCssModulesPlugin} = require('typed-css-modules-webpack-plugin');
// const webpack = require('webpack');

function resolve(dir) {
    return path.resolve(__dirname, dir);
}

const lessLoader = {
    loader: 'less-loader',
    options: {
        javascriptEnabled: true
        // modifyVars: theme
    }
};

const cfg = {
    mode: 'development',
    entry: resolve('../src/index.tsx'),
    optimization: {
        splitChunks: {
            cacheGroups: {
                vendor: {
                    test: /[\\/]node_modules[\\/](react|react-dom|react-router|react-router-dom|@ant-design)[\\/]/,
                    name: 'vendor',
                    chunks: 'all'
                }
            }
        }
    },
    output: {
        path: resolve('../dist'),
        filename: '[name].js'
    },
    module: {
        rules: [
            {
                test: /\.css$/,
                include: [resolve('../node_modules')],
                use: ['style-loader', {
                    loader: 'css-loader',
                }]
            },
            {
                test: /\.css$/,
                include: [resolve('../src')],
                use: ['style-loader', {
                    loader: 'css-loader',
                    options: {
                        modules: {
                            localIdentName: '[local]-[hash:6]'
                        },
                    }
                }]
            },
            {
                test: /\.less$/,
                include: [resolve('../node_modules'), resolve('../src')],
                use: ['style-loader', {
                    loader: 'css-loader',
                }, lessLoader]
            },
            {
                test: /\.ts(x?)$/,
                use: [{
                    loader: 'babel-loader',
                    options: {
                        babelrc: false,
                        presets: [
                            [
                                '@babel/preset-env',
                                { targets: { browsers: ['chrome >= 47'] }, useBuiltIns: 'usage', corejs: 3 }
                            ],
                            '@babel/preset-typescript',
                            '@babel/preset-react'
                        ],
                        plugins: [
                            ['import', { libraryName: 'antd', libraryDirectory: 'lib', style: true }],
                            ['@babel/plugin-proposal-decorators', { legacy: true }],
                            ['@babel/plugin-proposal-class-properties', { loose: true }],
                            '@babel/plugin-syntax-dynamic-import'
                            ,
                        ]
                    }
                }],

                include: [resolve('../src')],
                exclude: [resolve('../node_modules')]
            }
        ]
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: resolve('../src/index.html')
        }),
        new TypedCssModulesPlugin({
            globPattern: 'src/**/*.css',
        }),
    ],
    context: path.resolve(__dirname, './'),
    resolve: {
        extensions: ['.ts', '.js', '.tsx', '.jsx']
    }

    // devtool: "inline-source-map"
};

// if (config.build.bundleAnalyzerReport) {
// const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
// cfg.plugins.push(new BundleAnalyzerPlugin());
// }


module.exports = cfg;