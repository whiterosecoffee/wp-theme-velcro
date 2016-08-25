function updateDragendSlider(slideContainer, height, thumbnails, autoPlayInterval){

		//Dragend gallery will take height from parent container
        clearHeight(slideContainer);
        jQuery(slideContainer).height(viewHeight);

		//Control the size of the parent container for odd shaped images - coreHelpers.js
		maxSizeByAsp(slideContainer, 1.6, 2.2);

		//HTML Template Thumbs IF thumbnails or buttons requested
		if(thumbnails){
			centerDragendThumbs();
		}

}//initDragend

	function autoPlaySlides(thisDragend){
		jQuery(thisDragend).dragend("left");
	}

	function getImagesByScreenSize(imagesArray, firstBreak, secondBreak){
		if (jQuery(window).width() < firstBreak ){
			return imagesArray[1];//small;
		}
		else if(jQuery(window).width() >= firstBreak && jQuery(window).width() <= secondBreak) {
			return imagesArray[2];//medium;
		}
		else{
			return imagesArray[3];//large;
		}
	}

	//HTML Template for content: "images" / "html" / ?

	function createDragendSlides(target, slidesArr, sliderType, thumbnails){
		slidesContainer = jQuery('<div id="slidesContainer" class="dragend-page"></div>');
		slidesContainer.appendTo(jQuery(target));

		jQuery.each( slidesArr, function( index, slide ){
			var thisSlide = jQuery('<div class="dragend-page" data-height="'+slide[1]+' "data-width="'+slide[2]+'"></div>');
			thisSlide.appendTo(jQuery(slidesContainer));
			loadDragendSlideContent(thisSlide, slide, sliderType);
			jQuery(thisSlide).addClass(aspLabel( slide[2] , slide[1] ));
		});

		if (thumbnails){
			thumbsContainer = jQuery('<div id="thumbsContainer" class="dragend-page"></div>');
			thumbsContainer.appendTo(jQuery(target));
			createDragendThumbs(slidesContainer, thumbsContainer, slidesArr, thumbnails);
		}

	}

	function createDragendThumbs(slidesContainer, thumbsContainer, thumbsArr, thumbsType){
		jQuery.each( thumbsArr, function( index, thumb ){

			var thisThumb = jQuery('<div class="dragend-thumb dragend-page" data-page="'+(index+1)+'"></div>');
			thisThumb.appendTo(jQuery(thumbsContainer));

			if(thumbsType == "thumbnails"){
				setBgImg(thisThumb, thumb[0], "square");
			}
			else if(thumbsType == "buttons"){
				//add button support
			}

		});

		initDragendThumbs(slidesContainer, thumbsContainer);
	}

	function initDragendThumbs(slidesContainer, thumbsContainer){

		jQuery(thumbsContainer).click(function(event) {
			var page = jQuery(event.target).data("page");

			jQuery(slidesContainer).dragend({
				scrollToPage: page
			});
		});

		setThumbsPerPage();


	}

	function setThumbsPerPage(){

		//Show as many thumbs as will fit on the screen
	    var itemsInPage = viewWidth / jQuery( "#thumbsContainer .dragend-page").width();
	    //console.log("ItemsInPage: " + itemsInPage);
		jQuery("#thumbsContainer").dragend({
	    	itemsInPage: itemsInPage,
	        onSwipeEnd: function() {
	        	stopThumbsOverscroll();
	        }
        });
	}

	function stopThumbsOverscroll(){
		var lastThumb = jQuery('#thumbsContainer .dragend-thumb:last-child');
    	var lastThumbWidth = width(lastThumb);
    	var lastThumbOffsetLeft = lastThumb.position().left;
    	var lastThumbOffsetRight = lastThumb.position().left + lastThumbWidth;
    	var thumbsContainer = jQuery("#thumbsContainer div:first-child");
    	var thumbsContainerWidth = width(thumbsContainer);
    	var thumbsContainerBiggerBy =  thumbsContainerWidth - viewWidth;
    	if ( thumbsContainerWidth > viewWidth){
    		if( lastThumbOffsetRight < viewWidth){
    			thumbsContainer.css('transform', 'translateX(-' + thumbsContainerBiggerBy + 'px)');
    		}
    		if( thumbsContainer.position().left > 0){
    			thumbsContainer.css('transform', 'translateX(0px)');
    		}
    	}

	}

	function centerDragendThumbs(){
		jQuery('#thumbsContainer').css('margin-left', 0);

			var thumbOffset = ( viewWidth - ( jQuery('.dragend-thumb').length * jQuery('.dragend-thumb').width() ) ) / 2;
		    if (thumbOffset < 0 ){thumbOffset = 0;}

	    jQuery('#thumbsContainer').css('margin-left', thumbOffset);
	}

	function loadDragendSlideContent(thisSlide, slideContent, slideType){
		if (slideType === "images"){
			setBgImg(thisSlide, slideContent[0], slideContent[1]);
		}
	}

