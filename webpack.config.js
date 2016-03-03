var path     = require('path');
var rucksack = require('rucksack-css');
var webpack  = require('webpack');

var NODE_ENV = JSON.stringify(process.env.NODE_ENV || 'development');
var isDevelopment = (NODE_ENV == JSON.stringify('development'));
var isProduction = (NODE_ENV == JSON.stringify('production'));

console.log('NODE_ENV', NODE_ENV);

var devTool = isDevelopment ? 'eval' : 'source-map';

var entry = [path.resolve(__dirname, 'app/index.jsx')]
if (isDevelopment) {
  entry.push('webpack/hot/dev-server', 'webpack-dev-server/client?http://localhost:8080');
}

var plugins = [
  new webpack.DefinePlugin({
    'process.env': {
      NODE_ENV: NODE_ENV,
      CLIENT_ID: JSON.stringify(process.env.CLIENT_ID)
    }
  })
];

if (isDevelopment) {
  plugins.push(new webpack.HotModuleReplacementPlugin());
}

if (isProduction) {
  plugins.push(
    new webpack.optimize.UglifyJsPlugin({
      minimize: true,
      compress: {
        warnings: false
      }
    })
  );
}

var config = {
  devtool: devTool,
  entry: entry,
  output: {
    path: path.resolve(__dirname, 'build'),
    filename: 'bundle.js'
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
  plugins: plugins,
};

module.exports = config;
