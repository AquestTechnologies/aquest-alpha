import webpack          from 'webpack';
import webpackDevServer from 'webpack-dev-server';
import config        from '../../webpack.config.js';
import log              from '../shared/utils/logTailor.js';
import chalk            from 'chalk';
import gdevConfig        from '../../config/development.js';

export default function(){
  
  let startTime;
  const devConfig = gdevConfig();
  const wdsConfig = devConfig.wds;
  
  const bundle = webpack(config);
  bundle.plugin('compile', function() {
    startTime  = Date.now();
    log(chalk.green('Bundling...'));
  });
  
  bundle.plugin('done', function() {
    log(chalk.green('Bundled in ' + (Date.now() - startTime) + 'ms!'));
  });
  
  new webpackDevServer(bundle, {
    publicPath: config.output.publicPath,
    noInfo : true,
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
      // path:    /^(?!.*\/static\/)(.*)$/, 
      path:    new RegExp(wdsConfig.proxyPathRegex),
      target:  'http://localhost:' + devConfig.api.port + '/'
    }]
  }).listen(wdsConfig.port, wdsConfig.host, function (err) {
    if (err) {
      log(err);
      return;
    }
    log('WDS listening at ' + wdsConfig.host + ':' + wdsConfig.port);
  });
}
