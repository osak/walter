const webpack = require('webpack');

module.exports = {
    entry: ['babel-polyfill', './js/Main.js'],
    output: { path: './public', filename: 'bundle.js' },
    module: {
        loaders: [{
            test: /.js$/,
            loader: 'babel-loader',
            exclude: /node-modules/,
            query: {
                presets: ['react', 'es2015', 'stage-3']
            }
        }]
    },
    plugins: [
        new webpack.optimize.DedupePlugin(),
        new webpack.optimize.AggressiveMergingPlugin(),
        new webpack.optimize.UglifyJsPlugin()
    ]
}
