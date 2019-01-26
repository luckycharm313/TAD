var restful = require('node-restful');
var mongoose = restful.mongoose;


var userSchema = new mongoose.Schema({
  name: String,
  coinbase: String,
  inventory: [String],
  balance: Number,
  session: String,
  gid: String,
  someId: mongoose.Schema.Types.ObjectId,
  password: String,
  rating: Number,
  reviews: Number,
});


module.exports = restful.model('Users',userSchema);
