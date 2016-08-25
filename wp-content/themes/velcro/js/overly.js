function createOverlay(slug){
	//OVERLAY - Shadowbox style popup box
	//CSS defaults set in core/scss/partials/_reset.scss
	//Customize css for slugOverlayContent in your theme

	//Create full screen box for background
	var overlayContainer 		= document.createElement('div');
	overlayContainer.id 		= slug +"Overlay";
	overlayContainer.className 	= "overlayContainer";
	document.body.appendChild(overlayContainer);

		//Create content box
		var overlayContent 			= document.createElement('div');
		overlayContent.id 			= slug +'OverlayContent';
		overlayContent.className 	= "overlayContent";

		document.getElementById(overlayContainer.id).appendChild(overlayContent);

		//Create closeBtn
		var closeBtn 				= document.createElement('div');
		closeBtn.id 				= "overlayCloseBtn";
		closeBtn.className 			= "icon-cancel-circle";
		document.getElementById(overlayContainer.id).appendChild(closeBtn);

	return "div#"+overlayContent.id;
}

function load(where, what){
	console.log("Loaded: " + where + " INTO " + what);
	jQuery( where ).load( what, function() {
	  jQuery(window).resize();
	  window.scrollTo(0,0);
	});
}


jQuery('.overlay').click(function(){
	jQuery('.overlayContainer').remove();
	what 	= jQuery(this).attr('href');
	slug	= jQuery(this).data('overlay-slug');
    where 	= createOverlay(slug);

    load(where, what);

    return false;
});

jQuery(body).on('click', '#overlayCloseBtn', function() {
	jQuery('div.overlayContainer').remove();
	jQuery('html').css('overflow','scroll');
});