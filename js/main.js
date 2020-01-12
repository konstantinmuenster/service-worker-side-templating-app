var API = "https://jsonplaceholder.typicode.com/posts/";
var path = window.location.pathname;
var template = document.getElementById("template").innerHTML;
var compiledTemplate = Handlebars.compile(template);
var target = document.getElementById("main");

function fetchAllPosts() {
  fetch(API)
  .then(function(res) {
    return res.json();
  })
  .then(function(data) {
    html = compiledTemplate(data);
    target.innerHTML += html;
  })
  .catch(function(err) {
    console.log(err);
  });
}

function fetchPost(id) {
  fetch(API + id) 
  .then(function(res) {
    return res.json()
  })
  .then(function(data) {
    html = compiledTemplate(data);
    target.innerHTML += html;
  })
  .catch(function(err) {
    console.log(err);
  });
}

  if (path.match(/^\/$/)) {
    // Home page shows a list of all posts
    fetchAllPosts()
  } else if (path.match(/\/post\//)) {
    // Post page shows individual post
    var postId = window.location.search.split("=")[1];
    fetchPost(postId);
  }