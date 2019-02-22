var restful = require('node-restful');
var mongoose = restful.mongoose;

var messageSchema = new mongoose.Schema({
  messageId: mongoose.Schema.Types.ObjectId, // foreign key with votes
  message: String,
  sender: Number,
  createdTime: String
});

module.exports = restful.model('Messages', messageSchema);