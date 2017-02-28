var path = require('path');
var ExtractTextPlugin = require('extract-text-webpack-plugin');
var HTMLWebpackPlugin = require('html-webpack-plugin');
var webpack = require('webpack');

// 
var DEVELOPMENT = process.env.NODE_ENV === 'development';
var PRODUCTION = process.env.NODE_ENV === 'production';

// define plugins, seperate production with development
var plugins = PRODUCTION ?
[
    new webpack.optimize.UglifyJsPlugin(),
    new ExtractTextPlugin('style-[contenthash:10].css'),
    new HTMLWebpackPlugin({
        template: 'index-template.html'
    })
]
:
[
    new webpack.HotModuleReplacementPlugin()
];

plugins.push(new webpack.DefinePlugin({
  'process.env': {
    NODE_ENV: PRODUCTION ? JSON.stringify('production') : JSON.stringify('development')
  }
}));

// define css loader for module
const cssIdentifier = PRODUCTION ? '[hase:base64:10]' : '[path][name]---[local]';
const cssLoader = PRODUCTION ? 
    ExtractTextPlugin.extract({
        use: ['css-loader?localIdentName='+cssIdentifier]
    })
    :
    ['style-loader','css-loader?localIdentName='+cssIdentifier]
;

module.exports = {
    entry:['./src/index.js'],
    plugins:plugins,
    module:{
        loaders:[
            {
                test:/\.js$/,
                loaders:['babel-loader'],
                exclude:'/node_modules/'
            },
            {
                test:/\.(png|jpg|gif)$/,
                loaders:['file-loader?name=images/[hash:12].[ext]'],
                exclude:'/node_modules/'
            },
            { 
                test: /\.svg$/,
                loader: 'file-loader?name=./img/[name].[hash].[ext]'
            },
            {
                test:/\.css$/,
                loaders:cssLoader,
                exclude:'/node_modules/'
            }
        ]
    },
    output:{
        path:path.resolve('dist'),
        publicPath:PRODUCTION?'/':'/dist/',
        filename: PRODUCTION ? 'bundle.[hash:12].min.js':'bundle.js'
    }
}
