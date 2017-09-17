const webpack = require('webpack');
const path = require('path');

let config = {
    entry: './src/app.js',
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'build.js'
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
                loader: 'babel-loader',
                options: { presets: ['es2015', 'react'] },
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
  config.plugins.push(new webpack.optimize.UglifyJsPlugin({
    comments: false,
    compress: {
      unused: true,
      dead_code: true,
      warnings: false,
      drop_debugger: true,
      conditionals: true,
      evaluate: true,
      sequences: true,
      booleans: true,
    }
  }));
}

module.exports = config;
