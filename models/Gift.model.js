const mongoose = require('mongoose');

const giftSchema = new mongoose.Schema({
  name: String,
  category: String,
  brand: String,
  description: String,
//   photos: String,
},
{
    timestamps: true
})

const Gift = mongoose.model('Gift', giftSchema)


module.exports = Gift;