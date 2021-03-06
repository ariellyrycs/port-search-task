const { createProxyMiddleware } = require('http-proxy-middleware');
module.exports = function(app) {
  app.use(
    '/prod',
    createProxyMiddleware({
      target: 'https://685rp9jkj1.execute-api.eu-west-1.amazonaws.com',
      headers: {
        accept: 'application/json',
        method: 'GET',
        'x-api-key': process.env.API_KEY
      },
      changeOrigin: true
    })
  );
};