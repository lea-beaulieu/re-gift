const mongoose = require('mongoose');
const {Schema} = mongoose;

//giftA : cadeau que je souhaite avoir
//giftB : cadeau que je propose en échange
const transactionSchema = new mongoose.Schema({
  giftA: {type : Schema.Types.ObjectId, ref: 'Gift', required: true},
  giftB: {type: Schema.Types.ObjectId, ref:'Gift', required: true},
  statut: {
    type: String,
    enum: ['initiated', 'accepted', 'refused']
  }
},
{
    timestamps: true
})

const Transaction = mongoose.model('Transaction', transactionSchema)


module.exports = Transaction;