var mongoose = require('mongoose');
var User = require('../models/User');
var Position = require('../models/Position');

async function getAllUsers() {
	return User.find({}).exec();
}

async function addUser(firstName, lastName, userName, password, email) {
	var u = new User({
		firstName: firstName,
		lastName: lastName,
		userName: userName,
		password: password,
		email: email
	});
	return await u.save();
}

async function findByUsername(username) {
	return await User.findOne({ userName: username }).exec();
}

async function findById(id) {
	return await User.findById({ _id: id }).exec();
}

async function login(username, password, longitude, latitude, distance) {
	let user = await findByUsername(username);
	console.log(user);
	if (user === null || user.password != password) {
		return { msg: 'Wrong username or password', status: 403 };
	}
	let coordinates = [longitude, latitude];
	await Position.findOneAndUpdate(
		{ user: user._id },
		{ user, created: Date.now(), loc: { type: 'Point', coordinates } },
		{ upsert: true, new: true }
	).exec();
	const friendsPositions = await findFriends(coordinates, distance);
	return {
		friends: friendsPositions.map(friendPos => {
			return {
				username: friendPos.user.userName,
				latitude: friendPos.loc.coordinates[1],
				longitude: friendPos.loc.coordinates[0]
			};
		})
	};
}

async function findFriends(coordinates, distance) {
	return await Position.find({
		loc: {
			$near: {
				$geometry: { type: 'Point', coordinates },
				$minDistance: 0.01,
				$maxDistance: distance
			}
		}
	})
		.populate('user')
		.exec();
}

module.exports = {
	getAllUsers,
	addUser,
	findByUsername,
	findById,
	login
};
