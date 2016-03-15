/*
 * The basic Google Analytics configuration only tracks clicks on internal links
 *
 * In order to track clicks on links that lead away from your site, you need to add an onClick event
 * handler to that link.
 *
 * This script will find external links automatically for you and add the relevant GA code
 *
 * Requires:
 *  Google Analytics
 *  jQuery
 *
 * parseUri code orignally by Steven Levithan <stevenlevithan.com>, used under MIT License
 * and modified for simplification
 *
 * This code free to all users for any use. Just don't be a jackass and pretend that you wrote it
 *
 * Dan Rumney <dancrumb@danrumney.co.uk>
 */

/*
 * Implementing is easy
 *
 * Add the <script> element pulling in this .js file after the <script> element calling in jQuery
 * Wherever you include your Google Analytics code, add the line:
 *
 *   var ega = new EnableGA(pageTracker,mappings);
 *
 * where 'pageTracker' is the variable that hold the response from _getTracker("GA code");
 * and 'mappings' is explained below.
 *
 * Optionally, you can add a third parameter, true, if you want to track all external links, even those without
 * as explicitly defined pseudo location.
 *
 * Optionally, you can add a fourth parameter, true, if you want to test the pseudo location mappings that
 * you've created. Instead of following external links, this will display the pseudo locations in the console or
 * in an alert box
 *
 * Mappings
 * --------
 * The mappings are simple an object (or associative array, if you prefer) of pseudo-locations and matching regular expressions:
 *
 * {
 *	ABC: new RegExp("abc\.com"),
 *  XYZ: new RegExp("xyz\.co.")
 *  }
 */
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
		parser: /^(?:([^:\/?#]+):)?(?:\/\/((?:(([^:@]*):?([^:@]*))?@)?([^:\/?#]*)(?::(\d*))?))?((((?:[^?#\/]*\/)*)([^?#]*))(?:\?([^#]*))?(?:#(.*))?)/
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
