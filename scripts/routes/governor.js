var common = require('./common');
var mongoose = require('mongoose');
var constants = require('../../src/constant');

var governorSchema = require('../models/governors').governorSchema;
var voteSchema = require('../models/votes').voteSchema;

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
                var saveData=[]
                
                for(let x = 0; x < 50; x++){                    
                    saveData.push({userName:'', userCode: '', state:constants.states[x]})
                }
                // console.log({saveData});
                Governor.collection.insertMany(saveData, function (err, response) {
                    if (err){ 
                        return common.send(res, 400, '', err);
                    } else {
                        return common.send(res, 200, response.ops, 'Success');
                    }
                });
            }   
        }
    });   
}

exports.update = function(req, res) {
    var Governor = mongoose.model("Governor", governorSchema);
    var Votes = mongoose.model("Votes", voteSchema);

    if (req.body.id == undefined) {
        return common.send(res, 401, '', 'Id is undefined');
    }
    if (req.body.userCode == undefined) {
        return common.send(res, 401, '', 'UserCode is undefined');
    }

    Votes.findOne({ candidacyCode: req.body.userCode }, ['candidacyName'], async function(err, _vote) {
        if(err){
            return common.send(res, 400, '', err);
        }
        else{
            console.log(_vote.candidacyName);
            if (_vote == undefined || _vote == null) {
                return common.send(res, 300, '', 'Undefined user');
            }
            else{
                Governor.findOne({ userCode: req.body.userCode }, async function ( err, _governor){
                    if(err){
                        return common.send(res, 400, '', err);
                    }
                    else{
                        if(_governor == undefined || _governor == null){
                            Governor.findOne({ _id: req.body.id }, async function ( err, _g){
                                if(err){
                                    return common.send(res, 400, '', err);
                                }
                                else{
                                    if (_g == undefined || _g == null) {
                                        return common.send(res, 300, '', 'Undefined user.');
                                    } else {
                                        _g.userName = _vote.candidacyName;
                                        _g.userCode = req.body.userCode;
                                        await _g.save();
                                        Governor.find({}, ['userName', 'userCode', 'state']).sort({state: 1}).exec( function(err, result) {
                                            if(err){
                                                return common.send(res, 400, '', err);
                                            }
                                            else{
                                                if(result.length > 0){
                                                    return common.send(res, 200, result, 'Success');
                                                }
                                                else{
                                                    return common.send(res, 400, '', 'server error');
                                                }
                                            }
                                        });
                                    }
                                }
                            })
                        }
                        else{
                            return common.send(res, 300, '', 'Governor exists.');
                        }
                    }
                })
                
            }
        }
    });
}