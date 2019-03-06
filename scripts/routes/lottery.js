var common = require('./common');
var mongoose = require('mongoose');

var ticketSchema = require('../models/tickets').ticketSchema;
var scratcherSchema = require('../models/scratchers').scratcherSchema;

exports.sendPickData =  function(req, res) {
    var Ticket = mongoose.model("Ticket", ticketSchema);

    if (req.body.userName == undefined) {
        return common.send(res, 401, '', 'userName is undefined');
    }
    
    if (req.body.userCode == undefined) {
        return common.send(res, 401, '', 'userCode is undefined');
    }
    
    if (req.body.numbers == undefined) {
        return common.send(res, 401, '', 'numbers is undefined');
    }

    var curr = new Date(); // get current date
    var days = ((curr.getDay() + 7) - 1) % 7;
    var first = curr.getDate() - days;
    var temp = new Date(curr.getFullYear(), curr.getMonth(), first+1);
    temp.setUTCHours(0, 0, 0, 0);
    var firstDayOfWeek = Math.round(temp.getTime()/1000);
    console.log({temp})
    console.log({firstDayOfWeek})
    console.log({curr})
    console.log(curr.getTime())
    
    Ticket.find({"createdAt":{$lt:firstDayOfWeek}}, ['_id'],function(err, data){
        if(err){
            return common.send(res, 400, '', err);
        }
        else{
            if(data.length > 0){
                var temp = [];
                data.forEach(e=>{
                    temp.push(e._id);
                })

                Ticket.deleteMany({ _id: { $in: temp}}, function(err) {
                    if(err){
                        return common.send(res, 400, '', err);
                    }
                    else{
                        saveTicket(Ticket, req, res);
                    }
                })
            }
            else{
                saveTicket(Ticket, req, res);
            }
        }
    })
}

function saveTicket(Ticket, req, res){
    var createAt = Math.round(new Date().getTime()/1000);
    var newTicket = new Ticket({
        userName: req.body.userName,
        userCode: req.body.userCode,
        numbers: JSON.parse(req.body.numbers),
        createdAt: createAt
    });

    newTicket.save(function(err, result){
        if(err){
            return common.send(res, 400, '', err);
        }
        else{
            return common.send(res, 200, '', 'success');
        }
    })
}

exports.getPickData =  function(req, res) {

    var Ticket = mongoose.model("Ticket", ticketSchema);

    Ticket.find({"winingNumbers":[]}, ['userName', 'userCode', 'numbers'],function(err, data){
        if(err){
            return common.send(res, 400, '', err);
        }
        else{
            return common.send(res, 200, data, 'success');
        }
    })
}

exports.setWinnerNumber =  function(req, res) {
    var Ticket = mongoose.model("Ticket", ticketSchema);
    
    if (req.body.winningNumbers == undefined) {
        return common.send(res, 401, '', 'winningNumbers is undefined');
    }

    var createAt = Math.round(new Date().getTime()/1000);
    var newTicket = new Ticket({
        winingNumbers: req.body.winningNumbers,
        createdAt: createAt
    });

    newTicket.save(function(err, result){
        if(err){
            return common.send(res, 400, '', err);
        }
        else{
            return common.send(res, 200, result, 'success');
        }
    })
}

exports.lastWinningNumber =  function(req, res) {
    var Ticket = mongoose.model("Ticket", ticketSchema);

    Ticket.findOne({"winingNumbers": {$ne:[]}}, ['winingNumbers', 'createdAt']).sort({'createdAt': -1}).exec(function(err, data){
        if(err){
            return common.send(res, 400, '', err);
        }
        else{
            return common.send(res, 200, data, 'success');
        }
    })
}

exports.setScratcherNumber =  function(req, res) {
    var Scratcher = mongoose.model("Scratcher", scratcherSchema);

    if (req.body.winingNumbers == undefined) {
        return common.send(res, 401, '', 'winingNumbers is undefined');
    }

    var createAt = Math.round(new Date().getTime()/1000);
    var newScratcher = new Scratcher({
        winingNumbers: req.body.winingNumbers,
        createdAt: createAt
    });

    Scratcher.find({"winingNumbers":{$ne:[]}}, ['_id'],function(err, data){
        if(err){
            return common.send(res, 400, '', err);
        }
        else{
            if(data.length > 0){
                var temp = [];
                data.forEach(e=>{
                    temp.push(e._id);
                })
                Scratcher.deleteMany({ _id: { $in: temp}}, function(err) {
                    if(err){
                        return common.send(res, 400, '', err);
                    }
                    else{
                        newScratcher.save(function(err, result){
                            if(err){
                                return common.send(res, 400, '', err);
                            }
                            else{
                                return common.send(res, 200, result, 'success');
                            }
                        })
                    }
                })
            }
            else{
                newScratcher.save(function(err, result){
                    if(err){
                        return common.send(res, 400, '', err);
                    }
                    else{
                        return common.send(res, 200, result, 'success');
                    }
                })
            }
        }
    }) 
}

exports.getScratcherNumber =  function(req, res) {
    var Scratcher = mongoose.model("Scratcher", scratcherSchema);
    Scratcher.findOne({"winingNumbers": {$ne:[]}}, ['winingNumbers', 'createdAt']).sort({'createdAt': -1}).exec(function(err, data){
        if(err){
            return common.send(res, 400, '', err);
        }
        else{
            return common.send(res, 200, data, 'success');
        }
    })
}

exports.sendScratcherWinnerData =  function(req, res) {
    var Scratcher = mongoose.model("Scratcher", scratcherSchema);
    if (req.body.userName == undefined) {
        return common.send(res, 401, '', 'userName is undefined');
    }
    if (req.body.userCode == undefined) {
        return common.send(res, 401, '', 'userCode is undefined');
    }
    
    if (req.body.winingCost == undefined) {
        return common.send(res, 401, '', 'winingCost is undefined');
    }

    var createAt = Math.round(new Date().getTime()/1000);
    var newScratcher = new Scratcher({
        userName: req.body.userName,
        userCode: req.body.userCode,
        winingCost: req.body.winingCost,
        winingNumbers: [],
        createdAt: createAt
    });

    newScratcher.save(function(err, result){
        if(err){
            return common.send(res, 400, '', err);
        }
        else{
            return common.send(res, 200, result, 'success');
        }
    })
}

exports.getScratcherWinnerData =  function(req, res) {
    var Scratcher = mongoose.model("Scratcher", scratcherSchema);
    Scratcher.find({"winingNumbers":[]}, ['userName', 'userCode', 'winingCost']).sort({'createdAt': -1}).limit(100).exec(function(err, data){
        if(err){
            return common.send(res, 400, '', err);
        }
        else{
            return common.send(res, 200, data, 'success');
        }
    })
}