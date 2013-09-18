var fiber = Npm.require('fibers');
var Future = Npm.require('fibers/future');

if (Meteor.isServer) {
  

Meteor.methods({
  getFeed: function(text) {
    var listid = Meteor.call('doesFeedExist',text);
    if(listid)
    {
      console.log('Old List id found: ' + listid);
     return (listid);
    }
    else
    {
      var newlistid = Meteor.call('getFeedName', text);
      console.log('New list created: ' + newlistid);
      if(newlistid)
      {
          var articles= Meteor.call('getArticles',text, newlistid);
          return(newlistid);
       }
    }    
  },
  doesFeedExist: function(url) {
    var feedwithsameurl = Lists.findOne({url:url});
    if(feedwithsameurl)
    {
      return feedwithsameurl._id;
    }
    else
    {
       return false; 
    }
  },
  getFeedName: function(url) {
      var fut = new Future();
     var parser = Meteor.require('ortoo-feedparser');
    var feedwithsamelink = Lists.findOne({url:url});
    //console.log('Found Feed: ' + feedwithsamelink);
 
    console.log('In the feed name function');
   
    console.log(url);
       var feedid;
       var listid;
    parser.parseUrl(url)
    .on('meta',  Meteor.bindEnvironment(function(meta) {
        
        console.log(meta.title);
       feedid =   Feeds.insert({url: url, title: meta.title, link: meta.link, date: meta.date, categories: meta.categories});   
        listid = Lists.insert({url: url, name: meta.title});
      
        console.log(listid);        
        fut['return'](listid);
        }, function(e) {throw e;}
        ))
    .on('error', Meteor.bindEnvironment(function(err) {
      console.log('error returned: ' + err);
      throw ('Error ' + err);
    }, function(e) {throw e;}));
     
     
    
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