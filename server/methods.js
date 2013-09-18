var fiber = Npm.require('fibers');
var Future = Npm.require('fibers/future');

if (Meteor.isServer) {
  

Meteor.methods({
  getFeed: function(text) {
    getFeedName(text, function(err,result) {
      
    });
  },
  getFeedName: function(url) {
     var fut = new Future();
     var parser = Meteor.require('ortoo-feedparser');
    console.log(url);
      /* This should work for any async method
      setTimeout(function() {
      
        // Return the results
        fut['return'](url + " (delayed for 3 seconds)");

      }, 15 * 1000);
        */
    parser.parseUrl(url)
    .on('meta',  Meteor.bindEnvironment(function(meta) {
        
        console.log(meta.title);
       var feedid = Feeds.insert({url: url, title: meta.title, link: meta.link, date: meta.date, categories: meta.categories}); 
       
        var listid = Lists.insert({name: meta.title});
        
        fut['return'](listid);
        }, function(e) {throw e;}
        ))
    .on('error', function(err) {
      console.log('error returned: ' + err);
      fut['return'] ('error returned ' + err);
    });
    
    
      // Wait for async to finish before returning
      // the result
      return fut.wait();
      
    
    
    },
  getArticles: function(url, list_id) {
        var fparser = Meteor.require('ortoo-feedparser');
        fparser.parseUrl(url)
        .on('error', function(e) {throw e; })
        .on('article', Meteor.bindEnvironment(function(article) {
          Posts.insert(article, function(err, id)
                 {
                   if(!err)
                   {
             //        console.log('Post added:  ' + id);
                  //   count++ ;
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
          
        }, function(e) {throw e; }));
  },
  insertFeedName: function(feedmeta) {
      
  }
  });
  
}