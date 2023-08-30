const { createProxyMiddleware } = require("http-proxy-middleware");

const serverPath = "http://baichuanpm.test.wxliebao.com";

module.exports = function (app) {
  app.use(
    "/CusApi",
    createProxyMiddleware({
      // pathRewrite: {
      //   "^/api": "",
      // },
      target: serverPath,
      changeOrigin: true,
    })
  );
};
