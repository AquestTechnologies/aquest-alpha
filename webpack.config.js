var webpack = require('webpack');
var config = require('config');

var WDSPort = config.get('server.WDSPort');

var WDSConfig = {
  devtool: 'eval', //Il faudra enlever ce truc pour la prod :o
  entry: [
    'webpack/hot/dev-server',
    './src/client/client.js'
  ],
  output: {
    path: __dirname + '/dist',
    filename: 'bundle.js',
    publicPath: 'http://130.211.68.244:' + WDSPort + '/static/' // https://github.com/webpack/webpack-dev-server/issues/135
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoErrorsPlugin(),
    // new webpack.IgnorePlugin(/^\.\.\/\.\.\/server\/queryDb\.js$/)
    new webpack.IgnorePlugin(/queryDb/),
    // new webpack.ContextReplacementPlugin(/queryDb/, null),
    new webpack.ContextReplacementPlugin(/chalk/, null)
  ],
  node: {
    fs: 'empty'
  },
  resolve: {
    extensions: ['', '.js', '.jsx']
  },
  module: {
    //noParse: [],
    loaders: [
      {
        test: /\.jsx?$/,
        loaders: ['react-hot', 'babel'],
        include: [
          __dirname + '/src'
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
  WDSConfig.resolve.alias[dep.split(path.sep)[0]] = depPath;
  WDSConfig.module.noParse.push(depPath);
});*/

module.exports = WDSConfig;
