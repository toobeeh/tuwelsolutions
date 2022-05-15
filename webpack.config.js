const path = require('path');

module.exports = {
  entry: './src/tuwelsolutions.ts',
  /* devtool: 'inline-source-map', */
  watch: true,
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
    ],
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js'],
  },
  output: {
    filename: 'tuwelsolutions.js',
    libraryTarget: 'umd',
    library: 'tws',
    umdNamedDefine: true,
    path: path.resolve(__dirname, ''),
  },
};