---
layout: post
title: Rotating Banners in random order
date: 2009-11-09 19:38:59.000000000 -06:00
type: post
published: true
status: publish
categories:
- Javascript
- Programming
tags:
- Javascript
- Programming
- web
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
I was recently sent a script designed to take a series of advertising banners and rotate them on a page. By 'rotate', I mean display on banner in a designated position and then, after a certain period of time, replace it with another, and then another, and so on. To be fair to those who paid for the banners, each banner was chosen at random so that each new visitor to the site would see a different banner first, second, third, etc. After taking a look at it, I spotted some problems and decided to fix them.  

The main problem with the script is that it was **too** random. It took an array, or list, of banners and, on each rotation, it would select a random position in this list. The problem with this becomes obvious when you look at some examples of random number selections. The output from the following (Perl) script:

```perl
my $idx = 20;
while ($idx)
{
print int(rand()*5);
$idx--;
print "," if $idx;
}
```

is

0,1,2,0,3,0,3,3,3,3,0,3,0,1,1,1,0,4,4,2,4

If each number represents a specific banner, you can see that there is a significant bias toward 3 in this set of 20 rotations. This is not indicating an inherent bias towards 3\. Quite the opposite; this is truly random, but human perception detects a bias because our sample is relatively low.

Leaving the statistics behind, it is quite easy to ensure that the order of banner rotation is random, but every banner gets equal time. All you have to do is to randomize the order of your list of banners when the page loads, and then cycle through them. On each page load, the order is random, but once a page is loaded, the order remains static.

With that in mind, I wrote a JavaScript object to provide the necessary function. I've been writing JavaScript for some time, but I recently bought ['JavaScript: The Good Parts' by _Douglas Crockford_](http://oreilly.com/catalog/9780596517748 "JavaScript: The Good Parts"). Crockford has been writing JavaScript for a long time now and has some strong opinions on the language. I for one applaud this book, although I'm not wholly sold on some of his beliefs. That said, I decided to take a crack at creating an object based on his writings. I'm not overly convinced that the code I've written is superior to anything else I would have written, but I'm willing to take the blame for any failings in my code here:

```javascript
/**
 * @author dancrumb
 */

/*global $ */

var rotatingBanner = function (spec, secrets)
{
 // Private
 var that = {},
 prvItems = secrets || {};

 prvItems.workingList = [];
 prvItems.cached = {};
 prvItems.timeoutId = null;
 prvItems.intialized = false;

 prvItems.nextBanner = function () {
 var banner = prvItems.workingList.shift();
 prvItems.workingList.push(banner);
 return banner;
 };

 prvItems.rotate = function () {
 // This should only be executed if initialization is complete
 if (!prvItems.intialized) return null;

 var newBanner = prvItems.nextBanner();

 $('#'+spec.divId+' a img').attr('src',newBanner.src);
 $('#'+spec.divId+' a').attr('href',newBanner.href || '');
 $('#'+spec.divId+' a').attr('target',newBanner.target || spec.defaultTarget || '');

 prvItems.cacheNextImage();

 return newBanner;
 };

 prvItems.initialize = function() {
 var bannerDiv,
 eImg,
 eA;
 bannerDiv = $('#'+spec.divId);
 if(bannerDiv.length == 0)
 {
 alert("Please provide the ID of an element on the page");
 return null;
 }

 bannerDiv.empty();
 eImg = $(document.createElement("img")).
 attr('height',spec.height).
 attr('width',spec.width).
 attr('id','bannerImage');

 eA = $(document.createElement('a')).
 attr('href','');

 eA.append(eImg);
 bannerDiv.append(eA);                

 that.randomizeBanners();
 prvItems.intialized = true;
 prvItems.rotate();
 };

 /*
 * Place the next Banner Image into the browser cache
 */
 prvItems.cacheNextImage = function () {
 var upcomingBanner = prvItems.workingList[0],
 cacheImage;
 if (!prvItems.cached[upcomingBanner.src])
 {
 cacheImage = new Image();
 cacheImage.src = upcomingBanner.src;
 prvItems.cached[upcomingBanner.src] = true;
 }
 };

 /*
 * Ensure we, at least, have an array of banners
 */
 if(!(
 spec.banners &&
 typeof spec.banners === 'object' &&
 typeof spec.banners.length === 'number' &&
 typeof spec.banners.splice === 'function' &&
 !(spec.banners.propertyIsEnumerable('length'))
 ))
 {
 spec.banners = [];
 }

 /*
 * Confirm that the interval is sensibly set
 */
 if (!((typeof spec.interval === 'number') &&
 (isFinite(spec.interval)) &&
 (spec.interval >= 500))) {
 spec.interval = 1000;
 }

 // Public
 that.randomizeBanners = function () {
 // We shouldn't fiddle with knownBanners directly as this
 // is our master list of banners
 var holdingCopy = spec.banners.slice(0),
 index;

 if (prvItems.timeoutId)
 {
 clearTimeout(prvItems.timeoutId);
 }
 prvItems.workingList = [];

 // Randomize the order of the holding copy of known banners and put it
 // into the working list
 while (holdingCopy.length > 0)
 {
 index = parseInt((Math.random()*holdingCopy.length),10);
 prvItems.workingList.push(holdingCopy[index]);
 holdingCopy.splice(index,1);
 }        

 // If we cancelled the rotation, we restart it here
 if (prvItems.timeoutId)
 {
 that.startRotation();
 }
 };

 that.startRotation = function () {
 prvItems.timeoutId = setInterval(function(){
 prvItems.rotate();
 },spec.interval);
 };

 that.addBanner = function (banner) {
 spec.banners.push(banner);
 this.randomizeBanners();
 };

 that.setInterval = function (interval) {
 if (prvItems.timeoutId)
 {
 clearTimeout(prvItems.timeoutId);
 }
 spec.interval = interval;
 if (prvItems.timeoutId)
 {
 that.startRotation()
 }
 }

 $(function(){ prvItems.initialize();});
 return that;
};
```

You can download this script [here](/js/rotatingBanner.js)

The code above relies on jQuery, so naturally, you would need to include that library first in any HTML page that uses this object.

Invoking this code is straightforward. Your webpage will need a DIV with a defined ID attribute; in this case we use _bannerHere_.

```javascript
var rB = rotatingBanner(
 {
 "width":  600,
 "height": 400,
 "banners": [
 {"src":'fake1', "href":'fake1'},
 {"src":'fake2', "href":'fake2'}
 ],
 "interval": 2000,
 "divId": "bannerHere",
 "defaultTarget": "blank"
 }
 );
 rB.startRotation();
 ```

_width_ and _height_ are the desired dimensions for the banners  
_interval_ is the time (in ms) between each rotation  
_defaultTarget_ is the desired value for the TARGET attribute of the banner link  
_banners_ is a JavaScript array of JavaScript objects with the following fields:

_src_ is the SRC of the banner image  
_href_ is the HREF of the banner link  
_target_ is the **optional** target for the banner link

The code is based on Crockford's belief that we should not pretend the JavaScript is a class-based language. It isn't, it's a prototype-based language. This means that new objects are created from a 'template' object or from a factory method, which generates new object. Again, I'll repeat that my implementation is quite probably not the best example of this and I'm not sure that I prefer this code to a class-based approach, but it works and it'll do for now.

There are some SEO concerns with this implementation, but I'm going to save them for an upcoming post. For now, the code about should be enough for you to implement rotating banners on your website
