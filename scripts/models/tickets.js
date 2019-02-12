var restful = require('node-restful');
var mongoose = restful.mongoose;


var ticketSchema = new mongoose.Schema({
  someId: mongoose.Schema.Types.ObjectId,
  name: String,
  coinbase: String,
  numbers: []
});


module.exports = restful.model('Ticket',ticketSchema);
