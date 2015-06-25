import webpack          from 'webpack';
import webpackDevServer from 'webpack-dev-server';
import WDSConfig        from '../../webpack.config';
import log              from '../shared/utils/logTailor.js';
import chalk            from 'chalk';
import config           from 'config';

export default function(){
  
  let bundle = webpack(WDSConfig);
  let port = config.get('server.WDSPort');
  let bundleStart;
  
  bundle.plugin('compile', function() {
    log(chalk.green('Bundling...'));
    bundleStart = Date.now();
  });
  
  bundle.plugin('done', function() {
    log(chalk.green('Bundled in ' + (Date.now() - bundleStart) + 'ms!'));
  });
  
  new webpackDevServer(bundle, {
    publicPath: WDSConfig.output.publicPath,
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
      path:    /^(?!.*\/static\/)(.*)$/, 
      target:  'http://localhost:8080/'
    }]
  }).listen(port, '0.0.0.0', function (err) {
    if (err) {
      log(err);
    }
    log('WDS listening at 0.0.0.0:' + port);
  });
}
