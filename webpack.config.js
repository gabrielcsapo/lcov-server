const webpack = require('webpack');
const path = require('path');

module.exports = {
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
          'NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'production')
        }
      }),
      new webpack.ContextReplacementPlugin(/moment[\\\/]locale$/, /^\.\/(en)$/), // eslint-disable-line
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
