function getBlogs() {
	$("#blogPosts").html("");
	fetch("https://immense-mesa-55206.herokuapp.com/blog-posts")
	.then(response => {
		if(response.ok) {
			return response.json();
		} 
		throw new Error(res.statusText);
	})
	.then(responseJSON => {
		for(let i = 0; i < responseJSON.length; i++) {
			$("#blogPosts").append(`
				<li>
				<h2> ${responseJSON[i].title} </h2>
				<p> ${responseJSON[i].content} </p>
				<p> Author: ${responseJSON[i].author} </p>
				<p> Published date: ${responseJSON[i].publishDate} </p>
				<p> ID: ${responseJSON[i].id} </p>
				</li>`);
		}
	})
	.catch(error => {
		console.log(error);
	});
}

function postBlog(title, content, author, date) {
	let data = {
		title : title,
		content : content,
		author : author,
		publishDate : date 
	}
	let settings = {
		method: "post",
		headers: {
			'Content-Type': 'application/json'
		},
		body: JSON.stringify(data)
	}

	fetch("http://localhost:8080/blog-posts", settings)
	.then(response => {
		if(response.ok) {
			return response.json();
		} 
		throw new Error(response.statusText);
	})
	.then(responseJSON => {
		console.log(responseJSON);
		$("#postTitle").val("");
		$("#postContent").val("");
		$("#postAuthor").val("");
		$("#postDate").val("");
		getBlogs();
	})
	.catch(error => {
		console.log(error);
	});
}

function updateBlog(id, title, content, author, date) {
	let body = {
		id: id,
		title: title != "" ? title : undefined,
		content: content != " " ? content : undefined,
		author: author != "" ? author : undefined,
		publishDate: date != "" ? date : undefined
	}
	let settings = {
		method: "put",
		headers: {
			'Content-Type' : 'application/json'
		},
		body: JSON.stringify(body)
	}
	fetch("http://localhost8080/blog-posts?id=" + id, settings)
	.then(response => {
		if(response.ok) {
			return response.json();
		}
		throw new Error(response.statusText);
	})
	.then(responseJSON => {
		console.log(responseJSON);
		$("#updateId").val("");
		$("#updateTitle").val("");
		$("#updateContent").val("");
		$("#updateAuthor").val("");
		$("#updateDate").val("");
		getBlogs();
	})
	.catch(error => {
		console.log(error);
	})
}

function deleteBlog(id) {
	let settings = {
		method : "delete"
	}
	fetch("/api/blog-posts?id=" + id, settings)
	.then(response => {
		if(response.ok){
			return response.json();
		}
		throw new Error(response.statusText);
	})
	.then(responseJSON => {
		console.log(responseJSON);
		$("#deleteId").val("");
		getBlogs();
	})
	.catch(error => {
		console.log(error);
	})
}

function init() {

	getBlogs();
	$("#postButton").on("click", function(event) {
		event.preventDefault();
		let title = $("#postTitle").val();
		let content = $("#postContent").val();
		let author = $("#postAuthor").val();
		let date = $("#postDate").val();

		postBlog(title, content, author, date);
	});

	$("#updateButton").on("click", function(event) {
		event.preventDefault();
		let id = $("#updateId").val();
		let title = $("#updateTitle").val();
		let content = $("#updateContent").val();
		let author = $("#updateAuthor").val();
		let date = $("#updateDate").val();
		updateBlog(id,title,content,author,date);
	});

	$("#deleteButton").on("click", function(event) {
		event.preventDefault();
		let deleteId = $("#deleteId").val();
		deleteBlog(deleteId);
	});
}

init();