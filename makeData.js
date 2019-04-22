var connect = require("./dbConnect.js");
connect(require("./settings").DEV_DB_URI);

var User = require("./models/User.js");
var LocationBlog = require("./models/LocationBlog.js");
var Position = require("./models/Position.js");

function positionCreator(lon, lat, userId, dateInFuture) {
 var posDetail = { user: userId, loc: { coordinates: [lon, lat] } }
 if (dateInFuture) {
   posDetail.created = "2022-09-25T20:40:21.899Z"
 }
 return posDetail;
}

async function likeBlog(blogId, authorId){
  const p = await LocationBlog.findById(blogId); 
  if(p.likedBy.indexOf(authorId)>=0){
    throw  Error("You have already liked this blog");
  }
  p.likedBy.push(authorId);
  return p.save();
}

async function makeData() {
 console.log("Making users")
 try {
   var userInfos = [{firstName : "a",lastName : "a", userName :"a",password: "a",email:"a@a.dk",
    job : [{type: "t1",company: "c1", companyUrl : "url"},{type: "t1",company: "c1", companyUrl : "url"}]
   },
   {firstName : "b",lastName : "b", userName :"b",password: "a",email:"b@b.dk",job : [{type: "t1",company: "c1", companyUrl : "url"}] }
   ,
   {firstName : "c",lastName : "c", userName :"c",password: "c",email:"c@c.dk",job : [{type: "t1",company: "c1", companyUrl : "url"}]
   }
  ];
   await User.deleteMany({});
   await Position.deleteMany({});
   await LocationBlog.deleteMany({})
   //This will not activate the "save" midleware
   var users = await User.insertMany(userInfos);
   console.log(`${users.length} Users was created`);

   //This will activate the "save" midleware
   var u = new User({firstName : "Kurt",lastName : "Wonnegut", userName :"ckw",password: "c",email:"kw@c.dk"});
   await u.save();
   var positions = [positionCreator(10, 11, users[0]._id),positionCreator(11, 12, users[1]._id, true),
   ]
   await Position.insertMany(positions)
   var blogs = [{info:"Cool Place",pos:{longitude:26,latitude:57},author: users[0]._id},]
   var blogs = await LocationBlog.insertMany(blogs);
   
   //Test the like functionality (move this into a REAL test)
   var firstBlog = blogs[0];
   await likeBlog(firstBlog._id,users[1]._id);
   await likeBlog(firstBlog._id,users[2]._id);
   try{
     await likeBlog(firstBlog._id,users[1]._id)
   }
   catch(err){
     console.log("Shame on you !!!"+err)
   }
   //Find the blog with likes
   var blog = await LocationBlog.findById(firstBlog._id);
   console.log(`This blog should have two likes: ${blog.likedByCount}`);
 
 } catch (err) {
   console.log(err);
 }
}
makeData();
