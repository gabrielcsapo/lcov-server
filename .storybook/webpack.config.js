module.exports = {
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
  }
}
