module.exports = {
  devServer: {
    host: '127.0.0.1',
    port: '9006',
    proxy: {
      '^/api': {
        target: 'http://test2.qmwm777.com',
        changeOrigin: true,
        pathRewrite: {
          '^/api': ''
        }
      }
    }
  },
  chainWebpack: (config) => {
    config.plugin('html').tap((args) => {
        args[0].title = '全民外贸授权页';
        return args;
      });
  }
}
