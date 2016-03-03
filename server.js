var express = require('express');
var path = require('path');
var webpack = require('webpack');
var app = express();

var isDevelopment = (process.env.NODE_ENV !== 'production');
var static_path = path.join(__dirname, 'build');
var port = process.env.PORT || 3000;

app.use(express.static(static_path));

app.get('/', function (req, res) {
  res.sendFile('./build/index.html');
});

app.listen(port, function (err) {
  if (err) { console.log(err) };
  console.log('Application server listening on port: ' + port);
});


if (isDevelopment) {
  var config = require('./webpack.config');
  var WebpackDevServer = require('webpack-dev-server');

  var devServer = new WebpackDevServer(webpack(config), {
    contentBase: 'build',
    hot: true
  });

  devServer.listen(8080, 'localhost', function (err, result) {
    if (err) { console.log(err) }
    console.log('Development server listening on port: 8080');
  });
}
