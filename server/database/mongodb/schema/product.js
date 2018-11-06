const mongoose = require('mongoose')
const Schema = mongoose.Schema
const ObjectId = Schema.Types.ObjectId

const ProductSchema = new Schema({
    img: String, // 上传图片路径
    styleNumber: String, // 款号
    style: String, //  款型
    title: String, // 标题
    metaStr: String, // 原始数据(从excel上传需要解析的原始数据)
    count: String, // 数量
    color: String, // 颜色
    size: String,  // 尺码
    season: String, // 发布季
    cardPrice: String, // 吊牌价
    taobaoPrice: String, // 淘宝价格
    usSize: String, // 美码
    comment: String, // 备注
    sex: {
        type: String,
        default: '男'

    },
    category: {
        type: ObjectId,
        ref: 'Category'
    },
    meta: {
        createdAt: {
            type: Date,
            default: Date.now()
        },
        updatedAt: {
            type: Date,
            default: Date.now()
        }
    }
})

ProductSchema.pre('save', function (next) {
    if (this.isNew) {
        this.meta.createdAt = this.meta.updatedAt = Date.now()
    } else {
        this.meta.updatedAt = Date.now()
    }

    next()
})

const Product = mongoose.model('Product', ProductSchema)

