var restful = require('node-restful');
var mongoose = restful.mongoose;


var governorSchema = new mongoose.Schema({
  id: mongoose.Schema.Types.ObjectId,
  state: String,
  name: String,
  coinbase: String,
});


module.exports = restful.model('Governor', governorSchema);
