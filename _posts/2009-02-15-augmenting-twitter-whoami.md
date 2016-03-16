---
layout: post
title: Augmenting Twitter - WhoAmI?
date: 2009-02-15 15:05:29.000000000 -06:00
type: post
published: true
status: publish
categories:
- Home
- Javascript
tags:
- greasemonkey
- Javascript
- script
- twitter
---
![]({{ site.github.url }}/assets/tweetMonkey.jpg "Twitter meets GreaseMonkey")

Like a fair number of people, I have a number of Twitter identities. I have my personal identity ([@dancrumb](http://twitter.com/dancrumb)) as well as a number of shared identities that represent events or organizations in which I'm involved.

I use a number of clients to send out tweets, but all of these clients limit you to a single identity. If you want to user twitter.com to send out messages, you need to log in with the appropriate identity before you perform any Twitter functions.

Herein lies the problem. When you're logged in to Twitter and you navigate to somebody's Twitter page, there is no indication as to who you're logged in as. The risk is that you could elect to follow or message someone, thinking you're logged in as one identity, only to find that you're logged in as another identity. I did precisely this, yesterday. As luck would have it, the person was my sister and I quickly spotted my mistake, but if  you're using Twitter as a major communication channel, you need to be **very** aware of which identity you're tweeting with.

In order to address this, I've written a small Greasemonkey script. You can access it [here](/gmScripts/twitterWhoAmi.user.js). You'll need to have the [Greasemonkey plugin](https://addons.mozilla.org/en-US/firefox/addon/748) installed, of course.

Once the script is installed, you will be able to see who you're logged on as, in the Twitter navigation bar at the top right-hand corner of the screen, at all times.

I hope you find it useful; I know from experience that I will...
