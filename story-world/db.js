var mongoose = require('mongoose');
var URLSlugs = require('mongoose-url-slugs');
var passportLocalMongoose = require('passport-local-mongoose');
var User = new mongoose.Schema({
	username: String,
	imagePosts: [{ type: mongoose.Schema.Types.ObjectId, ref: 'ImagePost' }]
});

var Image = new mongoose.Schema({
	imagePost: {type: mongoose.Schema.Types.ObjectId, ref:'ImagePost'},
	url: {type: String, required: true},
	caption: {type: String}
});

var ImagePost = new mongoose.Schema({
	title: String,
	user: {type: mongoose.Schema.Types.ObjectId, ref:'User'},
	images: [{type: mongoose.Schema.Types.ObjectId, ref:'Image'}]
})

ImagePost.plugin(URLSlugs('title'));
User.plugin(passportLocalMongoose);
mongoose.model('User', User);
mongoose.model('Image', Image);
mongoose.model('ImagePost', ImagePost);




// is the environment variable, NODE_ENV, set to PRODUCTION? 
if (process.env.NODE_ENV == 'PRODUCTION') { 
	// if we're in PRODUCTION mode, then read the configration from a file 
	// use blocking file io to do this... 
	console.log("test production mode");
	var fs = require('fs'); 
	var path = require('path'); 
	var fn = path.join(__dirname, 'config.json'); 
	var data = fs.readFileSync(fn); 
	// our configuration file will be in json, so parse it and set the 
	// conenction string appropriately! 
	var conf = JSON.parse(data); 
	var dbconf = conf.dbconf; 
} 
else { // if we're not in PRODUCTION mode, then use 
	dbconf = 'mongodb://localhost/ait-final';
}


mongoose.connect(dbconf);
