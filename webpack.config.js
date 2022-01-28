const path = require('path');
const HtmlWebpackPlugin=require("html-webpack-plugin");
const webpack=require("webpack");

module.exports = {
  entry: {
    bundle:'./src/index.tsx',
    worker:"./src/Workers/Bitcoin.worker.ts"
  },
  output: {
    path: path.join(__dirname, 'build'),
    filename: 'index.[name].js',
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
            test: /\.worker\.ts$/,
            use: [
              {
                loader:"worker-loader"
              }
            ],
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
                  "css-loader",
                  "postcss-loader"
              ]
          },
          {
              test:/\.(jpg|jpeg|png|gif|mp3|svg)$/,
              use:[
                  "file-loader"
              ]
          },
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