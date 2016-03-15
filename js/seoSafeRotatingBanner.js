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
		if (!prvItems.intialized)	{
			return null;
		}

		var newBanner = prvItems.nextBanner();

		$('#' + spec.divId + ' a').css('display', 'none');
		$('#' + newBanner.id).empty();
		var imgBanner = $(document.createElement('img')).
			attr('src', newBanner.src).
			attr('height', spec.height).
			attr('width', spec.width);

		$('#' + newBanner.id).append(imgBanner);
		$('#' + newBanner.id).css('display', 'inline');

		prvItems.cacheNextImage();

		return newBanner;
	};

	prvItems.initialize = function () {
		var bannerDiv;
		bannerDiv = $('#' + spec.divId);
		if (bannerDiv.length === 0)	{
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