const path = require('path');

module.exports = ({ config }) => {
  // Handle SCSS files
  config.module.rules.push({
    test: /\.scss$/,
    use: [
      'style-loader',
      {
        loader: 'css-loader',
        options: {
          importLoaders: 1,
        },
      },
      'sass-loader',
    ],
  });

  // Handle TypeScript files
  config.module.rules.push({
    test: /\.(ts|tsx)$/,
    use: [
      {
        loader: require.resolve('babel-loader'),
        options: {
          presets: [
            ['@babel/preset-env', { targets: 'defaults' }],
            '@babel/preset-react',
            '@babel/preset-typescript',
          ],
        },
      },
    ],
  });

  // Handle assets
  config.module.rules.push({
    test: /\.(png|jpg|gif|svg|eot|ttf|woff|woff2)$/,
    type: 'asset',
  });

  // Add file extensions
  config.resolve.extensions.push('.ts', '.tsx');

  // Add aliases
  config.resolve.alias = {
    ...config.resolve.alias,
    '@': path.resolve(__dirname, '../src'),
  };

  return config;
};
