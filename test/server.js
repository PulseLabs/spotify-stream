var express = require('express');
var Spotify = require('../lib/spotify.js');
var login = require('login.js');
var app = express();

app.use(require('morgan')('dev'));

app.get('/music/:id', function (req, res) {
  var uri = req.params.id || 'spotify:track:0RIHDrcRAXtUlnkvTYPW1a';
  console.log(uri);

  var type = Spotify.uriType(uri);
if ('track' != type) {
  throw new Error('Must pass a "track" URI, got ' + JSON.stringify(type));
}
Spotify.login(login.login, login.password, function (err, spotify) {
  console.log(spotify);
  if (err) throw err;


  // first get a "Track" instance from the track URI
  spotify.get(uri, function (err, track) {
    if (err) throw err;

    console.log('Playing: %s - %s', track.artist[0].name, track.name);
    track.play()
      .pipe(res)
      .on('finish', function () {
        spotify.disconnect();
      });


  });
});


});

app.listen(8888);
console.log('running');
