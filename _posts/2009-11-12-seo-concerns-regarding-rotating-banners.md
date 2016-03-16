---
layout: post
title: SEO concerns regarding Rotating Banners
date: 2009-11-12 14:37:57.000000000 -06:00
type: post
published: true
status: publish
categories:
- Javascript
- Programming
tags:
- Javascript
- Programming
- SEO
---
I recently wrote about [a script designed to generate Rotating Banners](/javascript/programming/2009/11/09/rotating-banners-in-random-order.html). The script works fine, but using JavaScript to present a user with links creates a few problems of its own:

*   Google Analytics will not be able to track these external links (if, for instance, you're using my [Google Analytics for external links](/javascript/2009/06/21/enabling-external-links-for-google-analytics.html))
*   Non-visual User Agents will not be able to access these links
*   As a subset, Google will not be able to crawl these links and so associate your site with the sites those banners point to.

The way to resolve this is to use the method of graceful degradation or, perhaps more appropriately, progressive enhancement. By this, I mean, the HTML should be written such that the above issues are avoided, and then the JavaScript should be written to provide the Rotating Banners functionality.

Using the Rotating Banners script as a starting point, the obvious approach is to dispense with the JSON representation of our banners and replace it with an HTML representation of our banners. This will be hidden using CSS. Much of the functionality will otherwise remain the same. By representing the links in the HTML document, webcrawlers (such as Google's indexing service) will be able to parse these links and use them accordingly. In addition, Google Analytics (if installed on your site) can track exits from your site, via these banners.

I have created a **new** object which extends the original Rotating Banners object, such that it doesn't cause SEO problems. In order to use this object, you need to include the original object in your HTML, as well as this one.

The new object is shown below:

```javascript
/**
 * SEO Safe Rotating Banner
 *
 * Specialized version of Rotating Banner
 * @author dancrumb
 */

/*global rotatingBanner,$ */

var seoSafeRotatingBanner = function (spec, secrets) {

    var prvItems = secrets || {};

    var that = rotatingBanner(spec, prvItems);

    spec.banners = [];

    prvItems.rotate = function () {
        // This should only be executed if initialization is complete
        if (!prvItems.intialized) {
            return null;
        }

        var newBanner = prvItems.nextBanner();

        $('#' + spec.divId + ' a').css('display', 'none');
        $('#' + newBanner.id).empty();
        var imgBanner = $(document.createElement('img')).attr('src', newBanner.src).attr('height', spec.height).attr('width', spec.width);

        $('#' + newBanner.id).append(imgBanner);
        $('#' + newBanner.id).css('display', 'inline');

        prvItems.cacheNextImage();

        return newBanner;
    };

    prvItems.initialize = function () {
        var bannerDiv;
        bannerDiv = $('#' + spec.divId);
        if (bannerDiv.length === 0) {
            alert("Please provide the ID of an element on the page");
            return null;
        }

        $('div#' + spec.divId + ' a').each(function (i) {
            var aElem = $(this);
            // Ensure that there is an ID defined, for future manipulation

            var a_id = aElem.attr('id');
            if (a_id === null) {
                a_id = 'rb_auto_id_' + i;
                aElem.attr('id', a_id);
            }

            // Ensure that there is a target defined, and set it to the defaultTarget
            // if not
            var tgt = aElem.attr('target');
            if (!tgt) {
                tgt = spec.defaultTarget;
                aElem.attr('target', tgt);
            }

            // Ensure that the banner is hidden
            aElem.css('display', 'none');

            // Add the banner to the rotater
            that.addBanner(
                {
                    "src": aElem.text(),
                    "id": a_id
                }
            );
        });

        that.randomizeBanners();
        prvItems.intialized = true;
        prvItems.rotate();
        $('div#' + spec.divId).css('display', '');
    };

    return that;

};

```

This file can be downloaded [here](/js/seoSafeRotatingBanner.js).  
All that is necessary is to override the 'initialize' and 'rotate' methods.

Using this object on your page is just as straightforward as before. As before, you need to include the jQuery library. You also need to include the original rotatingBanners script, as well as this one. The initialization code is slightly different:

```javascript
var rB = seoSafeRotatingBanner(
  {
    "width":  600,
    "height": 400,
    "interval": 5000,
    "divId": "bannerHere",
    "defaultTarget": "blank"
   }
);
rB.startRotation();
```

The final ingredient is the list of links itself. This is provided in HTML:

```html

<div id="bannerHere" style="display:none;">
  [/image_location/img_src_1.jpg](link1)
  [../img_src_2.png](link1)
  [img_src3.gif](link1)</div>

```

Note that the URLs to the images are just plain text. They are **not** `IMG` tags.

You must ensure that the style of the enclosing DIV contains '`display:none`' (per line 1) or your list of links will be visible to the user.

At this point, you will have your rotating banners, without sacrificing your SEO performance.
