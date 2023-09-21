const path = require('path');

module.exports = [
    {
        mode:'production',
        entry: './src/index.ts',
        target: 'web',
        output: {
            filename: 'bundle.min.js',
            path: path.resolve(__dirname, 'dist'),
            library: 'dataStructureTyped',
            libraryTarget: 'window',
        },
        resolve: {
            extensions: ['.ts', '.js'],
        },
        module: {
            rules: [
                {
                    test: /\.ts$/,
                    use: 'ts-loader',
                    exclude: /node_modules/,
                }
            ],
        },
      devtool: 'source-map',
    },
];
