var mongoose = require('mongoose');
var LocationBlog = require('../models/LocationBlog');

function getAllBlogs() {
	return LocationBlog.find({}).exec();
}

async function addBlog(info, img, pos, author, likedBy) {
	var l = new LocationBlog({ info: info, img: img, pos: pos, author: author, likedBy: likedBy });
	return await l.save();
}

async function likeBlog(user, id) {
	var l = await LocationBlog.findOne({ _id: id }).exec();
	l.likedBy.push(user._id);
	return await l.save();
}

module.exports = {
	getAllBlogs,
	addBlog,
	likeBlog
};
