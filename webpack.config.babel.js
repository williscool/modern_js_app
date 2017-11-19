import path from "path";
import HtmlWebpackPlugin from "html-webpack-plugin";

import {
  WDS_PORT,
  STATIC_PATH,
  APP_NAME,
  APP_CONTAINER_CLASS
} from "./src/config";

import { isProd } from "./src/util";

export default {
  devServer: {
    port: WDS_PORT
  },
  devtool: isProd ? false : "source-map",
  entry: ["./src"],
  module: {
    rules: [
      { test: /\.tsx?$/, loader: "awesome-typescript-loader" },
      {
        exclude: /node_modules/,
        test: /\.css$/,
        use: [
          { loader: "style-loader", options: { sourceMap: true } },
          {
            loader: "css-loader",
            options: { importLoaders: 1, sourceMap: true }
          },
          { loader: "postcss-loader", options: { sourceMap: true } }
        ]
      }
    ]
  },
  output: {
    filename: "js/bundle.js",
    path: path.resolve(__dirname, "dist"),
    publicPath: isProd ? STATIC_PATH : `http://localhost:${WDS_PORT}/dist/`
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: "src/index.html",
      templateVariables: {
        // using this key of the hash to pass arbitrary data through to the template. can be finiky though restart server if variables don't show immediately
        containerClassName: APP_CONTAINER_CLASS
      },
      title: APP_NAME
    })
  ],
  resolve: {
    extensions: [".js", ".jsx", ".ts", ".tsx"]
  }
};
