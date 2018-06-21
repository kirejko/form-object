import path from 'path';
import webpack from 'webpack';
import CleanWebpackPlugin from 'clean-webpack-plugin';

const config: webpack.Configuration = {
  mode: 'production',
  entry: path.resolve(__dirname, 'entry.ts'),
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'index.js',
    library: 'formObjectWrapper',
    libraryTarget: 'umd',
  },
  resolve: {
    extensions: ['.ts', '.js']
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        use: ['babel-loader', 'ts-loader'],
        exclude: /node_modules/
      },
    ]
  },
  plugins: [
    new CleanWebpackPlugin('dist'),
  ],
};

export default config;
