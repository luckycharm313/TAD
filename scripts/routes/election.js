
var common = require('./common');
var mongoose = require('mongoose');

/*** models ***/
var voteSchema = require('../models/votes').voteSchema;

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
                            return common.send(res, 200, _v, 'The data was saved successfully');
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
                        
                        return common.send(res, 200, '', 'The data was saved successfully');
                    } else {
                        return common.send(res, 300, '', 'Already exists.');
                    }
                }
            })
        }
    });
}