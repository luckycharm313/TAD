var restful = require('node-restful');
var mongoose = restful.mongoose;


var governorSchema = new mongoose.Schema({
  state: String,
  someId: mongoose.Schema.Types.ObjectId,
  name: String,
  coinbase: String,
});


module.exports = restful.model('Governor',governorSchema);
