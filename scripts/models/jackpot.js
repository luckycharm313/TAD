var restful = require('node-restful');
var mongoose = restful.mongoose;


var jackpotSchema = new mongoose.Schema({
  id: mongoose.Schema.Types.ObjectId,
  value: Number,
});

module.exports = restful.model('Jackpot',jackpotSchema);