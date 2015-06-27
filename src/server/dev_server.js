import webpack          from 'webpack';
import webpackDevServer from 'webpack-dev-server';
import wdsConfig        from '../../webpack.config.js';
import log              from '../shared/utils/logTailor.js';
import chalk            from 'chalk';
import devConfig        from '../../config/development_server.js';

export default function(){
  
  let startTime = Date.now();
  let serverConfig = devConfig();
  let port = serverConfig.ports.wds;
  
  let bundle = webpack(wdsConfig);
  bundle.plugin('compile', function() {
    log(chalk.green('Bundling...'));
  });
  
  bundle.plugin('done', function() {
    log(chalk.green('Bundled in ' + (Date.now() - startTime) + 'ms!'));
  });
  
  new webpackDevServer(bundle, {
    publicPath: wdsConfig.output.publicPath,
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
      path:    new RegExp('^(?!.*\/' + serverConfig.assetsPublicDir + '\/)(.*)$'),
      target:  'http://localhost:' + serverConfig.ports.api + '/'
    }]
  }).listen(port, '0.0.0.0', function (err) {
    if (err) {
      log(err);
      return;
    }
    log('WDS listening at 0.0.0.0:' + port);
  });
}
