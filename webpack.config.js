const path = require('path');
const webpack = require('webpack');
const WorkboxPlugin = require('workbox-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');
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
    ],
  },
  {
    test: /\.(js|jsx)$/,
    exclude: [/node_modules/, /service-worker.js/],
    use: [
      {
        loader: 'babel-loader',
      },
    ],
  },
];

const webpackPlugins = [
  new webpack.DefinePlugin({
    'process.env.APP_VERSION': JSON.stringify(process.env.npm_package_version),
  }),
  new MiniCssExtractPlugin({
    filename: './styles.css',
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
  new HtmlWebpackPlugin({
    template: './src/index.html',
    filename: './index.html',
    inject: false,
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
      new TerserPlugin({
        parallel: true,
      }),
      new CssMinimizerPlugin(),
    ],
  },
  plugins: webpackPlugins,
};
