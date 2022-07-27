const webpack = require('webpack');

module.exports = function override(config, env) {
  config.resolve.fallback = {
    ...config.resolve.fallback,
    stream: require.resolve('stream-browserify'),
    zlib: require.resolve('browserify-zlib'),
    buffer: require.resolve('buffer/'),
    util: require.resolve('util/'),
    assert: require.resolve('assert/'),
  };

  config.plugins = [
    ...config.plugins,
    new webpack.ProvidePlugin({
      process: 'process/browser',
      Buffer: ['buffer', 'Buffer'],
    }),
  ];
  return config;
};
