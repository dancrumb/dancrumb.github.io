---
layout: post
title: How to point your Web address to your Web site
date: 2010-04-06 18:29:32.000000000 -05:00
type: post
published: true
status: publish
categories:
- Technology
tags: []
---
Many readers will already know this, but I've had call to walk people through this process a few times, recently, so I'm putting directions online for future reference.

Let's say you have a website hosted somewhere, and you've bought the domain name from [Go Daddy](http://www.godaddy.com/). How do you make that web address point to your website? Well, it's pretty straightforward.

First, log on to your account. Once you have, you should see a page similar to this:

[![]({{ site.github.url }}/assets/account1.jpg "Go Daddy Account page")](http://danrumney.com/wp-content/uploads/2010/04/account1.jpg)

Select 'Domain Manager' and the next window will open up:

[![]({{ site.github.url }}/assets/domain_manager1.jpg "Go Daddy Domain Manager")](http://danrumney.com/wp-content/uploads/2010/04/domain_manager1.jpg)

On this page, select the domain name that you're interested in and then click on the Nameservers. The following window will pop up:

[![]({{ site.github.url }}/assets/dns_settings1.jpg "Go Daddy Nameserver Settings")](http://danrumney.com/wp-content/uploads/2010/04/dns_settings1.jpg)

Choose 'I have specific nameservers for my domain' and insert the nameservers that your hosting solution provided.

Once you click OK, it may take some minutes for the change to propagate throughout the internet. Technically speaking, it can take many hours to get to **every** part of the Internet, but most people will see the change within a few minutes.

That's it... easy, eh?
