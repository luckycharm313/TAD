var express = require('express');
var router = express.Router();

var election = require('./election');
var governor = require('./governor');

/**** election ***/
// router.post("/election/createElection", election.createElection);
// router.get("/election/getElection", election.getElection);
router.post("/election/createVote", election.createVote);
router.post("/election/vote", election.vote);
router.get("/election/result", election.result);
router.post("/election/setElectionPeroid", election.setPeroid);
router.get("/election/getElectionPeroid", election.getPeroid);

router.get("/governor/all", governor.all);

router.get("/election/history", election.history);

module.exports = router;