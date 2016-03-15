---
layout: post
title: Global Tweeting about the Pre
date: 2009-03-03 17:55:44.000000000 -06:00
type: post
published: true
status: publish
categories:
- Javascript
- preDevCamp
- Programming
tags:
- google maps
- Javascript
- preDevCamp
- twitter
meta:
  _edit_last: '1'
author:
  login: admin
  email: dancrumb@gmail.com
  display_name: dancrumb
  first_name: ''
  last_name: ''
---
![]({{ site.github.url }}/assets/twitterGlobe.jpg "Twitter around the globe")

The other day, the preDevCamp team published our 'PreView' map at [<del datetime="2012-12-11T03:42:21+00:00">http://predevcamp.org/preView.html</del>](http://predevcamp.org/preView.html "This link is now defunct"). In this post, I'll talk about how it was put together.

PreView is a combination of the Google Maps API and the Twitter API. Without wanting to shatter the mystique, I'm going to outline how I set about creating PreView.  

First, take a look at the HTML in [<del datetime="2012-12-11T03:42:21+00:00">preView.html</del>](http://predevcamp.org/preView.html "This link is now defunct"). When you strip out the preDevCamp menu and Twitter Bird, you're left with:

```html

<title>preView - Global Twitter interest in preDevCamp, Palm Pre and webOS</title>
<link rel="stylesheet" type="text/css" href="/css/preView.css">

<div id="tweetAPI">Checking Twitter API</div>

<div id="preViewMap">Loading Google Map</div>

```

As you can see, the BODY of the page is exceptionally simple; just two DIVs with ids set and some basic content. All the hard work is done by the Javascript in the HEAD of the page. So how does it all work? The 'preView.js' script creates an object called PreView which pulls together jQuery, Google Maps and Twitter.

## jQuery

[jQuery](http://jquery.com/) is a library that extends the Javascript language and makes it easier to perform Web 2.0 functionality in a way that works independent of your users' browsers. You can find good tutorials on jQuery all over the Internet and the docs are pretty good too, with lots of examples. One thing that I discovered the hard way is that your CSS links **must** appear before loading jQuery or else you can find you have problems when you try to access CSS properties in later code. For the life of me, I can't figure out why this is so, but that's how it works.

Other people might say Prototype or YUI. I haven't used either of those, so I can't comment, but I will be learning Prototype soon, since it underpins a lot of the [webOS](/javascript/predevcamp/programming/2009/02/18/what-have-we-learned-about-webos.html) language.

## Google Maps

The next step is to create your map. I used the [Google Maps API](http://code.google.com/apis/maps/) for this. To access the API, you need to get a key from Google. This allows them to track how people are using their API and who is making requests. Your API key is associated with a specific domain, so for preDevCamp, we need 3 keys; one for '.com', one for '.org' and one for '.net'.

In addition to pulling in the Google Maps API, we used the Marker Manager for handling all of those little Palm Pres dotted over the map. The Marker Manager improves performance of map panning by only drawing the Pres that are currently visible. As preDevCamp grows, we're going to have more and more Pres on the map, so this will get more an more important.

Once the API is loaded, you have access to all of the Google Maps commands. The API documentation is the best place to go to understand what each object does, but here's a breakdown of what PreView does:

1.  Locate the destination DIV for the Google Map
2.  Create the GMap2 object and associate it with this DIV
3.  Add a small Zoom control
4.  Centre the map on 50n,0E. This is in the English channel, directly south of London. There's no great geographical significance of this point, but it makes for a map that feels reasonably centered, with regard to land masses.
5.  Set the map to a Physical map instead of a Satellite Image map
6.  Create a new Marker Manager and associate it with the map
7.  Make a JSONP call to the preDevCamp website requesting the location of all the preDevCamps. This returns an array of JS objects, each containing the Name, Longitude and Latitude of each preDevCamp city (see geocoding below)

That's it for creating the map!

### Geocoding

Geocoding is the transformation of an address of some sort into a latitude and longitude. Google Maps provides a geocoding interface and you can translate addresses on the fly if you need to. However, the geocoding service is rate limited and if you request too many, too quickly, your requests will get rejected. In addition to this, it takes a certain amount of time to send the request and get a response. As a result, the geocoding results have been cached on the preDevCamp server and are taken from there. This also allows us to handle ambiguous locations, such as "Washington" or "Charleston", which could refer to a number of locations. Since we know which city each preDevCamp is in, we can add special handling for cities such as these.

That said, the geocoding service is used to find the Latitude and Longitude of Twitter users, based on their reported location.

## Twitter API

Once the map is created, all that remains is to query Twitter for relevant Tweets. Like the Google Maps API, the [Twitter API](http://apiwiki.twitter.com/) is really well documented. They actually have 2 APIs. One is for searching the Twitter public time line, the other is for interacting more explicitly with Twitter. One thing to note is that the Twitter API is also rate limited. You're restricted to 100 API requests per hour, unless you get a special dispensation from Twitter.

So, the first step PreView takes is to find out how many API requests are available. It also checks to see when this limit will be reset and will use that later on, if the limit is exceeded

PreView continues by sending out searches for 'predevcamp', 'webos' and 'palm pre'. Each of these requests generates a list of Tweet objects which are put onto a central list which sorts by each Tweet's ID. The ID is globally unique. At this point, PreView does not filter duplicated Tweets, but a future version will.

The next step is to go through the list one at a time and display the Tweet on the map. In order to do this, we take the location property of the Tweet and send it to the Google Geocoding Service. Although this Service is rate limited, we only show Tweets once every 8 seconds or so, so we're not going to hit the rate limit that Google sets. _However_, asking Twitter where a user is located, **does** count against our Twitter API usage, so we make sure to cache users' locations to prevent the limit from being gobbled up.

If the user's location does not translate, we put the Tweet somewhere in the middle of the Pacific Ocean. There may be a better way to indicate that Tweet cannot be located but, again, that is deferred to version 2.0.

Once all of the Tweets in the list have been shown, we send a second request to the Twitter Search API. Twitter has a neat trick to help us here. When we send a search request , Twitter gives us a list of Tweets as well as a URL that we can use later which essentially says: "Show us the Search Results starting from where we left off in the last search". This means we don't need to filter for Tweets that we've already seen.

## Summary

Hopefully, that's given you an overview of what I sought to achieve with the preView map. By looking through the [<del datetime="2012-12-11T03:42:21+00:00">source code</del>](http://predevcamp.org/js/preView.js "This link is now defunct") and reading this post, you should be able to see what it takes to make something like this. The astute of you will also see areas where preView could be improved and, when I have time, I'll be taking a second run at it. However, for now, I hope that it proves to be an instructive read!
