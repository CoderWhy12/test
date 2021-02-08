const path = require("path");
function resolve(dir) {
  return path.join(__dirname, dir);
}
module.exports = {
  lintOnSave: false,
  configureWebpack: {
    // devServer: {
    //   proxy: {
    //     '/api': {
    //       target: 'http://127.0.0.1:8088',// flowable
    //       // target: 'http://127.0.0.1:8089', // activiti
    //       changeOrigin: true,
    //       pathRewrite: {
    //         '^/api': '/'
    //       }
    //     }
    //   }
    // }
    resolve: {
      alias: {
        "@": resolve("src"),
      },
    },
  },
  devServer: {
    open: true,
    overlay: {
      warnings: false,
      errors: true
    },
    before: require("./mock/mock-server"),
  }
}
