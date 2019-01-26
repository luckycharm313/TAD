var restful = require('node-restful');
var mongoose = restful.mongoose;


var itemSchema = new mongoose.Schema({
  name: String,
  price: Number,
  property1: String,
  property2: String,
  category: String,
  someId: mongoose.Schema.Types.ObjectId,
});


module.exports = restful.model('Items',itemSchema);
