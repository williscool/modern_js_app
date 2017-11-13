import path from 'path';
import HtmlWebpackPlugin from 'html-webpack-plugin';

import { WDS_PORT, STATIC_PATH, APP_NAME, APP_CONTAINER_CLASS } from './src/config';
import { isProd } from './src/util';

export default {
  entry: [
    'babel-polyfill',
    './src',
  ],
  output: {
    filename: 'js/bundle.js',
    path: path.resolve(__dirname, 'dist'),
    publicPath: isProd ? STATIC_PATH : `http://localhost:${WDS_PORT}/dist/`,
  },
  module: {
    rules: [
      { test: /\.(js)$/, use: 'babel-loader', exclude: /node_modules/ },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      title: APP_NAME,
      template: 'src/index.html',
      templateVariables: { // using this key of the hash to pass arbitrary data through to the template. can be finiky though restart server if variables don't show immediately
        containerClassName: APP_CONTAINER_CLASS,
      },
    }),
  ],
  devtool: isProd ? false : 'source-map',
  resolve: {
    extensions: ['.js'],
  },
  devServer: {
    port: WDS_PORT,
  },
};
