export default function() {
  
  let offset = parseInt(process.env.PORTS_OFFSET) || 0;
  return {
    host: '130.211.68.244',
    ports: {
      wds: 3000 + offset,
      api: 8080 + offset,
      ws:  9090 + offset
    },
    assetsDir:        'dist',
    assetsPublicDir : 'static',
    assetsFileName:   'bundle.js'
  };
}
  
