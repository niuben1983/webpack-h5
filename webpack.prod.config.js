'use strict';

require('require-yaml');

var path = require('path');
var webpack = require('webpack');
var HtmlWebpackPlugin = require('html-webpack-plugin');
var glob = require('glob');

// 将样式提取到单独的 css 文件中，而不是打包到 js 文件或使用 style 标签插入在 head 标签中
var ExtractTextPlugin = require('extract-text-webpack-plugin');
// 删除已生成的文件
var CleanWebpackPlugin = require('clean-webpack-plugin');

var CopyWebpackPlugin = require('copy-webpack-plugin');

var entries = getEntry('./src/js/[^_]*.js'); // 获得入口 js 文件
var chunks = Object.keys(entries)

var CONFIG = require('./config/prod');
var ENV = process.env.NODE_ENV;


var config = {
    path: CONFIG.PATH,
    publicPath: CONFIG.PUBLICPATH
};


module.exports = {
    /* 输入文件 */
    entry: entries,
    output: {
        path: path.resolve(__dirname, config.path), // html, css, js 图片等资源文件的输出路径，将所有资源文件放在 dist 目录
        publicPath: config.publicPath, // html, css, js 图片等资源文件的 server 上的路径
        filename: 'js/[name].js', // 每个入口 js 文件的生成配置
        chunkFilename: 'js/[id].js'
    },
    devtool: 'source-map',
    module: {
        rules: [{
            test: /\.css$/,
            use: ExtractTextPlugin.extract({
                fallback: "style-loader",
                use: ['css-loader', 'postcss-loader']
            })
        },
        /* 用babel来解析js文件并把es6的语法转换成浏览器认识的语法 */
        {
            test: /\.js$/,
            loader: 'babel-loader',
            /* 排除模块安装目录的文件 */
            exclude: [/node_modules/]
        },
        {
            test: /\.(png|jpe?g|gif|svg)$/,
            // 图片加载器，较小的图片转成 base64
            loader: 'url-loader',
            query: {
                limit: 1000,
                name: './img/[name].[ext]?[hash:7]'
            }
        }]
    },
    plugins: [
        // 提取公共模块
        new webpack.optimize.CommonsChunkPlugin({
            name: 'vendors', // 公共模块的名称
            chunks: 4, // chunks 是需要提取的模块
            // minChunks: chunks.length
        }),
        new ExtractTextPlugin('css/[name].css'),
        // new CopyWebpackPlugin([
        //     {
        //         from: path.resolve(__dirname, 'src/lib/flexible'),
        //         to: path.resolve(__dirname, config.path + '/lib/flexible'),
        //         force: true,
        //         toType: 'dir',
        //         ignore: ['.*']
        //     }
        // ]),
        new webpack.DefinePlugin({
            'process.env': {
                NODE_ENV: 'production'
            },
            'CONFIG': JSON.stringify(CONFIG)
        }),

        new webpack.optimize.UglifyJsPlugin(),
        new webpack.optimize.OccurrenceOrderPlugin(),
        new webpack.HotModuleReplacementPlugin()

        // new CleanWebpackPlugin(
        //   ['dist/js/*.js'], 　 //匹配删除的文件
        //   {
        //     root: __dirname,
        //     //根目录
        //     verbose: true,
        //     //开启在控制台输出信息
        //     dry: false　　　　　　　　　　 //启用删除文件
        //   }
        // )
    ]
}


var pages = getEntry('./src/html/*.html');
for (var pathname in pages) {
    // 配置生成的 html 文件，定义路径等

    var conf = {
        filename: pathname + '.html', // html 文件输出路径
        template: pages[pathname], // 模板路径
        inject: 'body', // js 插入位置
        minify: {
            removeComments: true,
            collapseWhitespace: false
        },
        files: {
            "lib": config.publicPath + "lib/"
        }
    };
    if (pathname in module.exports.entry) {
        conf.chunks = ['vendors', pathname];
        conf.hash = false;
    }
    // 需要生成几个 html 文件，就配置几个 HtmlWebpackPlugin 对象
    module.exports.plugins.push(new HtmlWebpackPlugin(conf));
}

// 根据项目具体需求，具体可以看上面的项目目录，输出正确的 js 和 html 路径
// 根据项目具体需求，输出正确的 js 和 html 路径
function getEntry(globPath) {
    var entries = {},
        basename, tmp, pathname;

    glob.sync(globPath).forEach(function (entry) {
        basename = path.basename(entry, path.extname(entry));
        tmp = entry.split('/').splice(-3);
        pathname = basename; // 正确输出 js 和 html 的路径
        entries[pathname] = entry;
    });
    console.log(entries);
    return entries;
}