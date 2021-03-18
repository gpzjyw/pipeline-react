const path = require('path');
const webpack = require('webpack');

const config = {
  mode: 'development',
  entry: './src/index.tsx',
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
    ]
  },
  output: {
    path: path.resolve(__dirname, '../dist'),
    libraryTarget: 'module',
    filename: 'index.esm.js',
    clean: true,
  },
  externals: {
    react: 'React',
    classnames: 'classnames'
  },
  experiments: {
    outputModule: true,
  }
};

webpack(config, (err, stats) => {
  if (err || stats.hasErrors()) {
    console.log(err || stats.toString());
  } else {
    console.log(stats.toString());
    console.log('build success');
  }
});
