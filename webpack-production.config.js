var path     = require('path');
var rucksack = require('rucksack-css');
var webpack  = require('webpack');

var NODE_ENV = JSON.stringify(process.env.NODE_ENV || 'production');

var entry = [path.resolve(__dirname, 'app/index.jsx')]
var config = {
  devtool: 'source-map',
  entry: entry,
  output: {
    path: path.resolve(__dirname, 'build'),
    filename: 'bundle.js',
  },
  module: {
    loaders: [
      { test: /\.jsx?$/, exclude: /node_modules/, loader: 'babel-loader' },
      { test: /\.scss$/, loader: 'style-loader!css-loader!sass!postcss-loader' },
      { test: /\.json$/, loader: 'json-loader' },
    ]
  },
  resolve: {
    extensions: ['', '.js', '.jsx', '.json', '.scss'],
    modulesDirectories: ['node_modules']
  },
  postcss: [
    rucksack({
      autoprefixer: true
    })
  ],
  node: {
    readline: 'empty'
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: NODE_ENV,
        CLIENT_ID: JSON.stringify(process.env.CLIENT_ID)
      }
    }),
    new webpack.optimize.UglifyJsPlugin({
      minimize: true,
      compress: {
        warnings: false
      }
    })
  ],
};

module.exports = config;
