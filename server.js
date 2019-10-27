
let express = require("express");
let morgan = require("morgan");
let bodyParser = require("body-parser");
const uuid = require('uuid/v4');

let app = express();

let jsonParser = bodyParser.json();

app.use(express.static('public'));
app.use(morgan("combined"));

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
	return res.status(200).json(posts);
});

app.get("/blogpost", (req, res, next) => {
	console.log(req.query.author);
	if (!req.query.author) {
		return res.status(406).json({message : "Missing author in params",status : 406});
	}
	for (var i = posts.length - 1; i >= 0; i--) {
		if(posts[i].author === req.query.author) {
			return res.status(202).json(posts[i]);
		}
	}
	return res.status(404).json({message: "not found author in list"});
});

app.post("/blog-posts", jsonParser, (req,res) => {
	let id = uuid();
	let title = req.body.title;
	let content = req.body.content;
	let author = req.body.author;
	let publishDate = req.body.publishDate;

	console.log(req.body);
	if ( !title || !content || !author || !publishDate ){
		res.statusMessage = "Missing field in body!";
		return res.status(406).json({
			message : "Missing field in body!",
			status : 406
		});
	}
	posts.push({
		id: id,
		title: title,
		content: content,
		author: author,
		publishDate: publishDate
	});
	return res.status(201).json(posts);
});

app.delete("/blog-post/:id", (req, res) => {
    // Does the id exist?
    let deleteId = req.params.id;

    // Delete the post with the given id
    let length = posts.length;
    posts = posts.filter(p => p.id != deleteId);

    if(pLength == posts.length) {
    	res.statusMessage = "Could not find id in posts";
    	return res.status(404).json({message: res.statusMessage});
    }

    return res.status(200).json({message: "Deletion was successful"});
});

app.put("/blog-posts/:id", (req,res) => {
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
	if (id !== paramId) {
		return res.status(404).json({
			message : "id in body not match with params",
			status : 406
		});
	}
	posts.foreach(function(post) {
		if (post.id === id) {
			if (title) post.title = title;
			if (content) post.content = content;
			if (author) post.author = author;
			if (publishDate) post.publishDate = publishDate;
			return res.status(200).json({message : "succesful update"});
		}
	});
});


app.listen("8080", () => {
	console.log("App is running on port 8080");
});