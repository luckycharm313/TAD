var express = require('express');
var fs = require('fs');
var router = express.Router();
var mongoose = require('mongoose');

var governorSchema = require('../models/governors').governorSchema;
var userSchema = require('../models/servers').userSchema;
var itemSchema = require('../models/items').itemSchema;
var auctionSchema = require('../models/auction').auctionSchema;
var jackpotSchema = require('../models/jackpot').jackpotSchema;
var ticketSchema = require('../models/tickets').ticketSchema;
/*
function generateUID() {
    var firstPart = (Math.random() * 46656) | 0;
    var secondPart = (Math.random() * 46656) | 0;
    firstPart = ("000" + firstPart.toString(36)).slice(-3);
    secondPart = ("000" + secondPart.toString(36)).slice(-3);
    return firstPart + secondPart;
}
  
router.post("/register", function(req, res) {
    var User = mongoose.model("Users", userSchema);
    User.findOne({ coinbase: req.body.cb }, async function(err, products) {
        if (products == "undefined" || products == null) {
            var ref = generateUID();
            var nUser = new User({
                name: req.body.name,
                coinbase: req.body.cb,
                inventory: [],
                balance: 0,
                gid: ref,
                session: ref,
                rating: 0,
                reviews: 0,
                password: req.body.password
            });
            await nUser.save();
            return res.send(ref);
        } else return res.send("User Already Exists");
    });
});

router.post("/login", function(req, res) {
    var User = mongoose.model("Users", userSchema);
    User.findOne({ name: req.body.name }, async function(err, products) {
        if (products != null && req.body.password == products.password) {
        //var ref = generateUID();
        products.session = generateUID();
        await products.save();
        return res.send(products.session);
        } else return res.send("No USER Found");
    });
});
*/
router.post("/createItem", function(req, res) {
    var Item = mongoose.model("Items", itemSchema);

    Item.findOne({ name: req.body.name }, async function(err, products) {
        if (products == "undefined" || products == null) {
            //var ref = generateUID();
            var nUser = new Item({
                name: req.body.name,
                category: req.body.category,
                price: req.body.price
            });
            await nUser.save();
        } else {
            products.price = req.body.price;
            await products.save();
        }

        Item.find({}, function(err, it) {
            return res.send(it);
        });
    });
});
/*
router.post("/purchaseItem", function(req, res) {
    var User = mongoose.model("Users", userSchema);
    var Item = mongoose.model("Items", itemSchema);
    Item.findOne({ name: req.body.itemName }, function(err, it) {
        User.findOne({ name: req.body.name }, async function(err, products) {
            if (products != null && req.body.session == products.session && it.price <= products.balance) {
                //var ref = generateUID();
                products.balance -= it.price;
                products.inventory.push(it);
                await products.save();
                return res.send("User Added");
            } else return res.send("User Already Exists");
        });
    });
});
*/
router.post("/deleteItem", function(req, res) {
    var Item = mongoose.model("Items", itemSchema);

    Item.remove({ name: req.body.name }, function (err) {
        if (err)
            throw err;
        
        Item.find({}, function(err, it) {
            return res.send(it);
        });
    });
});

router.post("/deleteAllItem", function(req, res) {
    var Item = mongoose.model("Items", itemSchema);

    Item.remove({}, function (err) {
        if (err)
            throw err;
        
        Item.find({}, function(err, it) {
            return res.send(it);
        });
    });
});

router.get("/getItems", function(req, res) {
    var Item = mongoose.model("Items", itemSchema);
    Item.find().exec(function(err, it) {
        return res.send(it);
    });  
});
/*
router.get("/getGovs", function(req, res) {
    var Governor = mongoose.model("Governor", governorSchema);
    Governor.find().exec(function(err, _governor) {
        return res.send(_governor);
    });  
}); */

router.post("/updateGovs", function(req, res) {
    var Governor = mongoose.model("Governor", governorSchema);
    Governor.findOne({ id: req.body.id }, async function(err, _governor) {
        if (_governor) {
            _governor.coinbase = req.body.coinbase;
            await _governor.save();
        }

        Governor.find().exec( function(err, result) {
            return res.send(result);
        });
    });  
});

