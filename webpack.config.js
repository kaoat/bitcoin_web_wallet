const path = require('path');
const HtmlWebpackPlugin=require("html-webpack-plugin");
const webpack=require("webpack");

module.exports = {
  entry: './src/index.tsx',
  output: {
    path: path.join(__dirname, 'build'),
    filename: 'index.bundle.js',
  },
  resolve:{
      modules:[
          path.resolve(__dirname,"src"),
          "node_modules"
      ],
      fallback:{
        "stream": require.resolve("stream-browserify"),
        "buffer":require.resolve("buffer/")
      },
      extensions:[
          ".tsx",
          ".ts",
          ".js"
      ]
  },
  module:{
      rules:[
          {
              test:/\.(js|jsx)$/,
              exclude:/node_modules/,
              use:[
                  "babel-loader"
              ]
          },
          {
            test:/\.(ts|tsx)$/,
            exclude:/node_modules/,
            use:[
                "ts-loader"
            ]
          },
          {
              test:/\.(css|scss)$/,
              use:[
                  "style-loader",
                  "css-loader"
              ]
          },
          {
              test:/\.(jpg|jpeg|png|gif|mp3|svg)$/,
              use:[
                  "file-loader"
              ]
          }
      ]
  },
  devServer: {
    static: {
      directory: path.join(__dirname, 'src'),
    },
    compress: true,
    port: 8000,
  },
  plugins: [
      new HtmlWebpackPlugin({ template: path.join(__dirname,"src","index.html") }),
      new webpack.ProvidePlugin({
        Buffer:["buffer","Buffer"]
    })
  ],
  mode:process.env.NODE_ENV||"development",
};