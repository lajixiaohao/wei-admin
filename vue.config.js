const path = require('path')
const defaultConfigs = require('./src/settings.js')

function resolve (dir) {
  return path.join(__dirname, dir)
}

module.exports = {
  productionSourceMap: false,
  parallel: false,
  publicPath: '/',
  assetsDir: 'static',
  outputDir: 'dist',
  chainWebpack: (config) => {
    config.plugin('html').tap((args) => {
      args[0].title = defaultConfigs.webTitle
      return args
    })
    config.module
      .rule('svg')
      .exclude
      .add(resolve('src/assets'))
      .end()
    config.module
      .rule('icons')
      .test(/\.svg$/)
      .include.add(resolve('src/assets/svg'))
      .end()
      .use('svg-sprite-loader')
      .loader('svg-sprite-loader')
      .options({
        symbolId: 'icon-[name]'
      })
      .end()
  }
}
