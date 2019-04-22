var express = require('express');
var router = express.Router();
var blogFacade = require('../facades/blogFacade');

router.post('/addBlog', async function(req, res, next) {
	let body = req.body;
	let info = body.info;
	let img = body.img;
	let pos = body.pos;
	let author = body.author;
	let likedBy = [];
	let blog = await blogFacade.addBlog(info, img, pos, author, likedBy);
	res.json({ blog: blog });
});

router.post('/like', async function(req, res, next) {
	let body = req.body;
	let uId = body.userId;
	let bId = body.blogId;
	let blog = await blogFacade.likeBlog(uId, bId);
	res.json({ blog: blog });
});

module.exports = router;
