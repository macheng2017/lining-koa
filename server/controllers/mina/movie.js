// 0. 商品Model的创建
// 1. 商品录入页面
// 2. 商品的创建持久化
// 3. 商品的后台列表
// 4. 对应分类的路由规则
// 5. 对应的分类页面
const mongoose = require('mongoose')
const Movie = mongoose.model('Movie')
const Category = mongoose.model('Category')
// 1. 商品录入页面
exports.show = async (ctx, next) => {
    const { _id } = ctx.params
    let movie = {}
    if (_id) {
        movie = await Movie.findOne({ _id })
    }
    await ctx.render('pages/movie_admin', {
        title: '后台分类录入页面',
        movie
    })
}
// 2. 商品的创建持久化
exports.new = async (ctx, next) => {
    let movieData = ctx.request.body.fields || {}
    let movie

    if (movieData._id) {
        movie = await Movie.findOne({ _id: movieData._id })
    }
    // 与分类建立映射关系
    const categoryId = movieData.categoryId
    const categoryName = movieData.category

    let category
    if (categoryId) {
        category = await Category.findOne({_id: categoryId})
    } else if (categoryName) {
        category = new Category({name: categoryName})
        await category.save()
    }
// update
    if (movie) {
        movie = _.extend(movie, movieData)
        movie.category = category._id
    } else {
      // 防止冲突 删掉movieData._id
        delete movieData._id
        movieData.category = category._id
        movie = new Movie({ movieData })
    }
    // 在分类里添加商品数据,建立起来对应关系
    category = await Category.findOne({_id: category._id})
    if (category) {
        category.movies = category.movies || []
        category.movies.push(movie._id)
        await category.save()
    }

    await movie.save()
    ctx.redirect('/admin/movie/list')
}
// 3. 商品的后台列表
exports.list = async (ctx, next) => {
    const movies = await Movie.find({})
    await ctx.render('pages/movie_list', {
        title: '分类列表页面',
        movies
    })
}

// 4. 对应分类的路由规则
// 5. 对应的分类页面
