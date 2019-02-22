var common = require('./common');
var mongoose = require('mongoose');

var messageSchema = require('../models/messages').messageSchema;

exports.send = function(req, res) {
    var Messages = mongoose.model("Messages", messageSchema);

    if (req.body.message == undefined) {
        return common.send(res, 401, '', 'message is undefined');
    }
    
    if (req.body.sender == undefined) {
        return common.send(res, 401, '', 'sender is undefined');
    }

    var createAt = Math.round(new Date().getTime()/1000);

    var newMsg = new Messages({
        message: req.body.message,
        sender: req.body.sender,
        createdTime: createAt,
    });

    newMsg.save(function(err){
        if(err){
            return common.send(res, 400, '', err);
        }
        else{
            return common.send(res, 200, '', 'success');
        }
    })
}

exports.all = function(req, res) {
    var Messages = mongoose.model("Messages", messageSchema);
    Messages.find({}).sort({'createdTime': -1}).limit(50).exec(function(err, data){
        if(err){
            return common.send(res, 400, '', err);
        }
        else{
            return common.send(res, 200, data, 'success');
        }
    });
}