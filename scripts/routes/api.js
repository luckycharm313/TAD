var express = require('express');
var router = express.Router();

var election = require('./election');

/**** election ***/
// router.post("/election/createElection", election.createElection);
// router.get("/election/getElection", election.getElection);
router.post("/election/createVote", election.createVote);
router.post("/election/vote", election.vote);

module.exports = router;