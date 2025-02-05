const nrwlConfig = require('@nx/react/plugins/webpack.js'); // require the main @nx/react/plugins/webpack configuration function.

module.exports = (config, context) => {
  nrwlConfig(config); // first call it so that it @nx/react plugin adds its configs,

  // then override your config.
  return {
    ...config,
    node: { global: true, fs: 'empty' }, // Fix: "Uncaught ReferenceError: global is not defined", and "Can't resolve 'fs'".
  };
};
