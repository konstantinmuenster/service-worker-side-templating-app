var API = "https://jsonplaceholder.typicode.com/posts";
var path = window.location.pathname;

function fetchAllPosts() {
  fetch(API)
    .then(function(res) {
      return res.json();
    })
    .then(function(data) {
      var template = Handlebars.templates.index;
      html = template(data);
      document.getElementById("output").innerHTML = html;
    })
    .catch(function(err) {
      console.log(err);
    });
}

function fetchPost(id) {
  fetch(API + "/" + id)
    .then(function(res) {
      return res.json();
    })
    .then(function(data) {
      var template = Handlebars.templates.post;
      html = template(data);
      document.getElementById("output").innerHTML = html;
    })
    .catch(function(err) {
      console.log(err);
    });
}

if (path.match(/^\/$/)) {
  fetchAllPosts();
} else if (path.match(/\/post\//)) {
  var url = new URL(window.location);
  var postId = url.searchParams.get("id");
  fetchPost(postId);
}

if ("serviceWorker" in navigator) {
  window.addEventListener("load", function() {
    navigator.serviceWorker.register("/sw.js");
  });
}
