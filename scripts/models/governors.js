var restful = require('node-restful');
var mongoose = restful.mongoose;


var governorSchema = new mongoose.Schema({
  id: mongoose.Schema.Types.ObjectId,
  name: String,
  coinbase: String,

  userName: String,
  userCode: String,
  state: String,
  isGovernor: { type: Boolean, default: false }
});


module.exports = restful.model('Governor', governorSchema);
