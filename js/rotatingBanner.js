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