module.exports = {
    devServer: {
        proxy: {
            '/apis': {
                // 测试环境
                target: 'http://192.168.0.121:6063',  // 接口域名
                ws: true,
                changeOrigin: true,  //是否跨域
                pathRewrite: {
                    '^/apis': ''   //需要rewrite重写的,
                }              
            }
        },
        overlay: {
            warnings: true,
            errors: true
        }
    },
    lintOnSave: false,
    assetsDir: 'static',
}