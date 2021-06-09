module.exports = {
  devServer: {
    proxy: {
      '^/socket\\.io/': {
        target: 'http://localhost:3031/',
        ws: true
      }
    }
  },
  publicPath: process.env.NODE_ENV === 'production' ? '/console/' : '/'
}
