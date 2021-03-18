const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

module.exports = {
  mode: 'development',
  entry: './demo/index.tsx',
  resolve: {
    extensions: ['.ts', '.tsx', '.js', '.json', '.less'],
  },
  module: {
    rules: [
      {
        test: /\.(tsx|ts|js)$/,
        exclude: /node_modules/,
        use: 'babel-loader',
      },
      {
        test: /\.(css|less)$/,
        use: [
          MiniCssExtractPlugin.loader,
          'css-loader', 
          'less-loader',
        ],
      }
    ]
  },
  plugins: [
    new HtmlWebpackPlugin({
      title: 'demo页面',
    }),
    new MiniCssExtractPlugin()
  ]
}