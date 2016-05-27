var webpack = require('webpack');

module.exports = {
  entry: './www/index.js',

  output: {
    path: __dirname,
    filename: './static/bundle.js',
  },

  module: {
    loaders: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'babel',
        query: {
          presets: ['es2015', 'react', 'stage-0'],
        },
      },
    ],
  },
};
