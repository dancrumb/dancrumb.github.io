---
layout: post
title: Build your own TwitterFeed
date: 2009-02-03 02:04:14.000000000 -06:00
type: post
published: true
status: publish
categories:
- Home
- Javascript
- preDevCamp
tags:
- ajax
- Javascript
- json
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
As part of the [preDevCamp 2009](http://predevcamp.org) site, I created a JavaScript TwitterFeed today.

A sample [can be seen here](/twitterTest.html). If you leave this page open, it will constantly update with all Twitter tweets that contain the word 'twitter'. It will update once every 5 seconds and will contain no more than the 25 most recent tweets.

Installing this code into a page of your own is very simple. You will need the following:

*   jQuery must be installed and you must include it in your webpage
*   tweetFeed.js must be included in your webpage
*   tweetFeed.css should be included, although the function **will** work without this file
*   A <div> with an id of 'tweets' somewhere on the page

With all of those in place, it's a simple case of instantiating the feed:

`var tf = new TweetFeed(searchString,feedPeriod,feedLength);`

<dl>

<dt>searchString</dt>

<dd>This is the string that is used to generate the feed. The feed will contain all tweets containing this word</dd>

<dt>feedPeriod</dt>

<dd>Number of seconds between each refresh of the feed</dd>

<dt>feedLength</dt>

<dd>Maximum number of tweets to show. At the moment, this must be > 15 or else the feed doesn't work properly.</dd>

</dl>

All of the relevant code can be found by looking at the example, linked to above. Feel free to use this in any way you like. Comments are welcome
