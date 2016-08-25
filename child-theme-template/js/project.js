jQuery(document).ready(function(){

	//Call the core functions on every page
	coreReady();

	//Control resize/scroll debouncing in one place
	jQuery(window).on('scroll',	_.debounce(scrollMenuClass, 250));
	jQuery(window).on('ready',  _.debounce(coreResize, 0));
	jQuery(window).on('resize', _.debounce(coreResize, 0));

	//PAGES FOR THIS PROJECT

	//HOME PAGE - Dragend Image Gallery
	if ( jQuery('html').data('page') == 'home'){
		jQuery(window).on('resize', _.debounce(homeResize, 50));

		//#homeGallery Image Slider
		var slidesParent 		= '#homeGallery';
		var slidesContainer 	= '#slidesContainer';
		var slidesContent 		= getImagesByScreenSize(allSizes);
		createDragendSlides( slidesParent, slidesContent, "images", false);

		//New Dragend Class
		jQuery(slidesContainer).dragend({});

		//updateDragendSlider( slideContainer, height,     thumbnails, )
		updateDragendSlider	 ( slidesParent,   viewHeight, false);

		//AutoPlay
		doRecursively( function(){ autoPlaySlides(slidesContainer) }, 3500, 32000);

		function homeResize(){
	        console.log("project.js/home:resize H: " + viewHeight + " W: " + viewWidth);

			updateDragendSlider(slidesParent, viewHeight, false);

		}

	}//home page



	//PROJECTS PAGE - Dragend Image Gallery
	if ( jQuery('html').data('page') == 'projects' || jQuery('html').data('page') == 'portfolio'){
		jQuery(window).on('resize', _.debounce(projectsResize, 50));
		jQuery(window).on('resize', _.debounce(applyIso, 150));

		function projectsResize(){
            if(viewWidth < 1000){
				jQuery('#thumbsContainer').insertAfter("#projectsGallery");
			}
			else{
				jQuery('#thumbsContainer').appendTo("#projectsGallery");
			}

            centerDragendThumbs();
		}

        // Portfolio Masonary
        if(jQuery.fn.core_iso_sort) jQuery('.iso-grid').avia_iso_sort();

		function applyIso(){
			var projectsIso = jQuery('.iso-grid').isotope({
				itemSelector: '.iso-grid-item',
				resizable: false, // disable normal resizing
				percentPosition: true,
				animationEngine: 'best-available',
				animationOptions: {
			    	duration: 3000,
			    	easing: 'linear',
			    	queue: false
			    },
				layoutMode: 'fitRows',
				masonry:{
	                columnWidth:    'iso-grid-item',
	                isAnimated:     true
	                //isFitWidth:   true
	            }
			});
		}

	}//projects page

});
