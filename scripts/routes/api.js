var express = require('express');
var router = express.Router();

var election = require('./election');
var governor = require('./governor');
var message = require('./message');
var auction = require('./auction');
var lottery = require('./lottery');
/***
 * common apis
 */
router.get("/governor/all", governor.all);

/***
 * web apis
 */
router.post("/message/send", message.send);
router.post("/governor/update", governor.update);

/***
 * app apis
 **/
router.get("/message/all", message.all);

router.post("/election/vote", election.vote);
router.get("/election/result", election.result);
router.post("/election/setElectionPeroid", election.setPeroid);
router.get("/election/getElectionPeroid", election.getPeroid);

router.post("/auction/bid", auction.bid);
router.post("/auction/post", auction.post);
router.get("/auction/get", auction.get);
router.get("/auction/result", auction.result);
router.post("/lottery/sendPickData", lottery.sendPickData);
router.get("/lottery/getPickData", lottery.getPickData);
router.post("/lottery/setWinnerNumber", lottery.setWinnerNumber);
router.get("/lottery/lastWinningNumber", lottery.lastWinningNumber);

module.exports = router;