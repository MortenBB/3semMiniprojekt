var express = require('express');
var router = express.Router();
var userFacade = require('../facades/userFacade');

/* GET users listing. */
router.get('/allUsers', async function(req, res, next) {
	res.json({ users: await userFacade.getAllUsers() });
});

router.post('/addUser', async function(req, res, next) {
	let body = req.body;
	let firstName = body.firstName;
	let lastName = body.lastName;
	let username = body.username;
	let password = body.password;
	let email = body.email;
	let user = await userFacade.addUser(firstName, lastName, username, password, email);
	res.json({ user: user });
});

router.get('/:uname', async function(req, res, next) {
	var uname = req.params.uname;
	res.json({ user: await userFacade.findByUsername(uname) });
});

router.post('/login', async function(req, res, next) {
	let body = req.body;
	let uName = body.username;
	let password = body.password;
	let longitude = body.longitude;
	let latitude = body.latitude;
	let distance = body.distance;
	res.json({ user: await userFacade.login(uName, password, longitude, latitude, distance) });
});

module.exports = router;
