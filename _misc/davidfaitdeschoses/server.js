// node_modules/babel/bin/babel-node --stage 1 server.js

var Hapi = require('hapi');
var fs = require('fs');
var uuid = require('node-uuid');
var gm = require('gm');

var server = new Hapi.Server();
server.connection({ port: 8080 });
    
server.start(function() {
  console.log('Make it rain! API server started at ' + server.info.uri);
});

server.route({
  method: 'GET',
  path: '/',
  handler: function (request, reply) {
    reply.prerenderer(request.url, request.info.remoteAddress, request.info.remotePort, request.method);
  }
});

server.route({
    method: 'GET',
    path: '/{filename}',
    handler: function (request, reply) {
        reply.file('./bundle/' + request.params.filename);
    }
});

server.route({
    method: 'GET',
    path: '/img/{filename}',
    handler: function (request, reply) {
        reply.file('./img/' + request.params.filename);
    }
});

server.route({
    method: 'GET',
    path: '/img/base/{filename}',
    handler: function (request, reply) {
        reply.file('./img/base/' + request.params.filename);
    }
});

server.decorate('reply', 'prerenderer', function (url, ip, port, method) {
    
  // Intercepte la réponse
  var response = this.response().hold();
  
  // Affiche les infos de la requete
  var d = new Date(),
      h = d.getHours() + 2, //heure française / GTM
      m = d.getMinutes(),
      s = d.getSeconds();
  h = ('' + h).length == 2 ? h : '0' + h;
  m = ('' + m).length == 2 ? m : '0' + m;
  s = ('' + s).length == 2 ? s : '0' + s;
  console.log('\n' + h + ':' + m + ':' + s + ' ' + this.request.info.remoteAddress + ':' + this.request.info.remotePort + ' ' + this.request.method + ' ' + this.request.url.path);
  
  // Tout est Sync donc non performant
  function getFilesList(dir) {
    console.log('getFilesList');
    var fileList = [];
    var rawList = fs.readdirSync(dir); // Inclus les sous dossiers
    rawList.forEach(function(entry) {  // Exclus les sous dossiers
      var stat = fs.statSync(dir+entry);
      if (stat && stat.isFile()) fileList.push(entry);
    });
    return fileList;
  }
  
  function arrangeFileList(list) {
    console.log('arrangeFileList');
    var arrangedList = [];
    list.forEach(function(entry) {
      var splitEntry = entry.split('_');
      arrangedList.push(
        {
          author: splitEntry[0],
          title: splitEntry[1],
          year: splitEntry[2],
          path: entry
        }
      );
    });
    return arrangedList;
  }
  
  function displayList(arrangedList) {
    console.log('displayList');
    var displayed = '';
    var c=0;
    arrangedList.forEach(function(entry) {
      c++;
      displayed += c + ' - ' + entry.author + ' - ' + entry.title + ' - ' + entry.year + '<br>';
    });
    return(displayed);
  }
  
  function pickOneAmongList(list) {
    console.log('pickOneAmongList');
    var min = 0;
    var max = list.length;
    var picked = Math.floor(Math.random() * (max - min)) + min;
    return list[picked];
  }
  
  function getImageSize(imagePath) {
    console.log('getImageSize');
    return new Promise (function(resolve, reject) {
      gm(imagePath)
      .size(function(err, value) {
        if (!err) resolve(value);
      });
    });
  }
  
  function getImageInfo(imagePath) {
    console.log('getImageInfo');
    return new Promise (function(resolve, reject) {
      gm(imagePath)
      .identify(function(err, value) {
        if (!err) resolve(value);
      });
    });
  }
  
  function getImageNumberOfColors(imagePath) {
    console.log('getImageNumberOfColors');
    return new Promise (function(resolve, reject) {
      gm(imagePath)
      .color(function(err, value) {
        if (!err) resolve(value);
      });
    });
  }
  
  function cropImageAndSaveIt(imagePath, savePath, width, height, x, y) {
    console.log('cropImageAndSaveIt');
    return new Promise (function(resolve, reject) {
      gm(imagePath)
      .crop(width, height, x, y)
      .write(savePath, function (err) {
        if (!err) resolve();
      });
    });
  }
  
  function createProfilePicture(basePicturePath, savePictureDir, size) {
    console.log('createProfilePicture');
    return new Promise (function(resolve, reject) {

      console.log('transforming image ' + basePicturePath);
      var savePath = saveDir + uuid.v4() + '.jpg';
      var basePath = __dirname + '/' + basePicturePath;
      
      getImageSize(basePath).then(function(dimensions) {
        var min = 0;
        var wMax = dimensions.width - size;
        var hMax = dimensions.height - size;
        var x = Math.floor(Math.random() * (wMax - min)) + min;
        var y = Math.floor(Math.random() * (hMax - min)) + min;
        
        cropImageAndSaveIt(basePath, __dirname + '/' + savePath, size, size, x, y).then(function() {
          
          getImageInfo(savePath).then(function(info) {
            
            getImageNumberOfColors(savePath).then(function(colors) {
          
              resolve({path: savePath, info: info, colors: colors});
            });
          });
        });
      });
    });
  }
  
  var html = '<html><head><meta charset="utf-8" /><link rel="icon" type="image/x-icon" href="data:image/x-icon;base64,AAABAAEAEBAAAAAAAABoBQAAFgAAACgAAAAQAAAAIAAAAAEACAAAAAAAAAEAAAAAAAAAAAAAAAEAAAAAAAD///8A+Pj4AP7+/gDj4+MA1dXVAP39/QDi4uIA7+/vAPz8/ADh4eEA9fX1AO7u7gDn5+cA+/v7AMXFxQDZ2dkA7e3tAMTExADl5eUA3t7eAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAIAAAAAAAAAAAIAAAAAAAIAAAAAAAAAABAPCwAAAAAAAAAAAAAAAAAAABADAAAAAAAAABAQDg4OAwkNDgwAAAAAABAODhAAAQ4OBQMDAAAAABAOAQACAAAODgUQDgAAAAAQDgAGDg4ODg4AAA4AAAAADhAADg4ODg4RAAAOAAAAAA4AAA4ODg4OAAoDDgAAAAAOAgIODg4RCAUQDgMAAAAAEwAADg4CBRALDgMQAAAAABMDAgoOAhIODgcAAAAAAAAQExAQDw4OBAAAAAAAAAAAChADEQoKCgAAAAAAAAAAAgAAAAATExMQAAAAAAAACAIAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA=" /><title>Photos de profile</title></head><body><div id="mountNode">Hello World!</div></body></html>';
  var placeholder = html.split('<div id="mountNode">')[1].split('</div>')[0];
  
  var desiredSize = 40;
  var baseDir = 'img/base/';
  var saveDir = 'img/';
  
  var imageList = getFilesList(baseDir);
  var pickedAtRandom = pickOneAmongList(imageList);
  
  createProfilePicture(baseDir+pickedAtRandom, saveDir, desiredSize).then(function(pictureData) {
    var savePath = pictureData.path;
    var info = pictureData.info;
    var colors = pictureData.colors;
    var imgTag = '<img src="' + savePath + '">';
    var imgTagg = '<img src="/img/base/' + pickedAtRandom + '">';
    var content = imgTag + '<br><br> Number of colors : ' + colors + '<br><br>' + JSON.stringify(info) + '<br><br>' + imgTagg + '<br>' + displayList(arrangeFileList(imageList));
    
    response.source  = html.replace(placeholder, content);
    response.send();
    console.log('Served '+ url.path + '\n');
  });
  
  
      
});