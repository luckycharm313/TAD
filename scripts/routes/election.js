
var common = require('./common');
var mongoose = require('mongoose');

/*** models ***/
var voteSchema = require('../models/votes').voteSchema;
var governorSchema = require('../models/governors').governorSchema;
var electionSchema = require('../models/elections').electionSchema;

exports.vote = function(req, res) {
    var Votes = mongoose.model("Votes", voteSchema);

    if (req.body.userName == undefined) {
        return common.send(res, 401, '', 'Username is undefined');
    }
    
    if (req.body.userCode == undefined) {
        return common.send(res, 401, '', 'userCode is undefined');
    }

    if (req.body.candidacyCode == undefined) {
        return common.send(res, 401, '', 'CandidacyCode is undefined');
    }
    
    if (req.body.candidacyName == undefined) {
        return common.send(res, 401, '', 'candidacyName is undefined');
    }
    
    Votes.findOne({ userCode: req.body.userCode }, async function ( err, _vote){
        if(err){
            return common.send(res, 400, '', err);
        }
        else{
            if (_vote == undefined || _vote == null) {
                var model = new Votes({
                    userName: req.body.userName,
                    userCode: req.body.userCode,
                    candidacyCode: req.body.candidacyCode,
                    candidacyName: req.body.candidacyName,
                });
                await model.save();
                
                return common.send(res, 200, '', 'Success');
            } else {
                return common.send(res, 300, '', 'Already exists.');
            }
        }
    })
}

exports.result = function(req, res) {
    var Votes = mongoose.model("Votes", voteSchema);
    
    Votes.aggregate([
        { $group : { 
                "_id" : "$candidacyCode",
                "count": { $sum: 1 },
                "data" : {"$first" : "$$ROOT"}
            }
        },
        { $sort : {"count" : -1} },
        { $limit: 70 },
        { $project : { "candidacyCode" : "$_id", "candidacyName":"$data.candidacyName", "numbersOfVotes":"$count" } }
    ], function(err, data){
        if(err){
            return common.send(res, 400, '', err);
        }
        else{
            if(data.length > 0){
                return common.send(res, 200, data, 'Success'); 
            }
            else{
                return common.send(res, 200, [], 'Empty Data'); 
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
                return common.send(res, 200, [], 'Empty Data');
            }
        }
    });
}