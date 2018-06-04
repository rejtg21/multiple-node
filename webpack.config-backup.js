const path = require('path');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const sassExtract = new ExtractTextPlugin({filename: 'css/app.css'});
module.exports = {
    entry: [
        './resources/assets/css/app.scss',
        './resources/assets/js/app.js',
    ],
    output: {
        path: path.resolve(__dirname + '/public/'),
        filename: 'js/app.js'
    },
    module: {
        rules: [
            {
                test: /\.(css|scss|sass)$/,
                use: sassExtract.extract({
                    fallback: 'style-loader',
                    use: ['css-loader', 'sass-loader']
                })
            },
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader'
                }
            }, {
                test: /\.(jpe|jpg|woff|woff2|eot|ttf|svg)(\?.*$|$)/,
                loader: 'file'
            }

        ]
    },
    plugins: [
        sassExtract
    ],
    stats: {
        colors: true
    },
    devtool: 'source-map'
};
