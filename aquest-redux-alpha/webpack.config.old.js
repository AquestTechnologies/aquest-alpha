var path = require('path');
var webpack = require('webpack');
//let node_modules_dir = path.join(__dirname, 'node_modules');

var config = {
  devtool: 'eval',
  entry: [
    'webpack/hot/dev-server',
    './src/client/client.js'
  ],
  output: {
    path: __dirname + "/dist",
    filename: 'bundle.js',
    publicPath: '/static/'
  },
  resolve: {
    alias: {}
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoErrorsPlugin()
  ],
  node: {
    fs: "empty"
  },
  resolve: {
    extensions: ['', '.js', '.jsx'],
  },
  module: {
    //noParse: [],
    loaders: [
      {
        test: /\.jsx?$/,
        loaders: ['react-hot', 'babel'],
        include: [
          path.join(__dirname, 'src')
        ],
        exclude: /node_modules/
      },
      {
        test: /\.less$/,
        loader: 'style!css!less',
      }
    ]
  }
};

/*let deps = [
  'react/dist/react.min.js',
  'react-router/dist/react-router.min.js'
];

//optimisation pour la prod 
deps.forEach(function (dep) {
  let depPath = path.resolve(node_modules_dir, dep);
  config.resolve.alias[dep.split(path.sep)[0]] = depPath;
  config.module.noParse.push(depPath);
});*/

module.exports = config;
