var restful = require('node-restful');
var mongoose = restful.mongoose;


var auctionSchema = new mongoose.Schema({
  name: String,
  startBid: Number,
  price: Number,
  expiry: Number,
  ownerCoinbase: String, //coinbase
  bidOwnerCoinbase: String, //coinbase
  property1: String,
  property2: String,
  property3: String,
  id: mongoose.Schema.Types.ObjectId,
});


module.exports = restful.model('Auction',auctionSchema);
