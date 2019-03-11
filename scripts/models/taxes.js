var restful = require('node-restful');
var mongoose = restful.mongoose;


var taxSchema = new mongoose.Schema({
  key: String,
  value: Number,
  someId: mongoose.Schema.Types.ObjectId,
});

module.exports = restful.model('Tax',taxSchema);

var tax = mongoose.model('Tax');
tax.find({}).exec(function(err, data) {
    if(!err){
        if(data.length == 0){
            var saveData = [];
            saveData.push({key:'tadTax', value: '10'});
            saveData.push({key:'govTax', value: '10'});

            tax.collection.insertMany(saveData, function (err, response) {
                if(!err)
                    console.log('Taxes saved');
            })
        }   
    }
});