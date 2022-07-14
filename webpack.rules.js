const sveltePreprocess = require('svelte-preprocess')

module.exports = [
  // Add support for native node modules
  {
    // We're specifying native_modules in the test because the asset relocator loader generates a
    // "fake" .node file which is really a cjs file.
    test: /native_modules\/.+\.node$/,
    use: 'node-loader',
  },
  {
    test: /\.(m?js|node)$/,
    parser: { amd: false },
    use: {
      loader: '@vercel/webpack-asset-relocator-loader',
      options: {
        outputAssetBase: 'native_modules',
      },
    },
  },
  {
    test: /\.tsx?$/,
    exclude: /(node_modules|\.webpack)/,
    use: {
      loader: 'ts-loader',
      options: {
        transpileOnly: true,
      },
    },
  },
  {
    test: /\.svelte$/,
    use: {
      loader: 'svelte-loader',
      options: {
        preprocess: sveltePreprocess({ typescript: true }),
      },
    },
  },
  {
    // required to prevent errors from Svelte on Webpack 5+, omit on Webpack 4
    test: /node_modules\/svelte\/.*\.mjs$/,
    resolve: {
      fullySpecified: false,
    },
  },
  {
    test: /\.scss$/,
    use: ['style-loader', 'css-loader', 'postcss-loader', 'sass-loader'],
  },
]
