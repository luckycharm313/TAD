var express = require('express');
var router = express.Router();


var Server = require('../models/servers');
var User = require('../models/users');
var Ticket = require('../models/tickets');
var Governor = require('../models/governors');
var Auction = require('../models/auction');
var Item = require('../models/items');


Server.methods(['get']);//, 'put', 'post', 'delete']);
Server.register(router, '/servers');

User.methods(['get']);//, 'put', 'post', 'delete']);
User.register(router, '/users');

Ticket.methods(['get']);//, 'put', 'post', 'delete']);
Ticket.register(router, '/tickets');

Governor.methods(['get']);//, 'put', 'post', 'delete']);
Governor.register(router, '/governors');

Auction.methods(['get']);//, 'put', 'post', 'delete']);
Auction.register(router, '/auction');

Item.methods(['get']);//, 'put', 'post', 'delete']);
Item.register(router, '/items');

module.exports = router;
