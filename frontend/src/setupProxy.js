require('dotenv').config();
const { createProxyMiddleware } = require('http-proxy-middleware');

const backendUrl = process.env.REACT_APP_BACKEND_URL || 'https://86.50.228.33';

module.exports = function(app) {
  console.log('Setting up proxy middleware');
  app.use(
    '/api',
    createProxyMiddleware({
      target: backendUrl,
      changeOrigin: true,
    })
  );
  console.log('Proxy middleware setup complete');
};
