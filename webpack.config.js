const HtmlWebpackPlugin = require("html-webpack-plugin");
const ModuleFederationPlugin = require("webpack/lib/container/ModuleFederationPlugin");

const mode = process.env.NODE_ENV || "production";

const port = 8082;

module.exports = {
  mode,
  entry: "./src/index",
  devtool: "source-map",
  devServer: {
    port,
    contentBase: "./dist",
    historyApiFallback: {
      index: "index.html",
    },
  },
  optimization: {
    minimize: mode === "production",
  },
  resolve: {
    extensions: [".tsx", ".ts", ".jsx", ".js", ".json"],
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: "ts-loader",
        exclude: [/node_modules/],
      },
    ],
  },
  output: {
    publicPath: `http://localhost:${port}/`,
  },
  plugins: [
    new ModuleFederationPlugin({
      name: "pneusApp",
      library: { type: "var", name: "pneusApp" },
      filename: "remote.js",
      exposes: {
        "./ListaPneus": "./src/app",
      },
      remotes: {
        pneusApp: "pneusApp",
      },
      shared: ["react", "react-dom"],
    }),
    new HtmlWebpackPlugin({
      template: "./public/index.html",
    }),
  ],
};
