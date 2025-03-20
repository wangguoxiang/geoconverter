const path = require('path');

module.exports = {
  webpack: {
    configure: (webpackConfig, { env, paths }) => {
      webpackConfig.resolve = {
        ...webpackConfig.resolve,
        alias: {
          '@': path.resolve(__dirname, 'src'),
        },
      };
      // 修改输出目录
      webpackConfig.output.path = path.resolve(__dirname, './dist');
      return webpackConfig;
    },
  },
  devServer: {
    allowedHosts: ['localhost', '127.0.0.1'],
    proxy: {
      '/api': {
        target: 'http://127.0.0.1:8080',
        changeOrigin: true,
        secure: false,
        pathRewrite: { '^/api': '/api' }, // 修改路径重写规则，确保请求路径正确转发
      },
    },
  },
};