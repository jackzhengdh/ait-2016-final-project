var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var passport = require('passport');
var User = mongoose.model('User');
var Image = mongoose.model('Image');
var ImagePost = mongoose.model('ImagePost');

/* GET */
router.get('/', function(req, res) {
	res.render('index', { user: req.user });
});

/* GET log in */
router.get('/login', function(req, res) {
	res.render('login');
});

/* GET image posts */
router.get('/image-posts', function(req, res, next) {
	if (req.user) {
		res.redirect('/image-posts/' + req.user.username);
	}
	else {
		res.render('index', { user: req.user });    
	}
});

/* POST login */
router.post('/login', function(req,res,next) {
	passport.authenticate('local', function(err,user) {
		if(user) {
			req.logIn(user, function(err) {
				res.redirect('/image-posts/' + user.username);
			});
		} else {
			res.render('login', 
				{message:'Your login or password is incorrect.'});
		}
	})(req, res, next);
});

/* GET register */
router.get('/register', function(req, res) {
	res.render('register');
});

/* POST register */
router.post('/register', function(req, res) {
	User.register(new User({username:req.body.username}), 
			req.body.password, function(err, user){
		if (err) {
			res.render('register', 
				{message:'Your username or password is already taken'});
		} else {
			passport.authenticate('local')(req, res, function() {
				res.redirect('/image-posts/' + req.user.username);
			});
		}
	});   
});

/* GET user-specific image posts */
router.get('/image-posts/:username', function(req, res) {

	// populate imagePosts and images
	User
	.findOne({username: req.params.username})
	.populate({
		path: 'imagePosts',
		model: 'ImagePost',
		populate: {
			path: 'images',
			model: 'Image'
		}
	})
	.exec(function(err, user) {
		var showForm = !!req.user && req.user.username == user.username;
		res.render('users', {
			showForm: showForm,
			user: user,
			req: req
		})
	});
});

/* POST create image posts */
router.post('/image-post/create', function(req, res) {
	if (req.user) {
		ImagePost.findOne({title: req.body.title}, function(err, newPost) {
			// check if an image post by this title already exist in database
			var pushPost = true;
			if (newPost) {
				pushPost = false;
			}
			else {
				newPost = new ImagePost({
					title: req.body.title,
					user: req.user._id
				});
			}

			// add all images to post, if image has url
			for (var i = 1; i < 4; i++) {
				var newURL = req.body['url-' + i];

				if (newURL !== undefined && newURL.length !== 0) {
					var newImage = new Image({
						url: req.body['url-' + i],
						caption: req.body['caption-' + i]
					});
					newImage.save(function(err) {
						
					});
					newPost.images.push(newImage._id);
				}
			}

			// only save image post if it contains a title
			if (newPost.title !== undefined && newPost.title.length !== 0) {
				newPost.save(function(err, savedPost, count) {
					if (err) res.send(err);
				});

				if (pushPost) {
					req.user.imagePosts.push(newPost._id);		 
					req.user.save(function(err, savedUser, count) {
						if (err) res.send(err);
					});          
				}
			}
			res.redirect('/image-posts');
		});
	}
	else {
		res.render('index', { user: req.user });    
	}
});

/* GET individual image post page */
router.get('/image-posts/:username/:slug', function(req, res, next) {
	
	// populate imagePosts and images	
	User
	.findOne({username: req.params.username})
	.populate({
		path: 'imagePosts',
		model: 'ImagePost',
	})
	.exec(function(err, user) {
		ImagePost
		.findOne({slug: req.params.slug})
		.populate({
			path: 'images',
			model: 'Image'
		})
		.exec(function(err, post) {
			if (err) res.send(err);
			var showForm = !!req.user && req.user.username == user.username;
			console.log(showForm);
			res.render('images', {
				showForm: showForm,
				post: post,
				user: user,
				req: req
			});
		});
	});
});

/* POST individual image post page for adding new image */
router.post('/image-posts/:username/:slug/add', function(req, res, next) {

	// if the user is logged out, redirect to /image-posts
	if (req.user.username !== req.params.username) {
		res.redirect('../image-posts');
	}

	// populate imagePosts and images
	User
	.findOne({username: req.params.username})
	.populate({
		path: 'imagePosts',
		model: 'ImagePost',
	})
	.exec(function(err, user) {
		ImagePost
		.findOne({slug: req.params.slug})
		.populate({
			path: 'images',
			model: 'Image'
		})
		.exec(function(err, post) {

			// add all images to post, if image has url
			
			var newURL = req.body['url'];

			if (newURL !== undefined && newURL.length !== 0) {
				var newImage = new Image({
					url: newURL,
					caption: req.body['caption']
				});
				newImage.save(function(err) {
					
				});
				post.images.push(newImage._id);
				post.save(function(err) {
					if (err) res.send(err);
				})
			}
			res.redirect(
				'/../image-posts/' + req.params.username + '/' + post.slug);
		});	
	});
});

/* POST individual iamge post page for delete image(s) */
router.post('/image-posts/:username/:slug/delete', function(req, res, next) {
	
	// if the user is logged out, redirect to /image-posts
	if (req.user.username !== req.params.username) {
		res.redirect('../image-posts');
	}

	// populate imagePosts and images
	User
	.findOne({username: req.params.username})
	.populate({
		path: 'imagePosts',
		model: 'ImagePost',
	})
	.exec(function(err, user) {
		ImagePost
		.findOne({slug: req.params.slug})
		.populate({
			path: 'images',
			model: 'Image'
		})
		.exec(function(err, post) {
	
			// if multiple images are selected - array
			if (Array.isArray(req.body.idList)) {
				req.body.idList.forEach(function(id) {
					for (var i = 0; i < post.images.length; i++) {
						if (post.images[i]._id == id) {
							post.images.splice(i, 1);
							i--;
							// post.images[i].id(id).remove();
						}
					}
				});
			}

			// only one image is selected - string
			else {
				for (var i = 0; i < post.images.length; i++) {
					if (post.images[i]._id == req.body.idList) {
						post.images.splice(i, 1);
						i--;
						// post.images[i].id(id).remove();
					}
				}
			}
			post.save(function(err) {
				if (err) res.send(err);
			});   

			res.redirect(
				'/../image-posts/' + req.params.username + '/' + post.slug);
		});
	});	
})

module.exports = router;
