var restful = require('node-restful');
var mongoose = restful.mongoose;


var serverSchema = new mongoose.Schema({
  serverLocation: String,
  region: String,
  started: Boolean,
  someId: mongoose.Schema.Types.ObjectId,
  password: String,
  players: [{name: String, tx: String, joined: Boolean, coinbase: String, hashkey: String}],
  playerCount: Number,
  ante: Number,
  name: String,


});


module.exports = restful.model('Servers',serverSchema);
