var path     = require('path');
var rucksack = require('rucksack-css');

module.exports = {
  entry: [
    'webpack/hot/dev-server',
    'webpack-dev-server/client?http://localhost:8080',
    path.resolve(__dirname, 'app/index.js')
  ],
  output: {
    path: path.resolve(__dirname, 'build'),
    filename: 'bundle.js',
  },
  module: {
    preLoaders: [
      { test: /\.jsx?$/, exclude: /node_modules/, loader: "eslint" }
    ],
    loaders: [
      { test: /\.js$/, exclude: /node_modules/, loader: "babel-loader"},
      { test: /\.scss$/, loader: "style-loader!css-loader!sass!postcss-loader" },
    ]
  },
  postcss: [
    rucksack({
      autoprefixer: true
    })
  ]
};
