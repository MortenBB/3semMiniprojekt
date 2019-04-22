const mongoose = require('mongoose');
const expect = require('chai').expect;
var connect = require('../dbConnect.js');

var blogFacade = require('../facades/blogFacade');
var LocationBlog = require('../models/LocationBlog');
var User = require('../models/User');

describe('Testing the LocationBlog Facade', function() {
	/* Connect to the TEST-DATABASE */
	before(async function() {
		//this.timeout(require("../settings").MOCHA_TEST_TIMEOUT);
		await connect(require('../settings').TEST_DB_URI);
	});

	after(async function() {
		await mongoose.disconnect();
	});

	beforeEach(async function() {
		await LocationBlog.deleteMany({});
		await User.deleteMany({});
		users = await User.insertMany([
			{
				firstName: 'Kurt',
				lastName: 'Wonnegut',
				userName: 'kw',
				password: 'test',
				email: 'a@b.dk'
			},
			{
				firstName: 'Hanne',
				lastName: 'Wonnegut',
				userName: 'hw',
				password: 'test',
				email: 'b@b.dk'
			}
		]);
		blogs = await LocationBlog.insertMany([
			{
				info: 'This is a food blog, I hope you will like it ;)',
				img: 'applesAndWine.jpg',
				pos: {
					longitude: 55,
					latitude: 12
				},
				author: users[1]._id,
				likedBy: [users[1]._id]
			},
			{
				info: 'Welcome to my blog about football',
				img: 'kickoff.jpg',
				pos: {
					longitude: 55.123412,
					latitude: 12.230834
				},
				author: users[0]._id,
				likedBy: []
			}
		]);
	});

	it('Should find all locationBlogs (food and football)', async function() {
		var blogs = await blogFacade.getAllBlogs();
		expect(blogs.length).to.be.equal(2);
	});
	it('Should add another blog', async function() {
		pos = { latitude: 55, longitude: 12 };
		var l = await blogFacade.addBlog(
			'This is a blog about tests',
			'dab.jpg',
			pos,
			users[0]._id
		);
		expect(l).to.not.be.null;
		expect(l.info).to.be.equal('This is a blog about tests');
		var b = await blogFacade.getAllBlogs();
		expect(b.length).to.be.equal(3);
	});

	it('Should like one blog', async function() {
		var blogs = await blogFacade.getAllBlogs();
		await blogFacade.likeBlog(users[1], blogs[1]._id);
		var blogs = await blogFacade.getAllBlogs();
		expect(blogs[1].likedBy.length).to.be.equal(1);
	});
});
