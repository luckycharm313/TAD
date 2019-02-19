var restful = require('node-restful');
var mongoose = restful.mongoose;


var voteSchema = new mongoose.Schema({
  id: mongoose.Schema.Types.ObjectId,
  userName: String,
  userCode: String, // foreign key with usermodel
  candidacyCode: String,
  isVoted: Boolean,
  voteId: String,
  userState: String,
});


module.exports = restful.model('Votes',voteSchema);