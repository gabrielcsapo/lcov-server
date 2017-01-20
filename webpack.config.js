module.exports = {
    entry: './src/router.js',
    output: {
        path: './dist',
        filename: 'build.js'
    },
    module: {
        loaders: [{
                test: /\.css$/,
                loader: 'style!css'
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
};
