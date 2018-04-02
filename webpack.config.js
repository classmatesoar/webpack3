const path = require('path');
const uglify = require('uglifyjs-webpack-plugin');
const htmlPlugin = require('html-webpack-plugin');
const extractTextPlugin = require('extract-text-webpack-plugin');
const glob = require('glob');
const PurifyCSSPlugin = require('purifycss-webpack');
const webpack = require('webpack');
const copyWebpackPlugin = require('copy-webpack-plugin');
module.exports = {
    devtool:'source-map',
    // devtool:'cheap-module-source-map',
    // devtool:'eval-source-map',
    devtool: 'cheap-module-eval-source-map',
    entry: {
        entry: "./src/entry.js",
        jquery: 'jquery',
        vue:'vue',
        axios:'axios'
    },
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: '[name].js'
    },
    module: {
        rules: [
            {
                test: /\.css$/,
                // use:[
                //     'style-loader',
                //     'css-loader'
                // ],
                use: extractTextPlugin.extract({
                    fallback: 'style-loader',
                    use: [
                        {
                            loader: 'css-loader',
                            options: {
                                modules: true,
                                localIdentName: '[local]'
                            }
                        },
                        'postcss-loader'
                    ]
                })
            },
            {
                test: /\.(png|jpg|gif)/,
                use: [
                    {
                        loader: 'url-loader',
                        options: {
                            limit: 50000,
                            outputPath: 'images/'
                        }
                    }
                ]
            },
            {
                test: /\.(htm|html)$/i,
                use: [
                    'html-withimg-loader'
                ]
            },
            {
                test: /\.less$/,
                // use: [
                //     {
                //         loader: 'style-loader',
                //     },
                //     {
                //         loader: 'css-loader'
                //     },
                //     {
                //         loader: 'less-loader'
                //     }
                // ],
                use: extractTextPlugin.extract({
                    use: [
                        {
                            loader: 'css-loader',
                            options: {
                                modules: true,
                                localIdentName: '[local]'
                            }
                        },
                        {
                            loader: 'less-loader'
                        },
                        'postcss-loader'
                    ],
                    fallback: 'style-loader'
                })
            },
            {
                test: /\.(jsx|js)$/,
                use: {
                    loader: 'babel-loader'
                },
                exclude: /node_modules/
            }
        ]
    },
    plugins: [
        //new uglify(),
        new htmlPlugin({
            minify: {
                removeAttributeQuotes: true
            },
            hash: true,
            template: './src/index.html'
        }),
        new extractTextPlugin('/css/index.css'),
        new PurifyCSSPlugin({
            paths: glob.sync(path.join(__dirname, 'src/*.html'))
        }),
        new webpack.BannerPlugin('webpack练习'),
        new webpack.ProvidePlugin({
            $: 'jquery',
            Vue:'vue',
            axios:'axios'
        }),
        new webpack.optimize.CommonsChunkPlugin({
            //name对应入口文件中的名字，我们起的是jQuery
            name: ['jquery','vue','axios'],
            //把文件打包到哪里，是一个路径
            filename: "js/[name].js",
            //最小打包的文件模块数，这里直接写2就好
            minChunks: 2
        }),
        new copyWebpackPlugin([{
            from: __dirname + '/src/public',
            to: './public'
        }])
    ],
    devServer: {
        //设置基本目录结构
        contentBase: path.resolve(__dirname, 'dist'),
        //服务器的IP地址，可以使用IP也可以使用localhost
        host: 'localhost',
        //服务端压缩是否开启
        compress: true,
        //配置服务端口号
        port: 1717
    },
    watchOptions: {
        //检测修改的时间，以毫秒为单位
        poll: 1000,
        //防止重复保存而发生重复编译错误。这里设置的500是半秒内重复保存，不进行打包操作
        aggregateTimeout: 500,
        //不监听的目录
        ignored: /node_modules/,
    }, resolve: {
        alias: {
            'vue$': 'vue/dist/vue.js'
        }
    }
}