module.exports = function (context, options) {
  return {
    name: 'custom-loaders',
    configureWebpack(config, isServer) {
      return {
        resolve: {
          extensions: ['.ipynb'],
          fallback: {
            fs: false,
            path: false,
          },
        },
        module: {
          rules: [
            {
              test: /\.ipynb$/,
              // To load `ipynb` files as a json files.
              use: 'json-loader',
            },
          ]
        },
      };
    },
  };
};
