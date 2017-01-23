module.exports = {
    entry: './src/app.js',
    output: {
        path: './dist',
        filename: 'build.js'
    },
    devServer: {
        proxy: {
            "/api/**": "http://localhost:5000",
            "/*.svg": "http://localhost:5000"
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
};
