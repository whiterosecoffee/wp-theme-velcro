function maxH(target, value){
	jQuery(target).css('max-height', value);
}

function maxW(target, value){
	jQuery(target).css('max-width', value);
}

function minH(target, value){
	jQuery(target).css('min-height', value);
}

function minW(target, value){
	jQuery(target).css('min-width', value);
}

function width(target){
	return jQuery(target).width();
}

function height(target){
	return jQuery(target).height();
}

function clearHeight(target){
    jQuery(target).css('min-height', 'none');
    jQuery(target).css('max-height', 'none');
    jQuery(target).css('height', 'auto');
}

function getBreakpoint(mobilePortrait, mobileLandscape, tabletLandscape){

    if(viewWidth <= mobilePortrait){
        return "mobilePortrait";
    }
    else if( (viewWidth > mobilePortrait) && (viewWidth < mobileLandscape ) ){
        return "mobileLandscape";
    }
    else if( (viewWidth > mobileLandscape) && (viewWidth < tabletLandscape ) ){
        return "tabletPortrait";
    }
    else{ return "desktop"; }
}

function matchHeight(ele, targetHeight){
    var eleHeight;
    if (!targetHeight){
		eleHeight = viewHeight;
	}
	else {
		eleHeight = targetHeight;
	}
	return jQuery(ele).height(eleHeight);
}

function widerThan(min, max, target){

	if(!target){
		target = jQuery(window);
	}

	if (max){

		if( (max > width(target) ) && ( min < width(target) ) ){
			return true;
		}
	}
	else if( min < width(target) ){
		return true;
	}
	else{
		return false;
	}
}

function maxSizeByAsp(target, minAsp, maxAsp){
	jQuery(target).css('max-height', 'none');
	jQuery(target).css('min-height', 0);


	var targetAsp = width(target) / height(target);

	//if WIDE / SHORT SLIDE
	if (targetAsp > maxAsp){
		minH(target, viewWidth / maxAsp);
	}

	// if TALL / SKINNY SLIDE
	if (targetAsp < minAsp){
		maxH(target, viewWidth / minAsp );
	}
}

function moveOnOrientation(target, destination, landscape, portrait){
	//LANDSCAPE
	if(viewWidth>viewHeight){
		if(landscape == "prepend"){
			jQuery(target).prependTo(destination);
		}
		if(landscape == "append"){
			jQuery(target).appendTo(destination);
		}
		if(landscape == "after"){
			jQuery(target).insertAfter(destination);
		}
		if(landscape == "before"){
			jQuery(target).insertBefore(destination);
		}
	}
	//PORTRAIT
	else{
		if(portrait == "prepend") {
			jQuery(target).prependTo(destination);
		}
		if(portrait == "append"){
			jQuery(target).appendTo(destination);
		}
		if(portrait == "after"){
			jQuery(target).insertAfter(destination);
		}
		if(portrait == "before"){
			jQuery(target).insertBefore(destination);
		}
	}
}

function setBgImg(target, image, orientation){
	jQuery(target).css('background-image', 'url(' + image + ')');
	if(orientation !== ""){
		jQuery(target).addClass(orientation);
	}
}

function aspLabel(width, height){

		if ( width / height > 1.75 ){
			return "landscape shortWide";
		}

		else if ( width > height ){
			return "landscape";
		}

		else if ( width / height < 0.75 ){
			return "portrait tallSkinny";
		}

		else if ( width < height ){
			return "portrait";
		}

		else{
			return "square";
		}
}

function lazyLoadResource(file, type){
	var cb = function() {
    var link;
    if (type === "css"){
		link = document.createElement('link'); link.rel = 'stylesheet';
	}
	else if (type === "js"){
		link = document.createElement('script'); link.type = 'text/javascript';
	}

	link.href = file;
	var h = document.getElementsByTagName('head')[0]; h.parentNode.insertBefore(l, h);
	};
	var raf = requestAnimationFrame || mozRequestAnimationFrame ||
	webkitRequestAnimationFrame || msRequestAnimationFrame;
	if (raf) raf(cb);
	else window.addEventListener('load', cb);
}

function doRecursively(thisFn, interval, timeout) {
    setTimeout(function(){
	    interval = interval ||  3000;
	    timeout =  timeout  || 30000;
	    var startTime = (new Date()).getTime();


	    (function rinceRepeat() {
	        var thisFnResult = thisFn();

	        if ( (Date.now() - startTime ) <= timeout )  {
	            setTimeout(rinceRepeat, interval, thisFnResult);
	        }
	    })();

    }, interval * 0.75);
}

function applyIso(){
    var projectsIso = jQuery('.iso-grid').isotope({
        itemSelector: '.iso-grid-item',
        resizable: true, // disable normal resizing
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
            //isFitWidth:     true
        }
    });
}
