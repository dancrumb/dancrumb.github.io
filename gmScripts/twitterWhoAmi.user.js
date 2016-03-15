// ==UserScript==
// @name Twitter Whoami
// @namespace http://www.danrumney.co.uk/gmScripts/
// @description Gives a clear indication of who you are logged on to Twitter as, on all Twitter pages
// @include http://twitter.com/*

// ==/UserScript==

/*
 * Set up the CSS Styling
 */
 
GM_addStyle("#whoami{background-color:red;color:white;padding:2px;}");


/*
 * Scan through the meta tags to see if the user name is set
 * and, hence, the user is logged in
 */
var metaTags = document.getElementsByTagName('meta');
for (var tagIdx in metaTags)
{
	var metaTag = metaTags[tagIdx];	
	if(metaTag.name == "session-user-screen_name")
	{
		showUserName(metaTag.content);
	}
}

/*
 * Add the relevant tags to show the currently logged in user 
 * name in the navigation bar
 *
 * May 08, 2009: Changed id from 'navigation' to 'header'
 */
function showUserName(uName)
{
	var navDiv = document.getElementById("header");
	var navList = navDiv.getElementsByTagName("ul")[0];
	
	var uNameDisplay = document.createElement("b");
	uNameDisplay.appendChild(document.createTextNode(uName));
	var whoElem = document.createElement("li");
	whoElem.setAttribute('id','whoami');
	whoElem.setAttribute('class','round');	
	whoElem.appendChild(uNameDisplay);
	
	navList.appendChild(whoElem);	
}