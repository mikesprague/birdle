const path = require('path');
const { ESBuildMinifyPlugin } = require('esbuild-loader')
const WorkboxPlugin = require('workbox-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const CompressionPlugin = require('compression-webpack-plugin');

const mode = process.env.NODE_ENV || 'production';
// const mode = 'production';

const webpackRules = [
  {
    test: /\.(ttf|eot|woff|woff2)$/,
    type: 'asset',
  },
  {
    test: /\.(png|jpg|gif|svg)$/i,
    type: 'asset',
  },
  {
    test: /\.(sa|sc|c)ss$/,
    // exclude: [/old/],
    use: [
      MiniCssExtractPlugin.loader,
      {
        loader: 'css-loader',
        options: {
          importLoaders: true,
          sourceMap: true,
        },
      },
      {
        loader: 'postcss-loader',
      },
      {
        loader: 'sass-loader',
        options: {
          sourceMap: true,
        },
      },
      {
        loader: 'esbuild-loader',
        options: {
          loader: 'css',
          minify: true
        }
      },
    ],
  },
  {
    test: /\.js$/,
    exclude: [/node_modules/, /service-worker.js/],
    loader: 'esbuild-loader',
    options: {
      target: 'esnext'
    }
  },
];

const webpackPlugins = [
  new MiniCssExtractPlugin({
    filename: './styles.css',
  }),
  new HtmlWebpackPlugin({
    inject: false,
    template: './src/index.html',
    environment: mode,
    appVersion: process.env.npm_package_version,
  }),
  new CopyWebpackPlugin({
    patterns: [
      {
        from: './src/**/*.png',
        to: './[name][ext]',
        force: true,
      },
    ],
  }),
  new CopyWebpackPlugin({
    patterns: [
      {
        from: `./src/birdle.webmanifest`,
        to: './[name][ext]',
        force: true,
      },
    ],
  }),
  new WorkboxPlugin.GenerateSW({
    cleanupOutdatedCaches: true,
    clientsClaim: true,
    skipWaiting: true,
  }),
  new CompressionPlugin({
    include: [/.js$/, /.css$/, /.html$/],
    exclude: [/.map$/, /.txt$/, /.md$/],
  }),
];

module.exports = {
  entry: ['./src/app.js'],
  devtool: 'source-map',
  resolve: {
    extensions: ['*', '.js'],
  },
  output: {
    filename: './app.js',
    chunkFilename: './[id].[chunkhash].js',
    path: path.resolve(__dirname, 'dist'),
  },
  mode,
  module: {
    rules: webpackRules,
  },
  optimization: {
    minimizer: [
      new ESBuildMinifyPlugin({
        target: 'es2015',
        css: true,
      })
    ]
  },
  plugins: webpackPlugins,
};
