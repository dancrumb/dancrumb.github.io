var tweetIDs = [];

function getTweets()
{
		$.getJSON("http://search.twitter.com/search.json?q=predevcamp&callback=?",
    			    handleTweets);
}

function handleTweets(data)
{
  /*
   * Results come in most-recent-first.
   * Need to reverse them since we prepend each tweet to the list
   */
   var tweets = data.results;
   tweets.reverse();
	 $.each(tweets, function(i,tweet){

      // First, see if this tweet already exists
      if(document.getElementById(tweet.id))
      {
         /*
          * Do Nothing
          */      
      }
      else
      {
          var tweetBox = makeTweetBox(tweet,"none");
          $("div#tweets").prepend(tweetBox);
          tweetIDs.unshift(tweet.id);
      }
          });
          
  displayTweets();
          
  setTimeout('getTweets()',10000);
}

function displayTweets()
{
   $("div.tweet:hidden:last").fadeIn("def",function(){displayTweets();});
   if(tweetIDs.length>20)
   {
       var tweetToDrop = tweetIDs.pop();
       $("div#"+tweetToDrop).fadeOut("slow",function(){$(this).remove();});
   }
}

function makeTweetBox(tweet,displaySetting)
{
	var tweetText = tweet.text;  
  if(typeof(displaySetting) == "undefined")
  {
    displaySetting = "none";
  }
  
  /*
   * Go through the tweet text
   *   convert @name to a link
   *   convert http://<url> to a link
   */
  var tweetWords = tweetText.split(' ');
  var modifiedWords = [];
  
  $.each(tweetWords, function(idx, tweetWord){
      if(tweetWord.charAt(0) == '@')
      {
        modifiedWords.push("<span class='tweetUser'><a href='http://www.twitter.com/"+tweetWord.substring(1)+"'>"+tweetWord+"</a></span>");
      }
      else if(tweetWord.substring(0,7) == 'http://')
      {
        modifiedWords.push("<span class='extLink'><a href='"+tweetWord+"'>"+tweetWord+"</a></span>");
      }
      else
      {
        modifiedWords.push(tweetWord);
      }
  });
  
  tweetText = modifiedWords.join(' ');
  
  tweetText += "<br><span class='tweetTime'>Tweeted at <em>"+tweet.created_at+"</em></span>";
  
  /*
   * Create the tweet box
   */
  var box = $("<div id='"+tweet.id+"' class='tweet'><div class='tweetText'>"+tweetText+"</span></div>");
  
  /*
   * Create the image of the sending user
   */
  var userImage=$("<img></img>");
  userImage.attr("src",tweet.profile_image_url);
  userImage.attr("alt","@"+tweet.from_user);
  userImage.attr("title","@"+tweet.from_user);
  
  var imgWrapper = $("<a class='userImage' href='http://www.twitter.com/"+tweet.from_user+"'></a>");
  imgWrapper.append(userImage);
  
  box.prepend(imgWrapper);
  box.css("display",displaySetting);
  
  return(box);
}

$(document).ready(getTweets);