---
layout: post
title: How to import Facebook events without timezone issues
date: 2009-07-01 17:31:21.000000000 -05:00
type: post
published: true
status: publish
categories:
- Javascript
- Programming
tags:
- facebook
- google
- icalendar
- pre
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
[![syncMess]({{ site.github.url }}/assets/syncMess11.png "syncMess")](/assets/syncMess11.png)

As an owner of a brand new Palm Pre, I recently got exposed to the vagaries of trying to import my Facebook Calendar into my Pre. It's not as easy as it should be and the fault lies with Facebook **and** with Palm. While we're waiting to sort things out, I've written a little application, along with the post, to help myself and others out of this pickle

The start of the problem is with Facebook. When you opt to export your Events, Facebook provides you with a URL pointing to an iCalendar file. This contains all the details of your upcoming events. However, what it does _not_ contain (and this is critical) is any timezone information. When you access Facebook normally, it knows what timezone you are in from you computer's clock and shows events at the according time. This is known as using a 'floating' timezone and makes things a lot easier on the FB backend.

However, when you import this iCalendar file into another calendar application, it has no idea what timezone the file represents. Some applications will assume it is your local timezone. Others (especially web applications) may assume that the timezone is GMT. Unless you live in the UK, or other GMT countries, you're going to see an offset for all of your events.

How does this play into the Pre? Well, I live in Austin, which is in the Central timezone. When I imported my Facebook events, they were off by two hours. After some investigation, I came across this theory, that I find the most compelling: My Pre is synchronised with my FB events via a server at Palm, in the Pacific timezone. Facebook 'floats' my events to match the PST timezone. As a result, when they appear in my Pre, they are off by two hours.

So, I though to myself, why not import my FB Events into my Google calendar and use _that_ as my primary calendar. Well, Google has other ideas. It sees an iCalendar file without a time zone, assumes GMT and so shifts all of my events by 6 hours.

As a result, I've made [this app](/fbOffsetter/configureFBO.html). Just provide the URL to your Facebook Events Export, set your timezone and give the new calendar a name. A new URL will be generated, which you can then pass to Google Calendars. Within an hour or so, Google will import your events and keep them updated.

You can then sync your Pre (or other PDAs) with your Google Calendar and, hey presto, there are your events.

This process doesn't add any functionality to the calendar; it just sets to timezone correctly. Any delays in synching will come from the delay of Google synching with Facebook and your Pre synching with Google. My filter adds no significant time overhead at all.

This functionality is provided to you all free of charge. All I ask is that you add comments and suggestions. I'm happy to tweak this and respond to error reports.
