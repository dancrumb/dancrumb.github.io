---
layout: post
title: Making your tweets ReTweetable
date: 2010-03-02 17:57:32.000000000 -06:00
type: post
published: true
status: publish
categories:
- Javascript
- Programming
tags:
- greasemonkey
- Javascript
- twitter
meta:
  aktt_notify_twitter: 'yes'
  _edit_last: '1'
  aktt_tweeted: '1'
author:
  login: admin
  email: dancrumb@gmail.com
  display_name: dancrumb
  first_name: ''
  last_name: ''
---
![]({{ site.baseurl }}/assets/tweetMonkey.jpg "Twitter and Greasemonkey")

We all know, by now, that Twitter limits its tweets to 140 characters. We've all got pretty good at limiting ourselves to 140 characters, but many overlook a hidden limit. This post outlines what that is and how we can avoid it.

Many users of Twitters are hoping that their followers will retweet (RT) their tweets. Twitter recently made a change to how these work, but in general, the following pattern is followed:

<pre>   UserXYZ tweets: Hey... here's something that's fascinating
   UserABC tweets: RT @UserXYZ: Hey... here's something that's fascinating</pre>

User XYZ's tweet was 42 characters. UserABC's RT was 52 characters, i.e. 10 characters were added in order to RT.

Put another way, if UserXYZ creates a tweet that was longer than 130 characters, nobody would be able to RT it with modifying the original tweet. If you're trying to get a specific message out to the world, you might not be happy with lots of people fiddling with it.

I've created a new Greasemonkey script which will help you with this. I've written about Greasemonkey plugins [before](/2009/02/15/augmenting-twitter-whoami/) and this is another Twitter helper. If you install the script, you will see the following change:

[![]({{ site.baseurl }}/assets/retweetable_screenshot1.png "retweetable_screenshot")](/wp-content/uploads/2010/03/retweetable_screenshot1.png)

You can now see, next to the normal character countdown, a bracketed countdown. This is the number of characters that you have left, before a tweet can no longer be RTed without modification. In this example, you would be able to send the tweet (as you have 6 characters left), but Twitter users would have to remove 8 characters before they could RT your Tweet.

To use this, it's simple:

1.  If you haven't already, install [Greasemonkey](https://addons.mozilla.org/en-US/firefox/addon/748)
2.  Install the [ReTweetable Alert](/gmScripts/reTweetable.user.js) script

That's it! As ever, your questions and comments are most welcome
