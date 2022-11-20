// production config
const CopyWebpackPlugin = require('copy-webpack-plugin');
const HtmlWebpackPlugin = require("html-webpack-plugin");
const { merge } = require("webpack-merge");
const { resolve } = require("path");

const commonConfig = require("./common");
const path = require('path');

module.exports = merge(commonConfig, {
  mode: "production",
  entry: "./index.tsx",
  output: {
    filename: "js/bundle.[contenthash].min.js",
    path: resolve(__dirname, "../../dist"),
    publicPath: "",
  },
  devtool: "source-map",
  plugins: [
    new HtmlWebpackPlugin({
      favicon: "../public/favicon.ico",
      template: "prod-index.html",
    }),
    new CopyWebpackPlugin({
      patterns: [
        {
          from: "*.png",
          context: path.resolve(__dirname, "..", "..", "public"),
          globOptions: {
            ignore: ["**/sprite-sheet.png"],
          },
        },
      ],
    }),
  ],
});
