var express = require('express')
var router = express.Router()
var mongoose = require('mongoose');

// var Server = require('../models/servers');
var governorSchema = require('../models/governors').governorSchema;
var auctionSchema = require('../models/auction').auctionSchema;
var ticketSchema = require('../models/tickets').ticketSchema;

router.post("/createGovernor", function(req, res) {
    var Governor = mongoose.model("Governor", governorSchema);
    var response = {
        status: 200,
        payload: '',
        message: ''
    };

    if (req.body.name == undefined) {
        response = {
            status: 401,
            payload: '',
            message: 'Name is undefined'
        };
        return res.send(response);
    }
    
    if (req.body.coinbase == undefined) {
        response = {
            status: 401,
            payload: '',
            message: 'Coinbase is undefined'
        };
        return res.send(response);
    }
    
    if (req.body.state == undefined) {
        response = {
            status: 401,
            payload: '',
            message: 'State is undefined'
        };
        return res.send(response);
    }

    Governor.findOne({ state: req.body.state }, async function(err, _governor) {
        if(err){
            response = {
                status: 400,
                payload: '',
                message: err
            }
            return res.send(response);
        }
        else{
            if (_governor == undefined || _governor == null) {
                var nGovernor = new Governor({
                    name: req.body.name,
                    coinbase: req.body.coinbase,
                    state: req.body.state
                });
                await nGovernor.save();
                
                response = {
                    status: 200,
                    payload: '',
                    message: 'Governor was added successfully.'
                }

                return res.send(response);
            } else {
                response = {
                    status: 300,
                    payload: '',
                    message: 'Governor already exists.'
                }
                return res.send(response);
            }
        }
    });
});

router.get("/getGovernors", function(req, res) {
    var Governor = mongoose.model("Governor", governorSchema);
    var response = {
        status: 200,
        payload: '',
        message: ''
    };
    Governor.find().exec(function(err, _governors) {
        if(err){
            response = {
                status: 400,
                payload: '',
                message: err
            }
            return res.send(response);
        }
        else{
            response = {
                status: 200,
                payload: _governors,
                message: 'Success'
            }
            return res.send(response);
        }
    });  
});

router.post("/createAuction", function(req, res) {
    var Auction = mongoose.model("Auction", auctionSchema);
    var response = {
        status: 200,
        payload: '',
        message: ''
    };

    if (req.body.name == undefined) {
        response = {
            status: 401,
            payload: '',
            message: 'Name is undefined'
        };
        return res.send(response);
    }
    
    if (req.body.price == undefined) {
        response = {
            status: 401,
            payload: '',
            message: 'Price is undefined'
        };
        return res.send(response);
    }
    
    if (req.body.ownerCoinbase == undefined) {
        response = {
            status: 401,
            payload: '',
            message: 'Owner is undefined'
        };
        return res.send(response);
    }

    Auction.findOne({ name: req.body.name, price: req.body.price, ownerCoinbase: req.body.ownerCoinbase }, async function(err, _auction) {
        if(err){
            response = {
                status: 400,
                payload: '',
                message: err
            }
            return res.send(response);
        }
        else{
            if (_auction == undefined || _auction == null) {
                var nAuction = new Auction({
                    name: req.body.name,
                    price: req.body.price,
                    ownerCoinbase: req.body.ownerCoinbase
                });
                await nAuction.save();
                
                response = {
                    status: 200,
                    payload: '',
                    message: 'Auction was added successfully.'
                }

                return res.send(response);
            } else {
                response = {
                    status: 300,
                    payload: '',
                    message: 'Auction already exists.'
                }
                return res.send(response);
            }
        }
    });
});

router.get("/getAuctions", function(req, res) {
    var Auction = mongoose.model("Auction", auctionSchema);
    var response = {
        status: 200,
        payload: '',
        message: ''
    };
    Auction.find().exec(function(err, _auctions) {
        if(err){
            response = {
                status: 400,
                payload: '',
                message: err
            }
            return res.send(response);
        }
        else{
            response = {
                status: 200,
                payload: _auctions,
                message: 'Success'
            }
            return res.send(response);
        }
    });  
});

router.post("/createTicket", function(req, res) {
    var Ticket = mongoose.model("Ticket", ticketSchema);
    var response = {
        status: 200,
        payload: '',
        message: ''
    };

    if (req.body.name == undefined) {
        response = {
            status: 401,
            payload: '',
            message: 'Name is undefined'
        };
        return res.send(response);
    }
    
    if (req.body.coinbase == undefined) {
        response = {
            status: 401,
            payload: '',
            message: 'Coinbase is undefined'
        };
        return res.send(response);
    }
    
    if (req.body.numbers == undefined) {
        response = {
            status: 401,
            payload: '',
            message: 'Numbers is undefined'
        };
        return res.send(response);
    }
    
    Ticket.findOne({ name: req.body.name, coinbase: req.body.coinbase, numbers: JSON.parse(req.body.numbers) }, async function(err, _ticket) {
        if(err){
            response = {
                status: 400,
                payload: '',
                message: err
            }
            return res.send(response);
        }
        else{
            if (_ticket == undefined || _ticket == null) {
                var nTicket = new Ticket({
                    name: req.body.name,
                    coinbase: req.body.coinbase,
                    numbers: JSON.parse(req.body.numbers)
                });
                await nTicket.save();
                
                response = {
                    status: 200,
                    payload: '',
                    message: 'Ticket was added successfully.'
                }

                return res.send(response);
            } else {
                response = {
                    status: 300,
                    payload: '',
                    message: 'Ticket already exists.'
                }
                return res.send(response);
            }
        }
    });
});

router.get("/getTickets", function(req, res) {
    var Ticket = mongoose.model("Ticket", ticketSchema);
    var response = {
        status: 200,
        payload: '',
        message: ''
    };
    Ticket.find().exec(function(err, _tickets) {
        if(err){
            response = {
                status: 400,
                payload: '',
                message: err
            }
            return res.send(response);
        }
        else{
            response = {
                status: 200,
                payload: _tickets,
                message: 'Success'
            }
            return res.send(response);
        }
    });  
});

module.exports = router;
