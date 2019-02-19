var restful = require('node-restful');
var mongoose = restful.mongoose;


var userSchema = new mongoose.Schema({
  userId: mongoose.Schema.Types.ObjectId,
  userName: String,
  userCode: String, // unique key
  userState: String,
  
  coinbase: String,
  inventory: [String],
  balance: Number,
  session: String,
  gid: String,  
  password: String,
  rating: Number,
  reviews: Number,
});


module.exports = restful.model('Users',userSchema);
