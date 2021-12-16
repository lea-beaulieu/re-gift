const mongoose = require('mongoose');
const { Schema } = mongoose;

const giftSchema = new mongoose.Schema({
    name: String,
    category: { type: String, enum: ['books', 'boxes', 'fragrances', 'toys'] },
    brand: String,
    description: String,
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    available: {
        type: Boolean,
        default: true
    },

    //   photos: String,
}, {
    timestamps: true
})

const Gift = mongoose.model('Gift', giftSchema)


module.exports = Gift;