const { defineConfig } = require('@vue/cli-service')
const Version = new Date().getTime().toString().match(/.*(.{8})/)[1] // 截取时间戳后八位
module.exports = defineConfig({
  transpileDependencies: true,
  lintOnSave: false,
  devServer: {
    proxy: {
      '/Api': {
        target: 'http://192.168.32.128', // 后端API服务器地址
        changeOrigin: true,
        
        pathRewrite: {
          '^/Api': '' // 将 '/Api' 替换为空
        }
      }
    }
  },
  
  publicPath:'/',
   configureWebpack:{
        output: {
           filename: `js/[name].${Version}.js`,
           chunkFilename: `js/[name].${Version}.js`
        }
  }
}
  
)


