var path     = require('path');
var rucksack = require('rucksack-css');
var webpack  = require('webpack');

module.exports = {
  entry: [
    'webpack/hot/dev-server',
    'webpack-dev-server/client?http://localhost:8080',
    'webpack/hot/only-dev-server',
    path.resolve(__dirname, 'app/index.jsx')
  ],
  output: {
    path: path.resolve(__dirname, 'build'),
    filename: 'bundle.js',
  },
  module: {
    preLoaders: [
      { test: /\.jsx?$/, exclude: /node_modules/, loader: 'eslint' }
    ],
    loaders: [
      { test: /\.jsx?$/, exclude: /node_modules/, loader: 'babel-loader' },
      { test: /\.scss$/, loader: 'style-loader!css-loader!sass!postcss-loader' },
      { test: /\.json$/, loader: 'json-loader' },
    ]
  },
  postcss: [
    rucksack({
      autoprefixer: true
    })
  ],
  resolve: {
    extensions: ['', '.js', '.jsx', '.json', '.scss'],
    modulesDirectories: ['node_modules']
  },
  node: {
    readline: 'empty'
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env': { NODE_ENV: JSON.stringify(process.env.NODE_ENV || 'development') }
    })
  ],
};
