
var common = require('./common');
var mongoose = require('mongoose');

/*** models ***/
var voteSchema = require('../models/votes').voteSchema;
var governorSchema = require('../models/governors').governorSchema;
var electionSchema = require('../models/elections').electionSchema;

exports.createVote = function(req, res) {
    var Votes = mongoose.model("Votes", voteSchema);

    if (req.body.userCode == undefined) {
        return common.send(res, 401, '', 'Usercode is undefined');
    }

    Votes.findOne({ userCode: req.body.userCode, isVoted: false }, async function(err, _vote) {
        if(err){
            return common.send(res, 400, '', err);
        }
        else{
            if (_vote == undefined || _vote == null) {
                var model = new Votes({
                    userCode: req.body.userCode,
                    isVoted: false,
                });
                await model.save();
                
                Votes.findOne({ userCode: req.body.userCode, isVoted: false }, ['id'],function(err, _v){
                    if(err){
                        return common.send(res, 400, '', err);
                    }
                    else{
                        if(_v == undefined || _v == null){
                            return common.send(res, 400, '', 'Save error');
                        }
                        else{
                            return common.send(res, 200, _v, 'Success');
                        }
                    }       
                });
                
            } else {
                return common.send(res, 300, '', 'Already exists.');
            }
        }
    });
}

exports.vote = function(req, res) {
    var Votes = mongoose.model("Votes", voteSchema);

    if (req.body.userName == undefined) {
        return common.send(res, 401, '', 'Username is undefined');
    }
    if (req.body.candidacyCode == undefined) {
        return common.send(res, 401, '', 'CandidacyCode is undefined');
    }
    if (req.body.voteId == undefined) {
        return common.send(res, 401, '', 'voteId is undefined');
    }

    Votes.findOne({ voteId: req.body.voteId, isVoted: true }, function(err, _vote) {
        if(err){
            return common.send(res, 400, '', err);
        }
        else{
            Votes.findOne({ _id: req.body.voteId }, async function ( err, _v){
                if(err){
                    return common.send(res, 400, '', err);
                }
                else{
                    if (_vote == undefined || _vote == null) {
                        var model = new Votes({
                            userName: req.body.userName,
                            userCode: _v.userCode,
                            candidacyCode: req.body.candidacyCode,
                            isVoted: true,
                            voteId: req.body.voteId
                        });
                        await model.save();
                        
                        return common.send(res, 200, '', 'Success');
                    } else {
                        return common.send(res, 300, '', 'Already exists.');
                    }
                }
            })
        }
    });
}

exports.history = function(req, res) {
    var Votes = mongoose.model("Votes", voteSchema);
    Votes.find({ isVoted: true }, ['userName', 'userCode', 'candidacyCode']).sort({voteTime: -1}).exec(function(err, _vote) {
        if(err){
            return common.send(res, 400, '', err);
        }
        else{
            if(_vote == undefined || _vote == null){
                return common.send(res, 400, '', 'Save error');
            }
            else{
                return common.send(res, 200, _vote, 'The data was saved successfully');
            }
        }
    });
}

exports.result = function(req, res) {
    var Votes = mongoose.model("Votes", voteSchema);
    var Governor = mongoose.model("Governor", governorSchema);

    Votes.aggregate([
        { $match: { isVoted: true }},
        { $group : { 
                "_id" : "$candidacyCode",
                "count": { $sum: 1 }            
            }
        },
        { $sort : {"count" : -1} },
        { $limit: 70 },
    ], function(err, data){

        if(err){
            return common.send(res, 400, '', err);
        }
        else{
            if(data.length > 0){
                var candidateArray = [];
                data.forEach(element => {
                    candidateArray.push(element._id);                    
                });
                
                Votes.find({ isVoted: true, userCode: { $in: candidateArray } }, ['userName', 'userCode'], function ( err, _v){
                    if(err){
                        return common.send(res, 400, '', err);
                    }
                    else{
                        if(_v.length > 0 ){
                            var saveData = [];
                            _v.forEach(_e=>{
                                var _temp = {};
                                _temp.userCode = _e.userCode;
                                _temp.userName = _e.userName;
                                saveData.push(_temp);
                            })
                            Governor.remove({}, function(err){
                                if(err){
                                    return common.send(res, 400, '', err);
                                }
                                else{
                                    Governor.collection.insertMany(saveData, function (err, docs) {
                                        if (err){ 
                                            return common.send(res, 400, '', err);
                                        } else {
                                            var response = []
                                            data.forEach(element =>{
                                                _v.forEach( e =>{
                                                    if(element._id == e.userCode){
                                                        var temp = {};
                                                        temp.userCode = e.userCode;
                                                        temp.userName = e.userName;
                                                        temp.numbersOfVotes = element.count;
                                                        response.push(temp);
                                                    }
                                                })
                                            })
        
                                            return common.send(res, 200, response, 'Success');
                                        }
                                    });
                                }
                            });                         
                        }
                        else{
                            return common.send(res, 300, '', 'Empty Data');      
                        }                        
                    }
                })                
            }
        }        
    })
}

exports.setPeroid = function(req, res){
    var Elections = mongoose.model("Elections", electionSchema);

    if (req.body.startTime == undefined) {
        return common.send(res, 401, '', 'startTime is undefined');
    }

    if (req.body.endTime == undefined) {
        return common.send(res, 401, '', 'endTime is undefined');
    }

    Elections.remove({}, function(err){
        if(err){
            return common.send(res, 400, '', err);
        }
        else{
            var _temp = {};
            _temp.startTime = req.body.startTime;
            _temp.endTime = req.body.endTime;            

            Elections.insertMany(_temp, function (err, data) {
                if (err){ 
                    return common.send(res, 400, '', err);
                } else {                    
                    return common.send(res, 200, data, 'Success');
                }
            });
        }
    });
}

exports.getPeroid = function(req, res){
    var Elections = mongoose.model("Elections", electionSchema);

    Elections.find({}, ['startTime', 'endTime']).exec(function(err, data) {
        if(err){
            return common.send(res, 400, '', err);
        }
        else{
            if(data.length > 0){
                return common.send(res, 200, data, 'Successs');                
            }
            else{
                return common.send(res, 300, '', 'Empty Data');
            }
        }
    });
}