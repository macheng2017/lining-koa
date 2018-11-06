// 配置项
// const host = 'http://localhost:1337'
// 从本地切换为线上开发环境域名
const host = 'https://lining.xugaoyang.com'

const config = {
  host,
  loginUrl: `${host}/mina/login`,
  // 主要是看静态资源存放的位置
  // 配置vuex中的imgCDN,如果用的是本地服务器存储图片
  // 该项就是服务器域名,如果使用的是七牛云服务器该项是七牛云配置的域名或者cdn
  // imageCDN: 'http://localhost:1337',
  imageCDN: 'https://lining.xugaoyang.com',
  // 默认图片
  defImg: 'default.jpeg'
}
export default config
