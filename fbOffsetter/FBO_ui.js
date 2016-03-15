/*
 * Enhance the FB Offsetter interface
 */

function initialize()
{
	// Add the hints to the input boxes
	$('input:text').hint('blurredBox');
	
	// Hide the calendar fieldset
	$('fieldset#newCal').css('display','none');
	
	// Timezone
	$('select#tz').css('display','none');
	$('label[for=tz]').css('display','none');
		
	// Calendar Name
	$('input#newName').css('display','none');
	$('label[for=newName]').css('display','none');
	
	// Generate button
	$('input:submit').css('display','none');
	
	$('input:submit').bind('click',generateURL);
	
	$('input#fbURL').bind('blur',checkURL);
	
	buildTimeZoneInputs();
	
	if (document.images) 
	{
	   loading = new Image();
	   valid = new Image();
	   invalid = new Image();
	   loading.src = "/images/ajax-loader.gif";
	   valid.src = "/images/check_mark.gif"
	   invalid.src = "/images/cross.gif"
	}	
	
}

function checkURL(evt)
{
	var fbURL = $('input#fbURL').attr('value');
	if(fbURL != $('input#fbURL').attr('title'))
	{
		// Add 'http://' if it is missing
		if(fbURL.indexOf('http://') < 0)
		{
			fbURL = 'http://'+fbURL;
		}
		// URL Encode the FB URL
		ueFBURL = escape(fbURL);
		$('span#fbError').empty();
		$('img#fbURLResult').attr('src',loading.src);
		jQuery.getJSON('/cgi-bin/checkURL.pl?url='+ueFBURL,handleURLCheck);

	}
	
}

function handleURLCheck(result)
{
	// First, check the status. If it is not 200, then this is a fail
	if(result.status != 200)
	{
		$('input#fbURL').addClass('error');
		$('span#fbError').text('Could not access that URL');
		$('img#fbURLResult').attr('src',invalid.src);
	}
	// Next, check that it's a calendar file
	else if(result.type.indexOf('text/calendar') < 0)
	{
		$('input#fbURL').addClass('error');
		$('span#fbError').text('URL is not an iCal file');
		$('img#fbURLResult').attr('src',invalid.src);
	}
	else
	{
		$('input#fbURL').removeClass('error');
		$('input#fbURL').after($('<b>'+$('input#fbURL').attr('value')+'</b>'));
		$('input#fbURL').css('display','none');
		$('img#fbURLResult').attr('src',valid.src);
		showTimeZoneInputs();
	}
}


var TZs = {};
function buildTimeZoneInputs()
{
	// Take the single select and break the optgroups and options into 2
	// seperate selects
	var tzSelect = $('select#tz');
	
	var tzRegionSelect = $('<select id="tzRegion" name="tzRegion">');
	tzRegionSelect.append("<option value='0' selected='selected'>--Choose a region--</option>");
	$('select#tz optgroup').each(function(idx)
	{
		var tzRegionOption = $('<option>');
		var tzRegionLabel = $(this).attr('label');
		tzRegionOption.attr('value',tzRegionLabel);
		tzRegionOption.text(tzRegionLabel);
		tzRegionSelect.append(tzRegionOption);
		
		// Build array of TZ subregions
		TZs[tzRegionLabel] = [];
		$(this).children('option').each(function(idx2)
		{
			var tzSubRegionOption = $('<option>');
			var tzsrLabelParts = $(this).attr('value').split('/');
			tzsrLabelParts.shift()
			var tzsrLabel = tzsrLabelParts.join('/');
									
			tzSubRegionOption.attr('value',tzsrLabel);
			tzSubRegionOption.text(tzsrLabel);	
			
			TZs[tzRegionLabel].push(tzSubRegionOption);
		});
	});
	
	tzSelect.after(tzRegionSelect);
	$('label[for=tz]').attr('for','tzRegion');
	
  	var tzSubRegionsSelect = $('<select id="tzSubRegion" name="tzSubRegion">');
	tzSubRegionsSelect.css('display','none');
	
	tzRegionSelect.after(tzSubRegionsSelect);
	
	tzRegionSelect.bind('change',tzrSelected);
	tzSubRegionsSelect.bind('change',tzsrSelected);
	
	tzSelect.remove();
}

function showTimeZoneInputs()
{
	$('fieldset#newCal').css('display','');
	
	// Timezone
	$('select#tzRegion').css('display','');
	$('label[for=tzRegion]').css('display','');
}

function tzrSelected()
{
	$('div#URLAnswer').empty();
	if($('select#tzRegion').attr('value') == 0)
	{
		$('select#tzSubRegion').css('display','none');	
		$('input#newName').css('display','none');
		$('label[for=newName]').css('display','none');
		$('input:submit').css('display','none');
	}
	else
	{	
		// Have to hide this box for some reason to work around an IE glitch
		$('select#tzSubRegion').css('display','none');	
		var subRegions = TZs[$('select#tzRegion').attr('value')];
		$('select#tzSubRegion').empty();
		$('select#tzSubRegion').append("<option value='0' selected='selected'>-- Choose a sub-region --</option>");
		jQuery.each(subRegions,function()
		{
			$('select#tzSubRegion').append($(this));		
		});
		$('select#tzSubRegion').css('display','');
		tzsrSelected();
	}
}

function tzsrSelected()
{
	$('div#URLAnswer').empty();
	if($('select#tzSubRegion').attr('value') == 0)
	{
		$('input#newName').css('display','none');
		$('label[for=newName]').css('display','none');
		$('input:submit').css('display','none');
	}
	else
	{
		$('input#newName').css('display','');
		$('label[for=newName]').css('display','');
		$('input:submit').css('display','');
	}
}

function generateURL(evt)
{
	var fbURL = $('input#fbURL').attr('value');
	var tz = $('select#tzRegion').attr('value')+'/'+$('select#tzSubRegion').attr('value');
	var newName = $('input#newName').attr('value');
	if(newName == $('input#newName').attr('title'))
	{
		newName = '';
	}

	var queryString = fbURL.split('?').pop();
	var pairs = queryString.split('&');
	var params = {};
	jQuery.each(pairs,function()
	{
		var pair = this.split('=');
		params[pair[0]] = pair[1];		
	});
	
	var url = 'http://www.danrumney.co.uk/cgi-bin/fbOffsetter.pl?uid='+params.uid+'&amp;key='+params.key+'&amp;tz='+escape(tz)+'&amp;name='+escape(newName);
	var calLink = $('<a>');
	calLink.attr('href',url);
	calLink.text(url);
	$('div#URLAnswer').append(calLink);
	
	evt.preventDefault();	
	
	
}


$('document').ready(initialize);

