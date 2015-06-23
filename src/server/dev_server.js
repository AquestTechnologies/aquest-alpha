import webpack from 'webpack';
import webpackDevServer from 'webpack-dev-server';
import config from '../../webpack.config';
import log    from '../shared/utils/logTailor.js';

export default function(){
  
  let bundle = webpack(config);
  let bundleStart;
  
  bundle.plugin('compile', function() {
    log('Bundling...');
    bundleStart = Date.now();
  });
  
  bundle.plugin('done', function() {
    log('Bundled in ' + (Date.now() - bundleStart) + 'ms!');
  });
  
  new webpackDevServer(bundle, {
    publicPath: config.output.publicPath,
    hot: true,
    historyApiFallback: true,
    stats: {
      colors: true
    }
    ,
    devServer: {
      hot: true,
      inline: true
    },
    proxy: [{
      // proxy toutes les requêtes ne contenant pas "*/static/*"
      path:    /^(?!.*\/static\/)(.*)$/, 
      target:  'http://localhost:8080/'
    }]
  }).listen(3000, '0.0.0.0', function (err) {
    if (err) {
      log(err);
    }
    log('Listening at 0.0.0.0:3000');
  });
}
