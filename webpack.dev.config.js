var webpack = require('webpack');

module.exports = {
  devtool: 'inline-source-map',
  entry: [
    './src/index.js',
    'webpack-dev-server/client?http://0.0.0.0:3001',
    'webpack/hot/only-dev-server'
  ],
  output: {
    path: '/static/js',
    filename: 'bundle.js'
  },
  devServer: {
    hot: true,
    filename: 'bundle.js',
    publicPath: '/static/js',
    historyApiFallback: true,
    contentBase: './public',
    proxy: {
      "*": "http://localhost:9898"
    }
  },
  plugins: [
    new webpack.optimize.OccurrenceOrderPlugin(),
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoEmitOnErrorsPlugin()
  ],
  module: {
    loaders:[
      {
        test: /\.js$/,
        loaders:[
          'react-hot-loader',
          'babel-loader?' + JSON.stringify({
          cacheDirectory: true,
          presets: ['react', 'es2015']
        })],
        exclude: /node_modules/
      },{
        test: /\.scss$/,
        loaders:['style-loader','css-loader','sass-loader']
      }
    ]
  }
};
