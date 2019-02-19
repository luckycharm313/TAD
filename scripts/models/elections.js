var restful = require('node-restful');
var mongoose = restful.mongoose;


var electionSchema = new mongoose.Schema({
  electionId: mongoose.Schema.Types.ObjectId, // foreign key with votes
  title: String, 
  startTime: String, 
  endTime: String,
});


module.exports = restful.model('Elections',electionSchema);