exports.homePage = async (ctx, next) => {
    await ctx.render('pages/index', {
        title: '首页'
    })
}
