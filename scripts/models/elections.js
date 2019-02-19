var restful = require('node-restful');
var mongoose = restful.mongoose;


var electionSchema = new mongoose.Schema({
  electionId: mongoose.Schema.Types.ObjectId, // foreign key with votes
  startTime:  { 
    type: Date, 
    default: function() {
        return Date.now();
    } 
  }, 
  endTime:  { 
    type: Date, 
    default: function() {
        return Date.now();
    } 
  },
});


module.exports = restful.model('Elections',electionSchema);