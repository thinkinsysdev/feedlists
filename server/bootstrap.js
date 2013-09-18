// if the database is empty on server start, create some sample data.
var  url = Npm.require('url');
var parser = Meteor.require('ortoo-feedparser');

Meteor.startup(function () {
  
  var urls = [	'http://feeds.reuters.com/reuters/businessNews',
	'http://feeds.reuters.com/ReutersBusinessTravel',
	'http://feeds.reuters.com/news/artsculture',
	'http://feeds.reuters.com/reuters/topNews',
	'http://feeds.cnevids.com/mrss/wired.xml',
	'http://rss.cnn.com/rss/cnn_us.rss'];

Feeds.remove({});
urls.forEach(function(url)
{
  parser.parseUrl(url)
   .on('meta', Meteor.bindEnvironment(function(meta) {
        
        console.log(meta.title);
        Feeds.insert({url: url, title: meta.title, link: meta.link, date: meta.date, categories: meta.categories});   
   }, function(e) {throw e;}
   ));
});
  Posts.remove({});
  Lists.remove({});
  Todos.remove({});
  var feeds = Feeds.find({});
  if ( feeds.count() > 0)
  {
    feeds.forEach(function(feed) {
      console.log(feed.title);
      var list_id = Lists.insert({name: feed.title, url: feed.url});
   //   console.log(list_id);
      var count = 0;
      parser.parseUrl(feed.url)
       .on('article', Meteor.bindEnvironment(function (article) {
   //  console.log(list_id);  
     if(article.enclosures.length !== 0)
     {
    //  console.log(article.enclosures[0]); 
     }
     if (article.image.url)
     {
    // console.log(article.image.url);
     }
    //console.log(article.meta.link);
           var timestamp = (new Date()).getTime();
    Posts.insert(article, function(err, id)
                 {
                   if(!err)
                   {
             //        console.log('Post added:  ' + id);
                     count++ ;
              //       console.log('Count: ' +  count);
                    }
                 });
         
         Todos.insert({list_id: list_id, 
                       text: article.title,
                       timestamp: article.date,
                       tags: ['US News', 'World News'],
                       link: article.link,
                       summary: article.summary
                      });
                       
   }, function(e) { throw e;}))
   .on('end', function() {
      // console.log('Done with feed ' );
   });     
   
   });
   
  
  }
  
  
  
  



});            
    
                        
/*

Meteor.startup(function () {
var urls = [	'http://feeds.reuters.com/reuters/businessNews',
	'http://feeds.reuters.com/ReutersBusinessTravel',
	'http://feeds.reuters.com/news/artsculture',
	'http://feeds.reuters.com/reuters/topNews',
	'http://feeds.cnevids.com/mrss/wired.xml',
	'http://rss.cnn.com/rss/cnn_us.rss'];

Feeds.remove({});
urls.forEach(function(url)
{
  parser.parseUrl(url)
   .on('meta', Meteor.bindEnvironment(function(meta) {
        
        console.log(meta.title);
        Feeds.insert({url: url, title: meta.title, link: meta.link, date: meta.date, categories: meta.categories});   
   }, function(e) {throw e;}
   ));
});
});


Meteor.startup(function () {
  if (Lists.find().count() === 0) {
    var data = [
      {name: "Meteor Principles",
       contents: [
         ["Data on the Wire", "Simplicity", "Better UX", "Fun"],
         ["One Language", "Simplicity", "Fun"],
         ["Database Everywhere", "Simplicity"],
         ["Latency Compensation", "Better UX"],
         ["Full Stack Reactivity", "Better UX", "Fun"],
         ["Embrace the Ecosystem", "Fun"],
         ["Simplicity Equals Productivity", "Simplicity", "Fun"]
       ]
      },
      {name: "Languages",
       contents: [
         ["Lisp", "GC"],
         ["C", "Linked"],
         ["C++", "Objects", "Linked"],
         ["Python", "GC", "Objects"],
         ["Ruby", "GC", "Objects"],
         ["JavaScript", "GC", "Objects"],
         ["Scala", "GC", "Objects"],
         ["Erlang", "GC"],
         ["6502 Assembly", "Linked"]
         ]
      },
      {name: "Favorite Scientists",
       contents: [
         ["Ada Lovelace", "Computer Science"],
         ["Grace Hopper", "Computer Science"],
         ["Marie Curie", "Physics", "Chemistry"],
         ["Carl Friedrich Gauss", "Math", "Physics"],
         ["Nikola Tesla", "Physics"],
         ["Claude Shannon", "Math", "Computer Science"]
       ]
      }
    ];

    var timestamp = (new Date()).getTime();
    for (var i = 0; i < data.length; i++) {
      var list_id = Lists.insert({name: data[i].name});
      for (var j = 0; j < data[i].contents.length; j++) {
        var info = data[i].contents[j];
        Todos.insert({list_id: list_id,
                      text: info[0],
                      timestamp: timestamp,
                      tags: info.slice(1)});
        timestamp += 1; // ensure unique timestamp.
      }
    }
  }
});
*/