const path = require('path');
const UglifyJSPlugin = require('uglifyjs-webpack-plugin');
const ExtractTextPlugin = require("extract-text-webpack-plugin");
const ExtractCSS = new ExtractTextPlugin("css-style.css");
const ExtractSCSS = new ExtractTextPlugin("scss-style.css");
const CleanWebpackPlugin = require('clean-webpack-plugin')
const BrowserSyncPlugin = require('browser-sync-webpack-plugin');

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
            'app.js': './src/index.js'
        },
        output: {
            filename: '[name]',
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
                                    if (isProduction) {
                                        return {
                                            minimize: true || { /* CSSNano Options */ },
                                            includePaths: [
                                                path.resolve("node_modules/foundation-sites/scss")
                                            ]
                                        }
                                    } else {
                                        return {
                                            sourceMap: true,
                                            includePaths: [
                                                path.resolve("node_modules/foundation-sites/scss")
                                            ]
                                        }
                                    }
                                })()
                            },
                            {
                                loader: 'sass-loader',
                                options: (() => {
                                    if (isProduction) {
                                        return {
                                            minimize: true || { /* CSSNano Options */ },
                                            includePaths: [
                                                path.resolve("node_modules/foundation-sites/scss")
                                            ]
                                        }
                                    } else {
                                        return {
                                            sourceMap: true,
                                            includePaths: [
                                                path.resolve("node_modules/foundation-sites/scss")
                                            ]
                                        }
                                    }
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
            if (isProduction) {
                return [
                    ExtractCSS,
                    ExtractSCSS,
                    new UglifyJSPlugin({
                        sourceMap: true
                    }),
                    new CleanWebpackPlugin(pathsToClean, cleanOptions)
                ]
            } else {
                return [
                    ExtractCSS,
                    ExtractSCSS,
                    new CleanWebpackPlugin(pathsToClean, cleanOptions),
                    new BrowserSyncPlugin({
                        // browse to http://localhost:3000/ during development,
                        // ./public directory is being served
                        host: 'localhost',
                        port: 3000,
                        // server: { baseDir: ['public'] },
                        proxy: 'http://localhost:8000'
                    })
                ]
            }
        })(),

    }
}
