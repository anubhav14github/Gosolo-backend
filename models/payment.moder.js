const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const OrderSchema = mongoose.Schema({
    data: Object,
    postID:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Activity",
        default:null
    },
  });


  const Order = mongoose.model("order", OrderSchema);
  module.exports = Order;