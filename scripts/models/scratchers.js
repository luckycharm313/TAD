var restful = require('node-restful');
var mongoose = restful.mongoose;


var scratcherSchema = new mongoose.Schema({
  someId: mongoose.Schema.Types.ObjectId,
  userName: String,
  userCode: String,
  winingNumbers: [],
  winingCost: String,
  createdAt: String,
});


module.exports = restful.model('Scratcher',scratcherSchema);
