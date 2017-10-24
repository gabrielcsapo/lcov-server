const webpack = require('webpack');
const path = require('path');

const MinifyPlugin = require('babel-minify-webpack-plugin');

var config = {
    entry: {
      app: './src/app.js',
      vendor: ['react', 'react-dom', 'react-router-dom', 'prop-types', 'highlight.js'],
    },
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'bundle.js'
    },
    devServer: {
        proxy: {
            "/api/**": "http://localhost:8080",
            "/*.svg": "http://localhost:8080",
            "/badge/**": "http://localhost:8080"
        },
        contentBase: 'dist',
        inline: true,
        hot: true,
        historyApiFallback: true
    },
    module: {
        rules: [{
              test: /\.css$/,
              use: ['style-loader', 'css-loader'],
            },
            {
              test: /\.js$/,
              exclude: [/node_modules/],
              use: [{
                loader: 'babel-loader'
              }]
            }
        ]
    },
    plugins: [
      new webpack.DefinePlugin({
        'process.env': {
          'NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'production')
        }
      }),
      new webpack.ContextReplacementPlugin(/moment[\\\/]locale$/, /^\.\/(en)$/), // eslint-disable-line
      new webpack.optimize.AggressiveMergingPlugin()
    ]
};

if(process.env.NODE_ENV === 'production') {
  config.plugins.push(new MinifyPlugin());
}

config.plugins.push(new webpack.optimize.CommonsChunkPlugin({ name: 'vendor', filename: 'vendor.bundle.js' }));

module.exports = config;
