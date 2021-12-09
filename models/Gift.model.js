const mongoose = require('mongoose');
const {Schema} = mongoose;

const giftSchema = new mongoose.Schema({
  name: String,
  category: String,
  brand: String,
  description: String,
  user : {type : Schema.Types.ObjectId, ref:'User', required: true}
//   photos: String,
},
{
    timestamps: true
})

const Gift = mongoose.model('Gift', giftSchema)


module.exports = Gift;