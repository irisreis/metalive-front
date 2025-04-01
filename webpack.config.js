const webpack = require('webpack');

module.exports = {
  resolve: {
    fallback: {
      "constants": require.resolve("constants-browserify"),
      "path": require.resolve("path-browserify"),
      "fs": false,
      "path": false,
      "os": false,
      "http": false,
      "https": false,
      "zlib": false,
      "stream": false,
      "crypto": require.resolve("crypto-browserify"), 
      "constants": require.resolve("constants-browserify")
    }
  },
  plugins: [
    new webpack.ProvidePlugin({
      process: 'process/browser',
      Buffer: ['buffer', 'Buffer']
    })
  ]
};
