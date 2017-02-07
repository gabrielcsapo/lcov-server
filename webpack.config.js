const webpack = require('webpack');

module.exports = {
    entry: './src/app.js',
    output: {
        path: './dist',
        filename: 'build.js'
    },
    devServer: {
        proxy: {
            "/api/**": "http://localhost:5000",
            "/*.svg": "http://localhost:5000",
            "/badge/**": "http://localhost:5000"
        },
        contentBase: 'dist',
        inline: true,
        hot: true,
        historyApiFallback: true
    },
    module: {
        loaders: [{
                test: /\.css$/,
                loaders: ['style-loader', 'css-loader']
            },
            {
                test: /.jsx?$/,
                loader: 'babel-loader',
                exclude: /node_modules/,
                query: {
                    presets: ['es2015', 'react']
                }
            }
        ]
    },
    plugins: [
      new webpack.DefinePlugin({
        'process.env': {
          'NODE_ENV': JSON.stringify('production')
        }
      }),
      new webpack.ContextReplacementPlugin(/moment[\\\/]locale$/, /^\.\/(en)$/),
      new webpack.optimize.DedupePlugin(),
      new webpack.optimize.UglifyJsPlugin({
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
      }),
      new webpack.optimize.AggressiveMergingPlugin(),
    ]
};
