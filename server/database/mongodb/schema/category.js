const mongoose = require('mongoose')

const Schema = mongoose.Schema
// 主键
const ObjectId = Schema.Types.ObjectId

const CategorySchema = new Schema({
    name: {type: String,
        unique: true},
    // 用来存放分类里的 商品id, 是一个数组数组中的每一条数据都会指向一个model product,这样 分类与商品之间就可以建立起映射关系了
    products: [{
        type: ObjectId,
        ref: 'Product'
    }],
    meta: {
        createdAt: {
            type: Date,
            default: Date.now()
        },
        updateAt: {
            type: Date,
            default: Date.now()
        }
    }
})
// isLocked field is not saved mongodb that is a virtual field when select mongodb can able get it
CategorySchema.virtual('isLocked').get(function () {
    return !!(this.lockUntil && this.lockUntil > Date.now())
})
// middleware
CategorySchema.pre('save', function (next) {
    if (this.isNew) {
        this.meta.createdAt = this.meta.updatedAt = Date.now()
    } else {
        this.meta.updatedAt = Date.now()
    }

    next()
})

mongoose.model('Category', CategorySchema)
