const mongoose = require('mongoose')
const Schema = mongoose.Schema
const ObjectId = Schema.Types.ObjectId

const MediaSchema = new Schema({
    img: String, // 上传图片路径
    fileName: String,
    ext: String,
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

MediaSchema.pre('save', function (next) {
    if (this.isNew) {
        this.meta.createdAt = this.meta.updatedAt = Date.now()
    } else {
        this.meta.updatedAt = Date.now()
    }

    next()
})

const Media = mongoose.model('Media', MediaSchema)
