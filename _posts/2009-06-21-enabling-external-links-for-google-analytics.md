---
layout: post
title: Enabling external links for Google Analytics
date: 2009-06-21 19:36:35.000000000 -05:00
type: post
published: true
status: publish
categories:
- Javascript
tags:
- google analytics
- Javascript
- jquery
- script
meta:
  _edit_last: '1'
author:
  login: admin
  email: dancrumb@gmail.com
  display_name: dancrumb
  first_name: ''
  last_name: ''
---
[![googleAnalyticsLogo]({{ site.github.url }}/assets/googleAnalyticsLogo11.jpg "googleAnalyticsLogo")]({{ site.github.url }}/assets/googleAnalyticsLogo11.jpg)

Tracking external links with Google Analytics is a great way to work out and why how people are leaving your site. This post describes a method for automatically tracking external links in a way that degrades gracefully in the absence of Javascript.  

Google Analytics works by having you install a small Javascript on each page. This script tracks a number of things, including the **referrer**. The referrer is the page that the user as _just_ on. If this was an _external_ page, then Google Analytics registers this as a traffic source. If this was an _internal_ page, then Google analytics registers this as well. When you're analyzing your site statistics, Google Analytics will be able to show which internal links were clicked on any given page.

However, because Google Analytics relies on the page that you're clicking _to_, in order to track information, you need to do something extra in order to track clicks on external links. Remember, when you leave your site, Google Analytics isn't going to be able to track that normally.

The Google Analytics [documentation](http://www.google.com/support/analytics/bin/answer.py?hl=en&answer=72712) for this explains what you need to do. You need to add an onClick event handler to your external links. The problem is, the method that they recommend doesn't degrade very nicely if your visitor doesn't have Javascript running. In addition, it requires yo to add this code to **every** external link.

I've written a script which will set up all of your external links to be tracked with Google Analytics and include it here for your use. I've stripped out a lot of the comments from the code below, but the actual file has plenty of comments in it. It can be found [here](/js/EnableGA.js).

```javascript
function EnableGA(tracker,mappings,trackUnknownLinks,testing)
{
	this.tracker = tracker;
	this.mappings = mappings;
	this.trackUnknown = (typeof(trackUnknownLinks) != "undefined")?trackUnknownLinks:false;
	this.testing = (typeof(testing) != "undefined")?testing:false;

	this.parseOptions = {
		key: ["source","protocol","authority","userInfo","user","password","host","port","relative","path","directory","file","query","anchor"],
		q:   {
			name:   "queryKey",
			parser: /(?:^|&)([^&=]*)=?([^&]*)/g
		},
		parser: /^(?:([^:/?#]+):)?(?://((?:(([^:@]*):?([^:@]*))?@)?([^:/?#]*)(?::(d*))?))?((((?:[^?#/]*/)*)([^?#]*))(?:?([^#]*))?(?:#(.*))?)/
	};

	var oThis = this;
    $(document).ready(function(){oThis.enable()});
}

/*
 * enable
 *
 * Enables GA tracking of external links
 */
EnableGA.prototype.enable = function()
{
	if(this.tracker || this.testing)
	{
		var oThis = this;
		$("a").each(function()
		{
			var target = $(this).attr("href");
			if((target != null) && (target != ""))
			{
				var URL = oThis.parseUri(target);
				if ((URL.host == "") || (URL.host.search(window.location.hostname)>=0))
				{
					// Do nothing. Google Analytics already tracks local files
				}
				else
				{
					var pseudoLoc = oThis.getPseudoLoc(URL);
					if(pseudoLoc)
					{
						$(this).bind('click',function(evt)
						{
							if(oThis.testing)
							{
								if((typeof(console) != 'undefined') && (typeof(console.log) != 'undefined'))
								{
									console.log(pseudoLoc)
								}
								else
								{
									alert(pseudoLoc);
								}
								evt.preventDefault();
							}
							else
							{
								pageTracker._trackPageview(pseudoLoc);
							}
						});
					}
				}
			}
		});
	}
};

/*
 * getPseudoLoc
 *
 * Gets a pseudo-location for the purposes of GA tracking for the provided
 * URL of an external link
 */
EnableGA.prototype.getPseudoLoc = function(url)
{
	var response = this.trackUnknown?"/UNK/"+[url.host,url.directory,url.file].join(''):null;

	jQuery.each(this.mappings, function(plDir,regExp)
			{
				if(regExp.test(url.host))
				{
					if(((url.path == "") || (url.path == "/")) && (url.file == ""))
					{
						response = "/"+plDir+"/root";
					}
					else
					{
						response = "/"+plDir+"/"+[url.directory,url.file].join('/');
					}
				}
			});

	return response;
};

/*
 * parseURI
 *
 * Takes a URI and splits it into its constituent parts
 */
EnableGA.prototype.parseUri = function(str)
{
	var	o   = this.parseOptions,
		m   = o.parser.exec(str),
		uri = {},
		i   = 14;

	while (i--) uri[o.key[i]] = m[i] || "";

	uri[o.q.name] = {};
	uri[o.key[12]].replace(o.q.parser, function ($0, $1, $2) {
		if ($1) uri[o.q.name][$1] = $2;
	});

	return uri;
};
```

In order to demonstrate how this works, I've created a very [bare bones demonstration](/examples/EnableGADemo.html). This will show you how the script is used and how it behaves in 'testing' mode.

If you have any questions or comments, feel free to leave a comment below and I'll address them as soon as I can
