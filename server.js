
let express = require("express");
let morgan = require("morgan");
let mongoose = require("mongoose");
let bodyParser = require("body-parser");
const uuid = require('uuid/v4');

let { PostList } = require('./blog-post-model.js');
const { DATABASE_URL, PORT } = require( './config' );

let app = express();
let jsonParser = bodyParser.json();
mongoose.Promise = global.Promise;

app.use( express.static( "public" ) );

app.use( morgan( "combined" ) );

let posts = [{
	id: uuid(),
	title: "Post 1",
	content: "This is the first post of the day!",
	author: "George",
	publishDate: Date
},
{
	id: uuid(),
	title: "Post 2",
	content: "This is the second post of the day!",
	author: "Stevie",
	publishDate: Date
},
{
	id: uuid(),
	title: "Post 3",
	content: "This is the third and final post of the day!",
	author: "Jay-Z",
	publishDate: Date
}
];

app.get("/blog-posts", (req, res, next) => {
	PostList.get()
	.then( posts => {
			return res.status( 200 ).json( posts );
		})
		.catch( error => {
			res.statusMessage = "Something went wrong with the DB. Try again later.";
			return res.status( 500 ).json({
				status : 500,
				message : "Something went wrong with the DB. Try again later."
			})
		});
});

app.get("/blogpost", (req, res, next) => {
	let author = req.query.author
	if (!author) {
		return res.status(406).json({message : "Missing author in params",status : 406});
	}

	PostList.getByAuthor(author)
		.then(post => {
			if ( post ){
				return res.status( 202 ).json({
					message : "Post found in the list",
					status : 202,
					post : post
				});
			}
			else{
				res.statusMessage = "Post not found in the list.";

				return res.status( 404 ).json({
					message : "Post not found in the list.",
					status : 404
				});
			}
		})
		.catch( err => {
			res.statusMessage = "Something went wrong with the DB. Try again later.";
			return res.status( 500 ).json({
				status : 500,
				message : "Something went wrong with the DB. Try again later."
			})
		})
});

app.post("/blog-posts", jsonParser, (req,res) => {
	let id = uuid();
	let title = req.body.title;
	let content = req.body.content;
	let author = req.body.author;
	let publishDate = req.body.publishDate;

	let newPost = {
		id,
		title,
		content,
		author,
		publishDate
	}

	PostList.post(newPost)
		.then( post => {
			return res.status( 201 ).json({
				message : "Post added to the list",
				status : 201,
				post : post
			});
		})
		.catch( error => {
			res.statusMessage = "Something went wrong with the DB. Try again later.";
			return res.status( 500 ).json({
				status : 500,
				message : "Something went wrong with the DB. Try again later."
			});
		});
});

app.delete("/blog-post/:id", (req, res) => {
    // Does the id exist?
    let deleteId = req.params.id;
    PostList.delete(deleteID)
    	.then(() => {
    		return res.status(200).json({message: "Deletion was successful"});
    	})
    	.catch(error => {
    		res.statusMessage = error;
    		return res.status(404).json({message: res.statusMessage});
    	})
});

app.put("/blog-posts", (req,res) => {
	let paramId = req.params.id;
	let id = req.body.id;
	let title = req.body.title;
	let content = req.body.content;
	let author = req.body.author;
	let publishDate = req.body.publishDate;
	if ( ! id ){
		res.statusMessage = "Missing id in body!";
		return res.status(406).json({
			message : "Missing field in body!",
			status : 406
		});
	}

	let updatedPost = {id : id};

	if(title) updatedPost.title = title;
	if(content) updatedPost.content = content;
	if(author) updatedPost.author = author;
	if(publishDate) updatedPost.publishDate = publishDate;

	PostList.put(updatedPost)
		.then( post => {
			res.status(200).json({
				message : "Successfully updated the student",
				status : 200,
				post : post
			});
		})
		.catch( err => {
			if( err.message == 404 ) {
				return res.status(404).json({
					message: "Post not found in the list",
					status: 404
				});
			}
			else{
				res.statusMessage = "Something went wrong with the DB. Try again later.";
				return res.status( 500 ).json({
					status : 500,
					message : "Something went wrong with the DB. Try again later."
				})
			}
		});
});

let server;

function runServer(port, databaseUrl){
	return new Promise( (resolve, reject ) => {
		mongoose.connect(databaseUrl, response => {
			if ( response ){
				return reject(response);
			}
			else{
				server = app.listen(port, () => {
					console.log( "App is running on port " + port );
					resolve();
				})
				.on( 'error', err => {
					mongoose.disconnect();
					return reject(err);
				})
			}
		});
	});
}

function closeServer(){
	return mongoose.disconnect()
		.then(() => {
			return new Promise((resolve, reject) => {
				console.log('Closing the server');
				server.close( err => {
					if (err){
						return reject(err);
					}
					else{
						resolve();
					}
				});
			});
		});
}

runServer( PORT, DATABASE_URL )
	.catch( err => {
		console.log( err );
	});

module.exports = { app, runServer, closeServer };