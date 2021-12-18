const mongoose = require('mongoose');
const {Schema} = mongoose;

//giftA : gift I would like to have
//giftB : gift I have and proposed
const transactionSchema = new mongoose.Schema({
  giftA: {type : Schema.Types.ObjectId, ref: 'Gift', required: true},
  giftB: {type: Schema.Types.ObjectId, ref:'Gift', required: true},
  status: {
    type: String,
    enum: ['initiate', 'accept', 'decline']
  }
},
{
  timestamps: true
});

const Transaction = mongoose.model('Transaction', transactionSchema)

module.exports = Transaction;