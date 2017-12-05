var express = require('express');
var shell = require('shelljs');
var app = express();

app.get('/speech/', function(req, res){
    if(typeof req.query.text === 'undefined'){
        console.log("No text!");
        res.send("No text!");
        return;
    }
    var text = req.query.text;
    var lang = 'en';
    if(typeof req.query.lang !== 'undefined'){
        lang = req.query.lang;
    }
    shell.exec('node play.js --lang '+lang+' '+text);
    res.send("Done! lang="+lang+", text="+text);
    console.log("Done! lang="+lang+", text="+text);
});

app.listen(3000, function(){
    console.log('Magy TTS server listening on port 3000.');
});
