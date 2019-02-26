var restful = require('node-restful');
var mongoose = restful.mongoose;


var ticketSchema = new mongoose.Schema({
  someId: mongoose.Schema.Types.ObjectId,
  userName: String,
  userCode: String,
  numbers: [],
  winingNumbers:[],
  isWinner: {type: Boolean, default: false},
  createdAt: String,
});


module.exports = restful.model('Ticket',ticketSchema);
