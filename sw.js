importScripts('./js/handlebars.min.js');
importScripts('./templates/post.precompiled.js');

var CACHE_NAME = 'cache-v1';
var urlsToCache = [
  '/',
  '/templates/index.precompiled.js',
  '/post/',
  '/templates/post.precompiled.js',
  '/css/style.css',
  '/js/handlebars.min.js',
  '/js/main.js',
  'https://jsonplaceholder.typicode.com/posts'
];

self.addEventListener('install', function(event) {
  console.log("Service Worker Registration", event)
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(function(cache) {
        return cache.addAll(urlsToCache);
      })
      .catch(function(err) {
        return console.log(err);
      })
  );
});

self.addEventListener('fetch', function(event) {
  console.log("Fetch Event | From: " + event.request.referrer + ", To: " + event.request.url);
  var requestURL = new URL(event.request.url);

  if (/^\/post\//.test(requestURL.pathname)) {
    event.respondWith(
      Promise.all([
        caches.match('/post/', {ignoreSearch: true}).then(function(response) {
          return response.text();
        }),
        caches.match('https://jsonplaceholder.typicode.com/posts').then(function(response) {
          return response.json();
        })
      ]).then(function(responses) {
        var html = responses[0];
        var data = responses[1];
        var postData = data.find(x => x.id == requestURL.searchParams.get("id"));
        var template = Handlebars.templates.post;
        var postHtml = template(postData);
        var finalHtml = html.replace('<div id="output"></div>', postHtml);
        return new Response(finalHtml, {headers: {'content-type': 'text/html'}});
      })
    )
  } else {
    event.respondWith(
      caches.open(CACHE_NAME).then(function (cache) {
        return cache.match(event.request).then(function (response) {
          return response || fetch(event.request).then(function (response) {
            cache.put(event.request, response.clone());
            return response;
          });
        });
      })
    )
  }
  
});