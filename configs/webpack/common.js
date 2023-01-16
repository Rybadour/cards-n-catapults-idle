// shared config (dev and prod)
const path = require("path");
const webpack = require("webpack");
var SpritesmithPlugin = require('webpack-spritesmith');

module.exports = {
  resolve: {
    extensions: [".js", ".jsx", ".ts", ".tsx"],
    modules: ["node_modules", "public"],
  },
  context: path.resolve(__dirname, "../../src/"),
  module: {
    rules: [
      {
        test: [/\.tsx?$/],
        use: ["ts-loader"],
        exclude: /node_modules/,
      },
      {
        test: /\.css$/,
        use: ["style-loader", "css-loader"],
      },
      {
        test: /\.(scss|sass)$/,
        use: ["style-loader", "css-loader", "sass-loader"],
      },
    ],
  },
  plugins: [
    new webpack.ProvidePlugin({
      "React": "react",
    }),
    new SpritesmithPlugin({
      src: {
        cwd: path.resolve(__dirname, '../../public/icons'),
        glob: '*.png'
      },
      target: {
        image: path.resolve(__dirname, '../../public/sprite-sheet.png'),
        css: path.resolve(__dirname, '../../src/shared/sprite-sheet.scss')
      },
      apiOptions: {
        cssImageRef: "~sprite-sheet.png"
      }
    }),
  ],
  performance: {
    hints: false,
  },
};
