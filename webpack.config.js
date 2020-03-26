const path = require('path');

module.exports = {
  entry: {
    canvas: './src/ts/app.ts',
    react: './src/index.tsx'
  },
  module: {
    rules: [
      {
        test: /\.ts(x?)$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
      {
        test: /\.css$/i,
        use: ['style-loader', 'css-loader'],
        exclude: /node_modules/,
      },
    ],
  },
  devServer: {
    contentBase: './',
  },
  resolve: {
    extensions: ['.ts', '.tsx', ".js", ".jsx", ".css"],
  },
  output: {
    filename: '[name].app.js',
    path: path.resolve(__dirname, 'dist'),
  },
};
