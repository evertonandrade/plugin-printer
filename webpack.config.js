const path = require('path')
const VueLoaderPlugin = require('vue-loader')


module.exports = {
  mode: 'production',
  entry: './index.js',
  output: {
    path: path.join(__dirname, 'lib'),
    filename: 'plugin-printer.min.js',
    libraryTarget: 'umd',
    library: 'ConectorPlugin',
  },
  module: {
    rules: [
      {
        loader: 'babel-loader',
        test: /\.js$/,
        exclude: /node_modules/,
      },
      {
        test: /\.vue$/,
        loader: 'vue-loader'
      }
    ],
  },
  plugins: [
    new VueLoaderPlugin()
  ]
}
