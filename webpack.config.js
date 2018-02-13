const path = require('path');
const UglifyJSPlugin = require('uglifyjs-webpack-plugin');
const ExtractTextPlugin = require("extract-text-webpack-plugin");
const ExtractCSS = new ExtractTextPlugin("css/css-style.[contenthash:8].css");
const ExtractSCSS = new ExtractTextPlugin("css/scss-style.[contenthash:8].css");
const CleanWebpackPlugin = require('clean-webpack-plugin')
const BrowserSyncPlugin = require('browser-sync-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = (env = {}) => {
    const isProduction = env.production === true;
    // the clean options to use
    let pathsToClean = [
        'dist',
        'build'
    ]

    let cleanOptions = {
        root: '',
        exclude: [],
        verbose: true,
        dry: false
    }


    return {
        devtool: (() => {
            if (isProduction) return 'hidden-source-map'
            else return 'source-map'
        })(),
        entry: {
            'js/app': './src/js/index.js',
            'js/vender': './src/js/vender.js'
        },
        output: {
            filename: '[name].[chunkhash:8].js', // [name].[hash].js'
            path: path.resolve(__dirname, 'dist')
        },
        watch: (() => {
            if (isProduction) return false
            else return true
        })(),
        module: {
            rules: [{
                    test: /\.scss$/,
                    use: ExtractSCSS.extract({
                        fallback: 'style-loader',
                        use: [{
                                loader: 'css-loader',

                                options: (() => {
                                    let options = {};

                                    if (isProduction) {
                                        Object.assign(options,
                                            {
                                                minimize: true || { /* CSSNano Options */ }
                                            }
                                        );
                                    } else {
                                        Object.assign(options,{});
                                    }
                                    return options;
                                })()
                            },
                            {
                                loader: 'sass-loader',
                                options: (() => {
                                    let options = {
                                        includePaths: [
                                            path.resolve("node_modules/foundation-sites/scss")
                                        ]
                                    };

                                    if (isProduction) {
                                        Object.assign(options,{});
                                    } else {
                                        Object.assign(options,
                                            {
                                                sourceMap: true
                                            }
                                        );
                                    }
                                    return options;
                                })()
                            }
                        ],
                    })
                },
                {
                    test: /\.css$/,
                    use: ExtractCSS.extract({
                        fallback: "style-loader",
                        use: [{
                            loader: 'css-loader',
                            options: (() => {
                                if (isProduction) {
                                    return {
                                        minimize: true || { /* CSSNano Options */ }
                                    }
                                }
                            })()
                        }, ]
                    })
                },
                {
                    test: /\.(png|svg|jpg|gif)$/,
                    use: [
                        'file-loader'
                    ]
                },
                {
                    test: /\.js$/,
                    exclude: /(node_modules|bower_components)/,
                    use: {
                        loader: 'babel-loader',
                        options: {
                            presets: ['env']
                        }
                    }
                }
            ]
        },

        plugins: (() => {
            let options = [
                ExtractCSS,
                ExtractSCSS,
                new CleanWebpackPlugin(pathsToClean, cleanOptions),
                new CopyWebpackPlugin([
                    {from:'src/img',to:'images'}
                ])
            ];
            if (isProduction) {
                options.push(
                    new UglifyJSPlugin({
                        sourceMap: true
                    })
                );
            } else {
                options.push(
                    new BrowserSyncPlugin({
                        // browse to http://localhost:3000/ during development,
                        // ./public directory is being served
                        host: 'localhost',
                        port: 3000,
                        // server: { baseDir: ['public'] },
                        proxy: 'http://localhost:8000/',
                        files: [
                            '**/*.html',
                            '**/*.php'
                        ]
                    })
                );
            }

            return options;
        })(),

    }
}
