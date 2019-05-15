module.exports = {
  module: {
    rules: [{
        test: /\.css$/,
        use: [{
            loader: 'style-loader'
          },
          {
            loader: 'css-loader',
            options: {
              sourceMap: true
            }
          }
        ]
      },
      {
        test: /.jsx?$/,
        loader: 'babel-loader',
        exclude: /node_modules/,
        query: {
          presets: ['@babel/env', '@babel/react']
        }
      }
    ]
  }
};
