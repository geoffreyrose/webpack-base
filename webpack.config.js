const webpack = require('webpack');
const path = require('path');
const UglifyJSPlugin = require('uglifyjs-webpack-plugin');
const ExtractTextPlugin = require("extract-text-webpack-plugin");
const ExtractStyles = new ExtractTextPlugin("css/styles.css"); // [contenthash:8]
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
            'js/css': [
                './src/js/css.js',
                'webpack-hot-middleware/client'
            ],
            'js/vender': './src/js/vender.js'
        },
        output: {
            filename: '[name].js', // [name].[hash].js'
            path: path.resolve(__dirname, 'dist')
        },
        watch: (() => {
            if (isProduction) return false
            else return true
        })(),
        module: {
            rules: [
                {
                    test: /\.scss$/,
                    use: ExtractStyles.extract({
                        fallback: 'style-loader',
                        use: [{
                                loader: 'css-loader',

                                options: (() => {
                                    let options = {
                                        url: false
                                    };

                                    if (isProduction) {
                                        Object.assign(options,
                                            {
                                                minimize: true || { /* CSSNano Options */ }
                                            }
                                        );
                                    } else {
                                        Object.assign(options,{
                                            sourceMap: true
                                        });
                                    }
                                    return options;
                                })()
                            },
                            {
                                loader: 'postcss-loader',
                                options: {
                                    sourceMap: true
                                }
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
                    test: /\.(png|svg|jpg|gif)$/,
                    use: [
                        'file-loader'
                    ]
                },
                {
                    test: /\.js$/,
                    exclude: /(node_modules)/,
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
                ExtractStyles,
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
                    new webpack.HotModuleReplacementPlugin(),
                    new BrowserSyncPlugin(
                        {
                            // browse to http://localhost:3000/ during development,
                            // ./public directory is being served
                            host: 'localhost',
                            port: 3000,
                            // server: { baseDir: ['public'] },
                            proxy: 'http://dev.webpack/',
                            files: [
                                // files to watch and reload (or hot reload if .css) when changed
                                '**/*.html',
                                '**/*.php',
                                '**/*.pug',
                                'src/**/*.js',
                                'dist/**/*.css' // Only watch if final compiled css changes, this allows the css to be live injected without a page reload
                            ]
                        },
                        {
                            reload: false
                        }
                    )
                );
            }

            return options;
        })(),

    }
}
