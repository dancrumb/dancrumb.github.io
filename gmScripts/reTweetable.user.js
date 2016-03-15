// ==UserScript==
// @name ReTweetable Alert
// @namespace http://www.danrumney.co.uk/gmScripts/
// @description Warns you if a Tweet will be difficult to ReTweet
// @include http://twitter.com/*
// @include https://twitter.com/*

// ==/UserScript==

/*
 * Twitter uses jQuery; so can we
 */
if(typeof unsafeWindow.jQuery == 'undefined')
{ alert("For some reason, jQuery is not available"); }
else
{$ = unsafeWindow.jQuery;}
/*
 * Find out username
 */
var userName = "";
var metaTags = document.getElementsByTagName('meta');
$('meta').each(function()
{
	var metaTag = $(this)
	if(metaTag.attr('name') == "session-user-screen_name")
	{
		userName = metaTag.attr('content');
		return false;
	}
});


	var charCount = $('#status-field-char-counter');
	/*
	 * rtSafe is the maximum number of characters that a tweet can contain
 	 *  before ReTweeting it will exceed 140 characters
 	 */
	var rtSpace = userName.length + 6;
		
	var rtSafe = charCount.text() - rtSpace;
	
	$('#chars_left_notice').append('<strong id="rt_gm" class="char_counter">['+rtSafe+']</strong>');
	$('#status').bind('keyup',function()
	{
		rtSafe = charCount.text() - rtSpace;
		$('#rt_gm').empty().text('['+rtSafe+']');
		if (rtSafe <=10)
		{
			$('#rt_gm').css("color", "#d40d12");
      } 
      else if (rtSafe <= 20)
      {
			$('#rt_gm').css("color", "#5c0002");
      }
      else
      {
      	$('#rt_gm').css("color", "#cccccc");
      }
	});

