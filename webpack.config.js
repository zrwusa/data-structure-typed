const path = require('path');

module.exports = [
    {
        mode:'production',
        entry: './src/index.ts',
        target: 'web',
        output: {
            filename: 'bundle.js',
            path: path.resolve(__dirname, 'lib'),
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
    },
];
