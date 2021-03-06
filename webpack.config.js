const path = require('path');

module.exports = {
  entry: './src/tuwelsolutions.ts',
  devtool: 'inline-source-map',
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
    library: 'tws',
    path: path.resolve(__dirname, 'dist'),
  },
};