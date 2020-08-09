module.exports = {
  devServer: {
      proxy: 'http://localhost:3031/'
  },
  publicPath: process.env.NODE_ENV === 'production' ? '/display/' : '/'
};
