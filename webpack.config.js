module.exports = {
  entry: './views/src/coverage.js',
  output: { path: './views/dist', filename: 'coverage.js' },
  module: {
    loaders: [
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
};
