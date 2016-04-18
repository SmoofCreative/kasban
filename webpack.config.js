var path     = require('path');
var rucksack = require('rucksack-css');
var webpack  = require('webpack');

var NODE_ENV = JSON.stringify(process.env.NODE_ENV || 'development');
var CLIENT_ID = JSON.stringify(process.env.CLIENT_ID || '93624243720041');
var TYPEKIT_KIT_ID = JSON.stringify(process.env.TYPEKIT_KIT_ID || 'ctj8mvm');
var GOOGLE_ANALYTICS_ID = JSON.stringify(process.env.GOOGLE_ANALYTICS_ID || 'UA-36944240-2');


var isDevelopment = (NODE_ENV == JSON.stringify('development'));
var isProduction = (NODE_ENV == JSON.stringify('production'));

console.log('NODE_ENV', NODE_ENV);
console.log('CLIENT_ID', CLIENT_ID);
console.log('TYPEKIT_KIT_ID', TYPEKIT_KIT_ID);
console.log('GOOGLE_ANALYTICS_ID', GOOGLE_ANALYTICS_ID);

var devTool = isDevelopment ? 'eval' : 'source-map';

var entry = ['./app/index.jsx'];
if (isDevelopment) {
  entry.push('webpack/hot/dev-server', 'webpack-dev-server/client?http://localhost:8080');
}

var plugins = [
  new webpack.DefinePlugin({
    'process.env': {
      NODE_ENV: NODE_ENV,
      CLIENT_ID: CLIENT_ID,
      TYPEKIT_KIT_ID: TYPEKIT_KIT_ID,
      GOOGLE_ANALYTICS_ID: GOOGLE_ANALYTICS_ID
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

var preLoaders = [];

if (isDevelopment) {
  preLoaders.push({ test: /\.jsx?$/, exclude: /node_modules/, loader: 'eslint' });
}

var config = {
  devtool: devTool,
  entry: entry,
  output: {
    path: path.join(__dirname, 'build'),
    filename: 'bundle.js',
    publicPath: '/public/'
  },
  module: {
    preLoaders: preLoaders,
    loaders: [
      { test: /\.jsx?$/, exclude: /node_modules/, loader: 'babel-loader' },
      { test: /\.scss$/, loader: 'style-loader!css-loader!sass!postcss-loader' },
      { test: /\.json$/, loader: 'json-loader' }
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
  plugins: plugins
};

module.exports = config;
