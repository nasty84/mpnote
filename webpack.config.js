module.exports = {
  entry: './src/index.js',
  output: {
    path: __dirname + '/public/static/js',
    filename: 'bundle.js'
  },
  module: {
    loaders:[
      {
        test: /\.js$/,
        loaders:['babel-loader?' + JSON.stringify({
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
