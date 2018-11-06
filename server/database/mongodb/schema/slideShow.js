const mongoose = require('mongoose')
const Schema = mongoose.Schema
const ObjectId = Schema.Types.ObjectId

const SlideShowSchema = new Schema({

    img: String, // 上传图片路径
    url: String, // 图片跳转地址,
    title: String, // 标题
    fileName: String,
    ext: String,
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

SlideShowSchema.pre('save', function (next) {
    if (this.isNew) {
        this.meta.createdAt = this.meta.updatedAt = Date.now()
    } else {
        this.meta.updatedAt = Date.now()
    }

    next()
})

const SlideShow = mongoose.model('SlideShow', SlideShowSchema)
