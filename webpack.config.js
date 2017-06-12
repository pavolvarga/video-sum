const path = require('path');
const nodeExternals = require('webpack-node-externals');

module.exports = {
    target: 'node',
    entry: './src/main.js',
    externals: [nodeExternals()],
    output: {
        filename: 'video-sum.js',
        path: path.resolve(__dirname, 'dist')
    }
};
