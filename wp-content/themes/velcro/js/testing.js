jQuery('body').append("<div id='windowSize'></div>");
jQuery('#windowSize').click(function() {
    jQuery('#windowSize').fadeOut('medium');
});

function initTestPanel() {

    jQuery('#windowSize').empty();

    jQuery('#windowSize').append("<div>"        		+ aspText           + "</div>");
    jQuery('#windowSize').append("<div>"       		 	+ breakPoint        + "</div>");
    jQuery('#windowSize').append("<div>W: "     		+ viewWidth         + "px - " + viewWidth/baseFontSize + "em</div>");
    jQuery('#windowSize').append("<div>H: "     		+ viewHeight        + "px</div>");
    jQuery('#windowSize').append("<div>Device:"        	+ deviceType        + "</div>");

    if ( jQuery('html').data('page') == 'projects'){
        //Temp Slider Testing
    	//var slideHeight    = jQuery("#homeGallery").height();
    	//var slideMaxHeight = jQuery("#homeGallery").css('max-height');
    	//var slideMinHeight = jQuery("#homeGallery").css('min-height');

        //jQuery('#windowSize').append("<div>SlideH: "  		+ slideHeight       + "px</div>");
        //jQuery('#windowSize').append("<div>SlideMaxH: "  	+ slideMaxHeight    + "</div>");
        //jQuery('#windowSize').append("<div>SlideMinH: "  	+ slideMinHeight    + "</div>");
    }
}


