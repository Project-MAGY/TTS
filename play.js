"use strict";
require('es6-promise').polyfill();

var fs = require('fs');
var path = require('path');
var http = require('http');
var https = require('https');
var urlParse  = require('url').parse;
var googleTTS = require('google-tts-api');
var shell = require('shelljs');
var parseArgs = require('minimist');
var os = require('os');

function downloadFile (url, dest) {
  return new Promise(function (resolve, reject) {
    var info = urlParse(url);
    var httpClient = info.protocol === 'https:' ? https : http;
    var options = {
      host: info.host,
      path: info.path,
      headers: {
        'user-agent': 'WHAT_EVER'
      }
    };

    httpClient.get(options, function(res) {
      // check status code
      if (res.statusCode !== 200) {
        reject(new Error('request to ' + url + ' failed, status code = ' + res.statusCode + ' (' + res.statusMessage + ')'));
        return;
      }

      var file = fs.createWriteStream(dest);
      file.on('finish', function() {
        // close() is async, call resolve after close completes.
        file.close(resolve);
      });
      file.on('error', function (err) {
        // Delete the file async. (But we don't check the result)
        fs.unlink(dest);
        reject(err);
      });

      res.pipe(file);
    })
    .on('error', function(err) {
      reject(err);
    })
    .end();
  });
}

// start
var argv = parseArgs(process.argv.slice(2));


var text = "";
for(var i = 0; i < argv._.length; ++i){
    text += (i == 0 ? "" : " ") + argv._[i];
}
if(text === "") text = "Hello";


var lang = "";
if (typeof argv.l !== 'undefined') 
    lang = argv.l;
else if (typeof argv.lang !== 'undefined') 
    lang = argv.lang;
else 
    lang = "en";


googleTTS(text=text, lang=lang)
.then(function (url) {
  //console.log(url); // https://translate.google.com/translate_tts?...

  var dest = path.resolve(__dirname, 'result.mp3'); // file destination
  //console.log('Download to ' + dest + ' ...');

  return downloadFile(url, dest);
})
.then(function () {
  //console.log('Download success');
})
.catch(function (err) {
  console.error(err.stack);
})
.then(function () {
    console.log(os.platform());
    if(os.platform() == 'darwin') // For MacOS
        shell.exec("afplay result.mp3 -q 1");
    else if(os.platform() == 'linux') // For raspberryPi
	shell.exec("omxplayer result.mp3");
    shell.rm("result.mp3");
});
