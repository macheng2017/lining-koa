const User = require('../controllers/admin/user')
const Index = require('../controllers/mina')
const Category = require('../controllers/admin/category')
const Product = require('../controllers/admin/product')
const SlideShow = require('../controllers/admin/slideShow')
const Upload = require('../controllers/admin/upload')
// const excelparser = require('../middlewares/excelparser')
const koaBody = require('koa-body')

const MinaProduct = require('../controllers/mina/product')
const MinaSlideShow = require('../controllers/mina/slideShow')
const MinaSearch = require('../controllers/mina/search')
const MinaLogin = require('../controllers/mina/login')
// const MinaPicker = require('../controllers/mina/picker')
/**
 * ajax 服务路由集合
 */
// const router = require('koa-router')({
//     prefix: '/weapp' // 定义所有路由的前缀都已 /weapp 开头
// })

module.exports = router => {
    router.get('/', Index.homePage)

    //   router.get('/weapp/jlList', controllers.jlList)
    //   router.get('/weapp/xwDeatil', controllers.xwDetail)
    //   router.get('/weapp/jlInfo', controllers.jlInfo)
    //   router.post('/weapp/addComments', controllers.addComments)
    //   router.post('/weapp/commentList', controllers.commentList)
    //   router.post('/weapp/punchIn', controllers.punchIn)
    // // 搜索功能
    //   router.get('/weapp/search', controllers.search)

    // pc user  signin and signup
    // router.get('/upload_page', controllers.upload_page)

    // 搜索
    router.get(
        '/results',
        User.signinRequired,
        User.adminRequired,
        Product.search
    )
    // 登录&注册
    router.get('/user/signup', User.showSignup)
    router.get('/user/signin', User.showSignin)
    router.post('/user/signup', User.signup)
    router.post('/user/signin', User.signin)
    router.get('/logout', User.logout)
    // the page of users list for back-end
    // add middleware
    // 后台的用户列表页面
    router.get(
        '/admin/user/list',
        User.signinRequired,
        User.adminRequired,
        User.list
    )
    router.delete(
        '/admin/user',
        User.signinRequired,
        User.adminRequired,
        User.del
    )
    // 后台分类管理页面 api
    router.get(
        '/admin/category/list',
        User.signinRequired,
        User.adminRequired,
        Category.list
    )
    router.get(
        '/admin/category',
        User.signinRequired,
        User.adminRequired,
        Category.show
    )
    router.post(
        '/admin/category',
        User.signinRequired,
        User.adminRequired,
        Category.new
    )
    router.get(
        '/admin/category/update/:_id',
        User.signinRequired,
        User.adminRequired,
        Category.show
    )
    router.delete(
        '/admin/category',
        User.signinRequired,
        User.adminRequired,
        Category.del
    )
    // 后台商品管理页面 api
    router.get(
        '/admin/product/list',
        User.signinRequired,
        User.adminRequired,
        Product.list
    )
    router.get(
        '/admin/product',
        User.signinRequired,
        User.adminRequired,
        Product.show
    )
    router.post(
        '/admin/product',
        User.signinRequired,
        User.adminRequired,
        koaBody({ multipart: true }),
        Product.excelparser,
        Product.new
    )
    router.delete(
        '/admin/product',
        User.signinRequired,
        User.adminRequired,
        Product.del
    )
    router.get(
        '/admin/product/update/:_id',
        User.signinRequired,
        User.adminRequired,
        Product.show
    )
    // 后台批量上传图片api
    router.get(
        '/admin/upload',
        User.signinRequired,
        User.adminRequired,
        Upload.show
    )
    // 后台上传轮播图片

    router.get(
        '/admin/slideShow/list',
        User.signinRequired,
        User.adminRequired,
        SlideShow.list
    )
    router.get(
        '/admin/slideShow',
        User.signinRequired,
        User.adminRequired,
        SlideShow.show
    )
    router.post(
        '/admin/slideShow',
        User.signinRequired,
        User.adminRequired,
        koaBody({ multipart: true }),
        SlideShow.imgProcess,
        SlideShow.new
    )
    router.delete(
        '/admin/slideShow',
        User.signinRequired,
        User.adminRequired,
        SlideShow.del
    )
    // 如果已经上传过了图片,excel表数据被删除则更新图片链接即可
    router.get(
        '/admin/updateImg',
        User.signinRequired,
        User.adminRequired,
        Upload.updateImg
    )
    router.post(
        '/admin/upload',
        User.signinRequired,
        User.adminRequired,
        koaBody({ multipart: true }),
        Upload.uploadImg
    )

    // mina 获取商品列表的api
    router.get('/mina/product/list', MinaProduct.list)
    router.get('/mina/search', MinaSearch)

    router.get('/mina/slideShow/list', MinaSlideShow.list)
    // 小程序获取级联json数据
    // router.get('/mina/picker/list', MinaPicker.list)
    // 小程序登录
    router.post('/mina/login', MinaLogin.loginAsync)
}
//
