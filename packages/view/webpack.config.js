const webpack = require('webpack');
const path = require('path');

const HtmlPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const AltVPlugin = require('altv-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

const isProduction = process.env.NODE_ENV === 'production';
const sourcePath = path.resolve(process.cwd(), 'src');
const rootDir = path.resolve(process.cwd(), '..', '..');
const outputPath = path.resolve(rootDir, 'resources', 'main', 'client', 'view');

module.exports = {
  entry: path.resolve(sourcePath, 'index.tsx'),
  stats: {
    colors: true
  },
  output: {
    path: outputPath,
    filename: '[name].[contenthash:8].js',
    chunkFilename: '[name].[contenthash:8].chunk.js'
  },
  resolve: {
    extensions: ['.js', '.ts', '.tsx']
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        exclude: /node_modules/,
        use: [
          'ts-loader',
          {
            loader: 'eslint-loader',
            options: {
              failOnError: true,
              failOnWarning: isProduction,
              cache: true,
            }
          },
        ].filter(Boolean)
      },
      {
        test: /\.css$/,
        include: /node_modules/,
        use: [
          { loader: MiniCssExtractPlugin.loader },
          'css-loader'
        ]
      },
      {
        test: /\.(scss|sass)$/,
        exclude: /node_modules/,
        use: [
          { loader: MiniCssExtractPlugin.loader },
          {
            loader: 'css-loader',
            options: {
              modules: {
                localIdentName: '[name]__[local]___[hash:base64:8]'
              }
            },
          },
          'sass-loader'
        ]
      },
      {
        test: /\.html$/,
        use: 'html-loader'
      },
      {
        test: /\.(png|svg|ogg|jpe?g)$/,
        loader: 'url-loader',
        options: {
          limit: 8192,
          name: '[name].[contenthash:8].[ext]'
        }
      },
      {
        exclude: [/\.(js|mjs|jsx|ts|tsx|css|sass|scss)$/, /\.html$/, /\.json$/],
        loader: 'file-loader',
        options: {
          name: '[name].[contenthash:8].[ext]'
        }
      }
    ]
  },
  optimization: {
    minimize: true,
    minimizer: [new TerserPlugin()],
    splitChunks: {
      chunks: 'all',
      name: false,
    }
  },
  plugins: [
    new AltVPlugin(),
    new webpack.EnvironmentPlugin({ 'process.env.NODE_ENV': isProduction ? 'production' : 'development' }),
    new MiniCssExtractPlugin({
      filename: '[name].[contenthash:8].css',
      chunkFilename: '[name].[contenthash:8].chunk.css',
    }),
    new HtmlPlugin({ template: path.resolve(process.cwd(), 'public', 'index.html') }),
    new CleanWebpackPlugin()
  ]
};