var common = require('./common');
var mongoose = require('mongoose');

var governorSchema = require('../models/governors').governorSchema;

exports.all = function(req, res) {
    
    var Governor = mongoose.model("Governor", governorSchema);

    Governor.find({}, ['userName', 'userCode', 'state']).sort({state: 1}).exec( function ( err, _data){
        if(err){
            return common.send(res, 400, '', err);
        }
        else{
            if(_data.length > 0){
                return common.send(res, 200, _data, 'Success');
            }
            else{
                return common.send(res, 300, '', 'Empty Data');      
            }   
        }
    });   
}