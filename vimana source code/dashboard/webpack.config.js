const autoprefixer = require('autoprefixer');
const path = require('path');
const webpack = require('webpack');
const ExtractTextPlugin = require('extract-text-webpack-plugin');

const ExtractStylePlugin = new ExtractTextPlugin({
    filename: './css/[name].css',
    allChunks: true
});
const LiveReloadPlugin = require('webpack-livereload-plugin');

const HotModuleReplacementPlugin = new webpack.HotModuleReplacementPlugin();
const EnvironmentPlugin = new webpack.EnvironmentPlugin(['RECAPTCHA_KEY', 'WS_SERVER_URL']);

process.env.NODE_ENV = 'development';
module.exports = {
    mode: 'development',
    bail: true,
    devtool: 'source-map',
    watch: true,
    watchOptions: {
        aggregateTimeout: 300,
        poll: 1000
    },
    entry: {
        signin: path.join(__dirname, './src/frontend/signin/index.jsx'),
        dashboard: path.join(__dirname, './src/frontend/dashboard/index.jsx'),
        terms: path.join(__dirname, './src/frontend/t&c/index.jsx'),
        adminSignin: path.join(__dirname, './src/frontend/admin/signin/index'),
        adminPanel: path.join(__dirname, './src/frontend/admin/panel/index')
    },
    output: {
        path: path.join(__dirname, './build/frontend'),
        filename: './js/[name].js',
        chunkFilename: './js/[name].chunk.js',
        publicPath: '/build/'
    },
    resolve: {
        modules: ['node_modules'],
        extensions: ['.js', '.jsx'],
        alias: {
            'babel-runtime': path.dirname('babel-runtime/package.json')
        }
    },
    module: {
        strictExportPresence: true,
        rules: [
            {
                oneOf: [
                    {
                        test: /\.(jsx|js)$/,
                        include: path.join(__dirname, './src/frontend'),
                        loader: 'babel-loader',
                        options: {
                            babelrc: false,
                            sourceMap: true,
                            presets: ['env', 'react', 'stage-0', 'babel-preset-react-app'],
                            plugins: ['source-map-support'],
                            compact: true
                        }
                    },

                    {
                        test: /\.(scss|css)$/,
                        loader: ExtractStylePlugin.extract({
                            fallback: {
                                loader: 'style-loader',
                                options: {
                                    modules: true,
                                    hmr: true
                                }
                            },
                            use: [
                                {
                                    loader: 'css-loader',
                                    options: {
                                        importLoaders: 1,
                                        modules: true,
                                        localIdentName: '[name]__[local]__[hash:base64:5]',
                                        hmr: true,
                                        sourceMap: true
                                    }
                                },
                                {
                                    loader: 'postcss-loader',
                                    options: {
                                        modules: true,
                                        plugins: [
                                            autoprefixer({
                                                browsers: ['ie >= 8', 'last 4 version']
                                            })
                                        ],
                                        sourceMap: true
                                    }
                                },
                                {
                                    loader: 'resolve-url-loader',
                                    options: {
                                        sourceMap: true
                                    }
                                },

                                {
                                    loader: 'sass-loader',
                                    options: {
                                        hmr: true,
                                        modules: true,
                                        sourceMap: true,
                                        sourceMapContents: true
                                    }
                                }
                            ]
                        })
                    },
                    {
                        test: [/\.bmp$/, /\.gif$/, /\.jpe?g$/, /\.png$/],
                        loader: 'file-loader',
                        options: {
                            limit: 10000,
                            name: 'media/[name].[ext]'
                        }
                    },
                    {
                        test: /\.svg$/,
                        loader: 'raw-loader'
                    },
                    {
                        loader: 'file-loader',
                        exclude: [/\.jsx?$/, /\.html$/, /\.json$/],
                        options: {
                            name: './media/[name].[ext]'
                        }
                    },
                    {
                        test: /\.woff$/,
                        loader: 'url-loader?mimetype=application/font-woff&name=media/[name].[ext]'
                    },
                    {
                        test: /\.woff2$/,
                        loader: 'url-loader?mimetype=application/font-woff2&name=media/[name].[ext]'
                    },
                    {
                        test: /\.otf$/,
                        loader:
                            'url-loader?mimetype=application/octet-stream&name=media/[name].[ext]'
                    },
                    {
                        test: /\.ttf$/,
                        loader:
                            'url-loader?mimetype=application/octet-stream&name=media/[name].[ext]'
                    },
                    {
                        test: /\.eot$/,
                        loader:
                            'url-loader?mimetype=application/vnd.ms-fontobject&name=media/[name].[ext]'
                    }
                ]
            }
        ]
    },
    plugins: [
        ExtractStylePlugin,
        HotModuleReplacementPlugin,
        EnvironmentPlugin,
        new LiveReloadPlugin({
            host: process.env.HOST,
            port: 34512
        }),
    ],
    node: {
        dgram: 'empty',
        fs: 'empty',
        net: 'empty',
        tls: 'empty',
        module: 'empty',
        child_process: 'empty'
    }
};
