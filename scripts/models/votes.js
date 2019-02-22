var restful = require('node-restful');
var mongoose = restful.mongoose;


var voteSchema = new mongoose.Schema({
  id: mongoose.Schema.Types.ObjectId,
  userName: String,
  userCode: String, // foreign key with usermodel
  candidacyCode: String,
  candidacyName: String,
  userState: String,
  voteTime: { 
    type: Date, 
    default: function() {
        return Date.now();
    } 
  }
});


module.exports = restful.model('Votes',voteSchema);