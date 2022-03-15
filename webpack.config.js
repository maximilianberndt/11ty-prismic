const path = require("path");
const TerserPlugin = require("terser-webpack-plugin");
const PostCSSPresetEnv = require("postcss-preset-env");
const CssMinimizerPlugin = require("css-minimizer-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
// const { WebpackManifestPlugin } = require('webpack-manifest-plugin');

const isDev = process.env.NODE_ENV !== "production";

module.exports = {
  mode: isDev ? "development" : "production",
  stats: {
    colors: true,
    preset: "minimal",
  },
  performance: { hints: isDev ? false : "warning" },
  // Eval does not work for css source maps
  // `All values enable source map generation except eval and false value.`
  // https://github.com/webpack-contrib/css-loader
  devtool: isDev ? "cheap-module-source-map" : "source-map",
  entry: [
    path.resolve(__dirname, "src/js/index.js"),
    path.resolve(__dirname, "src/scss/main.scss"),
  ],
  output: {
    //filename: isDev ? '[name].js' : '[name].[contenthash].js',
    filename: "[name].js",
    path: path.resolve(__dirname, isDev ? "_site/" : "_build/"),
    publicPath: "/",
  },
  plugins: [
    // new WebpackManifestPlugin(),
    new MiniCssExtractPlugin({
      //filename: isDev ? '[name].css' : '[name].[contenthash].css'
      filename: "[name].css",
    }),
  ],
  ...(!isDev && {
    optimization: {
      minimizer: [new TerserPlugin(), new CssMinimizerPlugin()],
    },
  }),
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: "babel-loader",
      },
      {
        test: /\.glsl$/,
        exclude: /node_modules/,
        loader: "webpack-glsl-loader",
      },
      {
        test: /\.s?css/i,
        use: [
          MiniCssExtractPlugin.loader,
          "css-loader",
          {
            loader: "postcss-loader",
            options: { postcssOptions: { plugins: [PostCSSPresetEnv] } },
          },
          "sass-loader",
        ],
      },
    ],
  },
  resolve: {
    alias: {
      // Helpful alias for importing assets
      assets: path.resolve(__dirname, "src/assets"),
    },
  },
};