router.get("/getJackpot", function(req, res) {
    var Jackpot = mongoose.model("Jackpot", jackpotSchema);
    Jackpot.find({}, function(err, data) {
        return res.send(data);
    });
});

router.post("/setJackpot", function(req, res) {
    var Jackpot = mongoose.model("Jackpot", jackpotSchema);

    Jackpot.findOne({ id: req.body.auctionId }, async function(err, _jackpot) {
        if(!err){
            if (_jackpot == "undefined" || _jackpot == null) {
                var nJackpot = new Jackpot({
                    value: req.body.value
                });
                await nJackpot.save();
            } else {
                _jackpot.value = req.body.value;
                await _jackpot.save();
            }      
            return res.send(true);
        }
        else{
            return res.send(false);
        }
    });
});
/*
router.post("/postAuction", function(req, res) {
    var Auction = mongoose.model("Auction", auctionSchema);
    var User = mongoose.model("Users", userSchema);
    User.findOne({ name: req.body.name }, async function(err, usr) {
        if (usr != null && usr.session == req.body.session && usr.inventory.indexOf(req.body.itemName) != -1) {
            var auc = new Auction({
                name: req.body.itemName,
                startBid: req.body.price,
                price: req.body.price,
                expiry: req.body.expiry,
                owner: req.body.name,
                bidOwner: null
            });
            await auc.save();
            return res.send("Auction Added");
        } else {
            return res.send("Verification Failed");
        }
    });
});

router.post("/bidAuction", function(req, res) {
    var Auction = mongoose.model("Auction", auctionSchema);
    var User = mongoose.model("Users", userSchema);
    Auction.findOne({ id: req.body.auctionId }, function(err, product) {
        if (product != null)
        User.findOne({ name: req.body.name }, async function(err, usr) {
            if ( usr != null && usr.session == req.body.session && usr.balance >= req.body.bid && product.price < req.body.bid ) {
                product.price = req.body.bid;
                product.bidOwner = usr.name;
                await product.save();

                return res.send("Auction Added");
            } else {
                return res.send("Verification Failed");
            }
        });
    });
});
*/
router.get("/getAuction", function(req, res) {
    var Auction = mongoose.model("Auction", auctionSchema);
    Auction.find({}, function(err, it) {
        return res.send(it);
    });
}); 

router.post("/test", function(req, res) {

    fs.readFile("currencyTable.json", "utf8", function readFileCallback( err, data) {
        if (err) {
            console.log(err);
        } else {
            var obj = JSON.parse(data); //now it an object
            return res.send(obj.table);
        }
    });
});

router.post("/getNumbers", function(req, res) {
    fs.readFile("winningNumbers.json", "utf8", function readFileCallback(err, data) {
        if (err) {
            console.log(err);
        } else {
            var obj = JSON.parse(data); //now it an object
            return res.send(obj.table);
        }
    });
});

router.post("/setNumbers", function(req, res) {
    fs.readFile("winningNumbers.json", "utf8", function readFileCallback(err, data) {
        if (err) {
            console.log(err);
        } else {
            var obj = JSON.parse(data); //now it an object
            obj.table = req.body.numbers;
            var json = JSON.stringify(obj);
            fs.writeFile( "winningNumbers.json", json, "utf8", function writeFileCallBack(err, data) {
                if (err) {
                    console.log(err);
                } else {
                    return res.send(obj.table);
                }
            });
        }
    });
});

router.post("/test2", function(req, res) {

    fs.readFile("currencyTable.json", "utf8", function readFileCallback(err, data) {
        if (err) {
            console.log(err);
        } else {
            var obj = JSON.parse(data); //now it an object
            obj.table[ obj.table.findIndex(i => i.currency == req.body.currency)].price = req.body.price;
            var json = JSON.stringify(obj);
            fs.writeFile( "currencyTable.json", json, "utf8", function writeFileCallBack(err, data) {
                if (err) {
                    console.log(err);
                } else {
                    return res.send(obj.table);
                }
            });
        }
    });
});
/*
router.get("/getTicket", function(req, res) {
    var Ticket = mongoose.model("Ticket", ticketSchema);
    Ticket.find({}, function(err, data) {
        return res.send(data);
    });
}) */

module.exports = router;