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

//Init Project Variables
var mobileNavOnly 		= true;
var pageLoader 			= true;
var devTesting 			= true;
var baseFontSize 		= parseInt(jQuery('html').css('font-size'));
var mobilePortrait 		= 414;
var mobileLandscape 	= 767;
var tabletLandscape 	= 1280;

var console		= window.console;
var alert 		= window.alert;
var document 	= window.docuement;
var body 		= document.body;
var docWidth 	= document.body.clientWidth;
var docHeight 	= document.body.clientHeight;
var viewWidth 	= window.innerWidth;
var viewHeight 	= window.innerHeight;
var viewAsp 	= (window.innerWidth/window.innerHeight).toFixed(2);

var breakPoint  = getBreakpoint(mobilePortrait, mobileLandscape);
var aspText 	= setOrientation();
var deviceType 	= jQuery('html').data('device');


function coreReady(){

	document.getElementById('navOpenBtn').addEventListener('click', addMenuOpenClass ); /*Click function to add mobileMenu class*/
	document.getElementById('navCloseBtn').addEventListener('click', removeMenuOpenClass ); /*Click function to remove mobileMenu class*/

	jQuery("#pageLoader").fadeOut("fast");

}

function coreResize(){
	//Reset base values
	docWidth 	= document.body.clientWidth;
	docHeight 	= document.body.clientHeight;
	viewWidth 	= window.innerWidth;
	viewHeight 	= window.innerHeight;
	viewAsp		= (window.innerWidth/window.innerHeight).toFixed(2);
	breakPoint 	= getBreakpoint(mobilePortrait, mobileLandscape, tabletLandscape);
	aspText 	= setOrientation();

	//Check if the menu class should change
	toggleNavClass();

	//Check HTML
	setHTMLMinHeight();

    //If devTesting TRUE generate testPanel
    if (devTesting === true){
		initTestPanel();
	}

    //If
    if (devTesting === true){
        initTestPanel();
    }

	//Log current device info
	console.log('coreFramework.js/coreResize H:'+ viewHeight +' x W:' + viewWidth +' Asp:' + viewAsp +' ' + aspText +' ' + deviceType);
    jQuery('.mobileMenu #nav').css('height', viewHeight);
    mobileMenuHeight();
}// coreResize



//fix wrapper height on short screens
function setHTMLMinHeight(){
	var wrapperHeight = jQuery('#wrapper').height();
	jQuery('html').css('height', 'auto');
	if(wrapperHeight < viewHeight){
		jQuery('html').css('height', viewHeight);
		jQuery('body').css('height', viewHeight);
	}
	else{
		jQuery('html').css('height', wrapperHeight);
		jQuery('body').css('height', wrapperHeight);
	}
}

function toggleNavClass() {
	if (mobileNavOnly === false){
		if (viewWidth >= 1024){
			body.classList.add('desktopMenu');
			body.classList.remove('mobileMenu');
		}
		else{
			body.classList.remove('desktopMenu');
			body.classList.add('mobileMenu');
		}
	}
}

function mobileMenuHeight(){
    if ( jQuery(body).hasClass('mobileMenu') ){
        jQuery('.mobileMenu #nav').css('height', viewHeight);
    }
    else{
        jQuery('#nav').css('height', 'auto');
    }
}

function addMenuOpenClass(){ /*Add mobileMenu class to body element*/
	body.classList.remove('desktopMenu');
	body.classList.remove('mobileMenuClosed');
	body.classList.add('mobileMenuOpen');
}

function removeMenuOpenClass(){ /*Removes mobileMenu class from html element*/
	body.classList.remove('mobileMenuOpen');
	body.classList.add('mobileMenuClosed');
	toggleNavClass();
}

function hasClass(ele,cls) {
	return ele.className.match(new RegExp('(\\s|^)'+cls+'(\\s|jQuery)'));
}

function addClass(ele,cls) {
	if (!hasClass(ele,cls)) {ele.className += " "+cls;}
}

function removeClass(ele,cls) {
	if (hasClass(ele,cls)) {
		var reg = new RegExp('(\\s|^)'+cls+'(\\s|jQuery)');
		ele.className=ele.className.replace(reg,' ');
	}
}

function scrollMenuClass(){
	if ( jQuery(window).scrollTop() > 20 ) {
	    jQuery('body').addClass('scrollMenu');
	}
	else if ( jQuery('.overlayContent').scrollTop() > 20 ) {
	    jQuery('body').addClass('scrollMenu');
	}
	else{
	    jQuery('body').removeClass('scrollMenu');
	}
}

//set portrait / landscape class
function setOrientation(){
	if (viewHeight > viewWidth) {
		jQuery('body').addClass('portrait');
		jQuery('body').removeClass('landscape');
		return "portrait";
	}
	else{
		jQuery('body').addClass('landscape');
		jQuery('body').removeClass('portrait');
		return "landscape";
	}
}

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

/*!
 * ---------------------------- DRAGEND JS -------------------------------------
 *
 * Version: 0.2.0
 * https://github.com/Stereobit/dragend
 * Copyright (c) 2014 Tobias Otte, t@stereob.it
 *
 * Licensed under MIT-style license:
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 *
 */

 ;(function( window ) {
  "use strict";

  // help the minifier
  var doc = document,
      win = window;

  function init( $ ) {

    // Welcome To dragend JS
    // =====================
    //
    // dragend.js is a touch ready, full responsive, content swipe script. It has no dependencies
    // It also can, but don't has to, used as a jQuery
    // (https://github.com/jquery/jquery/) plugin.
    //
    // The current version is 0.2.0
    //
    // Usage
    // =====================
    //
    // To activate dragend JS just call the function on a jQuery element
    //
    // $("#swipe-container").dragend();
    //
    // You could rather pass in a options object or a string to bump on of the
    // following behaviors: "up", "down", "left", "right" for swiping in one of
    // these directions, "page" with the page number as second argument to go to a
    // explicit page and without any value to go to the first page
    //
    // Settings
    // =====================
    //
    // You can use the following options:
    //
    // * pageClass: classname selector for all elments that should provide a page
    // * direction: "horizontal" or "vertical"
    // * minDragDistance: minuimum distance (in pixel) the user has to drag
    //   to trigger swip
    // * scribe: pixel value for a possible scribe
    // * onSwipeStart: callback function before the animation
    // * onSwipeEnd: callback function after the animation
    // * onDragStart: called on drag start
    // * onDrag: callback on drag
    // * onDragEnd: callback on dragend
    // * borderBetweenPages: if you need space between pages add a pixel value
    // * duration
    // * stopPropagation
    // * afterInitialize called after the pages are size
    // * preventDrag if want to prevent user interactions and only swipe manualy

    var

      // Default setting
      defaultSettings = {
        pageClass          : "dragend-page",
        direction          : "horizontal",
        minDragDistance    : "40",
        onSwipeStart       : noop,
        onSwipeEnd         : noop,
        onDragStart        : noop,
        onDrag             : noop,
        onDragEnd          : noop,
        afterInitialize    : noop,
        keyboardNavigation : false,
        stopPropagation    : false,
        itemsInPage        : 1,
        scribe             : 0,
        borderBetweenPages : 0,
        duration           : 300,
        preventDrag        : false
      },

      isTouch = 'ontouchstart' in win,

      startEvent = isTouch ? 'touchstart' : 'mousedown',
      moveEvent = isTouch ? 'touchmove' : 'mousemove',
      endEvent = isTouch ? 'touchend' : 'mouseup',

      keycodes = {
        37: "left",
        38: "up",
        39: "right",
        40: "down"
      },

      errors = {
        pages: "No pages found"
      },

      containerStyles = {
        overflow: "hidden",
        padding : 0
      },

      supports = (function() {
         var div = doc.createElement('div'),
             vendors = 'Khtml Ms O Moz Webkit'.split(' '),
             len = vendors.length;

         return function( prop ) {
            if ( prop in div.style ) return true;

            prop = prop.replace(/^[a-z]/, function(val) {
               return val.toUpperCase();
            });

            while( len-- ) {
               if ( vendors[len] + prop in div.style ) {
                  return true;
               }
            }
            return false;
         };
      })(),

      supportTransform = supports('transform');

    function noop() {}

    function falseFn() {
      return false;
    }

    function setStyles( element, styles ) {

      var property,
          value;

      for ( property in styles ) {

        if ( styles.hasOwnProperty(property) ) {
          value = styles[property];

          switch ( property ) {
            case "height":
            case "width":
            case "marginLeft":
            case "marginTop":
              value += "px";
          }

          element.style[property] = value;

        }

      }

      return element;

    }

    function extend( destination, source ) {

      var property;

      for ( property in source ) {
        destination[property] = source[property];
      }

      return destination;

    }

    function proxy( fn, context ) {

      return function() {
        return fn.apply( context, Array.prototype.slice.call(arguments) );
      };

    }

    function getElementsByClassName( className, root ) {
      var elements;

      if ( $ ) {
        elements = $(root).find("." + className);
      } else {
        elements = Array.prototype.slice.call(root.getElementsByClassName( className ));
      }

      return elements;
    }

    function animate( element, propery, to, speed, callback ) {
      var propertyObj = {};

      propertyObj[propery] = to;

      if ($) {
        $(element).animate(propertyObj, speed, callback);
      } else {
        setStyles(element, propertyObj);
      }

    }

    /**
     * Returns an object containing the co-ordinates for the event, normalising for touch / non-touch.
     * @param {Object} event
     * @returns {Object}
     */
    function getCoords(event) {
      // touch move and touch end have different touch data
      var touches = event.touches,
          data = touches && touches.length ? touches : event.changedTouches;

      return {
        x: isTouch ? data[0].pageX : event.pageX,
        y: isTouch ? data[0].pageY : event.pageY
      };
    }

    function Dragend( container, settings ) {
      var defaultSettingsCopy = extend( {}, defaultSettings );

      this.settings      = extend( defaultSettingsCopy, settings );
      this.container     = container;
      this.pageContainer = doc.createElement( "div" );
      this.scrollBorder  = { x: 0, y: 0 };
      this.page          = 0;
      this.preventScroll = false;
      this.pageCssProperties = {
        margin: 0
      };

      // bind events
      this._onStart = proxy( this._onStart, this );
      this._onMove = proxy( this._onMove, this );
      this._onEnd = proxy( this._onEnd, this );
      this._onKeydown = proxy( this._onKeydown, this );
      this._sizePages = proxy( this._sizePages, this );
      this._afterScrollTransform = proxy(this._afterScrollTransform, this);

      this.pageContainer.innerHTML = container.cloneNode(true).innerHTML;
      container.innerHTML = "";
      container.appendChild( this.pageContainer );

      this._scroll = supportTransform ? this._scrollWithTransform : this._scrollWithoutTransform;
      this._animateScroll = supportTransform ? this._animateScrollWithTransform : this._animateScrollWithoutTransform;

      // Initialization

      setStyles(container, containerStyles);

      // Give the DOM some time to update ...
      setTimeout( proxy(function() {
          this.updateInstance( settings );
          if (!this.settings.preventDrag) {
            this._observe();
          }
          this.settings.afterInitialize.call(this);
      }, this), 10 );

    }

    function addEventListener(container, event, callback) {
      if ($) {
        $(container).on(event, callback);
      } else {
        container.addEventListener(event, callback, false);
      }
    }

    function removeEventListener(container, event, callback) {
      if ($) {
        $(container).off(event, callback);
      } else {
        container.removeEventListener(event, callback, false);
      }
    }

    extend(Dragend.prototype, {

      // Private functions
      // =================

      // ### Overscroll lookup table
      //
      // Checks if its the last or first page to slow down the scrolling if so
      //
      // Takes:
      // Drag event

      _checkOverscroll: function( direction, x, y ) {
        var coordinates = {
          x: x,
          y: y,
          overscroll: true
        };

        switch ( direction ) {

          case "right":
            if ( !this.scrollBorder.x ) {
              coordinates.x = Math.round((x - this.scrollBorder.x) / 5 );
              return coordinates;
            }
            break;

          case "left":
            if ( (this.pagesCount - 1) * this.pageDimentions.width <= this.scrollBorder.x ) {
              coordinates.x = Math.round( - ((Math.ceil(this.pagesCount) - 1) * (this.pageDimentions.width + this.settings.borderBetweenPages)) + x / 5 );
              return coordinates;
            }
            break;

          case "down":
            if ( !this.scrollBorder.y ) {
              coordinates.y = Math.round( (y - this.scrollBorder.y) / 5 );
              return coordinates;
            }
            break;

          case "up":
            if ( (this.pagesCount - 1) * this.pageDimentions.height <= this.scrollBorder.y ) {
              coordinates.y = Math.round( - ((Math.ceil(this.pagesCount) - 1) * (this.pageDimentions.height + this.settings.borderBetweenPages)) + y / 5 );
              return coordinates;
            }
            break;
        }

        return {
          x: x - this.scrollBorder.x,
          y: y - this.scrollBorder.y,
          overscroll: false
        };
      },

      // Observe
      //
      // Sets the observers for drag, resize and key events

      _observe: function() {

        addEventListener(this.container, startEvent, this._onStart);
        this.container.onselectstart = falseFn;
        this.container.ondragstart = falseFn;

        if ( this.settings.keyboardNavigation ) {
          addEventListener(doc.body, "keydown", this._onKeydown);
        }

        addEventListener(win, "resize", this._sizePages);

      },


      _onStart: function(event) {

        event = event.originalEvent || event;

        if (this.settings.stopPropagation) {
          event.stopPropagation();
        }

        addEventListener(doc.body, moveEvent, this._onMove);
        addEventListener(doc.body, endEvent, this._onEnd);

        this.startCoords = getCoords(event);

        this.settings.onDragStart.call( this, event );

      },

      _onMove: function( event ) {

        event = event.originalEvent || event;

        // ensure swiping with one touch and not pinching
        if ( event.touches && event.touches.length > 1 || event.scale && event.scale !== 1) return;

            //HACK - Nathan
            var coords = getCoords(event),
            x = this.startCoords.x - coords.x,
            y = this.startCoords.y - coords.y;

            if (Math.abs(y) > Math.abs(x)) return;
        
        event.preventDefault();
        if (this.settings.stopPropagation) {
          event.stopPropagation();
        }

        var parsedEvent = this._parseEvent(event),
            coordinates = this._checkOverscroll( parsedEvent.direction , - parsedEvent.distanceX, - parsedEvent.distanceY );

        this.settings.onDrag.call( this, this.activeElement, parsedEvent, coordinates.overscroll, event );

        if ( !this.preventScroll ) {
          this._scroll( coordinates );
        }
      },

      _onEnd: function( event ) {

        event = event.originalEvent || event;

        if (this.settings.stopPropagation) {
          event.stopPropagation();
        }

        var parsedEvent = this._parseEvent(event);

        this.startCoords = { x: 0, y: 0 };

        if ( Math.abs(parsedEvent.distanceX) > this.settings.minDragDistance || Math.abs(parsedEvent.distanceY) > this.settings.minDragDistance) {
          this.swipe( parsedEvent.direction );
        } else if (parsedEvent.distanceX > 0 || parsedEvent.distanceX > 0) {
          this._scrollToPage();
        }

        this.settings.onDragEnd.call( this, this.container, this.activeElement, this.page, event );

        removeEventListener(doc.body, moveEvent, this._onMove);
        removeEventListener(doc.body, endEvent, this._onEnd);

      },

      _parseEvent: function( event ) {
        var coords = getCoords(event),
            x = this.startCoords.x - coords.x,
            y = this.startCoords.y - coords.y;

        return this._addDistanceValues( x, y );
      },

      _addDistanceValues: function( x, y ) {
        var eventData = {
          distanceX: 0,
          distanceY: 0
        };

        if ( this.settings.direction === "horizontal" ) {
          eventData.distanceX = x;
          eventData.direction = x > 0 ? "left" : "right";
        } else {
          eventData.distanceY = y;
          eventData.direction = y > 0 ? "up" : "down";
        }

        return eventData;
      },

      _onKeydown: function( event ) {
        var direction = keycodes[event.keyCode];

        if ( direction ) {
          this._scrollToPage(direction);
        }
      },

      _setHorizontalContainerCssValues: function() {
        extend( this.pageCssProperties, {
          "cssFloat" : "left",
          "overflowY": "auto",
          "overflowX": "hidden",
          "padding"  : 0,
          "display"  : "block"
        });

        setStyles(this.pageContainer, {
          "overflow"                   : "hidden",
          "width"                      : (this.pageDimentions.width + this.settings.borderBetweenPages) * this.pagesCount,
          "boxSizing"                  : "content-box",
          "-webkit-backface-visibility": "hidden",
          "-webkit-perspective"        : 1000,
          "margin"                     : 0,
          "padding"                    : 0
        });
      },

      _setVerticalContainerCssValues: function() {
        extend( this.pageCssProperties, {
          "overflow": "hidden",
          "padding" : 0,
          "display" : "block"
        });

        setStyles(this.pageContainer, {
          "padding-bottom"              : this.settings.scribe,
          "boxSizing"                   : "content-box",
          "-webkit-backface-visibility" : "hidden",
          "-webkit-perspective"         : 1000,
          "margin"                      : 0
        });
      },

      setContainerCssValues: function(){
        if ( this.settings.direction === "horizontal") {
            this._setHorizontalContainerCssValues();
        } else {
            this._setVerticalContainerCssValues();
        }
      },

      // ### Calculate page dimentions
      //
      // Updates the page dimentions values

      _setPageDimentions: function() {
        var width  = this.container.offsetWidth,
            height = this.container.offsetHeight;

        if ( this.settings.direction === "horizontal" ) {
          width = width - parseInt( this.settings.scribe, 10 );
        } else {
          height = height - parseInt( this.settings.scribe, 10 );
        }

        this.pageDimentions = {
          width : width,
          height: height
        };

      },

      // ### Size pages

      _sizePages: function() {

        var pagesCount = this.pages.length;

        this._setPageDimentions();

        this.setContainerCssValues();
        if(this.settings.itemsInPage == 1){
          if ( this.settings.direction === "horizontal" ) {
            extend( this.pageCssProperties, {
              width : this.pageDimentions.width / this.settings.itemsInPage
            });
          } else {
            extend( this.pageCssProperties, {
              width : this.pageDimentions.width
            });
          } 
        }
        for (var i = 0; i < pagesCount; i++) {
          setStyles(this.pages[i], this.pageCssProperties);
        }

        this._jumpToPage( "page", this.page );

      },

      // ### Callculate new page
      //
      // Update global values for specific swipe action
      //
      // Takes direction and, if specific page is used the pagenumber

      _calcNewPage: function( direction, pageNumber ) {

        var borderBetweenPages = this.settings.borderBetweenPages,
            height = this.pageDimentions.height,
            width = this.pageDimentions.width,
            page = this.page;

        switch ( direction ) {
          case "up":
            if ( page < this.pagesCount - 1 ) {
              this.scrollBorder.y = this.scrollBorder.y + height + borderBetweenPages;
              this.page++;
            }
            break;

          case "down":
            if ( page > 0 ) {
              this.scrollBorder.y = this.scrollBorder.y - height - borderBetweenPages;
              this.page--;
            }
            break;

          case "left":
            if ( page < this.pagesCount - 1 ) {
              this.scrollBorder.x = this.scrollBorder.x + width + borderBetweenPages;
              this.page++;
            }
            break;

          case "right":
            if ( page > 0 ) {
              this.scrollBorder.x = this.scrollBorder.x - width - borderBetweenPages;
              this.page--;
            }
            break;

          case "page":
            switch ( this.settings.direction ) {
              case "horizontal":
                this.scrollBorder.x = (width + borderBetweenPages) * pageNumber;
                break;

              case "vertical":
                this.scrollBorder.y = (height + borderBetweenPages) * pageNumber;
                break;
            }
            this.page = pageNumber;
            break;

          default:
            this.scrollBorder.y = 0;
            this.scrollBorder.x = 0;
            this.page           = 0;
            break;
        }
      },

      // ### On swipe end
      //
      // Function called after the scroll animation ended

      _onSwipeEnd: function() {
        this.preventScroll = false;

        this.activeElement = this.pages[this.page * this.settings.itemsInPage];

        // Call onSwipeEnd callback function
        this.settings.onSwipeEnd.call( this, this.container, this.activeElement, this.page);
      },

      // Jump to page
      //
      // Jumps without a animantion to specific page. The page number is only
      // necessary for the specific page direction
      //
      // Takes:
      // Direction and pagenumber

      _jumpToPage: function( options, pageNumber ) {

        if ( options ) {
          this._calcNewPage( options, pageNumber );
        }

        this._scroll({
          x: - this.scrollBorder.x,
          y: - this.scrollBorder.y
        });
      },

      // Scroll to page
      //
      // Scrolls with a animantion to specific page. The page number is only necessary
      // for the specific page direction
      //
      // Takes:
      // Direction and pagenumber

      _scrollToPage: function( options, pageNumber ) {
        this.preventScroll = true;

        if ( options ) this._calcNewPage( options, pageNumber );

        this._animateScroll();
      },

      // ### Scroll translate
      //
      // Animation when translate is supported
      //
      // Takes:
      // x and y values to go with

      _scrollWithTransform: function ( coordinates ) {
        var style = this.settings.direction === "horizontal" ? "translateX(" + coordinates.x + "px)" : "translateY(" + coordinates.y + "px)";

        setStyles( this.pageContainer, {
          "-webkit-transform": style,
          "-moz-transform": style,
          "-ms-transform": style,
          "-o-transform": style,
          "transform": style
        });

      },

      // ### Animated scroll with translate support

      _animateScrollWithTransform: function() {

        var style = "transform " + this.settings.duration + "ms ease-out",
            container = this.container,
            afterScrollTransform = this._afterScrollTransform;

        setStyles( this.pageContainer, {
          "-webkit-transition": "-webkit-" + style,
          "-moz-transition": "-moz-" + style,
          "-ms-transition": "-ms-" + style,
          "-o-transition": "-o-" + style,
          "transition": style
        });

        this._scroll({
          x: - this.scrollBorder.x,
          y: - this.scrollBorder.y
        });

        addEventListener(this.container, "webkitTransitionEnd", afterScrollTransform);
        addEventListener(this.container, "oTransitionEnd", afterScrollTransform);
        addEventListener(this.container, "transitionend", afterScrollTransform);
        addEventListener(this.container, "transitionEnd", afterScrollTransform);

      },

      _afterScrollTransform: function() {

        var container = this.container,
            afterScrollTransform = this._afterScrollTransform;

        this._onSwipeEnd();

        removeEventListener(container, "webkitTransitionEnd", afterScrollTransform);
        removeEventListener(container, "oTransitionEnd", afterScrollTransform);
        removeEventListener(container, "transitionend", afterScrollTransform);
        removeEventListener(container, "transitionEnd", afterScrollTransform);

        setStyles( this.pageContainer, {
          "-webkit-transition": "",
          "-moz-transition": "",
          "-ms-transition": "",
          "-o-transition": "",
          "transition": ""
        });

      },

      // ### Scroll fallback
      //
      // Animation lookup table  when translate isn't supported
      //
      // Takes:
      // x and y values to go with

      _scrollWithoutTransform: function( coordinates ) {
        var styles = this.settings.direction === "horizontal" ? { "marginLeft": coordinates.x } : { "marginTop": coordinates.y };

        setStyles(this.pageContainer, styles);
      },

      // ### Animated scroll without translate support

      _animateScrollWithoutTransform: function() {
        var property = this.settings.direction === "horizontal" ? "marginLeft" : "marginTop",
            value = this.settings.direction === "horizontal" ? - this.scrollBorder.x : - this.scrollBorder.y;

        animate( this.pageContainer, property, value, this.settings.duration, proxy( this._onSwipeEnd, this ));

      },

      // Public functions
      // ================

      swipe: function( direction ) {
        // Call onSwipeStart callback function
        this.settings.onSwipeStart.call( this, this.container, this.activeElement, this.page );
        this._scrollToPage( direction );
      },

      updateInstance: function( settings ) {

        settings = settings || {};

        if ( typeof settings === "object" ) extend( this.settings, settings );

        this.pages = getElementsByClassName(this.settings.pageClass, this.pageContainer);

        if (this.pages.length) {
          this.pagesCount = this.pages.length / this.settings.itemsInPage;
        } else {
          throw new Error(errors.pages);
        }

        this.activeElement = this.pages[this.page * this.settings.itemsInPage];
        this._sizePages();

        if ( this.settings.jumpToPage ) {
          this.jumpToPage( settings.jumpToPage );
          delete this.settings.jumpToPage;
        }

        if ( this.settings.scrollToPage ) {
          this.scrollToPage( this.settings.scrollToPage );
          delete this.settings.scrollToPage;
        }
		
        if (this.settings.destroy) {
          this.destroy();
          delete this.settings.destroy;
        }

      },

      destroy: function() {

        var container = this.container;

        removeEventListener(container, startEvent);
        removeEventListener(container, moveEvent);
        removeEventListener(container, endEvent);
        removeEventListener(doc.body, "keydown", this._onKeydown);
        removeEventListener(win, "resize", this._sizePages);

        container.removeAttribute("style");

        for (var i = 0; i < this.pages.length; i++) {
          this.pages[i].removeAttribute("style");
        }

        container.innerHTML = this.pageContainer.innerHTML;

      },

      scrollToPage: function( page ) {
        this._scrollToPage( "page", page - 1);
      },

      jumpToPage: function( page ) {
        this._jumpToPage( "page", page - 1);
      }

    });

    if ( $ ) {

        // Register jQuery plugin
        $.fn.dragend = function( settings ) {

          settings = settings || {};

          this.each(function() {
            var instance = $(this).data( "dragend" );

            // check if instance already created
            if ( instance ) {
              instance.updateInstance( settings );
            } else {
              instance = new Dragend( this, settings );
              $(this).data( "dragend", instance );
            }

            // check if should trigger swipe
            if ( typeof settings === "string" ) instance.swipe( settings );

          });

          // jQuery functions should always return the instance
          return this;
        };

    }

    return Dragend;

  }

  if ( typeof define == 'function' && typeof define.amd == 'object' && define.amd ) {
      define(function() {
        return init( win.jQuery || win.Zepto );
      });
  } else {
      win.Dragend = init( win.jQuery || win.Zepto );
  }

})( window );
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


/**
 * Featherlight - ultra slim jQuery lightbox
 * Version 1.4.1 - http://noelboss.github.io/featherlight/
 *
 * Copyright 2016, Noël Raoul Bossart (http://www.noelboss.com)
 * MIT Licensed.
**/
(function($) {
	"use strict";

	if('undefined' === typeof $) {
		if('console' in window){ window.console.info('Too much lightness, Featherlight needs jQuery.'); }
		return;
	}

	/* Featherlight is exported as $.featherlight.
	   It is a function used to open a featherlight lightbox.

	   [tech]
	   Featherlight uses prototype inheritance.
	   Each opened lightbox will have a corresponding object.
	   That object may have some attributes that override the
	   prototype's.
	   Extensions created with Featherlight.extend will have their
	   own prototype that inherits from Featherlight's prototype,
	   thus attributes can be overriden either at the object level,
	   or at the extension level.
	   To create callbacks that chain themselves instead of overriding,
	   use chainCallbacks.
	   For those familiar with CoffeeScript, this correspond to
	   Featherlight being a class and the Gallery being a class
	   extending Featherlight.
	   The chainCallbacks is used since we don't have access to
	   CoffeeScript's `super`.
	*/

	function Featherlight($content, config) {
		if(this instanceof Featherlight) {  /* called with new */
			this.id = Featherlight.id++;
			this.setup($content, config);
			this.chainCallbacks(Featherlight._callbackChain);
		} else {
			var fl = new Featherlight($content, config);
			fl.open();
			return fl;
		}
	}

	var opened = [],
		pruneOpened = function(remove) {
			opened = $.grep(opened, function(fl) {
				return fl !== remove && fl.$instance.closest('body').length > 0;
			} );
			return opened;
		};

	// structure({iframeMinHeight: 44, foo: 0}, 'iframe')
	//   #=> {min-height: 44}
	var structure = function(obj, prefix) {
		var result = {},
			regex = new RegExp('^' + prefix + '([A-Z])(.*)');
		for (var key in obj) {
			var match = key.match(regex);
			if (match) {
				var dasherized = (match[1] + match[2].replace(/([A-Z])/g, '-$1')).toLowerCase();
				result[dasherized] = obj[key];
			}
		}
		return result;
	};

	/* document wide key handler */
	var eventMap = { keyup: 'onKeyUp', resize: 'onResize' };

	var globalEventHandler = function(event) {
		$.each(Featherlight.opened().reverse(), function() {
			if (!event.isDefaultPrevented()) {
				if (false === this[eventMap[event.type]](event)) {
					event.preventDefault(); event.stopPropagation(); return false;
			  }
			}
		});
	};

	var toggleGlobalEvents = function(set) {
			if(set !== Featherlight._globalHandlerInstalled) {
				Featherlight._globalHandlerInstalled = set;
				var events = $.map(eventMap, function(_, name) { return name+'.'+Featherlight.prototype.namespace; } ).join(' ');
				$(window)[set ? 'on' : 'off'](events, globalEventHandler);
			}
		};

	Featherlight.prototype = {
		constructor: Featherlight,
		/*** defaults ***/
		/* extend featherlight with defaults and methods */
		namespace:      'featherlight',        /* Name of the events and css class prefix */
		targetAttr:     'data-featherlight',   /* Attribute of the triggered element that contains the selector to the lightbox content */
		variant:        null,                  /* Class that will be added to change look of the lightbox */
		resetCss:       false,                 /* Reset all css */
		background:     null,                  /* Custom DOM for the background, wrapper and the closebutton */
		openTrigger:    'click',               /* Event that triggers the lightbox */
		closeTrigger:   'click',               /* Event that triggers the closing of the lightbox */
		filter:         null,                  /* Selector to filter events. Think $(...).on('click', filter, eventHandler) */
		root:           'body',                /* Where to append featherlights */
		openSpeed:      250,                   /* Duration of opening animation */
		closeSpeed:     250,                   /* Duration of closing animation */
		closeOnClick:   'background',          /* Close lightbox on click ('background', 'anywhere' or false) */
		closeOnEsc:     true,                  /* Close lightbox when pressing esc */
		closeIcon:      '&#10005;',            /* Close icon */
		loading:        '',                    /* Content to show while initial content is loading */
		persist:        false,                 /* If set, the content will persist and will be shown again when opened again. 'shared' is a special value when binding multiple elements for them to share the same content */
		otherClose:     null,                  /* Selector for alternate close buttons (e.g. "a.close") */
		beforeOpen:     $.noop,                /* Called before open. can return false to prevent opening of lightbox. Gets event as parameter, this contains all data */
		beforeContent:  $.noop,                /* Called when content is loaded. Gets event as parameter, this contains all data */
		beforeClose:    $.noop,                /* Called before close. can return false to prevent opening of lightbox. Gets event as parameter, this contains all data */
		afterOpen:      $.noop,                /* Called after open. Gets event as parameter, this contains all data */
		afterContent:   $.noop,                /* Called after content is ready and has been set. Gets event as parameter, this contains all data */
		afterClose:     $.noop,                /* Called after close. Gets event as parameter, this contains all data */
		onKeyUp:        $.noop,                /* Called on key up for the frontmost featherlight */
		onResize:       $.noop,                /* Called after new content and when a window is resized */
		type:           null,                  /* Specify type of lightbox. If unset, it will check for the targetAttrs value. */
		contentFilters: ['jquery', 'image', 'html', 'ajax', 'iframe', 'text'], /* List of content filters to use to determine the content */

		/*** methods ***/
		/* setup iterates over a single instance of featherlight and prepares the background and binds the events */
		setup: function(target, config){
			/* all arguments are optional */
			if (typeof target === 'object' && target instanceof $ === false && !config) {
				config = target;
				target = undefined;
			}

			var self = $.extend(this, config, {target: target}),
				css = !self.resetCss ? self.namespace : self.namespace+'-reset', /* by adding -reset to the classname, we reset all the default css */
				$background = $(self.background || [
					'<div class="'+css+'-loading '+css+'">',
						'<div class="'+css+'-content">',
							'<span class="'+css+'-close-icon '+ self.namespace + '-close">',
								self.closeIcon,
							'</span>',
							'<div class="'+self.namespace+'-inner">' + self.loading + '</div>',
						'</div>',
					'</div>'].join('')),
				closeButtonSelector = '.'+self.namespace+'-close' + (self.otherClose ? ',' + self.otherClose : '');

			self.$instance = $background.clone().addClass(self.variant); /* clone DOM for the background, wrapper and the close button */

			/* close when click on background/anywhere/null or closebox */
			self.$instance.on(self.closeTrigger+'.'+self.namespace, function(event) {
				var $target = $(event.target);
				if( ('background' === self.closeOnClick  && $target.is('.'+self.namespace))
					|| 'anywhere' === self.closeOnClick
					|| $target.closest(closeButtonSelector).length ){
					self.close(event);
					event.preventDefault();
				}
			});

			return this;
		},

		/* this method prepares the content and converts it into a jQuery object or a promise */
		getContent: function(){
			if(this.persist !== false && this.$content) {
				return this.$content;
			}
			var self = this,
				filters = this.constructor.contentFilters,
				readTargetAttr = function(name){ return self.$currentTarget && self.$currentTarget.attr(name); },
				targetValue = readTargetAttr(self.targetAttr),
				data = self.target || targetValue || '';

			/* Find which filter applies */
			var filter = filters[self.type]; /* check explicit type like {type: 'image'} */

			/* check explicit type like data-featherlight="image" */
			if(!filter && data in filters) {
				filter = filters[data];
				data = self.target && targetValue;
			}
			data = data || readTargetAttr('href') || '';

			/* check explicity type & content like {image: 'photo.jpg'} */
			if(!filter) {
				for(var filterName in filters) {
					if(self[filterName]) {
						filter = filters[filterName];
						data = self[filterName];
					}
				}
			}

			/* otherwise it's implicit, run checks */
			if(!filter) {
				var target = data;
				data = null;
				$.each(self.contentFilters, function() {
					filter = filters[this];
					if(filter.test)  {
						data = filter.test(target);
					}
					if(!data && filter.regex && target.match && target.match(filter.regex)) {
						data = target;
					}
					return !data;
				});
				if(!data) {
					if('console' in window){ window.console.error('Featherlight: no content filter found ' + (target ? ' for "' + target + '"' : ' (no target specified)')); }
					return false;
				}
			}
			/* Process it */
			return filter.process.call(self, data);
		},

		/* sets the content of $instance to $content */
		setContent: function($content){
			var self = this;
			/* we need a special class for the iframe */
			if($content.is('iframe') || $('iframe', $content).length > 0){
				self.$instance.addClass(self.namespace+'-iframe');
			}

			self.$instance.removeClass(self.namespace+'-loading');

			/* replace content by appending to existing one before it is removed
			   this insures that featherlight-inner remain at the same relative
				 position to any other items added to featherlight-content */
			self.$instance.find('.'+self.namespace+'-inner')
				.not($content)                /* excluded new content, important if persisted */
				.slice(1).remove().end()      /* In the unexpected event where there are many inner elements, remove all but the first one */
				.replaceWith($.contains(self.$instance[0], $content[0]) ? '' : $content);

			self.$content = $content.addClass(self.namespace+'-inner');

			return self;
		},

		/* opens the lightbox. "this" contains $instance with the lightbox, and with the config.
			Returns a promise that is resolved after is successfully opened. */
		open: function(event){
			var self = this;
			self.$instance.hide().appendTo(self.root);
			if((!event || !event.isDefaultPrevented())
				&& self.beforeOpen(event) !== false) {

				if(event){
					event.preventDefault();
				}
				var $content = self.getContent();

				if($content) {
					opened.push(self);

					toggleGlobalEvents(true);

					self.$instance.fadeIn(self.openSpeed);
					self.beforeContent(event);

					/* Set content and show */
					return $.when($content)
						.always(function($content){
							self.setContent($content);
							self.afterContent(event);
						})
						.then(self.$instance.promise())
						/* Call afterOpen after fadeIn is done */
						.done(function(){ self.afterOpen(event); });
				}
			}
			self.$instance.detach();
			return $.Deferred().reject().promise();
		},

		/* closes the lightbox. "this" contains $instance with the lightbox, and with the config
			returns a promise, resolved after the lightbox is successfully closed. */
		close: function(event){
			var self = this,
				deferred = $.Deferred();

			if(self.beforeClose(event) === false) {
				deferred.reject();
			} else {

				if (0 === pruneOpened(self).length) {
					toggleGlobalEvents(false);
				}

				self.$instance.fadeOut(self.closeSpeed,function(){
					self.$instance.detach();
					self.afterClose(event);
					deferred.resolve();
				});
			}
			return deferred.promise();
		},

		/* resizes the content so it fits in visible area and keeps the same aspect ratio.
				Does nothing if either the width or the height is not specified.
				Called automatically on window resize.
				Override if you want different behavior. */
		resize: function(w, h) {
			if (w && h) {
				/* Reset apparent image size first so container grows */
				this.$content.css('width', '').css('height', '');
				/* Calculate the worst ratio so that dimensions fit */
				var ratio = Math.max(
					w  / parseInt(this.$content.parent().css('width'),10),
					h / parseInt(this.$content.parent().css('height'),10));
				/* Resize content */
				if (ratio > 1) {
					this.$content.css('width', '' + w / ratio + 'px').css('height', '' + h / ratio + 'px');
				}
			}
		},

		/* Utility function to chain callbacks
		   [Warning: guru-level]
		   Used be extensions that want to let users specify callbacks but
		   also need themselves to use the callbacks.
		   The argument 'chain' has callback names as keys and function(super, event)
		   as values. That function is meant to call `super` at some point.
		*/
		chainCallbacks: function(chain) {
			for (var name in chain) {
				this[name] = $.proxy(chain[name], this, $.proxy(this[name], this));
			}
		}
	};

	$.extend(Featherlight, {
		id: 0,                                    /* Used to id single featherlight instances */
		autoBind:       '[data-featherlight]',    /* Will automatically bind elements matching this selector. Clear or set before onReady */
		defaults:       Featherlight.prototype,   /* You can access and override all defaults using $.featherlight.defaults, which is just a synonym for $.featherlight.prototype */
		/* Contains the logic to determine content */
		contentFilters: {
			jquery: {
				regex: /^[#.]\w/,         /* Anything that starts with a class name or identifiers */
				test: function(elem)    { return elem instanceof $ && elem; },
				process: function(elem) { return this.persist !== false ? $(elem) : $(elem).clone(true); }
			},
			image: {
				regex: /\.(png|jpg|jpeg|gif|tiff|bmp|svg)(\?\S*)?$/i,
				process: function(url)  {
					var self = this,
						deferred = $.Deferred(),
						img = new Image(),
						$img = $('<img src="'+url+'" alt="" class="'+self.namespace+'-image" />');
					img.onload  = function() {
						/* Store naturalWidth & height for IE8 */
						$img.naturalWidth = img.width; $img.naturalHeight = img.height;
						deferred.resolve( $img );
					};
					img.onerror = function() { deferred.reject($img); };
					img.src = url;
					return deferred.promise();
				}
			},
			html: {
				regex: /^\s*<[\w!][^<]*>/, /* Anything that starts with some kind of valid tag */
				process: function(html) { return $(html); }
			},
			ajax: {
				regex: /./,            /* At this point, any content is assumed to be an URL */
				process: function(url)  {
					var self = this,
						deferred = $.Deferred();
					/* we are using load so one can specify a target with: url.html #targetelement */
					var $container = $('<div></div>').load(url, function(response, status){
						if ( status !== "error" ) {
							deferred.resolve($container.contents());
						}
						deferred.fail();
					});
					return deferred.promise();
				}
			},
			iframe: {
				process: function(url) {
					var deferred = new $.Deferred();
					var $content = $('<iframe/>')
						.hide()
						.attr('src', url)
						.css(structure(this, 'iframe'))
						.on('load', function() { deferred.resolve($content.show()); })
						// We can't move an <iframe> and avoid reloading it,
						// so let's put it in place ourselves right now:
						.appendTo(this.$instance.find('.' + this.namespace + '-content'));
					return deferred.promise();
				}
			},
			text: {
				process: function(text) { return $('<div>', {text: text}); }
			}
		},

		functionAttributes: ['beforeOpen', 'afterOpen', 'beforeContent', 'afterContent', 'beforeClose', 'afterClose'],

		/*** class methods ***/
		/* read element's attributes starting with data-featherlight- */
		readElementConfig: function(element, namespace) {
			var Klass = this,
				regexp = new RegExp('^data-' + namespace + '-(.*)'),
				config = {};
			if (element && element.attributes) {
				$.each(element.attributes, function(){
					var match = this.name.match(regexp);
					if (match) {
						var val = this.value,
							name = $.camelCase(match[1]);
						if ($.inArray(name, Klass.functionAttributes) >= 0) {  /* jshint -W054 */
							val = new Function(val);                           /* jshint +W054 */
						} else {
							try { val = $.parseJSON(val); }
							catch(e) {}
						}
						config[name] = val;
					}
				});
			}
			return config;
		},

		/* Used to create a Featherlight extension
		   [Warning: guru-level]
		   Creates the extension's prototype that in turn
		   inherits Featherlight's prototype.
		   Could be used to extend an extension too...
		   This is pretty high level wizardy, it comes pretty much straight
		   from CoffeeScript and won't teach you anything about Featherlight
		   as it's not really specific to this library.
		   My suggestion: move along and keep your sanity.
		*/
		extend: function(child, defaults) {
			/* Setup class hierarchy, adapted from CoffeeScript */
			var Ctor = function(){ this.constructor = child; };
			Ctor.prototype = this.prototype;
			child.prototype = new Ctor();
			child.__super__ = this.prototype;
			/* Copy class methods & attributes */
			$.extend(child, this, defaults);
			child.defaults = child.prototype;
			return child;
		},

		attach: function($source, $content, config) {
			var Klass = this;
			if (typeof $content === 'object' && $content instanceof $ === false && !config) {
				config = $content;
				$content = undefined;
			}
			/* make a copy */
			config = $.extend({}, config);

			/* Only for openTrigger and namespace... */
			var namespace = config.namespace || Klass.defaults.namespace,
				tempConfig = $.extend({}, Klass.defaults, Klass.readElementConfig($source[0], namespace), config),
				sharedPersist;

			$source.on(tempConfig.openTrigger+'.'+tempConfig.namespace, tempConfig.filter, function(event) {
				/* ... since we might as well compute the config on the actual target */
				var elemConfig = $.extend(
					{$source: $source, $currentTarget: $(this)},
					Klass.readElementConfig($source[0], tempConfig.namespace),
					Klass.readElementConfig(this, tempConfig.namespace),
					config);
				var fl = sharedPersist || $(this).data('featherlight-persisted') || new Klass($content, elemConfig);
				if(fl.persist === 'shared') {
					sharedPersist = fl;
				} else if(fl.persist !== false) {
					$(this).data('featherlight-persisted', fl);
				}
				elemConfig.$currentTarget.blur(); // Otherwise 'enter' key might trigger the dialog again
				fl.open(event);
			});
			return $source;
		},

		current: function() {
			var all = this.opened();
			return all[all.length - 1] || null;
		},

		opened: function() {
			var klass = this;
			pruneOpened();
			return $.grep(opened, function(fl) { return fl instanceof klass; } );
		},

		close: function(event) {
			var cur = this.current();
			if(cur) { return cur.close(event); }
		},

		/* Does the auto binding on startup.
		   Meant only to be used by Featherlight and its extensions
		*/
		_onReady: function() {
			var Klass = this;
			if(Klass.autoBind){
				/* Bind existing elements */
				$(Klass.autoBind).each(function(){
					Klass.attach($(this));
				});
				/* If a click propagates to the document level, then we have an item that was added later on */
				$(document).on('click', Klass.autoBind, function(evt) {
					if (evt.isDefaultPrevented() || evt.namespace === 'featherlight') {
						return;
					}
					evt.preventDefault();
					/* Bind featherlight */
					Klass.attach($(evt.currentTarget));
					/* Click again; this time our binding will catch it */
					$(evt.target).trigger('click.featherlight');
				});
			}
		},

		/* Featherlight uses the onKeyUp callback to intercept the escape key.
		   Private to Featherlight.
		*/
		_callbackChain: {
			onKeyUp: function(_super, event){
				if(27 === event.keyCode) {
					if (this.closeOnEsc) {
						$.featherlight.close(event);
					}
					return false;
				} else {
					return _super(event);
				}
			},

			onResize: function(_super, event){
				this.resize(this.$content.naturalWidth, this.$content.naturalHeight);
				return _super(event);
			},

			afterContent: function(_super, event){
				var r = _super(event);
				this.onResize(event);
				return r;
			}
		}
	});

	$.featherlight = Featherlight;

	/* bind jQuery elements to trigger featherlight */
	$.fn.featherlight = function($content, config) {
		return Featherlight.attach(this, $content, config);
	};

	/* bind featherlight on ready if config autoBind is set */
	$(document).ready(function(){ Featherlight._onReady(); });
}(jQuery));

/*!
 * Isotope PACKAGED v3.0.0
 *
 * Licensed GPLv3 for open source use
 * or Isotope Commercial License for commercial use
 *
 * http://isotope.metafizzy.co
 * Copyright 2016 Metafizzy
 */

/**
 * Bridget makes jQuery widgets
 * v2.0.0
 * MIT license
 */

/* jshint browser: true, strict: true, undef: true, unused: true */

( function( window, factory ) {
  'use strict';
  /* globals define: false, module: false, require: false */

  if ( typeof define == 'function' && define.amd ) {
    // AMD
    define( 'jquery-bridget/jquery-bridget',[ 'jquery' ], function( jQuery ) {
      factory( window, jQuery );
    });
  } else if ( typeof module == 'object' && module.exports ) {
    // CommonJS
    module.exports = factory(
      window,
      require('jquery')
    );
  } else {
    // browser global
    window.jQueryBridget = factory(
      window,
      window.jQuery
    );
  }

}( window, function factory( window, jQuery ) {
'use strict';

// ----- utils ----- //

var arraySlice = Array.prototype.slice;

// helper function for logging errors
// $.error breaks jQuery chaining
var console = window.console;
var logError = typeof console == 'undefined' ? function() {} :
  function( message ) {
    console.error( message );
  };

// ----- jQueryBridget ----- //

function jQueryBridget( namespace, PluginClass, $ ) {
  $ = $ || jQuery || window.jQuery;
  if ( !$ ) {
    return;
  }

  // add option method -> $().plugin('option', {...})
  if ( !PluginClass.prototype.option ) {
    // option setter
    PluginClass.prototype.option = function( opts ) {
      // bail out if not an object
      if ( !$.isPlainObject( opts ) ){
        return;
      }
      this.options = $.extend( true, this.options, opts );
    };
  }

  // make jQuery plugin
  $.fn[ namespace ] = function( arg0 /*, arg1 */ ) {
    if ( typeof arg0 == 'string' ) {
      // method call $().plugin( 'methodName', { options } )
      // shift arguments by 1
      var args = arraySlice.call( arguments, 1 );
      return methodCall( this, arg0, args );
    }
    // just $().plugin({ options })
    plainCall( this, arg0 );
    return this;
  };

  // $().plugin('methodName')
  function methodCall( $elems, methodName, args ) {
    var returnValue;
    var pluginMethodStr = '$().' + namespace + '("' + methodName + '")';

    $elems.each( function( i, elem ) {
      // get instance
      var instance = $.data( elem, namespace );
      if ( !instance ) {
        logError( namespace + ' not initialized. Cannot call methods, i.e. ' +
          pluginMethodStr );
        return;
      }

      var method = instance[ methodName ];
      if ( !method || methodName.charAt(0) == '_' ) {
        logError( pluginMethodStr + ' is not a valid method' );
        return;
      }

      // apply method, get return value
      var value = method.apply( instance, args );
      // set return value if value is returned, use only first value
      returnValue = returnValue === undefined ? value : returnValue;
    });

    return returnValue !== undefined ? returnValue : $elems;
  }

  function plainCall( $elems, options ) {
    $elems.each( function( i, elem ) {
      var instance = $.data( elem, namespace );
      if ( instance ) {
        // set options & init
        instance.option( options );
        instance._init();
      } else {
        // initialize new instance
        instance = new PluginClass( elem, options );
        $.data( elem, namespace, instance );
      }
    });
  }

  updateJQuery( $ );

}

// ----- updateJQuery ----- //

// set $.bridget for v1 backwards compatibility
function updateJQuery( $ ) {
  if ( !$ || ( $ && $.bridget ) ) {
    return;
  }
  $.bridget = jQueryBridget;
}

updateJQuery( jQuery || window.jQuery );

// -----  ----- //

return jQueryBridget;

}));

/**
 * EvEmitter v1.0.2
 * Lil' event emitter
 * MIT License
 */

/* jshint unused: true, undef: true, strict: true */

( function( global, factory ) {
  // universal module definition
  /* jshint strict: false */ /* globals define, module */
  if ( typeof define == 'function' && define.amd ) {
    // AMD - RequireJS
    define( 'ev-emitter/ev-emitter',factory );
  } else if ( typeof module == 'object' && module.exports ) {
    // CommonJS - Browserify, Webpack
    module.exports = factory();
  } else {
    // Browser globals
    global.EvEmitter = factory();
  }

}( this, function() {



function EvEmitter() {}

var proto = EvEmitter.prototype;

proto.on = function( eventName, listener ) {
  if ( !eventName || !listener ) {
    return;
  }
  // set events hash
  var events = this._events = this._events || {};
  // set listeners array
  var listeners = events[ eventName ] = events[ eventName ] || [];
  // only add once
  if ( listeners.indexOf( listener ) == -1 ) {
    listeners.push( listener );
  }

  return this;
};

proto.once = function( eventName, listener ) {
  if ( !eventName || !listener ) {
    return;
  }
  // add event
  this.on( eventName, listener );
  // set once flag
  // set onceEvents hash
  var onceEvents = this._onceEvents = this._onceEvents || {};
  // set onceListeners object
  var onceListeners = onceEvents[ eventName ] = onceEvents[ eventName ] || {};
  // set flag
  onceListeners[ listener ] = true;

  return this;
};

proto.off = function( eventName, listener ) {
  var listeners = this._events && this._events[ eventName ];
  if ( !listeners || !listeners.length ) {
    return;
  }
  var index = listeners.indexOf( listener );
  if ( index != -1 ) {
    listeners.splice( index, 1 );
  }

  return this;
};

proto.emitEvent = function( eventName, args ) {
  var listeners = this._events && this._events[ eventName ];
  if ( !listeners || !listeners.length ) {
    return;
  }
  var i = 0;
  var listener = listeners[i];
  args = args || [];
  // once stuff
  var onceListeners = this._onceEvents && this._onceEvents[ eventName ];

  while ( listener ) {
    var isOnce = onceListeners && onceListeners[ listener ];
    if ( isOnce ) {
      // remove listener
      // remove before trigger to prevent recursion
      this.off( eventName, listener );
      // unset once flag
      delete onceListeners[ listener ];
    }
    // trigger listener
    listener.apply( this, args );
    // get next listener
    i += isOnce ? 0 : 1;
    listener = listeners[i];
  }

  return this;
};

return EvEmitter;

}));

/*!
 * getSize v2.0.2
 * measure size of elements
 * MIT license
 */

/*jshint browser: true, strict: true, undef: true, unused: true */
/*global define: false, module: false, console: false */

( function( window, factory ) {
  'use strict';

  if ( typeof define == 'function' && define.amd ) {
    // AMD
    define( 'get-size/get-size',[],function() {
      return factory();
    });
  } else if ( typeof module == 'object' && module.exports ) {
    // CommonJS
    module.exports = factory();
  } else {
    // browser global
    window.getSize = factory();
  }

})( window, function factory() {
'use strict';

// -------------------------- helpers -------------------------- //

// get a number from a string, not a percentage
function getStyleSize( value ) {
  var num = parseFloat( value );
  // not a percent like '100%', and a number
  var isValid = value.indexOf('%') == -1 && !isNaN( num );
  return isValid && num;
}

function noop() {}

var logError = typeof console == 'undefined' ? noop :
  function( message ) {
    console.error( message );
  };

// -------------------------- measurements -------------------------- //

var measurements = [
  'paddingLeft',
  'paddingRight',
  'paddingTop',
  'paddingBottom',
  'marginLeft',
  'marginRight',
  'marginTop',
  'marginBottom',
  'borderLeftWidth',
  'borderRightWidth',
  'borderTopWidth',
  'borderBottomWidth'
];

var measurementsLength = measurements.length;

function getZeroSize() {
  var size = {
    width: 0,
    height: 0,
    innerWidth: 0,
    innerHeight: 0,
    outerWidth: 0,
    outerHeight: 0
  };
  for ( var i=0; i < measurementsLength; i++ ) {
    var measurement = measurements[i];
    size[ measurement ] = 0;
  }
  return size;
}

// -------------------------- getStyle -------------------------- //

/**
 * getStyle, get style of element, check for Firefox bug
 * https://bugzilla.mozilla.org/show_bug.cgi?id=548397
 */
function getStyle( elem ) {
  var style = getComputedStyle( elem );
  if ( !style ) {
    logError( 'Style returned ' + style +
      '. Are you running this code in a hidden iframe on Firefox? ' +
      'See http://bit.ly/getsizebug1' );
  }
  return style;
}

// -------------------------- setup -------------------------- //

var isSetup = false;

var isBoxSizeOuter;

/**
 * setup
 * check isBoxSizerOuter
 * do on first getSize() rather than on page load for Firefox bug
 */
function setup() {
  // setup once
  if ( isSetup ) {
    return;
  }
  isSetup = true;

  // -------------------------- box sizing -------------------------- //

  /**
   * WebKit measures the outer-width on style.width on border-box elems
   * IE & Firefox<29 measures the inner-width
   */
  var div = document.createElement('div');
  div.style.width = '200px';
  div.style.padding = '1px 2px 3px 4px';
  div.style.borderStyle = 'solid';
  div.style.borderWidth = '1px 2px 3px 4px';
  div.style.boxSizing = 'border-box';

  var body = document.body || document.documentElement;
  body.appendChild( div );
  var style = getStyle( div );

  getSize.isBoxSizeOuter = isBoxSizeOuter = getStyleSize( style.width ) == 200;
  body.removeChild( div );

}

// -------------------------- getSize -------------------------- //

function getSize( elem ) {
  setup();

  // use querySeletor if elem is string
  if ( typeof elem == 'string' ) {
    elem = document.querySelector( elem );
  }

  // do not proceed on non-objects
  if ( !elem || typeof elem != 'object' || !elem.nodeType ) {
    return;
  }

  var style = getStyle( elem );

  // if hidden, everything is 0
  if ( style.display == 'none' ) {
    return getZeroSize();
  }

  var size = {};
  size.width = elem.offsetWidth;
  size.height = elem.offsetHeight;

  var isBorderBox = size.isBorderBox = style.boxSizing == 'border-box';

  // get all measurements
  for ( var i=0; i < measurementsLength; i++ ) {
    var measurement = measurements[i];
    var value = style[ measurement ];
    var num = parseFloat( value );
    // any 'auto', 'medium' value will be 0
    size[ measurement ] = !isNaN( num ) ? num : 0;
  }

  var paddingWidth = size.paddingLeft + size.paddingRight;
  var paddingHeight = size.paddingTop + size.paddingBottom;
  var marginWidth = size.marginLeft + size.marginRight;
  var marginHeight = size.marginTop + size.marginBottom;
  var borderWidth = size.borderLeftWidth + size.borderRightWidth;
  var borderHeight = size.borderTopWidth + size.borderBottomWidth;

  var isBorderBoxSizeOuter = isBorderBox && isBoxSizeOuter;

  // overwrite width and height if we can get it from style
  var styleWidth = getStyleSize( style.width );
  if ( styleWidth !== false ) {
    size.width = styleWidth +
      // add padding and border unless it's already including it
      ( isBorderBoxSizeOuter ? 0 : paddingWidth + borderWidth );
  }

  var styleHeight = getStyleSize( style.height );
  if ( styleHeight !== false ) {
    size.height = styleHeight +
      // add padding and border unless it's already including it
      ( isBorderBoxSizeOuter ? 0 : paddingHeight + borderHeight );
  }

  size.innerWidth = size.width - ( paddingWidth + borderWidth );
  size.innerHeight = size.height - ( paddingHeight + borderHeight );

  size.outerWidth = size.width + marginWidth;
  size.outerHeight = size.height + marginHeight;

  return size;
}

return getSize;

});

/**
 * matchesSelector v2.0.1
 * matchesSelector( element, '.selector' )
 * MIT license
 */

/*jshint browser: true, strict: true, undef: true, unused: true */

( function( window, factory ) {
  /*global define: false, module: false */
  'use strict';
  // universal module definition
  if ( typeof define == 'function' && define.amd ) {
    // AMD
    define( 'desandro-matches-selector/matches-selector',factory );
  } else if ( typeof module == 'object' && module.exports ) {
    // CommonJS
    module.exports = factory();
  } else {
    // browser global
    window.matchesSelector = factory();
  }

}( window, function factory() {
  'use strict';

  var matchesMethod = ( function() {
    var ElemProto = Element.prototype;
    // check for the standard method name first
    if ( ElemProto.matches ) {
      return 'matches';
    }
    // check un-prefixed
    if ( ElemProto.matchesSelector ) {
      return 'matchesSelector';
    }
    // check vendor prefixes
    var prefixes = [ 'webkit', 'moz', 'ms', 'o' ];

    for ( var i=0; i < prefixes.length; i++ ) {
      var prefix = prefixes[i];
      var method = prefix + 'MatchesSelector';
      if ( ElemProto[ method ] ) {
        return method;
      }
    }
  })();

  return function matchesSelector( elem, selector ) {
    return elem[ matchesMethod ]( selector );
  };

}));

/**
 * Fizzy UI utils v2.0.1
 * MIT license
 */

/*jshint browser: true, undef: true, unused: true, strict: true */

( function( window, factory ) {
  // universal module definition
  /*jshint strict: false */ /*globals define, module, require */

  if ( typeof define == 'function' && define.amd ) {
    // AMD
    define( 'fizzy-ui-utils/utils',[
      'desandro-matches-selector/matches-selector'
    ], function( matchesSelector ) {
      return factory( window, matchesSelector );
    });
  } else if ( typeof module == 'object' && module.exports ) {
    // CommonJS
    module.exports = factory(
      window,
      require('desandro-matches-selector')
    );
  } else {
    // browser global
    window.fizzyUIUtils = factory(
      window,
      window.matchesSelector
    );
  }

}( window, function factory( window, matchesSelector ) {



var utils = {};

// ----- extend ----- //

// extends objects
utils.extend = function( a, b ) {
  for ( var prop in b ) {
    a[ prop ] = b[ prop ];
  }
  return a;
};

// ----- modulo ----- //

utils.modulo = function( num, div ) {
  return ( ( num % div ) + div ) % div;
};

// ----- makeArray ----- //

// turn element or nodeList into an array
utils.makeArray = function( obj ) {
  var ary = [];
  if ( Array.isArray( obj ) ) {
    // use object if already an array
    ary = obj;
  } else if ( obj && typeof obj.length == 'number' ) {
    // convert nodeList to array
    for ( var i=0; i < obj.length; i++ ) {
      ary.push( obj[i] );
    }
  } else {
    // array of single index
    ary.push( obj );
  }
  return ary;
};

// ----- removeFrom ----- //

utils.removeFrom = function( ary, obj ) {
  var index = ary.indexOf( obj );
  if ( index != -1 ) {
    ary.splice( index, 1 );
  }
};

// ----- getParent ----- //

utils.getParent = function( elem, selector ) {
  while ( elem != document.body ) {
    elem = elem.parentNode;
    if ( matchesSelector( elem, selector ) ) {
      return elem;
    }
  }
};

// ----- getQueryElement ----- //

// use element as selector string
utils.getQueryElement = function( elem ) {
  if ( typeof elem == 'string' ) {
    return document.querySelector( elem );
  }
  return elem;
};

// ----- handleEvent ----- //

// enable .ontype to trigger from .addEventListener( elem, 'type' )
utils.handleEvent = function( event ) {
  var method = 'on' + event.type;
  if ( this[ method ] ) {
    this[ method ]( event );
  }
};

// ----- filterFindElements ----- //

utils.filterFindElements = function( elems, selector ) {
  // make array of elems
  elems = utils.makeArray( elems );
  var ffElems = [];

  elems.forEach( function( elem ) {
    // check that elem is an actual element
    if ( !( elem instanceof HTMLElement ) ) {
      return;
    }
    // add elem if no selector
    if ( !selector ) {
      ffElems.push( elem );
      return;
    }
    // filter & find items if we have a selector
    // filter
    if ( matchesSelector( elem, selector ) ) {
      ffElems.push( elem );
    }
    // find children
    var childElems = elem.querySelectorAll( selector );
    // concat childElems to filterFound array
    for ( var i=0; i < childElems.length; i++ ) {
      ffElems.push( childElems[i] );
    }
  });

  return ffElems;
};

// ----- debounceMethod ----- //

utils.debounceMethod = function( _class, methodName, threshold ) {
  // original method
  var method = _class.prototype[ methodName ];
  var timeoutName = methodName + 'Timeout';

  _class.prototype[ methodName ] = function() {
    var timeout = this[ timeoutName ];
    if ( timeout ) {
      clearTimeout( timeout );
    }
    var args = arguments;

    var _this = this;
    this[ timeoutName ] = setTimeout( function() {
      method.apply( _this, args );
      delete _this[ timeoutName ];
    }, threshold || 100 );
  };
};

// ----- docReady ----- //

utils.docReady = function( callback ) {
  if ( document.readyState == 'complete' ) {
    callback();
  } else {
    document.addEventListener( 'DOMContentLoaded', callback );
  }
};

// ----- htmlInit ----- //

// http://jamesroberts.name/blog/2010/02/22/string-functions-for-javascript-trim-to-camel-case-to-dashed-and-to-underscore/
utils.toDashed = function( str ) {
  return str.replace( /(.)([A-Z])/g, function( match, $1, $2 ) {
    return $1 + '-' + $2;
  }).toLowerCase();
};

var console = window.console;
/**
 * allow user to initialize classes via [data-namespace] or .js-namespace class
 * htmlInit( Widget, 'widgetName' )
 * options are parsed from data-namespace-options
 */
utils.htmlInit = function( WidgetClass, namespace ) {
  utils.docReady( function() {
    var dashedNamespace = utils.toDashed( namespace );
    var dataAttr = 'data-' + dashedNamespace;
    var dataAttrElems = document.querySelectorAll( '[' + dataAttr + ']' );
    var jsDashElems = document.querySelectorAll( '.js-' + dashedNamespace );
    var elems = utils.makeArray( dataAttrElems )
      .concat( utils.makeArray( jsDashElems ) );
    var dataOptionsAttr = dataAttr + '-options';
    var jQuery = window.jQuery;

    elems.forEach( function( elem ) {
      var attr = elem.getAttribute( dataAttr ) ||
        elem.getAttribute( dataOptionsAttr );
      var options;
      try {
        options = attr && JSON.parse( attr );
      } catch ( error ) {
        // log error, do not initialize
        if ( console ) {
          console.error( 'Error parsing ' + dataAttr + ' on ' + elem.className +
          ': ' + error );
        }
        return;
      }
      // initialize
      var instance = new WidgetClass( elem, options );
      // make available via $().data('layoutname')
      if ( jQuery ) {
        jQuery.data( elem, namespace, instance );
      }
    });

  });
};

// -----  ----- //

return utils;

}));

/**
 * Outlayer Item
 */

( function( window, factory ) {
  // universal module definition
  /* jshint strict: false */ /* globals define, module, require */
  if ( typeof define == 'function' && define.amd ) {
    // AMD - RequireJS
    define( 'outlayer/item',[
        'ev-emitter/ev-emitter',
        'get-size/get-size'
      ],
      factory
    );
  } else if ( typeof module == 'object' && module.exports ) {
    // CommonJS - Browserify, Webpack
    module.exports = factory(
      require('ev-emitter'),
      require('get-size')
    );
  } else {
    // browser global
    window.Outlayer = {};
    window.Outlayer.Item = factory(
      window.EvEmitter,
      window.getSize
    );
  }

}( window, function factory( EvEmitter, getSize ) {
'use strict';

// ----- helpers ----- //

function isEmptyObj( obj ) {
  for ( var prop in obj ) {
    return false;
  }
  prop = null;
  return true;
}

// -------------------------- CSS3 support -------------------------- //


var docElemStyle = document.documentElement.style;

var transitionProperty = typeof docElemStyle.transition == 'string' ?
  'transition' : 'WebkitTransition';
var transformProperty = typeof docElemStyle.transform == 'string' ?
  'transform' : 'WebkitTransform';

var transitionEndEvent = {
  WebkitTransition: 'webkitTransitionEnd',
  transition: 'transitionend'
}[ transitionProperty ];

// cache all vendor properties that could have vendor prefix
var vendorProperties = {
  transform: transformProperty,
  transition: transitionProperty,
  transitionDuration: transitionProperty + 'Duration',
  transitionProperty: transitionProperty + 'Property',
  transitionDelay: transitionProperty + 'Delay'
};

// -------------------------- Item -------------------------- //

function Item( element, layout ) {
  if ( !element ) {
    return;
  }

  this.element = element;
  // parent layout class, i.e. Masonry, Isotope, or Packery
  this.layout = layout;
  this.position = {
    x: 0,
    y: 0
  };

  this._create();
}

// inherit EvEmitter
var proto = Item.prototype = Object.create( EvEmitter.prototype );
proto.constructor = Item;

proto._create = function() {
  // transition objects
  this._transn = {
    ingProperties: {},
    clean: {},
    onEnd: {}
  };

  this.css({
    position: 'absolute'
  });
};

// trigger specified handler for event type
proto.handleEvent = function( event ) {
  var method = 'on' + event.type;
  if ( this[ method ] ) {
    this[ method ]( event );
  }
};

proto.getSize = function() {
  this.size = getSize( this.element );
};

/**
 * apply CSS styles to element
 * @param {Object} style
 */
proto.css = function( style ) {
  var elemStyle = this.element.style;

  for ( var prop in style ) {
    // use vendor property if available
    var supportedProp = vendorProperties[ prop ] || prop;
    elemStyle[ supportedProp ] = style[ prop ];
  }
};

 // measure position, and sets it
proto.getPosition = function() {
  var style = getComputedStyle( this.element );
  var isOriginLeft = this.layout._getOption('originLeft');
  var isOriginTop = this.layout._getOption('originTop');
  var xValue = style[ isOriginLeft ? 'left' : 'right' ];
  var yValue = style[ isOriginTop ? 'top' : 'bottom' ];
  // convert percent to pixels
  var layoutSize = this.layout.size;
  var x = xValue.indexOf('%') != -1 ?
    ( parseFloat( xValue ) / 100 ) * layoutSize.width : parseInt( xValue, 10 );
  var y = yValue.indexOf('%') != -1 ?
    ( parseFloat( yValue ) / 100 ) * layoutSize.height : parseInt( yValue, 10 );

  // clean up 'auto' or other non-integer values
  x = isNaN( x ) ? 0 : x;
  y = isNaN( y ) ? 0 : y;
  // remove padding from measurement
  x -= isOriginLeft ? layoutSize.paddingLeft : layoutSize.paddingRight;
  y -= isOriginTop ? layoutSize.paddingTop : layoutSize.paddingBottom;

  this.position.x = x;
  this.position.y = y;
};

// set settled position, apply padding
proto.layoutPosition = function() {
  var layoutSize = this.layout.size;
  var style = {};
  var isOriginLeft = this.layout._getOption('originLeft');
  var isOriginTop = this.layout._getOption('originTop');

  // x
  var xPadding = isOriginLeft ? 'paddingLeft' : 'paddingRight';
  var xProperty = isOriginLeft ? 'left' : 'right';
  var xResetProperty = isOriginLeft ? 'right' : 'left';

  var x = this.position.x + layoutSize[ xPadding ];
  // set in percentage or pixels
  style[ xProperty ] = this.getXValue( x );
  // reset other property
  style[ xResetProperty ] = '';

  // y
  var yPadding = isOriginTop ? 'paddingTop' : 'paddingBottom';
  var yProperty = isOriginTop ? 'top' : 'bottom';
  var yResetProperty = isOriginTop ? 'bottom' : 'top';

  var y = this.position.y + layoutSize[ yPadding ];
  // set in percentage or pixels
  style[ yProperty ] = this.getYValue( y );
  // reset other property
  style[ yResetProperty ] = '';

  this.css( style );
  this.emitEvent( 'layout', [ this ] );
};

proto.getXValue = function( x ) {
  var isHorizontal = this.layout._getOption('horizontal');
  return this.layout.options.percentPosition && !isHorizontal ?
    ( ( x / this.layout.size.width ) * 100 ) + '%' : x + 'px';
};

proto.getYValue = function( y ) {
  var isHorizontal = this.layout._getOption('horizontal');
  return this.layout.options.percentPosition && isHorizontal ?
    ( ( y / this.layout.size.height ) * 100 ) + '%' : y + 'px';
};

proto._transitionTo = function( x, y ) {
  this.getPosition();
  // get current x & y from top/left
  var curX = this.position.x;
  var curY = this.position.y;

  var compareX = parseInt( x, 10 );
  var compareY = parseInt( y, 10 );
  var didNotMove = compareX === this.position.x && compareY === this.position.y;

  // save end position
  this.setPosition( x, y );

  // if did not move and not transitioning, just go to layout
  if ( didNotMove && !this.isTransitioning ) {
    this.layoutPosition();
    return;
  }

  var transX = x - curX;
  var transY = y - curY;
  var transitionStyle = {};
  transitionStyle.transform = this.getTranslate( transX, transY );

  this.transition({
    to: transitionStyle,
    onTransitionEnd: {
      transform: this.layoutPosition
    },
    isCleaning: true
  });
};

proto.getTranslate = function( x, y ) {
  // flip cooridinates if origin on right or bottom
  var isOriginLeft = this.layout._getOption('originLeft');
  var isOriginTop = this.layout._getOption('originTop');
  x = isOriginLeft ? x : -x;
  y = isOriginTop ? y : -y;
  return 'translate3d(' + x + 'px, ' + y + 'px, 0)';
};

// non transition + transform support
proto.goTo = function( x, y ) {
  this.setPosition( x, y );
  this.layoutPosition();
};

proto.moveTo = proto._transitionTo;

proto.setPosition = function( x, y ) {
  this.position.x = parseInt( x, 10 );
  this.position.y = parseInt( y, 10 );
};

// ----- transition ----- //

/**
 * @param {Object} style - CSS
 * @param {Function} onTransitionEnd
 */

// non transition, just trigger callback
proto._nonTransition = function( args ) {
  this.css( args.to );
  if ( args.isCleaning ) {
    this._removeStyles( args.to );
  }
  for ( var prop in args.onTransitionEnd ) {
    args.onTransitionEnd[ prop ].call( this );
  }
};

/**
 * proper transition
 * @param {Object} args - arguments
 *   @param {Object} to - style to transition to
 *   @param {Object} from - style to start transition from
 *   @param {Boolean} isCleaning - removes transition styles after transition
 *   @param {Function} onTransitionEnd - callback
 */
proto.transition = function( args ) {
  // redirect to nonTransition if no transition duration
  if ( !parseFloat( this.layout.options.transitionDuration ) ) {
    this._nonTransition( args );
    return;
  }

  var _transition = this._transn;
  // keep track of onTransitionEnd callback by css property
  for ( var prop in args.onTransitionEnd ) {
    _transition.onEnd[ prop ] = args.onTransitionEnd[ prop ];
  }
  // keep track of properties that are transitioning
  for ( prop in args.to ) {
    _transition.ingProperties[ prop ] = true;
    // keep track of properties to clean up when transition is done
    if ( args.isCleaning ) {
      _transition.clean[ prop ] = true;
    }
  }

  // set from styles
  if ( args.from ) {
    this.css( args.from );
    // force redraw. http://blog.alexmaccaw.com/css-transitions
    var h = this.element.offsetHeight;
    // hack for JSHint to hush about unused var
    h = null;
  }
  // enable transition
  this.enableTransition( args.to );
  // set styles that are transitioning
  this.css( args.to );

  this.isTransitioning = true;

};

// dash before all cap letters, including first for
// WebkitTransform => -webkit-transform
function toDashedAll( str ) {
  return str.replace( /([A-Z])/g, function( $1 ) {
    return '-' + $1.toLowerCase();
  });
}

var transitionProps = 'opacity,' + toDashedAll( transformProperty );

proto.enableTransition = function(/* style */) {
  // HACK changing transitionProperty during a transition
  // will cause transition to jump
  if ( this.isTransitioning ) {
    return;
  }

  // make `transition: foo, bar, baz` from style object
  // HACK un-comment this when enableTransition can work
  // while a transition is happening
  // var transitionValues = [];
  // for ( var prop in style ) {
  //   // dash-ify camelCased properties like WebkitTransition
  //   prop = vendorProperties[ prop ] || prop;
  //   transitionValues.push( toDashedAll( prop ) );
  // }
  // munge number to millisecond, to match stagger
  var duration = this.layout.options.transitionDuration;
  duration = typeof duration == 'number' ? duration + 'ms' : duration;
  // enable transition styles
  this.css({
    transitionProperty: transitionProps,
    transitionDuration: duration,
    transitionDelay: this.staggerDelay || 0
  });
  // listen for transition end event
  this.element.addEventListener( transitionEndEvent, this, false );
};

// ----- events ----- //

proto.onwebkitTransitionEnd = function( event ) {
  this.ontransitionend( event );
};

proto.onotransitionend = function( event ) {
  this.ontransitionend( event );
};

// properties that I munge to make my life easier
var dashedVendorProperties = {
  '-webkit-transform': 'transform'
};

proto.ontransitionend = function( event ) {
  // disregard bubbled events from children
  if ( event.target !== this.element ) {
    return;
  }
  var _transition = this._transn;
  // get property name of transitioned property, convert to prefix-free
  var propertyName = dashedVendorProperties[ event.propertyName ] || event.propertyName;

  // remove property that has completed transitioning
  delete _transition.ingProperties[ propertyName ];
  // check if any properties are still transitioning
  if ( isEmptyObj( _transition.ingProperties ) ) {
    // all properties have completed transitioning
    this.disableTransition();
  }
  // clean style
  if ( propertyName in _transition.clean ) {
    // clean up style
    this.element.style[ event.propertyName ] = '';
    delete _transition.clean[ propertyName ];
  }
  // trigger onTransitionEnd callback
  if ( propertyName in _transition.onEnd ) {
    var onTransitionEnd = _transition.onEnd[ propertyName ];
    onTransitionEnd.call( this );
    delete _transition.onEnd[ propertyName ];
  }

  this.emitEvent( 'transitionEnd', [ this ] );
};

proto.disableTransition = function() {
  this.removeTransitionStyles();
  this.element.removeEventListener( transitionEndEvent, this, false );
  this.isTransitioning = false;
};

/**
 * removes style property from element
 * @param {Object} style
**/
proto._removeStyles = function( style ) {
  // clean up transition styles
  var cleanStyle = {};
  for ( var prop in style ) {
    cleanStyle[ prop ] = '';
  }
  this.css( cleanStyle );
};

var cleanTransitionStyle = {
  transitionProperty: '',
  transitionDuration: '',
  transitionDelay: ''
};

proto.removeTransitionStyles = function() {
  // remove transition
  this.css( cleanTransitionStyle );
};

// ----- stagger ----- //

proto.stagger = function( delay ) {
  delay = isNaN( delay ) ? 0 : delay;
  this.staggerDelay = delay + 'ms';
};

// ----- show/hide/remove ----- //

// remove element from DOM
proto.removeElem = function() {
  this.element.parentNode.removeChild( this.element );
  // remove display: none
  this.css({ display: '' });
  this.emitEvent( 'remove', [ this ] );
};

proto.remove = function() {
  // just remove element if no transition support or no transition
  if ( !transitionProperty || !parseFloat( this.layout.options.transitionDuration ) ) {
    this.removeElem();
    return;
  }

  // start transition
  this.once( 'transitionEnd', function() {
    this.removeElem();
  });
  this.hide();
};

proto.reveal = function() {
  delete this.isHidden;
  // remove display: none
  this.css({ display: '' });

  var options = this.layout.options;

  var onTransitionEnd = {};
  var transitionEndProperty = this.getHideRevealTransitionEndProperty('visibleStyle');
  onTransitionEnd[ transitionEndProperty ] = this.onRevealTransitionEnd;

  this.transition({
    from: options.hiddenStyle,
    to: options.visibleStyle,
    isCleaning: true,
    onTransitionEnd: onTransitionEnd
  });
};

proto.onRevealTransitionEnd = function() {
  // check if still visible
  // during transition, item may have been hidden
  if ( !this.isHidden ) {
    this.emitEvent('reveal');
  }
};

/**
 * get style property use for hide/reveal transition end
 * @param {String} styleProperty - hiddenStyle/visibleStyle
 * @returns {String}
 */
proto.getHideRevealTransitionEndProperty = function( styleProperty ) {
  var optionStyle = this.layout.options[ styleProperty ];
  // use opacity
  if ( optionStyle.opacity ) {
    return 'opacity';
  }
  // get first property
  for ( var prop in optionStyle ) {
    return prop;
  }
};

proto.hide = function() {
  // set flag
  this.isHidden = true;
  // remove display: none
  this.css({ display: '' });

  var options = this.layout.options;

  var onTransitionEnd = {};
  var transitionEndProperty = this.getHideRevealTransitionEndProperty('hiddenStyle');
  onTransitionEnd[ transitionEndProperty ] = this.onHideTransitionEnd;

  this.transition({
    from: options.visibleStyle,
    to: options.hiddenStyle,
    // keep hidden stuff hidden
    isCleaning: true,
    onTransitionEnd: onTransitionEnd
  });
};

proto.onHideTransitionEnd = function() {
  // check if still hidden
  // during transition, item may have been un-hidden
  if ( this.isHidden ) {
    this.css({ display: 'none' });
    this.emitEvent('hide');
  }
};

proto.destroy = function() {
  this.css({
    position: '',
    left: '',
    right: '',
    top: '',
    bottom: '',
    transition: '',
    transform: ''
  });
};

return Item;

}));

/*!
 * Outlayer v2.1.0
 * the brains and guts of a layout library
 * MIT license
 */

( function( window, factory ) {
  'use strict';
  // universal module definition
  /* jshint strict: false */ /* globals define, module, require */
  if ( typeof define == 'function' && define.amd ) {
    // AMD - RequireJS
    define( 'outlayer/outlayer',[
        'ev-emitter/ev-emitter',
        'get-size/get-size',
        'fizzy-ui-utils/utils',
        './item'
      ],
      function( EvEmitter, getSize, utils, Item ) {
        return factory( window, EvEmitter, getSize, utils, Item);
      }
    );
  } else if ( typeof module == 'object' && module.exports ) {
    // CommonJS - Browserify, Webpack
    module.exports = factory(
      window,
      require('ev-emitter'),
      require('get-size'),
      require('fizzy-ui-utils'),
      require('./item')
    );
  } else {
    // browser global
    window.Outlayer = factory(
      window,
      window.EvEmitter,
      window.getSize,
      window.fizzyUIUtils,
      window.Outlayer.Item
    );
  }

}( window, function factory( window, EvEmitter, getSize, utils, Item ) {
'use strict';

// ----- vars ----- //

var console = window.console;
var jQuery = window.jQuery;
var noop = function() {};

// -------------------------- Outlayer -------------------------- //

// globally unique identifiers
var GUID = 0;
// internal store of all Outlayer intances
var instances = {};


/**
 * @param {Element, String} element
 * @param {Object} options
 * @constructor
 */
function Outlayer( element, options ) {
  var queryElement = utils.getQueryElement( element );
  if ( !queryElement ) {
    if ( console ) {
      console.error( 'Bad element for ' + this.constructor.namespace +
        ': ' + ( queryElement || element ) );
    }
    return;
  }
  this.element = queryElement;
  // add jQuery
  if ( jQuery ) {
    this.$element = jQuery( this.element );
  }

  // options
  this.options = utils.extend( {}, this.constructor.defaults );
  this.option( options );

  // add id for Outlayer.getFromElement
  var id = ++GUID;
  this.element.outlayerGUID = id; // expando
  instances[ id ] = this; // associate via id

  // kick it off
  this._create();

  var isInitLayout = this._getOption('initLayout');
  if ( isInitLayout ) {
    this.layout();
  }
}

// settings are for internal use only
Outlayer.namespace = 'outlayer';
Outlayer.Item = Item;

// default options
Outlayer.defaults = {
  containerStyle: {
    position: 'relative'
  },
  initLayout: true,
  originLeft: true,
  originTop: true,
  resize: true,
  resizeContainer: true,
  // item options
  transitionDuration: '0.4s',
  hiddenStyle: {
    opacity: 0,
    transform: 'scale(0.001)'
  },
  visibleStyle: {
    opacity: 1,
    transform: 'scale(1)'
  }
};

var proto = Outlayer.prototype;
// inherit EvEmitter
utils.extend( proto, EvEmitter.prototype );

/**
 * set options
 * @param {Object} opts
 */
proto.option = function( opts ) {
  utils.extend( this.options, opts );
};

/**
 * get backwards compatible option value, check old name
 */
proto._getOption = function( option ) {
  var oldOption = this.constructor.compatOptions[ option ];
  return oldOption && this.options[ oldOption ] !== undefined ?
    this.options[ oldOption ] : this.options[ option ];
};

Outlayer.compatOptions = {
  // currentName: oldName
  initLayout: 'isInitLayout',
  horizontal: 'isHorizontal',
  layoutInstant: 'isLayoutInstant',
  originLeft: 'isOriginLeft',
  originTop: 'isOriginTop',
  resize: 'isResizeBound',
  resizeContainer: 'isResizingContainer'
};

proto._create = function() {
  // get items from children
  this.reloadItems();
  // elements that affect layout, but are not laid out
  this.stamps = [];
  this.stamp( this.options.stamp );
  // set container style
  utils.extend( this.element.style, this.options.containerStyle );

  // bind resize method
  var canBindResize = this._getOption('resize');
  if ( canBindResize ) {
    this.bindResize();
  }
};

// goes through all children again and gets bricks in proper order
proto.reloadItems = function() {
  // collection of item elements
  this.items = this._itemize( this.element.children );
};


/**
 * turn elements into Outlayer.Items to be used in layout
 * @param {Array or NodeList or HTMLElement} elems
 * @returns {Array} items - collection of new Outlayer Items
 */
proto._itemize = function( elems ) {

  var itemElems = this._filterFindItemElements( elems );
  var Item = this.constructor.Item;

  // create new Outlayer Items for collection
  var items = [];
  for ( var i=0; i < itemElems.length; i++ ) {
    var elem = itemElems[i];
    var item = new Item( elem, this );
    items.push( item );
  }

  return items;
};

/**
 * get item elements to be used in layout
 * @param {Array or NodeList or HTMLElement} elems
 * @returns {Array} items - item elements
 */
proto._filterFindItemElements = function( elems ) {
  return utils.filterFindElements( elems, this.options.itemSelector );
};

/**
 * getter method for getting item elements
 * @returns {Array} elems - collection of item elements
 */
proto.getItemElements = function() {
  return this.items.map( function( item ) {
    return item.element;
  });
};

// ----- init & layout ----- //

/**
 * lays out all items
 */
proto.layout = function() {
  this._resetLayout();
  this._manageStamps();

  // don't animate first layout
  var layoutInstant = this._getOption('layoutInstant');
  var isInstant = layoutInstant !== undefined ?
    layoutInstant : !this._isLayoutInited;
  this.layoutItems( this.items, isInstant );

  // flag for initalized
  this._isLayoutInited = true;
};

// _init is alias for layout
proto._init = proto.layout;

/**
 * logic before any new layout
 */
proto._resetLayout = function() {
  this.getSize();
};


proto.getSize = function() {
  this.size = getSize( this.element );
};

/**
 * get measurement from option, for columnWidth, rowHeight, gutter
 * if option is String -> get element from selector string, & get size of element
 * if option is Element -> get size of element
 * else use option as a number
 *
 * @param {String} measurement
 * @param {String} size - width or height
 * @private
 */
proto._getMeasurement = function( measurement, size ) {
  var option = this.options[ measurement ];
  var elem;
  if ( !option ) {
    // default to 0
    this[ measurement ] = 0;
  } else {
    // use option as an element
    if ( typeof option == 'string' ) {
      elem = this.element.querySelector( option );
    } else if ( option instanceof HTMLElement ) {
      elem = option;
    }
    // use size of element, if element
    this[ measurement ] = elem ? getSize( elem )[ size ] : option;
  }
};

/**
 * layout a collection of item elements
 * @api public
 */
proto.layoutItems = function( items, isInstant ) {
  items = this._getItemsForLayout( items );

  this._layoutItems( items, isInstant );

  this._postLayout();
};

/**
 * get the items to be laid out
 * you may want to skip over some items
 * @param {Array} items
 * @returns {Array} items
 */
proto._getItemsForLayout = function( items ) {
  return items.filter( function( item ) {
    return !item.isIgnored;
  });
};

/**
 * layout items
 * @param {Array} items
 * @param {Boolean} isInstant
 */
proto._layoutItems = function( items, isInstant ) {
  this._emitCompleteOnItems( 'layout', items );

  if ( !items || !items.length ) {
    // no items, emit event with empty array
    return;
  }

  var queue = [];

  items.forEach( function( item ) {
    // get x/y object from method
    var position = this._getItemLayoutPosition( item );
    // enqueue
    position.item = item;
    position.isInstant = isInstant || item.isLayoutInstant;
    queue.push( position );
  }, this );

  this._processLayoutQueue( queue );
};

/**
 * get item layout position
 * @param {Outlayer.Item} item
 * @returns {Object} x and y position
 */
proto._getItemLayoutPosition = function( /* item */ ) {
  return {
    x: 0,
    y: 0
  };
};

/**
 * iterate over array and position each item
 * Reason being - separating this logic prevents 'layout invalidation'
 * thx @paul_irish
 * @param {Array} queue
 */
proto._processLayoutQueue = function( queue ) {
  this.updateStagger();
  queue.forEach( function( obj, i ) {
    this._positionItem( obj.item, obj.x, obj.y, obj.isInstant, i );
  }, this );
};

// set stagger from option in milliseconds number
proto.updateStagger = function() {
  var stagger = this.options.stagger;
  if ( stagger === null || stagger === undefined ) {
    this.stagger = 0;
    return;
  }
  this.stagger = getMilliseconds( stagger );
  return this.stagger;
};

/**
 * Sets position of item in DOM
 * @param {Outlayer.Item} item
 * @param {Number} x - horizontal position
 * @param {Number} y - vertical position
 * @param {Boolean} isInstant - disables transitions
 */
proto._positionItem = function( item, x, y, isInstant, i ) {
  if ( isInstant ) {
    // if not transition, just set CSS
    item.goTo( x, y );
  } else {
    item.stagger( i * this.stagger );
    item.moveTo( x, y );
  }
};

/**
 * Any logic you want to do after each layout,
 * i.e. size the container
 */
proto._postLayout = function() {
  this.resizeContainer();
};

proto.resizeContainer = function() {
  var isResizingContainer = this._getOption('resizeContainer');
  if ( !isResizingContainer ) {
    return;
  }
  var size = this._getContainerSize();
  if ( size ) {
    this._setContainerMeasure( size.width, true );
    this._setContainerMeasure( size.height, false );
  }
};

/**
 * Sets width or height of container if returned
 * @returns {Object} size
 *   @param {Number} width
 *   @param {Number} height
 */
proto._getContainerSize = noop;

/**
 * @param {Number} measure - size of width or height
 * @param {Boolean} isWidth
 */
proto._setContainerMeasure = function( measure, isWidth ) {
  if ( measure === undefined ) {
    return;
  }

  var elemSize = this.size;
  // add padding and border width if border box
  if ( elemSize.isBorderBox ) {
    measure += isWidth ? elemSize.paddingLeft + elemSize.paddingRight +
      elemSize.borderLeftWidth + elemSize.borderRightWidth :
      elemSize.paddingBottom + elemSize.paddingTop +
      elemSize.borderTopWidth + elemSize.borderBottomWidth;
  }

  measure = Math.max( measure, 0 );
  this.element.style[ isWidth ? 'width' : 'height' ] = measure + 'px';
};

/**
 * emit eventComplete on a collection of items events
 * @param {String} eventName
 * @param {Array} items - Outlayer.Items
 */
proto._emitCompleteOnItems = function( eventName, items ) {
  var _this = this;
  function onComplete() {
    _this.dispatchEvent( eventName + 'Complete', null, [ items ] );
  }

  var count = items.length;
  if ( !items || !count ) {
    onComplete();
    return;
  }

  var doneCount = 0;
  function tick() {
    doneCount++;
    if ( doneCount == count ) {
      onComplete();
    }
  }

  // bind callback
  items.forEach( function( item ) {
    item.once( eventName, tick );
  });
};

/**
 * emits events via EvEmitter and jQuery events
 * @param {String} type - name of event
 * @param {Event} event - original event
 * @param {Array} args - extra arguments
 */
proto.dispatchEvent = function( type, event, args ) {
  // add original event to arguments
  var emitArgs = event ? [ event ].concat( args ) : args;
  this.emitEvent( type, emitArgs );

  if ( jQuery ) {
    // set this.$element
    this.$element = this.$element || jQuery( this.element );
    if ( event ) {
      // create jQuery event
      var $event = jQuery.Event( event );
      $event.type = type;
      this.$element.trigger( $event, args );
    } else {
      // just trigger with type if no event available
      this.$element.trigger( type, args );
    }
  }
};

// -------------------------- ignore & stamps -------------------------- //


/**
 * keep item in collection, but do not lay it out
 * ignored items do not get skipped in layout
 * @param {Element} elem
 */
proto.ignore = function( elem ) {
  var item = this.getItem( elem );
  if ( item ) {
    item.isIgnored = true;
  }
};

/**
 * return item to layout collection
 * @param {Element} elem
 */
proto.unignore = function( elem ) {
  var item = this.getItem( elem );
  if ( item ) {
    delete item.isIgnored;
  }
};

/**
 * adds elements to stamps
 * @param {NodeList, Array, Element, or String} elems
 */
proto.stamp = function( elems ) {
  elems = this._find( elems );
  if ( !elems ) {
    return;
  }

  this.stamps = this.stamps.concat( elems );
  // ignore
  elems.forEach( this.ignore, this );
};

/**
 * removes elements to stamps
 * @param {NodeList, Array, or Element} elems
 */
proto.unstamp = function( elems ) {
  elems = this._find( elems );
  if ( !elems ){
    return;
  }

  elems.forEach( function( elem ) {
    // filter out removed stamp elements
    utils.removeFrom( this.stamps, elem );
    this.unignore( elem );
  }, this );
};

/**
 * finds child elements
 * @param {NodeList, Array, Element, or String} elems
 * @returns {Array} elems
 */
proto._find = function( elems ) {
  if ( !elems ) {
    return;
  }
  // if string, use argument as selector string
  if ( typeof elems == 'string' ) {
    elems = this.element.querySelectorAll( elems );
  }
  elems = utils.makeArray( elems );
  return elems;
};

proto._manageStamps = function() {
  if ( !this.stamps || !this.stamps.length ) {
    return;
  }

  this._getBoundingRect();

  this.stamps.forEach( this._manageStamp, this );
};

// update boundingLeft / Top
proto._getBoundingRect = function() {
  // get bounding rect for container element
  var boundingRect = this.element.getBoundingClientRect();
  var size = this.size;
  this._boundingRect = {
    left: boundingRect.left + size.paddingLeft + size.borderLeftWidth,
    top: boundingRect.top + size.paddingTop + size.borderTopWidth,
    right: boundingRect.right - ( size.paddingRight + size.borderRightWidth ),
    bottom: boundingRect.bottom - ( size.paddingBottom + size.borderBottomWidth )
  };
};

/**
 * @param {Element} stamp
**/
proto._manageStamp = noop;

/**
 * get x/y position of element relative to container element
 * @param {Element} elem
 * @returns {Object} offset - has left, top, right, bottom
 */
proto._getElementOffset = function( elem ) {
  var boundingRect = elem.getBoundingClientRect();
  var thisRect = this._boundingRect;
  var size = getSize( elem );
  var offset = {
    left: boundingRect.left - thisRect.left - size.marginLeft,
    top: boundingRect.top - thisRect.top - size.marginTop,
    right: thisRect.right - boundingRect.right - size.marginRight,
    bottom: thisRect.bottom - boundingRect.bottom - size.marginBottom
  };
  return offset;
};

// -------------------------- resize -------------------------- //

// enable event handlers for listeners
// i.e. resize -> onresize
proto.handleEvent = utils.handleEvent;

/**
 * Bind layout to window resizing
 */
proto.bindResize = function() {
  window.addEventListener( 'resize', this );
  this.isResizeBound = true;
};

/**
 * Unbind layout to window resizing
 */
proto.unbindResize = function() {
  window.removeEventListener( 'resize', this );
  this.isResizeBound = false;
};

proto.onresize = function() {
  this.resize();
};

utils.debounceMethod( Outlayer, 'onresize', 100 );

proto.resize = function() {
  // don't trigger if size did not change
  // or if resize was unbound. See #9
  if ( !this.isResizeBound || !this.needsResizeLayout() ) {
    return;
  }

  this.layout();
};

/**
 * check if layout is needed post layout
 * @returns Boolean
 */
proto.needsResizeLayout = function() {
  var size = getSize( this.element );
  // check that this.size and size are there
  // IE8 triggers resize on body size change, so they might not be
  var hasSizes = this.size && size;
  return hasSizes && size.innerWidth !== this.size.innerWidth;
};

// -------------------------- methods -------------------------- //

/**
 * add items to Outlayer instance
 * @param {Array or NodeList or Element} elems
 * @returns {Array} items - Outlayer.Items
**/
proto.addItems = function( elems ) {
  var items = this._itemize( elems );
  // add items to collection
  if ( items.length ) {
    this.items = this.items.concat( items );
  }
  return items;
};

/**
 * Layout newly-appended item elements
 * @param {Array or NodeList or Element} elems
 */
proto.appended = function( elems ) {
  var items = this.addItems( elems );
  if ( !items.length ) {
    return;
  }
  // layout and reveal just the new items
  this.layoutItems( items, true );
  this.reveal( items );
};

/**
 * Layout prepended elements
 * @param {Array or NodeList or Element} elems
 */
proto.prepended = function( elems ) {
  var items = this._itemize( elems );
  if ( !items.length ) {
    return;
  }
  // add items to beginning of collection
  var previousItems = this.items.slice(0);
  this.items = items.concat( previousItems );
  // start new layout
  this._resetLayout();
  this._manageStamps();
  // layout new stuff without transition
  this.layoutItems( items, true );
  this.reveal( items );
  // layout previous items
  this.layoutItems( previousItems );
};

/**
 * reveal a collection of items
 * @param {Array of Outlayer.Items} items
 */
proto.reveal = function( items ) {
  this._emitCompleteOnItems( 'reveal', items );
  if ( !items || !items.length ) {
    return;
  }
  var stagger = this.updateStagger();
  items.forEach( function( item, i ) {
    item.stagger( i * stagger );
    item.reveal();
  });
};

/**
 * hide a collection of items
 * @param {Array of Outlayer.Items} items
 */
proto.hide = function( items ) {
  this._emitCompleteOnItems( 'hide', items );
  if ( !items || !items.length ) {
    return;
  }
  var stagger = this.updateStagger();
  items.forEach( function( item, i ) {
    item.stagger( i * stagger );
    item.hide();
  });
};

/**
 * reveal item elements
 * @param {Array}, {Element}, {NodeList} items
 */
proto.revealItemElements = function( elems ) {
  var items = this.getItems( elems );
  this.reveal( items );
};

/**
 * hide item elements
 * @param {Array}, {Element}, {NodeList} items
 */
proto.hideItemElements = function( elems ) {
  var items = this.getItems( elems );
  this.hide( items );
};

/**
 * get Outlayer.Item, given an Element
 * @param {Element} elem
 * @param {Function} callback
 * @returns {Outlayer.Item} item
 */
proto.getItem = function( elem ) {
  // loop through items to get the one that matches
  for ( var i=0; i < this.items.length; i++ ) {
    var item = this.items[i];
    if ( item.element == elem ) {
      // return item
      return item;
    }
  }
};

/**
 * get collection of Outlayer.Items, given Elements
 * @param {Array} elems
 * @returns {Array} items - Outlayer.Items
 */
proto.getItems = function( elems ) {
  elems = utils.makeArray( elems );
  var items = [];
  elems.forEach( function( elem ) {
    var item = this.getItem( elem );
    if ( item ) {
      items.push( item );
    }
  }, this );

  return items;
};

/**
 * remove element(s) from instance and DOM
 * @param {Array or NodeList or Element} elems
 */
proto.remove = function( elems ) {
  var removeItems = this.getItems( elems );

  this._emitCompleteOnItems( 'remove', removeItems );

  // bail if no items to remove
  if ( !removeItems || !removeItems.length ) {
    return;
  }

  removeItems.forEach( function( item ) {
    item.remove();
    // remove item from collection
    utils.removeFrom( this.items, item );
  }, this );
};

// ----- destroy ----- //

// remove and disable Outlayer instance
proto.destroy = function() {
  // clean up dynamic styles
  var style = this.element.style;
  style.height = '';
  style.position = '';
  style.width = '';
  // destroy items
  this.items.forEach( function( item ) {
    item.destroy();
  });

  this.unbindResize();

  var id = this.element.outlayerGUID;
  delete instances[ id ]; // remove reference to instance by id
  delete this.element.outlayerGUID;
  // remove data for jQuery
  if ( jQuery ) {
    jQuery.removeData( this.element, this.constructor.namespace );
  }

};

// -------------------------- data -------------------------- //

/**
 * get Outlayer instance from element
 * @param {Element} elem
 * @returns {Outlayer}
 */
Outlayer.data = function( elem ) {
  elem = utils.getQueryElement( elem );
  var id = elem && elem.outlayerGUID;
  return id && instances[ id ];
};


// -------------------------- create Outlayer class -------------------------- //

/**
 * create a layout class
 * @param {String} namespace
 */
Outlayer.create = function( namespace, options ) {
  // sub-class Outlayer
  var Layout = subclass( Outlayer );
  // apply new options and compatOptions
  Layout.defaults = utils.extend( {}, Outlayer.defaults );
  utils.extend( Layout.defaults, options );
  Layout.compatOptions = utils.extend( {}, Outlayer.compatOptions  );

  Layout.namespace = namespace;

  Layout.data = Outlayer.data;

  // sub-class Item
  Layout.Item = subclass( Item );

  // -------------------------- declarative -------------------------- //

  utils.htmlInit( Layout, namespace );

  // -------------------------- jQuery bridge -------------------------- //

  // make into jQuery plugin
  if ( jQuery && jQuery.bridget ) {
    jQuery.bridget( namespace, Layout );
  }

  return Layout;
};

function subclass( Parent ) {
  function SubClass() {
    Parent.apply( this, arguments );
  }

  SubClass.prototype = Object.create( Parent.prototype );
  SubClass.prototype.constructor = SubClass;

  return SubClass;
}

// ----- helpers ----- //

// how many milliseconds are in each unit
var msUnits = {
  ms: 1,
  s: 1000
};

// munge time-like parameter into millisecond number
// '0.4s' -> 40
function getMilliseconds( time ) {
  if ( typeof time == 'number' ) {
    return time;
  }
  var matches = time.match( /(^\d*\.?\d*)(\w*)/ );
  var num = matches && matches[1];
  var unit = matches && matches[2];
  if ( !num.length ) {
    return 0;
  }
  num = parseFloat( num );
  var mult = msUnits[ unit ] || 1;
  return num * mult;
}

// ----- fin ----- //

// back in global
Outlayer.Item = Item;

return Outlayer;

}));

/**
 * Isotope Item
**/

( function( window, factory ) {
  // universal module definition
  /* jshint strict: false */ /*globals define, module, require */
  if ( typeof define == 'function' && define.amd ) {
    // AMD
    define( 'isotope/item',[
        'outlayer/outlayer'
      ],
      factory );
  } else if ( typeof module == 'object' && module.exports ) {
    // CommonJS
    module.exports = factory(
      require('outlayer')
    );
  } else {
    // browser global
    window.Isotope = window.Isotope || {};
    window.Isotope.Item = factory(
      window.Outlayer
    );
  }

}( window, function factory( Outlayer ) {
'use strict';

// -------------------------- Item -------------------------- //

// sub-class Outlayer Item
function Item() {
  Outlayer.Item.apply( this, arguments );
}

var proto = Item.prototype = Object.create( Outlayer.Item.prototype );

var _create = proto._create;
proto._create = function() {
  // assign id, used for original-order sorting
  this.id = this.layout.itemGUID++;
  _create.call( this );
  this.sortData = {};
};

proto.updateSortData = function() {
  if ( this.isIgnored ) {
    return;
  }
  // default sorters
  this.sortData.id = this.id;
  // for backward compatibility
  this.sortData['original-order'] = this.id;
  this.sortData.random = Math.random();
  // go thru getSortData obj and apply the sorters
  var getSortData = this.layout.options.getSortData;
  var sorters = this.layout._sorters;
  for ( var key in getSortData ) {
    var sorter = sorters[ key ];
    this.sortData[ key ] = sorter( this.element, this );
  }
};

var _destroy = proto.destroy;
proto.destroy = function() {
  // call super
  _destroy.apply( this, arguments );
  // reset display, #741
  this.css({
    display: ''
  });
};

return Item;

}));

/**
 * Isotope LayoutMode
 */

( function( window, factory ) {
  // universal module definition
  /* jshint strict: false */ /*globals define, module, require */
  if ( typeof define == 'function' && define.amd ) {
    // AMD
    define( 'isotope/layout-mode',[
        'get-size/get-size',
        'outlayer/outlayer'
      ],
      factory );
  } else if ( typeof module == 'object' && module.exports ) {
    // CommonJS
    module.exports = factory(
      require('get-size'),
      require('outlayer')
    );
  } else {
    // browser global
    window.Isotope = window.Isotope || {};
    window.Isotope.LayoutMode = factory(
      window.getSize,
      window.Outlayer
    );
  }

}( window, function factory( getSize, Outlayer ) {
  'use strict';

  // layout mode class
  function LayoutMode( isotope ) {
    this.isotope = isotope;
    // link properties
    if ( isotope ) {
      this.options = isotope.options[ this.namespace ];
      this.element = isotope.element;
      this.items = isotope.filteredItems;
      this.size = isotope.size;
    }
  }

  var proto = LayoutMode.prototype;

  /**
   * some methods should just defer to default Outlayer method
   * and reference the Isotope instance as `this`
  **/
  var facadeMethods = [
    '_resetLayout',
    '_getItemLayoutPosition',
    '_manageStamp',
    '_getContainerSize',
    '_getElementOffset',
    'needsResizeLayout',
    '_getOption'
  ];

  facadeMethods.forEach( function( methodName ) {
    proto[ methodName ] = function() {
      return Outlayer.prototype[ methodName ].apply( this.isotope, arguments );
    };
  });

  // -----  ----- //

  // for horizontal layout modes, check vertical size
  proto.needsVerticalResizeLayout = function() {
    // don't trigger if size did not change
    var size = getSize( this.isotope.element );
    // check that this.size and size are there
    // IE8 triggers resize on body size change, so they might not be
    var hasSizes = this.isotope.size && size;
    return hasSizes && size.innerHeight != this.isotope.size.innerHeight;
  };

  // ----- measurements ----- //

  proto._getMeasurement = function() {
    this.isotope._getMeasurement.apply( this, arguments );
  };

  proto.getColumnWidth = function() {
    this.getSegmentSize( 'column', 'Width' );
  };

  proto.getRowHeight = function() {
    this.getSegmentSize( 'row', 'Height' );
  };

  /**
   * get columnWidth or rowHeight
   * segment: 'column' or 'row'
   * size 'Width' or 'Height'
  **/
  proto.getSegmentSize = function( segment, size ) {
    var segmentName = segment + size;
    var outerSize = 'outer' + size;
    // columnWidth / outerWidth // rowHeight / outerHeight
    this._getMeasurement( segmentName, outerSize );
    // got rowHeight or columnWidth, we can chill
    if ( this[ segmentName ] ) {
      return;
    }
    // fall back to item of first element
    var firstItemSize = this.getFirstItemSize();
    this[ segmentName ] = firstItemSize && firstItemSize[ outerSize ] ||
      // or size of container
      this.isotope.size[ 'inner' + size ];
  };

  proto.getFirstItemSize = function() {
    var firstItem = this.isotope.filteredItems[0];
    return firstItem && firstItem.element && getSize( firstItem.element );
  };

  // ----- methods that should reference isotope ----- //

  proto.layout = function() {
    this.isotope.layout.apply( this.isotope, arguments );
  };

  proto.getSize = function() {
    this.isotope.getSize();
    this.size = this.isotope.size;
  };

  // -------------------------- create -------------------------- //

  LayoutMode.modes = {};

  LayoutMode.create = function( namespace, options ) {

    function Mode() {
      LayoutMode.apply( this, arguments );
    }

    Mode.prototype = Object.create( proto );
    Mode.prototype.constructor = Mode;

    // default options
    if ( options ) {
      Mode.options = options;
    }

    Mode.prototype.namespace = namespace;
    // register in Isotope
    LayoutMode.modes[ namespace ] = Mode;

    return Mode;
  };

  return LayoutMode;

}));

/*!
 * Masonry v4.1.0
 * Cascading grid layout library
 * http://masonry.desandro.com
 * MIT License
 * by David DeSandro
 */

( function( window, factory ) {
  // universal module definition
  /* jshint strict: false */ /*globals define, module, require */
  if ( typeof define == 'function' && define.amd ) {
    // AMD
    define( 'masonry/masonry',[
        'outlayer/outlayer',
        'get-size/get-size'
      ],
      factory );
  } else if ( typeof module == 'object' && module.exports ) {
    // CommonJS
    module.exports = factory(
      require('outlayer'),
      require('get-size')
    );
  } else {
    // browser global
    window.Masonry = factory(
      window.Outlayer,
      window.getSize
    );
  }

}( window, function factory( Outlayer, getSize ) {



// -------------------------- masonryDefinition -------------------------- //

  // create an Outlayer layout class
  var Masonry = Outlayer.create('masonry');
  // isFitWidth -> fitWidth
  Masonry.compatOptions.fitWidth = 'isFitWidth';

  Masonry.prototype._resetLayout = function() {
    this.getSize();
    this._getMeasurement( 'columnWidth', 'outerWidth' );
    this._getMeasurement( 'gutter', 'outerWidth' );
    this.measureColumns();

    // reset column Y
    this.colYs = [];
    for ( var i=0; i < this.cols; i++ ) {
      this.colYs.push( 0 );
    }

    this.maxY = 0;
  };

  Masonry.prototype.measureColumns = function() {
    this.getContainerWidth();
    // if columnWidth is 0, default to outerWidth of first item
    if ( !this.columnWidth ) {
      var firstItem = this.items[0];
      var firstItemElem = firstItem && firstItem.element;
      // columnWidth fall back to item of first element
      this.columnWidth = firstItemElem && getSize( firstItemElem ).outerWidth ||
        // if first elem has no width, default to size of container
        this.containerWidth;
    }

    var columnWidth = this.columnWidth += this.gutter;

    // calculate columns
    var containerWidth = this.containerWidth + this.gutter;
    var cols = containerWidth / columnWidth;
    // fix rounding errors, typically with gutters
    var excess = columnWidth - containerWidth % columnWidth;
    // if overshoot is less than a pixel, round up, otherwise floor it
    var mathMethod = excess && excess < 1 ? 'round' : 'floor';
    cols = Math[ mathMethod ]( cols );
    this.cols = Math.max( cols, 1 );
  };

  Masonry.prototype.getContainerWidth = function() {
    // container is parent if fit width
    var isFitWidth = this._getOption('fitWidth');
    var container = isFitWidth ? this.element.parentNode : this.element;
    // check that this.size and size are there
    // IE8 triggers resize on body size change, so they might not be
    var size = getSize( container );
    this.containerWidth = size && size.innerWidth;
  };

  Masonry.prototype._getItemLayoutPosition = function( item ) {
    item.getSize();
    // how many columns does this brick span
    var remainder = item.size.outerWidth % this.columnWidth;
    var mathMethod = remainder && remainder < 1 ? 'round' : 'ceil';
    // round if off by 1 pixel, otherwise use ceil
    var colSpan = Math[ mathMethod ]( item.size.outerWidth / this.columnWidth );
    colSpan = Math.min( colSpan, this.cols );

    var colGroup = this._getColGroup( colSpan );
    // get the minimum Y value from the columns
    var minimumY = Math.min.apply( Math, colGroup );
    var shortColIndex = colGroup.indexOf( minimumY );

    // position the brick
    var position = {
      x: this.columnWidth * shortColIndex,
      y: minimumY
    };

    // apply setHeight to necessary columns
    var setHeight = minimumY + item.size.outerHeight;
    var setSpan = this.cols + 1 - colGroup.length;
    for ( var i = 0; i < setSpan; i++ ) {
      this.colYs[ shortColIndex + i ] = setHeight;
    }

    return position;
  };

  /**
   * @param {Number} colSpan - number of columns the element spans
   * @returns {Array} colGroup
   */
  Masonry.prototype._getColGroup = function( colSpan ) {
    if ( colSpan < 2 ) {
      // if brick spans only one column, use all the column Ys
      return this.colYs;
    }

    var colGroup = [];
    // how many different places could this brick fit horizontally
    var groupCount = this.cols + 1 - colSpan;
    // for each group potential horizontal position
    for ( var i = 0; i < groupCount; i++ ) {
      // make an array of colY values for that one group
      var groupColYs = this.colYs.slice( i, i + colSpan );
      // and get the max value of the array
      colGroup[i] = Math.max.apply( Math, groupColYs );
    }
    return colGroup;
  };

  Masonry.prototype._manageStamp = function( stamp ) {
    var stampSize = getSize( stamp );
    var offset = this._getElementOffset( stamp );
    // get the columns that this stamp affects
    var isOriginLeft = this._getOption('originLeft');
    var firstX = isOriginLeft ? offset.left : offset.right;
    var lastX = firstX + stampSize.outerWidth;
    var firstCol = Math.floor( firstX / this.columnWidth );
    firstCol = Math.max( 0, firstCol );
    var lastCol = Math.floor( lastX / this.columnWidth );
    // lastCol should not go over if multiple of columnWidth #425
    lastCol -= lastX % this.columnWidth ? 0 : 1;
    lastCol = Math.min( this.cols - 1, lastCol );
    // set colYs to bottom of the stamp

    var isOriginTop = this._getOption('originTop');
    var stampMaxY = ( isOriginTop ? offset.top : offset.bottom ) +
      stampSize.outerHeight;
    for ( var i = firstCol; i <= lastCol; i++ ) {
      this.colYs[i] = Math.max( stampMaxY, this.colYs[i] );
    }
  };

  Masonry.prototype._getContainerSize = function() {
    this.maxY = Math.max.apply( Math, this.colYs );
    var size = {
      height: this.maxY
    };

    if ( this._getOption('fitWidth') ) {
      size.width = this._getContainerFitWidth();
    }

    return size;
  };

  Masonry.prototype._getContainerFitWidth = function() {
    var unusedCols = 0;
    // count unused columns
    var i = this.cols;
    while ( --i ) {
      if ( this.colYs[i] !== 0 ) {
        break;
      }
      unusedCols++;
    }
    // fit container to columns that have been used
    return ( this.cols - unusedCols ) * this.columnWidth - this.gutter;
  };

  Masonry.prototype.needsResizeLayout = function() {
    var previousWidth = this.containerWidth;
    this.getContainerWidth();
    return previousWidth != this.containerWidth;
  };

  return Masonry;

}));

/*!
 * Masonry layout mode
 * sub-classes Masonry
 * http://masonry.desandro.com
 */

( function( window, factory ) {
  // universal module definition
  /* jshint strict: false */ /*globals define, module, require */
  if ( typeof define == 'function' && define.amd ) {
    // AMD
    define( 'isotope/layout-modes/masonry',[
        '../layout-mode',
        'masonry/masonry'
      ],
      factory );
  } else if ( typeof module == 'object' && module.exports ) {
    // CommonJS
    module.exports = factory(
      require('../layout-mode'),
      require('masonry-layout')
    );
  } else {
    // browser global
    factory(
      window.Isotope.LayoutMode,
      window.Masonry
    );
  }

}( window, function factory( LayoutMode, Masonry ) {
'use strict';

// -------------------------- masonryDefinition -------------------------- //

  // create an Outlayer layout class
  var MasonryMode = LayoutMode.create('masonry');

  var proto = MasonryMode.prototype;

  var keepModeMethods = {
    _getElementOffset: true,
    layout: true,
    _getMeasurement: true
  };

  // inherit Masonry prototype
  for ( var method in Masonry.prototype ) {
    // do not inherit mode methods
    if ( !keepModeMethods[ method ] ) {
      proto[ method ] = Masonry.prototype[ method ];
    }
  }

  var measureColumns = proto.measureColumns;
  proto.measureColumns = function() {
    // set items, used if measuring first item
    this.items = this.isotope.filteredItems;
    measureColumns.call( this );
  };

  // point to mode options for fitWidth
  var _getOption = proto._getOption;
  proto._getOption = function( option ) {
    if ( option == 'fitWidth' ) {
      return this.options.isFitWidth !== undefined ?
        this.options.isFitWidth : this.options.fitWidth;
    }
    return _getOption.apply( this.isotope, arguments );
  };

  return MasonryMode;

}));

/**
 * fitRows layout mode
 */

( function( window, factory ) {
  // universal module definition
  /* jshint strict: false */ /*globals define, module, require */
  if ( typeof define == 'function' && define.amd ) {
    // AMD
    define( 'isotope/layout-modes/fit-rows',[
        '../layout-mode'
      ],
      factory );
  } else if ( typeof exports == 'object' ) {
    // CommonJS
    module.exports = factory(
      require('../layout-mode')
    );
  } else {
    // browser global
    factory(
      window.Isotope.LayoutMode
    );
  }

}( window, function factory( LayoutMode ) {
'use strict';

var FitRows = LayoutMode.create('fitRows');

var proto = FitRows.prototype;

proto._resetLayout = function() {
  this.x = 0;
  this.y = 0;
  this.maxY = 0;
  this._getMeasurement( 'gutter', 'outerWidth' );
};

proto._getItemLayoutPosition = function( item ) {
  item.getSize();

  var itemWidth = item.size.outerWidth + this.gutter;
  // if this element cannot fit in the current row
  var containerWidth = this.isotope.size.innerWidth + this.gutter;
  if ( this.x !== 0 && itemWidth + this.x > containerWidth ) {
    this.x = 0;
    this.y = this.maxY;
  }

  var position = {
    x: this.x,
    y: this.y
  };

  this.maxY = Math.max( this.maxY, this.y + item.size.outerHeight );
  this.x += itemWidth;

  return position;
};

proto._getContainerSize = function() {
  return { height: this.maxY };
};

return FitRows;

}));

/**
 * vertical layout mode
 */

( function( window, factory ) {
  // universal module definition
  /* jshint strict: false */ /*globals define, module, require */
  if ( typeof define == 'function' && define.amd ) {
    // AMD
    define( 'isotope/layout-modes/vertical',[
        '../layout-mode'
      ],
      factory );
  } else if ( typeof module == 'object' && module.exports ) {
    // CommonJS
    module.exports = factory(
      require('../layout-mode')
    );
  } else {
    // browser global
    factory(
      window.Isotope.LayoutMode
    );
  }

}( window, function factory( LayoutMode ) {
'use strict';

var Vertical = LayoutMode.create( 'vertical', {
  horizontalAlignment: 0
});

var proto = Vertical.prototype;

proto._resetLayout = function() {
  this.y = 0;
};

proto._getItemLayoutPosition = function( item ) {
  item.getSize();
  var x = ( this.isotope.size.innerWidth - item.size.outerWidth ) *
    this.options.horizontalAlignment;
  var y = this.y;
  this.y += item.size.outerHeight;
  return { x: x, y: y };
};

proto._getContainerSize = function() {
  return { height: this.y };
};

return Vertical;

}));

/*!
 * Isotope v3.0.0
 *
 * Licensed GPLv3 for open source use
 * or Isotope Commercial License for commercial use
 *
 * http://isotope.metafizzy.co
 * Copyright 2016 Metafizzy
 */

( function( window, factory ) {
  // universal module definition
  /* jshint strict: false */ /*globals define, module, require */
  if ( typeof define == 'function' && define.amd ) {
    // AMD
    define( [
        'outlayer/outlayer',
        'get-size/get-size',
        'desandro-matches-selector/matches-selector',
        'fizzy-ui-utils/utils',
        './item',
        './layout-mode',
        // include default layout modes
        './layout-modes/masonry',
        './layout-modes/fit-rows',
        './layout-modes/vertical'
      ],
      function( Outlayer, getSize, matchesSelector, utils, Item, LayoutMode ) {
        return factory( window, Outlayer, getSize, matchesSelector, utils, Item, LayoutMode );
      });
  } else if ( typeof module == 'object' && module.exports ) {
    // CommonJS
    module.exports = factory(
      window,
      require('outlayer'),
      require('get-size'),
      require('desandro-matches-selector'),
      require('fizzy-ui-utils'),
      require('./item'),
      require('./layout-mode'),
      // include default layout modes
      require('./layout-modes/masonry'),
      require('./layout-modes/fit-rows'),
      require('./layout-modes/vertical')
    );
  } else {
    // browser global
    window.Isotope = factory(
      window,
      window.Outlayer,
      window.getSize,
      window.matchesSelector,
      window.fizzyUIUtils,
      window.Isotope.Item,
      window.Isotope.LayoutMode
    );
  }

}( window, function factory( window, Outlayer, getSize, matchesSelector, utils,
  Item, LayoutMode ) {



// -------------------------- vars -------------------------- //

var jQuery = window.jQuery;

// -------------------------- helpers -------------------------- //

var trim = String.prototype.trim ?
  function( str ) {
    return str.trim();
  } :
  function( str ) {
    return str.replace( /^\s+|\s+$/g, '' );
  };

// -------------------------- isotopeDefinition -------------------------- //

  // create an Outlayer layout class
  var Isotope = Outlayer.create( 'isotope', {
    layoutMode: 'masonry',
    isJQueryFiltering: true,
    sortAscending: true
  });

  Isotope.Item = Item;
  Isotope.LayoutMode = LayoutMode;

  var proto = Isotope.prototype;

  proto._create = function() {
    this.itemGUID = 0;
    // functions that sort items
    this._sorters = {};
    this._getSorters();
    // call super
    Outlayer.prototype._create.call( this );

    // create layout modes
    this.modes = {};
    // start filteredItems with all items
    this.filteredItems = this.items;
    // keep of track of sortBys
    this.sortHistory = [ 'original-order' ];
    // create from registered layout modes
    for ( var name in LayoutMode.modes ) {
      this._initLayoutMode( name );
    }
  };

  proto.reloadItems = function() {
    // reset item ID counter
    this.itemGUID = 0;
    // call super
    Outlayer.prototype.reloadItems.call( this );
  };

  proto._itemize = function() {
    var items = Outlayer.prototype._itemize.apply( this, arguments );
    // assign ID for original-order
    for ( var i=0; i < items.length; i++ ) {
      var item = items[i];
      item.id = this.itemGUID++;
    }
    this._updateItemsSortData( items );
    return items;
  };


  // -------------------------- layout -------------------------- //

  proto._initLayoutMode = function( name ) {
    var Mode = LayoutMode.modes[ name ];
    // set mode options
    // HACK extend initial options, back-fill in default options
    var initialOpts = this.options[ name ] || {};
    this.options[ name ] = Mode.options ?
      utils.extend( Mode.options, initialOpts ) : initialOpts;
    // init layout mode instance
    this.modes[ name ] = new Mode( this );
  };


  proto.layout = function() {
    // if first time doing layout, do all magic
    if ( !this._isLayoutInited && this._getOption('initLayout') ) {
      this.arrange();
      return;
    }
    this._layout();
  };

  // private method to be used in layout() & magic()
  proto._layout = function() {
    // don't animate first layout
    var isInstant = this._getIsInstant();
    // layout flow
    this._resetLayout();
    this._manageStamps();
    this.layoutItems( this.filteredItems, isInstant );

    // flag for initalized
    this._isLayoutInited = true;
  };

  // filter + sort + layout
  proto.arrange = function( opts ) {
    // set any options pass
    this.option( opts );
    this._getIsInstant();
    // filter, sort, and layout

    // filter
    var filtered = this._filter( this.items );
    this.filteredItems = filtered.matches;

    this._bindArrangeComplete();

    if ( this._isInstant ) {
      this._noTransition( this._hideReveal, [ filtered ] );
    } else {
      this._hideReveal( filtered );
    }

    this._sort();
    this._layout();
  };
  // alias to _init for main plugin method
  proto._init = proto.arrange;

  proto._hideReveal = function( filtered ) {
    this.reveal( filtered.needReveal );
    this.hide( filtered.needHide );
  };

  // HACK
  // Don't animate/transition first layout
  // Or don't animate/transition other layouts
  proto._getIsInstant = function() {
    var isLayoutInstant = this._getOption('layoutInstant');
    var isInstant = isLayoutInstant !== undefined ? isLayoutInstant :
      !this._isLayoutInited;
    this._isInstant = isInstant;
    return isInstant;
  };

  // listen for layoutComplete, hideComplete and revealComplete
  // to trigger arrangeComplete
  proto._bindArrangeComplete = function() {
    // listen for 3 events to trigger arrangeComplete
    var isLayoutComplete, isHideComplete, isRevealComplete;
    var _this = this;
    function arrangeParallelCallback() {
      if ( isLayoutComplete && isHideComplete && isRevealComplete ) {
        _this.dispatchEvent( 'arrangeComplete', null, [ _this.filteredItems ] );
      }
    }
    this.once( 'layoutComplete', function() {
      isLayoutComplete = true;
      arrangeParallelCallback();
    });
    this.once( 'hideComplete', function() {
      isHideComplete = true;
      arrangeParallelCallback();
    });
    this.once( 'revealComplete', function() {
      isRevealComplete = true;
      arrangeParallelCallback();
    });
  };

  // -------------------------- filter -------------------------- //

  proto._filter = function( items ) {
    var filter = this.options.filter;
    filter = filter || '*';
    var matches = [];
    var hiddenMatched = [];
    var visibleUnmatched = [];

    var test = this._getFilterTest( filter );

    // test each item
    for ( var i=0; i < items.length; i++ ) {
      var item = items[i];
      if ( item.isIgnored ) {
        continue;
      }
      // add item to either matched or unmatched group
      var isMatched = test( item );
      // item.isFilterMatched = isMatched;
      // add to matches if its a match
      if ( isMatched ) {
        matches.push( item );
      }
      // add to additional group if item needs to be hidden or revealed
      if ( isMatched && item.isHidden ) {
        hiddenMatched.push( item );
      } else if ( !isMatched && !item.isHidden ) {
        visibleUnmatched.push( item );
      }
    }

    // return collections of items to be manipulated
    return {
      matches: matches,
      needReveal: hiddenMatched,
      needHide: visibleUnmatched
    };
  };

  // get a jQuery, function, or a matchesSelector test given the filter
  proto._getFilterTest = function( filter ) {
    if ( jQuery && this.options.isJQueryFiltering ) {
      // use jQuery
      return function( item ) {
        return jQuery( item.element ).is( filter );
      };
    }
    if ( typeof filter == 'function' ) {
      // use filter as function
      return function( item ) {
        return filter( item.element );
      };
    }
    // default, use filter as selector string
    return function( item ) {
      return matchesSelector( item.element, filter );
    };
  };

  // -------------------------- sorting -------------------------- //

  /**
   * @params {Array} elems
   * @public
   */
  proto.updateSortData = function( elems ) {
    // get items
    var items;
    if ( elems ) {
      elems = utils.makeArray( elems );
      items = this.getItems( elems );
    } else {
      // update all items if no elems provided
      items = this.items;
    }

    this._getSorters();
    this._updateItemsSortData( items );
  };

  proto._getSorters = function() {
    var getSortData = this.options.getSortData;
    for ( var key in getSortData ) {
      var sorter = getSortData[ key ];
      this._sorters[ key ] = mungeSorter( sorter );
    }
  };

  /**
   * @params {Array} items - of Isotope.Items
   * @private
   */
  proto._updateItemsSortData = function( items ) {
    // do not update if no items
    var len = items && items.length;

    for ( var i=0; len && i < len; i++ ) {
      var item = items[i];
      item.updateSortData();
    }
  };

  // ----- munge sorter ----- //

  // encapsulate this, as we just need mungeSorter
  // other functions in here are just for munging
  var mungeSorter = ( function() {
    // add a magic layer to sorters for convienent shorthands
    // `.foo-bar` will use the text of .foo-bar querySelector
    // `[foo-bar]` will use attribute
    // you can also add parser
    // `.foo-bar parseInt` will parse that as a number
    function mungeSorter( sorter ) {
      // if not a string, return function or whatever it is
      if ( typeof sorter != 'string' ) {
        return sorter;
      }
      // parse the sorter string
      var args = trim( sorter ).split(' ');
      var query = args[0];
      // check if query looks like [an-attribute]
      var attrMatch = query.match( /^\[(.+)\]$/ );
      var attr = attrMatch && attrMatch[1];
      var getValue = getValueGetter( attr, query );
      // use second argument as a parser
      var parser = Isotope.sortDataParsers[ args[1] ];
      // parse the value, if there was a parser
      sorter = parser ? function( elem ) {
        return elem && parser( getValue( elem ) );
      } :
      // otherwise just return value
      function( elem ) {
        return elem && getValue( elem );
      };

      return sorter;
    }

    // get an attribute getter, or get text of the querySelector
    function getValueGetter( attr, query ) {
      // if query looks like [foo-bar], get attribute
      if ( attr ) {
        return function getAttribute( elem ) {
          return elem.getAttribute( attr );
        };
      }

      // otherwise, assume its a querySelector, and get its text
      return function getChildText( elem ) {
        var child = elem.querySelector( query );
        return child && child.textContent;
      };
    }

    return mungeSorter;
  })();

  // parsers used in getSortData shortcut strings
  Isotope.sortDataParsers = {
    'parseInt': function( val ) {
      return parseInt( val, 10 );
    },
    'parseFloat': function( val ) {
      return parseFloat( val );
    }
  };

  // ----- sort method ----- //

  // sort filteredItem order
  proto._sort = function() {
    var sortByOpt = this.options.sortBy;
    if ( !sortByOpt ) {
      return;
    }
    // concat all sortBy and sortHistory
    var sortBys = [].concat.apply( sortByOpt, this.sortHistory );
    // sort magic
    var itemSorter = getItemSorter( sortBys, this.options.sortAscending );
    this.filteredItems.sort( itemSorter );
    // keep track of sortBy History
    if ( sortByOpt != this.sortHistory[0] ) {
      // add to front, oldest goes in last
      this.sortHistory.unshift( sortByOpt );
    }
  };

  // returns a function used for sorting
  function getItemSorter( sortBys, sortAsc ) {
    return function sorter( itemA, itemB ) {
      // cycle through all sortKeys
      for ( var i = 0; i < sortBys.length; i++ ) {
        var sortBy = sortBys[i];
        var a = itemA.sortData[ sortBy ];
        var b = itemB.sortData[ sortBy ];
        if ( a > b || a < b ) {
          // if sortAsc is an object, use the value given the sortBy key
          var isAscending = sortAsc[ sortBy ] !== undefined ? sortAsc[ sortBy ] : sortAsc;
          var direction = isAscending ? 1 : -1;
          return ( a > b ? 1 : -1 ) * direction;
        }
      }
      return 0;
    };
  }

  // -------------------------- methods -------------------------- //

  // get layout mode
  proto._mode = function() {
    var layoutMode = this.options.layoutMode;
    var mode = this.modes[ layoutMode ];
    if ( !mode ) {
      // TODO console.error
      throw new Error( 'No layout mode: ' + layoutMode );
    }
    // HACK sync mode's options
    // any options set after init for layout mode need to be synced
    mode.options = this.options[ layoutMode ];
    return mode;
  };

  proto._resetLayout = function() {
    // trigger original reset layout
    Outlayer.prototype._resetLayout.call( this );
    this._mode()._resetLayout();
  };

  proto._getItemLayoutPosition = function( item  ) {
    return this._mode()._getItemLayoutPosition( item );
  };

  proto._manageStamp = function( stamp ) {
    this._mode()._manageStamp( stamp );
  };

  proto._getContainerSize = function() {
    return this._mode()._getContainerSize();
  };

  proto.needsResizeLayout = function() {
    return this._mode().needsResizeLayout();
  };

  // -------------------------- adding & removing -------------------------- //

  // HEADS UP overwrites default Outlayer appended
  proto.appended = function( elems ) {
    var items = this.addItems( elems );
    if ( !items.length ) {
      return;
    }
    // filter, layout, reveal new items
    var filteredItems = this._filterRevealAdded( items );
    // add to filteredItems
    this.filteredItems = this.filteredItems.concat( filteredItems );
  };

  // HEADS UP overwrites default Outlayer prepended
  proto.prepended = function( elems ) {
    var items = this._itemize( elems );
    if ( !items.length ) {
      return;
    }
    // start new layout
    this._resetLayout();
    this._manageStamps();
    // filter, layout, reveal new items
    var filteredItems = this._filterRevealAdded( items );
    // layout previous items
    this.layoutItems( this.filteredItems );
    // add to items and filteredItems
    this.filteredItems = filteredItems.concat( this.filteredItems );
    this.items = items.concat( this.items );
  };

  proto._filterRevealAdded = function( items ) {
    var filtered = this._filter( items );
    this.hide( filtered.needHide );
    // reveal all new items
    this.reveal( filtered.matches );
    // layout new items, no transition
    this.layoutItems( filtered.matches, true );
    return filtered.matches;
  };

  /**
   * Filter, sort, and layout newly-appended item elements
   * @param {Array or NodeList or Element} elems
   */
  proto.insert = function( elems ) {
    var items = this.addItems( elems );
    if ( !items.length ) {
      return;
    }
    // append item elements
    var i, item;
    var len = items.length;
    for ( i=0; i < len; i++ ) {
      item = items[i];
      this.element.appendChild( item.element );
    }
    // filter new stuff
    var filteredInsertItems = this._filter( items ).matches;
    // set flag
    for ( i=0; i < len; i++ ) {
      items[i].isLayoutInstant = true;
    }
    this.arrange();
    // reset flag
    for ( i=0; i < len; i++ ) {
      delete items[i].isLayoutInstant;
    }
    this.reveal( filteredInsertItems );
  };

  var _remove = proto.remove;
  proto.remove = function( elems ) {
    elems = utils.makeArray( elems );
    var removeItems = this.getItems( elems );
    // do regular thing
    _remove.call( this, elems );
    // bail if no items to remove
    var len = removeItems && removeItems.length;
    // remove elems from filteredItems
    for ( var i=0; len && i < len; i++ ) {
      var item = removeItems[i];
      // remove item from collection
      utils.removeFrom( this.filteredItems, item );
    }
  };

  proto.shuffle = function() {
    // update random sortData
    for ( var i=0; i < this.items.length; i++ ) {
      var item = this.items[i];
      item.sortData.random = Math.random();
    }
    this.options.sortBy = 'random';
    this._sort();
    this._layout();
  };

  /**
   * trigger fn without transition
   * kind of hacky to have this in the first place
   * @param {Function} fn
   * @param {Array} args
   * @returns ret
   * @private
   */
  proto._noTransition = function( fn, args ) {
    // save transitionDuration before disabling
    var transitionDuration = this.options.transitionDuration;
    // disable transition
    this.options.transitionDuration = 0;
    // do it
    var returnValue = fn.apply( this, args );
    // re-enable transition for reveal
    this.options.transitionDuration = transitionDuration;
    return returnValue;
  };

  // ----- helper methods ----- //

  /**
   * getter method for getting filtered item elements
   * @returns {Array} elems - collection of item elements
   */
  proto.getFilteredItemElements = function() {
    return this.filteredItems.map( function( item ) {
      return item.element;
    });
  };

  // -----  ----- //

  return Isotope;

}));


/**
 * @license
 * lodash lodash.com/license | Underscore.js 1.8.3 underscorejs.org/LICENSE
 */
;(function(){function t(t,n){return t.set(n[0],n[1]),t}function n(t,n){return t.add(n),t}function r(t,n,r){switch(r.length){case 0:return t.call(n);case 1:return t.call(n,r[0]);case 2:return t.call(n,r[0],r[1]);case 3:return t.call(n,r[0],r[1],r[2])}return t.apply(n,r)}function e(t,n,r,e){for(var u=-1,o=t?t.length:0;++u<o;){var i=t[u];n(e,i,r(i),t)}return e}function u(t,n){for(var r=-1,e=t?t.length:0;++r<e&&false!==n(t[r],r,t););return t}function o(t,n){for(var r=t?t.length:0;r--&&false!==n(t[r],r,t););
return t}function i(t,n){for(var r=-1,e=t?t.length:0;++r<e;)if(!n(t[r],r,t))return false;return true}function f(t,n){for(var r=-1,e=t?t.length:0,u=0,o=[];++r<e;){var i=t[r];n(i,r,t)&&(o[u++]=i)}return o}function c(t,n){return!(!t||!t.length)&&-1<d(t,n,0)}function a(t,n,r){for(var e=-1,u=t?t.length:0;++e<u;)if(r(n,t[e]))return true;return false}function l(t,n){for(var r=-1,e=t?t.length:0,u=Array(e);++r<e;)u[r]=n(t[r],r,t);return u}function s(t,n){for(var r=-1,e=n.length,u=t.length;++r<e;)t[u+r]=n[r];return t}function h(t,n,r,e){
var u=-1,o=t?t.length:0;for(e&&o&&(r=t[++u]);++u<o;)r=n(r,t[u],u,t);return r}function p(t,n,r,e){var u=t?t.length:0;for(e&&u&&(r=t[--u]);u--;)r=n(r,t[u],u,t);return r}function _(t,n){for(var r=-1,e=t?t.length:0;++r<e;)if(n(t[r],r,t))return true;return false}function v(t,n,r){var e;return r(t,function(t,r,u){return n(t,r,u)?(e=r,false):void 0}),e}function g(t,n,r,e){var u=t.length;for(r+=e?1:-1;e?r--:++r<u;)if(n(t[r],r,t))return r;return-1}function d(t,n,r){if(n!==n)return M(t,r);--r;for(var e=t.length;++r<e;)if(t[r]===n)return r;
return-1}function y(t,n,r,e){--r;for(var u=t.length;++r<u;)if(e(t[r],n))return r;return-1}function b(t,n){var r=t?t.length:0;return r?w(t,n)/r:V}function x(t,n,r,e,u){return u(t,function(t,u,o){r=e?(e=false,t):n(r,t,u,o)}),r}function j(t,n){var r=t.length;for(t.sort(n);r--;)t[r]=t[r].c;return t}function w(t,n){for(var r,e=-1,u=t.length;++e<u;){var o=n(t[e]);o!==T&&(r=r===T?o:r+o)}return r}function m(t,n){for(var r=-1,e=Array(t);++r<t;)e[r]=n(r);return e}function A(t,n){return l(n,function(n){return[n,t[n]];
})}function O(t){return function(n){return t(n)}}function k(t,n){return l(n,function(n){return t[n]})}function E(t,n){return t.has(n)}function S(t,n){for(var r=-1,e=t.length;++r<e&&-1<d(n,t[r],0););return r}function I(t,n){for(var r=t.length;r--&&-1<d(n,t[r],0););return r}function R(t){return t&&t.Object===Object?t:null}function W(t){return zt[t]}function B(t){return Ut[t]}function L(t){return"\\"+Dt[t]}function M(t,n,r){var e=t.length;for(n+=r?1:-1;r?n--:++n<e;){var u=t[n];if(u!==u)return n}return-1;
}function C(t){var n=false;if(null!=t&&typeof t.toString!="function")try{n=!!(t+"")}catch(r){}return n}function z(t){for(var n,r=[];!(n=t.next()).done;)r.push(n.value);return r}function U(t){var n=-1,r=Array(t.size);return t.forEach(function(t,e){r[++n]=[e,t]}),r}function $(t,n){for(var r=-1,e=t.length,u=0,o=[];++r<e;){var i=t[r];i!==n&&"__lodash_placeholder__"!==i||(t[r]="__lodash_placeholder__",o[u++]=r)}return o}function D(t){var n=-1,r=Array(t.size);return t.forEach(function(t){r[++n]=t}),r}function F(t){
var n=-1,r=Array(t.size);return t.forEach(function(t){r[++n]=[t,t]}),r}function N(t){if(!t||!Wt.test(t))return t.length;for(var n=It.lastIndex=0;It.test(t);)n++;return n}function P(t){return $t[t]}function Z(R){function At(t,n){return R.setTimeout.call(Kt,t,n)}function Ot(t){if(Ze(t)&&!vi(t)&&!(t instanceof Ut)){if(t instanceof zt)return t;if(Ru.call(t,"__wrapped__"))return ce(t)}return new zt(t)}function kt(){}function zt(t,n){this.__wrapped__=t,this.__actions__=[],this.__chain__=!!n,this.__index__=0,
this.__values__=T}function Ut(t){this.__wrapped__=t,this.__actions__=[],this.__dir__=1,this.__filtered__=false,this.__iteratees__=[],this.__takeCount__=4294967295,this.__views__=[]}function $t(t){var n=-1,r=t?t.length:0;for(this.clear();++n<r;){var e=t[n];this.set(e[0],e[1])}}function Dt(t){var n=-1,r=t?t.length:0;for(this.clear();++n<r;){var e=t[n];this.set(e[0],e[1])}}function Pt(t){var n=-1,r=t?t.length:0;for(this.clear();++n<r;){var e=t[n];this.set(e[0],e[1])}}function Zt(t){var n=-1,r=t?t.length:0;
for(this.__data__=new Pt;++n<r;)this.add(t[n])}function qt(t){this.__data__=new Dt(t)}function Vt(t,n,r,e){return t===T||Me(t,Ou[r])&&!Ru.call(e,r)?n:t}function Jt(t,n,r){(r===T||Me(t[n],r))&&(typeof n!="number"||r!==T||n in t)||(t[n]=r)}function Yt(t,n,r){var e=t[n];Ru.call(t,n)&&Me(e,r)&&(r!==T||n in t)||(t[n]=r)}function Ht(t,n){for(var r=t.length;r--;)if(Me(t[r][0],n))return r;return-1}function Qt(t,n,r,e){return mo(t,function(t,u,o){n(e,t,r(t),o)}),e}function Xt(t,n){return t&&sr(n,ou(n),t)}
function tn(t,n){for(var r=-1,e=null==t,u=n.length,o=Array(u);++r<u;)o[r]=e?T:eu(t,n[r]);return o}function nn(t,n,r){return t===t&&(r!==T&&(t=r>=t?t:r),n!==T&&(t=t>=n?t:n)),t}function rn(t,n,r,e,o,i,f){var c;if(e&&(c=i?e(t,o,i,f):e(t)),c!==T)return c;if(!Pe(t))return t;if(o=vi(t)){if(c=Vr(t),!n)return lr(t,c)}else{var a=Tr(t),l="[object Function]"==a||"[object GeneratorFunction]"==a;if(gi(t))return or(t,n);if("[object Object]"==a||"[object Arguments]"==a||l&&!i){if(C(t))return i?t:{};if(c=Kr(l?{}:t),
!n)return hr(t,Xt(c,t))}else{if(!Ct[a])return i?t:{};c=Gr(t,a,rn,n)}}if(f||(f=new qt),i=f.get(t))return i;if(f.set(t,c),!o)var s=r?gn(t,ou,Zr):ou(t);return u(s||t,function(u,o){s&&(o=u,u=t[o]),Yt(c,o,rn(u,n,r,e,o,t,f))}),c}function en(t){var n=ou(t),r=n.length;return function(e){if(null==e)return!r;for(var u=r;u--;){var o=n[u],i=t[o],f=e[o];if(f===T&&!(o in Object(e))||!i(f))return false}return true}}function un(t){return Pe(t)?Zu(t):{}}function on(t,n,r){if(typeof t!="function")throw new mu("Expected a function");
return At(function(){t.apply(T,r)},n)}function fn(t,n,r,e){var u=-1,o=c,i=true,f=t.length,s=[],h=n.length;if(!f)return s;r&&(n=l(n,O(r))),e?(o=a,i=false):n.length>=200&&(o=E,i=false,n=new Zt(n));t:for(;++u<f;){var p=t[u],_=r?r(p):p,p=e||0!==p?p:0;if(i&&_===_){for(var v=h;v--;)if(n[v]===_)continue t;s.push(p)}else o(n,_,e)||s.push(p)}return s}function cn(t,n){var r=true;return mo(t,function(t,e,u){return r=!!n(t,e,u)}),r}function an(t,n,r){for(var e=-1,u=t.length;++e<u;){var o=t[e],i=n(o);if(null!=i&&(f===T?i===i&&!Ge(i):r(i,f)))var f=i,c=o;
}return c}function ln(t,n){var r=[];return mo(t,function(t,e,u){n(t,e,u)&&r.push(t)}),r}function sn(t,n,r,e,u){var o=-1,i=t.length;for(r||(r=Yr),u||(u=[]);++o<i;){var f=t[o];n>0&&r(f)?n>1?sn(f,n-1,r,e,u):s(u,f):e||(u[u.length]=f)}return u}function hn(t,n){return t&&Oo(t,n,ou)}function pn(t,n){return t&&ko(t,n,ou)}function _n(t,n){return f(n,function(n){return De(t[n])})}function vn(t,n){n=te(n,t)?[n]:er(n);for(var r=0,e=n.length;null!=t&&e>r;)t=t[ie(n[r++])];return r&&r==e?t:T}function gn(t,n,r){
return n=n(t),vi(t)?n:s(n,r(t))}function dn(t,n){return t>n}function yn(t,n){return null!=t&&(Ru.call(t,n)||typeof t=="object"&&n in t&&null===Gu(Object(t)))}function bn(t,n){return null!=t&&n in Object(t)}function xn(t,n,r){for(var e=r?a:c,u=t[0].length,o=t.length,i=o,f=Array(o),s=1/0,h=[];i--;){var p=t[i];i&&n&&(p=l(p,O(n))),s=Xu(p.length,s),f[i]=!r&&(n||u>=120&&p.length>=120)?new Zt(i&&p):T}var p=t[0],_=-1,v=f[0];t:for(;++_<u&&s>h.length;){var g=p[_],d=n?n(g):g,g=r||0!==g?g:0;if(v?!E(v,d):!e(h,d,r)){
for(i=o;--i;){var y=f[i];if(y?!E(y,d):!e(t[i],d,r))continue t}v&&v.push(d),h.push(g)}}return h}function jn(t,n,r){var e={};return hn(t,function(t,u,o){n(e,r(t),u,o)}),e}function wn(t,n,e){return te(n,t)||(n=er(n),t=oe(t,n),n=_e(n)),n=null==t?t:t[ie(n)],null==n?T:r(n,t,e)}function mn(t,n,r,e,u){if(t===n)n=true;else if(null==t||null==n||!Pe(t)&&!Ze(n))n=t!==t&&n!==n;else t:{var o=vi(t),i=vi(n),f="[object Array]",c="[object Array]";o||(f=Tr(t),f="[object Arguments]"==f?"[object Object]":f),i||(c=Tr(n),
c="[object Arguments]"==c?"[object Object]":c);var a="[object Object]"==f&&!C(t),i="[object Object]"==c&&!C(n);if((c=f==c)&&!a)u||(u=new qt),n=o||Je(t)?Cr(t,n,mn,r,e,u):zr(t,n,f,mn,r,e,u);else{if(!(2&e)&&(o=a&&Ru.call(t,"__wrapped__"),f=i&&Ru.call(n,"__wrapped__"),o||f)){t=o?t.value():t,n=f?n.value():n,u||(u=new qt),n=mn(t,n,r,e,u);break t}if(c)n:if(u||(u=new qt),o=2&e,f=ou(t),i=f.length,c=ou(n).length,i==c||o){for(a=i;a--;){var l=f[a];if(!(o?l in n:yn(n,l))){n=false;break n}}if(c=u.get(t))n=c==n;else{
c=true,u.set(t,n);for(var s=o;++a<i;){var l=f[a],h=t[l],p=n[l];if(r)var _=o?r(p,h,l,n,t,u):r(h,p,l,t,n,u);if(_===T?h!==p&&!mn(h,p,r,e,u):!_){c=false;break}s||(s="constructor"==l)}c&&!s&&(r=t.constructor,e=n.constructor,r!=e&&"constructor"in t&&"constructor"in n&&!(typeof r=="function"&&r instanceof r&&typeof e=="function"&&e instanceof e)&&(c=false)),u["delete"](t),n=c}}else n=false;else n=false}}return n}function An(t,n,r,e){var u=r.length,o=u,i=!e;if(null==t)return!o;for(t=Object(t);u--;){var f=r[u];if(i&&f[2]?f[1]!==t[f[0]]:!(f[0]in t))return false;
}for(;++u<o;){var f=r[u],c=f[0],a=t[c],l=f[1];if(i&&f[2]){if(a===T&&!(c in t))return false}else{if(f=new qt,e)var s=e(a,l,c,t,n,f);if(s===T?!mn(l,a,e,3,f):!s)return false}}return true}function On(t){return!Pe(t)||Su&&Su in t?false:(De(t)||C(t)?Cu:yt).test(fe(t))}function kn(t){return typeof t=="function"?t:null==t?hu:typeof t=="object"?vi(t)?Wn(t[0],t[1]):Rn(t):gu(t)}function En(t){t=null==t?t:Object(t);var n,r=[];for(n in t)r.push(n);return r}function Sn(t,n){return n>t}function In(t,n){var r=-1,e=ze(t)?Array(t.length):[];
return mo(t,function(t,u,o){e[++r]=n(t,u,o)}),e}function Rn(t){var n=Nr(t);return 1==n.length&&n[0][2]?ee(n[0][0],n[0][1]):function(r){return r===t||An(r,t,n)}}function Wn(t,n){return te(t)&&n===n&&!Pe(n)?ee(ie(t),n):function(r){var e=eu(r,t);return e===T&&e===n?uu(r,t):mn(n,e,T,3)}}function Bn(t,n,r,e,o){if(t!==n){if(!vi(n)&&!Je(n))var i=iu(n);u(i||n,function(u,f){if(i&&(f=u,u=n[f]),Pe(u)){o||(o=new qt);var c=f,a=o,l=t[c],s=n[c],h=a.get(s);if(h)Jt(t,c,h);else{var h=e?e(l,s,c+"",t,n,a):T,p=h===T;p&&(h=s,
vi(s)||Je(s)?vi(l)?h=l:Ue(l)?h=lr(l):(p=false,h=rn(s,true)):qe(s)||Ce(s)?Ce(l)?h=nu(l):!Pe(l)||r&&De(l)?(p=false,h=rn(s,true)):h=l:p=false),a.set(s,h),p&&Bn(h,s,r,e,a),a["delete"](s),Jt(t,c,h)}}else c=e?e(t[f],u,f+"",t,n,o):T,c===T&&(c=u),Jt(t,f,c)})}}function Ln(t,n){var r=t.length;return r?(n+=0>n?r:0,Qr(n,r)?t[n]:T):void 0}function Mn(t,n,r){var e=-1;return n=l(n.length?n:[hu],O(Dr())),t=In(t,function(t){return{a:l(n,function(n){return n(t)}),b:++e,c:t}}),j(t,function(t,n){var e;t:{e=-1;for(var u=t.a,o=n.a,i=u.length,f=r.length;++e<i;){
var c=fr(u[e],o[e]);if(c){e=e>=f?c:c*("desc"==r[e]?-1:1);break t}}e=t.b-n.b}return e})}function Cn(t,n){return t=Object(t),h(n,function(n,r){return r in t&&(n[r]=t[r]),n},{})}function zn(t,n){for(var r=-1,e=gn(t,iu,Wo),u=e.length,o={};++r<u;){var i=e[r],f=t[i];n(f,i)&&(o[i]=f)}return o}function Un(t){return function(n){return null==n?T:n[t]}}function $n(t){return function(n){return vn(n,t)}}function Dn(t,n,r,e){var u=e?y:d,o=-1,i=n.length,f=t;for(t===n&&(n=lr(n)),r&&(f=l(t,O(r)));++o<i;)for(var c=0,a=n[o],a=r?r(a):a;-1<(c=u(f,a,c,e));)f!==t&&qu.call(f,c,1),
qu.call(t,c,1);return t}function Fn(t,n){for(var r=t?n.length:0,e=r-1;r--;){var u=n[r];if(r==e||u!==o){var o=u;if(Qr(u))qu.call(t,u,1);else if(te(u,t))delete t[ie(u)];else{var u=er(u),i=oe(t,u);null!=i&&delete i[ie(_e(u))]}}}}function Nn(t,n){return t+Ku(no()*(n-t+1))}function Pn(t,n){var r="";if(!t||1>n||n>9007199254740991)return r;do n%2&&(r+=t),(n=Ku(n/2))&&(t+=t);while(n);return r}function Zn(t,n,r,e){n=te(n,t)?[n]:er(n);for(var u=-1,o=n.length,i=o-1,f=t;null!=f&&++u<o;){var c=ie(n[u]);if(Pe(f)){
var a=r;if(u!=i){var l=f[c],a=e?e(l,c,f):T;a===T&&(a=null==l?Qr(n[u+1])?[]:{}:l)}Yt(f,c,a)}f=f[c]}return t}function Tn(t,n,r){var e=-1,u=t.length;for(0>n&&(n=-n>u?0:u+n),r=r>u?u:r,0>r&&(r+=u),u=n>r?0:r-n>>>0,n>>>=0,r=Array(u);++e<u;)r[e]=t[e+n];return r}function qn(t,n){var r;return mo(t,function(t,e,u){return r=n(t,e,u),!r}),!!r}function Vn(t,n,r){var e=0,u=t?t.length:e;if(typeof n=="number"&&n===n&&2147483647>=u){for(;u>e;){var o=e+u>>>1,i=t[o];null!==i&&!Ge(i)&&(r?n>=i:n>i)?e=o+1:u=o}return u}
return Kn(t,n,hu,r)}function Kn(t,n,r,e){n=r(n);for(var u=0,o=t?t.length:0,i=n!==n,f=null===n,c=Ge(n),a=n===T;o>u;){var l=Ku((u+o)/2),s=r(t[l]),h=s!==T,p=null===s,_=s===s,v=Ge(s);(i?e||_:a?_&&(e||h):f?_&&h&&(e||!p):c?_&&h&&!p&&(e||!v):p||v?0:e?n>=s:n>s)?u=l+1:o=l}return Xu(o,4294967294)}function Gn(t,n){for(var r=-1,e=t.length,u=0,o=[];++r<e;){var i=t[r],f=n?n(i):i;if(!r||!Me(f,c)){var c=f;o[u++]=0===i?0:i}}return o}function Jn(t){return typeof t=="number"?t:Ge(t)?V:+t}function Yn(t){if(typeof t=="string")return t;
if(Ge(t))return wo?wo.call(t):"";var n=t+"";return"0"==n&&1/t==-q?"-0":n}function Hn(t,n,r){var e=-1,u=c,o=t.length,i=true,f=[],l=f;if(r)i=false,u=a;else if(o>=200){if(u=n?null:So(t))return D(u);i=false,u=E,l=new Zt}else l=n?[]:f;t:for(;++e<o;){var s=t[e],h=n?n(s):s,s=r||0!==s?s:0;if(i&&h===h){for(var p=l.length;p--;)if(l[p]===h)continue t;n&&l.push(h),f.push(s)}else u(l,h,r)||(l!==f&&l.push(h),f.push(s))}return f}function Qn(t,n,r,e){for(var u=t.length,o=e?u:-1;(e?o--:++o<u)&&n(t[o],o,t););return r?Tn(t,e?0:o,e?o+1:u):Tn(t,e?o+1:0,e?u:o);
}function Xn(t,n){var r=t;return r instanceof Ut&&(r=r.value()),h(n,function(t,n){return n.func.apply(n.thisArg,s([t],n.args))},r)}function tr(t,n,r){for(var e=-1,u=t.length;++e<u;)var o=o?s(fn(o,t[e],n,r),fn(t[e],o,n,r)):t[e];return o&&o.length?Hn(o,n,r):[]}function nr(t,n,r){for(var e=-1,u=t.length,o=n.length,i={};++e<u;)r(i,t[e],o>e?n[e]:T);return i}function rr(t){return Ue(t)?t:[]}function er(t){return vi(t)?t:Mo(t)}function ur(t,n,r){var e=t.length;return r=r===T?e:r,!n&&r>=e?t:Tn(t,n,r)}function or(t,n){
if(n)return t.slice();var r=new t.constructor(t.length);return t.copy(r),r}function ir(t){var n=new t.constructor(t.byteLength);return new Du(n).set(new Du(t)),n}function fr(t,n){if(t!==n){var r=t!==T,e=null===t,u=t===t,o=Ge(t),i=n!==T,f=null===n,c=n===n,a=Ge(n);if(!f&&!a&&!o&&t>n||o&&i&&c&&!f&&!a||e&&i&&c||!r&&c||!u)return 1;if(!e&&!o&&!a&&n>t||a&&r&&u&&!e&&!o||f&&r&&u||!i&&u||!c)return-1}return 0}function cr(t,n,r,e){var u=-1,o=t.length,i=r.length,f=-1,c=n.length,a=Qu(o-i,0),l=Array(c+a);for(e=!e;++f<c;)l[f]=n[f];
for(;++u<i;)(e||o>u)&&(l[r[u]]=t[u]);for(;a--;)l[f++]=t[u++];return l}function ar(t,n,r,e){var u=-1,o=t.length,i=-1,f=r.length,c=-1,a=n.length,l=Qu(o-f,0),s=Array(l+a);for(e=!e;++u<l;)s[u]=t[u];for(l=u;++c<a;)s[l+c]=n[c];for(;++i<f;)(e||o>u)&&(s[l+r[i]]=t[u++]);return s}function lr(t,n){var r=-1,e=t.length;for(n||(n=Array(e));++r<e;)n[r]=t[r];return n}function sr(t,n,r,e){r||(r={});for(var u=-1,o=n.length;++u<o;){var i=n[u],f=e?e(r[i],t[i],i,r,t):t[i];Yt(r,i,f)}return r}function hr(t,n){return sr(t,Zr(t),n);
}function pr(t,n){return function(r,u){var o=vi(r)?e:Qt,i=n?n():{};return o(r,t,Dr(u),i)}}function _r(t){return Le(function(n,r){var e=-1,u=r.length,o=u>1?r[u-1]:T,i=u>2?r[2]:T,o=t.length>3&&typeof o=="function"?(u--,o):T;for(i&&Xr(r[0],r[1],i)&&(o=3>u?T:o,u=1),n=Object(n);++e<u;)(i=r[e])&&t(n,i,e,o);return n})}function vr(t,n){return function(r,e){if(null==r)return r;if(!ze(r))return t(r,e);for(var u=r.length,o=n?u:-1,i=Object(r);(n?o--:++o<u)&&false!==e(i[o],o,i););return r}}function gr(t){return function(n,r,e){
var u=-1,o=Object(n);e=e(n);for(var i=e.length;i--;){var f=e[t?i:++u];if(false===r(o[f],f,o))break}return n}}function dr(t,n,r){function e(){return(this&&this!==Kt&&this instanceof e?o:t).apply(u?r:this,arguments)}var u=1&n,o=xr(t);return e}function yr(t){return function(n){n=ru(n);var r=Wt.test(n)?n.match(It):T,e=r?r[0]:n.charAt(0);return n=r?ur(r,1).join(""):n.slice(1),e[t]()+n}}function br(t){return function(n){return h(lu(au(n).replace(Et,"")),t,"")}}function xr(t){return function(){var n=arguments;
switch(n.length){case 0:return new t;case 1:return new t(n[0]);case 2:return new t(n[0],n[1]);case 3:return new t(n[0],n[1],n[2]);case 4:return new t(n[0],n[1],n[2],n[3]);case 5:return new t(n[0],n[1],n[2],n[3],n[4]);case 6:return new t(n[0],n[1],n[2],n[3],n[4],n[5]);case 7:return new t(n[0],n[1],n[2],n[3],n[4],n[5],n[6])}var r=un(t.prototype),n=t.apply(r,n);return Pe(n)?n:r}}function jr(t,n,e){function u(){for(var i=arguments.length,f=Array(i),c=i,a=$r(u);c--;)f[c]=arguments[c];return c=3>i&&f[0]!==a&&f[i-1]!==a?[]:$(f,a),
i-=c.length,e>i?Wr(t,n,mr,u.placeholder,T,f,c,T,T,e-i):r(this&&this!==Kt&&this instanceof u?o:t,this,f)}var o=xr(t);return u}function wr(t){return Le(function(n){n=sn(n,1);var r=n.length,e=r,u=zt.prototype.thru;for(t&&n.reverse();e--;){var o=n[e];if(typeof o!="function")throw new mu("Expected a function");if(u&&!i&&"wrapper"==Ur(o))var i=new zt([],true)}for(e=i?e:r;++e<r;)var o=n[e],u=Ur(o),f="wrapper"==u?Io(o):T,i=f&&ne(f[0])&&424==f[1]&&!f[4].length&&1==f[9]?i[Ur(f[0])].apply(i,f[3]):1==o.length&&ne(o)?i[u]():i.thru(o);
return function(){var t=arguments,e=t[0];if(i&&1==t.length&&vi(e)&&e.length>=200)return i.plant(e).value();for(var u=0,t=r?n[u].apply(this,t):e;++u<r;)t=n[u].call(this,t);return t}})}function mr(t,n,r,e,u,o,i,f,c,a){function l(){for(var d=arguments.length,y=Array(d),b=d;b--;)y[b]=arguments[b];if(_){var x,j=$r(l),b=y.length;for(x=0;b--;)y[b]===j&&x++}if(e&&(y=cr(y,e,u,_)),o&&(y=ar(y,o,i,_)),d-=x,_&&a>d)return j=$(y,j),Wr(t,n,mr,l.placeholder,r,y,j,f,c,a-d);if(j=h?r:this,b=p?j[t]:t,d=y.length,f){x=y.length;
for(var w=Xu(f.length,x),m=lr(y);w--;){var A=f[w];y[w]=Qr(A,x)?m[A]:T}}else v&&d>1&&y.reverse();return s&&d>c&&(y.length=c),this&&this!==Kt&&this instanceof l&&(b=g||xr(b)),b.apply(j,y)}var s=128&n,h=1&n,p=2&n,_=24&n,v=512&n,g=p?T:xr(t);return l}function Ar(t,n){return function(r,e){return jn(r,t,n(e))}}function Or(t){return function(n,r){var e;if(n===T&&r===T)return 0;if(n!==T&&(e=n),r!==T){if(e===T)return r;typeof n=="string"||typeof r=="string"?(n=Yn(n),r=Yn(r)):(n=Jn(n),r=Jn(r)),e=t(n,r)}return e;
}}function kr(t){return Le(function(n){return n=1==n.length&&vi(n[0])?l(n[0],O(Dr())):l(sn(n,1,Hr),O(Dr())),Le(function(e){var u=this;return t(n,function(t){return r(t,u,e)})})})}function Er(t,n){n=n===T?" ":Yn(n);var r=n.length;return 2>r?r?Pn(n,t):n:(r=Pn(n,Vu(t/N(n))),Wt.test(n)?ur(r.match(It),0,t).join(""):r.slice(0,t))}function Sr(t,n,e,u){function o(){for(var n=-1,c=arguments.length,a=-1,l=u.length,s=Array(l+c),h=this&&this!==Kt&&this instanceof o?f:t;++a<l;)s[a]=u[a];for(;c--;)s[a++]=arguments[++n];
return r(h,i?e:this,s)}var i=1&n,f=xr(t);return o}function Ir(t){return function(n,r,e){e&&typeof e!="number"&&Xr(n,r,e)&&(r=e=T),n=tu(n),n=n===n?n:0,r===T?(r=n,n=0):r=tu(r)||0,e=e===T?r>n?1:-1:tu(e)||0;var u=-1;r=Qu(Vu((r-n)/(e||1)),0);for(var o=Array(r);r--;)o[t?r:++u]=n,n+=e;return o}}function Rr(t){return function(n,r){return typeof n=="string"&&typeof r=="string"||(n=tu(n),r=tu(r)),t(n,r)}}function Wr(t,n,r,e,u,o,i,f,c,a){var l=8&n,s=l?i:T;i=l?T:i;var h=l?o:T;return o=l?T:o,n=(n|(l?32:64))&~(l?64:32),
4&n||(n&=-4),n=[t,n,u,h,s,o,i,f,c,a],r=r.apply(T,n),ne(t)&&Lo(r,n),r.placeholder=e,r}function Br(t){var n=ju[t];return function(t,r){if(t=tu(t),r=Xu(Qe(r),292)){var e=(ru(t)+"e").split("e"),e=n(e[0]+"e"+(+e[1]+r)),e=(ru(e)+"e").split("e");return+(e[0]+"e"+(+e[1]-r))}return n(t)}}function Lr(t){return function(n){var r=Tr(n);return"[object Map]"==r?U(n):"[object Set]"==r?F(n):A(n,t(n))}}function Mr(t,n,r,e,u,o,i,f){var c=2&n;if(!c&&typeof t!="function")throw new mu("Expected a function");var a=e?e.length:0;
if(a||(n&=-97,e=u=T),i=i===T?i:Qu(Qe(i),0),f=f===T?f:Qe(f),a-=u?u.length:0,64&n){var l=e,s=u;e=u=T}var h=c?T:Io(t);return o=[t,n,r,e,u,l,s,o,i,f],h&&(r=o[1],t=h[1],n=r|t,e=128==t&&8==r||128==t&&256==r&&h[8]>=o[7].length||384==t&&h[8]>=h[7].length&&8==r,131>n||e)&&(1&t&&(o[2]=h[2],n|=1&r?0:4),(r=h[3])&&(e=o[3],o[3]=e?cr(e,r,h[4]):r,o[4]=e?$(o[3],"__lodash_placeholder__"):h[4]),(r=h[5])&&(e=o[5],o[5]=e?ar(e,r,h[6]):r,o[6]=e?$(o[5],"__lodash_placeholder__"):h[6]),(r=h[7])&&(o[7]=r),128&t&&(o[8]=null==o[8]?h[8]:Xu(o[8],h[8])),
null==o[9]&&(o[9]=h[9]),o[0]=h[0],o[1]=n),t=o[0],n=o[1],r=o[2],e=o[3],u=o[4],f=o[9]=null==o[9]?c?0:t.length:Qu(o[9]-a,0),!f&&24&n&&(n&=-25),(h?Eo:Lo)(n&&1!=n?8==n||16==n?jr(t,n,f):32!=n&&33!=n||u.length?mr.apply(T,o):Sr(t,n,r,e):dr(t,n,r),o)}function Cr(t,n,r,e,u,o){var i=2&u,f=t.length,c=n.length;if(f!=c&&!(i&&c>f))return false;if(c=o.get(t))return c==n;var c=-1,a=true,l=1&u?new Zt:T;for(o.set(t,n);++c<f;){var s=t[c],h=n[c];if(e)var p=i?e(h,s,c,n,t,o):e(s,h,c,t,n,o);if(p!==T){if(p)continue;a=false;break}
if(l){if(!_(n,function(t,n){return l.has(n)||s!==t&&!r(s,t,e,u,o)?void 0:l.add(n)})){a=false;break}}else if(s!==h&&!r(s,h,e,u,o)){a=false;break}}return o["delete"](t),a}function zr(t,n,r,e,u,o,i){switch(r){case"[object DataView]":if(t.byteLength!=n.byteLength||t.byteOffset!=n.byteOffset)break;t=t.buffer,n=n.buffer;case"[object ArrayBuffer]":if(t.byteLength!=n.byteLength||!e(new Du(t),new Du(n)))break;return true;case"[object Boolean]":case"[object Date]":return+t==+n;case"[object Error]":return t.name==n.name&&t.message==n.message;
case"[object Number]":return t!=+t?n!=+n:t==+n;case"[object RegExp]":case"[object String]":return t==n+"";case"[object Map]":var f=U;case"[object Set]":if(f||(f=D),t.size!=n.size&&!(2&o))break;return(r=i.get(t))?r==n:(o|=1,i.set(t,n),Cr(f(t),f(n),e,u,o,i));case"[object Symbol]":if(jo)return jo.call(t)==jo.call(n)}return false}function Ur(t){for(var n=t.name+"",r=po[n],e=Ru.call(po,n)?r.length:0;e--;){var u=r[e],o=u.func;if(null==o||o==t)return u.name}return n}function $r(t){return(Ru.call(Ot,"placeholder")?Ot:t).placeholder;
}function Dr(){var t=Ot.iteratee||pu,t=t===pu?kn:t;return arguments.length?t(arguments[0],arguments[1]):t}function Fr(t,n){var r=t.__data__,e=typeof n;return("string"==e||"number"==e||"symbol"==e||"boolean"==e?"__proto__"!==n:null===n)?r[typeof n=="string"?"string":"hash"]:r.map}function Nr(t){for(var n=ou(t),r=n.length;r--;){var e=n[r],u=t[e];n[r]=[e,u,u===u&&!Pe(u)]}return n}function Pr(t,n){var r=null==t?T:t[n];return On(r)?r:T}function Zr(t){return Nu(Object(t))}function Tr(t){return Lu.call(t);
}function qr(t,n,r){n=te(n,t)?[n]:er(n);for(var e,u=-1,o=n.length;++u<o;){var i=ie(n[u]);if(!(e=null!=t&&r(t,i)))break;t=t[i]}return e?e:(o=t?t.length:0,!!o&&Ne(o)&&Qr(i,o)&&(vi(t)||Ke(t)||Ce(t)))}function Vr(t){var n=t.length,r=t.constructor(n);return n&&"string"==typeof t[0]&&Ru.call(t,"index")&&(r.index=t.index,r.input=t.input),r}function Kr(t){return typeof t.constructor!="function"||re(t)?{}:un(Gu(Object(t)))}function Gr(r,e,u,o){var i=r.constructor;switch(e){case"[object ArrayBuffer]":return ir(r);
case"[object Boolean]":case"[object Date]":return new i(+r);case"[object DataView]":return e=o?ir(r.buffer):r.buffer,new r.constructor(e,r.byteOffset,r.byteLength);case"[object Float32Array]":case"[object Float64Array]":case"[object Int8Array]":case"[object Int16Array]":case"[object Int32Array]":case"[object Uint8Array]":case"[object Uint8ClampedArray]":case"[object Uint16Array]":case"[object Uint32Array]":return e=o?ir(r.buffer):r.buffer,new r.constructor(e,r.byteOffset,r.length);case"[object Map]":
return e=o?u(U(r),true):U(r),h(e,t,new r.constructor);case"[object Number]":case"[object String]":return new i(r);case"[object RegExp]":return e=new r.constructor(r.source,_t.exec(r)),e.lastIndex=r.lastIndex,e;case"[object Set]":return e=o?u(D(r),true):D(r),h(e,n,new r.constructor);case"[object Symbol]":return jo?Object(jo.call(r)):{}}}function Jr(t){var n=t?t.length:T;return Ne(n)&&(vi(t)||Ke(t)||Ce(t))?m(n,String):null}function Yr(t){return vi(t)||Ce(t)}function Hr(t){return vi(t)&&!(2==t.length&&!De(t[0]));
}function Qr(t,n){return n=null==n?9007199254740991:n,!!n&&(typeof t=="number"||xt.test(t))&&t>-1&&0==t%1&&n>t}function Xr(t,n,r){if(!Pe(r))return false;var e=typeof n;return("number"==e?ze(r)&&Qr(n,r.length):"string"==e&&n in r)?Me(r[n],t):false}function te(t,n){if(vi(t))return false;var r=typeof t;return"number"==r||"symbol"==r||"boolean"==r||null==t||Ge(t)?true:ut.test(t)||!et.test(t)||null!=n&&t in Object(n)}function ne(t){var n=Ur(t),r=Ot[n];return typeof r=="function"&&n in Ut.prototype?t===r?true:(n=Io(r),
!!n&&t===n[0]):false}function re(t){var n=t&&t.constructor;return t===(typeof n=="function"&&n.prototype||Ou)}function ee(t,n){return function(r){return null==r?false:r[t]===n&&(n!==T||t in Object(r))}}function ue(t,n,r,e,u,o){return Pe(t)&&Pe(n)&&Bn(t,n,T,ue,o.set(n,t)),t}function oe(t,n){return 1==n.length?t:vn(t,Tn(n,0,-1))}function ie(t){if(typeof t=="string"||Ge(t))return t;var n=t+"";return"0"==n&&1/t==-q?"-0":n}function fe(t){if(null!=t){try{return Iu.call(t)}catch(n){}return t+""}return""}function ce(t){
if(t instanceof Ut)return t.clone();var n=new zt(t.__wrapped__,t.__chain__);return n.__actions__=lr(t.__actions__),n.__index__=t.__index__,n.__values__=t.__values__,n}function ae(t,n,r){var e=t?t.length:0;return e?(n=r||n===T?1:Qe(n),Tn(t,0>n?0:n,e)):[]}function le(t,n,r){var e=t?t.length:0;return e?(n=r||n===T?1:Qe(n),n=e-n,Tn(t,0,0>n?0:n)):[]}function se(t,n,r){var e=t?t.length:0;return e?(r=null==r?0:Qe(r),0>r&&(r=Qu(e+r,0)),g(t,Dr(n,3),r)):-1}function he(t,n,r){var e=t?t.length:0;if(!e)return-1;
var u=e-1;return r!==T&&(u=Qe(r),u=0>r?Qu(e+u,0):Xu(u,e-1)),g(t,Dr(n,3),u,true)}function pe(t){return t&&t.length?t[0]:T}function _e(t){var n=t?t.length:0;return n?t[n-1]:T}function ve(t,n){return t&&t.length&&n&&n.length?Dn(t,n):t}function ge(t){return t?eo.call(t):t}function de(t){if(!t||!t.length)return[];var n=0;return t=f(t,function(t){return Ue(t)?(n=Qu(t.length,n),true):void 0}),m(n,function(n){return l(t,Un(n))})}function ye(t,n){if(!t||!t.length)return[];var e=de(t);return null==n?e:l(e,function(t){
return r(n,T,t)})}function be(t){return t=Ot(t),t.__chain__=true,t}function xe(t,n){return n(t)}function je(){return this}function we(t,n){return(vi(t)?u:mo)(t,Dr(n,3))}function me(t,n){return(vi(t)?o:Ao)(t,Dr(n,3))}function Ae(t,n){return(vi(t)?l:In)(t,Dr(n,3))}function Oe(t,n,r){var e=-1,u=Ye(t),o=u.length,i=o-1;for(n=(r?Xr(t,n,r):n===T)?1:nn(Qe(n),0,o);++e<n;)t=Nn(e,i),r=u[t],u[t]=u[e],u[e]=r;return u.length=n,u}function ke(){return bu.now()}function Ee(t,n,r){return n=r?T:n,n=t&&null==n?t.length:n,
Mr(t,128,T,T,T,T,n)}function Se(t,n){var r;if(typeof n!="function")throw new mu("Expected a function");return t=Qe(t),function(){return 0<--t&&(r=n.apply(this,arguments)),1>=t&&(n=T),r}}function Ie(t,n,r){return n=r?T:n,t=Mr(t,8,T,T,T,T,T,n),t.placeholder=Ie.placeholder,t}function Re(t,n,r){return n=r?T:n,t=Mr(t,16,T,T,T,T,T,n),t.placeholder=Re.placeholder,t}function We(t,n,r){function e(n){var r=c,e=a;return c=a=T,_=n,s=t.apply(e,r)}function u(t){var r=t-p;return t-=_,p===T||r>=n||0>r||g&&t>=l}function o(){
var t=ke();if(u(t))return i(t);var r;r=t-_,t=n-(t-p),r=g?Xu(t,l-r):t,h=At(o,r)}function i(t){return h=T,d&&c?e(t):(c=a=T,s)}function f(){var t=ke(),r=u(t);if(c=arguments,a=this,p=t,r){if(h===T)return _=t=p,h=At(o,n),v?e(t):s;if(g)return h=At(o,n),e(p)}return h===T&&(h=At(o,n)),s}var c,a,l,s,h,p,_=0,v=false,g=false,d=true;if(typeof t!="function")throw new mu("Expected a function");return n=tu(n)||0,Pe(r)&&(v=!!r.leading,l=(g="maxWait"in r)?Qu(tu(r.maxWait)||0,n):l,d="trailing"in r?!!r.trailing:d),f.cancel=function(){
_=0,c=p=a=h=T},f.flush=function(){return h===T?s:i(ke())},f}function Be(t,n){function r(){var e=arguments,u=n?n.apply(this,e):e[0],o=r.cache;return o.has(u)?o.get(u):(e=t.apply(this,e),r.cache=o.set(u,e),e)}if(typeof t!="function"||n&&typeof n!="function")throw new mu("Expected a function");return r.cache=new(Be.Cache||Pt),r}function Le(t,n){if(typeof t!="function")throw new mu("Expected a function");return n=Qu(n===T?t.length-1:Qe(n),0),function(){for(var e=arguments,u=-1,o=Qu(e.length-n,0),i=Array(o);++u<o;)i[u]=e[n+u];
switch(n){case 0:return t.call(this,i);case 1:return t.call(this,e[0],i);case 2:return t.call(this,e[0],e[1],i)}for(o=Array(n+1),u=-1;++u<n;)o[u]=e[u];return o[n]=i,r(t,this,o)}}function Me(t,n){return t===n||t!==t&&n!==n}function Ce(t){return Ue(t)&&Ru.call(t,"callee")&&(!Tu.call(t,"callee")||"[object Arguments]"==Lu.call(t))}function ze(t){return null!=t&&Ne(Ro(t))&&!De(t)}function Ue(t){return Ze(t)&&ze(t)}function $e(t){return Ze(t)?"[object Error]"==Lu.call(t)||typeof t.message=="string"&&typeof t.name=="string":false;
}function De(t){return t=Pe(t)?Lu.call(t):"","[object Function]"==t||"[object GeneratorFunction]"==t}function Fe(t){return typeof t=="number"&&t==Qe(t)}function Ne(t){return typeof t=="number"&&t>-1&&0==t%1&&9007199254740991>=t}function Pe(t){var n=typeof t;return!!t&&("object"==n||"function"==n)}function Ze(t){return!!t&&typeof t=="object"}function Te(t){return typeof t=="number"||Ze(t)&&"[object Number]"==Lu.call(t)}function qe(t){return!Ze(t)||"[object Object]"!=Lu.call(t)||C(t)?false:(t=Gu(Object(t)),
null===t?true:(t=Ru.call(t,"constructor")&&t.constructor,typeof t=="function"&&t instanceof t&&Iu.call(t)==Bu))}function Ve(t){return Pe(t)&&"[object RegExp]"==Lu.call(t)}function Ke(t){return typeof t=="string"||!vi(t)&&Ze(t)&&"[object String]"==Lu.call(t)}function Ge(t){return typeof t=="symbol"||Ze(t)&&"[object Symbol]"==Lu.call(t)}function Je(t){return Ze(t)&&Ne(t.length)&&!!Mt[Lu.call(t)]}function Ye(t){if(!t)return[];if(ze(t))return Ke(t)?t.match(It):lr(t);if(Pu&&t[Pu])return z(t[Pu]());var n=Tr(t);
return("[object Map]"==n?U:"[object Set]"==n?D:fu)(t)}function He(t){return t?(t=tu(t),t===q||t===-q?1.7976931348623157e308*(0>t?-1:1):t===t?t:0):0===t?t:0}function Qe(t){t=He(t);var n=t%1;return t===t?n?t-n:t:0}function Xe(t){return t?nn(Qe(t),0,4294967295):0}function tu(t){if(typeof t=="number")return t;if(Ge(t))return V;if(Pe(t)&&(t=De(t.valueOf)?t.valueOf():t,t=Pe(t)?t+"":t),typeof t!="string")return 0===t?t:+t;t=t.replace(ct,"");var n=dt.test(t);return n||bt.test(t)?Nt(t.slice(2),n?2:8):gt.test(t)?V:+t;
}function nu(t){return sr(t,iu(t))}function ru(t){return null==t?"":Yn(t)}function eu(t,n,r){return t=null==t?T:vn(t,n),t===T?r:t}function uu(t,n){return null!=t&&qr(t,n,bn)}function ou(t){var n=re(t);if(!n&&!ze(t))return Hu(Object(t));var r,e=Jr(t),u=!!e,e=e||[],o=e.length;for(r in t)!yn(t,r)||u&&("length"==r||Qr(r,o))||n&&"constructor"==r||e.push(r);return e}function iu(t){for(var n=-1,r=re(t),e=En(t),u=e.length,o=Jr(t),i=!!o,o=o||[],f=o.length;++n<u;){var c=e[n];i&&("length"==c||Qr(c,f))||"constructor"==c&&(r||!Ru.call(t,c))||o.push(c);
}return o}function fu(t){return t?k(t,ou(t)):[]}function cu(t){return Pi(ru(t).toLowerCase())}function au(t){return(t=ru(t))&&t.replace(jt,W).replace(St,"")}function lu(t,n,r){return t=ru(t),n=r?T:n,n===T&&(n=Bt.test(t)?Rt:st),t.match(n)||[]}function su(t){return function(){return t}}function hu(t){return t}function pu(t){return kn(typeof t=="function"?t:rn(t,true))}function _u(t,n,r){var e=ou(n),o=_n(n,e);null!=r||Pe(n)&&(o.length||!e.length)||(r=n,n=t,t=this,o=_n(n,ou(n)));var i=!(Pe(r)&&"chain"in r&&!r.chain),f=De(t);
return u(o,function(r){var e=n[r];t[r]=e,f&&(t.prototype[r]=function(){var n=this.__chain__;if(i||n){var r=t(this.__wrapped__);return(r.__actions__=lr(this.__actions__)).push({func:e,args:arguments,thisArg:t}),r.__chain__=n,r}return e.apply(t,s([this.value()],arguments))})}),t}function vu(){}function gu(t){return te(t)?Un(ie(t)):$n(t)}function du(){return[]}function yu(){return false}R=R?Gt.defaults({},R,Gt.pick(Kt,Lt)):Kt;var bu=R.Date,xu=R.Error,ju=R.Math,wu=R.RegExp,mu=R.TypeError,Au=R.Array.prototype,Ou=R.Object.prototype,ku=R.String.prototype,Eu=R["__core-js_shared__"],Su=function(){
var t=/[^.]+$/.exec(Eu&&Eu.keys&&Eu.keys.IE_PROTO||"");return t?"Symbol(src)_1."+t:""}(),Iu=R.Function.prototype.toString,Ru=Ou.hasOwnProperty,Wu=0,Bu=Iu.call(Object),Lu=Ou.toString,Mu=Kt._,Cu=wu("^"+Iu.call(Ru).replace(it,"\\$&").replace(/hasOwnProperty|(function).*?(?=\\\()| for .+?(?=\\\])/g,"$1.*?")+"$"),zu=Tt?R.Buffer:T,Uu=R.Reflect,$u=R.Symbol,Du=R.Uint8Array,Fu=Uu?Uu.f:T,Nu=Object.getOwnPropertySymbols,Pu=typeof(Pu=$u&&$u.iterator)=="symbol"?Pu:T,Zu=Object.create,Tu=Ou.propertyIsEnumerable,qu=Au.splice,Vu=ju.ceil,Ku=ju.floor,Gu=Object.getPrototypeOf,Ju=R.isFinite,Yu=Au.join,Hu=Object.keys,Qu=ju.max,Xu=ju.min,to=R.parseInt,no=ju.random,ro=ku.replace,eo=Au.reverse,uo=ku.split,oo=Pr(R,"DataView"),io=Pr(R,"Map"),fo=Pr(R,"Promise"),co=Pr(R,"Set"),ao=Pr(R,"WeakMap"),lo=Pr(Object,"create"),so=ao&&new ao,ho=!Tu.call({
valueOf:1},"valueOf"),po={},_o=fe(oo),vo=fe(io),go=fe(fo),yo=fe(co),bo=fe(ao),xo=$u?$u.prototype:T,jo=xo?xo.valueOf:T,wo=xo?xo.toString:T;Ot.templateSettings={escape:tt,evaluate:nt,interpolate:rt,variable:"",imports:{_:Ot}},Ot.prototype=kt.prototype,Ot.prototype.constructor=Ot,zt.prototype=un(kt.prototype),zt.prototype.constructor=zt,Ut.prototype=un(kt.prototype),Ut.prototype.constructor=Ut,$t.prototype.clear=function(){this.__data__=lo?lo(null):{}},$t.prototype["delete"]=function(t){return this.has(t)&&delete this.__data__[t];
},$t.prototype.get=function(t){var n=this.__data__;return lo?(t=n[t],"__lodash_hash_undefined__"===t?T:t):Ru.call(n,t)?n[t]:T},$t.prototype.has=function(t){var n=this.__data__;return lo?n[t]!==T:Ru.call(n,t)},$t.prototype.set=function(t,n){return this.__data__[t]=lo&&n===T?"__lodash_hash_undefined__":n,this},Dt.prototype.clear=function(){this.__data__=[]},Dt.prototype["delete"]=function(t){var n=this.__data__;return t=Ht(n,t),0>t?false:(t==n.length-1?n.pop():qu.call(n,t,1),true)},Dt.prototype.get=function(t){
var n=this.__data__;return t=Ht(n,t),0>t?T:n[t][1]},Dt.prototype.has=function(t){return-1<Ht(this.__data__,t)},Dt.prototype.set=function(t,n){var r=this.__data__,e=Ht(r,t);return 0>e?r.push([t,n]):r[e][1]=n,this},Pt.prototype.clear=function(){this.__data__={hash:new $t,map:new(io||Dt),string:new $t}},Pt.prototype["delete"]=function(t){return Fr(this,t)["delete"](t)},Pt.prototype.get=function(t){return Fr(this,t).get(t)},Pt.prototype.has=function(t){return Fr(this,t).has(t)},Pt.prototype.set=function(t,n){
return Fr(this,t).set(t,n),this},Zt.prototype.add=Zt.prototype.push=function(t){return this.__data__.set(t,"__lodash_hash_undefined__"),this},Zt.prototype.has=function(t){return this.__data__.has(t)},qt.prototype.clear=function(){this.__data__=new Dt},qt.prototype["delete"]=function(t){return this.__data__["delete"](t)},qt.prototype.get=function(t){return this.__data__.get(t)},qt.prototype.has=function(t){return this.__data__.has(t)},qt.prototype.set=function(t,n){var r=this.__data__;return r instanceof Dt&&200==r.__data__.length&&(r=this.__data__=new Pt(r.__data__)),
r.set(t,n),this};var mo=vr(hn),Ao=vr(pn,true),Oo=gr(),ko=gr(true);Fu&&!Tu.call({valueOf:1},"valueOf")&&(En=function(t){return z(Fu(t))});var Eo=so?function(t,n){return so.set(t,n),t}:hu,So=co&&1/D(new co([,-0]))[1]==q?function(t){return new co(t)}:vu,Io=so?function(t){return so.get(t)}:vu,Ro=Un("length");Nu||(Zr=du);var Wo=Nu?function(t){for(var n=[];t;)s(n,Zr(t)),t=Gu(Object(t));return n}:Zr;(oo&&"[object DataView]"!=Tr(new oo(new ArrayBuffer(1)))||io&&"[object Map]"!=Tr(new io)||fo&&"[object Promise]"!=Tr(fo.resolve())||co&&"[object Set]"!=Tr(new co)||ao&&"[object WeakMap]"!=Tr(new ao))&&(Tr=function(t){
var n=Lu.call(t);if(t=(t="[object Object]"==n?t.constructor:T)?fe(t):T)switch(t){case _o:return"[object DataView]";case vo:return"[object Map]";case go:return"[object Promise]";case yo:return"[object Set]";case bo:return"[object WeakMap]"}return n});var Bo=Eu?De:yu,Lo=function(){var t=0,n=0;return function(r,e){var u=ke(),o=16-(u-n);if(n=u,o>0){if(150<=++t)return r}else t=0;return Eo(r,e)}}(),Mo=Be(function(t){var n=[];return ru(t).replace(ot,function(t,r,e,u){n.push(e?u.replace(ht,"$1"):r||t)}),
n}),Co=Le(function(t,n){return Ue(t)?fn(t,sn(n,1,Ue,true)):[]}),zo=Le(function(t,n){var r=_e(n);return Ue(r)&&(r=T),Ue(t)?fn(t,sn(n,1,Ue,true),Dr(r)):[]}),Uo=Le(function(t,n){var r=_e(n);return Ue(r)&&(r=T),Ue(t)?fn(t,sn(n,1,Ue,true),T,r):[]}),$o=Le(function(t){var n=l(t,rr);return n.length&&n[0]===t[0]?xn(n):[]}),Do=Le(function(t){var n=_e(t),r=l(t,rr);return n===_e(r)?n=T:r.pop(),r.length&&r[0]===t[0]?xn(r,Dr(n)):[]}),Fo=Le(function(t){var n=_e(t),r=l(t,rr);return n===_e(r)?n=T:r.pop(),r.length&&r[0]===t[0]?xn(r,T,n):[];
}),No=Le(ve),Po=Le(function(t,n){n=sn(n,1);var r=t?t.length:0,e=tn(t,n);return Fn(t,l(n,function(t){return Qr(t,r)?+t:t}).sort(fr)),e}),Zo=Le(function(t){return Hn(sn(t,1,Ue,true))}),To=Le(function(t){var n=_e(t);return Ue(n)&&(n=T),Hn(sn(t,1,Ue,true),Dr(n))}),qo=Le(function(t){var n=_e(t);return Ue(n)&&(n=T),Hn(sn(t,1,Ue,true),T,n)}),Vo=Le(function(t,n){return Ue(t)?fn(t,n):[]}),Ko=Le(function(t){return tr(f(t,Ue))}),Go=Le(function(t){var n=_e(t);return Ue(n)&&(n=T),tr(f(t,Ue),Dr(n))}),Jo=Le(function(t){
var n=_e(t);return Ue(n)&&(n=T),tr(f(t,Ue),T,n)}),Yo=Le(de),Ho=Le(function(t){var n=t.length,n=n>1?t[n-1]:T,n=typeof n=="function"?(t.pop(),n):T;return ye(t,n)}),Qo=Le(function(t){function n(n){return tn(n,t)}t=sn(t,1);var r=t.length,e=r?t[0]:0,u=this.__wrapped__;return!(r>1||this.__actions__.length)&&u instanceof Ut&&Qr(e)?(u=u.slice(e,+e+(r?1:0)),u.__actions__.push({func:xe,args:[n],thisArg:T}),new zt(u,this.__chain__).thru(function(t){return r&&!t.length&&t.push(T),t})):this.thru(n)}),Xo=pr(function(t,n,r){
Ru.call(t,r)?++t[r]:t[r]=1}),ti=pr(function(t,n,r){Ru.call(t,r)?t[r].push(n):t[r]=[n]}),ni=Le(function(t,n,e){var u=-1,o=typeof n=="function",i=te(n),f=ze(t)?Array(t.length):[];return mo(t,function(t){var c=o?n:i&&null!=t?t[n]:T;f[++u]=c?r(c,t,e):wn(t,n,e)}),f}),ri=pr(function(t,n,r){t[r]=n}),ei=pr(function(t,n,r){t[r?0:1].push(n)},function(){return[[],[]]}),ui=Le(function(t,n){if(null==t)return[];var r=n.length;return r>1&&Xr(t,n[0],n[1])?n=[]:r>2&&Xr(n[0],n[1],n[2])&&(n=[n[0]]),n=1==n.length&&vi(n[0])?n[0]:sn(n,1,Hr),
Mn(t,n,[])}),oi=Le(function(t,n,r){var e=1;if(r.length)var u=$(r,$r(oi)),e=32|e;return Mr(t,e,n,r,u)}),ii=Le(function(t,n,r){var e=3;if(r.length)var u=$(r,$r(ii)),e=32|e;return Mr(n,e,t,r,u)}),fi=Le(function(t,n){return on(t,1,n)}),ci=Le(function(t,n,r){return on(t,tu(n)||0,r)});Be.Cache=Pt;var ai=Le(function(t,n){n=1==n.length&&vi(n[0])?l(n[0],O(Dr())):l(sn(n,1,Hr),O(Dr()));var e=n.length;return Le(function(u){for(var o=-1,i=Xu(u.length,e);++o<i;)u[o]=n[o].call(this,u[o]);return r(t,this,u)})}),li=Le(function(t,n){
var r=$(n,$r(li));return Mr(t,32,T,n,r)}),si=Le(function(t,n){var r=$(n,$r(si));return Mr(t,64,T,n,r)}),hi=Le(function(t,n){return Mr(t,256,T,T,T,sn(n,1))}),pi=Rr(dn),_i=Rr(function(t,n){return t>=n}),vi=Array.isArray,gi=zu?function(t){return t instanceof zu}:yu,di=Rr(Sn),yi=Rr(function(t,n){return n>=t}),bi=_r(function(t,n){if(ho||re(n)||ze(n))sr(n,ou(n),t);else for(var r in n)Ru.call(n,r)&&Yt(t,r,n[r])}),xi=_r(function(t,n){if(ho||re(n)||ze(n))sr(n,iu(n),t);else for(var r in n)Yt(t,r,n[r])}),ji=_r(function(t,n,r,e){
sr(n,iu(n),t,e)}),wi=_r(function(t,n,r,e){sr(n,ou(n),t,e)}),mi=Le(function(t,n){return tn(t,sn(n,1))}),Ai=Le(function(t){return t.push(T,Vt),r(ji,T,t)}),Oi=Le(function(t){return t.push(T,ue),r(Ri,T,t)}),ki=Ar(function(t,n,r){t[n]=r},su(hu)),Ei=Ar(function(t,n,r){Ru.call(t,n)?t[n].push(r):t[n]=[r]},Dr),Si=Le(wn),Ii=_r(function(t,n,r){Bn(t,n,r)}),Ri=_r(function(t,n,r,e){Bn(t,n,r,e)}),Wi=Le(function(t,n){return null==t?{}:(n=l(sn(n,1),ie),Cn(t,fn(gn(t,iu,Wo),n)))}),Bi=Le(function(t,n){return null==t?{}:Cn(t,l(sn(n,1),ie));
}),Li=Lr(ou),Mi=Lr(iu),Ci=br(function(t,n,r){return n=n.toLowerCase(),t+(r?cu(n):n)}),zi=br(function(t,n,r){return t+(r?"-":"")+n.toLowerCase()}),Ui=br(function(t,n,r){return t+(r?" ":"")+n.toLowerCase()}),$i=yr("toLowerCase"),Di=br(function(t,n,r){return t+(r?"_":"")+n.toLowerCase()}),Fi=br(function(t,n,r){return t+(r?" ":"")+Pi(n)}),Ni=br(function(t,n,r){return t+(r?" ":"")+n.toUpperCase()}),Pi=yr("toUpperCase"),Zi=Le(function(t,n){try{return r(t,T,n)}catch(e){return $e(e)?e:new xu(e)}}),Ti=Le(function(t,n){
return u(sn(n,1),function(n){n=ie(n),t[n]=oi(t[n],t)}),t}),qi=wr(),Vi=wr(true),Ki=Le(function(t,n){return function(r){return wn(r,t,n)}}),Gi=Le(function(t,n){return function(r){return wn(t,r,n)}}),Ji=kr(l),Yi=kr(i),Hi=kr(_),Qi=Ir(),Xi=Ir(true),tf=Or(function(t,n){return t+n}),nf=Br("ceil"),rf=Or(function(t,n){return t/n}),ef=Br("floor"),uf=Or(function(t,n){return t*n}),of=Br("round"),ff=Or(function(t,n){return t-n});return Ot.after=function(t,n){if(typeof n!="function")throw new mu("Expected a function");
return t=Qe(t),function(){return 1>--t?n.apply(this,arguments):void 0}},Ot.ary=Ee,Ot.assign=bi,Ot.assignIn=xi,Ot.assignInWith=ji,Ot.assignWith=wi,Ot.at=mi,Ot.before=Se,Ot.bind=oi,Ot.bindAll=Ti,Ot.bindKey=ii,Ot.castArray=function(){if(!arguments.length)return[];var t=arguments[0];return vi(t)?t:[t]},Ot.chain=be,Ot.chunk=function(t,n,r){if(n=(r?Xr(t,n,r):n===T)?1:Qu(Qe(n),0),r=t?t.length:0,!r||1>n)return[];for(var e=0,u=0,o=Array(Vu(r/n));r>e;)o[u++]=Tn(t,e,e+=n);return o},Ot.compact=function(t){for(var n=-1,r=t?t.length:0,e=0,u=[];++n<r;){
var o=t[n];o&&(u[e++]=o)}return u},Ot.concat=function(){for(var t=arguments.length,n=Array(t?t-1:0),r=arguments[0],e=t;e--;)n[e-1]=arguments[e];return t?s(vi(r)?lr(r):[r],sn(n,1)):[]},Ot.cond=function(t){var n=t?t.length:0,e=Dr();return t=n?l(t,function(t){if("function"!=typeof t[1])throw new mu("Expected a function");return[e(t[0]),t[1]]}):[],Le(function(e){for(var u=-1;++u<n;){var o=t[u];if(r(o[0],this,e))return r(o[1],this,e)}})},Ot.conforms=function(t){return en(rn(t,true))},Ot.constant=su,Ot.countBy=Xo,
Ot.create=function(t,n){var r=un(t);return n?Xt(r,n):r},Ot.curry=Ie,Ot.curryRight=Re,Ot.debounce=We,Ot.defaults=Ai,Ot.defaultsDeep=Oi,Ot.defer=fi,Ot.delay=ci,Ot.difference=Co,Ot.differenceBy=zo,Ot.differenceWith=Uo,Ot.drop=ae,Ot.dropRight=le,Ot.dropRightWhile=function(t,n){return t&&t.length?Qn(t,Dr(n,3),true,true):[]},Ot.dropWhile=function(t,n){return t&&t.length?Qn(t,Dr(n,3),true):[]},Ot.fill=function(t,n,r,e){var u=t?t.length:0;if(!u)return[];for(r&&typeof r!="number"&&Xr(t,n,r)&&(r=0,e=u),u=t.length,
r=Qe(r),0>r&&(r=-r>u?0:u+r),e=e===T||e>u?u:Qe(e),0>e&&(e+=u),e=r>e?0:Xe(e);e>r;)t[r++]=n;return t},Ot.filter=function(t,n){return(vi(t)?f:ln)(t,Dr(n,3))},Ot.flatMap=function(t,n){return sn(Ae(t,n),1)},Ot.flatMapDeep=function(t,n){return sn(Ae(t,n),q)},Ot.flatMapDepth=function(t,n,r){return r=r===T?1:Qe(r),sn(Ae(t,n),r)},Ot.flatten=function(t){return t&&t.length?sn(t,1):[]},Ot.flattenDeep=function(t){return t&&t.length?sn(t,q):[]},Ot.flattenDepth=function(t,n){return t&&t.length?(n=n===T?1:Qe(n),sn(t,n)):[];
},Ot.flip=function(t){return Mr(t,512)},Ot.flow=qi,Ot.flowRight=Vi,Ot.fromPairs=function(t){for(var n=-1,r=t?t.length:0,e={};++n<r;){var u=t[n];e[u[0]]=u[1]}return e},Ot.functions=function(t){return null==t?[]:_n(t,ou(t))},Ot.functionsIn=function(t){return null==t?[]:_n(t,iu(t))},Ot.groupBy=ti,Ot.initial=function(t){return le(t,1)},Ot.intersection=$o,Ot.intersectionBy=Do,Ot.intersectionWith=Fo,Ot.invert=ki,Ot.invertBy=Ei,Ot.invokeMap=ni,Ot.iteratee=pu,Ot.keyBy=ri,Ot.keys=ou,Ot.keysIn=iu,Ot.map=Ae,
Ot.mapKeys=function(t,n){var r={};return n=Dr(n,3),hn(t,function(t,e,u){r[n(t,e,u)]=t}),r},Ot.mapValues=function(t,n){var r={};return n=Dr(n,3),hn(t,function(t,e,u){r[e]=n(t,e,u)}),r},Ot.matches=function(t){return Rn(rn(t,true))},Ot.matchesProperty=function(t,n){return Wn(t,rn(n,true))},Ot.memoize=Be,Ot.merge=Ii,Ot.mergeWith=Ri,Ot.method=Ki,Ot.methodOf=Gi,Ot.mixin=_u,Ot.negate=function(t){if(typeof t!="function")throw new mu("Expected a function");return function(){return!t.apply(this,arguments)}},Ot.nthArg=function(t){
return t=Qe(t),Le(function(n){return Ln(n,t)})},Ot.omit=Wi,Ot.omitBy=function(t,n){return n=Dr(n),zn(t,function(t,r){return!n(t,r)})},Ot.once=function(t){return Se(2,t)},Ot.orderBy=function(t,n,r,e){return null==t?[]:(vi(n)||(n=null==n?[]:[n]),r=e?T:r,vi(r)||(r=null==r?[]:[r]),Mn(t,n,r))},Ot.over=Ji,Ot.overArgs=ai,Ot.overEvery=Yi,Ot.overSome=Hi,Ot.partial=li,Ot.partialRight=si,Ot.partition=ei,Ot.pick=Bi,Ot.pickBy=function(t,n){return null==t?{}:zn(t,Dr(n))},Ot.property=gu,Ot.propertyOf=function(t){
return function(n){return null==t?T:vn(t,n)}},Ot.pull=No,Ot.pullAll=ve,Ot.pullAllBy=function(t,n,r){return t&&t.length&&n&&n.length?Dn(t,n,Dr(r)):t},Ot.pullAllWith=function(t,n,r){return t&&t.length&&n&&n.length?Dn(t,n,T,r):t},Ot.pullAt=Po,Ot.range=Qi,Ot.rangeRight=Xi,Ot.rearg=hi,Ot.reject=function(t,n){var r=vi(t)?f:ln;return n=Dr(n,3),r(t,function(t,r,e){return!n(t,r,e)})},Ot.remove=function(t,n){var r=[];if(!t||!t.length)return r;var e=-1,u=[],o=t.length;for(n=Dr(n,3);++e<o;){var i=t[e];n(i,e,t)&&(r.push(i),
u.push(e))}return Fn(t,u),r},Ot.rest=Le,Ot.reverse=ge,Ot.sampleSize=Oe,Ot.set=function(t,n,r){return null==t?t:Zn(t,n,r)},Ot.setWith=function(t,n,r,e){return e=typeof e=="function"?e:T,null==t?t:Zn(t,n,r,e)},Ot.shuffle=function(t){return Oe(t,4294967295)},Ot.slice=function(t,n,r){var e=t?t.length:0;return e?(r&&typeof r!="number"&&Xr(t,n,r)?(n=0,r=e):(n=null==n?0:Qe(n),r=r===T?e:Qe(r)),Tn(t,n,r)):[]},Ot.sortBy=ui,Ot.sortedUniq=function(t){return t&&t.length?Gn(t):[]},Ot.sortedUniqBy=function(t,n){
return t&&t.length?Gn(t,Dr(n)):[]},Ot.split=function(t,n,r){return r&&typeof r!="number"&&Xr(t,n,r)&&(n=r=T),r=r===T?4294967295:r>>>0,r?(t=ru(t))&&(typeof n=="string"||null!=n&&!Ve(n))&&(n=Yn(n),""==n&&Wt.test(t))?ur(t.match(It),0,r):uo.call(t,n,r):[]},Ot.spread=function(t,n){if(typeof t!="function")throw new mu("Expected a function");return n=n===T?0:Qu(Qe(n),0),Le(function(e){var u=e[n];return e=ur(e,0,n),u&&s(e,u),r(t,this,e)})},Ot.tail=function(t){return ae(t,1)},Ot.take=function(t,n,r){return t&&t.length?(n=r||n===T?1:Qe(n),
Tn(t,0,0>n?0:n)):[]},Ot.takeRight=function(t,n,r){var e=t?t.length:0;return e?(n=r||n===T?1:Qe(n),n=e-n,Tn(t,0>n?0:n,e)):[]},Ot.takeRightWhile=function(t,n){return t&&t.length?Qn(t,Dr(n,3),false,true):[]},Ot.takeWhile=function(t,n){return t&&t.length?Qn(t,Dr(n,3)):[]},Ot.tap=function(t,n){return n(t),t},Ot.throttle=function(t,n,r){var e=true,u=true;if(typeof t!="function")throw new mu("Expected a function");return Pe(r)&&(e="leading"in r?!!r.leading:e,u="trailing"in r?!!r.trailing:u),We(t,n,{leading:e,maxWait:n,
trailing:u})},Ot.thru=xe,Ot.toArray=Ye,Ot.toPairs=Li,Ot.toPairsIn=Mi,Ot.toPath=function(t){return vi(t)?l(t,ie):Ge(t)?[t]:lr(Mo(t))},Ot.toPlainObject=nu,Ot.transform=function(t,n,r){var e=vi(t)||Je(t);if(n=Dr(n,4),null==r)if(e||Pe(t)){var o=t.constructor;r=e?vi(t)?new o:[]:De(o)?un(Gu(Object(t))):{}}else r={};return(e?u:hn)(t,function(t,e,u){return n(r,t,e,u)}),r},Ot.unary=function(t){return Ee(t,1)},Ot.union=Zo,Ot.unionBy=To,Ot.unionWith=qo,Ot.uniq=function(t){return t&&t.length?Hn(t):[]},Ot.uniqBy=function(t,n){
return t&&t.length?Hn(t,Dr(n)):[]},Ot.uniqWith=function(t,n){return t&&t.length?Hn(t,T,n):[]},Ot.unset=function(t,n){var r;if(null==t)r=true;else{r=t;var e=n,e=te(e,r)?[e]:er(e);r=oe(r,e),e=ie(_e(e)),r=!(null!=r&&yn(r,e))||delete r[e]}return r},Ot.unzip=de,Ot.unzipWith=ye,Ot.update=function(t,n,r){return null==t?t:Zn(t,n,(typeof r=="function"?r:hu)(vn(t,n)),void 0)},Ot.updateWith=function(t,n,r,e){return e=typeof e=="function"?e:T,null!=t&&(t=Zn(t,n,(typeof r=="function"?r:hu)(vn(t,n)),e)),t},Ot.values=fu,
Ot.valuesIn=function(t){return null==t?[]:k(t,iu(t))},Ot.without=Vo,Ot.words=lu,Ot.wrap=function(t,n){return n=null==n?hu:n,li(n,t)},Ot.xor=Ko,Ot.xorBy=Go,Ot.xorWith=Jo,Ot.zip=Yo,Ot.zipObject=function(t,n){return nr(t||[],n||[],Yt)},Ot.zipObjectDeep=function(t,n){return nr(t||[],n||[],Zn)},Ot.zipWith=Ho,Ot.entries=Li,Ot.entriesIn=Mi,Ot.extend=xi,Ot.extendWith=ji,_u(Ot,Ot),Ot.add=tf,Ot.attempt=Zi,Ot.camelCase=Ci,Ot.capitalize=cu,Ot.ceil=nf,Ot.clamp=function(t,n,r){return r===T&&(r=n,n=T),r!==T&&(r=tu(r),
r=r===r?r:0),n!==T&&(n=tu(n),n=n===n?n:0),nn(tu(t),n,r)},Ot.clone=function(t){return rn(t,false,true)},Ot.cloneDeep=function(t){return rn(t,true,true)},Ot.cloneDeepWith=function(t,n){return rn(t,true,true,n)},Ot.cloneWith=function(t,n){return rn(t,false,true,n)},Ot.deburr=au,Ot.divide=rf,Ot.endsWith=function(t,n,r){t=ru(t),n=Yn(n);var e=t.length;return r=r===T?e:nn(Qe(r),0,e),r-=n.length,r>=0&&t.indexOf(n,r)==r},Ot.eq=Me,Ot.escape=function(t){return(t=ru(t))&&X.test(t)?t.replace(H,B):t},Ot.escapeRegExp=function(t){
return(t=ru(t))&&ft.test(t)?t.replace(it,"\\$&"):t},Ot.every=function(t,n,r){var e=vi(t)?i:cn;return r&&Xr(t,n,r)&&(n=T),e(t,Dr(n,3))},Ot.find=function(t,n,r){return t=ze(t)?t:fu(t),n=se(t,n,r),n>-1?t[n]:T},Ot.findIndex=se,Ot.findKey=function(t,n){return v(t,Dr(n,3),hn)},Ot.findLast=function(t,n,r){return t=ze(t)?t:fu(t),n=he(t,n,r),n>-1?t[n]:T},Ot.findLastIndex=he,Ot.findLastKey=function(t,n){return v(t,Dr(n,3),pn)},Ot.floor=ef,Ot.forEach=we,Ot.forEachRight=me,Ot.forIn=function(t,n){return null==t?t:Oo(t,Dr(n,3),iu);
},Ot.forInRight=function(t,n){return null==t?t:ko(t,Dr(n,3),iu)},Ot.forOwn=function(t,n){return t&&hn(t,Dr(n,3))},Ot.forOwnRight=function(t,n){return t&&pn(t,Dr(n,3))},Ot.get=eu,Ot.gt=pi,Ot.gte=_i,Ot.has=function(t,n){return null!=t&&qr(t,n,yn)},Ot.hasIn=uu,Ot.head=pe,Ot.identity=hu,Ot.includes=function(t,n,r,e){return t=ze(t)?t:fu(t),r=r&&!e?Qe(r):0,e=t.length,0>r&&(r=Qu(e+r,0)),Ke(t)?e>=r&&-1<t.indexOf(n,r):!!e&&-1<d(t,n,r)},Ot.indexOf=function(t,n,r){var e=t?t.length:0;return e?(r=null==r?0:Qe(r),
0>r&&(r=Qu(e+r,0)),d(t,n,r)):-1},Ot.inRange=function(t,n,r){return n=tu(n)||0,r===T?(r=n,n=0):r=tu(r)||0,t=tu(t),t>=Xu(n,r)&&t<Qu(n,r)},Ot.invoke=Si,Ot.isArguments=Ce,Ot.isArray=vi,Ot.isArrayBuffer=function(t){return Ze(t)&&"[object ArrayBuffer]"==Lu.call(t)},Ot.isArrayLike=ze,Ot.isArrayLikeObject=Ue,Ot.isBoolean=function(t){return true===t||false===t||Ze(t)&&"[object Boolean]"==Lu.call(t)},Ot.isBuffer=gi,Ot.isDate=function(t){return Ze(t)&&"[object Date]"==Lu.call(t)},Ot.isElement=function(t){return!!t&&1===t.nodeType&&Ze(t)&&!qe(t);
},Ot.isEmpty=function(t){if(ze(t)&&(vi(t)||Ke(t)||De(t.splice)||Ce(t)||gi(t)))return!t.length;if(Ze(t)){var n=Tr(t);if("[object Map]"==n||"[object Set]"==n)return!t.size}for(var r in t)if(Ru.call(t,r))return false;return!(ho&&ou(t).length)},Ot.isEqual=function(t,n){return mn(t,n)},Ot.isEqualWith=function(t,n,r){var e=(r=typeof r=="function"?r:T)?r(t,n):T;return e===T?mn(t,n,r):!!e},Ot.isError=$e,Ot.isFinite=function(t){return typeof t=="number"&&Ju(t)},Ot.isFunction=De,Ot.isInteger=Fe,Ot.isLength=Ne,Ot.isMap=function(t){
return Ze(t)&&"[object Map]"==Tr(t)},Ot.isMatch=function(t,n){return t===n||An(t,n,Nr(n))},Ot.isMatchWith=function(t,n,r){return r=typeof r=="function"?r:T,An(t,n,Nr(n),r)},Ot.isNaN=function(t){return Te(t)&&t!=+t},Ot.isNative=function(t){if(Bo(t))throw new xu("This method is not supported with `core-js`. Try https://github.com/es-shims.");return On(t)},Ot.isNil=function(t){return null==t},Ot.isNull=function(t){return null===t},Ot.isNumber=Te,Ot.isObject=Pe,Ot.isObjectLike=Ze,Ot.isPlainObject=qe,
Ot.isRegExp=Ve,Ot.isSafeInteger=function(t){return Fe(t)&&t>=-9007199254740991&&9007199254740991>=t},Ot.isSet=function(t){return Ze(t)&&"[object Set]"==Tr(t)},Ot.isString=Ke,Ot.isSymbol=Ge,Ot.isTypedArray=Je,Ot.isUndefined=function(t){return t===T},Ot.isWeakMap=function(t){return Ze(t)&&"[object WeakMap]"==Tr(t)},Ot.isWeakSet=function(t){return Ze(t)&&"[object WeakSet]"==Lu.call(t)},Ot.join=function(t,n){return t?Yu.call(t,n):""},Ot.kebabCase=zi,Ot.last=_e,Ot.lastIndexOf=function(t,n,r){var e=t?t.length:0;
if(!e)return-1;var u=e;if(r!==T&&(u=Qe(r),u=(0>u?Qu(e+u,0):Xu(u,e-1))+1),n!==n)return M(t,u-1,true);for(;u--;)if(t[u]===n)return u;return-1},Ot.lowerCase=Ui,Ot.lowerFirst=$i,Ot.lt=di,Ot.lte=yi,Ot.max=function(t){return t&&t.length?an(t,hu,dn):T},Ot.maxBy=function(t,n){return t&&t.length?an(t,Dr(n),dn):T},Ot.mean=function(t){return b(t,hu)},Ot.meanBy=function(t,n){return b(t,Dr(n))},Ot.min=function(t){return t&&t.length?an(t,hu,Sn):T},Ot.minBy=function(t,n){return t&&t.length?an(t,Dr(n),Sn):T},Ot.stubArray=du,
Ot.stubFalse=yu,Ot.stubObject=function(){return{}},Ot.stubString=function(){return""},Ot.stubTrue=function(){return true},Ot.multiply=uf,Ot.nth=function(t,n){return t&&t.length?Ln(t,Qe(n)):T},Ot.noConflict=function(){return Kt._===this&&(Kt._=Mu),this},Ot.noop=vu,Ot.now=ke,Ot.pad=function(t,n,r){t=ru(t);var e=(n=Qe(n))?N(t):0;return!n||e>=n?t:(n=(n-e)/2,Er(Ku(n),r)+t+Er(Vu(n),r))},Ot.padEnd=function(t,n,r){t=ru(t);var e=(n=Qe(n))?N(t):0;return n&&n>e?t+Er(n-e,r):t},Ot.padStart=function(t,n,r){t=ru(t);
var e=(n=Qe(n))?N(t):0;return n&&n>e?Er(n-e,r)+t:t},Ot.parseInt=function(t,n,r){return r||null==n?n=0:n&&(n=+n),t=ru(t).replace(ct,""),to(t,n||(vt.test(t)?16:10))},Ot.random=function(t,n,r){if(r&&typeof r!="boolean"&&Xr(t,n,r)&&(n=r=T),r===T&&(typeof n=="boolean"?(r=n,n=T):typeof t=="boolean"&&(r=t,t=T)),t===T&&n===T?(t=0,n=1):(t=tu(t)||0,n===T?(n=t,t=0):n=tu(n)||0),t>n){var e=t;t=n,n=e}return r||t%1||n%1?(r=no(),Xu(t+r*(n-t+Ft("1e-"+((r+"").length-1))),n)):Nn(t,n)},Ot.reduce=function(t,n,r){var e=vi(t)?h:x,u=3>arguments.length;
return e(t,Dr(n,4),r,u,mo)},Ot.reduceRight=function(t,n,r){var e=vi(t)?p:x,u=3>arguments.length;return e(t,Dr(n,4),r,u,Ao)},Ot.repeat=function(t,n,r){return n=(r?Xr(t,n,r):n===T)?1:Qe(n),Pn(ru(t),n)},Ot.replace=function(){var t=arguments,n=ru(t[0]);return 3>t.length?n:ro.call(n,t[1],t[2])},Ot.result=function(t,n,r){n=te(n,t)?[n]:er(n);var e=-1,u=n.length;for(u||(t=T,u=1);++e<u;){var o=null==t?T:t[ie(n[e])];o===T&&(e=u,o=r),t=De(o)?o.call(t):o}return t},Ot.round=of,Ot.runInContext=Z,Ot.sample=function(t){
t=ze(t)?t:fu(t);var n=t.length;return n>0?t[Nn(0,n-1)]:T},Ot.size=function(t){if(null==t)return 0;if(ze(t)){var n=t.length;return n&&Ke(t)?N(t):n}return Ze(t)&&(n=Tr(t),"[object Map]"==n||"[object Set]"==n)?t.size:ou(t).length},Ot.snakeCase=Di,Ot.some=function(t,n,r){var e=vi(t)?_:qn;return r&&Xr(t,n,r)&&(n=T),e(t,Dr(n,3))},Ot.sortedIndex=function(t,n){return Vn(t,n)},Ot.sortedIndexBy=function(t,n,r){return Kn(t,n,Dr(r))},Ot.sortedIndexOf=function(t,n){var r=t?t.length:0;if(r){var e=Vn(t,n);if(r>e&&Me(t[e],n))return e;
}return-1},Ot.sortedLastIndex=function(t,n){return Vn(t,n,true)},Ot.sortedLastIndexBy=function(t,n,r){return Kn(t,n,Dr(r),true)},Ot.sortedLastIndexOf=function(t,n){if(t&&t.length){var r=Vn(t,n,true)-1;if(Me(t[r],n))return r}return-1},Ot.startCase=Fi,Ot.startsWith=function(t,n,r){return t=ru(t),r=nn(Qe(r),0,t.length),t.lastIndexOf(Yn(n),r)==r},Ot.subtract=ff,Ot.sum=function(t){return t&&t.length?w(t,hu):0},Ot.sumBy=function(t,n){return t&&t.length?w(t,Dr(n)):0},Ot.template=function(t,n,r){var e=Ot.templateSettings;
r&&Xr(t,n,r)&&(n=T),t=ru(t),n=ji({},n,e,Vt),r=ji({},n.imports,e.imports,Vt);var u,o,i=ou(r),f=k(r,i),c=0;r=n.interpolate||wt;var a="__p+='";r=wu((n.escape||wt).source+"|"+r.source+"|"+(r===rt?pt:wt).source+"|"+(n.evaluate||wt).source+"|$","g");var l="sourceURL"in n?"//# sourceURL="+n.sourceURL+"\n":"";if(t.replace(r,function(n,r,e,i,f,l){return e||(e=i),a+=t.slice(c,l).replace(mt,L),r&&(u=true,a+="'+__e("+r+")+'"),f&&(o=true,a+="';"+f+";\n__p+='"),e&&(a+="'+((__t=("+e+"))==null?'':__t)+'"),c=l+n.length,
n}),a+="';",(n=n.variable)||(a="with(obj){"+a+"}"),a=(o?a.replace(K,""):a).replace(G,"$1").replace(J,"$1;"),a="function("+(n||"obj")+"){"+(n?"":"obj||(obj={});")+"var __t,__p=''"+(u?",__e=_.escape":"")+(o?",__j=Array.prototype.join;function print(){__p+=__j.call(arguments,'')}":";")+a+"return __p}",n=Zi(function(){return Function(i,l+"return "+a).apply(T,f)}),n.source=a,$e(n))throw n;return n},Ot.times=function(t,n){if(t=Qe(t),1>t||t>9007199254740991)return[];var r=4294967295,e=Xu(t,4294967295);for(n=Dr(n),
t-=4294967295,e=m(e,n);++r<t;)n(r);return e},Ot.toFinite=He,Ot.toInteger=Qe,Ot.toLength=Xe,Ot.toLower=function(t){return ru(t).toLowerCase()},Ot.toNumber=tu,Ot.toSafeInteger=function(t){return nn(Qe(t),-9007199254740991,9007199254740991)},Ot.toString=ru,Ot.toUpper=function(t){return ru(t).toUpperCase()},Ot.trim=function(t,n,r){return(t=ru(t))&&(r||n===T)?t.replace(ct,""):t&&(n=Yn(n))?(t=t.match(It),n=n.match(It),ur(t,S(t,n),I(t,n)+1).join("")):t},Ot.trimEnd=function(t,n,r){return(t=ru(t))&&(r||n===T)?t.replace(lt,""):t&&(n=Yn(n))?(t=t.match(It),
n=I(t,n.match(It))+1,ur(t,0,n).join("")):t},Ot.trimStart=function(t,n,r){return(t=ru(t))&&(r||n===T)?t.replace(at,""):t&&(n=Yn(n))?(t=t.match(It),n=S(t,n.match(It)),ur(t,n).join("")):t},Ot.truncate=function(t,n){var r=30,e="...";if(Pe(n))var u="separator"in n?n.separator:u,r="length"in n?Qe(n.length):r,e="omission"in n?Yn(n.omission):e;t=ru(t);var o=t.length;if(Wt.test(t))var i=t.match(It),o=i.length;if(r>=o)return t;if(o=r-N(e),1>o)return e;if(r=i?ur(i,0,o).join(""):t.slice(0,o),u===T)return r+e;
if(i&&(o+=r.length-o),Ve(u)){if(t.slice(o).search(u)){var f=r;for(u.global||(u=wu(u.source,ru(_t.exec(u))+"g")),u.lastIndex=0;i=u.exec(f);)var c=i.index;r=r.slice(0,c===T?o:c)}}else t.indexOf(Yn(u),o)!=o&&(u=r.lastIndexOf(u),u>-1&&(r=r.slice(0,u)));return r+e},Ot.unescape=function(t){return(t=ru(t))&&Q.test(t)?t.replace(Y,P):t},Ot.uniqueId=function(t){var n=++Wu;return ru(t)+n},Ot.upperCase=Ni,Ot.upperFirst=Pi,Ot.each=we,Ot.eachRight=me,Ot.first=pe,_u(Ot,function(){var t={};return hn(Ot,function(n,r){
Ru.call(Ot.prototype,r)||(t[r]=n)}),t}(),{chain:false}),Ot.VERSION="4.13.0",u("bind bindKey curry curryRight partial partialRight".split(" "),function(t){Ot[t].placeholder=Ot}),u(["drop","take"],function(t,n){Ut.prototype[t]=function(r){var e=this.__filtered__;if(e&&!n)return new Ut(this);r=r===T?1:Qu(Qe(r),0);var u=this.clone();return e?u.__takeCount__=Xu(r,u.__takeCount__):u.__views__.push({size:Xu(r,4294967295),type:t+(0>u.__dir__?"Right":"")}),u},Ut.prototype[t+"Right"]=function(n){return this.reverse()[t](n).reverse();
}}),u(["filter","map","takeWhile"],function(t,n){var r=n+1,e=1==r||3==r;Ut.prototype[t]=function(t){var n=this.clone();return n.__iteratees__.push({iteratee:Dr(t,3),type:r}),n.__filtered__=n.__filtered__||e,n}}),u(["head","last"],function(t,n){var r="take"+(n?"Right":"");Ut.prototype[t]=function(){return this[r](1).value()[0]}}),u(["initial","tail"],function(t,n){var r="drop"+(n?"":"Right");Ut.prototype[t]=function(){return this.__filtered__?new Ut(this):this[r](1)}}),Ut.prototype.compact=function(){
return this.filter(hu)},Ut.prototype.find=function(t){return this.filter(t).head()},Ut.prototype.findLast=function(t){return this.reverse().find(t)},Ut.prototype.invokeMap=Le(function(t,n){return typeof t=="function"?new Ut(this):this.map(function(r){return wn(r,t,n)})}),Ut.prototype.reject=function(t){return t=Dr(t,3),this.filter(function(n){return!t(n)})},Ut.prototype.slice=function(t,n){t=Qe(t);var r=this;return r.__filtered__&&(t>0||0>n)?new Ut(r):(0>t?r=r.takeRight(-t):t&&(r=r.drop(t)),n!==T&&(n=Qe(n),
r=0>n?r.dropRight(-n):r.take(n-t)),r)},Ut.prototype.takeRightWhile=function(t){return this.reverse().takeWhile(t).reverse()},Ut.prototype.toArray=function(){return this.take(4294967295)},hn(Ut.prototype,function(t,n){var r=/^(?:filter|find|map|reject)|While$/.test(n),e=/^(?:head|last)$/.test(n),u=Ot[e?"take"+("last"==n?"Right":""):n],o=e||/^find/.test(n);u&&(Ot.prototype[n]=function(){function n(t){return t=u.apply(Ot,s([t],f)),e&&h?t[0]:t}var i=this.__wrapped__,f=e?[1]:arguments,c=i instanceof Ut,a=f[0],l=c||vi(i);
l&&r&&typeof a=="function"&&1!=a.length&&(c=l=false);var h=this.__chain__,p=!!this.__actions__.length,a=o&&!h,c=c&&!p;return!o&&l?(i=c?i:new Ut(this),i=t.apply(i,f),i.__actions__.push({func:xe,args:[n],thisArg:T}),new zt(i,h)):a&&c?t.apply(this,f):(i=this.thru(n),a?e?i.value()[0]:i.value():i)})}),u("pop push shift sort splice unshift".split(" "),function(t){var n=Au[t],r=/^(?:push|sort|unshift)$/.test(t)?"tap":"thru",e=/^(?:pop|shift)$/.test(t);Ot.prototype[t]=function(){var t=arguments;if(e&&!this.__chain__){
var u=this.value();return n.apply(vi(u)?u:[],t)}return this[r](function(r){return n.apply(vi(r)?r:[],t)})}}),hn(Ut.prototype,function(t,n){var r=Ot[n];if(r){var e=r.name+"";(po[e]||(po[e]=[])).push({name:n,func:r})}}),po[mr(T,2).name]=[{name:"wrapper",func:T}],Ut.prototype.clone=function(){var t=new Ut(this.__wrapped__);return t.__actions__=lr(this.__actions__),t.__dir__=this.__dir__,t.__filtered__=this.__filtered__,t.__iteratees__=lr(this.__iteratees__),t.__takeCount__=this.__takeCount__,t.__views__=lr(this.__views__),
t},Ut.prototype.reverse=function(){if(this.__filtered__){var t=new Ut(this);t.__dir__=-1,t.__filtered__=true}else t=this.clone(),t.__dir__*=-1;return t},Ut.prototype.value=function(){var t,n=this.__wrapped__.value(),r=this.__dir__,e=vi(n),u=0>r,o=e?n.length:0;t=o;for(var i=this.__views__,f=0,c=-1,a=i.length;++c<a;){var l=i[c],s=l.size;switch(l.type){case"drop":f+=s;break;case"dropRight":t-=s;break;case"take":t=Xu(t,f+s);break;case"takeRight":f=Qu(f,t-s)}}if(t={start:f,end:t},i=t.start,f=t.end,t=f-i,
u=u?f:i-1,i=this.__iteratees__,f=i.length,c=0,a=Xu(t,this.__takeCount__),!e||200>o||o==t&&a==t)return Xn(n,this.__actions__);e=[];t:for(;t--&&a>c;){for(u+=r,o=-1,l=n[u];++o<f;){var h=i[o],s=h.type,h=(0,h.iteratee)(l);if(2==s)l=h;else if(!h){if(1==s)continue t;break t}}e[c++]=l}return e},Ot.prototype.at=Qo,Ot.prototype.chain=function(){return be(this)},Ot.prototype.commit=function(){return new zt(this.value(),this.__chain__)},Ot.prototype.next=function(){this.__values__===T&&(this.__values__=Ye(this.value()));
var t=this.__index__>=this.__values__.length,n=t?T:this.__values__[this.__index__++];return{done:t,value:n}},Ot.prototype.plant=function(t){for(var n,r=this;r instanceof kt;){var e=ce(r);e.__index__=0,e.__values__=T,n?u.__wrapped__=e:n=e;var u=e,r=r.__wrapped__}return u.__wrapped__=t,n},Ot.prototype.reverse=function(){var t=this.__wrapped__;return t instanceof Ut?(this.__actions__.length&&(t=new Ut(this)),t=t.reverse(),t.__actions__.push({func:xe,args:[ge],thisArg:T}),new zt(t,this.__chain__)):this.thru(ge);
},Ot.prototype.toJSON=Ot.prototype.valueOf=Ot.prototype.value=function(){return Xn(this.__wrapped__,this.__actions__)},Pu&&(Ot.prototype[Pu]=je),Ot}var T,q=1/0,V=NaN,K=/\b__p\+='';/g,G=/\b(__p\+=)''\+/g,J=/(__e\(.*?\)|\b__t\))\+'';/g,Y=/&(?:amp|lt|gt|quot|#39|#96);/g,H=/[&<>"'`]/g,Q=RegExp(Y.source),X=RegExp(H.source),tt=/<%-([\s\S]+?)%>/g,nt=/<%([\s\S]+?)%>/g,rt=/<%=([\s\S]+?)%>/g,et=/\.|\[(?:[^[\]]*|(["'])(?:(?!\1)[^\\]|\\.)*?\1)\]/,ut=/^\w*$/,ot=/[^.[\]]+|\[(?:(-?\d+(?:\.\d+)?)|(["'])((?:(?!\2)[^\\]|\\.)*?)\2)\]|(?=(\.|\[\])(?:\4|$))/g,it=/[\\^$.*+?()[\]{}|]/g,ft=RegExp(it.source),ct=/^\s+|\s+$/g,at=/^\s+/,lt=/\s+$/,st=/[a-zA-Z0-9]+/g,ht=/\\(\\)?/g,pt=/\$\{([^\\}]*(?:\\.[^\\}]*)*)\}/g,_t=/\w*$/,vt=/^0x/i,gt=/^[-+]0x[0-9a-f]+$/i,dt=/^0b[01]+$/i,yt=/^\[object .+?Constructor\]$/,bt=/^0o[0-7]+$/i,xt=/^(?:0|[1-9]\d*)$/,jt=/[\xc0-\xd6\xd8-\xde\xdf-\xf6\xf8-\xff]/g,wt=/($^)/,mt=/['\n\r\u2028\u2029\\]/g,At="[\\ufe0e\\ufe0f]?(?:[\\u0300-\\u036f\\ufe20-\\ufe23\\u20d0-\\u20f0]|\\ud83c[\\udffb-\\udfff])?(?:\\u200d(?:[^\\ud800-\\udfff]|(?:\\ud83c[\\udde6-\\uddff]){2}|[\\ud800-\\udbff][\\udc00-\\udfff])[\\ufe0e\\ufe0f]?(?:[\\u0300-\\u036f\\ufe20-\\ufe23\\u20d0-\\u20f0]|\\ud83c[\\udffb-\\udfff])?)*",Ot="(?:[\\u2700-\\u27bf]|(?:\\ud83c[\\udde6-\\uddff]){2}|[\\ud800-\\udbff][\\udc00-\\udfff])"+At,kt="(?:[^\\ud800-\\udfff][\\u0300-\\u036f\\ufe20-\\ufe23\\u20d0-\\u20f0]?|[\\u0300-\\u036f\\ufe20-\\ufe23\\u20d0-\\u20f0]|(?:\\ud83c[\\udde6-\\uddff]){2}|[\\ud800-\\udbff][\\udc00-\\udfff]|[\\ud800-\\udfff])",Et=RegExp("['\u2019]","g"),St=RegExp("[\\u0300-\\u036f\\ufe20-\\ufe23\\u20d0-\\u20f0]","g"),It=RegExp("\\ud83c[\\udffb-\\udfff](?=\\ud83c[\\udffb-\\udfff])|"+kt+At,"g"),Rt=RegExp(["[A-Z\\xc0-\\xd6\\xd8-\\xde]?[a-z\\xdf-\\xf6\\xf8-\\xff]+(?:['\u2019](?:d|ll|m|re|s|t|ve))?(?=[\\xac\\xb1\\xd7\\xf7\\x00-\\x2f\\x3a-\\x40\\x5b-\\x60\\x7b-\\xbf\\u2000-\\u206f \\t\\x0b\\f\\xa0\\ufeff\\n\\r\\u2028\\u2029\\u1680\\u180e\\u2000\\u2001\\u2002\\u2003\\u2004\\u2005\\u2006\\u2007\\u2008\\u2009\\u200a\\u202f\\u205f\\u3000]|[A-Z\\xc0-\\xd6\\xd8-\\xde]|$)|(?:[A-Z\\xc0-\\xd6\\xd8-\\xde]|[^\\ud800-\\udfff\\xac\\xb1\\xd7\\xf7\\x00-\\x2f\\x3a-\\x40\\x5b-\\x60\\x7b-\\xbf\\u2000-\\u206f \\t\\x0b\\f\\xa0\\ufeff\\n\\r\\u2028\\u2029\\u1680\\u180e\\u2000\\u2001\\u2002\\u2003\\u2004\\u2005\\u2006\\u2007\\u2008\\u2009\\u200a\\u202f\\u205f\\u3000\\d+\\u2700-\\u27bfa-z\\xdf-\\xf6\\xf8-\\xffA-Z\\xc0-\\xd6\\xd8-\\xde])+(?:['\u2019](?:D|LL|M|RE|S|T|VE))?(?=[\\xac\\xb1\\xd7\\xf7\\x00-\\x2f\\x3a-\\x40\\x5b-\\x60\\x7b-\\xbf\\u2000-\\u206f \\t\\x0b\\f\\xa0\\ufeff\\n\\r\\u2028\\u2029\\u1680\\u180e\\u2000\\u2001\\u2002\\u2003\\u2004\\u2005\\u2006\\u2007\\u2008\\u2009\\u200a\\u202f\\u205f\\u3000]|[A-Z\\xc0-\\xd6\\xd8-\\xde](?:[a-z\\xdf-\\xf6\\xf8-\\xff]|[^\\ud800-\\udfff\\xac\\xb1\\xd7\\xf7\\x00-\\x2f\\x3a-\\x40\\x5b-\\x60\\x7b-\\xbf\\u2000-\\u206f \\t\\x0b\\f\\xa0\\ufeff\\n\\r\\u2028\\u2029\\u1680\\u180e\\u2000\\u2001\\u2002\\u2003\\u2004\\u2005\\u2006\\u2007\\u2008\\u2009\\u200a\\u202f\\u205f\\u3000\\d+\\u2700-\\u27bfa-z\\xdf-\\xf6\\xf8-\\xffA-Z\\xc0-\\xd6\\xd8-\\xde])|$)|[A-Z\\xc0-\\xd6\\xd8-\\xde]?(?:[a-z\\xdf-\\xf6\\xf8-\\xff]|[^\\ud800-\\udfff\\xac\\xb1\\xd7\\xf7\\x00-\\x2f\\x3a-\\x40\\x5b-\\x60\\x7b-\\xbf\\u2000-\\u206f \\t\\x0b\\f\\xa0\\ufeff\\n\\r\\u2028\\u2029\\u1680\\u180e\\u2000\\u2001\\u2002\\u2003\\u2004\\u2005\\u2006\\u2007\\u2008\\u2009\\u200a\\u202f\\u205f\\u3000\\d+\\u2700-\\u27bfa-z\\xdf-\\xf6\\xf8-\\xffA-Z\\xc0-\\xd6\\xd8-\\xde])+(?:['\u2019](?:d|ll|m|re|s|t|ve))?|[A-Z\\xc0-\\xd6\\xd8-\\xde]+(?:['\u2019](?:D|LL|M|RE|S|T|VE))?|\\d+",Ot].join("|"),"g"),Wt=RegExp("[\\u200d\\ud800-\\udfff\\u0300-\\u036f\\ufe20-\\ufe23\\u20d0-\\u20f0\\ufe0e\\ufe0f]"),Bt=/[a-z][A-Z]|[A-Z]{2,}[a-z]|[0-9][a-zA-Z]|[a-zA-Z][0-9]|[^a-zA-Z0-9 ]/,Lt="Array Buffer DataView Date Error Float32Array Float64Array Function Int8Array Int16Array Int32Array Map Math Object Promise Reflect RegExp Set String Symbol TypeError Uint8Array Uint8ClampedArray Uint16Array Uint32Array WeakMap _ isFinite parseInt setTimeout".split(" "),Mt={};
Mt["[object Float32Array]"]=Mt["[object Float64Array]"]=Mt["[object Int8Array]"]=Mt["[object Int16Array]"]=Mt["[object Int32Array]"]=Mt["[object Uint8Array]"]=Mt["[object Uint8ClampedArray]"]=Mt["[object Uint16Array]"]=Mt["[object Uint32Array]"]=true,Mt["[object Arguments]"]=Mt["[object Array]"]=Mt["[object ArrayBuffer]"]=Mt["[object Boolean]"]=Mt["[object DataView]"]=Mt["[object Date]"]=Mt["[object Error]"]=Mt["[object Function]"]=Mt["[object Map]"]=Mt["[object Number]"]=Mt["[object Object]"]=Mt["[object RegExp]"]=Mt["[object Set]"]=Mt["[object String]"]=Mt["[object WeakMap]"]=false;
var Ct={};Ct["[object Arguments]"]=Ct["[object Array]"]=Ct["[object ArrayBuffer]"]=Ct["[object DataView]"]=Ct["[object Boolean]"]=Ct["[object Date]"]=Ct["[object Float32Array]"]=Ct["[object Float64Array]"]=Ct["[object Int8Array]"]=Ct["[object Int16Array]"]=Ct["[object Int32Array]"]=Ct["[object Map]"]=Ct["[object Number]"]=Ct["[object Object]"]=Ct["[object RegExp]"]=Ct["[object Set]"]=Ct["[object String]"]=Ct["[object Symbol]"]=Ct["[object Uint8Array]"]=Ct["[object Uint8ClampedArray]"]=Ct["[object Uint16Array]"]=Ct["[object Uint32Array]"]=true,
Ct["[object Error]"]=Ct["[object Function]"]=Ct["[object WeakMap]"]=false;var zt={"\xc0":"A","\xc1":"A","\xc2":"A","\xc3":"A","\xc4":"A","\xc5":"A","\xe0":"a","\xe1":"a","\xe2":"a","\xe3":"a","\xe4":"a","\xe5":"a","\xc7":"C","\xe7":"c","\xd0":"D","\xf0":"d","\xc8":"E","\xc9":"E","\xca":"E","\xcb":"E","\xe8":"e","\xe9":"e","\xea":"e","\xeb":"e","\xcc":"I","\xcd":"I","\xce":"I","\xcf":"I","\xec":"i","\xed":"i","\xee":"i","\xef":"i","\xd1":"N","\xf1":"n","\xd2":"O","\xd3":"O","\xd4":"O","\xd5":"O","\xd6":"O",
"\xd8":"O","\xf2":"o","\xf3":"o","\xf4":"o","\xf5":"o","\xf6":"o","\xf8":"o","\xd9":"U","\xda":"U","\xdb":"U","\xdc":"U","\xf9":"u","\xfa":"u","\xfb":"u","\xfc":"u","\xdd":"Y","\xfd":"y","\xff":"y","\xc6":"Ae","\xe6":"ae","\xde":"Th","\xfe":"th","\xdf":"ss"},Ut={"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;","`":"&#96;"},$t={"&amp;":"&","&lt;":"<","&gt;":">","&quot;":'"',"&#39;":"'","&#96;":"`"},Dt={"\\":"\\","'":"'","\n":"n","\r":"r","\u2028":"u2028","\u2029":"u2029"},Ft=parseFloat,Nt=parseInt,Pt=typeof exports=="object"&&exports,Zt=Pt&&typeof module=="object"&&module,Tt=Zt&&Zt.exports===Pt,qt=R(typeof self=="object"&&self),Vt=R(typeof this=="object"&&this),Kt=R(typeof global=="object"&&global)||qt||Vt||Function("return this")(),Gt=Z();
(qt||{})._=Gt,typeof define=="function"&&typeof define.amd=="object"&&define.amd? define(function(){return Gt}):Zt?((Zt.exports=Gt)._=Gt,Pt._=Gt):Kt._=Gt}).call(this);
window.Modernizr=function(e,t,n){function r(e){b.cssText=e}function o(e,t){return r(S.join(e+";")+(t||""))}function a(e,t){return typeof e===t}function i(e,t){return!!~(""+e).indexOf(t)}function c(e,t){for(var r in e){var o=e[r];if(!i(o,"-")&&b[o]!==n)return"pfx"==t?o:!0}return!1}function s(e,t,r){for(var o in e){var i=t[e[o]];if(i!==n)return r===!1?e[o]:a(i,"function")?i.bind(r||t):i}return!1}function u(e,t,n){var r=e.charAt(0).toUpperCase()+e.slice(1),o=(e+" "+k.join(r+" ")+r).split(" ");return a(t,"string")||a(t,"undefined")?c(o,t):(o=(e+" "+T.join(r+" ")+r).split(" "),s(o,t,n))}function l(){p.input=function(n){for(var r=0,o=n.length;o>r;r++)j[n[r]]=!!(n[r]in E);return j.list&&(j.list=!(!t.createElement("datalist")||!e.HTMLDataListElement)),j}("autocomplete autofocus list placeholder max min multiple pattern required step".split(" ")),p.inputtypes=function(e){for(var r,o,a,i=0,c=e.length;c>i;i++)E.setAttribute("type",o=e[i]),r="text"!==E.type,r&&(E.value=x,E.style.cssText="position:absolute;visibility:hidden;",/^range$/.test(o)&&E.style.WebkitAppearance!==n?(g.appendChild(E),a=t.defaultView,r=a.getComputedStyle&&"textfield"!==a.getComputedStyle(E,null).WebkitAppearance&&0!==E.offsetHeight,g.removeChild(E)):/^(search|tel)$/.test(o)||(r=/^(url|email)$/.test(o)?E.checkValidity&&E.checkValidity()===!1:E.value!=x)),P[e[i]]=!!r;return P}("search tel url email datetime date month week time datetime-local number range color".split(" "))}var d,f,m="2.8.3",p={},h=!0,g=t.documentElement,v="modernizr",y=t.createElement(v),b=y.style,E=t.createElement("input"),x=":)",w={}.toString,S=" -webkit- -moz- -o- -ms- ".split(" "),C="Webkit Moz O ms",k=C.split(" "),T=C.toLowerCase().split(" "),N={svg:"http://www.w3.org/2000/svg"},M={},P={},j={},$=[],D=$.slice,F=function(e,n,r,o){var a,i,c,s,u=t.createElement("div"),l=t.body,d=l||t.createElement("body");if(parseInt(r,10))for(;r--;)c=t.createElement("div"),c.id=o?o[r]:v+(r+1),u.appendChild(c);return a=["&#173;",'<style id="s',v,'">',e,"</style>"].join(""),u.id=v,(l?u:d).innerHTML+=a,d.appendChild(u),l||(d.style.background="",d.style.overflow="hidden",s=g.style.overflow,g.style.overflow="hidden",g.appendChild(d)),i=n(u,e),l?u.parentNode.removeChild(u):(d.parentNode.removeChild(d),g.style.overflow=s),!!i},z=function(t){var n=e.matchMedia||e.msMatchMedia;if(n)return n(t)&&n(t).matches||!1;var r;return F("@media "+t+" { #"+v+" { position: absolute; } }",function(t){r="absolute"==(e.getComputedStyle?getComputedStyle(t,null):t.currentStyle).position}),r},A=function(){function e(e,o){o=o||t.createElement(r[e]||"div"),e="on"+e;var i=e in o;return i||(o.setAttribute||(o=t.createElement("div")),o.setAttribute&&o.removeAttribute&&(o.setAttribute(e,""),i=a(o[e],"function"),a(o[e],"undefined")||(o[e]=n),o.removeAttribute(e))),o=null,i}var r={select:"input",change:"input",submit:"form",reset:"form",error:"img",load:"img",abort:"img"};return e}(),L={}.hasOwnProperty;f=a(L,"undefined")||a(L.call,"undefined")?function(e,t){return t in e&&a(e.constructor.prototype[t],"undefined")}:function(e,t){return L.call(e,t)},Function.prototype.bind||(Function.prototype.bind=function(e){var t=this;if("function"!=typeof t)throw new TypeError;var n=D.call(arguments,1),r=function(){if(this instanceof r){var o=function(){};o.prototype=t.prototype;var a=new o,i=t.apply(a,n.concat(D.call(arguments)));return Object(i)===i?i:a}return t.apply(e,n.concat(D.call(arguments)))};return r}),M.flexbox=function(){return u("flexWrap")},M.flexboxlegacy=function(){return u("boxDirection")},M.canvas=function(){var e=t.createElement("canvas");return!(!e.getContext||!e.getContext("2d"))},M.canvastext=function(){return!(!p.canvas||!a(t.createElement("canvas").getContext("2d").fillText,"function"))},M.webgl=function(){return!!e.WebGLRenderingContext},M.touch=function(){var n;return"ontouchstart"in e||e.DocumentTouch&&t instanceof DocumentTouch?n=!0:F(["@media (",S.join("touch-enabled),("),v,")","{#modernizr{top:9px;position:absolute}}"].join(""),function(e){n=9===e.offsetTop}),n},M.geolocation=function(){return"geolocation"in navigator},M.postmessage=function(){return!!e.postMessage},M.websqldatabase=function(){return!!e.openDatabase},M.indexedDB=function(){return!!u("indexedDB",e)},M.hashchange=function(){return A("hashchange",e)&&(t.documentMode===n||t.documentMode>7)},M.history=function(){return!(!e.history||!history.pushState)},M.draganddrop=function(){var e=t.createElement("div");return"draggable"in e||"ondragstart"in e&&"ondrop"in e},M.websockets=function(){return"WebSocket"in e||"MozWebSocket"in e},M.rgba=function(){return r("background-color:rgba(150,255,150,.5)"),i(b.backgroundColor,"rgba")},M.hsla=function(){return r("background-color:hsla(120,40%,100%,.5)"),i(b.backgroundColor,"rgba")||i(b.backgroundColor,"hsla")},M.multiplebgs=function(){return r("background:url(https://),url(https://),red url(https://)"),/(url\s*\(.*?){3}/.test(b.background)},M.backgroundsize=function(){return u("backgroundSize")},M.borderimage=function(){return u("borderImage")},M.borderradius=function(){return u("borderRadius")},M.boxshadow=function(){return u("boxShadow")},M.textshadow=function(){return""===t.createElement("div").style.textShadow},M.opacity=function(){return o("opacity:.55"),/^0.55$/.test(b.opacity)},M.cssanimations=function(){return u("animationName")},M.csscolumns=function(){return u("columnCount")},M.cssgradients=function(){var e="background-image:",t="gradient(linear,left top,right bottom,from(#9f9),to(white));",n="linear-gradient(left top,#9f9, white);";return r((e+"-webkit- ".split(" ").join(t+e)+S.join(n+e)).slice(0,-e.length)),i(b.backgroundImage,"gradient")},M.cssreflections=function(){return u("boxReflect")},M.csstransforms=function(){return!!u("transform")},M.csstransforms3d=function(){var e=!!u("perspective");return e&&"webkitPerspective"in g.style&&F("@media (transform-3d),(-webkit-transform-3d){#modernizr{left:9px;position:absolute;height:3px;}}",function(t){e=9===t.offsetLeft&&3===t.offsetHeight}),e},M.csstransitions=function(){return u("transition")},M.fontface=function(){var e;return F('@font-face {font-family:"font";src:url("https://")}',function(n,r){var o=t.getElementById("smodernizr"),a=o.sheet||o.styleSheet,i=a?a.cssRules&&a.cssRules[0]?a.cssRules[0].cssText:a.cssText||"":"";e=/src/i.test(i)&&0===i.indexOf(r.split(" ")[0])}),e},M.generatedcontent=function(){var e;return F(["#",v,"{font:0/0 a}#",v,':after{content:"',x,'";visibility:hidden;font:3px/1 a}'].join(""),function(t){e=t.offsetHeight>=3}),e},M.video=function(){var e=t.createElement("video"),n=!1;try{(n=!!e.canPlayType)&&(n=new Boolean(n),n.ogg=e.canPlayType('video/ogg; codecs="theora"').replace(/^no$/,""),n.h264=e.canPlayType('video/mp4; codecs="avc1.42E01E"').replace(/^no$/,""),n.webm=e.canPlayType('video/webm; codecs="vp8, vorbis"').replace(/^no$/,""))}catch(r){}return n},M.audio=function(){var e=t.createElement("audio"),n=!1;try{(n=!!e.canPlayType)&&(n=new Boolean(n),n.ogg=e.canPlayType('audio/ogg; codecs="vorbis"').replace(/^no$/,""),n.mp3=e.canPlayType("audio/mpeg;").replace(/^no$/,""),n.wav=e.canPlayType('audio/wav; codecs="1"').replace(/^no$/,""),n.m4a=(e.canPlayType("audio/x-m4a;")||e.canPlayType("audio/aac;")).replace(/^no$/,""))}catch(r){}return n},M.localstorage=function(){try{return localStorage.setItem(v,v),localStorage.removeItem(v),!0}catch(e){return!1}},M.sessionstorage=function(){try{return sessionStorage.setItem(v,v),sessionStorage.removeItem(v),!0}catch(e){return!1}},M.webworkers=function(){return!!e.Worker},M.applicationcache=function(){return!!e.applicationCache},M.svg=function(){return!!t.createElementNS&&!!t.createElementNS(N.svg,"svg").createSVGRect},M.inlinesvg=function(){var e=t.createElement("div");return e.innerHTML="<svg/>",(e.firstChild&&e.firstChild.namespaceURI)==N.svg},M.smil=function(){return!!t.createElementNS&&/SVGAnimate/.test(w.call(t.createElementNS(N.svg,"animate")))},M.svgclippaths=function(){return!!t.createElementNS&&/SVGClipPath/.test(w.call(t.createElementNS(N.svg,"clipPath")))};for(var H in M)f(M,H)&&(d=H.toLowerCase(),p[d]=M[H](),$.push((p[d]?"":"no-")+d));return p.input||l(),p.addTest=function(e,t){if("object"==typeof e)for(var r in e)f(e,r)&&p.addTest(r,e[r]);else{if(e=e.toLowerCase(),p[e]!==n)return p;t="function"==typeof t?t():t,"undefined"!=typeof h&&h&&(g.className+=" "+(t?"":"no-")+e),p[e]=t}return p},r(""),y=E=null,function(e,t){function n(e,t){var n=e.createElement("p"),r=e.getElementsByTagName("head")[0]||e.documentElement;return n.innerHTML="x<style>"+t+"</style>",r.insertBefore(n.lastChild,r.firstChild)}function r(){var e=y.elements;return"string"==typeof e?e.split(" "):e}function o(e){var t=v[e[h]];return t||(t={},g++,e[h]=g,v[g]=t),t}function a(e,n,r){if(n||(n=t),l)return n.createElement(e);r||(r=o(n));var a;return a=r.cache[e]?r.cache[e].cloneNode():p.test(e)?(r.cache[e]=r.createElem(e)).cloneNode():r.createElem(e),!a.canHaveChildren||m.test(e)||a.tagUrn?a:r.frag.appendChild(a)}function i(e,n){if(e||(e=t),l)return e.createDocumentFragment();n=n||o(e);for(var a=n.frag.cloneNode(),i=0,c=r(),s=c.length;s>i;i++)a.createElement(c[i]);return a}function c(e,t){t.cache||(t.cache={},t.createElem=e.createElement,t.createFrag=e.createDocumentFragment,t.frag=t.createFrag()),e.createElement=function(n){return y.shivMethods?a(n,e,t):t.createElem(n)},e.createDocumentFragment=Function("h,f","return function(){var n=f.cloneNode(),c=n.createElement;h.shivMethods&&("+r().join().replace(/[\w\-]+/g,function(e){return t.createElem(e),t.frag.createElement(e),'c("'+e+'")'})+");return n}")(y,t.frag)}function s(e){e||(e=t);var r=o(e);return!y.shivCSS||u||r.hasCSS||(r.hasCSS=!!n(e,"article,aside,dialog,figcaption,figure,footer,header,hgroup,main,nav,section{display:block}mark{background:#FF0;color:#000}template{display:none}")),l||c(e,r),e}var u,l,d="3.7.0",f=e.html5||{},m=/^<|^(?:button|map|select|textarea|object|iframe|option|optgroup)$/i,p=/^(?:a|b|code|div|fieldset|h1|h2|h3|h4|h5|h6|i|label|li|ol|p|q|span|strong|style|table|tbody|td|th|tr|ul)$/i,h="_html5shiv",g=0,v={};!function(){try{var e=t.createElement("a");e.innerHTML="<xyz></xyz>",u="hidden"in e,l=1==e.childNodes.length||function(){t.createElement("a");var e=t.createDocumentFragment();return"undefined"==typeof e.cloneNode||"undefined"==typeof e.createDocumentFragment||"undefined"==typeof e.createElement}()}catch(n){u=!0,l=!0}}();var y={elements:f.elements||"abbr article aside audio bdi canvas data datalist details dialog figcaption figure footer header hgroup main mark meter nav output progress section summary template time video",version:d,shivCSS:f.shivCSS!==!1,supportsUnknownElements:l,shivMethods:f.shivMethods!==!1,type:"default",shivDocument:s,createElement:a,createDocumentFragment:i};e.html5=y,s(t)}(this,t),p._version=m,p._prefixes=S,p._domPrefixes=T,p._cssomPrefixes=k,p.mq=z,p.hasEvent=A,p.testProp=function(e){return c([e])},p.testAllProps=u,p.testStyles=F,p.prefixed=function(e,t,n){return t?u(e,t,n):u(e,"pfx")},g.className=g.className.replace(/(^|\s)no-js(\s|$)/,"$1$2")+(h?" js "+$.join(" "):""),p}(this,this.document);
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
/*Go To Top Function*/
var goToTop = document.getElementById('btn-to-top');

goToTop.onclick = function () {
	smoothScrollTo(0, 500);
};

window.smoothScrollTo = (function () {
  var timer, start, factor;

  return function (target, duration) {
    var offset = window.pageYOffset,
        delta  = target - window.pageYOffset; /* Y-offset difference*/
    duration = duration || 1000;              /* default 1 sec animation*/
    start = Date.now();                      /* get start time*/
    factor = 0;

    if( timer ) {
      clearInterval(timer); // stop any running animations
   }

    function step() {
      var y;
      factor = (Date.now() - start) / duration; // get interpolation factor
      if( factor >= 1 ) {
        clearInterval(timer); // stop animation
        factor = 1;           // clip to max 1.0
     }
      y = factor * delta + offset;
      window.scrollBy(0, y - window.pageYOffset);
   }

    timer = setInterval(step, 20);
    return timer;
 };
}());
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



//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInByb2plY3QuanMiLCJjb3JlRnJhbWV3b3JrLmpzIiwiY29yZUhlbHBlcnMuanMiLCJkcmFnZW5kLmpzIiwiZHJhZ2VuZEhlbHBlcnMuanMiLCJmZWF0aGVybGlnaHQuanMiLCJpc290b3BlLnBrZ2QuanMiLCJsb2Rhc2guanMiLCJtb2Rlcm5penIubWluLmpzIiwib3Zlcmx5LmpzIiwic2Nyb2xsVG9wLmpzIiwidGVzdGluZy5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ3BGQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUMzSkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNyTkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDMTNCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDcklBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQzdpQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQzE3R0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUM5SEE7QUNBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNsREE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDbkNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoicHJvamVjdC5qcyIsInNvdXJjZXNDb250ZW50IjpbImpRdWVyeShkb2N1bWVudCkucmVhZHkoZnVuY3Rpb24oKXtcclxuXG5cdC8vQ2FsbCB0aGUgY29yZSBmdW5jdGlvbnMgb24gZXZlcnkgcGFnZVxyXG5cdGNvcmVSZWFkeSgpO1xyXG5cblx0Ly9Db250cm9sIHJlc2l6ZS9zY3JvbGwgZGVib3VuY2luZyBpbiBvbmUgcGxhY2VcclxuXHRqUXVlcnkod2luZG93KS5vbignc2Nyb2xsJyxcdF8uZGVib3VuY2Uoc2Nyb2xsTWVudUNsYXNzLCAyNTApKTtcclxuXHRqUXVlcnkod2luZG93KS5vbigncmVhZHknLCAgXy5kZWJvdW5jZShjb3JlUmVzaXplLCAwKSk7XHJcblx0alF1ZXJ5KHdpbmRvdykub24oJ3Jlc2l6ZScsIF8uZGVib3VuY2UoY29yZVJlc2l6ZSwgMCkpO1xyXG5cclxuXHQvL1BBR0VTIEZPUiBUSElTIFBST0pFQ1RcclxuXHJcblx0Ly9IT01FIFBBR0UgLSBEcmFnZW5kIEltYWdlIEdhbGxlcnlcclxuXHRpZiAoIGpRdWVyeSgnaHRtbCcpLmRhdGEoJ3BhZ2UnKSA9PSAnaG9tZScpe1xuXHRcdGpRdWVyeSh3aW5kb3cpLm9uKCdyZXNpemUnLCBfLmRlYm91bmNlKGhvbWVSZXNpemUsIDUwKSk7XHJcblxyXG5cdFx0Ly8jaG9tZUdhbGxlcnkgSW1hZ2UgU2xpZGVyXHJcblx0XHR2YXIgc2xpZGVzUGFyZW50IFx0XHQ9ICcjaG9tZUdhbGxlcnknO1xyXG5cdFx0dmFyIHNsaWRlc0NvbnRhaW5lciBcdD0gJyNzbGlkZXNDb250YWluZXInO1xyXG5cdFx0dmFyIHNsaWRlc0NvbnRlbnQgXHRcdD0gZ2V0SW1hZ2VzQnlTY3JlZW5TaXplKGFsbFNpemVzKTtcclxuXHRcdGNyZWF0ZURyYWdlbmRTbGlkZXMoIHNsaWRlc1BhcmVudCwgc2xpZGVzQ29udGVudCwgXCJpbWFnZXNcIiwgZmFsc2UpO1xyXG5cblx0XHQvL05ldyBEcmFnZW5kIENsYXNzXHJcblx0XHRqUXVlcnkoc2xpZGVzQ29udGFpbmVyKS5kcmFnZW5kKHt9KTtcclxuXG5cdFx0Ly91cGRhdGVEcmFnZW5kU2xpZGVyKCBzbGlkZUNvbnRhaW5lciwgaGVpZ2h0LCAgICAgdGh1bWJuYWlscywgKVxyXG5cdFx0dXBkYXRlRHJhZ2VuZFNsaWRlclx0ICggc2xpZGVzUGFyZW50LCAgIHZpZXdIZWlnaHQsIGZhbHNlKTtcclxuXHJcblx0XHQvL0F1dG9QbGF5XHJcblx0XHRkb1JlY3Vyc2l2ZWx5KCBmdW5jdGlvbigpeyBhdXRvUGxheVNsaWRlcyhzbGlkZXNDb250YWluZXIpIH0sIDM1MDAsIDMyMDAwKTtcclxuXG5cdFx0ZnVuY3Rpb24gaG9tZVJlc2l6ZSgpe1xyXG5cdCAgICAgICAgY29uc29sZS5sb2coXCJwcm9qZWN0LmpzL2hvbWU6cmVzaXplIEg6IFwiICsgdmlld0hlaWdodCArIFwiIFc6IFwiICsgdmlld1dpZHRoKTtcclxuXG5cdFx0XHR1cGRhdGVEcmFnZW5kU2xpZGVyKHNsaWRlc1BhcmVudCwgdmlld0hlaWdodCwgZmFsc2UpO1xyXG5cblx0XHR9XG5cclxuXHR9Ly9ob21lIHBhZ2VcclxuXHJcblxyXG5cclxuXHQvL1BST0pFQ1RTIFBBR0UgLSBEcmFnZW5kIEltYWdlIEdhbGxlcnlcclxuXHRpZiAoIGpRdWVyeSgnaHRtbCcpLmRhdGEoJ3BhZ2UnKSA9PSAncHJvamVjdHMnIHx8IGpRdWVyeSgnaHRtbCcpLmRhdGEoJ3BhZ2UnKSA9PSAncG9ydGZvbGlvJyl7XG5cdFx0alF1ZXJ5KHdpbmRvdykub24oJ3Jlc2l6ZScsIF8uZGVib3VuY2UocHJvamVjdHNSZXNpemUsIDUwKSk7XHJcblx0XHRqUXVlcnkod2luZG93KS5vbigncmVzaXplJywgXy5kZWJvdW5jZShhcHBseUlzbywgMTUwKSk7XHJcblxyXG5cdFx0ZnVuY3Rpb24gcHJvamVjdHNSZXNpemUoKXtcbiAgICAgICAgICAgIGlmKHZpZXdXaWR0aCA8IDEwMDApe1xuXHRcdFx0XHRqUXVlcnkoJyN0aHVtYnNDb250YWluZXInKS5pbnNlcnRBZnRlcihcIiNwcm9qZWN0c0dhbGxlcnlcIik7XHJcblx0XHRcdH1cclxuXHRcdFx0ZWxzZXtcclxuXHRcdFx0XHRqUXVlcnkoJyN0aHVtYnNDb250YWluZXInKS5hcHBlbmRUbyhcIiNwcm9qZWN0c0dhbGxlcnlcIik7XHJcblx0XHRcdH1cblxuICAgICAgICAgICAgY2VudGVyRHJhZ2VuZFRodW1icygpO1xuXHRcdH1cblxuICAgICAgICAvLyBQb3J0Zm9saW8gTWFzb25hcnlcbiAgICAgICAgaWYoalF1ZXJ5LmZuLmNvcmVfaXNvX3NvcnQpIGpRdWVyeSgnLmlzby1ncmlkJykuYXZpYV9pc29fc29ydCgpO1xuXG5cdFx0ZnVuY3Rpb24gYXBwbHlJc28oKXtcblx0XHRcdHZhciBwcm9qZWN0c0lzbyA9IGpRdWVyeSgnLmlzby1ncmlkJykuaXNvdG9wZSh7XHJcblx0XHRcdFx0aXRlbVNlbGVjdG9yOiAnLmlzby1ncmlkLWl0ZW0nLFxyXG5cdFx0XHRcdHJlc2l6YWJsZTogZmFsc2UsIC8vIGRpc2FibGUgbm9ybWFsIHJlc2l6aW5nXHJcblx0XHRcdFx0cGVyY2VudFBvc2l0aW9uOiB0cnVlLFxyXG5cdFx0XHRcdGFuaW1hdGlvbkVuZ2luZTogJ2Jlc3QtYXZhaWxhYmxlJyxcblx0XHRcdFx0YW5pbWF0aW9uT3B0aW9uczoge1xyXG5cdFx0XHQgICAgXHRkdXJhdGlvbjogMzAwMCxcclxuXHRcdFx0ICAgIFx0ZWFzaW5nOiAnbGluZWFyJyxcclxuXHRcdFx0ICAgIFx0cXVldWU6IGZhbHNlXHJcblx0XHRcdCAgICB9LFxyXG5cdFx0XHRcdGxheW91dE1vZGU6ICdmaXRSb3dzJyxcclxuXHRcdFx0XHRtYXNvbnJ5OntcclxuXHQgICAgICAgICAgICAgICAgY29sdW1uV2lkdGg6ICAgICdpc28tZ3JpZC1pdGVtJyxcblx0ICAgICAgICAgICAgICAgIGlzQW5pbWF0ZWQ6ICAgICB0cnVlXHJcblx0ICAgICAgICAgICAgICAgIC8vaXNGaXRXaWR0aDogICB0cnVlXG5cdCAgICAgICAgICAgIH1cclxuXHRcdFx0fSk7XHJcblx0XHR9XHJcblxuXHR9Ly9wcm9qZWN0cyBwYWdlXG5cbn0pO1xyXG4iLCIvL0luaXQgUHJvamVjdCBWYXJpYWJsZXNcclxudmFyIG1vYmlsZU5hdk9ubHkgXHRcdD0gdHJ1ZTtcbnZhciBwYWdlTG9hZGVyIFx0XHRcdD0gdHJ1ZTtcclxudmFyIGRldlRlc3RpbmcgXHRcdFx0PSB0cnVlO1xyXG52YXIgYmFzZUZvbnRTaXplIFx0XHQ9IHBhcnNlSW50KGpRdWVyeSgnaHRtbCcpLmNzcygnZm9udC1zaXplJykpO1xyXG52YXIgbW9iaWxlUG9ydHJhaXQgXHRcdD0gNDE0O1xyXG52YXIgbW9iaWxlTGFuZHNjYXBlIFx0PSA3Njc7XHJcbnZhciB0YWJsZXRMYW5kc2NhcGUgXHQ9IDEyODA7XHJcblxyXG52YXIgY29uc29sZVx0XHQ9IHdpbmRvdy5jb25zb2xlO1xyXG52YXIgYWxlcnQgXHRcdD0gd2luZG93LmFsZXJ0O1xyXG52YXIgZG9jdW1lbnQgXHQ9IHdpbmRvdy5kb2N1ZW1lbnQ7XHJcbnZhciBib2R5IFx0XHQ9IGRvY3VtZW50LmJvZHk7XHJcbnZhciBkb2NXaWR0aCBcdD0gZG9jdW1lbnQuYm9keS5jbGllbnRXaWR0aDtcclxudmFyIGRvY0hlaWdodCBcdD0gZG9jdW1lbnQuYm9keS5jbGllbnRIZWlnaHQ7XHJcbnZhciB2aWV3V2lkdGggXHQ9IHdpbmRvdy5pbm5lcldpZHRoO1xyXG52YXIgdmlld0hlaWdodCBcdD0gd2luZG93LmlubmVySGVpZ2h0O1xyXG52YXIgdmlld0FzcCBcdD0gKHdpbmRvdy5pbm5lcldpZHRoL3dpbmRvdy5pbm5lckhlaWdodCkudG9GaXhlZCgyKTtcclxuXHJcbnZhciBicmVha1BvaW50ICA9IGdldEJyZWFrcG9pbnQobW9iaWxlUG9ydHJhaXQsIG1vYmlsZUxhbmRzY2FwZSk7XHJcbnZhciBhc3BUZXh0IFx0PSBzZXRPcmllbnRhdGlvbigpO1xyXG52YXIgZGV2aWNlVHlwZSBcdD0galF1ZXJ5KCdodG1sJykuZGF0YSgnZGV2aWNlJyk7XHJcblxyXG5cclxuZnVuY3Rpb24gY29yZVJlYWR5KCl7XHJcblxyXG5cdGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCduYXZPcGVuQnRuJykuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBhZGRNZW51T3BlbkNsYXNzICk7IC8qQ2xpY2sgZnVuY3Rpb24gdG8gYWRkIG1vYmlsZU1lbnUgY2xhc3MqL1xyXG5cdGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCduYXZDbG9zZUJ0bicpLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgcmVtb3ZlTWVudU9wZW5DbGFzcyApOyAvKkNsaWNrIGZ1bmN0aW9uIHRvIHJlbW92ZSBtb2JpbGVNZW51IGNsYXNzKi9cclxuXHJcblx0alF1ZXJ5KFwiI3BhZ2VMb2FkZXJcIikuZmFkZU91dChcImZhc3RcIik7XHJcblxyXG59XHJcblxyXG5mdW5jdGlvbiBjb3JlUmVzaXplKCl7XHJcblx0Ly9SZXNldCBiYXNlIHZhbHVlc1xyXG5cdGRvY1dpZHRoIFx0PSBkb2N1bWVudC5ib2R5LmNsaWVudFdpZHRoO1xyXG5cdGRvY0hlaWdodCBcdD0gZG9jdW1lbnQuYm9keS5jbGllbnRIZWlnaHQ7XHJcblx0dmlld1dpZHRoIFx0PSB3aW5kb3cuaW5uZXJXaWR0aDtcclxuXHR2aWV3SGVpZ2h0IFx0PSB3aW5kb3cuaW5uZXJIZWlnaHQ7XHJcblx0dmlld0FzcFx0XHQ9ICh3aW5kb3cuaW5uZXJXaWR0aC93aW5kb3cuaW5uZXJIZWlnaHQpLnRvRml4ZWQoMik7XHJcblx0YnJlYWtQb2ludCBcdD0gZ2V0QnJlYWtwb2ludChtb2JpbGVQb3J0cmFpdCwgbW9iaWxlTGFuZHNjYXBlLCB0YWJsZXRMYW5kc2NhcGUpO1xyXG5cdGFzcFRleHQgXHQ9IHNldE9yaWVudGF0aW9uKCk7XHJcblxyXG5cdC8vQ2hlY2sgaWYgdGhlIG1lbnUgY2xhc3Mgc2hvdWxkIGNoYW5nZVxyXG5cdHRvZ2dsZU5hdkNsYXNzKCk7XHJcblxyXG5cdC8vQ2hlY2sgSFRNTFxyXG5cdHNldEhUTUxNaW5IZWlnaHQoKTtcclxuXHJcbiAgICAvL0lmIGRldlRlc3RpbmcgVFJVRSBnZW5lcmF0ZSB0ZXN0UGFuZWxcclxuICAgIGlmIChkZXZUZXN0aW5nID09PSB0cnVlKXtcclxuXHRcdGluaXRUZXN0UGFuZWwoKTtcclxuXHR9XHJcblxyXG4gICAgLy9JZlxyXG4gICAgaWYgKGRldlRlc3RpbmcgPT09IHRydWUpe1xyXG4gICAgICAgIGluaXRUZXN0UGFuZWwoKTtcclxuICAgIH1cclxuXHJcblx0Ly9Mb2cgY3VycmVudCBkZXZpY2UgaW5mb1xyXG5cdGNvbnNvbGUubG9nKCdjb3JlRnJhbWV3b3JrLmpzL2NvcmVSZXNpemUgSDonKyB2aWV3SGVpZ2h0ICsnIHggVzonICsgdmlld1dpZHRoICsnIEFzcDonICsgdmlld0FzcCArJyAnICsgYXNwVGV4dCArJyAnICsgZGV2aWNlVHlwZSk7XHJcbiAgICBqUXVlcnkoJy5tb2JpbGVNZW51ICNuYXYnKS5jc3MoJ2hlaWdodCcsIHZpZXdIZWlnaHQpO1xyXG4gICAgbW9iaWxlTWVudUhlaWdodCgpO1xyXG59Ly8gY29yZVJlc2l6ZVxyXG5cclxuXHJcblxyXG4vL2ZpeCB3cmFwcGVyIGhlaWdodCBvbiBzaG9ydCBzY3JlZW5zXHJcbmZ1bmN0aW9uIHNldEhUTUxNaW5IZWlnaHQoKXtcclxuXHR2YXIgd3JhcHBlckhlaWdodCA9IGpRdWVyeSgnI3dyYXBwZXInKS5oZWlnaHQoKTtcclxuXHRqUXVlcnkoJ2h0bWwnKS5jc3MoJ2hlaWdodCcsICdhdXRvJyk7XHJcblx0aWYod3JhcHBlckhlaWdodCA8IHZpZXdIZWlnaHQpe1xyXG5cdFx0alF1ZXJ5KCdodG1sJykuY3NzKCdoZWlnaHQnLCB2aWV3SGVpZ2h0KTtcclxuXHRcdGpRdWVyeSgnYm9keScpLmNzcygnaGVpZ2h0Jywgdmlld0hlaWdodCk7XHJcblx0fVxyXG5cdGVsc2V7XHJcblx0XHRqUXVlcnkoJ2h0bWwnKS5jc3MoJ2hlaWdodCcsIHdyYXBwZXJIZWlnaHQpO1xyXG5cdFx0alF1ZXJ5KCdib2R5JykuY3NzKCdoZWlnaHQnLCB3cmFwcGVySGVpZ2h0KTtcclxuXHR9XHJcbn1cclxuXHJcbmZ1bmN0aW9uIHRvZ2dsZU5hdkNsYXNzKCkge1xuXHRpZiAobW9iaWxlTmF2T25seSA9PT0gZmFsc2Upe1xyXG5cdFx0aWYgKHZpZXdXaWR0aCA+PSAxMDI0KXtcclxuXHRcdFx0Ym9keS5jbGFzc0xpc3QuYWRkKCdkZXNrdG9wTWVudScpO1xyXG5cdFx0XHRib2R5LmNsYXNzTGlzdC5yZW1vdmUoJ21vYmlsZU1lbnUnKTtcclxuXHRcdH1cclxuXHRcdGVsc2V7XHJcblx0XHRcdGJvZHkuY2xhc3NMaXN0LnJlbW92ZSgnZGVza3RvcE1lbnUnKTtcclxuXHRcdFx0Ym9keS5jbGFzc0xpc3QuYWRkKCdtb2JpbGVNZW51Jyk7XHJcblx0XHR9XHJcblx0fVxyXG59XHJcblxyXG5mdW5jdGlvbiBtb2JpbGVNZW51SGVpZ2h0KCl7XHJcbiAgICBpZiAoIGpRdWVyeShib2R5KS5oYXNDbGFzcygnbW9iaWxlTWVudScpICl7XHJcbiAgICAgICAgalF1ZXJ5KCcubW9iaWxlTWVudSAjbmF2JykuY3NzKCdoZWlnaHQnLCB2aWV3SGVpZ2h0KTtcclxuICAgIH1cclxuICAgIGVsc2V7XHJcbiAgICAgICAgalF1ZXJ5KCcjbmF2JykuY3NzKCdoZWlnaHQnLCAnYXV0bycpO1xyXG4gICAgfVxyXG59XHJcblxyXG5mdW5jdGlvbiBhZGRNZW51T3BlbkNsYXNzKCl7IC8qQWRkIG1vYmlsZU1lbnUgY2xhc3MgdG8gYm9keSBlbGVtZW50Ki9cclxuXHRib2R5LmNsYXNzTGlzdC5yZW1vdmUoJ2Rlc2t0b3BNZW51Jyk7XHJcblx0Ym9keS5jbGFzc0xpc3QucmVtb3ZlKCdtb2JpbGVNZW51Q2xvc2VkJyk7XHJcblx0Ym9keS5jbGFzc0xpc3QuYWRkKCdtb2JpbGVNZW51T3BlbicpO1xyXG59XHJcblxyXG5mdW5jdGlvbiByZW1vdmVNZW51T3BlbkNsYXNzKCl7IC8qUmVtb3ZlcyBtb2JpbGVNZW51IGNsYXNzIGZyb20gaHRtbCBlbGVtZW50Ki9cclxuXHRib2R5LmNsYXNzTGlzdC5yZW1vdmUoJ21vYmlsZU1lbnVPcGVuJyk7XHJcblx0Ym9keS5jbGFzc0xpc3QuYWRkKCdtb2JpbGVNZW51Q2xvc2VkJyk7XHJcblx0dG9nZ2xlTmF2Q2xhc3MoKTtcclxufVxyXG5cclxuZnVuY3Rpb24gaGFzQ2xhc3MoZWxlLGNscykge1xyXG5cdHJldHVybiBlbGUuY2xhc3NOYW1lLm1hdGNoKG5ldyBSZWdFeHAoJyhcXFxcc3xeKScrY2xzKycoXFxcXHN8alF1ZXJ5KScpKTtcclxufVxyXG5cclxuZnVuY3Rpb24gYWRkQ2xhc3MoZWxlLGNscykge1xyXG5cdGlmICghaGFzQ2xhc3MoZWxlLGNscykpIHtlbGUuY2xhc3NOYW1lICs9IFwiIFwiK2Nsczt9XHJcbn1cclxuXHJcbmZ1bmN0aW9uIHJlbW92ZUNsYXNzKGVsZSxjbHMpIHtcclxuXHRpZiAoaGFzQ2xhc3MoZWxlLGNscykpIHtcclxuXHRcdHZhciByZWcgPSBuZXcgUmVnRXhwKCcoXFxcXHN8XiknK2NscysnKFxcXFxzfGpRdWVyeSknKTtcclxuXHRcdGVsZS5jbGFzc05hbWU9ZWxlLmNsYXNzTmFtZS5yZXBsYWNlKHJlZywnICcpO1xyXG5cdH1cclxufVxyXG5cclxuZnVuY3Rpb24gc2Nyb2xsTWVudUNsYXNzKCl7XHJcblx0aWYgKCBqUXVlcnkod2luZG93KS5zY3JvbGxUb3AoKSA+IDIwICkge1xyXG5cdCAgICBqUXVlcnkoJ2JvZHknKS5hZGRDbGFzcygnc2Nyb2xsTWVudScpO1xyXG5cdH1cclxuXHRlbHNlIGlmICggalF1ZXJ5KCcub3ZlcmxheUNvbnRlbnQnKS5zY3JvbGxUb3AoKSA+IDIwICkge1xyXG5cdCAgICBqUXVlcnkoJ2JvZHknKS5hZGRDbGFzcygnc2Nyb2xsTWVudScpO1xyXG5cdH1cclxuXHRlbHNle1xyXG5cdCAgICBqUXVlcnkoJ2JvZHknKS5yZW1vdmVDbGFzcygnc2Nyb2xsTWVudScpO1xyXG5cdH1cclxufVxyXG5cclxuLy9zZXQgcG9ydHJhaXQgLyBsYW5kc2NhcGUgY2xhc3NcbmZ1bmN0aW9uIHNldE9yaWVudGF0aW9uKCl7XHJcblx0aWYgKHZpZXdIZWlnaHQgPiB2aWV3V2lkdGgpIHtcclxuXHRcdGpRdWVyeSgnYm9keScpLmFkZENsYXNzKCdwb3J0cmFpdCcpO1xyXG5cdFx0alF1ZXJ5KCdib2R5JykucmVtb3ZlQ2xhc3MoJ2xhbmRzY2FwZScpO1xyXG5cdFx0cmV0dXJuIFwicG9ydHJhaXRcIjtcclxuXHR9XHJcblx0ZWxzZXtcclxuXHRcdGpRdWVyeSgnYm9keScpLmFkZENsYXNzKCdsYW5kc2NhcGUnKTtcclxuXHRcdGpRdWVyeSgnYm9keScpLnJlbW92ZUNsYXNzKCdwb3J0cmFpdCcpO1xyXG5cdFx0cmV0dXJuIFwibGFuZHNjYXBlXCI7XHJcblx0fVxyXG59XHJcbiIsImZ1bmN0aW9uIG1heEgodGFyZ2V0LCB2YWx1ZSl7XHJcblx0alF1ZXJ5KHRhcmdldCkuY3NzKCdtYXgtaGVpZ2h0JywgdmFsdWUpO1xyXG59XHJcblxyXG5mdW5jdGlvbiBtYXhXKHRhcmdldCwgdmFsdWUpe1xyXG5cdGpRdWVyeSh0YXJnZXQpLmNzcygnbWF4LXdpZHRoJywgdmFsdWUpO1xyXG59XHJcblxyXG5mdW5jdGlvbiBtaW5IKHRhcmdldCwgdmFsdWUpe1xyXG5cdGpRdWVyeSh0YXJnZXQpLmNzcygnbWluLWhlaWdodCcsIHZhbHVlKTtcclxufVxyXG5cclxuZnVuY3Rpb24gbWluVyh0YXJnZXQsIHZhbHVlKXtcclxuXHRqUXVlcnkodGFyZ2V0KS5jc3MoJ21pbi13aWR0aCcsIHZhbHVlKTtcclxufVxyXG5cclxuZnVuY3Rpb24gd2lkdGgodGFyZ2V0KXtcclxuXHRyZXR1cm4galF1ZXJ5KHRhcmdldCkud2lkdGgoKTtcclxufVxyXG5cclxuZnVuY3Rpb24gaGVpZ2h0KHRhcmdldCl7XHJcblx0cmV0dXJuIGpRdWVyeSh0YXJnZXQpLmhlaWdodCgpO1xyXG59XG5cbmZ1bmN0aW9uIGNsZWFySGVpZ2h0KHRhcmdldCl7XG4gICAgalF1ZXJ5KHRhcmdldCkuY3NzKCdtaW4taGVpZ2h0JywgJ25vbmUnKTtcbiAgICBqUXVlcnkodGFyZ2V0KS5jc3MoJ21heC1oZWlnaHQnLCAnbm9uZScpO1xuICAgIGpRdWVyeSh0YXJnZXQpLmNzcygnaGVpZ2h0JywgJ2F1dG8nKTtcbn1cblxyXG5mdW5jdGlvbiBnZXRCcmVha3BvaW50KG1vYmlsZVBvcnRyYWl0LCBtb2JpbGVMYW5kc2NhcGUsIHRhYmxldExhbmRzY2FwZSl7XHJcblxyXG4gICAgaWYodmlld1dpZHRoIDw9IG1vYmlsZVBvcnRyYWl0KXtcclxuICAgICAgICByZXR1cm4gXCJtb2JpbGVQb3J0cmFpdFwiO1xyXG4gICAgfVxyXG4gICAgZWxzZSBpZiggKHZpZXdXaWR0aCA+IG1vYmlsZVBvcnRyYWl0KSAmJiAodmlld1dpZHRoIDwgbW9iaWxlTGFuZHNjYXBlICkgKXtcclxuICAgICAgICByZXR1cm4gXCJtb2JpbGVMYW5kc2NhcGVcIjtcclxuICAgIH1cclxuICAgIGVsc2UgaWYoICh2aWV3V2lkdGggPiBtb2JpbGVMYW5kc2NhcGUpICYmICh2aWV3V2lkdGggPCB0YWJsZXRMYW5kc2NhcGUgKSApe1xyXG4gICAgICAgIHJldHVybiBcInRhYmxldFBvcnRyYWl0XCI7XHJcbiAgICB9XHJcbiAgICBlbHNleyByZXR1cm4gXCJkZXNrdG9wXCI7IH1cclxufVxyXG5cclxuZnVuY3Rpb24gbWF0Y2hIZWlnaHQoZWxlLCB0YXJnZXRIZWlnaHQpe1xyXG4gICAgdmFyIGVsZUhlaWdodDtcclxuICAgIGlmICghdGFyZ2V0SGVpZ2h0KXtcclxuXHRcdGVsZUhlaWdodCA9IHZpZXdIZWlnaHQ7XHJcblx0fVxyXG5cdGVsc2Uge1xyXG5cdFx0ZWxlSGVpZ2h0ID0gdGFyZ2V0SGVpZ2h0O1xyXG5cdH1cclxuXHRyZXR1cm4galF1ZXJ5KGVsZSkuaGVpZ2h0KGVsZUhlaWdodCk7XHJcbn1cclxuXHJcbmZ1bmN0aW9uIHdpZGVyVGhhbihtaW4sIG1heCwgdGFyZ2V0KXtcclxuXHJcblx0aWYoIXRhcmdldCl7XHJcblx0XHR0YXJnZXQgPSBqUXVlcnkod2luZG93KTtcclxuXHR9XHJcblxyXG5cdGlmIChtYXgpe1xyXG5cclxuXHRcdGlmKCAobWF4ID4gd2lkdGgodGFyZ2V0KSApICYmICggbWluIDwgd2lkdGgodGFyZ2V0KSApICl7XHJcblx0XHRcdHJldHVybiB0cnVlO1xyXG5cdFx0fVxyXG5cdH1cclxuXHRlbHNlIGlmKCBtaW4gPCB3aWR0aCh0YXJnZXQpICl7XHJcblx0XHRyZXR1cm4gdHJ1ZTtcclxuXHR9XHJcblx0ZWxzZXtcclxuXHRcdHJldHVybiBmYWxzZTtcclxuXHR9XHJcbn1cclxuXHJcbmZ1bmN0aW9uIG1heFNpemVCeUFzcCh0YXJnZXQsIG1pbkFzcCwgbWF4QXNwKXtcclxuXHRqUXVlcnkodGFyZ2V0KS5jc3MoJ21heC1oZWlnaHQnLCAnbm9uZScpO1xyXG5cdGpRdWVyeSh0YXJnZXQpLmNzcygnbWluLWhlaWdodCcsIDApO1xyXG5cclxuXHJcblx0dmFyIHRhcmdldEFzcCA9IHdpZHRoKHRhcmdldCkgLyBoZWlnaHQodGFyZ2V0KTtcclxuXHJcblx0Ly9pZiBXSURFIC8gU0hPUlQgU0xJREVcclxuXHRpZiAodGFyZ2V0QXNwID4gbWF4QXNwKXtcclxuXHRcdG1pbkgodGFyZ2V0LCB2aWV3V2lkdGggLyBtYXhBc3ApO1xyXG5cdH1cclxuXHJcblx0Ly8gaWYgVEFMTCAvIFNLSU5OWSBTTElERVxyXG5cdGlmICh0YXJnZXRBc3AgPCBtaW5Bc3Ape1xyXG5cdFx0bWF4SCh0YXJnZXQsIHZpZXdXaWR0aCAvIG1pbkFzcCApO1xyXG5cdH1cclxufVxyXG5cclxuZnVuY3Rpb24gbW92ZU9uT3JpZW50YXRpb24odGFyZ2V0LCBkZXN0aW5hdGlvbiwgbGFuZHNjYXBlLCBwb3J0cmFpdCl7XHJcblx0Ly9MQU5EU0NBUEVcclxuXHRpZih2aWV3V2lkdGg+dmlld0hlaWdodCl7XHJcblx0XHRpZihsYW5kc2NhcGUgPT0gXCJwcmVwZW5kXCIpe1xyXG5cdFx0XHRqUXVlcnkodGFyZ2V0KS5wcmVwZW5kVG8oZGVzdGluYXRpb24pO1xyXG5cdFx0fVxyXG5cdFx0aWYobGFuZHNjYXBlID09IFwiYXBwZW5kXCIpe1xyXG5cdFx0XHRqUXVlcnkodGFyZ2V0KS5hcHBlbmRUbyhkZXN0aW5hdGlvbik7XHJcblx0XHR9XHJcblx0XHRpZihsYW5kc2NhcGUgPT0gXCJhZnRlclwiKXtcclxuXHRcdFx0alF1ZXJ5KHRhcmdldCkuaW5zZXJ0QWZ0ZXIoZGVzdGluYXRpb24pO1xyXG5cdFx0fVxyXG5cdFx0aWYobGFuZHNjYXBlID09IFwiYmVmb3JlXCIpe1xyXG5cdFx0XHRqUXVlcnkodGFyZ2V0KS5pbnNlcnRCZWZvcmUoZGVzdGluYXRpb24pO1xyXG5cdFx0fVxyXG5cdH1cclxuXHQvL1BPUlRSQUlUXHJcblx0ZWxzZXtcclxuXHRcdGlmKHBvcnRyYWl0ID09IFwicHJlcGVuZFwiKSB7XHJcblx0XHRcdGpRdWVyeSh0YXJnZXQpLnByZXBlbmRUbyhkZXN0aW5hdGlvbik7XHJcblx0XHR9XHJcblx0XHRpZihwb3J0cmFpdCA9PSBcImFwcGVuZFwiKXtcclxuXHRcdFx0alF1ZXJ5KHRhcmdldCkuYXBwZW5kVG8oZGVzdGluYXRpb24pO1xyXG5cdFx0fVxyXG5cdFx0aWYocG9ydHJhaXQgPT0gXCJhZnRlclwiKXtcclxuXHRcdFx0alF1ZXJ5KHRhcmdldCkuaW5zZXJ0QWZ0ZXIoZGVzdGluYXRpb24pO1xyXG5cdFx0fVxyXG5cdFx0aWYocG9ydHJhaXQgPT0gXCJiZWZvcmVcIil7XHJcblx0XHRcdGpRdWVyeSh0YXJnZXQpLmluc2VydEJlZm9yZShkZXN0aW5hdGlvbik7XHJcblx0XHR9XHJcblx0fVxyXG59XHJcblxyXG5mdW5jdGlvbiBzZXRCZ0ltZyh0YXJnZXQsIGltYWdlLCBvcmllbnRhdGlvbil7XHJcblx0alF1ZXJ5KHRhcmdldCkuY3NzKCdiYWNrZ3JvdW5kLWltYWdlJywgJ3VybCgnICsgaW1hZ2UgKyAnKScpO1xyXG5cdGlmKG9yaWVudGF0aW9uICE9PSBcIlwiKXtcclxuXHRcdGpRdWVyeSh0YXJnZXQpLmFkZENsYXNzKG9yaWVudGF0aW9uKTtcclxuXHR9XHJcbn1cclxuXHJcbmZ1bmN0aW9uIGFzcExhYmVsKHdpZHRoLCBoZWlnaHQpe1xyXG5cclxuXHRcdGlmICggd2lkdGggLyBoZWlnaHQgPiAxLjc1ICl7XHJcblx0XHRcdHJldHVybiBcImxhbmRzY2FwZSBzaG9ydFdpZGVcIjtcclxuXHRcdH1cclxuXHJcblx0XHRlbHNlIGlmICggd2lkdGggPiBoZWlnaHQgKXtcclxuXHRcdFx0cmV0dXJuIFwibGFuZHNjYXBlXCI7XHJcblx0XHR9XHJcblxyXG5cdFx0ZWxzZSBpZiAoIHdpZHRoIC8gaGVpZ2h0IDwgMC43NSApe1xyXG5cdFx0XHRyZXR1cm4gXCJwb3J0cmFpdCB0YWxsU2tpbm55XCI7XHJcblx0XHR9XHJcblxyXG5cdFx0ZWxzZSBpZiAoIHdpZHRoIDwgaGVpZ2h0ICl7XHJcblx0XHRcdHJldHVybiBcInBvcnRyYWl0XCI7XHJcblx0XHR9XHJcblxyXG5cdFx0ZWxzZXtcclxuXHRcdFx0cmV0dXJuIFwic3F1YXJlXCI7XHJcblx0XHR9XHJcbn1cclxuXHJcbmZ1bmN0aW9uIGxhenlMb2FkUmVzb3VyY2UoZmlsZSwgdHlwZSl7XHJcblx0dmFyIGNiID0gZnVuY3Rpb24oKSB7XHJcbiAgICB2YXIgbGluaztcclxuICAgIGlmICh0eXBlID09PSBcImNzc1wiKXtcclxuXHRcdGxpbmsgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdsaW5rJyk7IGxpbmsucmVsID0gJ3N0eWxlc2hlZXQnO1xyXG5cdH1cclxuXHRlbHNlIGlmICh0eXBlID09PSBcImpzXCIpe1xyXG5cdFx0bGluayA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3NjcmlwdCcpOyBsaW5rLnR5cGUgPSAndGV4dC9qYXZhc2NyaXB0JztcclxuXHR9XHJcblxyXG5cdGxpbmsuaHJlZiA9IGZpbGU7XHJcblx0dmFyIGggPSBkb2N1bWVudC5nZXRFbGVtZW50c0J5VGFnTmFtZSgnaGVhZCcpWzBdOyBoLnBhcmVudE5vZGUuaW5zZXJ0QmVmb3JlKGwsIGgpO1xyXG5cdH07XHJcblx0dmFyIHJhZiA9IHJlcXVlc3RBbmltYXRpb25GcmFtZSB8fCBtb3pSZXF1ZXN0QW5pbWF0aW9uRnJhbWUgfHxcclxuXHR3ZWJraXRSZXF1ZXN0QW5pbWF0aW9uRnJhbWUgfHwgbXNSZXF1ZXN0QW5pbWF0aW9uRnJhbWU7XHJcblx0aWYgKHJhZikgcmFmKGNiKTtcclxuXHRlbHNlIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdsb2FkJywgY2IpO1xyXG59XHJcblxyXG5mdW5jdGlvbiBkb1JlY3Vyc2l2ZWx5KHRoaXNGbiwgaW50ZXJ2YWwsIHRpbWVvdXQpIHtcclxuICAgIHNldFRpbWVvdXQoZnVuY3Rpb24oKXtcclxuXHQgICAgaW50ZXJ2YWwgPSBpbnRlcnZhbCB8fCAgMzAwMDtcclxuXHQgICAgdGltZW91dCA9ICB0aW1lb3V0ICB8fCAzMDAwMDtcclxuXHQgICAgdmFyIHN0YXJ0VGltZSA9IChuZXcgRGF0ZSgpKS5nZXRUaW1lKCk7XHJcblxyXG5cclxuXHQgICAgKGZ1bmN0aW9uIHJpbmNlUmVwZWF0KCkge1xyXG5cdCAgICAgICAgdmFyIHRoaXNGblJlc3VsdCA9IHRoaXNGbigpO1xyXG5cclxuXHQgICAgICAgIGlmICggKERhdGUubm93KCkgLSBzdGFydFRpbWUgKSA8PSB0aW1lb3V0ICkgIHtcclxuXHQgICAgICAgICAgICBzZXRUaW1lb3V0KHJpbmNlUmVwZWF0LCBpbnRlcnZhbCwgdGhpc0ZuUmVzdWx0KTtcclxuXHQgICAgICAgIH1cclxuXHQgICAgfSkoKTtcclxuXHJcbiAgICB9LCBpbnRlcnZhbCAqIDAuNzUpO1xyXG59XHJcblxyXG5mdW5jdGlvbiBhcHBseUlzbygpe1xyXG4gICAgdmFyIHByb2plY3RzSXNvID0galF1ZXJ5KCcuaXNvLWdyaWQnKS5pc290b3BlKHtcclxuICAgICAgICBpdGVtU2VsZWN0b3I6ICcuaXNvLWdyaWQtaXRlbScsXHJcbiAgICAgICAgcmVzaXphYmxlOiB0cnVlLCAvLyBkaXNhYmxlIG5vcm1hbCByZXNpemluZ1xyXG4gICAgICAgIHBlcmNlbnRQb3NpdGlvbjogdHJ1ZSxcclxuXHJcbiAgICAgICAgYW5pbWF0aW9uRW5naW5lOiAnYmVzdC1hdmFpbGFibGUnLFxyXG4gICAgICAgIGFuaW1hdGlvbk9wdGlvbnM6IHtcclxuICAgICAgICAgICAgZHVyYXRpb246IDMwMDAsXHJcbiAgICAgICAgICAgIGVhc2luZzogJ2xpbmVhcicsXHJcbiAgICAgICAgICAgIHF1ZXVlOiBmYWxzZVxyXG4gICAgICAgIH0sXHJcbiAgICAgICAgbGF5b3V0TW9kZTogJ2ZpdFJvd3MnLFxyXG4gICAgICAgIG1hc29ucnk6e1xyXG4gICAgICAgICAgICBjb2x1bW5XaWR0aDogICAgJ2lzby1ncmlkLWl0ZW0nLFxyXG4gICAgICAgICAgICBpc0FuaW1hdGVkOiAgICAgdHJ1ZVxyXG4gICAgICAgICAgICAvL2lzRml0V2lkdGg6ICAgICB0cnVlXHJcbiAgICAgICAgfVxyXG4gICAgfSk7XHJcbn1cclxuIiwiLyohXHJcbiAqIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0gRFJBR0VORCBKUyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXHJcbiAqXHJcbiAqIFZlcnNpb246IDAuMi4wXHJcbiAqIGh0dHBzOi8vZ2l0aHViLmNvbS9TdGVyZW9iaXQvZHJhZ2VuZFxyXG4gKiBDb3B5cmlnaHQgKGMpIDIwMTQgVG9iaWFzIE90dGUsIHRAc3RlcmVvYi5pdFxyXG4gKlxyXG4gKiBMaWNlbnNlZCB1bmRlciBNSVQtc3R5bGUgbGljZW5zZTpcclxuICpcclxuICogUGVybWlzc2lvbiBpcyBoZXJlYnkgZ3JhbnRlZCwgZnJlZSBvZiBjaGFyZ2UsIHRvIGFueSBwZXJzb24gb2J0YWluaW5nIGEgY29weVxyXG4gKiBvZiB0aGlzIHNvZnR3YXJlIGFuZCBhc3NvY2lhdGVkIGRvY3VtZW50YXRpb24gZmlsZXMgKHRoZSBcIlNvZnR3YXJlXCIpLCB0byBkZWFsXHJcbiAqIGluIHRoZSBTb2Z0d2FyZSB3aXRob3V0IHJlc3RyaWN0aW9uLCBpbmNsdWRpbmcgd2l0aG91dCBsaW1pdGF0aW9uIHRoZSByaWdodHNcclxuICogdG8gdXNlLCBjb3B5LCBtb2RpZnksIG1lcmdlLCBwdWJsaXNoLCBkaXN0cmlidXRlLCBzdWJsaWNlbnNlLCBhbmQvb3Igc2VsbFxyXG4gKiBjb3BpZXMgb2YgdGhlIFNvZnR3YXJlLCBhbmQgdG8gcGVybWl0IHBlcnNvbnMgdG8gd2hvbSB0aGUgU29mdHdhcmUgaXNcclxuICogZnVybmlzaGVkIHRvIGRvIHNvLCBzdWJqZWN0IHRvIHRoZSBmb2xsb3dpbmcgY29uZGl0aW9uczpcclxuICpcclxuICogVEhFIFNPRlRXQVJFIElTIFBST1ZJREVEIFwiQVMgSVNcIiwgV0lUSE9VVCBXQVJSQU5UWSBPRiBBTlkgS0lORCwgRVhQUkVTUyBPUlxyXG4gKiBJTVBMSUVELCBJTkNMVURJTkcgQlVUIE5PVCBMSU1JVEVEIFRPIFRIRSBXQVJSQU5USUVTIE9GIE1FUkNIQU5UQUJJTElUWSxcclxuICogRklUTkVTUyBGT1IgQSBQQVJUSUNVTEFSIFBVUlBPU0UgQU5EIE5PTklORlJJTkdFTUVOVC4gSU4gTk8gRVZFTlQgU0hBTEwgVEhFXHJcbiAqIEFVVEhPUlMgT1IgQ09QWVJJR0hUIEhPTERFUlMgQkUgTElBQkxFIEZPUiBBTlkgQ0xBSU0sIERBTUFHRVMgT1IgT1RIRVJcclxuICogTElBQklMSVRZLCBXSEVUSEVSIElOIEFOIEFDVElPTiBPRiBDT05UUkFDVCwgVE9SVCBPUiBPVEhFUldJU0UsIEFSSVNJTkcgRlJPTSxcclxuICogT1VUIE9GIE9SIElOIENPTk5FQ1RJT04gV0lUSCBUSEUgU09GVFdBUkUgT1IgVEhFIFVTRSBPUiBPVEhFUiBERUFMSU5HUyBJTiBUSEVcclxuICogU09GVFdBUkUuXHJcbiAqXHJcbiAqL1xyXG5cclxuIDsoZnVuY3Rpb24oIHdpbmRvdyApIHtcclxuICBcInVzZSBzdHJpY3RcIjtcclxuXHJcbiAgLy8gaGVscCB0aGUgbWluaWZpZXJcclxuICB2YXIgZG9jID0gZG9jdW1lbnQsXHJcbiAgICAgIHdpbiA9IHdpbmRvdztcclxuXHJcbiAgZnVuY3Rpb24gaW5pdCggJCApIHtcclxuXHJcbiAgICAvLyBXZWxjb21lIFRvIGRyYWdlbmQgSlNcclxuICAgIC8vID09PT09PT09PT09PT09PT09PT09PVxyXG4gICAgLy9cclxuICAgIC8vIGRyYWdlbmQuanMgaXMgYSB0b3VjaCByZWFkeSwgZnVsbCByZXNwb25zaXZlLCBjb250ZW50IHN3aXBlIHNjcmlwdC4gSXQgaGFzIG5vIGRlcGVuZGVuY2llc1xyXG4gICAgLy8gSXQgYWxzbyBjYW4sIGJ1dCBkb24ndCBoYXMgdG8sIHVzZWQgYXMgYSBqUXVlcnlcclxuICAgIC8vIChodHRwczovL2dpdGh1Yi5jb20vanF1ZXJ5L2pxdWVyeS8pIHBsdWdpbi5cclxuICAgIC8vXHJcbiAgICAvLyBUaGUgY3VycmVudCB2ZXJzaW9uIGlzIDAuMi4wXHJcbiAgICAvL1xyXG4gICAgLy8gVXNhZ2VcclxuICAgIC8vID09PT09PT09PT09PT09PT09PT09PVxyXG4gICAgLy9cclxuICAgIC8vIFRvIGFjdGl2YXRlIGRyYWdlbmQgSlMganVzdCBjYWxsIHRoZSBmdW5jdGlvbiBvbiBhIGpRdWVyeSBlbGVtZW50XHJcbiAgICAvL1xyXG4gICAgLy8gJChcIiNzd2lwZS1jb250YWluZXJcIikuZHJhZ2VuZCgpO1xyXG4gICAgLy9cclxuICAgIC8vIFlvdSBjb3VsZCByYXRoZXIgcGFzcyBpbiBhIG9wdGlvbnMgb2JqZWN0IG9yIGEgc3RyaW5nIHRvIGJ1bXAgb24gb2YgdGhlXHJcbiAgICAvLyBmb2xsb3dpbmcgYmVoYXZpb3JzOiBcInVwXCIsIFwiZG93blwiLCBcImxlZnRcIiwgXCJyaWdodFwiIGZvciBzd2lwaW5nIGluIG9uZSBvZlxyXG4gICAgLy8gdGhlc2UgZGlyZWN0aW9ucywgXCJwYWdlXCIgd2l0aCB0aGUgcGFnZSBudW1iZXIgYXMgc2Vjb25kIGFyZ3VtZW50IHRvIGdvIHRvIGFcclxuICAgIC8vIGV4cGxpY2l0IHBhZ2UgYW5kIHdpdGhvdXQgYW55IHZhbHVlIHRvIGdvIHRvIHRoZSBmaXJzdCBwYWdlXHJcbiAgICAvL1xyXG4gICAgLy8gU2V0dGluZ3NcclxuICAgIC8vID09PT09PT09PT09PT09PT09PT09PVxyXG4gICAgLy9cclxuICAgIC8vIFlvdSBjYW4gdXNlIHRoZSBmb2xsb3dpbmcgb3B0aW9uczpcclxuICAgIC8vXHJcbiAgICAvLyAqIHBhZ2VDbGFzczogY2xhc3NuYW1lIHNlbGVjdG9yIGZvciBhbGwgZWxtZW50cyB0aGF0IHNob3VsZCBwcm92aWRlIGEgcGFnZVxyXG4gICAgLy8gKiBkaXJlY3Rpb246IFwiaG9yaXpvbnRhbFwiIG9yIFwidmVydGljYWxcIlxyXG4gICAgLy8gKiBtaW5EcmFnRGlzdGFuY2U6IG1pbnVpbXVtIGRpc3RhbmNlIChpbiBwaXhlbCkgdGhlIHVzZXIgaGFzIHRvIGRyYWdcclxuICAgIC8vICAgdG8gdHJpZ2dlciBzd2lwXHJcbiAgICAvLyAqIHNjcmliZTogcGl4ZWwgdmFsdWUgZm9yIGEgcG9zc2libGUgc2NyaWJlXHJcbiAgICAvLyAqIG9uU3dpcGVTdGFydDogY2FsbGJhY2sgZnVuY3Rpb24gYmVmb3JlIHRoZSBhbmltYXRpb25cclxuICAgIC8vICogb25Td2lwZUVuZDogY2FsbGJhY2sgZnVuY3Rpb24gYWZ0ZXIgdGhlIGFuaW1hdGlvblxyXG4gICAgLy8gKiBvbkRyYWdTdGFydDogY2FsbGVkIG9uIGRyYWcgc3RhcnRcclxuICAgIC8vICogb25EcmFnOiBjYWxsYmFjayBvbiBkcmFnXHJcbiAgICAvLyAqIG9uRHJhZ0VuZDogY2FsbGJhY2sgb24gZHJhZ2VuZFxyXG4gICAgLy8gKiBib3JkZXJCZXR3ZWVuUGFnZXM6IGlmIHlvdSBuZWVkIHNwYWNlIGJldHdlZW4gcGFnZXMgYWRkIGEgcGl4ZWwgdmFsdWVcclxuICAgIC8vICogZHVyYXRpb25cclxuICAgIC8vICogc3RvcFByb3BhZ2F0aW9uXHJcbiAgICAvLyAqIGFmdGVySW5pdGlhbGl6ZSBjYWxsZWQgYWZ0ZXIgdGhlIHBhZ2VzIGFyZSBzaXplXHJcbiAgICAvLyAqIHByZXZlbnREcmFnIGlmIHdhbnQgdG8gcHJldmVudCB1c2VyIGludGVyYWN0aW9ucyBhbmQgb25seSBzd2lwZSBtYW51YWx5XHJcblxyXG4gICAgdmFyXHJcblxyXG4gICAgICAvLyBEZWZhdWx0IHNldHRpbmdcclxuICAgICAgZGVmYXVsdFNldHRpbmdzID0ge1xyXG4gICAgICAgIHBhZ2VDbGFzcyAgICAgICAgICA6IFwiZHJhZ2VuZC1wYWdlXCIsXHJcbiAgICAgICAgZGlyZWN0aW9uICAgICAgICAgIDogXCJob3Jpem9udGFsXCIsXHJcbiAgICAgICAgbWluRHJhZ0Rpc3RhbmNlICAgIDogXCI0MFwiLFxyXG4gICAgICAgIG9uU3dpcGVTdGFydCAgICAgICA6IG5vb3AsXHJcbiAgICAgICAgb25Td2lwZUVuZCAgICAgICAgIDogbm9vcCxcclxuICAgICAgICBvbkRyYWdTdGFydCAgICAgICAgOiBub29wLFxyXG4gICAgICAgIG9uRHJhZyAgICAgICAgICAgICA6IG5vb3AsXHJcbiAgICAgICAgb25EcmFnRW5kICAgICAgICAgIDogbm9vcCxcclxuICAgICAgICBhZnRlckluaXRpYWxpemUgICAgOiBub29wLFxyXG4gICAgICAgIGtleWJvYXJkTmF2aWdhdGlvbiA6IGZhbHNlLFxyXG4gICAgICAgIHN0b3BQcm9wYWdhdGlvbiAgICA6IGZhbHNlLFxyXG4gICAgICAgIGl0ZW1zSW5QYWdlICAgICAgICA6IDEsXHJcbiAgICAgICAgc2NyaWJlICAgICAgICAgICAgIDogMCxcclxuICAgICAgICBib3JkZXJCZXR3ZWVuUGFnZXMgOiAwLFxyXG4gICAgICAgIGR1cmF0aW9uICAgICAgICAgICA6IDMwMCxcclxuICAgICAgICBwcmV2ZW50RHJhZyAgICAgICAgOiBmYWxzZVxyXG4gICAgICB9LFxyXG5cclxuICAgICAgaXNUb3VjaCA9ICdvbnRvdWNoc3RhcnQnIGluIHdpbixcclxuXHJcbiAgICAgIHN0YXJ0RXZlbnQgPSBpc1RvdWNoID8gJ3RvdWNoc3RhcnQnIDogJ21vdXNlZG93bicsXHJcbiAgICAgIG1vdmVFdmVudCA9IGlzVG91Y2ggPyAndG91Y2htb3ZlJyA6ICdtb3VzZW1vdmUnLFxyXG4gICAgICBlbmRFdmVudCA9IGlzVG91Y2ggPyAndG91Y2hlbmQnIDogJ21vdXNldXAnLFxyXG5cclxuICAgICAga2V5Y29kZXMgPSB7XHJcbiAgICAgICAgMzc6IFwibGVmdFwiLFxyXG4gICAgICAgIDM4OiBcInVwXCIsXHJcbiAgICAgICAgMzk6IFwicmlnaHRcIixcclxuICAgICAgICA0MDogXCJkb3duXCJcclxuICAgICAgfSxcclxuXHJcbiAgICAgIGVycm9ycyA9IHtcclxuICAgICAgICBwYWdlczogXCJObyBwYWdlcyBmb3VuZFwiXHJcbiAgICAgIH0sXHJcblxyXG4gICAgICBjb250YWluZXJTdHlsZXMgPSB7XHJcbiAgICAgICAgb3ZlcmZsb3c6IFwiaGlkZGVuXCIsXHJcbiAgICAgICAgcGFkZGluZyA6IDBcclxuICAgICAgfSxcclxuXHJcbiAgICAgIHN1cHBvcnRzID0gKGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICB2YXIgZGl2ID0gZG9jLmNyZWF0ZUVsZW1lbnQoJ2RpdicpLFxyXG4gICAgICAgICAgICAgdmVuZG9ycyA9ICdLaHRtbCBNcyBPIE1veiBXZWJraXQnLnNwbGl0KCcgJyksXHJcbiAgICAgICAgICAgICBsZW4gPSB2ZW5kb3JzLmxlbmd0aDtcclxuXHJcbiAgICAgICAgIHJldHVybiBmdW5jdGlvbiggcHJvcCApIHtcclxuICAgICAgICAgICAgaWYgKCBwcm9wIGluIGRpdi5zdHlsZSApIHJldHVybiB0cnVlO1xyXG5cclxuICAgICAgICAgICAgcHJvcCA9IHByb3AucmVwbGFjZSgvXlthLXpdLywgZnVuY3Rpb24odmFsKSB7XHJcbiAgICAgICAgICAgICAgIHJldHVybiB2YWwudG9VcHBlckNhc2UoKTtcclxuICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICAgICB3aGlsZSggbGVuLS0gKSB7XHJcbiAgICAgICAgICAgICAgIGlmICggdmVuZG9yc1tsZW5dICsgcHJvcCBpbiBkaXYuc3R5bGUgKSB7XHJcbiAgICAgICAgICAgICAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgICAgICB9O1xyXG4gICAgICB9KSgpLFxyXG5cclxuICAgICAgc3VwcG9ydFRyYW5zZm9ybSA9IHN1cHBvcnRzKCd0cmFuc2Zvcm0nKTtcclxuXHJcbiAgICBmdW5jdGlvbiBub29wKCkge31cclxuXHJcbiAgICBmdW5jdGlvbiBmYWxzZUZuKCkge1xyXG4gICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICB9XHJcblxyXG4gICAgZnVuY3Rpb24gc2V0U3R5bGVzKCBlbGVtZW50LCBzdHlsZXMgKSB7XHJcblxyXG4gICAgICB2YXIgcHJvcGVydHksXHJcbiAgICAgICAgICB2YWx1ZTtcclxuXHJcbiAgICAgIGZvciAoIHByb3BlcnR5IGluIHN0eWxlcyApIHtcclxuXHJcbiAgICAgICAgaWYgKCBzdHlsZXMuaGFzT3duUHJvcGVydHkocHJvcGVydHkpICkge1xyXG4gICAgICAgICAgdmFsdWUgPSBzdHlsZXNbcHJvcGVydHldO1xyXG5cclxuICAgICAgICAgIHN3aXRjaCAoIHByb3BlcnR5ICkge1xyXG4gICAgICAgICAgICBjYXNlIFwiaGVpZ2h0XCI6XHJcbiAgICAgICAgICAgIGNhc2UgXCJ3aWR0aFwiOlxyXG4gICAgICAgICAgICBjYXNlIFwibWFyZ2luTGVmdFwiOlxyXG4gICAgICAgICAgICBjYXNlIFwibWFyZ2luVG9wXCI6XHJcbiAgICAgICAgICAgICAgdmFsdWUgKz0gXCJweFwiO1xyXG4gICAgICAgICAgfVxyXG5cclxuICAgICAgICAgIGVsZW1lbnQuc3R5bGVbcHJvcGVydHldID0gdmFsdWU7XHJcblxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgIH1cclxuXHJcbiAgICAgIHJldHVybiBlbGVtZW50O1xyXG5cclxuICAgIH1cclxuXHJcbiAgICBmdW5jdGlvbiBleHRlbmQoIGRlc3RpbmF0aW9uLCBzb3VyY2UgKSB7XHJcblxyXG4gICAgICB2YXIgcHJvcGVydHk7XHJcblxyXG4gICAgICBmb3IgKCBwcm9wZXJ0eSBpbiBzb3VyY2UgKSB7XHJcbiAgICAgICAgZGVzdGluYXRpb25bcHJvcGVydHldID0gc291cmNlW3Byb3BlcnR5XTtcclxuICAgICAgfVxyXG5cclxuICAgICAgcmV0dXJuIGRlc3RpbmF0aW9uO1xyXG5cclxuICAgIH1cclxuXHJcbiAgICBmdW5jdGlvbiBwcm94eSggZm4sIGNvbnRleHQgKSB7XHJcblxyXG4gICAgICByZXR1cm4gZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgcmV0dXJuIGZuLmFwcGx5KCBjb250ZXh0LCBBcnJheS5wcm90b3R5cGUuc2xpY2UuY2FsbChhcmd1bWVudHMpICk7XHJcbiAgICAgIH07XHJcblxyXG4gICAgfVxyXG5cclxuICAgIGZ1bmN0aW9uIGdldEVsZW1lbnRzQnlDbGFzc05hbWUoIGNsYXNzTmFtZSwgcm9vdCApIHtcclxuICAgICAgdmFyIGVsZW1lbnRzO1xyXG5cclxuICAgICAgaWYgKCAkICkge1xyXG4gICAgICAgIGVsZW1lbnRzID0gJChyb290KS5maW5kKFwiLlwiICsgY2xhc3NOYW1lKTtcclxuICAgICAgfSBlbHNlIHtcclxuICAgICAgICBlbGVtZW50cyA9IEFycmF5LnByb3RvdHlwZS5zbGljZS5jYWxsKHJvb3QuZ2V0RWxlbWVudHNCeUNsYXNzTmFtZSggY2xhc3NOYW1lICkpO1xyXG4gICAgICB9XHJcblxyXG4gICAgICByZXR1cm4gZWxlbWVudHM7XHJcbiAgICB9XHJcblxyXG4gICAgZnVuY3Rpb24gYW5pbWF0ZSggZWxlbWVudCwgcHJvcGVyeSwgdG8sIHNwZWVkLCBjYWxsYmFjayApIHtcclxuICAgICAgdmFyIHByb3BlcnR5T2JqID0ge307XHJcblxyXG4gICAgICBwcm9wZXJ0eU9ialtwcm9wZXJ5XSA9IHRvO1xyXG5cclxuICAgICAgaWYgKCQpIHtcclxuICAgICAgICAkKGVsZW1lbnQpLmFuaW1hdGUocHJvcGVydHlPYmosIHNwZWVkLCBjYWxsYmFjayk7XHJcbiAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgc2V0U3R5bGVzKGVsZW1lbnQsIHByb3BlcnR5T2JqKTtcclxuICAgICAgfVxyXG5cclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIFJldHVybnMgYW4gb2JqZWN0IGNvbnRhaW5pbmcgdGhlIGNvLW9yZGluYXRlcyBmb3IgdGhlIGV2ZW50LCBub3JtYWxpc2luZyBmb3IgdG91Y2ggLyBub24tdG91Y2guXHJcbiAgICAgKiBAcGFyYW0ge09iamVjdH0gZXZlbnRcclxuICAgICAqIEByZXR1cm5zIHtPYmplY3R9XHJcbiAgICAgKi9cclxuICAgIGZ1bmN0aW9uIGdldENvb3JkcyhldmVudCkge1xyXG4gICAgICAvLyB0b3VjaCBtb3ZlIGFuZCB0b3VjaCBlbmQgaGF2ZSBkaWZmZXJlbnQgdG91Y2ggZGF0YVxyXG4gICAgICB2YXIgdG91Y2hlcyA9IGV2ZW50LnRvdWNoZXMsXHJcbiAgICAgICAgICBkYXRhID0gdG91Y2hlcyAmJiB0b3VjaGVzLmxlbmd0aCA/IHRvdWNoZXMgOiBldmVudC5jaGFuZ2VkVG91Y2hlcztcclxuXHJcbiAgICAgIHJldHVybiB7XHJcbiAgICAgICAgeDogaXNUb3VjaCA/IGRhdGFbMF0ucGFnZVggOiBldmVudC5wYWdlWCxcclxuICAgICAgICB5OiBpc1RvdWNoID8gZGF0YVswXS5wYWdlWSA6IGV2ZW50LnBhZ2VZXHJcbiAgICAgIH07XHJcbiAgICB9XHJcblxyXG4gICAgZnVuY3Rpb24gRHJhZ2VuZCggY29udGFpbmVyLCBzZXR0aW5ncyApIHtcclxuICAgICAgdmFyIGRlZmF1bHRTZXR0aW5nc0NvcHkgPSBleHRlbmQoIHt9LCBkZWZhdWx0U2V0dGluZ3MgKTtcclxuXHJcbiAgICAgIHRoaXMuc2V0dGluZ3MgICAgICA9IGV4dGVuZCggZGVmYXVsdFNldHRpbmdzQ29weSwgc2V0dGluZ3MgKTtcclxuICAgICAgdGhpcy5jb250YWluZXIgICAgID0gY29udGFpbmVyO1xyXG4gICAgICB0aGlzLnBhZ2VDb250YWluZXIgPSBkb2MuY3JlYXRlRWxlbWVudCggXCJkaXZcIiApO1xyXG4gICAgICB0aGlzLnNjcm9sbEJvcmRlciAgPSB7IHg6IDAsIHk6IDAgfTtcclxuICAgICAgdGhpcy5wYWdlICAgICAgICAgID0gMDtcclxuICAgICAgdGhpcy5wcmV2ZW50U2Nyb2xsID0gZmFsc2U7XHJcbiAgICAgIHRoaXMucGFnZUNzc1Byb3BlcnRpZXMgPSB7XHJcbiAgICAgICAgbWFyZ2luOiAwXHJcbiAgICAgIH07XHJcblxyXG4gICAgICAvLyBiaW5kIGV2ZW50c1xyXG4gICAgICB0aGlzLl9vblN0YXJ0ID0gcHJveHkoIHRoaXMuX29uU3RhcnQsIHRoaXMgKTtcclxuICAgICAgdGhpcy5fb25Nb3ZlID0gcHJveHkoIHRoaXMuX29uTW92ZSwgdGhpcyApO1xyXG4gICAgICB0aGlzLl9vbkVuZCA9IHByb3h5KCB0aGlzLl9vbkVuZCwgdGhpcyApO1xyXG4gICAgICB0aGlzLl9vbktleWRvd24gPSBwcm94eSggdGhpcy5fb25LZXlkb3duLCB0aGlzICk7XHJcbiAgICAgIHRoaXMuX3NpemVQYWdlcyA9IHByb3h5KCB0aGlzLl9zaXplUGFnZXMsIHRoaXMgKTtcclxuICAgICAgdGhpcy5fYWZ0ZXJTY3JvbGxUcmFuc2Zvcm0gPSBwcm94eSh0aGlzLl9hZnRlclNjcm9sbFRyYW5zZm9ybSwgdGhpcyk7XHJcblxyXG4gICAgICB0aGlzLnBhZ2VDb250YWluZXIuaW5uZXJIVE1MID0gY29udGFpbmVyLmNsb25lTm9kZSh0cnVlKS5pbm5lckhUTUw7XHJcbiAgICAgIGNvbnRhaW5lci5pbm5lckhUTUwgPSBcIlwiO1xyXG4gICAgICBjb250YWluZXIuYXBwZW5kQ2hpbGQoIHRoaXMucGFnZUNvbnRhaW5lciApO1xyXG5cclxuICAgICAgdGhpcy5fc2Nyb2xsID0gc3VwcG9ydFRyYW5zZm9ybSA/IHRoaXMuX3Njcm9sbFdpdGhUcmFuc2Zvcm0gOiB0aGlzLl9zY3JvbGxXaXRob3V0VHJhbnNmb3JtO1xyXG4gICAgICB0aGlzLl9hbmltYXRlU2Nyb2xsID0gc3VwcG9ydFRyYW5zZm9ybSA/IHRoaXMuX2FuaW1hdGVTY3JvbGxXaXRoVHJhbnNmb3JtIDogdGhpcy5fYW5pbWF0ZVNjcm9sbFdpdGhvdXRUcmFuc2Zvcm07XHJcblxyXG4gICAgICAvLyBJbml0aWFsaXphdGlvblxyXG5cclxuICAgICAgc2V0U3R5bGVzKGNvbnRhaW5lciwgY29udGFpbmVyU3R5bGVzKTtcclxuXHJcbiAgICAgIC8vIEdpdmUgdGhlIERPTSBzb21lIHRpbWUgdG8gdXBkYXRlIC4uLlxyXG4gICAgICBzZXRUaW1lb3V0KCBwcm94eShmdW5jdGlvbigpIHtcclxuICAgICAgICAgIHRoaXMudXBkYXRlSW5zdGFuY2UoIHNldHRpbmdzICk7XHJcbiAgICAgICAgICBpZiAoIXRoaXMuc2V0dGluZ3MucHJldmVudERyYWcpIHtcclxuICAgICAgICAgICAgdGhpcy5fb2JzZXJ2ZSgpO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgICAgdGhpcy5zZXR0aW5ncy5hZnRlckluaXRpYWxpemUuY2FsbCh0aGlzKTtcclxuICAgICAgfSwgdGhpcyksIDEwICk7XHJcblxyXG4gICAgfVxyXG5cclxuICAgIGZ1bmN0aW9uIGFkZEV2ZW50TGlzdGVuZXIoY29udGFpbmVyLCBldmVudCwgY2FsbGJhY2spIHtcclxuICAgICAgaWYgKCQpIHtcclxuICAgICAgICAkKGNvbnRhaW5lcikub24oZXZlbnQsIGNhbGxiYWNrKTtcclxuICAgICAgfSBlbHNlIHtcclxuICAgICAgICBjb250YWluZXIuYWRkRXZlbnRMaXN0ZW5lcihldmVudCwgY2FsbGJhY2ssIGZhbHNlKTtcclxuICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIGZ1bmN0aW9uIHJlbW92ZUV2ZW50TGlzdGVuZXIoY29udGFpbmVyLCBldmVudCwgY2FsbGJhY2spIHtcclxuICAgICAgaWYgKCQpIHtcclxuICAgICAgICAkKGNvbnRhaW5lcikub2ZmKGV2ZW50LCBjYWxsYmFjayk7XHJcbiAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgY29udGFpbmVyLnJlbW92ZUV2ZW50TGlzdGVuZXIoZXZlbnQsIGNhbGxiYWNrLCBmYWxzZSk7XHJcbiAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBleHRlbmQoRHJhZ2VuZC5wcm90b3R5cGUsIHtcclxuXHJcbiAgICAgIC8vIFByaXZhdGUgZnVuY3Rpb25zXHJcbiAgICAgIC8vID09PT09PT09PT09PT09PT09XHJcblxyXG4gICAgICAvLyAjIyMgT3ZlcnNjcm9sbCBsb29rdXAgdGFibGVcclxuICAgICAgLy9cclxuICAgICAgLy8gQ2hlY2tzIGlmIGl0cyB0aGUgbGFzdCBvciBmaXJzdCBwYWdlIHRvIHNsb3cgZG93biB0aGUgc2Nyb2xsaW5nIGlmIHNvXHJcbiAgICAgIC8vXHJcbiAgICAgIC8vIFRha2VzOlxyXG4gICAgICAvLyBEcmFnIGV2ZW50XHJcblxyXG4gICAgICBfY2hlY2tPdmVyc2Nyb2xsOiBmdW5jdGlvbiggZGlyZWN0aW9uLCB4LCB5ICkge1xyXG4gICAgICAgIHZhciBjb29yZGluYXRlcyA9IHtcclxuICAgICAgICAgIHg6IHgsXHJcbiAgICAgICAgICB5OiB5LFxyXG4gICAgICAgICAgb3ZlcnNjcm9sbDogdHJ1ZVxyXG4gICAgICAgIH07XHJcblxyXG4gICAgICAgIHN3aXRjaCAoIGRpcmVjdGlvbiApIHtcclxuXHJcbiAgICAgICAgICBjYXNlIFwicmlnaHRcIjpcclxuICAgICAgICAgICAgaWYgKCAhdGhpcy5zY3JvbGxCb3JkZXIueCApIHtcclxuICAgICAgICAgICAgICBjb29yZGluYXRlcy54ID0gTWF0aC5yb3VuZCgoeCAtIHRoaXMuc2Nyb2xsQm9yZGVyLngpIC8gNSApO1xyXG4gICAgICAgICAgICAgIHJldHVybiBjb29yZGluYXRlcztcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBicmVhaztcclxuXHJcbiAgICAgICAgICBjYXNlIFwibGVmdFwiOlxyXG4gICAgICAgICAgICBpZiAoICh0aGlzLnBhZ2VzQ291bnQgLSAxKSAqIHRoaXMucGFnZURpbWVudGlvbnMud2lkdGggPD0gdGhpcy5zY3JvbGxCb3JkZXIueCApIHtcclxuICAgICAgICAgICAgICBjb29yZGluYXRlcy54ID0gTWF0aC5yb3VuZCggLSAoKE1hdGguY2VpbCh0aGlzLnBhZ2VzQ291bnQpIC0gMSkgKiAodGhpcy5wYWdlRGltZW50aW9ucy53aWR0aCArIHRoaXMuc2V0dGluZ3MuYm9yZGVyQmV0d2VlblBhZ2VzKSkgKyB4IC8gNSApO1xyXG4gICAgICAgICAgICAgIHJldHVybiBjb29yZGluYXRlcztcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBicmVhaztcclxuXHJcbiAgICAgICAgICBjYXNlIFwiZG93blwiOlxyXG4gICAgICAgICAgICBpZiAoICF0aGlzLnNjcm9sbEJvcmRlci55ICkge1xyXG4gICAgICAgICAgICAgIGNvb3JkaW5hdGVzLnkgPSBNYXRoLnJvdW5kKCAoeSAtIHRoaXMuc2Nyb2xsQm9yZGVyLnkpIC8gNSApO1xyXG4gICAgICAgICAgICAgIHJldHVybiBjb29yZGluYXRlcztcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBicmVhaztcclxuXHJcbiAgICAgICAgICBjYXNlIFwidXBcIjpcclxuICAgICAgICAgICAgaWYgKCAodGhpcy5wYWdlc0NvdW50IC0gMSkgKiB0aGlzLnBhZ2VEaW1lbnRpb25zLmhlaWdodCA8PSB0aGlzLnNjcm9sbEJvcmRlci55ICkge1xyXG4gICAgICAgICAgICAgIGNvb3JkaW5hdGVzLnkgPSBNYXRoLnJvdW5kKCAtICgoTWF0aC5jZWlsKHRoaXMucGFnZXNDb3VudCkgLSAxKSAqICh0aGlzLnBhZ2VEaW1lbnRpb25zLmhlaWdodCArIHRoaXMuc2V0dGluZ3MuYm9yZGVyQmV0d2VlblBhZ2VzKSkgKyB5IC8gNSApO1xyXG4gICAgICAgICAgICAgIHJldHVybiBjb29yZGluYXRlcztcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBicmVhaztcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHJldHVybiB7XHJcbiAgICAgICAgICB4OiB4IC0gdGhpcy5zY3JvbGxCb3JkZXIueCxcclxuICAgICAgICAgIHk6IHkgLSB0aGlzLnNjcm9sbEJvcmRlci55LFxyXG4gICAgICAgICAgb3ZlcnNjcm9sbDogZmFsc2VcclxuICAgICAgICB9O1xyXG4gICAgICB9LFxyXG5cclxuICAgICAgLy8gT2JzZXJ2ZVxyXG4gICAgICAvL1xyXG4gICAgICAvLyBTZXRzIHRoZSBvYnNlcnZlcnMgZm9yIGRyYWcsIHJlc2l6ZSBhbmQga2V5IGV2ZW50c1xyXG5cclxuICAgICAgX29ic2VydmU6IGZ1bmN0aW9uKCkge1xyXG5cclxuICAgICAgICBhZGRFdmVudExpc3RlbmVyKHRoaXMuY29udGFpbmVyLCBzdGFydEV2ZW50LCB0aGlzLl9vblN0YXJ0KTtcclxuICAgICAgICB0aGlzLmNvbnRhaW5lci5vbnNlbGVjdHN0YXJ0ID0gZmFsc2VGbjtcclxuICAgICAgICB0aGlzLmNvbnRhaW5lci5vbmRyYWdzdGFydCA9IGZhbHNlRm47XHJcblxyXG4gICAgICAgIGlmICggdGhpcy5zZXR0aW5ncy5rZXlib2FyZE5hdmlnYXRpb24gKSB7XHJcbiAgICAgICAgICBhZGRFdmVudExpc3RlbmVyKGRvYy5ib2R5LCBcImtleWRvd25cIiwgdGhpcy5fb25LZXlkb3duKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGFkZEV2ZW50TGlzdGVuZXIod2luLCBcInJlc2l6ZVwiLCB0aGlzLl9zaXplUGFnZXMpO1xyXG5cclxuICAgICAgfSxcclxuXHJcblxyXG4gICAgICBfb25TdGFydDogZnVuY3Rpb24oZXZlbnQpIHtcclxuXHJcbiAgICAgICAgZXZlbnQgPSBldmVudC5vcmlnaW5hbEV2ZW50IHx8IGV2ZW50O1xyXG5cclxuICAgICAgICBpZiAodGhpcy5zZXR0aW5ncy5zdG9wUHJvcGFnYXRpb24pIHtcclxuICAgICAgICAgIGV2ZW50LnN0b3BQcm9wYWdhdGlvbigpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgYWRkRXZlbnRMaXN0ZW5lcihkb2MuYm9keSwgbW92ZUV2ZW50LCB0aGlzLl9vbk1vdmUpO1xyXG4gICAgICAgIGFkZEV2ZW50TGlzdGVuZXIoZG9jLmJvZHksIGVuZEV2ZW50LCB0aGlzLl9vbkVuZCk7XHJcblxyXG4gICAgICAgIHRoaXMuc3RhcnRDb29yZHMgPSBnZXRDb29yZHMoZXZlbnQpO1xyXG5cclxuICAgICAgICB0aGlzLnNldHRpbmdzLm9uRHJhZ1N0YXJ0LmNhbGwoIHRoaXMsIGV2ZW50ICk7XHJcblxyXG4gICAgICB9LFxyXG5cclxuICAgICAgX29uTW92ZTogZnVuY3Rpb24oIGV2ZW50ICkge1xyXG5cclxuICAgICAgICBldmVudCA9IGV2ZW50Lm9yaWdpbmFsRXZlbnQgfHwgZXZlbnQ7XHJcblxyXG4gICAgICAgIC8vIGVuc3VyZSBzd2lwaW5nIHdpdGggb25lIHRvdWNoIGFuZCBub3QgcGluY2hpbmdcclxuICAgICAgICBpZiAoIGV2ZW50LnRvdWNoZXMgJiYgZXZlbnQudG91Y2hlcy5sZW5ndGggPiAxIHx8IGV2ZW50LnNjYWxlICYmIGV2ZW50LnNjYWxlICE9PSAxKSByZXR1cm47XHJcblxyXG4gICAgICAgICAgICAvL0hBQ0sgLSBOYXRoYW5cclxuICAgICAgICAgICAgdmFyIGNvb3JkcyA9IGdldENvb3JkcyhldmVudCksXHJcbiAgICAgICAgICAgIHggPSB0aGlzLnN0YXJ0Q29vcmRzLnggLSBjb29yZHMueCxcclxuICAgICAgICAgICAgeSA9IHRoaXMuc3RhcnRDb29yZHMueSAtIGNvb3Jkcy55O1xyXG5cclxuICAgICAgICAgICAgaWYgKE1hdGguYWJzKHkpID4gTWF0aC5hYnMoeCkpIHJldHVybjtcclxuICAgICAgICBcclxuICAgICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xyXG4gICAgICAgIGlmICh0aGlzLnNldHRpbmdzLnN0b3BQcm9wYWdhdGlvbikge1xyXG4gICAgICAgICAgZXZlbnQuc3RvcFByb3BhZ2F0aW9uKCk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICB2YXIgcGFyc2VkRXZlbnQgPSB0aGlzLl9wYXJzZUV2ZW50KGV2ZW50KSxcclxuICAgICAgICAgICAgY29vcmRpbmF0ZXMgPSB0aGlzLl9jaGVja092ZXJzY3JvbGwoIHBhcnNlZEV2ZW50LmRpcmVjdGlvbiAsIC0gcGFyc2VkRXZlbnQuZGlzdGFuY2VYLCAtIHBhcnNlZEV2ZW50LmRpc3RhbmNlWSApO1xyXG5cclxuICAgICAgICB0aGlzLnNldHRpbmdzLm9uRHJhZy5jYWxsKCB0aGlzLCB0aGlzLmFjdGl2ZUVsZW1lbnQsIHBhcnNlZEV2ZW50LCBjb29yZGluYXRlcy5vdmVyc2Nyb2xsLCBldmVudCApO1xyXG5cclxuICAgICAgICBpZiAoICF0aGlzLnByZXZlbnRTY3JvbGwgKSB7XHJcbiAgICAgICAgICB0aGlzLl9zY3JvbGwoIGNvb3JkaW5hdGVzICk7XHJcbiAgICAgICAgfVxyXG4gICAgICB9LFxyXG5cclxuICAgICAgX29uRW5kOiBmdW5jdGlvbiggZXZlbnQgKSB7XHJcblxyXG4gICAgICAgIGV2ZW50ID0gZXZlbnQub3JpZ2luYWxFdmVudCB8fCBldmVudDtcclxuXHJcbiAgICAgICAgaWYgKHRoaXMuc2V0dGluZ3Muc3RvcFByb3BhZ2F0aW9uKSB7XHJcbiAgICAgICAgICBldmVudC5zdG9wUHJvcGFnYXRpb24oKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHZhciBwYXJzZWRFdmVudCA9IHRoaXMuX3BhcnNlRXZlbnQoZXZlbnQpO1xyXG5cclxuICAgICAgICB0aGlzLnN0YXJ0Q29vcmRzID0geyB4OiAwLCB5OiAwIH07XHJcblxyXG4gICAgICAgIGlmICggTWF0aC5hYnMocGFyc2VkRXZlbnQuZGlzdGFuY2VYKSA+IHRoaXMuc2V0dGluZ3MubWluRHJhZ0Rpc3RhbmNlIHx8IE1hdGguYWJzKHBhcnNlZEV2ZW50LmRpc3RhbmNlWSkgPiB0aGlzLnNldHRpbmdzLm1pbkRyYWdEaXN0YW5jZSkge1xyXG4gICAgICAgICAgdGhpcy5zd2lwZSggcGFyc2VkRXZlbnQuZGlyZWN0aW9uICk7XHJcbiAgICAgICAgfSBlbHNlIGlmIChwYXJzZWRFdmVudC5kaXN0YW5jZVggPiAwIHx8IHBhcnNlZEV2ZW50LmRpc3RhbmNlWCA+IDApIHtcclxuICAgICAgICAgIHRoaXMuX3Njcm9sbFRvUGFnZSgpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgdGhpcy5zZXR0aW5ncy5vbkRyYWdFbmQuY2FsbCggdGhpcywgdGhpcy5jb250YWluZXIsIHRoaXMuYWN0aXZlRWxlbWVudCwgdGhpcy5wYWdlLCBldmVudCApO1xyXG5cclxuICAgICAgICByZW1vdmVFdmVudExpc3RlbmVyKGRvYy5ib2R5LCBtb3ZlRXZlbnQsIHRoaXMuX29uTW92ZSk7XHJcbiAgICAgICAgcmVtb3ZlRXZlbnRMaXN0ZW5lcihkb2MuYm9keSwgZW5kRXZlbnQsIHRoaXMuX29uRW5kKTtcclxuXHJcbiAgICAgIH0sXHJcblxyXG4gICAgICBfcGFyc2VFdmVudDogZnVuY3Rpb24oIGV2ZW50ICkge1xyXG4gICAgICAgIHZhciBjb29yZHMgPSBnZXRDb29yZHMoZXZlbnQpLFxyXG4gICAgICAgICAgICB4ID0gdGhpcy5zdGFydENvb3Jkcy54IC0gY29vcmRzLngsXHJcbiAgICAgICAgICAgIHkgPSB0aGlzLnN0YXJ0Q29vcmRzLnkgLSBjb29yZHMueTtcclxuXHJcbiAgICAgICAgcmV0dXJuIHRoaXMuX2FkZERpc3RhbmNlVmFsdWVzKCB4LCB5ICk7XHJcbiAgICAgIH0sXHJcblxyXG4gICAgICBfYWRkRGlzdGFuY2VWYWx1ZXM6IGZ1bmN0aW9uKCB4LCB5ICkge1xyXG4gICAgICAgIHZhciBldmVudERhdGEgPSB7XHJcbiAgICAgICAgICBkaXN0YW5jZVg6IDAsXHJcbiAgICAgICAgICBkaXN0YW5jZVk6IDBcclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICBpZiAoIHRoaXMuc2V0dGluZ3MuZGlyZWN0aW9uID09PSBcImhvcml6b250YWxcIiApIHtcclxuICAgICAgICAgIGV2ZW50RGF0YS5kaXN0YW5jZVggPSB4O1xyXG4gICAgICAgICAgZXZlbnREYXRhLmRpcmVjdGlvbiA9IHggPiAwID8gXCJsZWZ0XCIgOiBcInJpZ2h0XCI7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgIGV2ZW50RGF0YS5kaXN0YW5jZVkgPSB5O1xyXG4gICAgICAgICAgZXZlbnREYXRhLmRpcmVjdGlvbiA9IHkgPiAwID8gXCJ1cFwiIDogXCJkb3duXCI7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICByZXR1cm4gZXZlbnREYXRhO1xyXG4gICAgICB9LFxyXG5cclxuICAgICAgX29uS2V5ZG93bjogZnVuY3Rpb24oIGV2ZW50ICkge1xyXG4gICAgICAgIHZhciBkaXJlY3Rpb24gPSBrZXljb2Rlc1tldmVudC5rZXlDb2RlXTtcclxuXHJcbiAgICAgICAgaWYgKCBkaXJlY3Rpb24gKSB7XHJcbiAgICAgICAgICB0aGlzLl9zY3JvbGxUb1BhZ2UoZGlyZWN0aW9uKTtcclxuICAgICAgICB9XHJcbiAgICAgIH0sXHJcblxyXG4gICAgICBfc2V0SG9yaXpvbnRhbENvbnRhaW5lckNzc1ZhbHVlczogZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgZXh0ZW5kKCB0aGlzLnBhZ2VDc3NQcm9wZXJ0aWVzLCB7XHJcbiAgICAgICAgICBcImNzc0Zsb2F0XCIgOiBcImxlZnRcIixcclxuICAgICAgICAgIFwib3ZlcmZsb3dZXCI6IFwiYXV0b1wiLFxyXG4gICAgICAgICAgXCJvdmVyZmxvd1hcIjogXCJoaWRkZW5cIixcclxuICAgICAgICAgIFwicGFkZGluZ1wiICA6IDAsXHJcbiAgICAgICAgICBcImRpc3BsYXlcIiAgOiBcImJsb2NrXCJcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgc2V0U3R5bGVzKHRoaXMucGFnZUNvbnRhaW5lciwge1xyXG4gICAgICAgICAgXCJvdmVyZmxvd1wiICAgICAgICAgICAgICAgICAgIDogXCJoaWRkZW5cIixcclxuICAgICAgICAgIFwid2lkdGhcIiAgICAgICAgICAgICAgICAgICAgICA6ICh0aGlzLnBhZ2VEaW1lbnRpb25zLndpZHRoICsgdGhpcy5zZXR0aW5ncy5ib3JkZXJCZXR3ZWVuUGFnZXMpICogdGhpcy5wYWdlc0NvdW50LFxyXG4gICAgICAgICAgXCJib3hTaXppbmdcIiAgICAgICAgICAgICAgICAgIDogXCJjb250ZW50LWJveFwiLFxyXG4gICAgICAgICAgXCItd2Via2l0LWJhY2tmYWNlLXZpc2liaWxpdHlcIjogXCJoaWRkZW5cIixcclxuICAgICAgICAgIFwiLXdlYmtpdC1wZXJzcGVjdGl2ZVwiICAgICAgICA6IDEwMDAsXHJcbiAgICAgICAgICBcIm1hcmdpblwiICAgICAgICAgICAgICAgICAgICAgOiAwLFxyXG4gICAgICAgICAgXCJwYWRkaW5nXCIgICAgICAgICAgICAgICAgICAgIDogMFxyXG4gICAgICAgIH0pO1xyXG4gICAgICB9LFxyXG5cclxuICAgICAgX3NldFZlcnRpY2FsQ29udGFpbmVyQ3NzVmFsdWVzOiBmdW5jdGlvbigpIHtcclxuICAgICAgICBleHRlbmQoIHRoaXMucGFnZUNzc1Byb3BlcnRpZXMsIHtcclxuICAgICAgICAgIFwib3ZlcmZsb3dcIjogXCJoaWRkZW5cIixcclxuICAgICAgICAgIFwicGFkZGluZ1wiIDogMCxcclxuICAgICAgICAgIFwiZGlzcGxheVwiIDogXCJibG9ja1wiXHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIHNldFN0eWxlcyh0aGlzLnBhZ2VDb250YWluZXIsIHtcclxuICAgICAgICAgIFwicGFkZGluZy1ib3R0b21cIiAgICAgICAgICAgICAgOiB0aGlzLnNldHRpbmdzLnNjcmliZSxcclxuICAgICAgICAgIFwiYm94U2l6aW5nXCIgICAgICAgICAgICAgICAgICAgOiBcImNvbnRlbnQtYm94XCIsXHJcbiAgICAgICAgICBcIi13ZWJraXQtYmFja2ZhY2UtdmlzaWJpbGl0eVwiIDogXCJoaWRkZW5cIixcclxuICAgICAgICAgIFwiLXdlYmtpdC1wZXJzcGVjdGl2ZVwiICAgICAgICAgOiAxMDAwLFxyXG4gICAgICAgICAgXCJtYXJnaW5cIiAgICAgICAgICAgICAgICAgICAgICA6IDBcclxuICAgICAgICB9KTtcclxuICAgICAgfSxcclxuXHJcbiAgICAgIHNldENvbnRhaW5lckNzc1ZhbHVlczogZnVuY3Rpb24oKXtcclxuICAgICAgICBpZiAoIHRoaXMuc2V0dGluZ3MuZGlyZWN0aW9uID09PSBcImhvcml6b250YWxcIikge1xyXG4gICAgICAgICAgICB0aGlzLl9zZXRIb3Jpem9udGFsQ29udGFpbmVyQ3NzVmFsdWVzKCk7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgdGhpcy5fc2V0VmVydGljYWxDb250YWluZXJDc3NWYWx1ZXMoKTtcclxuICAgICAgICB9XHJcbiAgICAgIH0sXHJcblxyXG4gICAgICAvLyAjIyMgQ2FsY3VsYXRlIHBhZ2UgZGltZW50aW9uc1xyXG4gICAgICAvL1xyXG4gICAgICAvLyBVcGRhdGVzIHRoZSBwYWdlIGRpbWVudGlvbnMgdmFsdWVzXHJcblxyXG4gICAgICBfc2V0UGFnZURpbWVudGlvbnM6IGZ1bmN0aW9uKCkge1xyXG4gICAgICAgIHZhciB3aWR0aCAgPSB0aGlzLmNvbnRhaW5lci5vZmZzZXRXaWR0aCxcclxuICAgICAgICAgICAgaGVpZ2h0ID0gdGhpcy5jb250YWluZXIub2Zmc2V0SGVpZ2h0O1xyXG5cclxuICAgICAgICBpZiAoIHRoaXMuc2V0dGluZ3MuZGlyZWN0aW9uID09PSBcImhvcml6b250YWxcIiApIHtcclxuICAgICAgICAgIHdpZHRoID0gd2lkdGggLSBwYXJzZUludCggdGhpcy5zZXR0aW5ncy5zY3JpYmUsIDEwICk7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgIGhlaWdodCA9IGhlaWdodCAtIHBhcnNlSW50KCB0aGlzLnNldHRpbmdzLnNjcmliZSwgMTAgKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHRoaXMucGFnZURpbWVudGlvbnMgPSB7XHJcbiAgICAgICAgICB3aWR0aCA6IHdpZHRoLFxyXG4gICAgICAgICAgaGVpZ2h0OiBoZWlnaHRcclxuICAgICAgICB9O1xyXG5cclxuICAgICAgfSxcclxuXHJcbiAgICAgIC8vICMjIyBTaXplIHBhZ2VzXHJcblxyXG4gICAgICBfc2l6ZVBhZ2VzOiBmdW5jdGlvbigpIHtcclxuXHJcbiAgICAgICAgdmFyIHBhZ2VzQ291bnQgPSB0aGlzLnBhZ2VzLmxlbmd0aDtcclxuXHJcbiAgICAgICAgdGhpcy5fc2V0UGFnZURpbWVudGlvbnMoKTtcclxuXHJcbiAgICAgICAgdGhpcy5zZXRDb250YWluZXJDc3NWYWx1ZXMoKTtcclxuICAgICAgICBpZih0aGlzLnNldHRpbmdzLml0ZW1zSW5QYWdlID09IDEpe1xyXG4gICAgICAgICAgaWYgKCB0aGlzLnNldHRpbmdzLmRpcmVjdGlvbiA9PT0gXCJob3Jpem9udGFsXCIgKSB7XHJcbiAgICAgICAgICAgIGV4dGVuZCggdGhpcy5wYWdlQ3NzUHJvcGVydGllcywge1xyXG4gICAgICAgICAgICAgIHdpZHRoIDogdGhpcy5wYWdlRGltZW50aW9ucy53aWR0aCAvIHRoaXMuc2V0dGluZ3MuaXRlbXNJblBhZ2VcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICBleHRlbmQoIHRoaXMucGFnZUNzc1Byb3BlcnRpZXMsIHtcclxuICAgICAgICAgICAgICB3aWR0aCA6IHRoaXMucGFnZURpbWVudGlvbnMud2lkdGhcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICB9IFxyXG4gICAgICAgIH1cclxuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHBhZ2VzQ291bnQ7IGkrKykge1xyXG4gICAgICAgICAgc2V0U3R5bGVzKHRoaXMucGFnZXNbaV0sIHRoaXMucGFnZUNzc1Byb3BlcnRpZXMpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgdGhpcy5fanVtcFRvUGFnZSggXCJwYWdlXCIsIHRoaXMucGFnZSApO1xyXG5cclxuICAgICAgfSxcclxuXHJcbiAgICAgIC8vICMjIyBDYWxsY3VsYXRlIG5ldyBwYWdlXHJcbiAgICAgIC8vXHJcbiAgICAgIC8vIFVwZGF0ZSBnbG9iYWwgdmFsdWVzIGZvciBzcGVjaWZpYyBzd2lwZSBhY3Rpb25cclxuICAgICAgLy9cclxuICAgICAgLy8gVGFrZXMgZGlyZWN0aW9uIGFuZCwgaWYgc3BlY2lmaWMgcGFnZSBpcyB1c2VkIHRoZSBwYWdlbnVtYmVyXHJcblxyXG4gICAgICBfY2FsY05ld1BhZ2U6IGZ1bmN0aW9uKCBkaXJlY3Rpb24sIHBhZ2VOdW1iZXIgKSB7XHJcblxyXG4gICAgICAgIHZhciBib3JkZXJCZXR3ZWVuUGFnZXMgPSB0aGlzLnNldHRpbmdzLmJvcmRlckJldHdlZW5QYWdlcyxcclxuICAgICAgICAgICAgaGVpZ2h0ID0gdGhpcy5wYWdlRGltZW50aW9ucy5oZWlnaHQsXHJcbiAgICAgICAgICAgIHdpZHRoID0gdGhpcy5wYWdlRGltZW50aW9ucy53aWR0aCxcclxuICAgICAgICAgICAgcGFnZSA9IHRoaXMucGFnZTtcclxuXHJcbiAgICAgICAgc3dpdGNoICggZGlyZWN0aW9uICkge1xyXG4gICAgICAgICAgY2FzZSBcInVwXCI6XHJcbiAgICAgICAgICAgIGlmICggcGFnZSA8IHRoaXMucGFnZXNDb3VudCAtIDEgKSB7XHJcbiAgICAgICAgICAgICAgdGhpcy5zY3JvbGxCb3JkZXIueSA9IHRoaXMuc2Nyb2xsQm9yZGVyLnkgKyBoZWlnaHQgKyBib3JkZXJCZXR3ZWVuUGFnZXM7XHJcbiAgICAgICAgICAgICAgdGhpcy5wYWdlKys7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgYnJlYWs7XHJcblxyXG4gICAgICAgICAgY2FzZSBcImRvd25cIjpcclxuICAgICAgICAgICAgaWYgKCBwYWdlID4gMCApIHtcclxuICAgICAgICAgICAgICB0aGlzLnNjcm9sbEJvcmRlci55ID0gdGhpcy5zY3JvbGxCb3JkZXIueSAtIGhlaWdodCAtIGJvcmRlckJldHdlZW5QYWdlcztcclxuICAgICAgICAgICAgICB0aGlzLnBhZ2UtLTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBicmVhaztcclxuXHJcbiAgICAgICAgICBjYXNlIFwibGVmdFwiOlxyXG4gICAgICAgICAgICBpZiAoIHBhZ2UgPCB0aGlzLnBhZ2VzQ291bnQgLSAxICkge1xyXG4gICAgICAgICAgICAgIHRoaXMuc2Nyb2xsQm9yZGVyLnggPSB0aGlzLnNjcm9sbEJvcmRlci54ICsgd2lkdGggKyBib3JkZXJCZXR3ZWVuUGFnZXM7XHJcbiAgICAgICAgICAgICAgdGhpcy5wYWdlKys7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgYnJlYWs7XHJcblxyXG4gICAgICAgICAgY2FzZSBcInJpZ2h0XCI6XHJcbiAgICAgICAgICAgIGlmICggcGFnZSA+IDAgKSB7XHJcbiAgICAgICAgICAgICAgdGhpcy5zY3JvbGxCb3JkZXIueCA9IHRoaXMuc2Nyb2xsQm9yZGVyLnggLSB3aWR0aCAtIGJvcmRlckJldHdlZW5QYWdlcztcclxuICAgICAgICAgICAgICB0aGlzLnBhZ2UtLTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBicmVhaztcclxuXHJcbiAgICAgICAgICBjYXNlIFwicGFnZVwiOlxyXG4gICAgICAgICAgICBzd2l0Y2ggKCB0aGlzLnNldHRpbmdzLmRpcmVjdGlvbiApIHtcclxuICAgICAgICAgICAgICBjYXNlIFwiaG9yaXpvbnRhbFwiOlxyXG4gICAgICAgICAgICAgICAgdGhpcy5zY3JvbGxCb3JkZXIueCA9ICh3aWR0aCArIGJvcmRlckJldHdlZW5QYWdlcykgKiBwYWdlTnVtYmVyO1xyXG4gICAgICAgICAgICAgICAgYnJlYWs7XHJcblxyXG4gICAgICAgICAgICAgIGNhc2UgXCJ2ZXJ0aWNhbFwiOlxyXG4gICAgICAgICAgICAgICAgdGhpcy5zY3JvbGxCb3JkZXIueSA9IChoZWlnaHQgKyBib3JkZXJCZXR3ZWVuUGFnZXMpICogcGFnZU51bWJlcjtcclxuICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHRoaXMucGFnZSA9IHBhZ2VOdW1iZXI7XHJcbiAgICAgICAgICAgIGJyZWFrO1xyXG5cclxuICAgICAgICAgIGRlZmF1bHQ6XHJcbiAgICAgICAgICAgIHRoaXMuc2Nyb2xsQm9yZGVyLnkgPSAwO1xyXG4gICAgICAgICAgICB0aGlzLnNjcm9sbEJvcmRlci54ID0gMDtcclxuICAgICAgICAgICAgdGhpcy5wYWdlICAgICAgICAgICA9IDA7XHJcbiAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgIH1cclxuICAgICAgfSxcclxuXHJcbiAgICAgIC8vICMjIyBPbiBzd2lwZSBlbmRcclxuICAgICAgLy9cclxuICAgICAgLy8gRnVuY3Rpb24gY2FsbGVkIGFmdGVyIHRoZSBzY3JvbGwgYW5pbWF0aW9uIGVuZGVkXHJcblxyXG4gICAgICBfb25Td2lwZUVuZDogZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgdGhpcy5wcmV2ZW50U2Nyb2xsID0gZmFsc2U7XHJcblxyXG4gICAgICAgIHRoaXMuYWN0aXZlRWxlbWVudCA9IHRoaXMucGFnZXNbdGhpcy5wYWdlICogdGhpcy5zZXR0aW5ncy5pdGVtc0luUGFnZV07XHJcblxyXG4gICAgICAgIC8vIENhbGwgb25Td2lwZUVuZCBjYWxsYmFjayBmdW5jdGlvblxyXG4gICAgICAgIHRoaXMuc2V0dGluZ3Mub25Td2lwZUVuZC5jYWxsKCB0aGlzLCB0aGlzLmNvbnRhaW5lciwgdGhpcy5hY3RpdmVFbGVtZW50LCB0aGlzLnBhZ2UpO1xyXG4gICAgICB9LFxyXG5cclxuICAgICAgLy8gSnVtcCB0byBwYWdlXHJcbiAgICAgIC8vXHJcbiAgICAgIC8vIEp1bXBzIHdpdGhvdXQgYSBhbmltYW50aW9uIHRvIHNwZWNpZmljIHBhZ2UuIFRoZSBwYWdlIG51bWJlciBpcyBvbmx5XHJcbiAgICAgIC8vIG5lY2Vzc2FyeSBmb3IgdGhlIHNwZWNpZmljIHBhZ2UgZGlyZWN0aW9uXHJcbiAgICAgIC8vXHJcbiAgICAgIC8vIFRha2VzOlxyXG4gICAgICAvLyBEaXJlY3Rpb24gYW5kIHBhZ2VudW1iZXJcclxuXHJcbiAgICAgIF9qdW1wVG9QYWdlOiBmdW5jdGlvbiggb3B0aW9ucywgcGFnZU51bWJlciApIHtcclxuXHJcbiAgICAgICAgaWYgKCBvcHRpb25zICkge1xyXG4gICAgICAgICAgdGhpcy5fY2FsY05ld1BhZ2UoIG9wdGlvbnMsIHBhZ2VOdW1iZXIgKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHRoaXMuX3Njcm9sbCh7XHJcbiAgICAgICAgICB4OiAtIHRoaXMuc2Nyb2xsQm9yZGVyLngsXHJcbiAgICAgICAgICB5OiAtIHRoaXMuc2Nyb2xsQm9yZGVyLnlcclxuICAgICAgICB9KTtcclxuICAgICAgfSxcclxuXHJcbiAgICAgIC8vIFNjcm9sbCB0byBwYWdlXHJcbiAgICAgIC8vXHJcbiAgICAgIC8vIFNjcm9sbHMgd2l0aCBhIGFuaW1hbnRpb24gdG8gc3BlY2lmaWMgcGFnZS4gVGhlIHBhZ2UgbnVtYmVyIGlzIG9ubHkgbmVjZXNzYXJ5XHJcbiAgICAgIC8vIGZvciB0aGUgc3BlY2lmaWMgcGFnZSBkaXJlY3Rpb25cclxuICAgICAgLy9cclxuICAgICAgLy8gVGFrZXM6XHJcbiAgICAgIC8vIERpcmVjdGlvbiBhbmQgcGFnZW51bWJlclxyXG5cclxuICAgICAgX3Njcm9sbFRvUGFnZTogZnVuY3Rpb24oIG9wdGlvbnMsIHBhZ2VOdW1iZXIgKSB7XHJcbiAgICAgICAgdGhpcy5wcmV2ZW50U2Nyb2xsID0gdHJ1ZTtcclxuXHJcbiAgICAgICAgaWYgKCBvcHRpb25zICkgdGhpcy5fY2FsY05ld1BhZ2UoIG9wdGlvbnMsIHBhZ2VOdW1iZXIgKTtcclxuXHJcbiAgICAgICAgdGhpcy5fYW5pbWF0ZVNjcm9sbCgpO1xyXG4gICAgICB9LFxyXG5cclxuICAgICAgLy8gIyMjIFNjcm9sbCB0cmFuc2xhdGVcclxuICAgICAgLy9cclxuICAgICAgLy8gQW5pbWF0aW9uIHdoZW4gdHJhbnNsYXRlIGlzIHN1cHBvcnRlZFxyXG4gICAgICAvL1xyXG4gICAgICAvLyBUYWtlczpcclxuICAgICAgLy8geCBhbmQgeSB2YWx1ZXMgdG8gZ28gd2l0aFxyXG5cclxuICAgICAgX3Njcm9sbFdpdGhUcmFuc2Zvcm06IGZ1bmN0aW9uICggY29vcmRpbmF0ZXMgKSB7XHJcbiAgICAgICAgdmFyIHN0eWxlID0gdGhpcy5zZXR0aW5ncy5kaXJlY3Rpb24gPT09IFwiaG9yaXpvbnRhbFwiID8gXCJ0cmFuc2xhdGVYKFwiICsgY29vcmRpbmF0ZXMueCArIFwicHgpXCIgOiBcInRyYW5zbGF0ZVkoXCIgKyBjb29yZGluYXRlcy55ICsgXCJweClcIjtcclxuXHJcbiAgICAgICAgc2V0U3R5bGVzKCB0aGlzLnBhZ2VDb250YWluZXIsIHtcclxuICAgICAgICAgIFwiLXdlYmtpdC10cmFuc2Zvcm1cIjogc3R5bGUsXHJcbiAgICAgICAgICBcIi1tb3otdHJhbnNmb3JtXCI6IHN0eWxlLFxyXG4gICAgICAgICAgXCItbXMtdHJhbnNmb3JtXCI6IHN0eWxlLFxyXG4gICAgICAgICAgXCItby10cmFuc2Zvcm1cIjogc3R5bGUsXHJcbiAgICAgICAgICBcInRyYW5zZm9ybVwiOiBzdHlsZVxyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgfSxcclxuXHJcbiAgICAgIC8vICMjIyBBbmltYXRlZCBzY3JvbGwgd2l0aCB0cmFuc2xhdGUgc3VwcG9ydFxyXG5cclxuICAgICAgX2FuaW1hdGVTY3JvbGxXaXRoVHJhbnNmb3JtOiBmdW5jdGlvbigpIHtcclxuXHJcbiAgICAgICAgdmFyIHN0eWxlID0gXCJ0cmFuc2Zvcm0gXCIgKyB0aGlzLnNldHRpbmdzLmR1cmF0aW9uICsgXCJtcyBlYXNlLW91dFwiLFxyXG4gICAgICAgICAgICBjb250YWluZXIgPSB0aGlzLmNvbnRhaW5lcixcclxuICAgICAgICAgICAgYWZ0ZXJTY3JvbGxUcmFuc2Zvcm0gPSB0aGlzLl9hZnRlclNjcm9sbFRyYW5zZm9ybTtcclxuXHJcbiAgICAgICAgc2V0U3R5bGVzKCB0aGlzLnBhZ2VDb250YWluZXIsIHtcclxuICAgICAgICAgIFwiLXdlYmtpdC10cmFuc2l0aW9uXCI6IFwiLXdlYmtpdC1cIiArIHN0eWxlLFxyXG4gICAgICAgICAgXCItbW96LXRyYW5zaXRpb25cIjogXCItbW96LVwiICsgc3R5bGUsXHJcbiAgICAgICAgICBcIi1tcy10cmFuc2l0aW9uXCI6IFwiLW1zLVwiICsgc3R5bGUsXHJcbiAgICAgICAgICBcIi1vLXRyYW5zaXRpb25cIjogXCItby1cIiArIHN0eWxlLFxyXG4gICAgICAgICAgXCJ0cmFuc2l0aW9uXCI6IHN0eWxlXHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIHRoaXMuX3Njcm9sbCh7XHJcbiAgICAgICAgICB4OiAtIHRoaXMuc2Nyb2xsQm9yZGVyLngsXHJcbiAgICAgICAgICB5OiAtIHRoaXMuc2Nyb2xsQm9yZGVyLnlcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgYWRkRXZlbnRMaXN0ZW5lcih0aGlzLmNvbnRhaW5lciwgXCJ3ZWJraXRUcmFuc2l0aW9uRW5kXCIsIGFmdGVyU2Nyb2xsVHJhbnNmb3JtKTtcclxuICAgICAgICBhZGRFdmVudExpc3RlbmVyKHRoaXMuY29udGFpbmVyLCBcIm9UcmFuc2l0aW9uRW5kXCIsIGFmdGVyU2Nyb2xsVHJhbnNmb3JtKTtcclxuICAgICAgICBhZGRFdmVudExpc3RlbmVyKHRoaXMuY29udGFpbmVyLCBcInRyYW5zaXRpb25lbmRcIiwgYWZ0ZXJTY3JvbGxUcmFuc2Zvcm0pO1xyXG4gICAgICAgIGFkZEV2ZW50TGlzdGVuZXIodGhpcy5jb250YWluZXIsIFwidHJhbnNpdGlvbkVuZFwiLCBhZnRlclNjcm9sbFRyYW5zZm9ybSk7XHJcblxyXG4gICAgICB9LFxyXG5cclxuICAgICAgX2FmdGVyU2Nyb2xsVHJhbnNmb3JtOiBmdW5jdGlvbigpIHtcclxuXHJcbiAgICAgICAgdmFyIGNvbnRhaW5lciA9IHRoaXMuY29udGFpbmVyLFxyXG4gICAgICAgICAgICBhZnRlclNjcm9sbFRyYW5zZm9ybSA9IHRoaXMuX2FmdGVyU2Nyb2xsVHJhbnNmb3JtO1xyXG5cclxuICAgICAgICB0aGlzLl9vblN3aXBlRW5kKCk7XHJcblxyXG4gICAgICAgIHJlbW92ZUV2ZW50TGlzdGVuZXIoY29udGFpbmVyLCBcIndlYmtpdFRyYW5zaXRpb25FbmRcIiwgYWZ0ZXJTY3JvbGxUcmFuc2Zvcm0pO1xyXG4gICAgICAgIHJlbW92ZUV2ZW50TGlzdGVuZXIoY29udGFpbmVyLCBcIm9UcmFuc2l0aW9uRW5kXCIsIGFmdGVyU2Nyb2xsVHJhbnNmb3JtKTtcclxuICAgICAgICByZW1vdmVFdmVudExpc3RlbmVyKGNvbnRhaW5lciwgXCJ0cmFuc2l0aW9uZW5kXCIsIGFmdGVyU2Nyb2xsVHJhbnNmb3JtKTtcclxuICAgICAgICByZW1vdmVFdmVudExpc3RlbmVyKGNvbnRhaW5lciwgXCJ0cmFuc2l0aW9uRW5kXCIsIGFmdGVyU2Nyb2xsVHJhbnNmb3JtKTtcclxuXHJcbiAgICAgICAgc2V0U3R5bGVzKCB0aGlzLnBhZ2VDb250YWluZXIsIHtcclxuICAgICAgICAgIFwiLXdlYmtpdC10cmFuc2l0aW9uXCI6IFwiXCIsXHJcbiAgICAgICAgICBcIi1tb3otdHJhbnNpdGlvblwiOiBcIlwiLFxyXG4gICAgICAgICAgXCItbXMtdHJhbnNpdGlvblwiOiBcIlwiLFxyXG4gICAgICAgICAgXCItby10cmFuc2l0aW9uXCI6IFwiXCIsXHJcbiAgICAgICAgICBcInRyYW5zaXRpb25cIjogXCJcIlxyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgfSxcclxuXHJcbiAgICAgIC8vICMjIyBTY3JvbGwgZmFsbGJhY2tcclxuICAgICAgLy9cclxuICAgICAgLy8gQW5pbWF0aW9uIGxvb2t1cCB0YWJsZSAgd2hlbiB0cmFuc2xhdGUgaXNuJ3Qgc3VwcG9ydGVkXHJcbiAgICAgIC8vXHJcbiAgICAgIC8vIFRha2VzOlxyXG4gICAgICAvLyB4IGFuZCB5IHZhbHVlcyB0byBnbyB3aXRoXHJcblxyXG4gICAgICBfc2Nyb2xsV2l0aG91dFRyYW5zZm9ybTogZnVuY3Rpb24oIGNvb3JkaW5hdGVzICkge1xyXG4gICAgICAgIHZhciBzdHlsZXMgPSB0aGlzLnNldHRpbmdzLmRpcmVjdGlvbiA9PT0gXCJob3Jpem9udGFsXCIgPyB7IFwibWFyZ2luTGVmdFwiOiBjb29yZGluYXRlcy54IH0gOiB7IFwibWFyZ2luVG9wXCI6IGNvb3JkaW5hdGVzLnkgfTtcclxuXHJcbiAgICAgICAgc2V0U3R5bGVzKHRoaXMucGFnZUNvbnRhaW5lciwgc3R5bGVzKTtcclxuICAgICAgfSxcclxuXHJcbiAgICAgIC8vICMjIyBBbmltYXRlZCBzY3JvbGwgd2l0aG91dCB0cmFuc2xhdGUgc3VwcG9ydFxyXG5cclxuICAgICAgX2FuaW1hdGVTY3JvbGxXaXRob3V0VHJhbnNmb3JtOiBmdW5jdGlvbigpIHtcclxuICAgICAgICB2YXIgcHJvcGVydHkgPSB0aGlzLnNldHRpbmdzLmRpcmVjdGlvbiA9PT0gXCJob3Jpem9udGFsXCIgPyBcIm1hcmdpbkxlZnRcIiA6IFwibWFyZ2luVG9wXCIsXHJcbiAgICAgICAgICAgIHZhbHVlID0gdGhpcy5zZXR0aW5ncy5kaXJlY3Rpb24gPT09IFwiaG9yaXpvbnRhbFwiID8gLSB0aGlzLnNjcm9sbEJvcmRlci54IDogLSB0aGlzLnNjcm9sbEJvcmRlci55O1xyXG5cclxuICAgICAgICBhbmltYXRlKCB0aGlzLnBhZ2VDb250YWluZXIsIHByb3BlcnR5LCB2YWx1ZSwgdGhpcy5zZXR0aW5ncy5kdXJhdGlvbiwgcHJveHkoIHRoaXMuX29uU3dpcGVFbmQsIHRoaXMgKSk7XHJcblxyXG4gICAgICB9LFxyXG5cclxuICAgICAgLy8gUHVibGljIGZ1bmN0aW9uc1xyXG4gICAgICAvLyA9PT09PT09PT09PT09PT09XHJcblxyXG4gICAgICBzd2lwZTogZnVuY3Rpb24oIGRpcmVjdGlvbiApIHtcclxuICAgICAgICAvLyBDYWxsIG9uU3dpcGVTdGFydCBjYWxsYmFjayBmdW5jdGlvblxyXG4gICAgICAgIHRoaXMuc2V0dGluZ3Mub25Td2lwZVN0YXJ0LmNhbGwoIHRoaXMsIHRoaXMuY29udGFpbmVyLCB0aGlzLmFjdGl2ZUVsZW1lbnQsIHRoaXMucGFnZSApO1xyXG4gICAgICAgIHRoaXMuX3Njcm9sbFRvUGFnZSggZGlyZWN0aW9uICk7XHJcbiAgICAgIH0sXHJcblxyXG4gICAgICB1cGRhdGVJbnN0YW5jZTogZnVuY3Rpb24oIHNldHRpbmdzICkge1xyXG5cclxuICAgICAgICBzZXR0aW5ncyA9IHNldHRpbmdzIHx8IHt9O1xyXG5cclxuICAgICAgICBpZiAoIHR5cGVvZiBzZXR0aW5ncyA9PT0gXCJvYmplY3RcIiApIGV4dGVuZCggdGhpcy5zZXR0aW5ncywgc2V0dGluZ3MgKTtcclxuXHJcbiAgICAgICAgdGhpcy5wYWdlcyA9IGdldEVsZW1lbnRzQnlDbGFzc05hbWUodGhpcy5zZXR0aW5ncy5wYWdlQ2xhc3MsIHRoaXMucGFnZUNvbnRhaW5lcik7XHJcblxyXG4gICAgICAgIGlmICh0aGlzLnBhZ2VzLmxlbmd0aCkge1xyXG4gICAgICAgICAgdGhpcy5wYWdlc0NvdW50ID0gdGhpcy5wYWdlcy5sZW5ndGggLyB0aGlzLnNldHRpbmdzLml0ZW1zSW5QYWdlO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoZXJyb3JzLnBhZ2VzKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHRoaXMuYWN0aXZlRWxlbWVudCA9IHRoaXMucGFnZXNbdGhpcy5wYWdlICogdGhpcy5zZXR0aW5ncy5pdGVtc0luUGFnZV07XHJcbiAgICAgICAgdGhpcy5fc2l6ZVBhZ2VzKCk7XHJcblxyXG4gICAgICAgIGlmICggdGhpcy5zZXR0aW5ncy5qdW1wVG9QYWdlICkge1xyXG4gICAgICAgICAgdGhpcy5qdW1wVG9QYWdlKCBzZXR0aW5ncy5qdW1wVG9QYWdlICk7XHJcbiAgICAgICAgICBkZWxldGUgdGhpcy5zZXR0aW5ncy5qdW1wVG9QYWdlO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYgKCB0aGlzLnNldHRpbmdzLnNjcm9sbFRvUGFnZSApIHtcclxuICAgICAgICAgIHRoaXMuc2Nyb2xsVG9QYWdlKCB0aGlzLnNldHRpbmdzLnNjcm9sbFRvUGFnZSApO1xyXG4gICAgICAgICAgZGVsZXRlIHRoaXMuc2V0dGluZ3Muc2Nyb2xsVG9QYWdlO1xyXG4gICAgICAgIH1cclxuXHRcdFxyXG4gICAgICAgIGlmICh0aGlzLnNldHRpbmdzLmRlc3Ryb3kpIHtcclxuICAgICAgICAgIHRoaXMuZGVzdHJveSgpO1xyXG4gICAgICAgICAgZGVsZXRlIHRoaXMuc2V0dGluZ3MuZGVzdHJveTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICB9LFxyXG5cclxuICAgICAgZGVzdHJveTogZnVuY3Rpb24oKSB7XHJcblxyXG4gICAgICAgIHZhciBjb250YWluZXIgPSB0aGlzLmNvbnRhaW5lcjtcclxuXHJcbiAgICAgICAgcmVtb3ZlRXZlbnRMaXN0ZW5lcihjb250YWluZXIsIHN0YXJ0RXZlbnQpO1xyXG4gICAgICAgIHJlbW92ZUV2ZW50TGlzdGVuZXIoY29udGFpbmVyLCBtb3ZlRXZlbnQpO1xyXG4gICAgICAgIHJlbW92ZUV2ZW50TGlzdGVuZXIoY29udGFpbmVyLCBlbmRFdmVudCk7XHJcbiAgICAgICAgcmVtb3ZlRXZlbnRMaXN0ZW5lcihkb2MuYm9keSwgXCJrZXlkb3duXCIsIHRoaXMuX29uS2V5ZG93bik7XHJcbiAgICAgICAgcmVtb3ZlRXZlbnRMaXN0ZW5lcih3aW4sIFwicmVzaXplXCIsIHRoaXMuX3NpemVQYWdlcyk7XHJcblxyXG4gICAgICAgIGNvbnRhaW5lci5yZW1vdmVBdHRyaWJ1dGUoXCJzdHlsZVwiKTtcclxuXHJcbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCB0aGlzLnBhZ2VzLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICB0aGlzLnBhZ2VzW2ldLnJlbW92ZUF0dHJpYnV0ZShcInN0eWxlXCIpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgY29udGFpbmVyLmlubmVySFRNTCA9IHRoaXMucGFnZUNvbnRhaW5lci5pbm5lckhUTUw7XHJcblxyXG4gICAgICB9LFxyXG5cclxuICAgICAgc2Nyb2xsVG9QYWdlOiBmdW5jdGlvbiggcGFnZSApIHtcclxuICAgICAgICB0aGlzLl9zY3JvbGxUb1BhZ2UoIFwicGFnZVwiLCBwYWdlIC0gMSk7XHJcbiAgICAgIH0sXHJcblxyXG4gICAgICBqdW1wVG9QYWdlOiBmdW5jdGlvbiggcGFnZSApIHtcclxuICAgICAgICB0aGlzLl9qdW1wVG9QYWdlKCBcInBhZ2VcIiwgcGFnZSAtIDEpO1xyXG4gICAgICB9XHJcblxyXG4gICAgfSk7XHJcblxyXG4gICAgaWYgKCAkICkge1xyXG5cclxuICAgICAgICAvLyBSZWdpc3RlciBqUXVlcnkgcGx1Z2luXHJcbiAgICAgICAgJC5mbi5kcmFnZW5kID0gZnVuY3Rpb24oIHNldHRpbmdzICkge1xyXG5cclxuICAgICAgICAgIHNldHRpbmdzID0gc2V0dGluZ3MgfHwge307XHJcblxyXG4gICAgICAgICAgdGhpcy5lYWNoKGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICB2YXIgaW5zdGFuY2UgPSAkKHRoaXMpLmRhdGEoIFwiZHJhZ2VuZFwiICk7XHJcblxyXG4gICAgICAgICAgICAvLyBjaGVjayBpZiBpbnN0YW5jZSBhbHJlYWR5IGNyZWF0ZWRcclxuICAgICAgICAgICAgaWYgKCBpbnN0YW5jZSApIHtcclxuICAgICAgICAgICAgICBpbnN0YW5jZS51cGRhdGVJbnN0YW5jZSggc2V0dGluZ3MgKTtcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICBpbnN0YW5jZSA9IG5ldyBEcmFnZW5kKCB0aGlzLCBzZXR0aW5ncyApO1xyXG4gICAgICAgICAgICAgICQodGhpcykuZGF0YSggXCJkcmFnZW5kXCIsIGluc3RhbmNlICk7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIC8vIGNoZWNrIGlmIHNob3VsZCB0cmlnZ2VyIHN3aXBlXHJcbiAgICAgICAgICAgIGlmICggdHlwZW9mIHNldHRpbmdzID09PSBcInN0cmluZ1wiICkgaW5zdGFuY2Uuc3dpcGUoIHNldHRpbmdzICk7XHJcblxyXG4gICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICAgLy8galF1ZXJ5IGZ1bmN0aW9ucyBzaG91bGQgYWx3YXlzIHJldHVybiB0aGUgaW5zdGFuY2VcclxuICAgICAgICAgIHJldHVybiB0aGlzO1xyXG4gICAgICAgIH07XHJcblxyXG4gICAgfVxyXG5cclxuICAgIHJldHVybiBEcmFnZW5kO1xyXG5cclxuICB9XHJcblxyXG4gIGlmICggdHlwZW9mIGRlZmluZSA9PSAnZnVuY3Rpb24nICYmIHR5cGVvZiBkZWZpbmUuYW1kID09ICdvYmplY3QnICYmIGRlZmluZS5hbWQgKSB7XHJcbiAgICAgIGRlZmluZShmdW5jdGlvbigpIHtcclxuICAgICAgICByZXR1cm4gaW5pdCggd2luLmpRdWVyeSB8fCB3aW4uWmVwdG8gKTtcclxuICAgICAgfSk7XHJcbiAgfSBlbHNlIHtcclxuICAgICAgd2luLkRyYWdlbmQgPSBpbml0KCB3aW4ualF1ZXJ5IHx8IHdpbi5aZXB0byApO1xyXG4gIH1cclxuXHJcbn0pKCB3aW5kb3cgKTsiLCJmdW5jdGlvbiB1cGRhdGVEcmFnZW5kU2xpZGVyKHNsaWRlQ29udGFpbmVyLCBoZWlnaHQsIHRodW1ibmFpbHMsIGF1dG9QbGF5SW50ZXJ2YWwpe1xyXG5cblx0XHQvL0RyYWdlbmQgZ2FsbGVyeSB3aWxsIHRha2UgaGVpZ2h0IGZyb20gcGFyZW50IGNvbnRhaW5lclxuICAgICAgICBjbGVhckhlaWdodChzbGlkZUNvbnRhaW5lcik7XG4gICAgICAgIGpRdWVyeShzbGlkZUNvbnRhaW5lcikuaGVpZ2h0KHZpZXdIZWlnaHQpO1xuXHJcblx0XHQvL0NvbnRyb2wgdGhlIHNpemUgb2YgdGhlIHBhcmVudCBjb250YWluZXIgZm9yIG9kZCBzaGFwZWQgaW1hZ2VzIC0gY29yZUhlbHBlcnMuanNcclxuXHRcdG1heFNpemVCeUFzcChzbGlkZUNvbnRhaW5lciwgMS42LCAyLjIpO1xyXG5cclxuXHRcdC8vSFRNTCBUZW1wbGF0ZSBUaHVtYnMgSUYgdGh1bWJuYWlscyBvciBidXR0b25zIHJlcXVlc3RlZFxyXG5cdFx0aWYodGh1bWJuYWlscyl7XHJcblx0XHRcdGNlbnRlckRyYWdlbmRUaHVtYnMoKTtcblx0XHR9XHJcblxyXG59Ly9pbml0RHJhZ2VuZFxyXG5cclxuXHRmdW5jdGlvbiBhdXRvUGxheVNsaWRlcyh0aGlzRHJhZ2VuZCl7XG5cdFx0alF1ZXJ5KHRoaXNEcmFnZW5kKS5kcmFnZW5kKFwibGVmdFwiKTtcclxuXHR9XHJcblxyXG5cdGZ1bmN0aW9uIGdldEltYWdlc0J5U2NyZWVuU2l6ZShpbWFnZXNBcnJheSwgZmlyc3RCcmVhaywgc2Vjb25kQnJlYWspe1xyXG5cdFx0aWYgKGpRdWVyeSh3aW5kb3cpLndpZHRoKCkgPCBmaXJzdEJyZWFrICl7XHJcblx0XHRcdHJldHVybiBpbWFnZXNBcnJheVsxXTsvL3NtYWxsO1xyXG5cdFx0fVxyXG5cdFx0ZWxzZSBpZihqUXVlcnkod2luZG93KS53aWR0aCgpID49IGZpcnN0QnJlYWsgJiYgalF1ZXJ5KHdpbmRvdykud2lkdGgoKSA8PSBzZWNvbmRCcmVhaykge1xyXG5cdFx0XHRyZXR1cm4gaW1hZ2VzQXJyYXlbMl07Ly9tZWRpdW07XHJcblx0XHR9XHJcblx0XHRlbHNle1xyXG5cdFx0XHRyZXR1cm4gaW1hZ2VzQXJyYXlbM107Ly9sYXJnZTtcclxuXHRcdH1cclxuXHR9XHJcblxyXG5cdC8vSFRNTCBUZW1wbGF0ZSBmb3IgY29udGVudDogXCJpbWFnZXNcIiAvIFwiaHRtbFwiIC8gP1xyXG5cclxuXHRmdW5jdGlvbiBjcmVhdGVEcmFnZW5kU2xpZGVzKHRhcmdldCwgc2xpZGVzQXJyLCBzbGlkZXJUeXBlLCB0aHVtYm5haWxzKXtcclxuXHRcdHNsaWRlc0NvbnRhaW5lciA9IGpRdWVyeSgnPGRpdiBpZD1cInNsaWRlc0NvbnRhaW5lclwiIGNsYXNzPVwiZHJhZ2VuZC1wYWdlXCI+PC9kaXY+Jyk7XHJcblx0XHRzbGlkZXNDb250YWluZXIuYXBwZW5kVG8oalF1ZXJ5KHRhcmdldCkpO1xyXG5cclxuXHRcdGpRdWVyeS5lYWNoKCBzbGlkZXNBcnIsIGZ1bmN0aW9uKCBpbmRleCwgc2xpZGUgKXtcclxuXHRcdFx0dmFyIHRoaXNTbGlkZSA9IGpRdWVyeSgnPGRpdiBjbGFzcz1cImRyYWdlbmQtcGFnZVwiIGRhdGEtaGVpZ2h0PVwiJytzbGlkZVsxXSsnIFwiZGF0YS13aWR0aD1cIicrc2xpZGVbMl0rJ1wiPjwvZGl2PicpO1xyXG5cdFx0XHR0aGlzU2xpZGUuYXBwZW5kVG8oalF1ZXJ5KHNsaWRlc0NvbnRhaW5lcikpO1xyXG5cdFx0XHRsb2FkRHJhZ2VuZFNsaWRlQ29udGVudCh0aGlzU2xpZGUsIHNsaWRlLCBzbGlkZXJUeXBlKTtcclxuXHRcdFx0alF1ZXJ5KHRoaXNTbGlkZSkuYWRkQ2xhc3MoYXNwTGFiZWwoIHNsaWRlWzJdICwgc2xpZGVbMV0gKSk7XHJcblx0XHR9KTtcclxuXHJcblx0XHRpZiAodGh1bWJuYWlscyl7XHJcblx0XHRcdHRodW1ic0NvbnRhaW5lciA9IGpRdWVyeSgnPGRpdiBpZD1cInRodW1ic0NvbnRhaW5lclwiIGNsYXNzPVwiZHJhZ2VuZC1wYWdlXCI+PC9kaXY+Jyk7XHJcblx0XHRcdHRodW1ic0NvbnRhaW5lci5hcHBlbmRUbyhqUXVlcnkodGFyZ2V0KSk7XHJcblx0XHRcdGNyZWF0ZURyYWdlbmRUaHVtYnMoc2xpZGVzQ29udGFpbmVyLCB0aHVtYnNDb250YWluZXIsIHNsaWRlc0FyciwgdGh1bWJuYWlscyk7XHJcblx0XHR9XHJcblxyXG5cdH1cclxuXHJcblx0ZnVuY3Rpb24gY3JlYXRlRHJhZ2VuZFRodW1icyhzbGlkZXNDb250YWluZXIsIHRodW1ic0NvbnRhaW5lciwgdGh1bWJzQXJyLCB0aHVtYnNUeXBlKXtcclxuXHRcdGpRdWVyeS5lYWNoKCB0aHVtYnNBcnIsIGZ1bmN0aW9uKCBpbmRleCwgdGh1bWIgKXtcclxuXHJcblx0XHRcdHZhciB0aGlzVGh1bWIgPSBqUXVlcnkoJzxkaXYgY2xhc3M9XCJkcmFnZW5kLXRodW1iIGRyYWdlbmQtcGFnZVwiIGRhdGEtcGFnZT1cIicrKGluZGV4KzEpKydcIj48L2Rpdj4nKTtcclxuXHRcdFx0dGhpc1RodW1iLmFwcGVuZFRvKGpRdWVyeSh0aHVtYnNDb250YWluZXIpKTtcclxuXHJcblx0XHRcdGlmKHRodW1ic1R5cGUgPT0gXCJ0aHVtYm5haWxzXCIpe1xyXG5cdFx0XHRcdHNldEJnSW1nKHRoaXNUaHVtYiwgdGh1bWJbMF0sIFwic3F1YXJlXCIpO1xyXG5cdFx0XHR9XHJcblx0XHRcdGVsc2UgaWYodGh1bWJzVHlwZSA9PSBcImJ1dHRvbnNcIil7XHJcblx0XHRcdFx0Ly9hZGQgYnV0dG9uIHN1cHBvcnRcclxuXHRcdFx0fVxyXG5cclxuXHRcdH0pO1xyXG5cclxuXHRcdGluaXREcmFnZW5kVGh1bWJzKHNsaWRlc0NvbnRhaW5lciwgdGh1bWJzQ29udGFpbmVyKTtcclxuXHR9XHJcblxyXG5cdGZ1bmN0aW9uIGluaXREcmFnZW5kVGh1bWJzKHNsaWRlc0NvbnRhaW5lciwgdGh1bWJzQ29udGFpbmVyKXtcclxuXHJcblx0XHRqUXVlcnkodGh1bWJzQ29udGFpbmVyKS5jbGljayhmdW5jdGlvbihldmVudCkge1xyXG5cdFx0XHR2YXIgcGFnZSA9IGpRdWVyeShldmVudC50YXJnZXQpLmRhdGEoXCJwYWdlXCIpO1xyXG5cclxuXHRcdFx0alF1ZXJ5KHNsaWRlc0NvbnRhaW5lcikuZHJhZ2VuZCh7XHJcblx0XHRcdFx0c2Nyb2xsVG9QYWdlOiBwYWdlXHJcblx0XHRcdH0pO1xyXG5cdFx0fSk7XHJcblxyXG5cdFx0c2V0VGh1bWJzUGVyUGFnZSgpO1xyXG5cclxuXHJcblx0fVxyXG5cclxuXHRmdW5jdGlvbiBzZXRUaHVtYnNQZXJQYWdlKCl7XHJcblxyXG5cdFx0Ly9TaG93IGFzIG1hbnkgdGh1bWJzIGFzIHdpbGwgZml0IG9uIHRoZSBzY3JlZW5cclxuXHQgICAgdmFyIGl0ZW1zSW5QYWdlID0gdmlld1dpZHRoIC8galF1ZXJ5KCBcIiN0aHVtYnNDb250YWluZXIgLmRyYWdlbmQtcGFnZVwiKS53aWR0aCgpO1xyXG5cdCAgICAvL2NvbnNvbGUubG9nKFwiSXRlbXNJblBhZ2U6IFwiICsgaXRlbXNJblBhZ2UpO1xuXHRcdGpRdWVyeShcIiN0aHVtYnNDb250YWluZXJcIikuZHJhZ2VuZCh7XHJcblx0ICAgIFx0aXRlbXNJblBhZ2U6IGl0ZW1zSW5QYWdlLFxyXG5cdCAgICAgICAgb25Td2lwZUVuZDogZnVuY3Rpb24oKSB7XHJcblx0ICAgICAgICBcdHN0b3BUaHVtYnNPdmVyc2Nyb2xsKCk7XHJcblx0ICAgICAgICB9XHJcbiAgICAgICAgfSk7XHJcblx0fVxyXG5cclxuXHRmdW5jdGlvbiBzdG9wVGh1bWJzT3ZlcnNjcm9sbCgpe1xyXG5cdFx0dmFyIGxhc3RUaHVtYiA9IGpRdWVyeSgnI3RodW1ic0NvbnRhaW5lciAuZHJhZ2VuZC10aHVtYjpsYXN0LWNoaWxkJyk7XHJcbiAgICBcdHZhciBsYXN0VGh1bWJXaWR0aCA9IHdpZHRoKGxhc3RUaHVtYik7XHJcbiAgICBcdHZhciBsYXN0VGh1bWJPZmZzZXRMZWZ0ID0gbGFzdFRodW1iLnBvc2l0aW9uKCkubGVmdDtcclxuICAgIFx0dmFyIGxhc3RUaHVtYk9mZnNldFJpZ2h0ID0gbGFzdFRodW1iLnBvc2l0aW9uKCkubGVmdCArIGxhc3RUaHVtYldpZHRoO1xyXG4gICAgXHR2YXIgdGh1bWJzQ29udGFpbmVyID0galF1ZXJ5KFwiI3RodW1ic0NvbnRhaW5lciBkaXY6Zmlyc3QtY2hpbGRcIik7XHJcbiAgICBcdHZhciB0aHVtYnNDb250YWluZXJXaWR0aCA9IHdpZHRoKHRodW1ic0NvbnRhaW5lcik7XHJcbiAgICBcdHZhciB0aHVtYnNDb250YWluZXJCaWdnZXJCeSA9ICB0aHVtYnNDb250YWluZXJXaWR0aCAtIHZpZXdXaWR0aDtcclxuICAgIFx0aWYgKCB0aHVtYnNDb250YWluZXJXaWR0aCA+IHZpZXdXaWR0aCl7XHJcbiAgICBcdFx0aWYoIGxhc3RUaHVtYk9mZnNldFJpZ2h0IDwgdmlld1dpZHRoKXtcclxuICAgIFx0XHRcdHRodW1ic0NvbnRhaW5lci5jc3MoJ3RyYW5zZm9ybScsICd0cmFuc2xhdGVYKC0nICsgdGh1bWJzQ29udGFpbmVyQmlnZ2VyQnkgKyAncHgpJyk7XHJcbiAgICBcdFx0fVxyXG4gICAgXHRcdGlmKCB0aHVtYnNDb250YWluZXIucG9zaXRpb24oKS5sZWZ0ID4gMCl7XHJcbiAgICBcdFx0XHR0aHVtYnNDb250YWluZXIuY3NzKCd0cmFuc2Zvcm0nLCAndHJhbnNsYXRlWCgwcHgpJyk7XHJcbiAgICBcdFx0fVxyXG4gICAgXHR9XHJcblxyXG5cdH1cclxuXHJcblx0ZnVuY3Rpb24gY2VudGVyRHJhZ2VuZFRodW1icygpe1xyXG5cdFx0alF1ZXJ5KCcjdGh1bWJzQ29udGFpbmVyJykuY3NzKCdtYXJnaW4tbGVmdCcsIDApO1xyXG5cclxuXHRcdFx0dmFyIHRodW1iT2Zmc2V0ID0gKCB2aWV3V2lkdGggLSAoIGpRdWVyeSgnLmRyYWdlbmQtdGh1bWInKS5sZW5ndGggKiBqUXVlcnkoJy5kcmFnZW5kLXRodW1iJykud2lkdGgoKSApICkgLyAyO1xyXG5cdFx0ICAgIGlmICh0aHVtYk9mZnNldCA8IDAgKXt0aHVtYk9mZnNldCA9IDA7fVxyXG5cclxuXHQgICAgalF1ZXJ5KCcjdGh1bWJzQ29udGFpbmVyJykuY3NzKCdtYXJnaW4tbGVmdCcsIHRodW1iT2Zmc2V0KTtcclxuXHR9XHJcblxyXG5cdGZ1bmN0aW9uIGxvYWREcmFnZW5kU2xpZGVDb250ZW50KHRoaXNTbGlkZSwgc2xpZGVDb250ZW50LCBzbGlkZVR5cGUpe1xyXG5cdFx0aWYgKHNsaWRlVHlwZSA9PT0gXCJpbWFnZXNcIil7XHJcblx0XHRcdHNldEJnSW1nKHRoaXNTbGlkZSwgc2xpZGVDb250ZW50WzBdLCBzbGlkZUNvbnRlbnRbMV0pO1xyXG5cdFx0fVxyXG5cdH1cclxuXHJcbiIsIi8qKlxyXG4gKiBGZWF0aGVybGlnaHQgLSB1bHRyYSBzbGltIGpRdWVyeSBsaWdodGJveFxyXG4gKiBWZXJzaW9uIDEuNC4xIC0gaHR0cDovL25vZWxib3NzLmdpdGh1Yi5pby9mZWF0aGVybGlnaHQvXHJcbiAqXHJcbiAqIENvcHlyaWdodCAyMDE2LCBOb8OrbCBSYW91bCBCb3NzYXJ0IChodHRwOi8vd3d3Lm5vZWxib3NzLmNvbSlcclxuICogTUlUIExpY2Vuc2VkLlxyXG4qKi9cclxuKGZ1bmN0aW9uKCQpIHtcclxuXHRcInVzZSBzdHJpY3RcIjtcclxuXHJcblx0aWYoJ3VuZGVmaW5lZCcgPT09IHR5cGVvZiAkKSB7XHJcblx0XHRpZignY29uc29sZScgaW4gd2luZG93KXsgd2luZG93LmNvbnNvbGUuaW5mbygnVG9vIG11Y2ggbGlnaHRuZXNzLCBGZWF0aGVybGlnaHQgbmVlZHMgalF1ZXJ5LicpOyB9XHJcblx0XHRyZXR1cm47XHJcblx0fVxyXG5cclxuXHQvKiBGZWF0aGVybGlnaHQgaXMgZXhwb3J0ZWQgYXMgJC5mZWF0aGVybGlnaHQuXHJcblx0ICAgSXQgaXMgYSBmdW5jdGlvbiB1c2VkIHRvIG9wZW4gYSBmZWF0aGVybGlnaHQgbGlnaHRib3guXHJcblxyXG5cdCAgIFt0ZWNoXVxyXG5cdCAgIEZlYXRoZXJsaWdodCB1c2VzIHByb3RvdHlwZSBpbmhlcml0YW5jZS5cclxuXHQgICBFYWNoIG9wZW5lZCBsaWdodGJveCB3aWxsIGhhdmUgYSBjb3JyZXNwb25kaW5nIG9iamVjdC5cclxuXHQgICBUaGF0IG9iamVjdCBtYXkgaGF2ZSBzb21lIGF0dHJpYnV0ZXMgdGhhdCBvdmVycmlkZSB0aGVcclxuXHQgICBwcm90b3R5cGUncy5cclxuXHQgICBFeHRlbnNpb25zIGNyZWF0ZWQgd2l0aCBGZWF0aGVybGlnaHQuZXh0ZW5kIHdpbGwgaGF2ZSB0aGVpclxyXG5cdCAgIG93biBwcm90b3R5cGUgdGhhdCBpbmhlcml0cyBmcm9tIEZlYXRoZXJsaWdodCdzIHByb3RvdHlwZSxcclxuXHQgICB0aHVzIGF0dHJpYnV0ZXMgY2FuIGJlIG92ZXJyaWRlbiBlaXRoZXIgYXQgdGhlIG9iamVjdCBsZXZlbCxcclxuXHQgICBvciBhdCB0aGUgZXh0ZW5zaW9uIGxldmVsLlxyXG5cdCAgIFRvIGNyZWF0ZSBjYWxsYmFja3MgdGhhdCBjaGFpbiB0aGVtc2VsdmVzIGluc3RlYWQgb2Ygb3ZlcnJpZGluZyxcclxuXHQgICB1c2UgY2hhaW5DYWxsYmFja3MuXHJcblx0ICAgRm9yIHRob3NlIGZhbWlsaWFyIHdpdGggQ29mZmVlU2NyaXB0LCB0aGlzIGNvcnJlc3BvbmQgdG9cclxuXHQgICBGZWF0aGVybGlnaHQgYmVpbmcgYSBjbGFzcyBhbmQgdGhlIEdhbGxlcnkgYmVpbmcgYSBjbGFzc1xyXG5cdCAgIGV4dGVuZGluZyBGZWF0aGVybGlnaHQuXHJcblx0ICAgVGhlIGNoYWluQ2FsbGJhY2tzIGlzIHVzZWQgc2luY2Ugd2UgZG9uJ3QgaGF2ZSBhY2Nlc3MgdG9cclxuXHQgICBDb2ZmZWVTY3JpcHQncyBgc3VwZXJgLlxyXG5cdCovXHJcblxyXG5cdGZ1bmN0aW9uIEZlYXRoZXJsaWdodCgkY29udGVudCwgY29uZmlnKSB7XHJcblx0XHRpZih0aGlzIGluc3RhbmNlb2YgRmVhdGhlcmxpZ2h0KSB7ICAvKiBjYWxsZWQgd2l0aCBuZXcgKi9cclxuXHRcdFx0dGhpcy5pZCA9IEZlYXRoZXJsaWdodC5pZCsrO1xyXG5cdFx0XHR0aGlzLnNldHVwKCRjb250ZW50LCBjb25maWcpO1xyXG5cdFx0XHR0aGlzLmNoYWluQ2FsbGJhY2tzKEZlYXRoZXJsaWdodC5fY2FsbGJhY2tDaGFpbik7XHJcblx0XHR9IGVsc2Uge1xyXG5cdFx0XHR2YXIgZmwgPSBuZXcgRmVhdGhlcmxpZ2h0KCRjb250ZW50LCBjb25maWcpO1xyXG5cdFx0XHRmbC5vcGVuKCk7XHJcblx0XHRcdHJldHVybiBmbDtcclxuXHRcdH1cclxuXHR9XHJcblxyXG5cdHZhciBvcGVuZWQgPSBbXSxcclxuXHRcdHBydW5lT3BlbmVkID0gZnVuY3Rpb24ocmVtb3ZlKSB7XHJcblx0XHRcdG9wZW5lZCA9ICQuZ3JlcChvcGVuZWQsIGZ1bmN0aW9uKGZsKSB7XHJcblx0XHRcdFx0cmV0dXJuIGZsICE9PSByZW1vdmUgJiYgZmwuJGluc3RhbmNlLmNsb3Nlc3QoJ2JvZHknKS5sZW5ndGggPiAwO1xyXG5cdFx0XHR9ICk7XHJcblx0XHRcdHJldHVybiBvcGVuZWQ7XHJcblx0XHR9O1xyXG5cclxuXHQvLyBzdHJ1Y3R1cmUoe2lmcmFtZU1pbkhlaWdodDogNDQsIGZvbzogMH0sICdpZnJhbWUnKVxyXG5cdC8vICAgIz0+IHttaW4taGVpZ2h0OiA0NH1cclxuXHR2YXIgc3RydWN0dXJlID0gZnVuY3Rpb24ob2JqLCBwcmVmaXgpIHtcclxuXHRcdHZhciByZXN1bHQgPSB7fSxcclxuXHRcdFx0cmVnZXggPSBuZXcgUmVnRXhwKCdeJyArIHByZWZpeCArICcoW0EtWl0pKC4qKScpO1xyXG5cdFx0Zm9yICh2YXIga2V5IGluIG9iaikge1xyXG5cdFx0XHR2YXIgbWF0Y2ggPSBrZXkubWF0Y2gocmVnZXgpO1xyXG5cdFx0XHRpZiAobWF0Y2gpIHtcclxuXHRcdFx0XHR2YXIgZGFzaGVyaXplZCA9IChtYXRjaFsxXSArIG1hdGNoWzJdLnJlcGxhY2UoLyhbQS1aXSkvZywgJy0kMScpKS50b0xvd2VyQ2FzZSgpO1xyXG5cdFx0XHRcdHJlc3VsdFtkYXNoZXJpemVkXSA9IG9ialtrZXldO1xyXG5cdFx0XHR9XHJcblx0XHR9XHJcblx0XHRyZXR1cm4gcmVzdWx0O1xyXG5cdH07XHJcblxyXG5cdC8qIGRvY3VtZW50IHdpZGUga2V5IGhhbmRsZXIgKi9cclxuXHR2YXIgZXZlbnRNYXAgPSB7IGtleXVwOiAnb25LZXlVcCcsIHJlc2l6ZTogJ29uUmVzaXplJyB9O1xyXG5cclxuXHR2YXIgZ2xvYmFsRXZlbnRIYW5kbGVyID0gZnVuY3Rpb24oZXZlbnQpIHtcclxuXHRcdCQuZWFjaChGZWF0aGVybGlnaHQub3BlbmVkKCkucmV2ZXJzZSgpLCBmdW5jdGlvbigpIHtcclxuXHRcdFx0aWYgKCFldmVudC5pc0RlZmF1bHRQcmV2ZW50ZWQoKSkge1xyXG5cdFx0XHRcdGlmIChmYWxzZSA9PT0gdGhpc1tldmVudE1hcFtldmVudC50eXBlXV0oZXZlbnQpKSB7XHJcblx0XHRcdFx0XHRldmVudC5wcmV2ZW50RGVmYXVsdCgpOyBldmVudC5zdG9wUHJvcGFnYXRpb24oKTsgcmV0dXJuIGZhbHNlO1xyXG5cdFx0XHQgIH1cclxuXHRcdFx0fVxyXG5cdFx0fSk7XHJcblx0fTtcclxuXHJcblx0dmFyIHRvZ2dsZUdsb2JhbEV2ZW50cyA9IGZ1bmN0aW9uKHNldCkge1xyXG5cdFx0XHRpZihzZXQgIT09IEZlYXRoZXJsaWdodC5fZ2xvYmFsSGFuZGxlckluc3RhbGxlZCkge1xyXG5cdFx0XHRcdEZlYXRoZXJsaWdodC5fZ2xvYmFsSGFuZGxlckluc3RhbGxlZCA9IHNldDtcclxuXHRcdFx0XHR2YXIgZXZlbnRzID0gJC5tYXAoZXZlbnRNYXAsIGZ1bmN0aW9uKF8sIG5hbWUpIHsgcmV0dXJuIG5hbWUrJy4nK0ZlYXRoZXJsaWdodC5wcm90b3R5cGUubmFtZXNwYWNlOyB9ICkuam9pbignICcpO1xyXG5cdFx0XHRcdCQod2luZG93KVtzZXQgPyAnb24nIDogJ29mZiddKGV2ZW50cywgZ2xvYmFsRXZlbnRIYW5kbGVyKTtcclxuXHRcdFx0fVxyXG5cdFx0fTtcclxuXHJcblx0RmVhdGhlcmxpZ2h0LnByb3RvdHlwZSA9IHtcclxuXHRcdGNvbnN0cnVjdG9yOiBGZWF0aGVybGlnaHQsXHJcblx0XHQvKioqIGRlZmF1bHRzICoqKi9cclxuXHRcdC8qIGV4dGVuZCBmZWF0aGVybGlnaHQgd2l0aCBkZWZhdWx0cyBhbmQgbWV0aG9kcyAqL1xyXG5cdFx0bmFtZXNwYWNlOiAgICAgICdmZWF0aGVybGlnaHQnLCAgICAgICAgLyogTmFtZSBvZiB0aGUgZXZlbnRzIGFuZCBjc3MgY2xhc3MgcHJlZml4ICovXHJcblx0XHR0YXJnZXRBdHRyOiAgICAgJ2RhdGEtZmVhdGhlcmxpZ2h0JywgICAvKiBBdHRyaWJ1dGUgb2YgdGhlIHRyaWdnZXJlZCBlbGVtZW50IHRoYXQgY29udGFpbnMgdGhlIHNlbGVjdG9yIHRvIHRoZSBsaWdodGJveCBjb250ZW50ICovXHJcblx0XHR2YXJpYW50OiAgICAgICAgbnVsbCwgICAgICAgICAgICAgICAgICAvKiBDbGFzcyB0aGF0IHdpbGwgYmUgYWRkZWQgdG8gY2hhbmdlIGxvb2sgb2YgdGhlIGxpZ2h0Ym94ICovXHJcblx0XHRyZXNldENzczogICAgICAgZmFsc2UsICAgICAgICAgICAgICAgICAvKiBSZXNldCBhbGwgY3NzICovXHJcblx0XHRiYWNrZ3JvdW5kOiAgICAgbnVsbCwgICAgICAgICAgICAgICAgICAvKiBDdXN0b20gRE9NIGZvciB0aGUgYmFja2dyb3VuZCwgd3JhcHBlciBhbmQgdGhlIGNsb3NlYnV0dG9uICovXHJcblx0XHRvcGVuVHJpZ2dlcjogICAgJ2NsaWNrJywgICAgICAgICAgICAgICAvKiBFdmVudCB0aGF0IHRyaWdnZXJzIHRoZSBsaWdodGJveCAqL1xyXG5cdFx0Y2xvc2VUcmlnZ2VyOiAgICdjbGljaycsICAgICAgICAgICAgICAgLyogRXZlbnQgdGhhdCB0cmlnZ2VycyB0aGUgY2xvc2luZyBvZiB0aGUgbGlnaHRib3ggKi9cclxuXHRcdGZpbHRlcjogICAgICAgICBudWxsLCAgICAgICAgICAgICAgICAgIC8qIFNlbGVjdG9yIHRvIGZpbHRlciBldmVudHMuIFRoaW5rICQoLi4uKS5vbignY2xpY2snLCBmaWx0ZXIsIGV2ZW50SGFuZGxlcikgKi9cclxuXHRcdHJvb3Q6ICAgICAgICAgICAnYm9keScsICAgICAgICAgICAgICAgIC8qIFdoZXJlIHRvIGFwcGVuZCBmZWF0aGVybGlnaHRzICovXHJcblx0XHRvcGVuU3BlZWQ6ICAgICAgMjUwLCAgICAgICAgICAgICAgICAgICAvKiBEdXJhdGlvbiBvZiBvcGVuaW5nIGFuaW1hdGlvbiAqL1xyXG5cdFx0Y2xvc2VTcGVlZDogICAgIDI1MCwgICAgICAgICAgICAgICAgICAgLyogRHVyYXRpb24gb2YgY2xvc2luZyBhbmltYXRpb24gKi9cclxuXHRcdGNsb3NlT25DbGljazogICAnYmFja2dyb3VuZCcsICAgICAgICAgIC8qIENsb3NlIGxpZ2h0Ym94IG9uIGNsaWNrICgnYmFja2dyb3VuZCcsICdhbnl3aGVyZScgb3IgZmFsc2UpICovXHJcblx0XHRjbG9zZU9uRXNjOiAgICAgdHJ1ZSwgICAgICAgICAgICAgICAgICAvKiBDbG9zZSBsaWdodGJveCB3aGVuIHByZXNzaW5nIGVzYyAqL1xyXG5cdFx0Y2xvc2VJY29uOiAgICAgICcmIzEwMDA1OycsICAgICAgICAgICAgLyogQ2xvc2UgaWNvbiAqL1xyXG5cdFx0bG9hZGluZzogICAgICAgICcnLCAgICAgICAgICAgICAgICAgICAgLyogQ29udGVudCB0byBzaG93IHdoaWxlIGluaXRpYWwgY29udGVudCBpcyBsb2FkaW5nICovXHJcblx0XHRwZXJzaXN0OiAgICAgICAgZmFsc2UsICAgICAgICAgICAgICAgICAvKiBJZiBzZXQsIHRoZSBjb250ZW50IHdpbGwgcGVyc2lzdCBhbmQgd2lsbCBiZSBzaG93biBhZ2FpbiB3aGVuIG9wZW5lZCBhZ2Fpbi4gJ3NoYXJlZCcgaXMgYSBzcGVjaWFsIHZhbHVlIHdoZW4gYmluZGluZyBtdWx0aXBsZSBlbGVtZW50cyBmb3IgdGhlbSB0byBzaGFyZSB0aGUgc2FtZSBjb250ZW50ICovXHJcblx0XHRvdGhlckNsb3NlOiAgICAgbnVsbCwgICAgICAgICAgICAgICAgICAvKiBTZWxlY3RvciBmb3IgYWx0ZXJuYXRlIGNsb3NlIGJ1dHRvbnMgKGUuZy4gXCJhLmNsb3NlXCIpICovXHJcblx0XHRiZWZvcmVPcGVuOiAgICAgJC5ub29wLCAgICAgICAgICAgICAgICAvKiBDYWxsZWQgYmVmb3JlIG9wZW4uIGNhbiByZXR1cm4gZmFsc2UgdG8gcHJldmVudCBvcGVuaW5nIG9mIGxpZ2h0Ym94LiBHZXRzIGV2ZW50IGFzIHBhcmFtZXRlciwgdGhpcyBjb250YWlucyBhbGwgZGF0YSAqL1xyXG5cdFx0YmVmb3JlQ29udGVudDogICQubm9vcCwgICAgICAgICAgICAgICAgLyogQ2FsbGVkIHdoZW4gY29udGVudCBpcyBsb2FkZWQuIEdldHMgZXZlbnQgYXMgcGFyYW1ldGVyLCB0aGlzIGNvbnRhaW5zIGFsbCBkYXRhICovXHJcblx0XHRiZWZvcmVDbG9zZTogICAgJC5ub29wLCAgICAgICAgICAgICAgICAvKiBDYWxsZWQgYmVmb3JlIGNsb3NlLiBjYW4gcmV0dXJuIGZhbHNlIHRvIHByZXZlbnQgb3BlbmluZyBvZiBsaWdodGJveC4gR2V0cyBldmVudCBhcyBwYXJhbWV0ZXIsIHRoaXMgY29udGFpbnMgYWxsIGRhdGEgKi9cclxuXHRcdGFmdGVyT3BlbjogICAgICAkLm5vb3AsICAgICAgICAgICAgICAgIC8qIENhbGxlZCBhZnRlciBvcGVuLiBHZXRzIGV2ZW50IGFzIHBhcmFtZXRlciwgdGhpcyBjb250YWlucyBhbGwgZGF0YSAqL1xyXG5cdFx0YWZ0ZXJDb250ZW50OiAgICQubm9vcCwgICAgICAgICAgICAgICAgLyogQ2FsbGVkIGFmdGVyIGNvbnRlbnQgaXMgcmVhZHkgYW5kIGhhcyBiZWVuIHNldC4gR2V0cyBldmVudCBhcyBwYXJhbWV0ZXIsIHRoaXMgY29udGFpbnMgYWxsIGRhdGEgKi9cclxuXHRcdGFmdGVyQ2xvc2U6ICAgICAkLm5vb3AsICAgICAgICAgICAgICAgIC8qIENhbGxlZCBhZnRlciBjbG9zZS4gR2V0cyBldmVudCBhcyBwYXJhbWV0ZXIsIHRoaXMgY29udGFpbnMgYWxsIGRhdGEgKi9cclxuXHRcdG9uS2V5VXA6ICAgICAgICAkLm5vb3AsICAgICAgICAgICAgICAgIC8qIENhbGxlZCBvbiBrZXkgdXAgZm9yIHRoZSBmcm9udG1vc3QgZmVhdGhlcmxpZ2h0ICovXHJcblx0XHRvblJlc2l6ZTogICAgICAgJC5ub29wLCAgICAgICAgICAgICAgICAvKiBDYWxsZWQgYWZ0ZXIgbmV3IGNvbnRlbnQgYW5kIHdoZW4gYSB3aW5kb3cgaXMgcmVzaXplZCAqL1xyXG5cdFx0dHlwZTogICAgICAgICAgIG51bGwsICAgICAgICAgICAgICAgICAgLyogU3BlY2lmeSB0eXBlIG9mIGxpZ2h0Ym94LiBJZiB1bnNldCwgaXQgd2lsbCBjaGVjayBmb3IgdGhlIHRhcmdldEF0dHJzIHZhbHVlLiAqL1xyXG5cdFx0Y29udGVudEZpbHRlcnM6IFsnanF1ZXJ5JywgJ2ltYWdlJywgJ2h0bWwnLCAnYWpheCcsICdpZnJhbWUnLCAndGV4dCddLCAvKiBMaXN0IG9mIGNvbnRlbnQgZmlsdGVycyB0byB1c2UgdG8gZGV0ZXJtaW5lIHRoZSBjb250ZW50ICovXHJcblxyXG5cdFx0LyoqKiBtZXRob2RzICoqKi9cclxuXHRcdC8qIHNldHVwIGl0ZXJhdGVzIG92ZXIgYSBzaW5nbGUgaW5zdGFuY2Ugb2YgZmVhdGhlcmxpZ2h0IGFuZCBwcmVwYXJlcyB0aGUgYmFja2dyb3VuZCBhbmQgYmluZHMgdGhlIGV2ZW50cyAqL1xyXG5cdFx0c2V0dXA6IGZ1bmN0aW9uKHRhcmdldCwgY29uZmlnKXtcclxuXHRcdFx0LyogYWxsIGFyZ3VtZW50cyBhcmUgb3B0aW9uYWwgKi9cclxuXHRcdFx0aWYgKHR5cGVvZiB0YXJnZXQgPT09ICdvYmplY3QnICYmIHRhcmdldCBpbnN0YW5jZW9mICQgPT09IGZhbHNlICYmICFjb25maWcpIHtcclxuXHRcdFx0XHRjb25maWcgPSB0YXJnZXQ7XHJcblx0XHRcdFx0dGFyZ2V0ID0gdW5kZWZpbmVkO1xyXG5cdFx0XHR9XHJcblxyXG5cdFx0XHR2YXIgc2VsZiA9ICQuZXh0ZW5kKHRoaXMsIGNvbmZpZywge3RhcmdldDogdGFyZ2V0fSksXHJcblx0XHRcdFx0Y3NzID0gIXNlbGYucmVzZXRDc3MgPyBzZWxmLm5hbWVzcGFjZSA6IHNlbGYubmFtZXNwYWNlKyctcmVzZXQnLCAvKiBieSBhZGRpbmcgLXJlc2V0IHRvIHRoZSBjbGFzc25hbWUsIHdlIHJlc2V0IGFsbCB0aGUgZGVmYXVsdCBjc3MgKi9cclxuXHRcdFx0XHQkYmFja2dyb3VuZCA9ICQoc2VsZi5iYWNrZ3JvdW5kIHx8IFtcclxuXHRcdFx0XHRcdCc8ZGl2IGNsYXNzPVwiJytjc3MrJy1sb2FkaW5nICcrY3NzKydcIj4nLFxyXG5cdFx0XHRcdFx0XHQnPGRpdiBjbGFzcz1cIicrY3NzKyctY29udGVudFwiPicsXHJcblx0XHRcdFx0XHRcdFx0JzxzcGFuIGNsYXNzPVwiJytjc3MrJy1jbG9zZS1pY29uICcrIHNlbGYubmFtZXNwYWNlICsgJy1jbG9zZVwiPicsXHJcblx0XHRcdFx0XHRcdFx0XHRzZWxmLmNsb3NlSWNvbixcclxuXHRcdFx0XHRcdFx0XHQnPC9zcGFuPicsXHJcblx0XHRcdFx0XHRcdFx0JzxkaXYgY2xhc3M9XCInK3NlbGYubmFtZXNwYWNlKyctaW5uZXJcIj4nICsgc2VsZi5sb2FkaW5nICsgJzwvZGl2PicsXHJcblx0XHRcdFx0XHRcdCc8L2Rpdj4nLFxyXG5cdFx0XHRcdFx0JzwvZGl2PiddLmpvaW4oJycpKSxcclxuXHRcdFx0XHRjbG9zZUJ1dHRvblNlbGVjdG9yID0gJy4nK3NlbGYubmFtZXNwYWNlKyctY2xvc2UnICsgKHNlbGYub3RoZXJDbG9zZSA/ICcsJyArIHNlbGYub3RoZXJDbG9zZSA6ICcnKTtcclxuXHJcblx0XHRcdHNlbGYuJGluc3RhbmNlID0gJGJhY2tncm91bmQuY2xvbmUoKS5hZGRDbGFzcyhzZWxmLnZhcmlhbnQpOyAvKiBjbG9uZSBET00gZm9yIHRoZSBiYWNrZ3JvdW5kLCB3cmFwcGVyIGFuZCB0aGUgY2xvc2UgYnV0dG9uICovXHJcblxyXG5cdFx0XHQvKiBjbG9zZSB3aGVuIGNsaWNrIG9uIGJhY2tncm91bmQvYW55d2hlcmUvbnVsbCBvciBjbG9zZWJveCAqL1xyXG5cdFx0XHRzZWxmLiRpbnN0YW5jZS5vbihzZWxmLmNsb3NlVHJpZ2dlcisnLicrc2VsZi5uYW1lc3BhY2UsIGZ1bmN0aW9uKGV2ZW50KSB7XHJcblx0XHRcdFx0dmFyICR0YXJnZXQgPSAkKGV2ZW50LnRhcmdldCk7XHJcblx0XHRcdFx0aWYoICgnYmFja2dyb3VuZCcgPT09IHNlbGYuY2xvc2VPbkNsaWNrICAmJiAkdGFyZ2V0LmlzKCcuJytzZWxmLm5hbWVzcGFjZSkpXHJcblx0XHRcdFx0XHR8fCAnYW55d2hlcmUnID09PSBzZWxmLmNsb3NlT25DbGlja1xyXG5cdFx0XHRcdFx0fHwgJHRhcmdldC5jbG9zZXN0KGNsb3NlQnV0dG9uU2VsZWN0b3IpLmxlbmd0aCApe1xyXG5cdFx0XHRcdFx0c2VsZi5jbG9zZShldmVudCk7XHJcblx0XHRcdFx0XHRldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0fSk7XHJcblxyXG5cdFx0XHRyZXR1cm4gdGhpcztcclxuXHRcdH0sXHJcblxyXG5cdFx0LyogdGhpcyBtZXRob2QgcHJlcGFyZXMgdGhlIGNvbnRlbnQgYW5kIGNvbnZlcnRzIGl0IGludG8gYSBqUXVlcnkgb2JqZWN0IG9yIGEgcHJvbWlzZSAqL1xyXG5cdFx0Z2V0Q29udGVudDogZnVuY3Rpb24oKXtcclxuXHRcdFx0aWYodGhpcy5wZXJzaXN0ICE9PSBmYWxzZSAmJiB0aGlzLiRjb250ZW50KSB7XHJcblx0XHRcdFx0cmV0dXJuIHRoaXMuJGNvbnRlbnQ7XHJcblx0XHRcdH1cclxuXHRcdFx0dmFyIHNlbGYgPSB0aGlzLFxyXG5cdFx0XHRcdGZpbHRlcnMgPSB0aGlzLmNvbnN0cnVjdG9yLmNvbnRlbnRGaWx0ZXJzLFxyXG5cdFx0XHRcdHJlYWRUYXJnZXRBdHRyID0gZnVuY3Rpb24obmFtZSl7IHJldHVybiBzZWxmLiRjdXJyZW50VGFyZ2V0ICYmIHNlbGYuJGN1cnJlbnRUYXJnZXQuYXR0cihuYW1lKTsgfSxcclxuXHRcdFx0XHR0YXJnZXRWYWx1ZSA9IHJlYWRUYXJnZXRBdHRyKHNlbGYudGFyZ2V0QXR0ciksXHJcblx0XHRcdFx0ZGF0YSA9IHNlbGYudGFyZ2V0IHx8IHRhcmdldFZhbHVlIHx8ICcnO1xyXG5cclxuXHRcdFx0LyogRmluZCB3aGljaCBmaWx0ZXIgYXBwbGllcyAqL1xyXG5cdFx0XHR2YXIgZmlsdGVyID0gZmlsdGVyc1tzZWxmLnR5cGVdOyAvKiBjaGVjayBleHBsaWNpdCB0eXBlIGxpa2Uge3R5cGU6ICdpbWFnZSd9ICovXHJcblxyXG5cdFx0XHQvKiBjaGVjayBleHBsaWNpdCB0eXBlIGxpa2UgZGF0YS1mZWF0aGVybGlnaHQ9XCJpbWFnZVwiICovXHJcblx0XHRcdGlmKCFmaWx0ZXIgJiYgZGF0YSBpbiBmaWx0ZXJzKSB7XHJcblx0XHRcdFx0ZmlsdGVyID0gZmlsdGVyc1tkYXRhXTtcclxuXHRcdFx0XHRkYXRhID0gc2VsZi50YXJnZXQgJiYgdGFyZ2V0VmFsdWU7XHJcblx0XHRcdH1cclxuXHRcdFx0ZGF0YSA9IGRhdGEgfHwgcmVhZFRhcmdldEF0dHIoJ2hyZWYnKSB8fCAnJztcclxuXHJcblx0XHRcdC8qIGNoZWNrIGV4cGxpY2l0eSB0eXBlICYgY29udGVudCBsaWtlIHtpbWFnZTogJ3Bob3RvLmpwZyd9ICovXHJcblx0XHRcdGlmKCFmaWx0ZXIpIHtcclxuXHRcdFx0XHRmb3IodmFyIGZpbHRlck5hbWUgaW4gZmlsdGVycykge1xyXG5cdFx0XHRcdFx0aWYoc2VsZltmaWx0ZXJOYW1lXSkge1xyXG5cdFx0XHRcdFx0XHRmaWx0ZXIgPSBmaWx0ZXJzW2ZpbHRlck5hbWVdO1xyXG5cdFx0XHRcdFx0XHRkYXRhID0gc2VsZltmaWx0ZXJOYW1lXTtcclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHR9XHJcblx0XHRcdH1cclxuXHJcblx0XHRcdC8qIG90aGVyd2lzZSBpdCdzIGltcGxpY2l0LCBydW4gY2hlY2tzICovXHJcblx0XHRcdGlmKCFmaWx0ZXIpIHtcclxuXHRcdFx0XHR2YXIgdGFyZ2V0ID0gZGF0YTtcclxuXHRcdFx0XHRkYXRhID0gbnVsbDtcclxuXHRcdFx0XHQkLmVhY2goc2VsZi5jb250ZW50RmlsdGVycywgZnVuY3Rpb24oKSB7XHJcblx0XHRcdFx0XHRmaWx0ZXIgPSBmaWx0ZXJzW3RoaXNdO1xyXG5cdFx0XHRcdFx0aWYoZmlsdGVyLnRlc3QpICB7XHJcblx0XHRcdFx0XHRcdGRhdGEgPSBmaWx0ZXIudGVzdCh0YXJnZXQpO1xyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0aWYoIWRhdGEgJiYgZmlsdGVyLnJlZ2V4ICYmIHRhcmdldC5tYXRjaCAmJiB0YXJnZXQubWF0Y2goZmlsdGVyLnJlZ2V4KSkge1xyXG5cdFx0XHRcdFx0XHRkYXRhID0gdGFyZ2V0O1xyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0cmV0dXJuICFkYXRhO1xyXG5cdFx0XHRcdH0pO1xyXG5cdFx0XHRcdGlmKCFkYXRhKSB7XHJcblx0XHRcdFx0XHRpZignY29uc29sZScgaW4gd2luZG93KXsgd2luZG93LmNvbnNvbGUuZXJyb3IoJ0ZlYXRoZXJsaWdodDogbm8gY29udGVudCBmaWx0ZXIgZm91bmQgJyArICh0YXJnZXQgPyAnIGZvciBcIicgKyB0YXJnZXQgKyAnXCInIDogJyAobm8gdGFyZ2V0IHNwZWNpZmllZCknKSk7IH1cclxuXHRcdFx0XHRcdHJldHVybiBmYWxzZTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdH1cclxuXHRcdFx0LyogUHJvY2VzcyBpdCAqL1xyXG5cdFx0XHRyZXR1cm4gZmlsdGVyLnByb2Nlc3MuY2FsbChzZWxmLCBkYXRhKTtcclxuXHRcdH0sXHJcblxyXG5cdFx0Lyogc2V0cyB0aGUgY29udGVudCBvZiAkaW5zdGFuY2UgdG8gJGNvbnRlbnQgKi9cclxuXHRcdHNldENvbnRlbnQ6IGZ1bmN0aW9uKCRjb250ZW50KXtcclxuXHRcdFx0dmFyIHNlbGYgPSB0aGlzO1xyXG5cdFx0XHQvKiB3ZSBuZWVkIGEgc3BlY2lhbCBjbGFzcyBmb3IgdGhlIGlmcmFtZSAqL1xyXG5cdFx0XHRpZigkY29udGVudC5pcygnaWZyYW1lJykgfHwgJCgnaWZyYW1lJywgJGNvbnRlbnQpLmxlbmd0aCA+IDApe1xyXG5cdFx0XHRcdHNlbGYuJGluc3RhbmNlLmFkZENsYXNzKHNlbGYubmFtZXNwYWNlKyctaWZyYW1lJyk7XHJcblx0XHRcdH1cclxuXHJcblx0XHRcdHNlbGYuJGluc3RhbmNlLnJlbW92ZUNsYXNzKHNlbGYubmFtZXNwYWNlKyctbG9hZGluZycpO1xyXG5cclxuXHRcdFx0LyogcmVwbGFjZSBjb250ZW50IGJ5IGFwcGVuZGluZyB0byBleGlzdGluZyBvbmUgYmVmb3JlIGl0IGlzIHJlbW92ZWRcclxuXHRcdFx0ICAgdGhpcyBpbnN1cmVzIHRoYXQgZmVhdGhlcmxpZ2h0LWlubmVyIHJlbWFpbiBhdCB0aGUgc2FtZSByZWxhdGl2ZVxyXG5cdFx0XHRcdCBwb3NpdGlvbiB0byBhbnkgb3RoZXIgaXRlbXMgYWRkZWQgdG8gZmVhdGhlcmxpZ2h0LWNvbnRlbnQgKi9cclxuXHRcdFx0c2VsZi4kaW5zdGFuY2UuZmluZCgnLicrc2VsZi5uYW1lc3BhY2UrJy1pbm5lcicpXHJcblx0XHRcdFx0Lm5vdCgkY29udGVudCkgICAgICAgICAgICAgICAgLyogZXhjbHVkZWQgbmV3IGNvbnRlbnQsIGltcG9ydGFudCBpZiBwZXJzaXN0ZWQgKi9cclxuXHRcdFx0XHQuc2xpY2UoMSkucmVtb3ZlKCkuZW5kKCkgICAgICAvKiBJbiB0aGUgdW5leHBlY3RlZCBldmVudCB3aGVyZSB0aGVyZSBhcmUgbWFueSBpbm5lciBlbGVtZW50cywgcmVtb3ZlIGFsbCBidXQgdGhlIGZpcnN0IG9uZSAqL1xyXG5cdFx0XHRcdC5yZXBsYWNlV2l0aCgkLmNvbnRhaW5zKHNlbGYuJGluc3RhbmNlWzBdLCAkY29udGVudFswXSkgPyAnJyA6ICRjb250ZW50KTtcclxuXHJcblx0XHRcdHNlbGYuJGNvbnRlbnQgPSAkY29udGVudC5hZGRDbGFzcyhzZWxmLm5hbWVzcGFjZSsnLWlubmVyJyk7XHJcblxyXG5cdFx0XHRyZXR1cm4gc2VsZjtcclxuXHRcdH0sXHJcblxyXG5cdFx0Lyogb3BlbnMgdGhlIGxpZ2h0Ym94LiBcInRoaXNcIiBjb250YWlucyAkaW5zdGFuY2Ugd2l0aCB0aGUgbGlnaHRib3gsIGFuZCB3aXRoIHRoZSBjb25maWcuXHJcblx0XHRcdFJldHVybnMgYSBwcm9taXNlIHRoYXQgaXMgcmVzb2x2ZWQgYWZ0ZXIgaXMgc3VjY2Vzc2Z1bGx5IG9wZW5lZC4gKi9cclxuXHRcdG9wZW46IGZ1bmN0aW9uKGV2ZW50KXtcclxuXHRcdFx0dmFyIHNlbGYgPSB0aGlzO1xyXG5cdFx0XHRzZWxmLiRpbnN0YW5jZS5oaWRlKCkuYXBwZW5kVG8oc2VsZi5yb290KTtcclxuXHRcdFx0aWYoKCFldmVudCB8fCAhZXZlbnQuaXNEZWZhdWx0UHJldmVudGVkKCkpXHJcblx0XHRcdFx0JiYgc2VsZi5iZWZvcmVPcGVuKGV2ZW50KSAhPT0gZmFsc2UpIHtcclxuXHJcblx0XHRcdFx0aWYoZXZlbnQpe1xyXG5cdFx0XHRcdFx0ZXZlbnQucHJldmVudERlZmF1bHQoKTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdFx0dmFyICRjb250ZW50ID0gc2VsZi5nZXRDb250ZW50KCk7XHJcblxyXG5cdFx0XHRcdGlmKCRjb250ZW50KSB7XHJcblx0XHRcdFx0XHRvcGVuZWQucHVzaChzZWxmKTtcclxuXHJcblx0XHRcdFx0XHR0b2dnbGVHbG9iYWxFdmVudHModHJ1ZSk7XHJcblxyXG5cdFx0XHRcdFx0c2VsZi4kaW5zdGFuY2UuZmFkZUluKHNlbGYub3BlblNwZWVkKTtcclxuXHRcdFx0XHRcdHNlbGYuYmVmb3JlQ29udGVudChldmVudCk7XHJcblxyXG5cdFx0XHRcdFx0LyogU2V0IGNvbnRlbnQgYW5kIHNob3cgKi9cclxuXHRcdFx0XHRcdHJldHVybiAkLndoZW4oJGNvbnRlbnQpXHJcblx0XHRcdFx0XHRcdC5hbHdheXMoZnVuY3Rpb24oJGNvbnRlbnQpe1xyXG5cdFx0XHRcdFx0XHRcdHNlbGYuc2V0Q29udGVudCgkY29udGVudCk7XHJcblx0XHRcdFx0XHRcdFx0c2VsZi5hZnRlckNvbnRlbnQoZXZlbnQpO1xyXG5cdFx0XHRcdFx0XHR9KVxyXG5cdFx0XHRcdFx0XHQudGhlbihzZWxmLiRpbnN0YW5jZS5wcm9taXNlKCkpXHJcblx0XHRcdFx0XHRcdC8qIENhbGwgYWZ0ZXJPcGVuIGFmdGVyIGZhZGVJbiBpcyBkb25lICovXHJcblx0XHRcdFx0XHRcdC5kb25lKGZ1bmN0aW9uKCl7IHNlbGYuYWZ0ZXJPcGVuKGV2ZW50KTsgfSk7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9XHJcblx0XHRcdHNlbGYuJGluc3RhbmNlLmRldGFjaCgpO1xyXG5cdFx0XHRyZXR1cm4gJC5EZWZlcnJlZCgpLnJlamVjdCgpLnByb21pc2UoKTtcclxuXHRcdH0sXHJcblxyXG5cdFx0LyogY2xvc2VzIHRoZSBsaWdodGJveC4gXCJ0aGlzXCIgY29udGFpbnMgJGluc3RhbmNlIHdpdGggdGhlIGxpZ2h0Ym94LCBhbmQgd2l0aCB0aGUgY29uZmlnXHJcblx0XHRcdHJldHVybnMgYSBwcm9taXNlLCByZXNvbHZlZCBhZnRlciB0aGUgbGlnaHRib3ggaXMgc3VjY2Vzc2Z1bGx5IGNsb3NlZC4gKi9cclxuXHRcdGNsb3NlOiBmdW5jdGlvbihldmVudCl7XHJcblx0XHRcdHZhciBzZWxmID0gdGhpcyxcclxuXHRcdFx0XHRkZWZlcnJlZCA9ICQuRGVmZXJyZWQoKTtcclxuXHJcblx0XHRcdGlmKHNlbGYuYmVmb3JlQ2xvc2UoZXZlbnQpID09PSBmYWxzZSkge1xyXG5cdFx0XHRcdGRlZmVycmVkLnJlamVjdCgpO1xyXG5cdFx0XHR9IGVsc2Uge1xyXG5cclxuXHRcdFx0XHRpZiAoMCA9PT0gcHJ1bmVPcGVuZWQoc2VsZikubGVuZ3RoKSB7XHJcblx0XHRcdFx0XHR0b2dnbGVHbG9iYWxFdmVudHMoZmFsc2UpO1xyXG5cdFx0XHRcdH1cclxuXHJcblx0XHRcdFx0c2VsZi4kaW5zdGFuY2UuZmFkZU91dChzZWxmLmNsb3NlU3BlZWQsZnVuY3Rpb24oKXtcclxuXHRcdFx0XHRcdHNlbGYuJGluc3RhbmNlLmRldGFjaCgpO1xyXG5cdFx0XHRcdFx0c2VsZi5hZnRlckNsb3NlKGV2ZW50KTtcclxuXHRcdFx0XHRcdGRlZmVycmVkLnJlc29sdmUoKTtcclxuXHRcdFx0XHR9KTtcclxuXHRcdFx0fVxyXG5cdFx0XHRyZXR1cm4gZGVmZXJyZWQucHJvbWlzZSgpO1xyXG5cdFx0fSxcclxuXHJcblx0XHQvKiByZXNpemVzIHRoZSBjb250ZW50IHNvIGl0IGZpdHMgaW4gdmlzaWJsZSBhcmVhIGFuZCBrZWVwcyB0aGUgc2FtZSBhc3BlY3QgcmF0aW8uXHJcblx0XHRcdFx0RG9lcyBub3RoaW5nIGlmIGVpdGhlciB0aGUgd2lkdGggb3IgdGhlIGhlaWdodCBpcyBub3Qgc3BlY2lmaWVkLlxyXG5cdFx0XHRcdENhbGxlZCBhdXRvbWF0aWNhbGx5IG9uIHdpbmRvdyByZXNpemUuXHJcblx0XHRcdFx0T3ZlcnJpZGUgaWYgeW91IHdhbnQgZGlmZmVyZW50IGJlaGF2aW9yLiAqL1xyXG5cdFx0cmVzaXplOiBmdW5jdGlvbih3LCBoKSB7XHJcblx0XHRcdGlmICh3ICYmIGgpIHtcclxuXHRcdFx0XHQvKiBSZXNldCBhcHBhcmVudCBpbWFnZSBzaXplIGZpcnN0IHNvIGNvbnRhaW5lciBncm93cyAqL1xyXG5cdFx0XHRcdHRoaXMuJGNvbnRlbnQuY3NzKCd3aWR0aCcsICcnKS5jc3MoJ2hlaWdodCcsICcnKTtcclxuXHRcdFx0XHQvKiBDYWxjdWxhdGUgdGhlIHdvcnN0IHJhdGlvIHNvIHRoYXQgZGltZW5zaW9ucyBmaXQgKi9cclxuXHRcdFx0XHR2YXIgcmF0aW8gPSBNYXRoLm1heChcclxuXHRcdFx0XHRcdHcgIC8gcGFyc2VJbnQodGhpcy4kY29udGVudC5wYXJlbnQoKS5jc3MoJ3dpZHRoJyksMTApLFxyXG5cdFx0XHRcdFx0aCAvIHBhcnNlSW50KHRoaXMuJGNvbnRlbnQucGFyZW50KCkuY3NzKCdoZWlnaHQnKSwxMCkpO1xyXG5cdFx0XHRcdC8qIFJlc2l6ZSBjb250ZW50ICovXHJcblx0XHRcdFx0aWYgKHJhdGlvID4gMSkge1xyXG5cdFx0XHRcdFx0dGhpcy4kY29udGVudC5jc3MoJ3dpZHRoJywgJycgKyB3IC8gcmF0aW8gKyAncHgnKS5jc3MoJ2hlaWdodCcsICcnICsgaCAvIHJhdGlvICsgJ3B4Jyk7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9XHJcblx0XHR9LFxyXG5cclxuXHRcdC8qIFV0aWxpdHkgZnVuY3Rpb24gdG8gY2hhaW4gY2FsbGJhY2tzXHJcblx0XHQgICBbV2FybmluZzogZ3VydS1sZXZlbF1cclxuXHRcdCAgIFVzZWQgYmUgZXh0ZW5zaW9ucyB0aGF0IHdhbnQgdG8gbGV0IHVzZXJzIHNwZWNpZnkgY2FsbGJhY2tzIGJ1dFxyXG5cdFx0ICAgYWxzbyBuZWVkIHRoZW1zZWx2ZXMgdG8gdXNlIHRoZSBjYWxsYmFja3MuXHJcblx0XHQgICBUaGUgYXJndW1lbnQgJ2NoYWluJyBoYXMgY2FsbGJhY2sgbmFtZXMgYXMga2V5cyBhbmQgZnVuY3Rpb24oc3VwZXIsIGV2ZW50KVxyXG5cdFx0ICAgYXMgdmFsdWVzLiBUaGF0IGZ1bmN0aW9uIGlzIG1lYW50IHRvIGNhbGwgYHN1cGVyYCBhdCBzb21lIHBvaW50LlxyXG5cdFx0Ki9cclxuXHRcdGNoYWluQ2FsbGJhY2tzOiBmdW5jdGlvbihjaGFpbikge1xyXG5cdFx0XHRmb3IgKHZhciBuYW1lIGluIGNoYWluKSB7XHJcblx0XHRcdFx0dGhpc1tuYW1lXSA9ICQucHJveHkoY2hhaW5bbmFtZV0sIHRoaXMsICQucHJveHkodGhpc1tuYW1lXSwgdGhpcykpO1xyXG5cdFx0XHR9XHJcblx0XHR9XHJcblx0fTtcclxuXHJcblx0JC5leHRlbmQoRmVhdGhlcmxpZ2h0LCB7XHJcblx0XHRpZDogMCwgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvKiBVc2VkIHRvIGlkIHNpbmdsZSBmZWF0aGVybGlnaHQgaW5zdGFuY2VzICovXHJcblx0XHRhdXRvQmluZDogICAgICAgJ1tkYXRhLWZlYXRoZXJsaWdodF0nLCAgICAvKiBXaWxsIGF1dG9tYXRpY2FsbHkgYmluZCBlbGVtZW50cyBtYXRjaGluZyB0aGlzIHNlbGVjdG9yLiBDbGVhciBvciBzZXQgYmVmb3JlIG9uUmVhZHkgKi9cclxuXHRcdGRlZmF1bHRzOiAgICAgICBGZWF0aGVybGlnaHQucHJvdG90eXBlLCAgIC8qIFlvdSBjYW4gYWNjZXNzIGFuZCBvdmVycmlkZSBhbGwgZGVmYXVsdHMgdXNpbmcgJC5mZWF0aGVybGlnaHQuZGVmYXVsdHMsIHdoaWNoIGlzIGp1c3QgYSBzeW5vbnltIGZvciAkLmZlYXRoZXJsaWdodC5wcm90b3R5cGUgKi9cclxuXHRcdC8qIENvbnRhaW5zIHRoZSBsb2dpYyB0byBkZXRlcm1pbmUgY29udGVudCAqL1xyXG5cdFx0Y29udGVudEZpbHRlcnM6IHtcclxuXHRcdFx0anF1ZXJ5OiB7XHJcblx0XHRcdFx0cmVnZXg6IC9eWyMuXVxcdy8sICAgICAgICAgLyogQW55dGhpbmcgdGhhdCBzdGFydHMgd2l0aCBhIGNsYXNzIG5hbWUgb3IgaWRlbnRpZmllcnMgKi9cclxuXHRcdFx0XHR0ZXN0OiBmdW5jdGlvbihlbGVtKSAgICB7IHJldHVybiBlbGVtIGluc3RhbmNlb2YgJCAmJiBlbGVtOyB9LFxyXG5cdFx0XHRcdHByb2Nlc3M6IGZ1bmN0aW9uKGVsZW0pIHsgcmV0dXJuIHRoaXMucGVyc2lzdCAhPT0gZmFsc2UgPyAkKGVsZW0pIDogJChlbGVtKS5jbG9uZSh0cnVlKTsgfVxyXG5cdFx0XHR9LFxyXG5cdFx0XHRpbWFnZToge1xyXG5cdFx0XHRcdHJlZ2V4OiAvXFwuKHBuZ3xqcGd8anBlZ3xnaWZ8dGlmZnxibXB8c3ZnKShcXD9cXFMqKT8kL2ksXHJcblx0XHRcdFx0cHJvY2VzczogZnVuY3Rpb24odXJsKSAge1xyXG5cdFx0XHRcdFx0dmFyIHNlbGYgPSB0aGlzLFxyXG5cdFx0XHRcdFx0XHRkZWZlcnJlZCA9ICQuRGVmZXJyZWQoKSxcclxuXHRcdFx0XHRcdFx0aW1nID0gbmV3IEltYWdlKCksXHJcblx0XHRcdFx0XHRcdCRpbWcgPSAkKCc8aW1nIHNyYz1cIicrdXJsKydcIiBhbHQ9XCJcIiBjbGFzcz1cIicrc2VsZi5uYW1lc3BhY2UrJy1pbWFnZVwiIC8+Jyk7XHJcblx0XHRcdFx0XHRpbWcub25sb2FkICA9IGZ1bmN0aW9uKCkge1xyXG5cdFx0XHRcdFx0XHQvKiBTdG9yZSBuYXR1cmFsV2lkdGggJiBoZWlnaHQgZm9yIElFOCAqL1xyXG5cdFx0XHRcdFx0XHQkaW1nLm5hdHVyYWxXaWR0aCA9IGltZy53aWR0aDsgJGltZy5uYXR1cmFsSGVpZ2h0ID0gaW1nLmhlaWdodDtcclxuXHRcdFx0XHRcdFx0ZGVmZXJyZWQucmVzb2x2ZSggJGltZyApO1xyXG5cdFx0XHRcdFx0fTtcclxuXHRcdFx0XHRcdGltZy5vbmVycm9yID0gZnVuY3Rpb24oKSB7IGRlZmVycmVkLnJlamVjdCgkaW1nKTsgfTtcclxuXHRcdFx0XHRcdGltZy5zcmMgPSB1cmw7XHJcblx0XHRcdFx0XHRyZXR1cm4gZGVmZXJyZWQucHJvbWlzZSgpO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0fSxcclxuXHRcdFx0aHRtbDoge1xyXG5cdFx0XHRcdHJlZ2V4OiAvXlxccyo8W1xcdyFdW148XSo+LywgLyogQW55dGhpbmcgdGhhdCBzdGFydHMgd2l0aCBzb21lIGtpbmQgb2YgdmFsaWQgdGFnICovXHJcblx0XHRcdFx0cHJvY2VzczogZnVuY3Rpb24oaHRtbCkgeyByZXR1cm4gJChodG1sKTsgfVxyXG5cdFx0XHR9LFxyXG5cdFx0XHRhamF4OiB7XHJcblx0XHRcdFx0cmVnZXg6IC8uLywgICAgICAgICAgICAvKiBBdCB0aGlzIHBvaW50LCBhbnkgY29udGVudCBpcyBhc3N1bWVkIHRvIGJlIGFuIFVSTCAqL1xyXG5cdFx0XHRcdHByb2Nlc3M6IGZ1bmN0aW9uKHVybCkgIHtcclxuXHRcdFx0XHRcdHZhciBzZWxmID0gdGhpcyxcclxuXHRcdFx0XHRcdFx0ZGVmZXJyZWQgPSAkLkRlZmVycmVkKCk7XHJcblx0XHRcdFx0XHQvKiB3ZSBhcmUgdXNpbmcgbG9hZCBzbyBvbmUgY2FuIHNwZWNpZnkgYSB0YXJnZXQgd2l0aDogdXJsLmh0bWwgI3RhcmdldGVsZW1lbnQgKi9cclxuXHRcdFx0XHRcdHZhciAkY29udGFpbmVyID0gJCgnPGRpdj48L2Rpdj4nKS5sb2FkKHVybCwgZnVuY3Rpb24ocmVzcG9uc2UsIHN0YXR1cyl7XHJcblx0XHRcdFx0XHRcdGlmICggc3RhdHVzICE9PSBcImVycm9yXCIgKSB7XHJcblx0XHRcdFx0XHRcdFx0ZGVmZXJyZWQucmVzb2x2ZSgkY29udGFpbmVyLmNvbnRlbnRzKCkpO1xyXG5cdFx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHRcdGRlZmVycmVkLmZhaWwoKTtcclxuXHRcdFx0XHRcdH0pO1xyXG5cdFx0XHRcdFx0cmV0dXJuIGRlZmVycmVkLnByb21pc2UoKTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdH0sXHJcblx0XHRcdGlmcmFtZToge1xyXG5cdFx0XHRcdHByb2Nlc3M6IGZ1bmN0aW9uKHVybCkge1xyXG5cdFx0XHRcdFx0dmFyIGRlZmVycmVkID0gbmV3ICQuRGVmZXJyZWQoKTtcclxuXHRcdFx0XHRcdHZhciAkY29udGVudCA9ICQoJzxpZnJhbWUvPicpXHJcblx0XHRcdFx0XHRcdC5oaWRlKClcclxuXHRcdFx0XHRcdFx0LmF0dHIoJ3NyYycsIHVybClcclxuXHRcdFx0XHRcdFx0LmNzcyhzdHJ1Y3R1cmUodGhpcywgJ2lmcmFtZScpKVxyXG5cdFx0XHRcdFx0XHQub24oJ2xvYWQnLCBmdW5jdGlvbigpIHsgZGVmZXJyZWQucmVzb2x2ZSgkY29udGVudC5zaG93KCkpOyB9KVxyXG5cdFx0XHRcdFx0XHQvLyBXZSBjYW4ndCBtb3ZlIGFuIDxpZnJhbWU+IGFuZCBhdm9pZCByZWxvYWRpbmcgaXQsXHJcblx0XHRcdFx0XHRcdC8vIHNvIGxldCdzIHB1dCBpdCBpbiBwbGFjZSBvdXJzZWx2ZXMgcmlnaHQgbm93OlxyXG5cdFx0XHRcdFx0XHQuYXBwZW5kVG8odGhpcy4kaW5zdGFuY2UuZmluZCgnLicgKyB0aGlzLm5hbWVzcGFjZSArICctY29udGVudCcpKTtcclxuXHRcdFx0XHRcdHJldHVybiBkZWZlcnJlZC5wcm9taXNlKCk7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9LFxyXG5cdFx0XHR0ZXh0OiB7XHJcblx0XHRcdFx0cHJvY2VzczogZnVuY3Rpb24odGV4dCkgeyByZXR1cm4gJCgnPGRpdj4nLCB7dGV4dDogdGV4dH0pOyB9XHJcblx0XHRcdH1cclxuXHRcdH0sXHJcblxyXG5cdFx0ZnVuY3Rpb25BdHRyaWJ1dGVzOiBbJ2JlZm9yZU9wZW4nLCAnYWZ0ZXJPcGVuJywgJ2JlZm9yZUNvbnRlbnQnLCAnYWZ0ZXJDb250ZW50JywgJ2JlZm9yZUNsb3NlJywgJ2FmdGVyQ2xvc2UnXSxcclxuXHJcblx0XHQvKioqIGNsYXNzIG1ldGhvZHMgKioqL1xyXG5cdFx0LyogcmVhZCBlbGVtZW50J3MgYXR0cmlidXRlcyBzdGFydGluZyB3aXRoIGRhdGEtZmVhdGhlcmxpZ2h0LSAqL1xyXG5cdFx0cmVhZEVsZW1lbnRDb25maWc6IGZ1bmN0aW9uKGVsZW1lbnQsIG5hbWVzcGFjZSkge1xyXG5cdFx0XHR2YXIgS2xhc3MgPSB0aGlzLFxyXG5cdFx0XHRcdHJlZ2V4cCA9IG5ldyBSZWdFeHAoJ15kYXRhLScgKyBuYW1lc3BhY2UgKyAnLSguKiknKSxcclxuXHRcdFx0XHRjb25maWcgPSB7fTtcclxuXHRcdFx0aWYgKGVsZW1lbnQgJiYgZWxlbWVudC5hdHRyaWJ1dGVzKSB7XHJcblx0XHRcdFx0JC5lYWNoKGVsZW1lbnQuYXR0cmlidXRlcywgZnVuY3Rpb24oKXtcclxuXHRcdFx0XHRcdHZhciBtYXRjaCA9IHRoaXMubmFtZS5tYXRjaChyZWdleHApO1xyXG5cdFx0XHRcdFx0aWYgKG1hdGNoKSB7XHJcblx0XHRcdFx0XHRcdHZhciB2YWwgPSB0aGlzLnZhbHVlLFxyXG5cdFx0XHRcdFx0XHRcdG5hbWUgPSAkLmNhbWVsQ2FzZShtYXRjaFsxXSk7XHJcblx0XHRcdFx0XHRcdGlmICgkLmluQXJyYXkobmFtZSwgS2xhc3MuZnVuY3Rpb25BdHRyaWJ1dGVzKSA+PSAwKSB7ICAvKiBqc2hpbnQgLVcwNTQgKi9cclxuXHRcdFx0XHRcdFx0XHR2YWwgPSBuZXcgRnVuY3Rpb24odmFsKTsgICAgICAgICAgICAgICAgICAgICAgICAgICAvKiBqc2hpbnQgK1cwNTQgKi9cclxuXHRcdFx0XHRcdFx0fSBlbHNlIHtcclxuXHRcdFx0XHRcdFx0XHR0cnkgeyB2YWwgPSAkLnBhcnNlSlNPTih2YWwpOyB9XHJcblx0XHRcdFx0XHRcdFx0Y2F0Y2goZSkge31cclxuXHRcdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0XHRjb25maWdbbmFtZV0gPSB2YWw7XHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0fSk7XHJcblx0XHRcdH1cclxuXHRcdFx0cmV0dXJuIGNvbmZpZztcclxuXHRcdH0sXHJcblxyXG5cdFx0LyogVXNlZCB0byBjcmVhdGUgYSBGZWF0aGVybGlnaHQgZXh0ZW5zaW9uXHJcblx0XHQgICBbV2FybmluZzogZ3VydS1sZXZlbF1cclxuXHRcdCAgIENyZWF0ZXMgdGhlIGV4dGVuc2lvbidzIHByb3RvdHlwZSB0aGF0IGluIHR1cm5cclxuXHRcdCAgIGluaGVyaXRzIEZlYXRoZXJsaWdodCdzIHByb3RvdHlwZS5cclxuXHRcdCAgIENvdWxkIGJlIHVzZWQgdG8gZXh0ZW5kIGFuIGV4dGVuc2lvbiB0b28uLi5cclxuXHRcdCAgIFRoaXMgaXMgcHJldHR5IGhpZ2ggbGV2ZWwgd2l6YXJkeSwgaXQgY29tZXMgcHJldHR5IG11Y2ggc3RyYWlnaHRcclxuXHRcdCAgIGZyb20gQ29mZmVlU2NyaXB0IGFuZCB3b24ndCB0ZWFjaCB5b3UgYW55dGhpbmcgYWJvdXQgRmVhdGhlcmxpZ2h0XHJcblx0XHQgICBhcyBpdCdzIG5vdCByZWFsbHkgc3BlY2lmaWMgdG8gdGhpcyBsaWJyYXJ5LlxyXG5cdFx0ICAgTXkgc3VnZ2VzdGlvbjogbW92ZSBhbG9uZyBhbmQga2VlcCB5b3VyIHNhbml0eS5cclxuXHRcdCovXHJcblx0XHRleHRlbmQ6IGZ1bmN0aW9uKGNoaWxkLCBkZWZhdWx0cykge1xyXG5cdFx0XHQvKiBTZXR1cCBjbGFzcyBoaWVyYXJjaHksIGFkYXB0ZWQgZnJvbSBDb2ZmZWVTY3JpcHQgKi9cclxuXHRcdFx0dmFyIEN0b3IgPSBmdW5jdGlvbigpeyB0aGlzLmNvbnN0cnVjdG9yID0gY2hpbGQ7IH07XHJcblx0XHRcdEN0b3IucHJvdG90eXBlID0gdGhpcy5wcm90b3R5cGU7XHJcblx0XHRcdGNoaWxkLnByb3RvdHlwZSA9IG5ldyBDdG9yKCk7XHJcblx0XHRcdGNoaWxkLl9fc3VwZXJfXyA9IHRoaXMucHJvdG90eXBlO1xyXG5cdFx0XHQvKiBDb3B5IGNsYXNzIG1ldGhvZHMgJiBhdHRyaWJ1dGVzICovXHJcblx0XHRcdCQuZXh0ZW5kKGNoaWxkLCB0aGlzLCBkZWZhdWx0cyk7XHJcblx0XHRcdGNoaWxkLmRlZmF1bHRzID0gY2hpbGQucHJvdG90eXBlO1xyXG5cdFx0XHRyZXR1cm4gY2hpbGQ7XHJcblx0XHR9LFxyXG5cclxuXHRcdGF0dGFjaDogZnVuY3Rpb24oJHNvdXJjZSwgJGNvbnRlbnQsIGNvbmZpZykge1xyXG5cdFx0XHR2YXIgS2xhc3MgPSB0aGlzO1xyXG5cdFx0XHRpZiAodHlwZW9mICRjb250ZW50ID09PSAnb2JqZWN0JyAmJiAkY29udGVudCBpbnN0YW5jZW9mICQgPT09IGZhbHNlICYmICFjb25maWcpIHtcclxuXHRcdFx0XHRjb25maWcgPSAkY29udGVudDtcclxuXHRcdFx0XHQkY29udGVudCA9IHVuZGVmaW5lZDtcclxuXHRcdFx0fVxyXG5cdFx0XHQvKiBtYWtlIGEgY29weSAqL1xyXG5cdFx0XHRjb25maWcgPSAkLmV4dGVuZCh7fSwgY29uZmlnKTtcclxuXHJcblx0XHRcdC8qIE9ubHkgZm9yIG9wZW5UcmlnZ2VyIGFuZCBuYW1lc3BhY2UuLi4gKi9cclxuXHRcdFx0dmFyIG5hbWVzcGFjZSA9IGNvbmZpZy5uYW1lc3BhY2UgfHwgS2xhc3MuZGVmYXVsdHMubmFtZXNwYWNlLFxyXG5cdFx0XHRcdHRlbXBDb25maWcgPSAkLmV4dGVuZCh7fSwgS2xhc3MuZGVmYXVsdHMsIEtsYXNzLnJlYWRFbGVtZW50Q29uZmlnKCRzb3VyY2VbMF0sIG5hbWVzcGFjZSksIGNvbmZpZyksXHJcblx0XHRcdFx0c2hhcmVkUGVyc2lzdDtcclxuXHJcblx0XHRcdCRzb3VyY2Uub24odGVtcENvbmZpZy5vcGVuVHJpZ2dlcisnLicrdGVtcENvbmZpZy5uYW1lc3BhY2UsIHRlbXBDb25maWcuZmlsdGVyLCBmdW5jdGlvbihldmVudCkge1xyXG5cdFx0XHRcdC8qIC4uLiBzaW5jZSB3ZSBtaWdodCBhcyB3ZWxsIGNvbXB1dGUgdGhlIGNvbmZpZyBvbiB0aGUgYWN0dWFsIHRhcmdldCAqL1xyXG5cdFx0XHRcdHZhciBlbGVtQ29uZmlnID0gJC5leHRlbmQoXHJcblx0XHRcdFx0XHR7JHNvdXJjZTogJHNvdXJjZSwgJGN1cnJlbnRUYXJnZXQ6ICQodGhpcyl9LFxyXG5cdFx0XHRcdFx0S2xhc3MucmVhZEVsZW1lbnRDb25maWcoJHNvdXJjZVswXSwgdGVtcENvbmZpZy5uYW1lc3BhY2UpLFxyXG5cdFx0XHRcdFx0S2xhc3MucmVhZEVsZW1lbnRDb25maWcodGhpcywgdGVtcENvbmZpZy5uYW1lc3BhY2UpLFxyXG5cdFx0XHRcdFx0Y29uZmlnKTtcclxuXHRcdFx0XHR2YXIgZmwgPSBzaGFyZWRQZXJzaXN0IHx8ICQodGhpcykuZGF0YSgnZmVhdGhlcmxpZ2h0LXBlcnNpc3RlZCcpIHx8IG5ldyBLbGFzcygkY29udGVudCwgZWxlbUNvbmZpZyk7XHJcblx0XHRcdFx0aWYoZmwucGVyc2lzdCA9PT0gJ3NoYXJlZCcpIHtcclxuXHRcdFx0XHRcdHNoYXJlZFBlcnNpc3QgPSBmbDtcclxuXHRcdFx0XHR9IGVsc2UgaWYoZmwucGVyc2lzdCAhPT0gZmFsc2UpIHtcclxuXHRcdFx0XHRcdCQodGhpcykuZGF0YSgnZmVhdGhlcmxpZ2h0LXBlcnNpc3RlZCcsIGZsKTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdFx0ZWxlbUNvbmZpZy4kY3VycmVudFRhcmdldC5ibHVyKCk7IC8vIE90aGVyd2lzZSAnZW50ZXInIGtleSBtaWdodCB0cmlnZ2VyIHRoZSBkaWFsb2cgYWdhaW5cclxuXHRcdFx0XHRmbC5vcGVuKGV2ZW50KTtcclxuXHRcdFx0fSk7XHJcblx0XHRcdHJldHVybiAkc291cmNlO1xyXG5cdFx0fSxcclxuXHJcblx0XHRjdXJyZW50OiBmdW5jdGlvbigpIHtcclxuXHRcdFx0dmFyIGFsbCA9IHRoaXMub3BlbmVkKCk7XHJcblx0XHRcdHJldHVybiBhbGxbYWxsLmxlbmd0aCAtIDFdIHx8IG51bGw7XHJcblx0XHR9LFxyXG5cclxuXHRcdG9wZW5lZDogZnVuY3Rpb24oKSB7XHJcblx0XHRcdHZhciBrbGFzcyA9IHRoaXM7XHJcblx0XHRcdHBydW5lT3BlbmVkKCk7XHJcblx0XHRcdHJldHVybiAkLmdyZXAob3BlbmVkLCBmdW5jdGlvbihmbCkgeyByZXR1cm4gZmwgaW5zdGFuY2VvZiBrbGFzczsgfSApO1xyXG5cdFx0fSxcclxuXHJcblx0XHRjbG9zZTogZnVuY3Rpb24oZXZlbnQpIHtcclxuXHRcdFx0dmFyIGN1ciA9IHRoaXMuY3VycmVudCgpO1xyXG5cdFx0XHRpZihjdXIpIHsgcmV0dXJuIGN1ci5jbG9zZShldmVudCk7IH1cclxuXHRcdH0sXHJcblxyXG5cdFx0LyogRG9lcyB0aGUgYXV0byBiaW5kaW5nIG9uIHN0YXJ0dXAuXHJcblx0XHQgICBNZWFudCBvbmx5IHRvIGJlIHVzZWQgYnkgRmVhdGhlcmxpZ2h0IGFuZCBpdHMgZXh0ZW5zaW9uc1xyXG5cdFx0Ki9cclxuXHRcdF9vblJlYWR5OiBmdW5jdGlvbigpIHtcclxuXHRcdFx0dmFyIEtsYXNzID0gdGhpcztcclxuXHRcdFx0aWYoS2xhc3MuYXV0b0JpbmQpe1xyXG5cdFx0XHRcdC8qIEJpbmQgZXhpc3RpbmcgZWxlbWVudHMgKi9cclxuXHRcdFx0XHQkKEtsYXNzLmF1dG9CaW5kKS5lYWNoKGZ1bmN0aW9uKCl7XHJcblx0XHRcdFx0XHRLbGFzcy5hdHRhY2goJCh0aGlzKSk7XHJcblx0XHRcdFx0fSk7XHJcblx0XHRcdFx0LyogSWYgYSBjbGljayBwcm9wYWdhdGVzIHRvIHRoZSBkb2N1bWVudCBsZXZlbCwgdGhlbiB3ZSBoYXZlIGFuIGl0ZW0gdGhhdCB3YXMgYWRkZWQgbGF0ZXIgb24gKi9cclxuXHRcdFx0XHQkKGRvY3VtZW50KS5vbignY2xpY2snLCBLbGFzcy5hdXRvQmluZCwgZnVuY3Rpb24oZXZ0KSB7XHJcblx0XHRcdFx0XHRpZiAoZXZ0LmlzRGVmYXVsdFByZXZlbnRlZCgpIHx8IGV2dC5uYW1lc3BhY2UgPT09ICdmZWF0aGVybGlnaHQnKSB7XHJcblx0XHRcdFx0XHRcdHJldHVybjtcclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdGV2dC5wcmV2ZW50RGVmYXVsdCgpO1xyXG5cdFx0XHRcdFx0LyogQmluZCBmZWF0aGVybGlnaHQgKi9cclxuXHRcdFx0XHRcdEtsYXNzLmF0dGFjaCgkKGV2dC5jdXJyZW50VGFyZ2V0KSk7XHJcblx0XHRcdFx0XHQvKiBDbGljayBhZ2FpbjsgdGhpcyB0aW1lIG91ciBiaW5kaW5nIHdpbGwgY2F0Y2ggaXQgKi9cclxuXHRcdFx0XHRcdCQoZXZ0LnRhcmdldCkudHJpZ2dlcignY2xpY2suZmVhdGhlcmxpZ2h0Jyk7XHJcblx0XHRcdFx0fSk7XHJcblx0XHRcdH1cclxuXHRcdH0sXHJcblxyXG5cdFx0LyogRmVhdGhlcmxpZ2h0IHVzZXMgdGhlIG9uS2V5VXAgY2FsbGJhY2sgdG8gaW50ZXJjZXB0IHRoZSBlc2NhcGUga2V5LlxyXG5cdFx0ICAgUHJpdmF0ZSB0byBGZWF0aGVybGlnaHQuXHJcblx0XHQqL1xyXG5cdFx0X2NhbGxiYWNrQ2hhaW46IHtcclxuXHRcdFx0b25LZXlVcDogZnVuY3Rpb24oX3N1cGVyLCBldmVudCl7XHJcblx0XHRcdFx0aWYoMjcgPT09IGV2ZW50LmtleUNvZGUpIHtcclxuXHRcdFx0XHRcdGlmICh0aGlzLmNsb3NlT25Fc2MpIHtcclxuXHRcdFx0XHRcdFx0JC5mZWF0aGVybGlnaHQuY2xvc2UoZXZlbnQpO1xyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0cmV0dXJuIGZhbHNlO1xyXG5cdFx0XHRcdH0gZWxzZSB7XHJcblx0XHRcdFx0XHRyZXR1cm4gX3N1cGVyKGV2ZW50KTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdH0sXHJcblxyXG5cdFx0XHRvblJlc2l6ZTogZnVuY3Rpb24oX3N1cGVyLCBldmVudCl7XHJcblx0XHRcdFx0dGhpcy5yZXNpemUodGhpcy4kY29udGVudC5uYXR1cmFsV2lkdGgsIHRoaXMuJGNvbnRlbnQubmF0dXJhbEhlaWdodCk7XHJcblx0XHRcdFx0cmV0dXJuIF9zdXBlcihldmVudCk7XHJcblx0XHRcdH0sXHJcblxyXG5cdFx0XHRhZnRlckNvbnRlbnQ6IGZ1bmN0aW9uKF9zdXBlciwgZXZlbnQpe1xyXG5cdFx0XHRcdHZhciByID0gX3N1cGVyKGV2ZW50KTtcclxuXHRcdFx0XHR0aGlzLm9uUmVzaXplKGV2ZW50KTtcclxuXHRcdFx0XHRyZXR1cm4gcjtcclxuXHRcdFx0fVxyXG5cdFx0fVxyXG5cdH0pO1xyXG5cclxuXHQkLmZlYXRoZXJsaWdodCA9IEZlYXRoZXJsaWdodDtcclxuXHJcblx0LyogYmluZCBqUXVlcnkgZWxlbWVudHMgdG8gdHJpZ2dlciBmZWF0aGVybGlnaHQgKi9cclxuXHQkLmZuLmZlYXRoZXJsaWdodCA9IGZ1bmN0aW9uKCRjb250ZW50LCBjb25maWcpIHtcclxuXHRcdHJldHVybiBGZWF0aGVybGlnaHQuYXR0YWNoKHRoaXMsICRjb250ZW50LCBjb25maWcpO1xyXG5cdH07XHJcblxyXG5cdC8qIGJpbmQgZmVhdGhlcmxpZ2h0IG9uIHJlYWR5IGlmIGNvbmZpZyBhdXRvQmluZCBpcyBzZXQgKi9cclxuXHQkKGRvY3VtZW50KS5yZWFkeShmdW5jdGlvbigpeyBGZWF0aGVybGlnaHQuX29uUmVhZHkoKTsgfSk7XHJcbn0oalF1ZXJ5KSk7XHJcbiIsIi8qIVxyXG4gKiBJc290b3BlIFBBQ0tBR0VEIHYzLjAuMFxyXG4gKlxyXG4gKiBMaWNlbnNlZCBHUEx2MyBmb3Igb3BlbiBzb3VyY2UgdXNlXHJcbiAqIG9yIElzb3RvcGUgQ29tbWVyY2lhbCBMaWNlbnNlIGZvciBjb21tZXJjaWFsIHVzZVxyXG4gKlxyXG4gKiBodHRwOi8vaXNvdG9wZS5tZXRhZml6enkuY29cclxuICogQ29weXJpZ2h0IDIwMTYgTWV0YWZpenp5XHJcbiAqL1xyXG5cclxuLyoqXHJcbiAqIEJyaWRnZXQgbWFrZXMgalF1ZXJ5IHdpZGdldHNcclxuICogdjIuMC4wXHJcbiAqIE1JVCBsaWNlbnNlXHJcbiAqL1xyXG5cclxuLyoganNoaW50IGJyb3dzZXI6IHRydWUsIHN0cmljdDogdHJ1ZSwgdW5kZWY6IHRydWUsIHVudXNlZDogdHJ1ZSAqL1xyXG5cclxuKCBmdW5jdGlvbiggd2luZG93LCBmYWN0b3J5ICkge1xyXG4gICd1c2Ugc3RyaWN0JztcclxuICAvKiBnbG9iYWxzIGRlZmluZTogZmFsc2UsIG1vZHVsZTogZmFsc2UsIHJlcXVpcmU6IGZhbHNlICovXHJcblxyXG4gIGlmICggdHlwZW9mIGRlZmluZSA9PSAnZnVuY3Rpb24nICYmIGRlZmluZS5hbWQgKSB7XHJcbiAgICAvLyBBTURcclxuICAgIGRlZmluZSggJ2pxdWVyeS1icmlkZ2V0L2pxdWVyeS1icmlkZ2V0JyxbICdqcXVlcnknIF0sIGZ1bmN0aW9uKCBqUXVlcnkgKSB7XHJcbiAgICAgIGZhY3RvcnkoIHdpbmRvdywgalF1ZXJ5ICk7XHJcbiAgICB9KTtcclxuICB9IGVsc2UgaWYgKCB0eXBlb2YgbW9kdWxlID09ICdvYmplY3QnICYmIG1vZHVsZS5leHBvcnRzICkge1xyXG4gICAgLy8gQ29tbW9uSlNcclxuICAgIG1vZHVsZS5leHBvcnRzID0gZmFjdG9yeShcclxuICAgICAgd2luZG93LFxyXG4gICAgICByZXF1aXJlKCdqcXVlcnknKVxyXG4gICAgKTtcclxuICB9IGVsc2Uge1xyXG4gICAgLy8gYnJvd3NlciBnbG9iYWxcclxuICAgIHdpbmRvdy5qUXVlcnlCcmlkZ2V0ID0gZmFjdG9yeShcclxuICAgICAgd2luZG93LFxyXG4gICAgICB3aW5kb3cualF1ZXJ5XHJcbiAgICApO1xyXG4gIH1cclxuXHJcbn0oIHdpbmRvdywgZnVuY3Rpb24gZmFjdG9yeSggd2luZG93LCBqUXVlcnkgKSB7XHJcbid1c2Ugc3RyaWN0JztcclxuXHJcbi8vIC0tLS0tIHV0aWxzIC0tLS0tIC8vXHJcblxyXG52YXIgYXJyYXlTbGljZSA9IEFycmF5LnByb3RvdHlwZS5zbGljZTtcclxuXHJcbi8vIGhlbHBlciBmdW5jdGlvbiBmb3IgbG9nZ2luZyBlcnJvcnNcclxuLy8gJC5lcnJvciBicmVha3MgalF1ZXJ5IGNoYWluaW5nXHJcbnZhciBjb25zb2xlID0gd2luZG93LmNvbnNvbGU7XHJcbnZhciBsb2dFcnJvciA9IHR5cGVvZiBjb25zb2xlID09ICd1bmRlZmluZWQnID8gZnVuY3Rpb24oKSB7fSA6XHJcbiAgZnVuY3Rpb24oIG1lc3NhZ2UgKSB7XHJcbiAgICBjb25zb2xlLmVycm9yKCBtZXNzYWdlICk7XHJcbiAgfTtcclxuXHJcbi8vIC0tLS0tIGpRdWVyeUJyaWRnZXQgLS0tLS0gLy9cclxuXHJcbmZ1bmN0aW9uIGpRdWVyeUJyaWRnZXQoIG5hbWVzcGFjZSwgUGx1Z2luQ2xhc3MsICQgKSB7XHJcbiAgJCA9ICQgfHwgalF1ZXJ5IHx8IHdpbmRvdy5qUXVlcnk7XHJcbiAgaWYgKCAhJCApIHtcclxuICAgIHJldHVybjtcclxuICB9XHJcblxyXG4gIC8vIGFkZCBvcHRpb24gbWV0aG9kIC0+ICQoKS5wbHVnaW4oJ29wdGlvbicsIHsuLi59KVxyXG4gIGlmICggIVBsdWdpbkNsYXNzLnByb3RvdHlwZS5vcHRpb24gKSB7XHJcbiAgICAvLyBvcHRpb24gc2V0dGVyXHJcbiAgICBQbHVnaW5DbGFzcy5wcm90b3R5cGUub3B0aW9uID0gZnVuY3Rpb24oIG9wdHMgKSB7XHJcbiAgICAgIC8vIGJhaWwgb3V0IGlmIG5vdCBhbiBvYmplY3RcclxuICAgICAgaWYgKCAhJC5pc1BsYWluT2JqZWN0KCBvcHRzICkgKXtcclxuICAgICAgICByZXR1cm47XHJcbiAgICAgIH1cclxuICAgICAgdGhpcy5vcHRpb25zID0gJC5leHRlbmQoIHRydWUsIHRoaXMub3B0aW9ucywgb3B0cyApO1xyXG4gICAgfTtcclxuICB9XHJcblxyXG4gIC8vIG1ha2UgalF1ZXJ5IHBsdWdpblxyXG4gICQuZm5bIG5hbWVzcGFjZSBdID0gZnVuY3Rpb24oIGFyZzAgLyosIGFyZzEgKi8gKSB7XHJcbiAgICBpZiAoIHR5cGVvZiBhcmcwID09ICdzdHJpbmcnICkge1xyXG4gICAgICAvLyBtZXRob2QgY2FsbCAkKCkucGx1Z2luKCAnbWV0aG9kTmFtZScsIHsgb3B0aW9ucyB9IClcclxuICAgICAgLy8gc2hpZnQgYXJndW1lbnRzIGJ5IDFcclxuICAgICAgdmFyIGFyZ3MgPSBhcnJheVNsaWNlLmNhbGwoIGFyZ3VtZW50cywgMSApO1xyXG4gICAgICByZXR1cm4gbWV0aG9kQ2FsbCggdGhpcywgYXJnMCwgYXJncyApO1xyXG4gICAgfVxyXG4gICAgLy8ganVzdCAkKCkucGx1Z2luKHsgb3B0aW9ucyB9KVxyXG4gICAgcGxhaW5DYWxsKCB0aGlzLCBhcmcwICk7XHJcbiAgICByZXR1cm4gdGhpcztcclxuICB9O1xyXG5cclxuICAvLyAkKCkucGx1Z2luKCdtZXRob2ROYW1lJylcclxuICBmdW5jdGlvbiBtZXRob2RDYWxsKCAkZWxlbXMsIG1ldGhvZE5hbWUsIGFyZ3MgKSB7XHJcbiAgICB2YXIgcmV0dXJuVmFsdWU7XHJcbiAgICB2YXIgcGx1Z2luTWV0aG9kU3RyID0gJyQoKS4nICsgbmFtZXNwYWNlICsgJyhcIicgKyBtZXRob2ROYW1lICsgJ1wiKSc7XHJcblxyXG4gICAgJGVsZW1zLmVhY2goIGZ1bmN0aW9uKCBpLCBlbGVtICkge1xyXG4gICAgICAvLyBnZXQgaW5zdGFuY2VcclxuICAgICAgdmFyIGluc3RhbmNlID0gJC5kYXRhKCBlbGVtLCBuYW1lc3BhY2UgKTtcclxuICAgICAgaWYgKCAhaW5zdGFuY2UgKSB7XHJcbiAgICAgICAgbG9nRXJyb3IoIG5hbWVzcGFjZSArICcgbm90IGluaXRpYWxpemVkLiBDYW5ub3QgY2FsbCBtZXRob2RzLCBpLmUuICcgK1xyXG4gICAgICAgICAgcGx1Z2luTWV0aG9kU3RyICk7XHJcbiAgICAgICAgcmV0dXJuO1xyXG4gICAgICB9XHJcblxyXG4gICAgICB2YXIgbWV0aG9kID0gaW5zdGFuY2VbIG1ldGhvZE5hbWUgXTtcclxuICAgICAgaWYgKCAhbWV0aG9kIHx8IG1ldGhvZE5hbWUuY2hhckF0KDApID09ICdfJyApIHtcclxuICAgICAgICBsb2dFcnJvciggcGx1Z2luTWV0aG9kU3RyICsgJyBpcyBub3QgYSB2YWxpZCBtZXRob2QnICk7XHJcbiAgICAgICAgcmV0dXJuO1xyXG4gICAgICB9XHJcblxyXG4gICAgICAvLyBhcHBseSBtZXRob2QsIGdldCByZXR1cm4gdmFsdWVcclxuICAgICAgdmFyIHZhbHVlID0gbWV0aG9kLmFwcGx5KCBpbnN0YW5jZSwgYXJncyApO1xyXG4gICAgICAvLyBzZXQgcmV0dXJuIHZhbHVlIGlmIHZhbHVlIGlzIHJldHVybmVkLCB1c2Ugb25seSBmaXJzdCB2YWx1ZVxyXG4gICAgICByZXR1cm5WYWx1ZSA9IHJldHVyblZhbHVlID09PSB1bmRlZmluZWQgPyB2YWx1ZSA6IHJldHVyblZhbHVlO1xyXG4gICAgfSk7XHJcblxyXG4gICAgcmV0dXJuIHJldHVyblZhbHVlICE9PSB1bmRlZmluZWQgPyByZXR1cm5WYWx1ZSA6ICRlbGVtcztcclxuICB9XHJcblxyXG4gIGZ1bmN0aW9uIHBsYWluQ2FsbCggJGVsZW1zLCBvcHRpb25zICkge1xyXG4gICAgJGVsZW1zLmVhY2goIGZ1bmN0aW9uKCBpLCBlbGVtICkge1xyXG4gICAgICB2YXIgaW5zdGFuY2UgPSAkLmRhdGEoIGVsZW0sIG5hbWVzcGFjZSApO1xyXG4gICAgICBpZiAoIGluc3RhbmNlICkge1xyXG4gICAgICAgIC8vIHNldCBvcHRpb25zICYgaW5pdFxyXG4gICAgICAgIGluc3RhbmNlLm9wdGlvbiggb3B0aW9ucyApO1xyXG4gICAgICAgIGluc3RhbmNlLl9pbml0KCk7XHJcbiAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgLy8gaW5pdGlhbGl6ZSBuZXcgaW5zdGFuY2VcclxuICAgICAgICBpbnN0YW5jZSA9IG5ldyBQbHVnaW5DbGFzcyggZWxlbSwgb3B0aW9ucyApO1xyXG4gICAgICAgICQuZGF0YSggZWxlbSwgbmFtZXNwYWNlLCBpbnN0YW5jZSApO1xyXG4gICAgICB9XHJcbiAgICB9KTtcclxuICB9XHJcblxyXG4gIHVwZGF0ZUpRdWVyeSggJCApO1xyXG5cclxufVxyXG5cclxuLy8gLS0tLS0gdXBkYXRlSlF1ZXJ5IC0tLS0tIC8vXHJcblxyXG4vLyBzZXQgJC5icmlkZ2V0IGZvciB2MSBiYWNrd2FyZHMgY29tcGF0aWJpbGl0eVxyXG5mdW5jdGlvbiB1cGRhdGVKUXVlcnkoICQgKSB7XHJcbiAgaWYgKCAhJCB8fCAoICQgJiYgJC5icmlkZ2V0ICkgKSB7XHJcbiAgICByZXR1cm47XHJcbiAgfVxyXG4gICQuYnJpZGdldCA9IGpRdWVyeUJyaWRnZXQ7XHJcbn1cclxuXHJcbnVwZGF0ZUpRdWVyeSggalF1ZXJ5IHx8IHdpbmRvdy5qUXVlcnkgKTtcclxuXHJcbi8vIC0tLS0tICAtLS0tLSAvL1xyXG5cclxucmV0dXJuIGpRdWVyeUJyaWRnZXQ7XHJcblxyXG59KSk7XHJcblxyXG4vKipcclxuICogRXZFbWl0dGVyIHYxLjAuMlxyXG4gKiBMaWwnIGV2ZW50IGVtaXR0ZXJcclxuICogTUlUIExpY2Vuc2VcclxuICovXHJcblxyXG4vKiBqc2hpbnQgdW51c2VkOiB0cnVlLCB1bmRlZjogdHJ1ZSwgc3RyaWN0OiB0cnVlICovXHJcblxyXG4oIGZ1bmN0aW9uKCBnbG9iYWwsIGZhY3RvcnkgKSB7XHJcbiAgLy8gdW5pdmVyc2FsIG1vZHVsZSBkZWZpbml0aW9uXHJcbiAgLyoganNoaW50IHN0cmljdDogZmFsc2UgKi8gLyogZ2xvYmFscyBkZWZpbmUsIG1vZHVsZSAqL1xyXG4gIGlmICggdHlwZW9mIGRlZmluZSA9PSAnZnVuY3Rpb24nICYmIGRlZmluZS5hbWQgKSB7XHJcbiAgICAvLyBBTUQgLSBSZXF1aXJlSlNcclxuICAgIGRlZmluZSggJ2V2LWVtaXR0ZXIvZXYtZW1pdHRlcicsZmFjdG9yeSApO1xyXG4gIH0gZWxzZSBpZiAoIHR5cGVvZiBtb2R1bGUgPT0gJ29iamVjdCcgJiYgbW9kdWxlLmV4cG9ydHMgKSB7XHJcbiAgICAvLyBDb21tb25KUyAtIEJyb3dzZXJpZnksIFdlYnBhY2tcclxuICAgIG1vZHVsZS5leHBvcnRzID0gZmFjdG9yeSgpO1xyXG4gIH0gZWxzZSB7XHJcbiAgICAvLyBCcm93c2VyIGdsb2JhbHNcclxuICAgIGdsb2JhbC5FdkVtaXR0ZXIgPSBmYWN0b3J5KCk7XHJcbiAgfVxyXG5cclxufSggdGhpcywgZnVuY3Rpb24oKSB7XHJcblxyXG5cclxuXHJcbmZ1bmN0aW9uIEV2RW1pdHRlcigpIHt9XHJcblxyXG52YXIgcHJvdG8gPSBFdkVtaXR0ZXIucHJvdG90eXBlO1xyXG5cclxucHJvdG8ub24gPSBmdW5jdGlvbiggZXZlbnROYW1lLCBsaXN0ZW5lciApIHtcclxuICBpZiAoICFldmVudE5hbWUgfHwgIWxpc3RlbmVyICkge1xyXG4gICAgcmV0dXJuO1xyXG4gIH1cclxuICAvLyBzZXQgZXZlbnRzIGhhc2hcclxuICB2YXIgZXZlbnRzID0gdGhpcy5fZXZlbnRzID0gdGhpcy5fZXZlbnRzIHx8IHt9O1xyXG4gIC8vIHNldCBsaXN0ZW5lcnMgYXJyYXlcclxuICB2YXIgbGlzdGVuZXJzID0gZXZlbnRzWyBldmVudE5hbWUgXSA9IGV2ZW50c1sgZXZlbnROYW1lIF0gfHwgW107XHJcbiAgLy8gb25seSBhZGQgb25jZVxyXG4gIGlmICggbGlzdGVuZXJzLmluZGV4T2YoIGxpc3RlbmVyICkgPT0gLTEgKSB7XHJcbiAgICBsaXN0ZW5lcnMucHVzaCggbGlzdGVuZXIgKTtcclxuICB9XHJcblxyXG4gIHJldHVybiB0aGlzO1xyXG59O1xyXG5cclxucHJvdG8ub25jZSA9IGZ1bmN0aW9uKCBldmVudE5hbWUsIGxpc3RlbmVyICkge1xyXG4gIGlmICggIWV2ZW50TmFtZSB8fCAhbGlzdGVuZXIgKSB7XHJcbiAgICByZXR1cm47XHJcbiAgfVxyXG4gIC8vIGFkZCBldmVudFxyXG4gIHRoaXMub24oIGV2ZW50TmFtZSwgbGlzdGVuZXIgKTtcclxuICAvLyBzZXQgb25jZSBmbGFnXHJcbiAgLy8gc2V0IG9uY2VFdmVudHMgaGFzaFxyXG4gIHZhciBvbmNlRXZlbnRzID0gdGhpcy5fb25jZUV2ZW50cyA9IHRoaXMuX29uY2VFdmVudHMgfHwge307XHJcbiAgLy8gc2V0IG9uY2VMaXN0ZW5lcnMgb2JqZWN0XHJcbiAgdmFyIG9uY2VMaXN0ZW5lcnMgPSBvbmNlRXZlbnRzWyBldmVudE5hbWUgXSA9IG9uY2VFdmVudHNbIGV2ZW50TmFtZSBdIHx8IHt9O1xyXG4gIC8vIHNldCBmbGFnXHJcbiAgb25jZUxpc3RlbmVyc1sgbGlzdGVuZXIgXSA9IHRydWU7XHJcblxyXG4gIHJldHVybiB0aGlzO1xyXG59O1xyXG5cclxucHJvdG8ub2ZmID0gZnVuY3Rpb24oIGV2ZW50TmFtZSwgbGlzdGVuZXIgKSB7XHJcbiAgdmFyIGxpc3RlbmVycyA9IHRoaXMuX2V2ZW50cyAmJiB0aGlzLl9ldmVudHNbIGV2ZW50TmFtZSBdO1xyXG4gIGlmICggIWxpc3RlbmVycyB8fCAhbGlzdGVuZXJzLmxlbmd0aCApIHtcclxuICAgIHJldHVybjtcclxuICB9XHJcbiAgdmFyIGluZGV4ID0gbGlzdGVuZXJzLmluZGV4T2YoIGxpc3RlbmVyICk7XHJcbiAgaWYgKCBpbmRleCAhPSAtMSApIHtcclxuICAgIGxpc3RlbmVycy5zcGxpY2UoIGluZGV4LCAxICk7XHJcbiAgfVxyXG5cclxuICByZXR1cm4gdGhpcztcclxufTtcclxuXHJcbnByb3RvLmVtaXRFdmVudCA9IGZ1bmN0aW9uKCBldmVudE5hbWUsIGFyZ3MgKSB7XHJcbiAgdmFyIGxpc3RlbmVycyA9IHRoaXMuX2V2ZW50cyAmJiB0aGlzLl9ldmVudHNbIGV2ZW50TmFtZSBdO1xyXG4gIGlmICggIWxpc3RlbmVycyB8fCAhbGlzdGVuZXJzLmxlbmd0aCApIHtcclxuICAgIHJldHVybjtcclxuICB9XHJcbiAgdmFyIGkgPSAwO1xyXG4gIHZhciBsaXN0ZW5lciA9IGxpc3RlbmVyc1tpXTtcclxuICBhcmdzID0gYXJncyB8fCBbXTtcclxuICAvLyBvbmNlIHN0dWZmXHJcbiAgdmFyIG9uY2VMaXN0ZW5lcnMgPSB0aGlzLl9vbmNlRXZlbnRzICYmIHRoaXMuX29uY2VFdmVudHNbIGV2ZW50TmFtZSBdO1xyXG5cclxuICB3aGlsZSAoIGxpc3RlbmVyICkge1xyXG4gICAgdmFyIGlzT25jZSA9IG9uY2VMaXN0ZW5lcnMgJiYgb25jZUxpc3RlbmVyc1sgbGlzdGVuZXIgXTtcclxuICAgIGlmICggaXNPbmNlICkge1xyXG4gICAgICAvLyByZW1vdmUgbGlzdGVuZXJcclxuICAgICAgLy8gcmVtb3ZlIGJlZm9yZSB0cmlnZ2VyIHRvIHByZXZlbnQgcmVjdXJzaW9uXHJcbiAgICAgIHRoaXMub2ZmKCBldmVudE5hbWUsIGxpc3RlbmVyICk7XHJcbiAgICAgIC8vIHVuc2V0IG9uY2UgZmxhZ1xyXG4gICAgICBkZWxldGUgb25jZUxpc3RlbmVyc1sgbGlzdGVuZXIgXTtcclxuICAgIH1cclxuICAgIC8vIHRyaWdnZXIgbGlzdGVuZXJcclxuICAgIGxpc3RlbmVyLmFwcGx5KCB0aGlzLCBhcmdzICk7XHJcbiAgICAvLyBnZXQgbmV4dCBsaXN0ZW5lclxyXG4gICAgaSArPSBpc09uY2UgPyAwIDogMTtcclxuICAgIGxpc3RlbmVyID0gbGlzdGVuZXJzW2ldO1xyXG4gIH1cclxuXHJcbiAgcmV0dXJuIHRoaXM7XHJcbn07XHJcblxyXG5yZXR1cm4gRXZFbWl0dGVyO1xyXG5cclxufSkpO1xyXG5cclxuLyohXHJcbiAqIGdldFNpemUgdjIuMC4yXHJcbiAqIG1lYXN1cmUgc2l6ZSBvZiBlbGVtZW50c1xyXG4gKiBNSVQgbGljZW5zZVxyXG4gKi9cclxuXHJcbi8qanNoaW50IGJyb3dzZXI6IHRydWUsIHN0cmljdDogdHJ1ZSwgdW5kZWY6IHRydWUsIHVudXNlZDogdHJ1ZSAqL1xyXG4vKmdsb2JhbCBkZWZpbmU6IGZhbHNlLCBtb2R1bGU6IGZhbHNlLCBjb25zb2xlOiBmYWxzZSAqL1xyXG5cclxuKCBmdW5jdGlvbiggd2luZG93LCBmYWN0b3J5ICkge1xyXG4gICd1c2Ugc3RyaWN0JztcclxuXHJcbiAgaWYgKCB0eXBlb2YgZGVmaW5lID09ICdmdW5jdGlvbicgJiYgZGVmaW5lLmFtZCApIHtcclxuICAgIC8vIEFNRFxyXG4gICAgZGVmaW5lKCAnZ2V0LXNpemUvZ2V0LXNpemUnLFtdLGZ1bmN0aW9uKCkge1xyXG4gICAgICByZXR1cm4gZmFjdG9yeSgpO1xyXG4gICAgfSk7XHJcbiAgfSBlbHNlIGlmICggdHlwZW9mIG1vZHVsZSA9PSAnb2JqZWN0JyAmJiBtb2R1bGUuZXhwb3J0cyApIHtcclxuICAgIC8vIENvbW1vbkpTXHJcbiAgICBtb2R1bGUuZXhwb3J0cyA9IGZhY3RvcnkoKTtcclxuICB9IGVsc2Uge1xyXG4gICAgLy8gYnJvd3NlciBnbG9iYWxcclxuICAgIHdpbmRvdy5nZXRTaXplID0gZmFjdG9yeSgpO1xyXG4gIH1cclxuXHJcbn0pKCB3aW5kb3csIGZ1bmN0aW9uIGZhY3RvcnkoKSB7XHJcbid1c2Ugc3RyaWN0JztcclxuXHJcbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tIGhlbHBlcnMgLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0gLy9cclxuXHJcbi8vIGdldCBhIG51bWJlciBmcm9tIGEgc3RyaW5nLCBub3QgYSBwZXJjZW50YWdlXHJcbmZ1bmN0aW9uIGdldFN0eWxlU2l6ZSggdmFsdWUgKSB7XHJcbiAgdmFyIG51bSA9IHBhcnNlRmxvYXQoIHZhbHVlICk7XHJcbiAgLy8gbm90IGEgcGVyY2VudCBsaWtlICcxMDAlJywgYW5kIGEgbnVtYmVyXHJcbiAgdmFyIGlzVmFsaWQgPSB2YWx1ZS5pbmRleE9mKCclJykgPT0gLTEgJiYgIWlzTmFOKCBudW0gKTtcclxuICByZXR1cm4gaXNWYWxpZCAmJiBudW07XHJcbn1cclxuXHJcbmZ1bmN0aW9uIG5vb3AoKSB7fVxyXG5cclxudmFyIGxvZ0Vycm9yID0gdHlwZW9mIGNvbnNvbGUgPT0gJ3VuZGVmaW5lZCcgPyBub29wIDpcclxuICBmdW5jdGlvbiggbWVzc2FnZSApIHtcclxuICAgIGNvbnNvbGUuZXJyb3IoIG1lc3NhZ2UgKTtcclxuICB9O1xyXG5cclxuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0gbWVhc3VyZW1lbnRzIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tIC8vXHJcblxyXG52YXIgbWVhc3VyZW1lbnRzID0gW1xyXG4gICdwYWRkaW5nTGVmdCcsXHJcbiAgJ3BhZGRpbmdSaWdodCcsXHJcbiAgJ3BhZGRpbmdUb3AnLFxyXG4gICdwYWRkaW5nQm90dG9tJyxcclxuICAnbWFyZ2luTGVmdCcsXHJcbiAgJ21hcmdpblJpZ2h0JyxcclxuICAnbWFyZ2luVG9wJyxcclxuICAnbWFyZ2luQm90dG9tJyxcclxuICAnYm9yZGVyTGVmdFdpZHRoJyxcclxuICAnYm9yZGVyUmlnaHRXaWR0aCcsXHJcbiAgJ2JvcmRlclRvcFdpZHRoJyxcclxuICAnYm9yZGVyQm90dG9tV2lkdGgnXHJcbl07XHJcblxyXG52YXIgbWVhc3VyZW1lbnRzTGVuZ3RoID0gbWVhc3VyZW1lbnRzLmxlbmd0aDtcclxuXHJcbmZ1bmN0aW9uIGdldFplcm9TaXplKCkge1xyXG4gIHZhciBzaXplID0ge1xyXG4gICAgd2lkdGg6IDAsXHJcbiAgICBoZWlnaHQ6IDAsXHJcbiAgICBpbm5lcldpZHRoOiAwLFxyXG4gICAgaW5uZXJIZWlnaHQ6IDAsXHJcbiAgICBvdXRlcldpZHRoOiAwLFxyXG4gICAgb3V0ZXJIZWlnaHQ6IDBcclxuICB9O1xyXG4gIGZvciAoIHZhciBpPTA7IGkgPCBtZWFzdXJlbWVudHNMZW5ndGg7IGkrKyApIHtcclxuICAgIHZhciBtZWFzdXJlbWVudCA9IG1lYXN1cmVtZW50c1tpXTtcclxuICAgIHNpemVbIG1lYXN1cmVtZW50IF0gPSAwO1xyXG4gIH1cclxuICByZXR1cm4gc2l6ZTtcclxufVxyXG5cclxuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0gZ2V0U3R5bGUgLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0gLy9cclxuXHJcbi8qKlxyXG4gKiBnZXRTdHlsZSwgZ2V0IHN0eWxlIG9mIGVsZW1lbnQsIGNoZWNrIGZvciBGaXJlZm94IGJ1Z1xyXG4gKiBodHRwczovL2J1Z3ppbGxhLm1vemlsbGEub3JnL3Nob3dfYnVnLmNnaT9pZD01NDgzOTdcclxuICovXHJcbmZ1bmN0aW9uIGdldFN0eWxlKCBlbGVtICkge1xyXG4gIHZhciBzdHlsZSA9IGdldENvbXB1dGVkU3R5bGUoIGVsZW0gKTtcclxuICBpZiAoICFzdHlsZSApIHtcclxuICAgIGxvZ0Vycm9yKCAnU3R5bGUgcmV0dXJuZWQgJyArIHN0eWxlICtcclxuICAgICAgJy4gQXJlIHlvdSBydW5uaW5nIHRoaXMgY29kZSBpbiBhIGhpZGRlbiBpZnJhbWUgb24gRmlyZWZveD8gJyArXHJcbiAgICAgICdTZWUgaHR0cDovL2JpdC5seS9nZXRzaXplYnVnMScgKTtcclxuICB9XHJcbiAgcmV0dXJuIHN0eWxlO1xyXG59XHJcblxyXG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLSBzZXR1cCAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLSAvL1xyXG5cclxudmFyIGlzU2V0dXAgPSBmYWxzZTtcclxuXHJcbnZhciBpc0JveFNpemVPdXRlcjtcclxuXHJcbi8qKlxyXG4gKiBzZXR1cFxyXG4gKiBjaGVjayBpc0JveFNpemVyT3V0ZXJcclxuICogZG8gb24gZmlyc3QgZ2V0U2l6ZSgpIHJhdGhlciB0aGFuIG9uIHBhZ2UgbG9hZCBmb3IgRmlyZWZveCBidWdcclxuICovXHJcbmZ1bmN0aW9uIHNldHVwKCkge1xyXG4gIC8vIHNldHVwIG9uY2VcclxuICBpZiAoIGlzU2V0dXAgKSB7XHJcbiAgICByZXR1cm47XHJcbiAgfVxyXG4gIGlzU2V0dXAgPSB0cnVlO1xyXG5cclxuICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLSBib3ggc2l6aW5nIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tIC8vXHJcblxyXG4gIC8qKlxyXG4gICAqIFdlYktpdCBtZWFzdXJlcyB0aGUgb3V0ZXItd2lkdGggb24gc3R5bGUud2lkdGggb24gYm9yZGVyLWJveCBlbGVtc1xyXG4gICAqIElFICYgRmlyZWZveDwyOSBtZWFzdXJlcyB0aGUgaW5uZXItd2lkdGhcclxuICAgKi9cclxuICB2YXIgZGl2ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XHJcbiAgZGl2LnN0eWxlLndpZHRoID0gJzIwMHB4JztcclxuICBkaXYuc3R5bGUucGFkZGluZyA9ICcxcHggMnB4IDNweCA0cHgnO1xyXG4gIGRpdi5zdHlsZS5ib3JkZXJTdHlsZSA9ICdzb2xpZCc7XHJcbiAgZGl2LnN0eWxlLmJvcmRlcldpZHRoID0gJzFweCAycHggM3B4IDRweCc7XHJcbiAgZGl2LnN0eWxlLmJveFNpemluZyA9ICdib3JkZXItYm94JztcclxuXHJcbiAgdmFyIGJvZHkgPSBkb2N1bWVudC5ib2R5IHx8IGRvY3VtZW50LmRvY3VtZW50RWxlbWVudDtcclxuICBib2R5LmFwcGVuZENoaWxkKCBkaXYgKTtcclxuICB2YXIgc3R5bGUgPSBnZXRTdHlsZSggZGl2ICk7XHJcblxyXG4gIGdldFNpemUuaXNCb3hTaXplT3V0ZXIgPSBpc0JveFNpemVPdXRlciA9IGdldFN0eWxlU2l6ZSggc3R5bGUud2lkdGggKSA9PSAyMDA7XHJcbiAgYm9keS5yZW1vdmVDaGlsZCggZGl2ICk7XHJcblxyXG59XHJcblxyXG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLSBnZXRTaXplIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tIC8vXHJcblxyXG5mdW5jdGlvbiBnZXRTaXplKCBlbGVtICkge1xyXG4gIHNldHVwKCk7XHJcblxyXG4gIC8vIHVzZSBxdWVyeVNlbGV0b3IgaWYgZWxlbSBpcyBzdHJpbmdcclxuICBpZiAoIHR5cGVvZiBlbGVtID09ICdzdHJpbmcnICkge1xyXG4gICAgZWxlbSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoIGVsZW0gKTtcclxuICB9XHJcblxyXG4gIC8vIGRvIG5vdCBwcm9jZWVkIG9uIG5vbi1vYmplY3RzXHJcbiAgaWYgKCAhZWxlbSB8fCB0eXBlb2YgZWxlbSAhPSAnb2JqZWN0JyB8fCAhZWxlbS5ub2RlVHlwZSApIHtcclxuICAgIHJldHVybjtcclxuICB9XHJcblxyXG4gIHZhciBzdHlsZSA9IGdldFN0eWxlKCBlbGVtICk7XHJcblxyXG4gIC8vIGlmIGhpZGRlbiwgZXZlcnl0aGluZyBpcyAwXHJcbiAgaWYgKCBzdHlsZS5kaXNwbGF5ID09ICdub25lJyApIHtcclxuICAgIHJldHVybiBnZXRaZXJvU2l6ZSgpO1xyXG4gIH1cclxuXHJcbiAgdmFyIHNpemUgPSB7fTtcclxuICBzaXplLndpZHRoID0gZWxlbS5vZmZzZXRXaWR0aDtcclxuICBzaXplLmhlaWdodCA9IGVsZW0ub2Zmc2V0SGVpZ2h0O1xyXG5cclxuICB2YXIgaXNCb3JkZXJCb3ggPSBzaXplLmlzQm9yZGVyQm94ID0gc3R5bGUuYm94U2l6aW5nID09ICdib3JkZXItYm94JztcclxuXHJcbiAgLy8gZ2V0IGFsbCBtZWFzdXJlbWVudHNcclxuICBmb3IgKCB2YXIgaT0wOyBpIDwgbWVhc3VyZW1lbnRzTGVuZ3RoOyBpKysgKSB7XHJcbiAgICB2YXIgbWVhc3VyZW1lbnQgPSBtZWFzdXJlbWVudHNbaV07XHJcbiAgICB2YXIgdmFsdWUgPSBzdHlsZVsgbWVhc3VyZW1lbnQgXTtcclxuICAgIHZhciBudW0gPSBwYXJzZUZsb2F0KCB2YWx1ZSApO1xyXG4gICAgLy8gYW55ICdhdXRvJywgJ21lZGl1bScgdmFsdWUgd2lsbCBiZSAwXHJcbiAgICBzaXplWyBtZWFzdXJlbWVudCBdID0gIWlzTmFOKCBudW0gKSA/IG51bSA6IDA7XHJcbiAgfVxyXG5cclxuICB2YXIgcGFkZGluZ1dpZHRoID0gc2l6ZS5wYWRkaW5nTGVmdCArIHNpemUucGFkZGluZ1JpZ2h0O1xyXG4gIHZhciBwYWRkaW5nSGVpZ2h0ID0gc2l6ZS5wYWRkaW5nVG9wICsgc2l6ZS5wYWRkaW5nQm90dG9tO1xyXG4gIHZhciBtYXJnaW5XaWR0aCA9IHNpemUubWFyZ2luTGVmdCArIHNpemUubWFyZ2luUmlnaHQ7XHJcbiAgdmFyIG1hcmdpbkhlaWdodCA9IHNpemUubWFyZ2luVG9wICsgc2l6ZS5tYXJnaW5Cb3R0b207XHJcbiAgdmFyIGJvcmRlcldpZHRoID0gc2l6ZS5ib3JkZXJMZWZ0V2lkdGggKyBzaXplLmJvcmRlclJpZ2h0V2lkdGg7XHJcbiAgdmFyIGJvcmRlckhlaWdodCA9IHNpemUuYm9yZGVyVG9wV2lkdGggKyBzaXplLmJvcmRlckJvdHRvbVdpZHRoO1xyXG5cclxuICB2YXIgaXNCb3JkZXJCb3hTaXplT3V0ZXIgPSBpc0JvcmRlckJveCAmJiBpc0JveFNpemVPdXRlcjtcclxuXHJcbiAgLy8gb3ZlcndyaXRlIHdpZHRoIGFuZCBoZWlnaHQgaWYgd2UgY2FuIGdldCBpdCBmcm9tIHN0eWxlXHJcbiAgdmFyIHN0eWxlV2lkdGggPSBnZXRTdHlsZVNpemUoIHN0eWxlLndpZHRoICk7XHJcbiAgaWYgKCBzdHlsZVdpZHRoICE9PSBmYWxzZSApIHtcclxuICAgIHNpemUud2lkdGggPSBzdHlsZVdpZHRoICtcclxuICAgICAgLy8gYWRkIHBhZGRpbmcgYW5kIGJvcmRlciB1bmxlc3MgaXQncyBhbHJlYWR5IGluY2x1ZGluZyBpdFxyXG4gICAgICAoIGlzQm9yZGVyQm94U2l6ZU91dGVyID8gMCA6IHBhZGRpbmdXaWR0aCArIGJvcmRlcldpZHRoICk7XHJcbiAgfVxyXG5cclxuICB2YXIgc3R5bGVIZWlnaHQgPSBnZXRTdHlsZVNpemUoIHN0eWxlLmhlaWdodCApO1xyXG4gIGlmICggc3R5bGVIZWlnaHQgIT09IGZhbHNlICkge1xyXG4gICAgc2l6ZS5oZWlnaHQgPSBzdHlsZUhlaWdodCArXHJcbiAgICAgIC8vIGFkZCBwYWRkaW5nIGFuZCBib3JkZXIgdW5sZXNzIGl0J3MgYWxyZWFkeSBpbmNsdWRpbmcgaXRcclxuICAgICAgKCBpc0JvcmRlckJveFNpemVPdXRlciA/IDAgOiBwYWRkaW5nSGVpZ2h0ICsgYm9yZGVySGVpZ2h0ICk7XHJcbiAgfVxyXG5cclxuICBzaXplLmlubmVyV2lkdGggPSBzaXplLndpZHRoIC0gKCBwYWRkaW5nV2lkdGggKyBib3JkZXJXaWR0aCApO1xyXG4gIHNpemUuaW5uZXJIZWlnaHQgPSBzaXplLmhlaWdodCAtICggcGFkZGluZ0hlaWdodCArIGJvcmRlckhlaWdodCApO1xyXG5cclxuICBzaXplLm91dGVyV2lkdGggPSBzaXplLndpZHRoICsgbWFyZ2luV2lkdGg7XHJcbiAgc2l6ZS5vdXRlckhlaWdodCA9IHNpemUuaGVpZ2h0ICsgbWFyZ2luSGVpZ2h0O1xyXG5cclxuICByZXR1cm4gc2l6ZTtcclxufVxyXG5cclxucmV0dXJuIGdldFNpemU7XHJcblxyXG59KTtcclxuXHJcbi8qKlxyXG4gKiBtYXRjaGVzU2VsZWN0b3IgdjIuMC4xXHJcbiAqIG1hdGNoZXNTZWxlY3RvciggZWxlbWVudCwgJy5zZWxlY3RvcicgKVxyXG4gKiBNSVQgbGljZW5zZVxyXG4gKi9cclxuXHJcbi8qanNoaW50IGJyb3dzZXI6IHRydWUsIHN0cmljdDogdHJ1ZSwgdW5kZWY6IHRydWUsIHVudXNlZDogdHJ1ZSAqL1xyXG5cclxuKCBmdW5jdGlvbiggd2luZG93LCBmYWN0b3J5ICkge1xyXG4gIC8qZ2xvYmFsIGRlZmluZTogZmFsc2UsIG1vZHVsZTogZmFsc2UgKi9cclxuICAndXNlIHN0cmljdCc7XHJcbiAgLy8gdW5pdmVyc2FsIG1vZHVsZSBkZWZpbml0aW9uXHJcbiAgaWYgKCB0eXBlb2YgZGVmaW5lID09ICdmdW5jdGlvbicgJiYgZGVmaW5lLmFtZCApIHtcclxuICAgIC8vIEFNRFxyXG4gICAgZGVmaW5lKCAnZGVzYW5kcm8tbWF0Y2hlcy1zZWxlY3Rvci9tYXRjaGVzLXNlbGVjdG9yJyxmYWN0b3J5ICk7XHJcbiAgfSBlbHNlIGlmICggdHlwZW9mIG1vZHVsZSA9PSAnb2JqZWN0JyAmJiBtb2R1bGUuZXhwb3J0cyApIHtcclxuICAgIC8vIENvbW1vbkpTXHJcbiAgICBtb2R1bGUuZXhwb3J0cyA9IGZhY3RvcnkoKTtcclxuICB9IGVsc2Uge1xyXG4gICAgLy8gYnJvd3NlciBnbG9iYWxcclxuICAgIHdpbmRvdy5tYXRjaGVzU2VsZWN0b3IgPSBmYWN0b3J5KCk7XHJcbiAgfVxyXG5cclxufSggd2luZG93LCBmdW5jdGlvbiBmYWN0b3J5KCkge1xyXG4gICd1c2Ugc3RyaWN0JztcclxuXHJcbiAgdmFyIG1hdGNoZXNNZXRob2QgPSAoIGZ1bmN0aW9uKCkge1xyXG4gICAgdmFyIEVsZW1Qcm90byA9IEVsZW1lbnQucHJvdG90eXBlO1xyXG4gICAgLy8gY2hlY2sgZm9yIHRoZSBzdGFuZGFyZCBtZXRob2QgbmFtZSBmaXJzdFxyXG4gICAgaWYgKCBFbGVtUHJvdG8ubWF0Y2hlcyApIHtcclxuICAgICAgcmV0dXJuICdtYXRjaGVzJztcclxuICAgIH1cclxuICAgIC8vIGNoZWNrIHVuLXByZWZpeGVkXHJcbiAgICBpZiAoIEVsZW1Qcm90by5tYXRjaGVzU2VsZWN0b3IgKSB7XHJcbiAgICAgIHJldHVybiAnbWF0Y2hlc1NlbGVjdG9yJztcclxuICAgIH1cclxuICAgIC8vIGNoZWNrIHZlbmRvciBwcmVmaXhlc1xyXG4gICAgdmFyIHByZWZpeGVzID0gWyAnd2Via2l0JywgJ21veicsICdtcycsICdvJyBdO1xyXG5cclxuICAgIGZvciAoIHZhciBpPTA7IGkgPCBwcmVmaXhlcy5sZW5ndGg7IGkrKyApIHtcclxuICAgICAgdmFyIHByZWZpeCA9IHByZWZpeGVzW2ldO1xyXG4gICAgICB2YXIgbWV0aG9kID0gcHJlZml4ICsgJ01hdGNoZXNTZWxlY3Rvcic7XHJcbiAgICAgIGlmICggRWxlbVByb3RvWyBtZXRob2QgXSApIHtcclxuICAgICAgICByZXR1cm4gbWV0aG9kO1xyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgfSkoKTtcclxuXHJcbiAgcmV0dXJuIGZ1bmN0aW9uIG1hdGNoZXNTZWxlY3RvciggZWxlbSwgc2VsZWN0b3IgKSB7XHJcbiAgICByZXR1cm4gZWxlbVsgbWF0Y2hlc01ldGhvZCBdKCBzZWxlY3RvciApO1xyXG4gIH07XHJcblxyXG59KSk7XHJcblxyXG4vKipcclxuICogRml6enkgVUkgdXRpbHMgdjIuMC4xXHJcbiAqIE1JVCBsaWNlbnNlXHJcbiAqL1xyXG5cclxuLypqc2hpbnQgYnJvd3NlcjogdHJ1ZSwgdW5kZWY6IHRydWUsIHVudXNlZDogdHJ1ZSwgc3RyaWN0OiB0cnVlICovXHJcblxyXG4oIGZ1bmN0aW9uKCB3aW5kb3csIGZhY3RvcnkgKSB7XHJcbiAgLy8gdW5pdmVyc2FsIG1vZHVsZSBkZWZpbml0aW9uXHJcbiAgLypqc2hpbnQgc3RyaWN0OiBmYWxzZSAqLyAvKmdsb2JhbHMgZGVmaW5lLCBtb2R1bGUsIHJlcXVpcmUgKi9cclxuXHJcbiAgaWYgKCB0eXBlb2YgZGVmaW5lID09ICdmdW5jdGlvbicgJiYgZGVmaW5lLmFtZCApIHtcclxuICAgIC8vIEFNRFxyXG4gICAgZGVmaW5lKCAnZml6enktdWktdXRpbHMvdXRpbHMnLFtcclxuICAgICAgJ2Rlc2FuZHJvLW1hdGNoZXMtc2VsZWN0b3IvbWF0Y2hlcy1zZWxlY3RvcidcclxuICAgIF0sIGZ1bmN0aW9uKCBtYXRjaGVzU2VsZWN0b3IgKSB7XHJcbiAgICAgIHJldHVybiBmYWN0b3J5KCB3aW5kb3csIG1hdGNoZXNTZWxlY3RvciApO1xyXG4gICAgfSk7XHJcbiAgfSBlbHNlIGlmICggdHlwZW9mIG1vZHVsZSA9PSAnb2JqZWN0JyAmJiBtb2R1bGUuZXhwb3J0cyApIHtcclxuICAgIC8vIENvbW1vbkpTXHJcbiAgICBtb2R1bGUuZXhwb3J0cyA9IGZhY3RvcnkoXHJcbiAgICAgIHdpbmRvdyxcclxuICAgICAgcmVxdWlyZSgnZGVzYW5kcm8tbWF0Y2hlcy1zZWxlY3RvcicpXHJcbiAgICApO1xyXG4gIH0gZWxzZSB7XHJcbiAgICAvLyBicm93c2VyIGdsb2JhbFxyXG4gICAgd2luZG93LmZpenp5VUlVdGlscyA9IGZhY3RvcnkoXHJcbiAgICAgIHdpbmRvdyxcclxuICAgICAgd2luZG93Lm1hdGNoZXNTZWxlY3RvclxyXG4gICAgKTtcclxuICB9XHJcblxyXG59KCB3aW5kb3csIGZ1bmN0aW9uIGZhY3RvcnkoIHdpbmRvdywgbWF0Y2hlc1NlbGVjdG9yICkge1xyXG5cclxuXHJcblxyXG52YXIgdXRpbHMgPSB7fTtcclxuXHJcbi8vIC0tLS0tIGV4dGVuZCAtLS0tLSAvL1xyXG5cclxuLy8gZXh0ZW5kcyBvYmplY3RzXHJcbnV0aWxzLmV4dGVuZCA9IGZ1bmN0aW9uKCBhLCBiICkge1xyXG4gIGZvciAoIHZhciBwcm9wIGluIGIgKSB7XHJcbiAgICBhWyBwcm9wIF0gPSBiWyBwcm9wIF07XHJcbiAgfVxyXG4gIHJldHVybiBhO1xyXG59O1xyXG5cclxuLy8gLS0tLS0gbW9kdWxvIC0tLS0tIC8vXHJcblxyXG51dGlscy5tb2R1bG8gPSBmdW5jdGlvbiggbnVtLCBkaXYgKSB7XHJcbiAgcmV0dXJuICggKCBudW0gJSBkaXYgKSArIGRpdiApICUgZGl2O1xyXG59O1xyXG5cclxuLy8gLS0tLS0gbWFrZUFycmF5IC0tLS0tIC8vXHJcblxyXG4vLyB0dXJuIGVsZW1lbnQgb3Igbm9kZUxpc3QgaW50byBhbiBhcnJheVxyXG51dGlscy5tYWtlQXJyYXkgPSBmdW5jdGlvbiggb2JqICkge1xyXG4gIHZhciBhcnkgPSBbXTtcclxuICBpZiAoIEFycmF5LmlzQXJyYXkoIG9iaiApICkge1xyXG4gICAgLy8gdXNlIG9iamVjdCBpZiBhbHJlYWR5IGFuIGFycmF5XHJcbiAgICBhcnkgPSBvYmo7XHJcbiAgfSBlbHNlIGlmICggb2JqICYmIHR5cGVvZiBvYmoubGVuZ3RoID09ICdudW1iZXInICkge1xyXG4gICAgLy8gY29udmVydCBub2RlTGlzdCB0byBhcnJheVxyXG4gICAgZm9yICggdmFyIGk9MDsgaSA8IG9iai5sZW5ndGg7IGkrKyApIHtcclxuICAgICAgYXJ5LnB1c2goIG9ialtpXSApO1xyXG4gICAgfVxyXG4gIH0gZWxzZSB7XHJcbiAgICAvLyBhcnJheSBvZiBzaW5nbGUgaW5kZXhcclxuICAgIGFyeS5wdXNoKCBvYmogKTtcclxuICB9XHJcbiAgcmV0dXJuIGFyeTtcclxufTtcclxuXHJcbi8vIC0tLS0tIHJlbW92ZUZyb20gLS0tLS0gLy9cclxuXHJcbnV0aWxzLnJlbW92ZUZyb20gPSBmdW5jdGlvbiggYXJ5LCBvYmogKSB7XHJcbiAgdmFyIGluZGV4ID0gYXJ5LmluZGV4T2YoIG9iaiApO1xyXG4gIGlmICggaW5kZXggIT0gLTEgKSB7XHJcbiAgICBhcnkuc3BsaWNlKCBpbmRleCwgMSApO1xyXG4gIH1cclxufTtcclxuXHJcbi8vIC0tLS0tIGdldFBhcmVudCAtLS0tLSAvL1xyXG5cclxudXRpbHMuZ2V0UGFyZW50ID0gZnVuY3Rpb24oIGVsZW0sIHNlbGVjdG9yICkge1xyXG4gIHdoaWxlICggZWxlbSAhPSBkb2N1bWVudC5ib2R5ICkge1xyXG4gICAgZWxlbSA9IGVsZW0ucGFyZW50Tm9kZTtcclxuICAgIGlmICggbWF0Y2hlc1NlbGVjdG9yKCBlbGVtLCBzZWxlY3RvciApICkge1xyXG4gICAgICByZXR1cm4gZWxlbTtcclxuICAgIH1cclxuICB9XHJcbn07XHJcblxyXG4vLyAtLS0tLSBnZXRRdWVyeUVsZW1lbnQgLS0tLS0gLy9cclxuXHJcbi8vIHVzZSBlbGVtZW50IGFzIHNlbGVjdG9yIHN0cmluZ1xyXG51dGlscy5nZXRRdWVyeUVsZW1lbnQgPSBmdW5jdGlvbiggZWxlbSApIHtcclxuICBpZiAoIHR5cGVvZiBlbGVtID09ICdzdHJpbmcnICkge1xyXG4gICAgcmV0dXJuIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoIGVsZW0gKTtcclxuICB9XHJcbiAgcmV0dXJuIGVsZW07XHJcbn07XHJcblxyXG4vLyAtLS0tLSBoYW5kbGVFdmVudCAtLS0tLSAvL1xyXG5cclxuLy8gZW5hYmxlIC5vbnR5cGUgdG8gdHJpZ2dlciBmcm9tIC5hZGRFdmVudExpc3RlbmVyKCBlbGVtLCAndHlwZScgKVxyXG51dGlscy5oYW5kbGVFdmVudCA9IGZ1bmN0aW9uKCBldmVudCApIHtcclxuICB2YXIgbWV0aG9kID0gJ29uJyArIGV2ZW50LnR5cGU7XHJcbiAgaWYgKCB0aGlzWyBtZXRob2QgXSApIHtcclxuICAgIHRoaXNbIG1ldGhvZCBdKCBldmVudCApO1xyXG4gIH1cclxufTtcclxuXHJcbi8vIC0tLS0tIGZpbHRlckZpbmRFbGVtZW50cyAtLS0tLSAvL1xyXG5cclxudXRpbHMuZmlsdGVyRmluZEVsZW1lbnRzID0gZnVuY3Rpb24oIGVsZW1zLCBzZWxlY3RvciApIHtcclxuICAvLyBtYWtlIGFycmF5IG9mIGVsZW1zXHJcbiAgZWxlbXMgPSB1dGlscy5tYWtlQXJyYXkoIGVsZW1zICk7XHJcbiAgdmFyIGZmRWxlbXMgPSBbXTtcclxuXHJcbiAgZWxlbXMuZm9yRWFjaCggZnVuY3Rpb24oIGVsZW0gKSB7XHJcbiAgICAvLyBjaGVjayB0aGF0IGVsZW0gaXMgYW4gYWN0dWFsIGVsZW1lbnRcclxuICAgIGlmICggISggZWxlbSBpbnN0YW5jZW9mIEhUTUxFbGVtZW50ICkgKSB7XHJcbiAgICAgIHJldHVybjtcclxuICAgIH1cclxuICAgIC8vIGFkZCBlbGVtIGlmIG5vIHNlbGVjdG9yXHJcbiAgICBpZiAoICFzZWxlY3RvciApIHtcclxuICAgICAgZmZFbGVtcy5wdXNoKCBlbGVtICk7XHJcbiAgICAgIHJldHVybjtcclxuICAgIH1cclxuICAgIC8vIGZpbHRlciAmIGZpbmQgaXRlbXMgaWYgd2UgaGF2ZSBhIHNlbGVjdG9yXHJcbiAgICAvLyBmaWx0ZXJcclxuICAgIGlmICggbWF0Y2hlc1NlbGVjdG9yKCBlbGVtLCBzZWxlY3RvciApICkge1xyXG4gICAgICBmZkVsZW1zLnB1c2goIGVsZW0gKTtcclxuICAgIH1cclxuICAgIC8vIGZpbmQgY2hpbGRyZW5cclxuICAgIHZhciBjaGlsZEVsZW1zID0gZWxlbS5xdWVyeVNlbGVjdG9yQWxsKCBzZWxlY3RvciApO1xyXG4gICAgLy8gY29uY2F0IGNoaWxkRWxlbXMgdG8gZmlsdGVyRm91bmQgYXJyYXlcclxuICAgIGZvciAoIHZhciBpPTA7IGkgPCBjaGlsZEVsZW1zLmxlbmd0aDsgaSsrICkge1xyXG4gICAgICBmZkVsZW1zLnB1c2goIGNoaWxkRWxlbXNbaV0gKTtcclxuICAgIH1cclxuICB9KTtcclxuXHJcbiAgcmV0dXJuIGZmRWxlbXM7XHJcbn07XHJcblxyXG4vLyAtLS0tLSBkZWJvdW5jZU1ldGhvZCAtLS0tLSAvL1xyXG5cclxudXRpbHMuZGVib3VuY2VNZXRob2QgPSBmdW5jdGlvbiggX2NsYXNzLCBtZXRob2ROYW1lLCB0aHJlc2hvbGQgKSB7XHJcbiAgLy8gb3JpZ2luYWwgbWV0aG9kXHJcbiAgdmFyIG1ldGhvZCA9IF9jbGFzcy5wcm90b3R5cGVbIG1ldGhvZE5hbWUgXTtcclxuICB2YXIgdGltZW91dE5hbWUgPSBtZXRob2ROYW1lICsgJ1RpbWVvdXQnO1xyXG5cclxuICBfY2xhc3MucHJvdG90eXBlWyBtZXRob2ROYW1lIF0gPSBmdW5jdGlvbigpIHtcclxuICAgIHZhciB0aW1lb3V0ID0gdGhpc1sgdGltZW91dE5hbWUgXTtcclxuICAgIGlmICggdGltZW91dCApIHtcclxuICAgICAgY2xlYXJUaW1lb3V0KCB0aW1lb3V0ICk7XHJcbiAgICB9XHJcbiAgICB2YXIgYXJncyA9IGFyZ3VtZW50cztcclxuXHJcbiAgICB2YXIgX3RoaXMgPSB0aGlzO1xyXG4gICAgdGhpc1sgdGltZW91dE5hbWUgXSA9IHNldFRpbWVvdXQoIGZ1bmN0aW9uKCkge1xyXG4gICAgICBtZXRob2QuYXBwbHkoIF90aGlzLCBhcmdzICk7XHJcbiAgICAgIGRlbGV0ZSBfdGhpc1sgdGltZW91dE5hbWUgXTtcclxuICAgIH0sIHRocmVzaG9sZCB8fCAxMDAgKTtcclxuICB9O1xyXG59O1xyXG5cclxuLy8gLS0tLS0gZG9jUmVhZHkgLS0tLS0gLy9cclxuXHJcbnV0aWxzLmRvY1JlYWR5ID0gZnVuY3Rpb24oIGNhbGxiYWNrICkge1xyXG4gIGlmICggZG9jdW1lbnQucmVhZHlTdGF0ZSA9PSAnY29tcGxldGUnICkge1xyXG4gICAgY2FsbGJhY2soKTtcclxuICB9IGVsc2Uge1xyXG4gICAgZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lciggJ0RPTUNvbnRlbnRMb2FkZWQnLCBjYWxsYmFjayApO1xyXG4gIH1cclxufTtcclxuXHJcbi8vIC0tLS0tIGh0bWxJbml0IC0tLS0tIC8vXHJcblxyXG4vLyBodHRwOi8vamFtZXNyb2JlcnRzLm5hbWUvYmxvZy8yMDEwLzAyLzIyL3N0cmluZy1mdW5jdGlvbnMtZm9yLWphdmFzY3JpcHQtdHJpbS10by1jYW1lbC1jYXNlLXRvLWRhc2hlZC1hbmQtdG8tdW5kZXJzY29yZS9cclxudXRpbHMudG9EYXNoZWQgPSBmdW5jdGlvbiggc3RyICkge1xyXG4gIHJldHVybiBzdHIucmVwbGFjZSggLyguKShbQS1aXSkvZywgZnVuY3Rpb24oIG1hdGNoLCAkMSwgJDIgKSB7XHJcbiAgICByZXR1cm4gJDEgKyAnLScgKyAkMjtcclxuICB9KS50b0xvd2VyQ2FzZSgpO1xyXG59O1xyXG5cclxudmFyIGNvbnNvbGUgPSB3aW5kb3cuY29uc29sZTtcclxuLyoqXHJcbiAqIGFsbG93IHVzZXIgdG8gaW5pdGlhbGl6ZSBjbGFzc2VzIHZpYSBbZGF0YS1uYW1lc3BhY2VdIG9yIC5qcy1uYW1lc3BhY2UgY2xhc3NcclxuICogaHRtbEluaXQoIFdpZGdldCwgJ3dpZGdldE5hbWUnIClcclxuICogb3B0aW9ucyBhcmUgcGFyc2VkIGZyb20gZGF0YS1uYW1lc3BhY2Utb3B0aW9uc1xyXG4gKi9cclxudXRpbHMuaHRtbEluaXQgPSBmdW5jdGlvbiggV2lkZ2V0Q2xhc3MsIG5hbWVzcGFjZSApIHtcclxuICB1dGlscy5kb2NSZWFkeSggZnVuY3Rpb24oKSB7XHJcbiAgICB2YXIgZGFzaGVkTmFtZXNwYWNlID0gdXRpbHMudG9EYXNoZWQoIG5hbWVzcGFjZSApO1xyXG4gICAgdmFyIGRhdGFBdHRyID0gJ2RhdGEtJyArIGRhc2hlZE5hbWVzcGFjZTtcclxuICAgIHZhciBkYXRhQXR0ckVsZW1zID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbCggJ1snICsgZGF0YUF0dHIgKyAnXScgKTtcclxuICAgIHZhciBqc0Rhc2hFbGVtcyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoICcuanMtJyArIGRhc2hlZE5hbWVzcGFjZSApO1xyXG4gICAgdmFyIGVsZW1zID0gdXRpbHMubWFrZUFycmF5KCBkYXRhQXR0ckVsZW1zIClcclxuICAgICAgLmNvbmNhdCggdXRpbHMubWFrZUFycmF5KCBqc0Rhc2hFbGVtcyApICk7XHJcbiAgICB2YXIgZGF0YU9wdGlvbnNBdHRyID0gZGF0YUF0dHIgKyAnLW9wdGlvbnMnO1xyXG4gICAgdmFyIGpRdWVyeSA9IHdpbmRvdy5qUXVlcnk7XHJcblxyXG4gICAgZWxlbXMuZm9yRWFjaCggZnVuY3Rpb24oIGVsZW0gKSB7XHJcbiAgICAgIHZhciBhdHRyID0gZWxlbS5nZXRBdHRyaWJ1dGUoIGRhdGFBdHRyICkgfHxcclxuICAgICAgICBlbGVtLmdldEF0dHJpYnV0ZSggZGF0YU9wdGlvbnNBdHRyICk7XHJcbiAgICAgIHZhciBvcHRpb25zO1xyXG4gICAgICB0cnkge1xyXG4gICAgICAgIG9wdGlvbnMgPSBhdHRyICYmIEpTT04ucGFyc2UoIGF0dHIgKTtcclxuICAgICAgfSBjYXRjaCAoIGVycm9yICkge1xyXG4gICAgICAgIC8vIGxvZyBlcnJvciwgZG8gbm90IGluaXRpYWxpemVcclxuICAgICAgICBpZiAoIGNvbnNvbGUgKSB7XHJcbiAgICAgICAgICBjb25zb2xlLmVycm9yKCAnRXJyb3IgcGFyc2luZyAnICsgZGF0YUF0dHIgKyAnIG9uICcgKyBlbGVtLmNsYXNzTmFtZSArXHJcbiAgICAgICAgICAnOiAnICsgZXJyb3IgKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuO1xyXG4gICAgICB9XHJcbiAgICAgIC8vIGluaXRpYWxpemVcclxuICAgICAgdmFyIGluc3RhbmNlID0gbmV3IFdpZGdldENsYXNzKCBlbGVtLCBvcHRpb25zICk7XHJcbiAgICAgIC8vIG1ha2UgYXZhaWxhYmxlIHZpYSAkKCkuZGF0YSgnbGF5b3V0bmFtZScpXHJcbiAgICAgIGlmICggalF1ZXJ5ICkge1xyXG4gICAgICAgIGpRdWVyeS5kYXRhKCBlbGVtLCBuYW1lc3BhY2UsIGluc3RhbmNlICk7XHJcbiAgICAgIH1cclxuICAgIH0pO1xyXG5cclxuICB9KTtcclxufTtcclxuXHJcbi8vIC0tLS0tICAtLS0tLSAvL1xyXG5cclxucmV0dXJuIHV0aWxzO1xyXG5cclxufSkpO1xyXG5cclxuLyoqXHJcbiAqIE91dGxheWVyIEl0ZW1cclxuICovXHJcblxyXG4oIGZ1bmN0aW9uKCB3aW5kb3csIGZhY3RvcnkgKSB7XHJcbiAgLy8gdW5pdmVyc2FsIG1vZHVsZSBkZWZpbml0aW9uXHJcbiAgLyoganNoaW50IHN0cmljdDogZmFsc2UgKi8gLyogZ2xvYmFscyBkZWZpbmUsIG1vZHVsZSwgcmVxdWlyZSAqL1xyXG4gIGlmICggdHlwZW9mIGRlZmluZSA9PSAnZnVuY3Rpb24nICYmIGRlZmluZS5hbWQgKSB7XHJcbiAgICAvLyBBTUQgLSBSZXF1aXJlSlNcclxuICAgIGRlZmluZSggJ291dGxheWVyL2l0ZW0nLFtcclxuICAgICAgICAnZXYtZW1pdHRlci9ldi1lbWl0dGVyJyxcclxuICAgICAgICAnZ2V0LXNpemUvZ2V0LXNpemUnXHJcbiAgICAgIF0sXHJcbiAgICAgIGZhY3RvcnlcclxuICAgICk7XHJcbiAgfSBlbHNlIGlmICggdHlwZW9mIG1vZHVsZSA9PSAnb2JqZWN0JyAmJiBtb2R1bGUuZXhwb3J0cyApIHtcclxuICAgIC8vIENvbW1vbkpTIC0gQnJvd3NlcmlmeSwgV2VicGFja1xyXG4gICAgbW9kdWxlLmV4cG9ydHMgPSBmYWN0b3J5KFxyXG4gICAgICByZXF1aXJlKCdldi1lbWl0dGVyJyksXHJcbiAgICAgIHJlcXVpcmUoJ2dldC1zaXplJylcclxuICAgICk7XHJcbiAgfSBlbHNlIHtcclxuICAgIC8vIGJyb3dzZXIgZ2xvYmFsXHJcbiAgICB3aW5kb3cuT3V0bGF5ZXIgPSB7fTtcclxuICAgIHdpbmRvdy5PdXRsYXllci5JdGVtID0gZmFjdG9yeShcclxuICAgICAgd2luZG93LkV2RW1pdHRlcixcclxuICAgICAgd2luZG93LmdldFNpemVcclxuICAgICk7XHJcbiAgfVxyXG5cclxufSggd2luZG93LCBmdW5jdGlvbiBmYWN0b3J5KCBFdkVtaXR0ZXIsIGdldFNpemUgKSB7XHJcbid1c2Ugc3RyaWN0JztcclxuXHJcbi8vIC0tLS0tIGhlbHBlcnMgLS0tLS0gLy9cclxuXHJcbmZ1bmN0aW9uIGlzRW1wdHlPYmooIG9iaiApIHtcclxuICBmb3IgKCB2YXIgcHJvcCBpbiBvYmogKSB7XHJcbiAgICByZXR1cm4gZmFsc2U7XHJcbiAgfVxyXG4gIHByb3AgPSBudWxsO1xyXG4gIHJldHVybiB0cnVlO1xyXG59XHJcblxyXG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLSBDU1MzIHN1cHBvcnQgLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0gLy9cclxuXHJcblxyXG52YXIgZG9jRWxlbVN0eWxlID0gZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50LnN0eWxlO1xyXG5cclxudmFyIHRyYW5zaXRpb25Qcm9wZXJ0eSA9IHR5cGVvZiBkb2NFbGVtU3R5bGUudHJhbnNpdGlvbiA9PSAnc3RyaW5nJyA/XHJcbiAgJ3RyYW5zaXRpb24nIDogJ1dlYmtpdFRyYW5zaXRpb24nO1xyXG52YXIgdHJhbnNmb3JtUHJvcGVydHkgPSB0eXBlb2YgZG9jRWxlbVN0eWxlLnRyYW5zZm9ybSA9PSAnc3RyaW5nJyA/XHJcbiAgJ3RyYW5zZm9ybScgOiAnV2Via2l0VHJhbnNmb3JtJztcclxuXHJcbnZhciB0cmFuc2l0aW9uRW5kRXZlbnQgPSB7XHJcbiAgV2Via2l0VHJhbnNpdGlvbjogJ3dlYmtpdFRyYW5zaXRpb25FbmQnLFxyXG4gIHRyYW5zaXRpb246ICd0cmFuc2l0aW9uZW5kJ1xyXG59WyB0cmFuc2l0aW9uUHJvcGVydHkgXTtcclxuXHJcbi8vIGNhY2hlIGFsbCB2ZW5kb3IgcHJvcGVydGllcyB0aGF0IGNvdWxkIGhhdmUgdmVuZG9yIHByZWZpeFxyXG52YXIgdmVuZG9yUHJvcGVydGllcyA9IHtcclxuICB0cmFuc2Zvcm06IHRyYW5zZm9ybVByb3BlcnR5LFxyXG4gIHRyYW5zaXRpb246IHRyYW5zaXRpb25Qcm9wZXJ0eSxcclxuICB0cmFuc2l0aW9uRHVyYXRpb246IHRyYW5zaXRpb25Qcm9wZXJ0eSArICdEdXJhdGlvbicsXHJcbiAgdHJhbnNpdGlvblByb3BlcnR5OiB0cmFuc2l0aW9uUHJvcGVydHkgKyAnUHJvcGVydHknLFxyXG4gIHRyYW5zaXRpb25EZWxheTogdHJhbnNpdGlvblByb3BlcnR5ICsgJ0RlbGF5J1xyXG59O1xyXG5cclxuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0gSXRlbSAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLSAvL1xyXG5cclxuZnVuY3Rpb24gSXRlbSggZWxlbWVudCwgbGF5b3V0ICkge1xyXG4gIGlmICggIWVsZW1lbnQgKSB7XHJcbiAgICByZXR1cm47XHJcbiAgfVxyXG5cclxuICB0aGlzLmVsZW1lbnQgPSBlbGVtZW50O1xyXG4gIC8vIHBhcmVudCBsYXlvdXQgY2xhc3MsIGkuZS4gTWFzb25yeSwgSXNvdG9wZSwgb3IgUGFja2VyeVxyXG4gIHRoaXMubGF5b3V0ID0gbGF5b3V0O1xyXG4gIHRoaXMucG9zaXRpb24gPSB7XHJcbiAgICB4OiAwLFxyXG4gICAgeTogMFxyXG4gIH07XHJcblxyXG4gIHRoaXMuX2NyZWF0ZSgpO1xyXG59XHJcblxyXG4vLyBpbmhlcml0IEV2RW1pdHRlclxyXG52YXIgcHJvdG8gPSBJdGVtLnByb3RvdHlwZSA9IE9iamVjdC5jcmVhdGUoIEV2RW1pdHRlci5wcm90b3R5cGUgKTtcclxucHJvdG8uY29uc3RydWN0b3IgPSBJdGVtO1xyXG5cclxucHJvdG8uX2NyZWF0ZSA9IGZ1bmN0aW9uKCkge1xyXG4gIC8vIHRyYW5zaXRpb24gb2JqZWN0c1xyXG4gIHRoaXMuX3RyYW5zbiA9IHtcclxuICAgIGluZ1Byb3BlcnRpZXM6IHt9LFxyXG4gICAgY2xlYW46IHt9LFxyXG4gICAgb25FbmQ6IHt9XHJcbiAgfTtcclxuXHJcbiAgdGhpcy5jc3Moe1xyXG4gICAgcG9zaXRpb246ICdhYnNvbHV0ZSdcclxuICB9KTtcclxufTtcclxuXHJcbi8vIHRyaWdnZXIgc3BlY2lmaWVkIGhhbmRsZXIgZm9yIGV2ZW50IHR5cGVcclxucHJvdG8uaGFuZGxlRXZlbnQgPSBmdW5jdGlvbiggZXZlbnQgKSB7XHJcbiAgdmFyIG1ldGhvZCA9ICdvbicgKyBldmVudC50eXBlO1xyXG4gIGlmICggdGhpc1sgbWV0aG9kIF0gKSB7XHJcbiAgICB0aGlzWyBtZXRob2QgXSggZXZlbnQgKTtcclxuICB9XHJcbn07XHJcblxyXG5wcm90by5nZXRTaXplID0gZnVuY3Rpb24oKSB7XHJcbiAgdGhpcy5zaXplID0gZ2V0U2l6ZSggdGhpcy5lbGVtZW50ICk7XHJcbn07XHJcblxyXG4vKipcclxuICogYXBwbHkgQ1NTIHN0eWxlcyB0byBlbGVtZW50XHJcbiAqIEBwYXJhbSB7T2JqZWN0fSBzdHlsZVxyXG4gKi9cclxucHJvdG8uY3NzID0gZnVuY3Rpb24oIHN0eWxlICkge1xyXG4gIHZhciBlbGVtU3R5bGUgPSB0aGlzLmVsZW1lbnQuc3R5bGU7XHJcblxyXG4gIGZvciAoIHZhciBwcm9wIGluIHN0eWxlICkge1xyXG4gICAgLy8gdXNlIHZlbmRvciBwcm9wZXJ0eSBpZiBhdmFpbGFibGVcclxuICAgIHZhciBzdXBwb3J0ZWRQcm9wID0gdmVuZG9yUHJvcGVydGllc1sgcHJvcCBdIHx8IHByb3A7XHJcbiAgICBlbGVtU3R5bGVbIHN1cHBvcnRlZFByb3AgXSA9IHN0eWxlWyBwcm9wIF07XHJcbiAgfVxyXG59O1xyXG5cclxuIC8vIG1lYXN1cmUgcG9zaXRpb24sIGFuZCBzZXRzIGl0XHJcbnByb3RvLmdldFBvc2l0aW9uID0gZnVuY3Rpb24oKSB7XHJcbiAgdmFyIHN0eWxlID0gZ2V0Q29tcHV0ZWRTdHlsZSggdGhpcy5lbGVtZW50ICk7XHJcbiAgdmFyIGlzT3JpZ2luTGVmdCA9IHRoaXMubGF5b3V0Ll9nZXRPcHRpb24oJ29yaWdpbkxlZnQnKTtcclxuICB2YXIgaXNPcmlnaW5Ub3AgPSB0aGlzLmxheW91dC5fZ2V0T3B0aW9uKCdvcmlnaW5Ub3AnKTtcclxuICB2YXIgeFZhbHVlID0gc3R5bGVbIGlzT3JpZ2luTGVmdCA/ICdsZWZ0JyA6ICdyaWdodCcgXTtcclxuICB2YXIgeVZhbHVlID0gc3R5bGVbIGlzT3JpZ2luVG9wID8gJ3RvcCcgOiAnYm90dG9tJyBdO1xyXG4gIC8vIGNvbnZlcnQgcGVyY2VudCB0byBwaXhlbHNcclxuICB2YXIgbGF5b3V0U2l6ZSA9IHRoaXMubGF5b3V0LnNpemU7XHJcbiAgdmFyIHggPSB4VmFsdWUuaW5kZXhPZignJScpICE9IC0xID9cclxuICAgICggcGFyc2VGbG9hdCggeFZhbHVlICkgLyAxMDAgKSAqIGxheW91dFNpemUud2lkdGggOiBwYXJzZUludCggeFZhbHVlLCAxMCApO1xyXG4gIHZhciB5ID0geVZhbHVlLmluZGV4T2YoJyUnKSAhPSAtMSA/XHJcbiAgICAoIHBhcnNlRmxvYXQoIHlWYWx1ZSApIC8gMTAwICkgKiBsYXlvdXRTaXplLmhlaWdodCA6IHBhcnNlSW50KCB5VmFsdWUsIDEwICk7XHJcblxyXG4gIC8vIGNsZWFuIHVwICdhdXRvJyBvciBvdGhlciBub24taW50ZWdlciB2YWx1ZXNcclxuICB4ID0gaXNOYU4oIHggKSA/IDAgOiB4O1xyXG4gIHkgPSBpc05hTiggeSApID8gMCA6IHk7XHJcbiAgLy8gcmVtb3ZlIHBhZGRpbmcgZnJvbSBtZWFzdXJlbWVudFxyXG4gIHggLT0gaXNPcmlnaW5MZWZ0ID8gbGF5b3V0U2l6ZS5wYWRkaW5nTGVmdCA6IGxheW91dFNpemUucGFkZGluZ1JpZ2h0O1xyXG4gIHkgLT0gaXNPcmlnaW5Ub3AgPyBsYXlvdXRTaXplLnBhZGRpbmdUb3AgOiBsYXlvdXRTaXplLnBhZGRpbmdCb3R0b207XHJcblxyXG4gIHRoaXMucG9zaXRpb24ueCA9IHg7XHJcbiAgdGhpcy5wb3NpdGlvbi55ID0geTtcclxufTtcclxuXHJcbi8vIHNldCBzZXR0bGVkIHBvc2l0aW9uLCBhcHBseSBwYWRkaW5nXHJcbnByb3RvLmxheW91dFBvc2l0aW9uID0gZnVuY3Rpb24oKSB7XHJcbiAgdmFyIGxheW91dFNpemUgPSB0aGlzLmxheW91dC5zaXplO1xyXG4gIHZhciBzdHlsZSA9IHt9O1xyXG4gIHZhciBpc09yaWdpbkxlZnQgPSB0aGlzLmxheW91dC5fZ2V0T3B0aW9uKCdvcmlnaW5MZWZ0Jyk7XHJcbiAgdmFyIGlzT3JpZ2luVG9wID0gdGhpcy5sYXlvdXQuX2dldE9wdGlvbignb3JpZ2luVG9wJyk7XHJcblxyXG4gIC8vIHhcclxuICB2YXIgeFBhZGRpbmcgPSBpc09yaWdpbkxlZnQgPyAncGFkZGluZ0xlZnQnIDogJ3BhZGRpbmdSaWdodCc7XHJcbiAgdmFyIHhQcm9wZXJ0eSA9IGlzT3JpZ2luTGVmdCA/ICdsZWZ0JyA6ICdyaWdodCc7XHJcbiAgdmFyIHhSZXNldFByb3BlcnR5ID0gaXNPcmlnaW5MZWZ0ID8gJ3JpZ2h0JyA6ICdsZWZ0JztcclxuXHJcbiAgdmFyIHggPSB0aGlzLnBvc2l0aW9uLnggKyBsYXlvdXRTaXplWyB4UGFkZGluZyBdO1xyXG4gIC8vIHNldCBpbiBwZXJjZW50YWdlIG9yIHBpeGVsc1xyXG4gIHN0eWxlWyB4UHJvcGVydHkgXSA9IHRoaXMuZ2V0WFZhbHVlKCB4ICk7XHJcbiAgLy8gcmVzZXQgb3RoZXIgcHJvcGVydHlcclxuICBzdHlsZVsgeFJlc2V0UHJvcGVydHkgXSA9ICcnO1xyXG5cclxuICAvLyB5XHJcbiAgdmFyIHlQYWRkaW5nID0gaXNPcmlnaW5Ub3AgPyAncGFkZGluZ1RvcCcgOiAncGFkZGluZ0JvdHRvbSc7XHJcbiAgdmFyIHlQcm9wZXJ0eSA9IGlzT3JpZ2luVG9wID8gJ3RvcCcgOiAnYm90dG9tJztcclxuICB2YXIgeVJlc2V0UHJvcGVydHkgPSBpc09yaWdpblRvcCA/ICdib3R0b20nIDogJ3RvcCc7XHJcblxyXG4gIHZhciB5ID0gdGhpcy5wb3NpdGlvbi55ICsgbGF5b3V0U2l6ZVsgeVBhZGRpbmcgXTtcclxuICAvLyBzZXQgaW4gcGVyY2VudGFnZSBvciBwaXhlbHNcclxuICBzdHlsZVsgeVByb3BlcnR5IF0gPSB0aGlzLmdldFlWYWx1ZSggeSApO1xyXG4gIC8vIHJlc2V0IG90aGVyIHByb3BlcnR5XHJcbiAgc3R5bGVbIHlSZXNldFByb3BlcnR5IF0gPSAnJztcclxuXHJcbiAgdGhpcy5jc3MoIHN0eWxlICk7XHJcbiAgdGhpcy5lbWl0RXZlbnQoICdsYXlvdXQnLCBbIHRoaXMgXSApO1xyXG59O1xyXG5cclxucHJvdG8uZ2V0WFZhbHVlID0gZnVuY3Rpb24oIHggKSB7XHJcbiAgdmFyIGlzSG9yaXpvbnRhbCA9IHRoaXMubGF5b3V0Ll9nZXRPcHRpb24oJ2hvcml6b250YWwnKTtcclxuICByZXR1cm4gdGhpcy5sYXlvdXQub3B0aW9ucy5wZXJjZW50UG9zaXRpb24gJiYgIWlzSG9yaXpvbnRhbCA/XHJcbiAgICAoICggeCAvIHRoaXMubGF5b3V0LnNpemUud2lkdGggKSAqIDEwMCApICsgJyUnIDogeCArICdweCc7XHJcbn07XHJcblxyXG5wcm90by5nZXRZVmFsdWUgPSBmdW5jdGlvbiggeSApIHtcclxuICB2YXIgaXNIb3Jpem9udGFsID0gdGhpcy5sYXlvdXQuX2dldE9wdGlvbignaG9yaXpvbnRhbCcpO1xyXG4gIHJldHVybiB0aGlzLmxheW91dC5vcHRpb25zLnBlcmNlbnRQb3NpdGlvbiAmJiBpc0hvcml6b250YWwgP1xyXG4gICAgKCAoIHkgLyB0aGlzLmxheW91dC5zaXplLmhlaWdodCApICogMTAwICkgKyAnJScgOiB5ICsgJ3B4JztcclxufTtcclxuXHJcbnByb3RvLl90cmFuc2l0aW9uVG8gPSBmdW5jdGlvbiggeCwgeSApIHtcclxuICB0aGlzLmdldFBvc2l0aW9uKCk7XHJcbiAgLy8gZ2V0IGN1cnJlbnQgeCAmIHkgZnJvbSB0b3AvbGVmdFxyXG4gIHZhciBjdXJYID0gdGhpcy5wb3NpdGlvbi54O1xyXG4gIHZhciBjdXJZID0gdGhpcy5wb3NpdGlvbi55O1xyXG5cclxuICB2YXIgY29tcGFyZVggPSBwYXJzZUludCggeCwgMTAgKTtcclxuICB2YXIgY29tcGFyZVkgPSBwYXJzZUludCggeSwgMTAgKTtcclxuICB2YXIgZGlkTm90TW92ZSA9IGNvbXBhcmVYID09PSB0aGlzLnBvc2l0aW9uLnggJiYgY29tcGFyZVkgPT09IHRoaXMucG9zaXRpb24ueTtcclxuXHJcbiAgLy8gc2F2ZSBlbmQgcG9zaXRpb25cclxuICB0aGlzLnNldFBvc2l0aW9uKCB4LCB5ICk7XHJcblxyXG4gIC8vIGlmIGRpZCBub3QgbW92ZSBhbmQgbm90IHRyYW5zaXRpb25pbmcsIGp1c3QgZ28gdG8gbGF5b3V0XHJcbiAgaWYgKCBkaWROb3RNb3ZlICYmICF0aGlzLmlzVHJhbnNpdGlvbmluZyApIHtcclxuICAgIHRoaXMubGF5b3V0UG9zaXRpb24oKTtcclxuICAgIHJldHVybjtcclxuICB9XHJcblxyXG4gIHZhciB0cmFuc1ggPSB4IC0gY3VyWDtcclxuICB2YXIgdHJhbnNZID0geSAtIGN1clk7XHJcbiAgdmFyIHRyYW5zaXRpb25TdHlsZSA9IHt9O1xyXG4gIHRyYW5zaXRpb25TdHlsZS50cmFuc2Zvcm0gPSB0aGlzLmdldFRyYW5zbGF0ZSggdHJhbnNYLCB0cmFuc1kgKTtcclxuXHJcbiAgdGhpcy50cmFuc2l0aW9uKHtcclxuICAgIHRvOiB0cmFuc2l0aW9uU3R5bGUsXHJcbiAgICBvblRyYW5zaXRpb25FbmQ6IHtcclxuICAgICAgdHJhbnNmb3JtOiB0aGlzLmxheW91dFBvc2l0aW9uXHJcbiAgICB9LFxyXG4gICAgaXNDbGVhbmluZzogdHJ1ZVxyXG4gIH0pO1xyXG59O1xyXG5cclxucHJvdG8uZ2V0VHJhbnNsYXRlID0gZnVuY3Rpb24oIHgsIHkgKSB7XHJcbiAgLy8gZmxpcCBjb29yaWRpbmF0ZXMgaWYgb3JpZ2luIG9uIHJpZ2h0IG9yIGJvdHRvbVxyXG4gIHZhciBpc09yaWdpbkxlZnQgPSB0aGlzLmxheW91dC5fZ2V0T3B0aW9uKCdvcmlnaW5MZWZ0Jyk7XHJcbiAgdmFyIGlzT3JpZ2luVG9wID0gdGhpcy5sYXlvdXQuX2dldE9wdGlvbignb3JpZ2luVG9wJyk7XHJcbiAgeCA9IGlzT3JpZ2luTGVmdCA/IHggOiAteDtcclxuICB5ID0gaXNPcmlnaW5Ub3AgPyB5IDogLXk7XHJcbiAgcmV0dXJuICd0cmFuc2xhdGUzZCgnICsgeCArICdweCwgJyArIHkgKyAncHgsIDApJztcclxufTtcclxuXHJcbi8vIG5vbiB0cmFuc2l0aW9uICsgdHJhbnNmb3JtIHN1cHBvcnRcclxucHJvdG8uZ29UbyA9IGZ1bmN0aW9uKCB4LCB5ICkge1xyXG4gIHRoaXMuc2V0UG9zaXRpb24oIHgsIHkgKTtcclxuICB0aGlzLmxheW91dFBvc2l0aW9uKCk7XHJcbn07XHJcblxyXG5wcm90by5tb3ZlVG8gPSBwcm90by5fdHJhbnNpdGlvblRvO1xyXG5cclxucHJvdG8uc2V0UG9zaXRpb24gPSBmdW5jdGlvbiggeCwgeSApIHtcclxuICB0aGlzLnBvc2l0aW9uLnggPSBwYXJzZUludCggeCwgMTAgKTtcclxuICB0aGlzLnBvc2l0aW9uLnkgPSBwYXJzZUludCggeSwgMTAgKTtcclxufTtcclxuXHJcbi8vIC0tLS0tIHRyYW5zaXRpb24gLS0tLS0gLy9cclxuXHJcbi8qKlxyXG4gKiBAcGFyYW0ge09iamVjdH0gc3R5bGUgLSBDU1NcclxuICogQHBhcmFtIHtGdW5jdGlvbn0gb25UcmFuc2l0aW9uRW5kXHJcbiAqL1xyXG5cclxuLy8gbm9uIHRyYW5zaXRpb24sIGp1c3QgdHJpZ2dlciBjYWxsYmFja1xyXG5wcm90by5fbm9uVHJhbnNpdGlvbiA9IGZ1bmN0aW9uKCBhcmdzICkge1xyXG4gIHRoaXMuY3NzKCBhcmdzLnRvICk7XHJcbiAgaWYgKCBhcmdzLmlzQ2xlYW5pbmcgKSB7XHJcbiAgICB0aGlzLl9yZW1vdmVTdHlsZXMoIGFyZ3MudG8gKTtcclxuICB9XHJcbiAgZm9yICggdmFyIHByb3AgaW4gYXJncy5vblRyYW5zaXRpb25FbmQgKSB7XHJcbiAgICBhcmdzLm9uVHJhbnNpdGlvbkVuZFsgcHJvcCBdLmNhbGwoIHRoaXMgKTtcclxuICB9XHJcbn07XHJcblxyXG4vKipcclxuICogcHJvcGVyIHRyYW5zaXRpb25cclxuICogQHBhcmFtIHtPYmplY3R9IGFyZ3MgLSBhcmd1bWVudHNcclxuICogICBAcGFyYW0ge09iamVjdH0gdG8gLSBzdHlsZSB0byB0cmFuc2l0aW9uIHRvXHJcbiAqICAgQHBhcmFtIHtPYmplY3R9IGZyb20gLSBzdHlsZSB0byBzdGFydCB0cmFuc2l0aW9uIGZyb21cclxuICogICBAcGFyYW0ge0Jvb2xlYW59IGlzQ2xlYW5pbmcgLSByZW1vdmVzIHRyYW5zaXRpb24gc3R5bGVzIGFmdGVyIHRyYW5zaXRpb25cclxuICogICBAcGFyYW0ge0Z1bmN0aW9ufSBvblRyYW5zaXRpb25FbmQgLSBjYWxsYmFja1xyXG4gKi9cclxucHJvdG8udHJhbnNpdGlvbiA9IGZ1bmN0aW9uKCBhcmdzICkge1xyXG4gIC8vIHJlZGlyZWN0IHRvIG5vblRyYW5zaXRpb24gaWYgbm8gdHJhbnNpdGlvbiBkdXJhdGlvblxyXG4gIGlmICggIXBhcnNlRmxvYXQoIHRoaXMubGF5b3V0Lm9wdGlvbnMudHJhbnNpdGlvbkR1cmF0aW9uICkgKSB7XHJcbiAgICB0aGlzLl9ub25UcmFuc2l0aW9uKCBhcmdzICk7XHJcbiAgICByZXR1cm47XHJcbiAgfVxyXG5cclxuICB2YXIgX3RyYW5zaXRpb24gPSB0aGlzLl90cmFuc247XHJcbiAgLy8ga2VlcCB0cmFjayBvZiBvblRyYW5zaXRpb25FbmQgY2FsbGJhY2sgYnkgY3NzIHByb3BlcnR5XHJcbiAgZm9yICggdmFyIHByb3AgaW4gYXJncy5vblRyYW5zaXRpb25FbmQgKSB7XHJcbiAgICBfdHJhbnNpdGlvbi5vbkVuZFsgcHJvcCBdID0gYXJncy5vblRyYW5zaXRpb25FbmRbIHByb3AgXTtcclxuICB9XHJcbiAgLy8ga2VlcCB0cmFjayBvZiBwcm9wZXJ0aWVzIHRoYXQgYXJlIHRyYW5zaXRpb25pbmdcclxuICBmb3IgKCBwcm9wIGluIGFyZ3MudG8gKSB7XHJcbiAgICBfdHJhbnNpdGlvbi5pbmdQcm9wZXJ0aWVzWyBwcm9wIF0gPSB0cnVlO1xyXG4gICAgLy8ga2VlcCB0cmFjayBvZiBwcm9wZXJ0aWVzIHRvIGNsZWFuIHVwIHdoZW4gdHJhbnNpdGlvbiBpcyBkb25lXHJcbiAgICBpZiAoIGFyZ3MuaXNDbGVhbmluZyApIHtcclxuICAgICAgX3RyYW5zaXRpb24uY2xlYW5bIHByb3AgXSA9IHRydWU7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICAvLyBzZXQgZnJvbSBzdHlsZXNcclxuICBpZiAoIGFyZ3MuZnJvbSApIHtcclxuICAgIHRoaXMuY3NzKCBhcmdzLmZyb20gKTtcclxuICAgIC8vIGZvcmNlIHJlZHJhdy4gaHR0cDovL2Jsb2cuYWxleG1hY2Nhdy5jb20vY3NzLXRyYW5zaXRpb25zXHJcbiAgICB2YXIgaCA9IHRoaXMuZWxlbWVudC5vZmZzZXRIZWlnaHQ7XHJcbiAgICAvLyBoYWNrIGZvciBKU0hpbnQgdG8gaHVzaCBhYm91dCB1bnVzZWQgdmFyXHJcbiAgICBoID0gbnVsbDtcclxuICB9XHJcbiAgLy8gZW5hYmxlIHRyYW5zaXRpb25cclxuICB0aGlzLmVuYWJsZVRyYW5zaXRpb24oIGFyZ3MudG8gKTtcclxuICAvLyBzZXQgc3R5bGVzIHRoYXQgYXJlIHRyYW5zaXRpb25pbmdcclxuICB0aGlzLmNzcyggYXJncy50byApO1xyXG5cclxuICB0aGlzLmlzVHJhbnNpdGlvbmluZyA9IHRydWU7XHJcblxyXG59O1xyXG5cclxuLy8gZGFzaCBiZWZvcmUgYWxsIGNhcCBsZXR0ZXJzLCBpbmNsdWRpbmcgZmlyc3QgZm9yXHJcbi8vIFdlYmtpdFRyYW5zZm9ybSA9PiAtd2Via2l0LXRyYW5zZm9ybVxyXG5mdW5jdGlvbiB0b0Rhc2hlZEFsbCggc3RyICkge1xyXG4gIHJldHVybiBzdHIucmVwbGFjZSggLyhbQS1aXSkvZywgZnVuY3Rpb24oICQxICkge1xyXG4gICAgcmV0dXJuICctJyArICQxLnRvTG93ZXJDYXNlKCk7XHJcbiAgfSk7XHJcbn1cclxuXHJcbnZhciB0cmFuc2l0aW9uUHJvcHMgPSAnb3BhY2l0eSwnICsgdG9EYXNoZWRBbGwoIHRyYW5zZm9ybVByb3BlcnR5ICk7XHJcblxyXG5wcm90by5lbmFibGVUcmFuc2l0aW9uID0gZnVuY3Rpb24oLyogc3R5bGUgKi8pIHtcclxuICAvLyBIQUNLIGNoYW5naW5nIHRyYW5zaXRpb25Qcm9wZXJ0eSBkdXJpbmcgYSB0cmFuc2l0aW9uXHJcbiAgLy8gd2lsbCBjYXVzZSB0cmFuc2l0aW9uIHRvIGp1bXBcclxuICBpZiAoIHRoaXMuaXNUcmFuc2l0aW9uaW5nICkge1xyXG4gICAgcmV0dXJuO1xyXG4gIH1cclxuXHJcbiAgLy8gbWFrZSBgdHJhbnNpdGlvbjogZm9vLCBiYXIsIGJhemAgZnJvbSBzdHlsZSBvYmplY3RcclxuICAvLyBIQUNLIHVuLWNvbW1lbnQgdGhpcyB3aGVuIGVuYWJsZVRyYW5zaXRpb24gY2FuIHdvcmtcclxuICAvLyB3aGlsZSBhIHRyYW5zaXRpb24gaXMgaGFwcGVuaW5nXHJcbiAgLy8gdmFyIHRyYW5zaXRpb25WYWx1ZXMgPSBbXTtcclxuICAvLyBmb3IgKCB2YXIgcHJvcCBpbiBzdHlsZSApIHtcclxuICAvLyAgIC8vIGRhc2gtaWZ5IGNhbWVsQ2FzZWQgcHJvcGVydGllcyBsaWtlIFdlYmtpdFRyYW5zaXRpb25cclxuICAvLyAgIHByb3AgPSB2ZW5kb3JQcm9wZXJ0aWVzWyBwcm9wIF0gfHwgcHJvcDtcclxuICAvLyAgIHRyYW5zaXRpb25WYWx1ZXMucHVzaCggdG9EYXNoZWRBbGwoIHByb3AgKSApO1xyXG4gIC8vIH1cclxuICAvLyBtdW5nZSBudW1iZXIgdG8gbWlsbGlzZWNvbmQsIHRvIG1hdGNoIHN0YWdnZXJcclxuICB2YXIgZHVyYXRpb24gPSB0aGlzLmxheW91dC5vcHRpb25zLnRyYW5zaXRpb25EdXJhdGlvbjtcclxuICBkdXJhdGlvbiA9IHR5cGVvZiBkdXJhdGlvbiA9PSAnbnVtYmVyJyA/IGR1cmF0aW9uICsgJ21zJyA6IGR1cmF0aW9uO1xyXG4gIC8vIGVuYWJsZSB0cmFuc2l0aW9uIHN0eWxlc1xyXG4gIHRoaXMuY3NzKHtcclxuICAgIHRyYW5zaXRpb25Qcm9wZXJ0eTogdHJhbnNpdGlvblByb3BzLFxyXG4gICAgdHJhbnNpdGlvbkR1cmF0aW9uOiBkdXJhdGlvbixcclxuICAgIHRyYW5zaXRpb25EZWxheTogdGhpcy5zdGFnZ2VyRGVsYXkgfHwgMFxyXG4gIH0pO1xyXG4gIC8vIGxpc3RlbiBmb3IgdHJhbnNpdGlvbiBlbmQgZXZlbnRcclxuICB0aGlzLmVsZW1lbnQuYWRkRXZlbnRMaXN0ZW5lciggdHJhbnNpdGlvbkVuZEV2ZW50LCB0aGlzLCBmYWxzZSApO1xyXG59O1xyXG5cclxuLy8gLS0tLS0gZXZlbnRzIC0tLS0tIC8vXHJcblxyXG5wcm90by5vbndlYmtpdFRyYW5zaXRpb25FbmQgPSBmdW5jdGlvbiggZXZlbnQgKSB7XHJcbiAgdGhpcy5vbnRyYW5zaXRpb25lbmQoIGV2ZW50ICk7XHJcbn07XHJcblxyXG5wcm90by5vbm90cmFuc2l0aW9uZW5kID0gZnVuY3Rpb24oIGV2ZW50ICkge1xyXG4gIHRoaXMub250cmFuc2l0aW9uZW5kKCBldmVudCApO1xyXG59O1xyXG5cclxuLy8gcHJvcGVydGllcyB0aGF0IEkgbXVuZ2UgdG8gbWFrZSBteSBsaWZlIGVhc2llclxyXG52YXIgZGFzaGVkVmVuZG9yUHJvcGVydGllcyA9IHtcclxuICAnLXdlYmtpdC10cmFuc2Zvcm0nOiAndHJhbnNmb3JtJ1xyXG59O1xyXG5cclxucHJvdG8ub250cmFuc2l0aW9uZW5kID0gZnVuY3Rpb24oIGV2ZW50ICkge1xyXG4gIC8vIGRpc3JlZ2FyZCBidWJibGVkIGV2ZW50cyBmcm9tIGNoaWxkcmVuXHJcbiAgaWYgKCBldmVudC50YXJnZXQgIT09IHRoaXMuZWxlbWVudCApIHtcclxuICAgIHJldHVybjtcclxuICB9XHJcbiAgdmFyIF90cmFuc2l0aW9uID0gdGhpcy5fdHJhbnNuO1xyXG4gIC8vIGdldCBwcm9wZXJ0eSBuYW1lIG9mIHRyYW5zaXRpb25lZCBwcm9wZXJ0eSwgY29udmVydCB0byBwcmVmaXgtZnJlZVxyXG4gIHZhciBwcm9wZXJ0eU5hbWUgPSBkYXNoZWRWZW5kb3JQcm9wZXJ0aWVzWyBldmVudC5wcm9wZXJ0eU5hbWUgXSB8fCBldmVudC5wcm9wZXJ0eU5hbWU7XHJcblxyXG4gIC8vIHJlbW92ZSBwcm9wZXJ0eSB0aGF0IGhhcyBjb21wbGV0ZWQgdHJhbnNpdGlvbmluZ1xyXG4gIGRlbGV0ZSBfdHJhbnNpdGlvbi5pbmdQcm9wZXJ0aWVzWyBwcm9wZXJ0eU5hbWUgXTtcclxuICAvLyBjaGVjayBpZiBhbnkgcHJvcGVydGllcyBhcmUgc3RpbGwgdHJhbnNpdGlvbmluZ1xyXG4gIGlmICggaXNFbXB0eU9iaiggX3RyYW5zaXRpb24uaW5nUHJvcGVydGllcyApICkge1xyXG4gICAgLy8gYWxsIHByb3BlcnRpZXMgaGF2ZSBjb21wbGV0ZWQgdHJhbnNpdGlvbmluZ1xyXG4gICAgdGhpcy5kaXNhYmxlVHJhbnNpdGlvbigpO1xyXG4gIH1cclxuICAvLyBjbGVhbiBzdHlsZVxyXG4gIGlmICggcHJvcGVydHlOYW1lIGluIF90cmFuc2l0aW9uLmNsZWFuICkge1xyXG4gICAgLy8gY2xlYW4gdXAgc3R5bGVcclxuICAgIHRoaXMuZWxlbWVudC5zdHlsZVsgZXZlbnQucHJvcGVydHlOYW1lIF0gPSAnJztcclxuICAgIGRlbGV0ZSBfdHJhbnNpdGlvbi5jbGVhblsgcHJvcGVydHlOYW1lIF07XHJcbiAgfVxyXG4gIC8vIHRyaWdnZXIgb25UcmFuc2l0aW9uRW5kIGNhbGxiYWNrXHJcbiAgaWYgKCBwcm9wZXJ0eU5hbWUgaW4gX3RyYW5zaXRpb24ub25FbmQgKSB7XHJcbiAgICB2YXIgb25UcmFuc2l0aW9uRW5kID0gX3RyYW5zaXRpb24ub25FbmRbIHByb3BlcnR5TmFtZSBdO1xyXG4gICAgb25UcmFuc2l0aW9uRW5kLmNhbGwoIHRoaXMgKTtcclxuICAgIGRlbGV0ZSBfdHJhbnNpdGlvbi5vbkVuZFsgcHJvcGVydHlOYW1lIF07XHJcbiAgfVxyXG5cclxuICB0aGlzLmVtaXRFdmVudCggJ3RyYW5zaXRpb25FbmQnLCBbIHRoaXMgXSApO1xyXG59O1xyXG5cclxucHJvdG8uZGlzYWJsZVRyYW5zaXRpb24gPSBmdW5jdGlvbigpIHtcclxuICB0aGlzLnJlbW92ZVRyYW5zaXRpb25TdHlsZXMoKTtcclxuICB0aGlzLmVsZW1lbnQucmVtb3ZlRXZlbnRMaXN0ZW5lciggdHJhbnNpdGlvbkVuZEV2ZW50LCB0aGlzLCBmYWxzZSApO1xyXG4gIHRoaXMuaXNUcmFuc2l0aW9uaW5nID0gZmFsc2U7XHJcbn07XHJcblxyXG4vKipcclxuICogcmVtb3ZlcyBzdHlsZSBwcm9wZXJ0eSBmcm9tIGVsZW1lbnRcclxuICogQHBhcmFtIHtPYmplY3R9IHN0eWxlXHJcbioqL1xyXG5wcm90by5fcmVtb3ZlU3R5bGVzID0gZnVuY3Rpb24oIHN0eWxlICkge1xyXG4gIC8vIGNsZWFuIHVwIHRyYW5zaXRpb24gc3R5bGVzXHJcbiAgdmFyIGNsZWFuU3R5bGUgPSB7fTtcclxuICBmb3IgKCB2YXIgcHJvcCBpbiBzdHlsZSApIHtcclxuICAgIGNsZWFuU3R5bGVbIHByb3AgXSA9ICcnO1xyXG4gIH1cclxuICB0aGlzLmNzcyggY2xlYW5TdHlsZSApO1xyXG59O1xyXG5cclxudmFyIGNsZWFuVHJhbnNpdGlvblN0eWxlID0ge1xyXG4gIHRyYW5zaXRpb25Qcm9wZXJ0eTogJycsXHJcbiAgdHJhbnNpdGlvbkR1cmF0aW9uOiAnJyxcclxuICB0cmFuc2l0aW9uRGVsYXk6ICcnXHJcbn07XHJcblxyXG5wcm90by5yZW1vdmVUcmFuc2l0aW9uU3R5bGVzID0gZnVuY3Rpb24oKSB7XHJcbiAgLy8gcmVtb3ZlIHRyYW5zaXRpb25cclxuICB0aGlzLmNzcyggY2xlYW5UcmFuc2l0aW9uU3R5bGUgKTtcclxufTtcclxuXHJcbi8vIC0tLS0tIHN0YWdnZXIgLS0tLS0gLy9cclxuXHJcbnByb3RvLnN0YWdnZXIgPSBmdW5jdGlvbiggZGVsYXkgKSB7XHJcbiAgZGVsYXkgPSBpc05hTiggZGVsYXkgKSA/IDAgOiBkZWxheTtcclxuICB0aGlzLnN0YWdnZXJEZWxheSA9IGRlbGF5ICsgJ21zJztcclxufTtcclxuXHJcbi8vIC0tLS0tIHNob3cvaGlkZS9yZW1vdmUgLS0tLS0gLy9cclxuXHJcbi8vIHJlbW92ZSBlbGVtZW50IGZyb20gRE9NXHJcbnByb3RvLnJlbW92ZUVsZW0gPSBmdW5jdGlvbigpIHtcclxuICB0aGlzLmVsZW1lbnQucGFyZW50Tm9kZS5yZW1vdmVDaGlsZCggdGhpcy5lbGVtZW50ICk7XHJcbiAgLy8gcmVtb3ZlIGRpc3BsYXk6IG5vbmVcclxuICB0aGlzLmNzcyh7IGRpc3BsYXk6ICcnIH0pO1xyXG4gIHRoaXMuZW1pdEV2ZW50KCAncmVtb3ZlJywgWyB0aGlzIF0gKTtcclxufTtcclxuXHJcbnByb3RvLnJlbW92ZSA9IGZ1bmN0aW9uKCkge1xyXG4gIC8vIGp1c3QgcmVtb3ZlIGVsZW1lbnQgaWYgbm8gdHJhbnNpdGlvbiBzdXBwb3J0IG9yIG5vIHRyYW5zaXRpb25cclxuICBpZiAoICF0cmFuc2l0aW9uUHJvcGVydHkgfHwgIXBhcnNlRmxvYXQoIHRoaXMubGF5b3V0Lm9wdGlvbnMudHJhbnNpdGlvbkR1cmF0aW9uICkgKSB7XHJcbiAgICB0aGlzLnJlbW92ZUVsZW0oKTtcclxuICAgIHJldHVybjtcclxuICB9XHJcblxyXG4gIC8vIHN0YXJ0IHRyYW5zaXRpb25cclxuICB0aGlzLm9uY2UoICd0cmFuc2l0aW9uRW5kJywgZnVuY3Rpb24oKSB7XHJcbiAgICB0aGlzLnJlbW92ZUVsZW0oKTtcclxuICB9KTtcclxuICB0aGlzLmhpZGUoKTtcclxufTtcclxuXHJcbnByb3RvLnJldmVhbCA9IGZ1bmN0aW9uKCkge1xyXG4gIGRlbGV0ZSB0aGlzLmlzSGlkZGVuO1xyXG4gIC8vIHJlbW92ZSBkaXNwbGF5OiBub25lXHJcbiAgdGhpcy5jc3MoeyBkaXNwbGF5OiAnJyB9KTtcclxuXHJcbiAgdmFyIG9wdGlvbnMgPSB0aGlzLmxheW91dC5vcHRpb25zO1xyXG5cclxuICB2YXIgb25UcmFuc2l0aW9uRW5kID0ge307XHJcbiAgdmFyIHRyYW5zaXRpb25FbmRQcm9wZXJ0eSA9IHRoaXMuZ2V0SGlkZVJldmVhbFRyYW5zaXRpb25FbmRQcm9wZXJ0eSgndmlzaWJsZVN0eWxlJyk7XHJcbiAgb25UcmFuc2l0aW9uRW5kWyB0cmFuc2l0aW9uRW5kUHJvcGVydHkgXSA9IHRoaXMub25SZXZlYWxUcmFuc2l0aW9uRW5kO1xyXG5cclxuICB0aGlzLnRyYW5zaXRpb24oe1xyXG4gICAgZnJvbTogb3B0aW9ucy5oaWRkZW5TdHlsZSxcclxuICAgIHRvOiBvcHRpb25zLnZpc2libGVTdHlsZSxcclxuICAgIGlzQ2xlYW5pbmc6IHRydWUsXHJcbiAgICBvblRyYW5zaXRpb25FbmQ6IG9uVHJhbnNpdGlvbkVuZFxyXG4gIH0pO1xyXG59O1xyXG5cclxucHJvdG8ub25SZXZlYWxUcmFuc2l0aW9uRW5kID0gZnVuY3Rpb24oKSB7XHJcbiAgLy8gY2hlY2sgaWYgc3RpbGwgdmlzaWJsZVxyXG4gIC8vIGR1cmluZyB0cmFuc2l0aW9uLCBpdGVtIG1heSBoYXZlIGJlZW4gaGlkZGVuXHJcbiAgaWYgKCAhdGhpcy5pc0hpZGRlbiApIHtcclxuICAgIHRoaXMuZW1pdEV2ZW50KCdyZXZlYWwnKTtcclxuICB9XHJcbn07XHJcblxyXG4vKipcclxuICogZ2V0IHN0eWxlIHByb3BlcnR5IHVzZSBmb3IgaGlkZS9yZXZlYWwgdHJhbnNpdGlvbiBlbmRcclxuICogQHBhcmFtIHtTdHJpbmd9IHN0eWxlUHJvcGVydHkgLSBoaWRkZW5TdHlsZS92aXNpYmxlU3R5bGVcclxuICogQHJldHVybnMge1N0cmluZ31cclxuICovXHJcbnByb3RvLmdldEhpZGVSZXZlYWxUcmFuc2l0aW9uRW5kUHJvcGVydHkgPSBmdW5jdGlvbiggc3R5bGVQcm9wZXJ0eSApIHtcclxuICB2YXIgb3B0aW9uU3R5bGUgPSB0aGlzLmxheW91dC5vcHRpb25zWyBzdHlsZVByb3BlcnR5IF07XHJcbiAgLy8gdXNlIG9wYWNpdHlcclxuICBpZiAoIG9wdGlvblN0eWxlLm9wYWNpdHkgKSB7XHJcbiAgICByZXR1cm4gJ29wYWNpdHknO1xyXG4gIH1cclxuICAvLyBnZXQgZmlyc3QgcHJvcGVydHlcclxuICBmb3IgKCB2YXIgcHJvcCBpbiBvcHRpb25TdHlsZSApIHtcclxuICAgIHJldHVybiBwcm9wO1xyXG4gIH1cclxufTtcclxuXHJcbnByb3RvLmhpZGUgPSBmdW5jdGlvbigpIHtcclxuICAvLyBzZXQgZmxhZ1xyXG4gIHRoaXMuaXNIaWRkZW4gPSB0cnVlO1xyXG4gIC8vIHJlbW92ZSBkaXNwbGF5OiBub25lXHJcbiAgdGhpcy5jc3MoeyBkaXNwbGF5OiAnJyB9KTtcclxuXHJcbiAgdmFyIG9wdGlvbnMgPSB0aGlzLmxheW91dC5vcHRpb25zO1xyXG5cclxuICB2YXIgb25UcmFuc2l0aW9uRW5kID0ge307XHJcbiAgdmFyIHRyYW5zaXRpb25FbmRQcm9wZXJ0eSA9IHRoaXMuZ2V0SGlkZVJldmVhbFRyYW5zaXRpb25FbmRQcm9wZXJ0eSgnaGlkZGVuU3R5bGUnKTtcclxuICBvblRyYW5zaXRpb25FbmRbIHRyYW5zaXRpb25FbmRQcm9wZXJ0eSBdID0gdGhpcy5vbkhpZGVUcmFuc2l0aW9uRW5kO1xyXG5cclxuICB0aGlzLnRyYW5zaXRpb24oe1xyXG4gICAgZnJvbTogb3B0aW9ucy52aXNpYmxlU3R5bGUsXHJcbiAgICB0bzogb3B0aW9ucy5oaWRkZW5TdHlsZSxcclxuICAgIC8vIGtlZXAgaGlkZGVuIHN0dWZmIGhpZGRlblxyXG4gICAgaXNDbGVhbmluZzogdHJ1ZSxcclxuICAgIG9uVHJhbnNpdGlvbkVuZDogb25UcmFuc2l0aW9uRW5kXHJcbiAgfSk7XHJcbn07XHJcblxyXG5wcm90by5vbkhpZGVUcmFuc2l0aW9uRW5kID0gZnVuY3Rpb24oKSB7XHJcbiAgLy8gY2hlY2sgaWYgc3RpbGwgaGlkZGVuXHJcbiAgLy8gZHVyaW5nIHRyYW5zaXRpb24sIGl0ZW0gbWF5IGhhdmUgYmVlbiB1bi1oaWRkZW5cclxuICBpZiAoIHRoaXMuaXNIaWRkZW4gKSB7XHJcbiAgICB0aGlzLmNzcyh7IGRpc3BsYXk6ICdub25lJyB9KTtcclxuICAgIHRoaXMuZW1pdEV2ZW50KCdoaWRlJyk7XHJcbiAgfVxyXG59O1xyXG5cclxucHJvdG8uZGVzdHJveSA9IGZ1bmN0aW9uKCkge1xyXG4gIHRoaXMuY3NzKHtcclxuICAgIHBvc2l0aW9uOiAnJyxcclxuICAgIGxlZnQ6ICcnLFxyXG4gICAgcmlnaHQ6ICcnLFxyXG4gICAgdG9wOiAnJyxcclxuICAgIGJvdHRvbTogJycsXHJcbiAgICB0cmFuc2l0aW9uOiAnJyxcclxuICAgIHRyYW5zZm9ybTogJydcclxuICB9KTtcclxufTtcclxuXHJcbnJldHVybiBJdGVtO1xyXG5cclxufSkpO1xyXG5cclxuLyohXHJcbiAqIE91dGxheWVyIHYyLjEuMFxyXG4gKiB0aGUgYnJhaW5zIGFuZCBndXRzIG9mIGEgbGF5b3V0IGxpYnJhcnlcclxuICogTUlUIGxpY2Vuc2VcclxuICovXHJcblxyXG4oIGZ1bmN0aW9uKCB3aW5kb3csIGZhY3RvcnkgKSB7XHJcbiAgJ3VzZSBzdHJpY3QnO1xyXG4gIC8vIHVuaXZlcnNhbCBtb2R1bGUgZGVmaW5pdGlvblxyXG4gIC8qIGpzaGludCBzdHJpY3Q6IGZhbHNlICovIC8qIGdsb2JhbHMgZGVmaW5lLCBtb2R1bGUsIHJlcXVpcmUgKi9cclxuICBpZiAoIHR5cGVvZiBkZWZpbmUgPT0gJ2Z1bmN0aW9uJyAmJiBkZWZpbmUuYW1kICkge1xyXG4gICAgLy8gQU1EIC0gUmVxdWlyZUpTXHJcbiAgICBkZWZpbmUoICdvdXRsYXllci9vdXRsYXllcicsW1xyXG4gICAgICAgICdldi1lbWl0dGVyL2V2LWVtaXR0ZXInLFxyXG4gICAgICAgICdnZXQtc2l6ZS9nZXQtc2l6ZScsXHJcbiAgICAgICAgJ2Zpenp5LXVpLXV0aWxzL3V0aWxzJyxcclxuICAgICAgICAnLi9pdGVtJ1xyXG4gICAgICBdLFxyXG4gICAgICBmdW5jdGlvbiggRXZFbWl0dGVyLCBnZXRTaXplLCB1dGlscywgSXRlbSApIHtcclxuICAgICAgICByZXR1cm4gZmFjdG9yeSggd2luZG93LCBFdkVtaXR0ZXIsIGdldFNpemUsIHV0aWxzLCBJdGVtKTtcclxuICAgICAgfVxyXG4gICAgKTtcclxuICB9IGVsc2UgaWYgKCB0eXBlb2YgbW9kdWxlID09ICdvYmplY3QnICYmIG1vZHVsZS5leHBvcnRzICkge1xyXG4gICAgLy8gQ29tbW9uSlMgLSBCcm93c2VyaWZ5LCBXZWJwYWNrXHJcbiAgICBtb2R1bGUuZXhwb3J0cyA9IGZhY3RvcnkoXHJcbiAgICAgIHdpbmRvdyxcclxuICAgICAgcmVxdWlyZSgnZXYtZW1pdHRlcicpLFxyXG4gICAgICByZXF1aXJlKCdnZXQtc2l6ZScpLFxyXG4gICAgICByZXF1aXJlKCdmaXp6eS11aS11dGlscycpLFxyXG4gICAgICByZXF1aXJlKCcuL2l0ZW0nKVxyXG4gICAgKTtcclxuICB9IGVsc2Uge1xyXG4gICAgLy8gYnJvd3NlciBnbG9iYWxcclxuICAgIHdpbmRvdy5PdXRsYXllciA9IGZhY3RvcnkoXHJcbiAgICAgIHdpbmRvdyxcclxuICAgICAgd2luZG93LkV2RW1pdHRlcixcclxuICAgICAgd2luZG93LmdldFNpemUsXHJcbiAgICAgIHdpbmRvdy5maXp6eVVJVXRpbHMsXHJcbiAgICAgIHdpbmRvdy5PdXRsYXllci5JdGVtXHJcbiAgICApO1xyXG4gIH1cclxuXHJcbn0oIHdpbmRvdywgZnVuY3Rpb24gZmFjdG9yeSggd2luZG93LCBFdkVtaXR0ZXIsIGdldFNpemUsIHV0aWxzLCBJdGVtICkge1xyXG4ndXNlIHN0cmljdCc7XHJcblxyXG4vLyAtLS0tLSB2YXJzIC0tLS0tIC8vXHJcblxyXG52YXIgY29uc29sZSA9IHdpbmRvdy5jb25zb2xlO1xyXG52YXIgalF1ZXJ5ID0gd2luZG93LmpRdWVyeTtcclxudmFyIG5vb3AgPSBmdW5jdGlvbigpIHt9O1xyXG5cclxuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0gT3V0bGF5ZXIgLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0gLy9cclxuXHJcbi8vIGdsb2JhbGx5IHVuaXF1ZSBpZGVudGlmaWVyc1xyXG52YXIgR1VJRCA9IDA7XHJcbi8vIGludGVybmFsIHN0b3JlIG9mIGFsbCBPdXRsYXllciBpbnRhbmNlc1xyXG52YXIgaW5zdGFuY2VzID0ge307XHJcblxyXG5cclxuLyoqXHJcbiAqIEBwYXJhbSB7RWxlbWVudCwgU3RyaW5nfSBlbGVtZW50XHJcbiAqIEBwYXJhbSB7T2JqZWN0fSBvcHRpb25zXHJcbiAqIEBjb25zdHJ1Y3RvclxyXG4gKi9cclxuZnVuY3Rpb24gT3V0bGF5ZXIoIGVsZW1lbnQsIG9wdGlvbnMgKSB7XHJcbiAgdmFyIHF1ZXJ5RWxlbWVudCA9IHV0aWxzLmdldFF1ZXJ5RWxlbWVudCggZWxlbWVudCApO1xyXG4gIGlmICggIXF1ZXJ5RWxlbWVudCApIHtcclxuICAgIGlmICggY29uc29sZSApIHtcclxuICAgICAgY29uc29sZS5lcnJvciggJ0JhZCBlbGVtZW50IGZvciAnICsgdGhpcy5jb25zdHJ1Y3Rvci5uYW1lc3BhY2UgK1xyXG4gICAgICAgICc6ICcgKyAoIHF1ZXJ5RWxlbWVudCB8fCBlbGVtZW50ICkgKTtcclxuICAgIH1cclxuICAgIHJldHVybjtcclxuICB9XHJcbiAgdGhpcy5lbGVtZW50ID0gcXVlcnlFbGVtZW50O1xyXG4gIC8vIGFkZCBqUXVlcnlcclxuICBpZiAoIGpRdWVyeSApIHtcclxuICAgIHRoaXMuJGVsZW1lbnQgPSBqUXVlcnkoIHRoaXMuZWxlbWVudCApO1xyXG4gIH1cclxuXHJcbiAgLy8gb3B0aW9uc1xyXG4gIHRoaXMub3B0aW9ucyA9IHV0aWxzLmV4dGVuZCgge30sIHRoaXMuY29uc3RydWN0b3IuZGVmYXVsdHMgKTtcclxuICB0aGlzLm9wdGlvbiggb3B0aW9ucyApO1xyXG5cclxuICAvLyBhZGQgaWQgZm9yIE91dGxheWVyLmdldEZyb21FbGVtZW50XHJcbiAgdmFyIGlkID0gKytHVUlEO1xyXG4gIHRoaXMuZWxlbWVudC5vdXRsYXllckdVSUQgPSBpZDsgLy8gZXhwYW5kb1xyXG4gIGluc3RhbmNlc1sgaWQgXSA9IHRoaXM7IC8vIGFzc29jaWF0ZSB2aWEgaWRcclxuXHJcbiAgLy8ga2ljayBpdCBvZmZcclxuICB0aGlzLl9jcmVhdGUoKTtcclxuXHJcbiAgdmFyIGlzSW5pdExheW91dCA9IHRoaXMuX2dldE9wdGlvbignaW5pdExheW91dCcpO1xyXG4gIGlmICggaXNJbml0TGF5b3V0ICkge1xyXG4gICAgdGhpcy5sYXlvdXQoKTtcclxuICB9XHJcbn1cclxuXHJcbi8vIHNldHRpbmdzIGFyZSBmb3IgaW50ZXJuYWwgdXNlIG9ubHlcclxuT3V0bGF5ZXIubmFtZXNwYWNlID0gJ291dGxheWVyJztcclxuT3V0bGF5ZXIuSXRlbSA9IEl0ZW07XHJcblxyXG4vLyBkZWZhdWx0IG9wdGlvbnNcclxuT3V0bGF5ZXIuZGVmYXVsdHMgPSB7XHJcbiAgY29udGFpbmVyU3R5bGU6IHtcclxuICAgIHBvc2l0aW9uOiAncmVsYXRpdmUnXHJcbiAgfSxcclxuICBpbml0TGF5b3V0OiB0cnVlLFxyXG4gIG9yaWdpbkxlZnQ6IHRydWUsXHJcbiAgb3JpZ2luVG9wOiB0cnVlLFxyXG4gIHJlc2l6ZTogdHJ1ZSxcclxuICByZXNpemVDb250YWluZXI6IHRydWUsXHJcbiAgLy8gaXRlbSBvcHRpb25zXHJcbiAgdHJhbnNpdGlvbkR1cmF0aW9uOiAnMC40cycsXHJcbiAgaGlkZGVuU3R5bGU6IHtcclxuICAgIG9wYWNpdHk6IDAsXHJcbiAgICB0cmFuc2Zvcm06ICdzY2FsZSgwLjAwMSknXHJcbiAgfSxcclxuICB2aXNpYmxlU3R5bGU6IHtcclxuICAgIG9wYWNpdHk6IDEsXHJcbiAgICB0cmFuc2Zvcm06ICdzY2FsZSgxKSdcclxuICB9XHJcbn07XHJcblxyXG52YXIgcHJvdG8gPSBPdXRsYXllci5wcm90b3R5cGU7XHJcbi8vIGluaGVyaXQgRXZFbWl0dGVyXHJcbnV0aWxzLmV4dGVuZCggcHJvdG8sIEV2RW1pdHRlci5wcm90b3R5cGUgKTtcclxuXHJcbi8qKlxyXG4gKiBzZXQgb3B0aW9uc1xyXG4gKiBAcGFyYW0ge09iamVjdH0gb3B0c1xyXG4gKi9cclxucHJvdG8ub3B0aW9uID0gZnVuY3Rpb24oIG9wdHMgKSB7XHJcbiAgdXRpbHMuZXh0ZW5kKCB0aGlzLm9wdGlvbnMsIG9wdHMgKTtcclxufTtcclxuXHJcbi8qKlxyXG4gKiBnZXQgYmFja3dhcmRzIGNvbXBhdGlibGUgb3B0aW9uIHZhbHVlLCBjaGVjayBvbGQgbmFtZVxyXG4gKi9cclxucHJvdG8uX2dldE9wdGlvbiA9IGZ1bmN0aW9uKCBvcHRpb24gKSB7XHJcbiAgdmFyIG9sZE9wdGlvbiA9IHRoaXMuY29uc3RydWN0b3IuY29tcGF0T3B0aW9uc1sgb3B0aW9uIF07XHJcbiAgcmV0dXJuIG9sZE9wdGlvbiAmJiB0aGlzLm9wdGlvbnNbIG9sZE9wdGlvbiBdICE9PSB1bmRlZmluZWQgP1xyXG4gICAgdGhpcy5vcHRpb25zWyBvbGRPcHRpb24gXSA6IHRoaXMub3B0aW9uc1sgb3B0aW9uIF07XHJcbn07XHJcblxyXG5PdXRsYXllci5jb21wYXRPcHRpb25zID0ge1xyXG4gIC8vIGN1cnJlbnROYW1lOiBvbGROYW1lXHJcbiAgaW5pdExheW91dDogJ2lzSW5pdExheW91dCcsXHJcbiAgaG9yaXpvbnRhbDogJ2lzSG9yaXpvbnRhbCcsXHJcbiAgbGF5b3V0SW5zdGFudDogJ2lzTGF5b3V0SW5zdGFudCcsXHJcbiAgb3JpZ2luTGVmdDogJ2lzT3JpZ2luTGVmdCcsXHJcbiAgb3JpZ2luVG9wOiAnaXNPcmlnaW5Ub3AnLFxyXG4gIHJlc2l6ZTogJ2lzUmVzaXplQm91bmQnLFxyXG4gIHJlc2l6ZUNvbnRhaW5lcjogJ2lzUmVzaXppbmdDb250YWluZXInXHJcbn07XHJcblxyXG5wcm90by5fY3JlYXRlID0gZnVuY3Rpb24oKSB7XHJcbiAgLy8gZ2V0IGl0ZW1zIGZyb20gY2hpbGRyZW5cclxuICB0aGlzLnJlbG9hZEl0ZW1zKCk7XHJcbiAgLy8gZWxlbWVudHMgdGhhdCBhZmZlY3QgbGF5b3V0LCBidXQgYXJlIG5vdCBsYWlkIG91dFxyXG4gIHRoaXMuc3RhbXBzID0gW107XHJcbiAgdGhpcy5zdGFtcCggdGhpcy5vcHRpb25zLnN0YW1wICk7XHJcbiAgLy8gc2V0IGNvbnRhaW5lciBzdHlsZVxyXG4gIHV0aWxzLmV4dGVuZCggdGhpcy5lbGVtZW50LnN0eWxlLCB0aGlzLm9wdGlvbnMuY29udGFpbmVyU3R5bGUgKTtcclxuXHJcbiAgLy8gYmluZCByZXNpemUgbWV0aG9kXHJcbiAgdmFyIGNhbkJpbmRSZXNpemUgPSB0aGlzLl9nZXRPcHRpb24oJ3Jlc2l6ZScpO1xyXG4gIGlmICggY2FuQmluZFJlc2l6ZSApIHtcclxuICAgIHRoaXMuYmluZFJlc2l6ZSgpO1xyXG4gIH1cclxufTtcclxuXHJcbi8vIGdvZXMgdGhyb3VnaCBhbGwgY2hpbGRyZW4gYWdhaW4gYW5kIGdldHMgYnJpY2tzIGluIHByb3BlciBvcmRlclxyXG5wcm90by5yZWxvYWRJdGVtcyA9IGZ1bmN0aW9uKCkge1xyXG4gIC8vIGNvbGxlY3Rpb24gb2YgaXRlbSBlbGVtZW50c1xyXG4gIHRoaXMuaXRlbXMgPSB0aGlzLl9pdGVtaXplKCB0aGlzLmVsZW1lbnQuY2hpbGRyZW4gKTtcclxufTtcclxuXHJcblxyXG4vKipcclxuICogdHVybiBlbGVtZW50cyBpbnRvIE91dGxheWVyLkl0ZW1zIHRvIGJlIHVzZWQgaW4gbGF5b3V0XHJcbiAqIEBwYXJhbSB7QXJyYXkgb3IgTm9kZUxpc3Qgb3IgSFRNTEVsZW1lbnR9IGVsZW1zXHJcbiAqIEByZXR1cm5zIHtBcnJheX0gaXRlbXMgLSBjb2xsZWN0aW9uIG9mIG5ldyBPdXRsYXllciBJdGVtc1xyXG4gKi9cclxucHJvdG8uX2l0ZW1pemUgPSBmdW5jdGlvbiggZWxlbXMgKSB7XHJcblxyXG4gIHZhciBpdGVtRWxlbXMgPSB0aGlzLl9maWx0ZXJGaW5kSXRlbUVsZW1lbnRzKCBlbGVtcyApO1xyXG4gIHZhciBJdGVtID0gdGhpcy5jb25zdHJ1Y3Rvci5JdGVtO1xyXG5cclxuICAvLyBjcmVhdGUgbmV3IE91dGxheWVyIEl0ZW1zIGZvciBjb2xsZWN0aW9uXHJcbiAgdmFyIGl0ZW1zID0gW107XHJcbiAgZm9yICggdmFyIGk9MDsgaSA8IGl0ZW1FbGVtcy5sZW5ndGg7IGkrKyApIHtcclxuICAgIHZhciBlbGVtID0gaXRlbUVsZW1zW2ldO1xyXG4gICAgdmFyIGl0ZW0gPSBuZXcgSXRlbSggZWxlbSwgdGhpcyApO1xyXG4gICAgaXRlbXMucHVzaCggaXRlbSApO1xyXG4gIH1cclxuXHJcbiAgcmV0dXJuIGl0ZW1zO1xyXG59O1xyXG5cclxuLyoqXHJcbiAqIGdldCBpdGVtIGVsZW1lbnRzIHRvIGJlIHVzZWQgaW4gbGF5b3V0XHJcbiAqIEBwYXJhbSB7QXJyYXkgb3IgTm9kZUxpc3Qgb3IgSFRNTEVsZW1lbnR9IGVsZW1zXHJcbiAqIEByZXR1cm5zIHtBcnJheX0gaXRlbXMgLSBpdGVtIGVsZW1lbnRzXHJcbiAqL1xyXG5wcm90by5fZmlsdGVyRmluZEl0ZW1FbGVtZW50cyA9IGZ1bmN0aW9uKCBlbGVtcyApIHtcclxuICByZXR1cm4gdXRpbHMuZmlsdGVyRmluZEVsZW1lbnRzKCBlbGVtcywgdGhpcy5vcHRpb25zLml0ZW1TZWxlY3RvciApO1xyXG59O1xyXG5cclxuLyoqXHJcbiAqIGdldHRlciBtZXRob2QgZm9yIGdldHRpbmcgaXRlbSBlbGVtZW50c1xyXG4gKiBAcmV0dXJucyB7QXJyYXl9IGVsZW1zIC0gY29sbGVjdGlvbiBvZiBpdGVtIGVsZW1lbnRzXHJcbiAqL1xyXG5wcm90by5nZXRJdGVtRWxlbWVudHMgPSBmdW5jdGlvbigpIHtcclxuICByZXR1cm4gdGhpcy5pdGVtcy5tYXAoIGZ1bmN0aW9uKCBpdGVtICkge1xyXG4gICAgcmV0dXJuIGl0ZW0uZWxlbWVudDtcclxuICB9KTtcclxufTtcclxuXHJcbi8vIC0tLS0tIGluaXQgJiBsYXlvdXQgLS0tLS0gLy9cclxuXHJcbi8qKlxyXG4gKiBsYXlzIG91dCBhbGwgaXRlbXNcclxuICovXHJcbnByb3RvLmxheW91dCA9IGZ1bmN0aW9uKCkge1xyXG4gIHRoaXMuX3Jlc2V0TGF5b3V0KCk7XHJcbiAgdGhpcy5fbWFuYWdlU3RhbXBzKCk7XHJcblxyXG4gIC8vIGRvbid0IGFuaW1hdGUgZmlyc3QgbGF5b3V0XHJcbiAgdmFyIGxheW91dEluc3RhbnQgPSB0aGlzLl9nZXRPcHRpb24oJ2xheW91dEluc3RhbnQnKTtcclxuICB2YXIgaXNJbnN0YW50ID0gbGF5b3V0SW5zdGFudCAhPT0gdW5kZWZpbmVkID9cclxuICAgIGxheW91dEluc3RhbnQgOiAhdGhpcy5faXNMYXlvdXRJbml0ZWQ7XHJcbiAgdGhpcy5sYXlvdXRJdGVtcyggdGhpcy5pdGVtcywgaXNJbnN0YW50ICk7XHJcblxyXG4gIC8vIGZsYWcgZm9yIGluaXRhbGl6ZWRcclxuICB0aGlzLl9pc0xheW91dEluaXRlZCA9IHRydWU7XHJcbn07XHJcblxyXG4vLyBfaW5pdCBpcyBhbGlhcyBmb3IgbGF5b3V0XHJcbnByb3RvLl9pbml0ID0gcHJvdG8ubGF5b3V0O1xyXG5cclxuLyoqXHJcbiAqIGxvZ2ljIGJlZm9yZSBhbnkgbmV3IGxheW91dFxyXG4gKi9cclxucHJvdG8uX3Jlc2V0TGF5b3V0ID0gZnVuY3Rpb24oKSB7XHJcbiAgdGhpcy5nZXRTaXplKCk7XHJcbn07XHJcblxyXG5cclxucHJvdG8uZ2V0U2l6ZSA9IGZ1bmN0aW9uKCkge1xyXG4gIHRoaXMuc2l6ZSA9IGdldFNpemUoIHRoaXMuZWxlbWVudCApO1xyXG59O1xyXG5cclxuLyoqXHJcbiAqIGdldCBtZWFzdXJlbWVudCBmcm9tIG9wdGlvbiwgZm9yIGNvbHVtbldpZHRoLCByb3dIZWlnaHQsIGd1dHRlclxyXG4gKiBpZiBvcHRpb24gaXMgU3RyaW5nIC0+IGdldCBlbGVtZW50IGZyb20gc2VsZWN0b3Igc3RyaW5nLCAmIGdldCBzaXplIG9mIGVsZW1lbnRcclxuICogaWYgb3B0aW9uIGlzIEVsZW1lbnQgLT4gZ2V0IHNpemUgb2YgZWxlbWVudFxyXG4gKiBlbHNlIHVzZSBvcHRpb24gYXMgYSBudW1iZXJcclxuICpcclxuICogQHBhcmFtIHtTdHJpbmd9IG1lYXN1cmVtZW50XHJcbiAqIEBwYXJhbSB7U3RyaW5nfSBzaXplIC0gd2lkdGggb3IgaGVpZ2h0XHJcbiAqIEBwcml2YXRlXHJcbiAqL1xyXG5wcm90by5fZ2V0TWVhc3VyZW1lbnQgPSBmdW5jdGlvbiggbWVhc3VyZW1lbnQsIHNpemUgKSB7XHJcbiAgdmFyIG9wdGlvbiA9IHRoaXMub3B0aW9uc1sgbWVhc3VyZW1lbnQgXTtcclxuICB2YXIgZWxlbTtcclxuICBpZiAoICFvcHRpb24gKSB7XHJcbiAgICAvLyBkZWZhdWx0IHRvIDBcclxuICAgIHRoaXNbIG1lYXN1cmVtZW50IF0gPSAwO1xyXG4gIH0gZWxzZSB7XHJcbiAgICAvLyB1c2Ugb3B0aW9uIGFzIGFuIGVsZW1lbnRcclxuICAgIGlmICggdHlwZW9mIG9wdGlvbiA9PSAnc3RyaW5nJyApIHtcclxuICAgICAgZWxlbSA9IHRoaXMuZWxlbWVudC5xdWVyeVNlbGVjdG9yKCBvcHRpb24gKTtcclxuICAgIH0gZWxzZSBpZiAoIG9wdGlvbiBpbnN0YW5jZW9mIEhUTUxFbGVtZW50ICkge1xyXG4gICAgICBlbGVtID0gb3B0aW9uO1xyXG4gICAgfVxyXG4gICAgLy8gdXNlIHNpemUgb2YgZWxlbWVudCwgaWYgZWxlbWVudFxyXG4gICAgdGhpc1sgbWVhc3VyZW1lbnQgXSA9IGVsZW0gPyBnZXRTaXplKCBlbGVtIClbIHNpemUgXSA6IG9wdGlvbjtcclxuICB9XHJcbn07XHJcblxyXG4vKipcclxuICogbGF5b3V0IGEgY29sbGVjdGlvbiBvZiBpdGVtIGVsZW1lbnRzXHJcbiAqIEBhcGkgcHVibGljXHJcbiAqL1xyXG5wcm90by5sYXlvdXRJdGVtcyA9IGZ1bmN0aW9uKCBpdGVtcywgaXNJbnN0YW50ICkge1xyXG4gIGl0ZW1zID0gdGhpcy5fZ2V0SXRlbXNGb3JMYXlvdXQoIGl0ZW1zICk7XHJcblxyXG4gIHRoaXMuX2xheW91dEl0ZW1zKCBpdGVtcywgaXNJbnN0YW50ICk7XHJcblxyXG4gIHRoaXMuX3Bvc3RMYXlvdXQoKTtcclxufTtcclxuXHJcbi8qKlxyXG4gKiBnZXQgdGhlIGl0ZW1zIHRvIGJlIGxhaWQgb3V0XHJcbiAqIHlvdSBtYXkgd2FudCB0byBza2lwIG92ZXIgc29tZSBpdGVtc1xyXG4gKiBAcGFyYW0ge0FycmF5fSBpdGVtc1xyXG4gKiBAcmV0dXJucyB7QXJyYXl9IGl0ZW1zXHJcbiAqL1xyXG5wcm90by5fZ2V0SXRlbXNGb3JMYXlvdXQgPSBmdW5jdGlvbiggaXRlbXMgKSB7XHJcbiAgcmV0dXJuIGl0ZW1zLmZpbHRlciggZnVuY3Rpb24oIGl0ZW0gKSB7XHJcbiAgICByZXR1cm4gIWl0ZW0uaXNJZ25vcmVkO1xyXG4gIH0pO1xyXG59O1xyXG5cclxuLyoqXHJcbiAqIGxheW91dCBpdGVtc1xyXG4gKiBAcGFyYW0ge0FycmF5fSBpdGVtc1xyXG4gKiBAcGFyYW0ge0Jvb2xlYW59IGlzSW5zdGFudFxyXG4gKi9cclxucHJvdG8uX2xheW91dEl0ZW1zID0gZnVuY3Rpb24oIGl0ZW1zLCBpc0luc3RhbnQgKSB7XHJcbiAgdGhpcy5fZW1pdENvbXBsZXRlT25JdGVtcyggJ2xheW91dCcsIGl0ZW1zICk7XHJcblxyXG4gIGlmICggIWl0ZW1zIHx8ICFpdGVtcy5sZW5ndGggKSB7XHJcbiAgICAvLyBubyBpdGVtcywgZW1pdCBldmVudCB3aXRoIGVtcHR5IGFycmF5XHJcbiAgICByZXR1cm47XHJcbiAgfVxyXG5cclxuICB2YXIgcXVldWUgPSBbXTtcclxuXHJcbiAgaXRlbXMuZm9yRWFjaCggZnVuY3Rpb24oIGl0ZW0gKSB7XHJcbiAgICAvLyBnZXQgeC95IG9iamVjdCBmcm9tIG1ldGhvZFxyXG4gICAgdmFyIHBvc2l0aW9uID0gdGhpcy5fZ2V0SXRlbUxheW91dFBvc2l0aW9uKCBpdGVtICk7XHJcbiAgICAvLyBlbnF1ZXVlXHJcbiAgICBwb3NpdGlvbi5pdGVtID0gaXRlbTtcclxuICAgIHBvc2l0aW9uLmlzSW5zdGFudCA9IGlzSW5zdGFudCB8fCBpdGVtLmlzTGF5b3V0SW5zdGFudDtcclxuICAgIHF1ZXVlLnB1c2goIHBvc2l0aW9uICk7XHJcbiAgfSwgdGhpcyApO1xyXG5cclxuICB0aGlzLl9wcm9jZXNzTGF5b3V0UXVldWUoIHF1ZXVlICk7XHJcbn07XHJcblxyXG4vKipcclxuICogZ2V0IGl0ZW0gbGF5b3V0IHBvc2l0aW9uXHJcbiAqIEBwYXJhbSB7T3V0bGF5ZXIuSXRlbX0gaXRlbVxyXG4gKiBAcmV0dXJucyB7T2JqZWN0fSB4IGFuZCB5IHBvc2l0aW9uXHJcbiAqL1xyXG5wcm90by5fZ2V0SXRlbUxheW91dFBvc2l0aW9uID0gZnVuY3Rpb24oIC8qIGl0ZW0gKi8gKSB7XHJcbiAgcmV0dXJuIHtcclxuICAgIHg6IDAsXHJcbiAgICB5OiAwXHJcbiAgfTtcclxufTtcclxuXHJcbi8qKlxyXG4gKiBpdGVyYXRlIG92ZXIgYXJyYXkgYW5kIHBvc2l0aW9uIGVhY2ggaXRlbVxyXG4gKiBSZWFzb24gYmVpbmcgLSBzZXBhcmF0aW5nIHRoaXMgbG9naWMgcHJldmVudHMgJ2xheW91dCBpbnZhbGlkYXRpb24nXHJcbiAqIHRoeCBAcGF1bF9pcmlzaFxyXG4gKiBAcGFyYW0ge0FycmF5fSBxdWV1ZVxyXG4gKi9cclxucHJvdG8uX3Byb2Nlc3NMYXlvdXRRdWV1ZSA9IGZ1bmN0aW9uKCBxdWV1ZSApIHtcclxuICB0aGlzLnVwZGF0ZVN0YWdnZXIoKTtcclxuICBxdWV1ZS5mb3JFYWNoKCBmdW5jdGlvbiggb2JqLCBpICkge1xyXG4gICAgdGhpcy5fcG9zaXRpb25JdGVtKCBvYmouaXRlbSwgb2JqLngsIG9iai55LCBvYmouaXNJbnN0YW50LCBpICk7XHJcbiAgfSwgdGhpcyApO1xyXG59O1xyXG5cclxuLy8gc2V0IHN0YWdnZXIgZnJvbSBvcHRpb24gaW4gbWlsbGlzZWNvbmRzIG51bWJlclxyXG5wcm90by51cGRhdGVTdGFnZ2VyID0gZnVuY3Rpb24oKSB7XHJcbiAgdmFyIHN0YWdnZXIgPSB0aGlzLm9wdGlvbnMuc3RhZ2dlcjtcclxuICBpZiAoIHN0YWdnZXIgPT09IG51bGwgfHwgc3RhZ2dlciA9PT0gdW5kZWZpbmVkICkge1xyXG4gICAgdGhpcy5zdGFnZ2VyID0gMDtcclxuICAgIHJldHVybjtcclxuICB9XHJcbiAgdGhpcy5zdGFnZ2VyID0gZ2V0TWlsbGlzZWNvbmRzKCBzdGFnZ2VyICk7XHJcbiAgcmV0dXJuIHRoaXMuc3RhZ2dlcjtcclxufTtcclxuXHJcbi8qKlxyXG4gKiBTZXRzIHBvc2l0aW9uIG9mIGl0ZW0gaW4gRE9NXHJcbiAqIEBwYXJhbSB7T3V0bGF5ZXIuSXRlbX0gaXRlbVxyXG4gKiBAcGFyYW0ge051bWJlcn0geCAtIGhvcml6b250YWwgcG9zaXRpb25cclxuICogQHBhcmFtIHtOdW1iZXJ9IHkgLSB2ZXJ0aWNhbCBwb3NpdGlvblxyXG4gKiBAcGFyYW0ge0Jvb2xlYW59IGlzSW5zdGFudCAtIGRpc2FibGVzIHRyYW5zaXRpb25zXHJcbiAqL1xyXG5wcm90by5fcG9zaXRpb25JdGVtID0gZnVuY3Rpb24oIGl0ZW0sIHgsIHksIGlzSW5zdGFudCwgaSApIHtcclxuICBpZiAoIGlzSW5zdGFudCApIHtcclxuICAgIC8vIGlmIG5vdCB0cmFuc2l0aW9uLCBqdXN0IHNldCBDU1NcclxuICAgIGl0ZW0uZ29UbyggeCwgeSApO1xyXG4gIH0gZWxzZSB7XHJcbiAgICBpdGVtLnN0YWdnZXIoIGkgKiB0aGlzLnN0YWdnZXIgKTtcclxuICAgIGl0ZW0ubW92ZVRvKCB4LCB5ICk7XHJcbiAgfVxyXG59O1xyXG5cclxuLyoqXHJcbiAqIEFueSBsb2dpYyB5b3Ugd2FudCB0byBkbyBhZnRlciBlYWNoIGxheW91dCxcclxuICogaS5lLiBzaXplIHRoZSBjb250YWluZXJcclxuICovXHJcbnByb3RvLl9wb3N0TGF5b3V0ID0gZnVuY3Rpb24oKSB7XHJcbiAgdGhpcy5yZXNpemVDb250YWluZXIoKTtcclxufTtcclxuXHJcbnByb3RvLnJlc2l6ZUNvbnRhaW5lciA9IGZ1bmN0aW9uKCkge1xyXG4gIHZhciBpc1Jlc2l6aW5nQ29udGFpbmVyID0gdGhpcy5fZ2V0T3B0aW9uKCdyZXNpemVDb250YWluZXInKTtcclxuICBpZiAoICFpc1Jlc2l6aW5nQ29udGFpbmVyICkge1xyXG4gICAgcmV0dXJuO1xyXG4gIH1cclxuICB2YXIgc2l6ZSA9IHRoaXMuX2dldENvbnRhaW5lclNpemUoKTtcclxuICBpZiAoIHNpemUgKSB7XHJcbiAgICB0aGlzLl9zZXRDb250YWluZXJNZWFzdXJlKCBzaXplLndpZHRoLCB0cnVlICk7XHJcbiAgICB0aGlzLl9zZXRDb250YWluZXJNZWFzdXJlKCBzaXplLmhlaWdodCwgZmFsc2UgKTtcclxuICB9XHJcbn07XHJcblxyXG4vKipcclxuICogU2V0cyB3aWR0aCBvciBoZWlnaHQgb2YgY29udGFpbmVyIGlmIHJldHVybmVkXHJcbiAqIEByZXR1cm5zIHtPYmplY3R9IHNpemVcclxuICogICBAcGFyYW0ge051bWJlcn0gd2lkdGhcclxuICogICBAcGFyYW0ge051bWJlcn0gaGVpZ2h0XHJcbiAqL1xyXG5wcm90by5fZ2V0Q29udGFpbmVyU2l6ZSA9IG5vb3A7XHJcblxyXG4vKipcclxuICogQHBhcmFtIHtOdW1iZXJ9IG1lYXN1cmUgLSBzaXplIG9mIHdpZHRoIG9yIGhlaWdodFxyXG4gKiBAcGFyYW0ge0Jvb2xlYW59IGlzV2lkdGhcclxuICovXHJcbnByb3RvLl9zZXRDb250YWluZXJNZWFzdXJlID0gZnVuY3Rpb24oIG1lYXN1cmUsIGlzV2lkdGggKSB7XHJcbiAgaWYgKCBtZWFzdXJlID09PSB1bmRlZmluZWQgKSB7XHJcbiAgICByZXR1cm47XHJcbiAgfVxyXG5cclxuICB2YXIgZWxlbVNpemUgPSB0aGlzLnNpemU7XHJcbiAgLy8gYWRkIHBhZGRpbmcgYW5kIGJvcmRlciB3aWR0aCBpZiBib3JkZXIgYm94XHJcbiAgaWYgKCBlbGVtU2l6ZS5pc0JvcmRlckJveCApIHtcclxuICAgIG1lYXN1cmUgKz0gaXNXaWR0aCA/IGVsZW1TaXplLnBhZGRpbmdMZWZ0ICsgZWxlbVNpemUucGFkZGluZ1JpZ2h0ICtcclxuICAgICAgZWxlbVNpemUuYm9yZGVyTGVmdFdpZHRoICsgZWxlbVNpemUuYm9yZGVyUmlnaHRXaWR0aCA6XHJcbiAgICAgIGVsZW1TaXplLnBhZGRpbmdCb3R0b20gKyBlbGVtU2l6ZS5wYWRkaW5nVG9wICtcclxuICAgICAgZWxlbVNpemUuYm9yZGVyVG9wV2lkdGggKyBlbGVtU2l6ZS5ib3JkZXJCb3R0b21XaWR0aDtcclxuICB9XHJcblxyXG4gIG1lYXN1cmUgPSBNYXRoLm1heCggbWVhc3VyZSwgMCApO1xyXG4gIHRoaXMuZWxlbWVudC5zdHlsZVsgaXNXaWR0aCA/ICd3aWR0aCcgOiAnaGVpZ2h0JyBdID0gbWVhc3VyZSArICdweCc7XHJcbn07XHJcblxyXG4vKipcclxuICogZW1pdCBldmVudENvbXBsZXRlIG9uIGEgY29sbGVjdGlvbiBvZiBpdGVtcyBldmVudHNcclxuICogQHBhcmFtIHtTdHJpbmd9IGV2ZW50TmFtZVxyXG4gKiBAcGFyYW0ge0FycmF5fSBpdGVtcyAtIE91dGxheWVyLkl0ZW1zXHJcbiAqL1xyXG5wcm90by5fZW1pdENvbXBsZXRlT25JdGVtcyA9IGZ1bmN0aW9uKCBldmVudE5hbWUsIGl0ZW1zICkge1xyXG4gIHZhciBfdGhpcyA9IHRoaXM7XHJcbiAgZnVuY3Rpb24gb25Db21wbGV0ZSgpIHtcclxuICAgIF90aGlzLmRpc3BhdGNoRXZlbnQoIGV2ZW50TmFtZSArICdDb21wbGV0ZScsIG51bGwsIFsgaXRlbXMgXSApO1xyXG4gIH1cclxuXHJcbiAgdmFyIGNvdW50ID0gaXRlbXMubGVuZ3RoO1xyXG4gIGlmICggIWl0ZW1zIHx8ICFjb3VudCApIHtcclxuICAgIG9uQ29tcGxldGUoKTtcclxuICAgIHJldHVybjtcclxuICB9XHJcblxyXG4gIHZhciBkb25lQ291bnQgPSAwO1xyXG4gIGZ1bmN0aW9uIHRpY2soKSB7XHJcbiAgICBkb25lQ291bnQrKztcclxuICAgIGlmICggZG9uZUNvdW50ID09IGNvdW50ICkge1xyXG4gICAgICBvbkNvbXBsZXRlKCk7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICAvLyBiaW5kIGNhbGxiYWNrXHJcbiAgaXRlbXMuZm9yRWFjaCggZnVuY3Rpb24oIGl0ZW0gKSB7XHJcbiAgICBpdGVtLm9uY2UoIGV2ZW50TmFtZSwgdGljayApO1xyXG4gIH0pO1xyXG59O1xyXG5cclxuLyoqXHJcbiAqIGVtaXRzIGV2ZW50cyB2aWEgRXZFbWl0dGVyIGFuZCBqUXVlcnkgZXZlbnRzXHJcbiAqIEBwYXJhbSB7U3RyaW5nfSB0eXBlIC0gbmFtZSBvZiBldmVudFxyXG4gKiBAcGFyYW0ge0V2ZW50fSBldmVudCAtIG9yaWdpbmFsIGV2ZW50XHJcbiAqIEBwYXJhbSB7QXJyYXl9IGFyZ3MgLSBleHRyYSBhcmd1bWVudHNcclxuICovXHJcbnByb3RvLmRpc3BhdGNoRXZlbnQgPSBmdW5jdGlvbiggdHlwZSwgZXZlbnQsIGFyZ3MgKSB7XHJcbiAgLy8gYWRkIG9yaWdpbmFsIGV2ZW50IHRvIGFyZ3VtZW50c1xyXG4gIHZhciBlbWl0QXJncyA9IGV2ZW50ID8gWyBldmVudCBdLmNvbmNhdCggYXJncyApIDogYXJncztcclxuICB0aGlzLmVtaXRFdmVudCggdHlwZSwgZW1pdEFyZ3MgKTtcclxuXHJcbiAgaWYgKCBqUXVlcnkgKSB7XHJcbiAgICAvLyBzZXQgdGhpcy4kZWxlbWVudFxyXG4gICAgdGhpcy4kZWxlbWVudCA9IHRoaXMuJGVsZW1lbnQgfHwgalF1ZXJ5KCB0aGlzLmVsZW1lbnQgKTtcclxuICAgIGlmICggZXZlbnQgKSB7XHJcbiAgICAgIC8vIGNyZWF0ZSBqUXVlcnkgZXZlbnRcclxuICAgICAgdmFyICRldmVudCA9IGpRdWVyeS5FdmVudCggZXZlbnQgKTtcclxuICAgICAgJGV2ZW50LnR5cGUgPSB0eXBlO1xyXG4gICAgICB0aGlzLiRlbGVtZW50LnRyaWdnZXIoICRldmVudCwgYXJncyApO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgLy8ganVzdCB0cmlnZ2VyIHdpdGggdHlwZSBpZiBubyBldmVudCBhdmFpbGFibGVcclxuICAgICAgdGhpcy4kZWxlbWVudC50cmlnZ2VyKCB0eXBlLCBhcmdzICk7XHJcbiAgICB9XHJcbiAgfVxyXG59O1xyXG5cclxuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0gaWdub3JlICYgc3RhbXBzIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tIC8vXHJcblxyXG5cclxuLyoqXHJcbiAqIGtlZXAgaXRlbSBpbiBjb2xsZWN0aW9uLCBidXQgZG8gbm90IGxheSBpdCBvdXRcclxuICogaWdub3JlZCBpdGVtcyBkbyBub3QgZ2V0IHNraXBwZWQgaW4gbGF5b3V0XHJcbiAqIEBwYXJhbSB7RWxlbWVudH0gZWxlbVxyXG4gKi9cclxucHJvdG8uaWdub3JlID0gZnVuY3Rpb24oIGVsZW0gKSB7XHJcbiAgdmFyIGl0ZW0gPSB0aGlzLmdldEl0ZW0oIGVsZW0gKTtcclxuICBpZiAoIGl0ZW0gKSB7XHJcbiAgICBpdGVtLmlzSWdub3JlZCA9IHRydWU7XHJcbiAgfVxyXG59O1xyXG5cclxuLyoqXHJcbiAqIHJldHVybiBpdGVtIHRvIGxheW91dCBjb2xsZWN0aW9uXHJcbiAqIEBwYXJhbSB7RWxlbWVudH0gZWxlbVxyXG4gKi9cclxucHJvdG8udW5pZ25vcmUgPSBmdW5jdGlvbiggZWxlbSApIHtcclxuICB2YXIgaXRlbSA9IHRoaXMuZ2V0SXRlbSggZWxlbSApO1xyXG4gIGlmICggaXRlbSApIHtcclxuICAgIGRlbGV0ZSBpdGVtLmlzSWdub3JlZDtcclxuICB9XHJcbn07XHJcblxyXG4vKipcclxuICogYWRkcyBlbGVtZW50cyB0byBzdGFtcHNcclxuICogQHBhcmFtIHtOb2RlTGlzdCwgQXJyYXksIEVsZW1lbnQsIG9yIFN0cmluZ30gZWxlbXNcclxuICovXHJcbnByb3RvLnN0YW1wID0gZnVuY3Rpb24oIGVsZW1zICkge1xyXG4gIGVsZW1zID0gdGhpcy5fZmluZCggZWxlbXMgKTtcclxuICBpZiAoICFlbGVtcyApIHtcclxuICAgIHJldHVybjtcclxuICB9XHJcblxyXG4gIHRoaXMuc3RhbXBzID0gdGhpcy5zdGFtcHMuY29uY2F0KCBlbGVtcyApO1xyXG4gIC8vIGlnbm9yZVxyXG4gIGVsZW1zLmZvckVhY2goIHRoaXMuaWdub3JlLCB0aGlzICk7XHJcbn07XHJcblxyXG4vKipcclxuICogcmVtb3ZlcyBlbGVtZW50cyB0byBzdGFtcHNcclxuICogQHBhcmFtIHtOb2RlTGlzdCwgQXJyYXksIG9yIEVsZW1lbnR9IGVsZW1zXHJcbiAqL1xyXG5wcm90by51bnN0YW1wID0gZnVuY3Rpb24oIGVsZW1zICkge1xyXG4gIGVsZW1zID0gdGhpcy5fZmluZCggZWxlbXMgKTtcclxuICBpZiAoICFlbGVtcyApe1xyXG4gICAgcmV0dXJuO1xyXG4gIH1cclxuXHJcbiAgZWxlbXMuZm9yRWFjaCggZnVuY3Rpb24oIGVsZW0gKSB7XHJcbiAgICAvLyBmaWx0ZXIgb3V0IHJlbW92ZWQgc3RhbXAgZWxlbWVudHNcclxuICAgIHV0aWxzLnJlbW92ZUZyb20oIHRoaXMuc3RhbXBzLCBlbGVtICk7XHJcbiAgICB0aGlzLnVuaWdub3JlKCBlbGVtICk7XHJcbiAgfSwgdGhpcyApO1xyXG59O1xyXG5cclxuLyoqXHJcbiAqIGZpbmRzIGNoaWxkIGVsZW1lbnRzXHJcbiAqIEBwYXJhbSB7Tm9kZUxpc3QsIEFycmF5LCBFbGVtZW50LCBvciBTdHJpbmd9IGVsZW1zXHJcbiAqIEByZXR1cm5zIHtBcnJheX0gZWxlbXNcclxuICovXHJcbnByb3RvLl9maW5kID0gZnVuY3Rpb24oIGVsZW1zICkge1xyXG4gIGlmICggIWVsZW1zICkge1xyXG4gICAgcmV0dXJuO1xyXG4gIH1cclxuICAvLyBpZiBzdHJpbmcsIHVzZSBhcmd1bWVudCBhcyBzZWxlY3RvciBzdHJpbmdcclxuICBpZiAoIHR5cGVvZiBlbGVtcyA9PSAnc3RyaW5nJyApIHtcclxuICAgIGVsZW1zID0gdGhpcy5lbGVtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoIGVsZW1zICk7XHJcbiAgfVxyXG4gIGVsZW1zID0gdXRpbHMubWFrZUFycmF5KCBlbGVtcyApO1xyXG4gIHJldHVybiBlbGVtcztcclxufTtcclxuXHJcbnByb3RvLl9tYW5hZ2VTdGFtcHMgPSBmdW5jdGlvbigpIHtcclxuICBpZiAoICF0aGlzLnN0YW1wcyB8fCAhdGhpcy5zdGFtcHMubGVuZ3RoICkge1xyXG4gICAgcmV0dXJuO1xyXG4gIH1cclxuXHJcbiAgdGhpcy5fZ2V0Qm91bmRpbmdSZWN0KCk7XHJcblxyXG4gIHRoaXMuc3RhbXBzLmZvckVhY2goIHRoaXMuX21hbmFnZVN0YW1wLCB0aGlzICk7XHJcbn07XHJcblxyXG4vLyB1cGRhdGUgYm91bmRpbmdMZWZ0IC8gVG9wXHJcbnByb3RvLl9nZXRCb3VuZGluZ1JlY3QgPSBmdW5jdGlvbigpIHtcclxuICAvLyBnZXQgYm91bmRpbmcgcmVjdCBmb3IgY29udGFpbmVyIGVsZW1lbnRcclxuICB2YXIgYm91bmRpbmdSZWN0ID0gdGhpcy5lbGVtZW50LmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpO1xyXG4gIHZhciBzaXplID0gdGhpcy5zaXplO1xyXG4gIHRoaXMuX2JvdW5kaW5nUmVjdCA9IHtcclxuICAgIGxlZnQ6IGJvdW5kaW5nUmVjdC5sZWZ0ICsgc2l6ZS5wYWRkaW5nTGVmdCArIHNpemUuYm9yZGVyTGVmdFdpZHRoLFxyXG4gICAgdG9wOiBib3VuZGluZ1JlY3QudG9wICsgc2l6ZS5wYWRkaW5nVG9wICsgc2l6ZS5ib3JkZXJUb3BXaWR0aCxcclxuICAgIHJpZ2h0OiBib3VuZGluZ1JlY3QucmlnaHQgLSAoIHNpemUucGFkZGluZ1JpZ2h0ICsgc2l6ZS5ib3JkZXJSaWdodFdpZHRoICksXHJcbiAgICBib3R0b206IGJvdW5kaW5nUmVjdC5ib3R0b20gLSAoIHNpemUucGFkZGluZ0JvdHRvbSArIHNpemUuYm9yZGVyQm90dG9tV2lkdGggKVxyXG4gIH07XHJcbn07XHJcblxyXG4vKipcclxuICogQHBhcmFtIHtFbGVtZW50fSBzdGFtcFxyXG4qKi9cclxucHJvdG8uX21hbmFnZVN0YW1wID0gbm9vcDtcclxuXHJcbi8qKlxyXG4gKiBnZXQgeC95IHBvc2l0aW9uIG9mIGVsZW1lbnQgcmVsYXRpdmUgdG8gY29udGFpbmVyIGVsZW1lbnRcclxuICogQHBhcmFtIHtFbGVtZW50fSBlbGVtXHJcbiAqIEByZXR1cm5zIHtPYmplY3R9IG9mZnNldCAtIGhhcyBsZWZ0LCB0b3AsIHJpZ2h0LCBib3R0b21cclxuICovXHJcbnByb3RvLl9nZXRFbGVtZW50T2Zmc2V0ID0gZnVuY3Rpb24oIGVsZW0gKSB7XHJcbiAgdmFyIGJvdW5kaW5nUmVjdCA9IGVsZW0uZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCk7XHJcbiAgdmFyIHRoaXNSZWN0ID0gdGhpcy5fYm91bmRpbmdSZWN0O1xyXG4gIHZhciBzaXplID0gZ2V0U2l6ZSggZWxlbSApO1xyXG4gIHZhciBvZmZzZXQgPSB7XHJcbiAgICBsZWZ0OiBib3VuZGluZ1JlY3QubGVmdCAtIHRoaXNSZWN0LmxlZnQgLSBzaXplLm1hcmdpbkxlZnQsXHJcbiAgICB0b3A6IGJvdW5kaW5nUmVjdC50b3AgLSB0aGlzUmVjdC50b3AgLSBzaXplLm1hcmdpblRvcCxcclxuICAgIHJpZ2h0OiB0aGlzUmVjdC5yaWdodCAtIGJvdW5kaW5nUmVjdC5yaWdodCAtIHNpemUubWFyZ2luUmlnaHQsXHJcbiAgICBib3R0b206IHRoaXNSZWN0LmJvdHRvbSAtIGJvdW5kaW5nUmVjdC5ib3R0b20gLSBzaXplLm1hcmdpbkJvdHRvbVxyXG4gIH07XHJcbiAgcmV0dXJuIG9mZnNldDtcclxufTtcclxuXHJcbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tIHJlc2l6ZSAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLSAvL1xyXG5cclxuLy8gZW5hYmxlIGV2ZW50IGhhbmRsZXJzIGZvciBsaXN0ZW5lcnNcclxuLy8gaS5lLiByZXNpemUgLT4gb25yZXNpemVcclxucHJvdG8uaGFuZGxlRXZlbnQgPSB1dGlscy5oYW5kbGVFdmVudDtcclxuXHJcbi8qKlxyXG4gKiBCaW5kIGxheW91dCB0byB3aW5kb3cgcmVzaXppbmdcclxuICovXHJcbnByb3RvLmJpbmRSZXNpemUgPSBmdW5jdGlvbigpIHtcclxuICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lciggJ3Jlc2l6ZScsIHRoaXMgKTtcclxuICB0aGlzLmlzUmVzaXplQm91bmQgPSB0cnVlO1xyXG59O1xyXG5cclxuLyoqXHJcbiAqIFVuYmluZCBsYXlvdXQgdG8gd2luZG93IHJlc2l6aW5nXHJcbiAqL1xyXG5wcm90by51bmJpbmRSZXNpemUgPSBmdW5jdGlvbigpIHtcclxuICB3aW5kb3cucmVtb3ZlRXZlbnRMaXN0ZW5lciggJ3Jlc2l6ZScsIHRoaXMgKTtcclxuICB0aGlzLmlzUmVzaXplQm91bmQgPSBmYWxzZTtcclxufTtcclxuXHJcbnByb3RvLm9ucmVzaXplID0gZnVuY3Rpb24oKSB7XHJcbiAgdGhpcy5yZXNpemUoKTtcclxufTtcclxuXHJcbnV0aWxzLmRlYm91bmNlTWV0aG9kKCBPdXRsYXllciwgJ29ucmVzaXplJywgMTAwICk7XHJcblxyXG5wcm90by5yZXNpemUgPSBmdW5jdGlvbigpIHtcclxuICAvLyBkb24ndCB0cmlnZ2VyIGlmIHNpemUgZGlkIG5vdCBjaGFuZ2VcclxuICAvLyBvciBpZiByZXNpemUgd2FzIHVuYm91bmQuIFNlZSAjOVxyXG4gIGlmICggIXRoaXMuaXNSZXNpemVCb3VuZCB8fCAhdGhpcy5uZWVkc1Jlc2l6ZUxheW91dCgpICkge1xyXG4gICAgcmV0dXJuO1xyXG4gIH1cclxuXHJcbiAgdGhpcy5sYXlvdXQoKTtcclxufTtcclxuXHJcbi8qKlxyXG4gKiBjaGVjayBpZiBsYXlvdXQgaXMgbmVlZGVkIHBvc3QgbGF5b3V0XHJcbiAqIEByZXR1cm5zIEJvb2xlYW5cclxuICovXHJcbnByb3RvLm5lZWRzUmVzaXplTGF5b3V0ID0gZnVuY3Rpb24oKSB7XHJcbiAgdmFyIHNpemUgPSBnZXRTaXplKCB0aGlzLmVsZW1lbnQgKTtcclxuICAvLyBjaGVjayB0aGF0IHRoaXMuc2l6ZSBhbmQgc2l6ZSBhcmUgdGhlcmVcclxuICAvLyBJRTggdHJpZ2dlcnMgcmVzaXplIG9uIGJvZHkgc2l6ZSBjaGFuZ2UsIHNvIHRoZXkgbWlnaHQgbm90IGJlXHJcbiAgdmFyIGhhc1NpemVzID0gdGhpcy5zaXplICYmIHNpemU7XHJcbiAgcmV0dXJuIGhhc1NpemVzICYmIHNpemUuaW5uZXJXaWR0aCAhPT0gdGhpcy5zaXplLmlubmVyV2lkdGg7XHJcbn07XHJcblxyXG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLSBtZXRob2RzIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tIC8vXHJcblxyXG4vKipcclxuICogYWRkIGl0ZW1zIHRvIE91dGxheWVyIGluc3RhbmNlXHJcbiAqIEBwYXJhbSB7QXJyYXkgb3IgTm9kZUxpc3Qgb3IgRWxlbWVudH0gZWxlbXNcclxuICogQHJldHVybnMge0FycmF5fSBpdGVtcyAtIE91dGxheWVyLkl0ZW1zXHJcbioqL1xyXG5wcm90by5hZGRJdGVtcyA9IGZ1bmN0aW9uKCBlbGVtcyApIHtcclxuICB2YXIgaXRlbXMgPSB0aGlzLl9pdGVtaXplKCBlbGVtcyApO1xyXG4gIC8vIGFkZCBpdGVtcyB0byBjb2xsZWN0aW9uXHJcbiAgaWYgKCBpdGVtcy5sZW5ndGggKSB7XHJcbiAgICB0aGlzLml0ZW1zID0gdGhpcy5pdGVtcy5jb25jYXQoIGl0ZW1zICk7XHJcbiAgfVxyXG4gIHJldHVybiBpdGVtcztcclxufTtcclxuXHJcbi8qKlxyXG4gKiBMYXlvdXQgbmV3bHktYXBwZW5kZWQgaXRlbSBlbGVtZW50c1xyXG4gKiBAcGFyYW0ge0FycmF5IG9yIE5vZGVMaXN0IG9yIEVsZW1lbnR9IGVsZW1zXHJcbiAqL1xyXG5wcm90by5hcHBlbmRlZCA9IGZ1bmN0aW9uKCBlbGVtcyApIHtcclxuICB2YXIgaXRlbXMgPSB0aGlzLmFkZEl0ZW1zKCBlbGVtcyApO1xyXG4gIGlmICggIWl0ZW1zLmxlbmd0aCApIHtcclxuICAgIHJldHVybjtcclxuICB9XHJcbiAgLy8gbGF5b3V0IGFuZCByZXZlYWwganVzdCB0aGUgbmV3IGl0ZW1zXHJcbiAgdGhpcy5sYXlvdXRJdGVtcyggaXRlbXMsIHRydWUgKTtcclxuICB0aGlzLnJldmVhbCggaXRlbXMgKTtcclxufTtcclxuXHJcbi8qKlxyXG4gKiBMYXlvdXQgcHJlcGVuZGVkIGVsZW1lbnRzXHJcbiAqIEBwYXJhbSB7QXJyYXkgb3IgTm9kZUxpc3Qgb3IgRWxlbWVudH0gZWxlbXNcclxuICovXHJcbnByb3RvLnByZXBlbmRlZCA9IGZ1bmN0aW9uKCBlbGVtcyApIHtcclxuICB2YXIgaXRlbXMgPSB0aGlzLl9pdGVtaXplKCBlbGVtcyApO1xyXG4gIGlmICggIWl0ZW1zLmxlbmd0aCApIHtcclxuICAgIHJldHVybjtcclxuICB9XHJcbiAgLy8gYWRkIGl0ZW1zIHRvIGJlZ2lubmluZyBvZiBjb2xsZWN0aW9uXHJcbiAgdmFyIHByZXZpb3VzSXRlbXMgPSB0aGlzLml0ZW1zLnNsaWNlKDApO1xyXG4gIHRoaXMuaXRlbXMgPSBpdGVtcy5jb25jYXQoIHByZXZpb3VzSXRlbXMgKTtcclxuICAvLyBzdGFydCBuZXcgbGF5b3V0XHJcbiAgdGhpcy5fcmVzZXRMYXlvdXQoKTtcclxuICB0aGlzLl9tYW5hZ2VTdGFtcHMoKTtcclxuICAvLyBsYXlvdXQgbmV3IHN0dWZmIHdpdGhvdXQgdHJhbnNpdGlvblxyXG4gIHRoaXMubGF5b3V0SXRlbXMoIGl0ZW1zLCB0cnVlICk7XHJcbiAgdGhpcy5yZXZlYWwoIGl0ZW1zICk7XHJcbiAgLy8gbGF5b3V0IHByZXZpb3VzIGl0ZW1zXHJcbiAgdGhpcy5sYXlvdXRJdGVtcyggcHJldmlvdXNJdGVtcyApO1xyXG59O1xyXG5cclxuLyoqXHJcbiAqIHJldmVhbCBhIGNvbGxlY3Rpb24gb2YgaXRlbXNcclxuICogQHBhcmFtIHtBcnJheSBvZiBPdXRsYXllci5JdGVtc30gaXRlbXNcclxuICovXHJcbnByb3RvLnJldmVhbCA9IGZ1bmN0aW9uKCBpdGVtcyApIHtcclxuICB0aGlzLl9lbWl0Q29tcGxldGVPbkl0ZW1zKCAncmV2ZWFsJywgaXRlbXMgKTtcclxuICBpZiAoICFpdGVtcyB8fCAhaXRlbXMubGVuZ3RoICkge1xyXG4gICAgcmV0dXJuO1xyXG4gIH1cclxuICB2YXIgc3RhZ2dlciA9IHRoaXMudXBkYXRlU3RhZ2dlcigpO1xyXG4gIGl0ZW1zLmZvckVhY2goIGZ1bmN0aW9uKCBpdGVtLCBpICkge1xyXG4gICAgaXRlbS5zdGFnZ2VyKCBpICogc3RhZ2dlciApO1xyXG4gICAgaXRlbS5yZXZlYWwoKTtcclxuICB9KTtcclxufTtcclxuXHJcbi8qKlxyXG4gKiBoaWRlIGEgY29sbGVjdGlvbiBvZiBpdGVtc1xyXG4gKiBAcGFyYW0ge0FycmF5IG9mIE91dGxheWVyLkl0ZW1zfSBpdGVtc1xyXG4gKi9cclxucHJvdG8uaGlkZSA9IGZ1bmN0aW9uKCBpdGVtcyApIHtcclxuICB0aGlzLl9lbWl0Q29tcGxldGVPbkl0ZW1zKCAnaGlkZScsIGl0ZW1zICk7XHJcbiAgaWYgKCAhaXRlbXMgfHwgIWl0ZW1zLmxlbmd0aCApIHtcclxuICAgIHJldHVybjtcclxuICB9XHJcbiAgdmFyIHN0YWdnZXIgPSB0aGlzLnVwZGF0ZVN0YWdnZXIoKTtcclxuICBpdGVtcy5mb3JFYWNoKCBmdW5jdGlvbiggaXRlbSwgaSApIHtcclxuICAgIGl0ZW0uc3RhZ2dlciggaSAqIHN0YWdnZXIgKTtcclxuICAgIGl0ZW0uaGlkZSgpO1xyXG4gIH0pO1xyXG59O1xyXG5cclxuLyoqXHJcbiAqIHJldmVhbCBpdGVtIGVsZW1lbnRzXHJcbiAqIEBwYXJhbSB7QXJyYXl9LCB7RWxlbWVudH0sIHtOb2RlTGlzdH0gaXRlbXNcclxuICovXHJcbnByb3RvLnJldmVhbEl0ZW1FbGVtZW50cyA9IGZ1bmN0aW9uKCBlbGVtcyApIHtcclxuICB2YXIgaXRlbXMgPSB0aGlzLmdldEl0ZW1zKCBlbGVtcyApO1xyXG4gIHRoaXMucmV2ZWFsKCBpdGVtcyApO1xyXG59O1xyXG5cclxuLyoqXHJcbiAqIGhpZGUgaXRlbSBlbGVtZW50c1xyXG4gKiBAcGFyYW0ge0FycmF5fSwge0VsZW1lbnR9LCB7Tm9kZUxpc3R9IGl0ZW1zXHJcbiAqL1xyXG5wcm90by5oaWRlSXRlbUVsZW1lbnRzID0gZnVuY3Rpb24oIGVsZW1zICkge1xyXG4gIHZhciBpdGVtcyA9IHRoaXMuZ2V0SXRlbXMoIGVsZW1zICk7XHJcbiAgdGhpcy5oaWRlKCBpdGVtcyApO1xyXG59O1xyXG5cclxuLyoqXHJcbiAqIGdldCBPdXRsYXllci5JdGVtLCBnaXZlbiBhbiBFbGVtZW50XHJcbiAqIEBwYXJhbSB7RWxlbWVudH0gZWxlbVxyXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBjYWxsYmFja1xyXG4gKiBAcmV0dXJucyB7T3V0bGF5ZXIuSXRlbX0gaXRlbVxyXG4gKi9cclxucHJvdG8uZ2V0SXRlbSA9IGZ1bmN0aW9uKCBlbGVtICkge1xyXG4gIC8vIGxvb3AgdGhyb3VnaCBpdGVtcyB0byBnZXQgdGhlIG9uZSB0aGF0IG1hdGNoZXNcclxuICBmb3IgKCB2YXIgaT0wOyBpIDwgdGhpcy5pdGVtcy5sZW5ndGg7IGkrKyApIHtcclxuICAgIHZhciBpdGVtID0gdGhpcy5pdGVtc1tpXTtcclxuICAgIGlmICggaXRlbS5lbGVtZW50ID09IGVsZW0gKSB7XHJcbiAgICAgIC8vIHJldHVybiBpdGVtXHJcbiAgICAgIHJldHVybiBpdGVtO1xyXG4gICAgfVxyXG4gIH1cclxufTtcclxuXHJcbi8qKlxyXG4gKiBnZXQgY29sbGVjdGlvbiBvZiBPdXRsYXllci5JdGVtcywgZ2l2ZW4gRWxlbWVudHNcclxuICogQHBhcmFtIHtBcnJheX0gZWxlbXNcclxuICogQHJldHVybnMge0FycmF5fSBpdGVtcyAtIE91dGxheWVyLkl0ZW1zXHJcbiAqL1xyXG5wcm90by5nZXRJdGVtcyA9IGZ1bmN0aW9uKCBlbGVtcyApIHtcclxuICBlbGVtcyA9IHV0aWxzLm1ha2VBcnJheSggZWxlbXMgKTtcclxuICB2YXIgaXRlbXMgPSBbXTtcclxuICBlbGVtcy5mb3JFYWNoKCBmdW5jdGlvbiggZWxlbSApIHtcclxuICAgIHZhciBpdGVtID0gdGhpcy5nZXRJdGVtKCBlbGVtICk7XHJcbiAgICBpZiAoIGl0ZW0gKSB7XHJcbiAgICAgIGl0ZW1zLnB1c2goIGl0ZW0gKTtcclxuICAgIH1cclxuICB9LCB0aGlzICk7XHJcblxyXG4gIHJldHVybiBpdGVtcztcclxufTtcclxuXHJcbi8qKlxyXG4gKiByZW1vdmUgZWxlbWVudChzKSBmcm9tIGluc3RhbmNlIGFuZCBET01cclxuICogQHBhcmFtIHtBcnJheSBvciBOb2RlTGlzdCBvciBFbGVtZW50fSBlbGVtc1xyXG4gKi9cclxucHJvdG8ucmVtb3ZlID0gZnVuY3Rpb24oIGVsZW1zICkge1xyXG4gIHZhciByZW1vdmVJdGVtcyA9IHRoaXMuZ2V0SXRlbXMoIGVsZW1zICk7XHJcblxyXG4gIHRoaXMuX2VtaXRDb21wbGV0ZU9uSXRlbXMoICdyZW1vdmUnLCByZW1vdmVJdGVtcyApO1xyXG5cclxuICAvLyBiYWlsIGlmIG5vIGl0ZW1zIHRvIHJlbW92ZVxyXG4gIGlmICggIXJlbW92ZUl0ZW1zIHx8ICFyZW1vdmVJdGVtcy5sZW5ndGggKSB7XHJcbiAgICByZXR1cm47XHJcbiAgfVxyXG5cclxuICByZW1vdmVJdGVtcy5mb3JFYWNoKCBmdW5jdGlvbiggaXRlbSApIHtcclxuICAgIGl0ZW0ucmVtb3ZlKCk7XHJcbiAgICAvLyByZW1vdmUgaXRlbSBmcm9tIGNvbGxlY3Rpb25cclxuICAgIHV0aWxzLnJlbW92ZUZyb20oIHRoaXMuaXRlbXMsIGl0ZW0gKTtcclxuICB9LCB0aGlzICk7XHJcbn07XHJcblxyXG4vLyAtLS0tLSBkZXN0cm95IC0tLS0tIC8vXHJcblxyXG4vLyByZW1vdmUgYW5kIGRpc2FibGUgT3V0bGF5ZXIgaW5zdGFuY2VcclxucHJvdG8uZGVzdHJveSA9IGZ1bmN0aW9uKCkge1xyXG4gIC8vIGNsZWFuIHVwIGR5bmFtaWMgc3R5bGVzXHJcbiAgdmFyIHN0eWxlID0gdGhpcy5lbGVtZW50LnN0eWxlO1xyXG4gIHN0eWxlLmhlaWdodCA9ICcnO1xyXG4gIHN0eWxlLnBvc2l0aW9uID0gJyc7XHJcbiAgc3R5bGUud2lkdGggPSAnJztcclxuICAvLyBkZXN0cm95IGl0ZW1zXHJcbiAgdGhpcy5pdGVtcy5mb3JFYWNoKCBmdW5jdGlvbiggaXRlbSApIHtcclxuICAgIGl0ZW0uZGVzdHJveSgpO1xyXG4gIH0pO1xyXG5cclxuICB0aGlzLnVuYmluZFJlc2l6ZSgpO1xyXG5cclxuICB2YXIgaWQgPSB0aGlzLmVsZW1lbnQub3V0bGF5ZXJHVUlEO1xyXG4gIGRlbGV0ZSBpbnN0YW5jZXNbIGlkIF07IC8vIHJlbW92ZSByZWZlcmVuY2UgdG8gaW5zdGFuY2UgYnkgaWRcclxuICBkZWxldGUgdGhpcy5lbGVtZW50Lm91dGxheWVyR1VJRDtcclxuICAvLyByZW1vdmUgZGF0YSBmb3IgalF1ZXJ5XHJcbiAgaWYgKCBqUXVlcnkgKSB7XHJcbiAgICBqUXVlcnkucmVtb3ZlRGF0YSggdGhpcy5lbGVtZW50LCB0aGlzLmNvbnN0cnVjdG9yLm5hbWVzcGFjZSApO1xyXG4gIH1cclxuXHJcbn07XHJcblxyXG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLSBkYXRhIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tIC8vXHJcblxyXG4vKipcclxuICogZ2V0IE91dGxheWVyIGluc3RhbmNlIGZyb20gZWxlbWVudFxyXG4gKiBAcGFyYW0ge0VsZW1lbnR9IGVsZW1cclxuICogQHJldHVybnMge091dGxheWVyfVxyXG4gKi9cclxuT3V0bGF5ZXIuZGF0YSA9IGZ1bmN0aW9uKCBlbGVtICkge1xyXG4gIGVsZW0gPSB1dGlscy5nZXRRdWVyeUVsZW1lbnQoIGVsZW0gKTtcclxuICB2YXIgaWQgPSBlbGVtICYmIGVsZW0ub3V0bGF5ZXJHVUlEO1xyXG4gIHJldHVybiBpZCAmJiBpbnN0YW5jZXNbIGlkIF07XHJcbn07XHJcblxyXG5cclxuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0gY3JlYXRlIE91dGxheWVyIGNsYXNzIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tIC8vXHJcblxyXG4vKipcclxuICogY3JlYXRlIGEgbGF5b3V0IGNsYXNzXHJcbiAqIEBwYXJhbSB7U3RyaW5nfSBuYW1lc3BhY2VcclxuICovXHJcbk91dGxheWVyLmNyZWF0ZSA9IGZ1bmN0aW9uKCBuYW1lc3BhY2UsIG9wdGlvbnMgKSB7XHJcbiAgLy8gc3ViLWNsYXNzIE91dGxheWVyXHJcbiAgdmFyIExheW91dCA9IHN1YmNsYXNzKCBPdXRsYXllciApO1xyXG4gIC8vIGFwcGx5IG5ldyBvcHRpb25zIGFuZCBjb21wYXRPcHRpb25zXHJcbiAgTGF5b3V0LmRlZmF1bHRzID0gdXRpbHMuZXh0ZW5kKCB7fSwgT3V0bGF5ZXIuZGVmYXVsdHMgKTtcclxuICB1dGlscy5leHRlbmQoIExheW91dC5kZWZhdWx0cywgb3B0aW9ucyApO1xyXG4gIExheW91dC5jb21wYXRPcHRpb25zID0gdXRpbHMuZXh0ZW5kKCB7fSwgT3V0bGF5ZXIuY29tcGF0T3B0aW9ucyAgKTtcclxuXHJcbiAgTGF5b3V0Lm5hbWVzcGFjZSA9IG5hbWVzcGFjZTtcclxuXHJcbiAgTGF5b3V0LmRhdGEgPSBPdXRsYXllci5kYXRhO1xyXG5cclxuICAvLyBzdWItY2xhc3MgSXRlbVxyXG4gIExheW91dC5JdGVtID0gc3ViY2xhc3MoIEl0ZW0gKTtcclxuXHJcbiAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0gZGVjbGFyYXRpdmUgLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0gLy9cclxuXHJcbiAgdXRpbHMuaHRtbEluaXQoIExheW91dCwgbmFtZXNwYWNlICk7XHJcblxyXG4gIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tIGpRdWVyeSBicmlkZ2UgLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0gLy9cclxuXHJcbiAgLy8gbWFrZSBpbnRvIGpRdWVyeSBwbHVnaW5cclxuICBpZiAoIGpRdWVyeSAmJiBqUXVlcnkuYnJpZGdldCApIHtcclxuICAgIGpRdWVyeS5icmlkZ2V0KCBuYW1lc3BhY2UsIExheW91dCApO1xyXG4gIH1cclxuXHJcbiAgcmV0dXJuIExheW91dDtcclxufTtcclxuXHJcbmZ1bmN0aW9uIHN1YmNsYXNzKCBQYXJlbnQgKSB7XHJcbiAgZnVuY3Rpb24gU3ViQ2xhc3MoKSB7XHJcbiAgICBQYXJlbnQuYXBwbHkoIHRoaXMsIGFyZ3VtZW50cyApO1xyXG4gIH1cclxuXHJcbiAgU3ViQ2xhc3MucHJvdG90eXBlID0gT2JqZWN0LmNyZWF0ZSggUGFyZW50LnByb3RvdHlwZSApO1xyXG4gIFN1YkNsYXNzLnByb3RvdHlwZS5jb25zdHJ1Y3RvciA9IFN1YkNsYXNzO1xyXG5cclxuICByZXR1cm4gU3ViQ2xhc3M7XHJcbn1cclxuXHJcbi8vIC0tLS0tIGhlbHBlcnMgLS0tLS0gLy9cclxuXHJcbi8vIGhvdyBtYW55IG1pbGxpc2Vjb25kcyBhcmUgaW4gZWFjaCB1bml0XHJcbnZhciBtc1VuaXRzID0ge1xyXG4gIG1zOiAxLFxyXG4gIHM6IDEwMDBcclxufTtcclxuXHJcbi8vIG11bmdlIHRpbWUtbGlrZSBwYXJhbWV0ZXIgaW50byBtaWxsaXNlY29uZCBudW1iZXJcclxuLy8gJzAuNHMnIC0+IDQwXHJcbmZ1bmN0aW9uIGdldE1pbGxpc2Vjb25kcyggdGltZSApIHtcclxuICBpZiAoIHR5cGVvZiB0aW1lID09ICdudW1iZXInICkge1xyXG4gICAgcmV0dXJuIHRpbWU7XHJcbiAgfVxyXG4gIHZhciBtYXRjaGVzID0gdGltZS5tYXRjaCggLyheXFxkKlxcLj9cXGQqKShcXHcqKS8gKTtcclxuICB2YXIgbnVtID0gbWF0Y2hlcyAmJiBtYXRjaGVzWzFdO1xyXG4gIHZhciB1bml0ID0gbWF0Y2hlcyAmJiBtYXRjaGVzWzJdO1xyXG4gIGlmICggIW51bS5sZW5ndGggKSB7XHJcbiAgICByZXR1cm4gMDtcclxuICB9XHJcbiAgbnVtID0gcGFyc2VGbG9hdCggbnVtICk7XHJcbiAgdmFyIG11bHQgPSBtc1VuaXRzWyB1bml0IF0gfHwgMTtcclxuICByZXR1cm4gbnVtICogbXVsdDtcclxufVxyXG5cclxuLy8gLS0tLS0gZmluIC0tLS0tIC8vXHJcblxyXG4vLyBiYWNrIGluIGdsb2JhbFxyXG5PdXRsYXllci5JdGVtID0gSXRlbTtcclxuXHJcbnJldHVybiBPdXRsYXllcjtcclxuXHJcbn0pKTtcclxuXHJcbi8qKlxyXG4gKiBJc290b3BlIEl0ZW1cclxuKiovXHJcblxyXG4oIGZ1bmN0aW9uKCB3aW5kb3csIGZhY3RvcnkgKSB7XHJcbiAgLy8gdW5pdmVyc2FsIG1vZHVsZSBkZWZpbml0aW9uXHJcbiAgLyoganNoaW50IHN0cmljdDogZmFsc2UgKi8gLypnbG9iYWxzIGRlZmluZSwgbW9kdWxlLCByZXF1aXJlICovXHJcbiAgaWYgKCB0eXBlb2YgZGVmaW5lID09ICdmdW5jdGlvbicgJiYgZGVmaW5lLmFtZCApIHtcclxuICAgIC8vIEFNRFxyXG4gICAgZGVmaW5lKCAnaXNvdG9wZS9pdGVtJyxbXHJcbiAgICAgICAgJ291dGxheWVyL291dGxheWVyJ1xyXG4gICAgICBdLFxyXG4gICAgICBmYWN0b3J5ICk7XHJcbiAgfSBlbHNlIGlmICggdHlwZW9mIG1vZHVsZSA9PSAnb2JqZWN0JyAmJiBtb2R1bGUuZXhwb3J0cyApIHtcclxuICAgIC8vIENvbW1vbkpTXHJcbiAgICBtb2R1bGUuZXhwb3J0cyA9IGZhY3RvcnkoXHJcbiAgICAgIHJlcXVpcmUoJ291dGxheWVyJylcclxuICAgICk7XHJcbiAgfSBlbHNlIHtcclxuICAgIC8vIGJyb3dzZXIgZ2xvYmFsXHJcbiAgICB3aW5kb3cuSXNvdG9wZSA9IHdpbmRvdy5Jc290b3BlIHx8IHt9O1xyXG4gICAgd2luZG93Lklzb3RvcGUuSXRlbSA9IGZhY3RvcnkoXHJcbiAgICAgIHdpbmRvdy5PdXRsYXllclxyXG4gICAgKTtcclxuICB9XHJcblxyXG59KCB3aW5kb3csIGZ1bmN0aW9uIGZhY3RvcnkoIE91dGxheWVyICkge1xyXG4ndXNlIHN0cmljdCc7XHJcblxyXG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLSBJdGVtIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tIC8vXHJcblxyXG4vLyBzdWItY2xhc3MgT3V0bGF5ZXIgSXRlbVxyXG5mdW5jdGlvbiBJdGVtKCkge1xyXG4gIE91dGxheWVyLkl0ZW0uYXBwbHkoIHRoaXMsIGFyZ3VtZW50cyApO1xyXG59XHJcblxyXG52YXIgcHJvdG8gPSBJdGVtLnByb3RvdHlwZSA9IE9iamVjdC5jcmVhdGUoIE91dGxheWVyLkl0ZW0ucHJvdG90eXBlICk7XHJcblxyXG52YXIgX2NyZWF0ZSA9IHByb3RvLl9jcmVhdGU7XHJcbnByb3RvLl9jcmVhdGUgPSBmdW5jdGlvbigpIHtcclxuICAvLyBhc3NpZ24gaWQsIHVzZWQgZm9yIG9yaWdpbmFsLW9yZGVyIHNvcnRpbmdcclxuICB0aGlzLmlkID0gdGhpcy5sYXlvdXQuaXRlbUdVSUQrKztcclxuICBfY3JlYXRlLmNhbGwoIHRoaXMgKTtcclxuICB0aGlzLnNvcnREYXRhID0ge307XHJcbn07XHJcblxyXG5wcm90by51cGRhdGVTb3J0RGF0YSA9IGZ1bmN0aW9uKCkge1xyXG4gIGlmICggdGhpcy5pc0lnbm9yZWQgKSB7XHJcbiAgICByZXR1cm47XHJcbiAgfVxyXG4gIC8vIGRlZmF1bHQgc29ydGVyc1xyXG4gIHRoaXMuc29ydERhdGEuaWQgPSB0aGlzLmlkO1xyXG4gIC8vIGZvciBiYWNrd2FyZCBjb21wYXRpYmlsaXR5XHJcbiAgdGhpcy5zb3J0RGF0YVsnb3JpZ2luYWwtb3JkZXInXSA9IHRoaXMuaWQ7XHJcbiAgdGhpcy5zb3J0RGF0YS5yYW5kb20gPSBNYXRoLnJhbmRvbSgpO1xyXG4gIC8vIGdvIHRocnUgZ2V0U29ydERhdGEgb2JqIGFuZCBhcHBseSB0aGUgc29ydGVyc1xyXG4gIHZhciBnZXRTb3J0RGF0YSA9IHRoaXMubGF5b3V0Lm9wdGlvbnMuZ2V0U29ydERhdGE7XHJcbiAgdmFyIHNvcnRlcnMgPSB0aGlzLmxheW91dC5fc29ydGVycztcclxuICBmb3IgKCB2YXIga2V5IGluIGdldFNvcnREYXRhICkge1xyXG4gICAgdmFyIHNvcnRlciA9IHNvcnRlcnNbIGtleSBdO1xyXG4gICAgdGhpcy5zb3J0RGF0YVsga2V5IF0gPSBzb3J0ZXIoIHRoaXMuZWxlbWVudCwgdGhpcyApO1xyXG4gIH1cclxufTtcclxuXHJcbnZhciBfZGVzdHJveSA9IHByb3RvLmRlc3Ryb3k7XHJcbnByb3RvLmRlc3Ryb3kgPSBmdW5jdGlvbigpIHtcclxuICAvLyBjYWxsIHN1cGVyXHJcbiAgX2Rlc3Ryb3kuYXBwbHkoIHRoaXMsIGFyZ3VtZW50cyApO1xyXG4gIC8vIHJlc2V0IGRpc3BsYXksICM3NDFcclxuICB0aGlzLmNzcyh7XHJcbiAgICBkaXNwbGF5OiAnJ1xyXG4gIH0pO1xyXG59O1xyXG5cclxucmV0dXJuIEl0ZW07XHJcblxyXG59KSk7XHJcblxyXG4vKipcclxuICogSXNvdG9wZSBMYXlvdXRNb2RlXHJcbiAqL1xyXG5cclxuKCBmdW5jdGlvbiggd2luZG93LCBmYWN0b3J5ICkge1xyXG4gIC8vIHVuaXZlcnNhbCBtb2R1bGUgZGVmaW5pdGlvblxyXG4gIC8qIGpzaGludCBzdHJpY3Q6IGZhbHNlICovIC8qZ2xvYmFscyBkZWZpbmUsIG1vZHVsZSwgcmVxdWlyZSAqL1xyXG4gIGlmICggdHlwZW9mIGRlZmluZSA9PSAnZnVuY3Rpb24nICYmIGRlZmluZS5hbWQgKSB7XHJcbiAgICAvLyBBTURcclxuICAgIGRlZmluZSggJ2lzb3RvcGUvbGF5b3V0LW1vZGUnLFtcclxuICAgICAgICAnZ2V0LXNpemUvZ2V0LXNpemUnLFxyXG4gICAgICAgICdvdXRsYXllci9vdXRsYXllcidcclxuICAgICAgXSxcclxuICAgICAgZmFjdG9yeSApO1xyXG4gIH0gZWxzZSBpZiAoIHR5cGVvZiBtb2R1bGUgPT0gJ29iamVjdCcgJiYgbW9kdWxlLmV4cG9ydHMgKSB7XHJcbiAgICAvLyBDb21tb25KU1xyXG4gICAgbW9kdWxlLmV4cG9ydHMgPSBmYWN0b3J5KFxyXG4gICAgICByZXF1aXJlKCdnZXQtc2l6ZScpLFxyXG4gICAgICByZXF1aXJlKCdvdXRsYXllcicpXHJcbiAgICApO1xyXG4gIH0gZWxzZSB7XHJcbiAgICAvLyBicm93c2VyIGdsb2JhbFxyXG4gICAgd2luZG93Lklzb3RvcGUgPSB3aW5kb3cuSXNvdG9wZSB8fCB7fTtcclxuICAgIHdpbmRvdy5Jc290b3BlLkxheW91dE1vZGUgPSBmYWN0b3J5KFxyXG4gICAgICB3aW5kb3cuZ2V0U2l6ZSxcclxuICAgICAgd2luZG93Lk91dGxheWVyXHJcbiAgICApO1xyXG4gIH1cclxuXHJcbn0oIHdpbmRvdywgZnVuY3Rpb24gZmFjdG9yeSggZ2V0U2l6ZSwgT3V0bGF5ZXIgKSB7XHJcbiAgJ3VzZSBzdHJpY3QnO1xyXG5cclxuICAvLyBsYXlvdXQgbW9kZSBjbGFzc1xyXG4gIGZ1bmN0aW9uIExheW91dE1vZGUoIGlzb3RvcGUgKSB7XHJcbiAgICB0aGlzLmlzb3RvcGUgPSBpc290b3BlO1xyXG4gICAgLy8gbGluayBwcm9wZXJ0aWVzXHJcbiAgICBpZiAoIGlzb3RvcGUgKSB7XHJcbiAgICAgIHRoaXMub3B0aW9ucyA9IGlzb3RvcGUub3B0aW9uc1sgdGhpcy5uYW1lc3BhY2UgXTtcclxuICAgICAgdGhpcy5lbGVtZW50ID0gaXNvdG9wZS5lbGVtZW50O1xyXG4gICAgICB0aGlzLml0ZW1zID0gaXNvdG9wZS5maWx0ZXJlZEl0ZW1zO1xyXG4gICAgICB0aGlzLnNpemUgPSBpc290b3BlLnNpemU7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICB2YXIgcHJvdG8gPSBMYXlvdXRNb2RlLnByb3RvdHlwZTtcclxuXHJcbiAgLyoqXHJcbiAgICogc29tZSBtZXRob2RzIHNob3VsZCBqdXN0IGRlZmVyIHRvIGRlZmF1bHQgT3V0bGF5ZXIgbWV0aG9kXHJcbiAgICogYW5kIHJlZmVyZW5jZSB0aGUgSXNvdG9wZSBpbnN0YW5jZSBhcyBgdGhpc2BcclxuICAqKi9cclxuICB2YXIgZmFjYWRlTWV0aG9kcyA9IFtcclxuICAgICdfcmVzZXRMYXlvdXQnLFxyXG4gICAgJ19nZXRJdGVtTGF5b3V0UG9zaXRpb24nLFxyXG4gICAgJ19tYW5hZ2VTdGFtcCcsXHJcbiAgICAnX2dldENvbnRhaW5lclNpemUnLFxyXG4gICAgJ19nZXRFbGVtZW50T2Zmc2V0JyxcclxuICAgICduZWVkc1Jlc2l6ZUxheW91dCcsXHJcbiAgICAnX2dldE9wdGlvbidcclxuICBdO1xyXG5cclxuICBmYWNhZGVNZXRob2RzLmZvckVhY2goIGZ1bmN0aW9uKCBtZXRob2ROYW1lICkge1xyXG4gICAgcHJvdG9bIG1ldGhvZE5hbWUgXSA9IGZ1bmN0aW9uKCkge1xyXG4gICAgICByZXR1cm4gT3V0bGF5ZXIucHJvdG90eXBlWyBtZXRob2ROYW1lIF0uYXBwbHkoIHRoaXMuaXNvdG9wZSwgYXJndW1lbnRzICk7XHJcbiAgICB9O1xyXG4gIH0pO1xyXG5cclxuICAvLyAtLS0tLSAgLS0tLS0gLy9cclxuXHJcbiAgLy8gZm9yIGhvcml6b250YWwgbGF5b3V0IG1vZGVzLCBjaGVjayB2ZXJ0aWNhbCBzaXplXHJcbiAgcHJvdG8ubmVlZHNWZXJ0aWNhbFJlc2l6ZUxheW91dCA9IGZ1bmN0aW9uKCkge1xyXG4gICAgLy8gZG9uJ3QgdHJpZ2dlciBpZiBzaXplIGRpZCBub3QgY2hhbmdlXHJcbiAgICB2YXIgc2l6ZSA9IGdldFNpemUoIHRoaXMuaXNvdG9wZS5lbGVtZW50ICk7XHJcbiAgICAvLyBjaGVjayB0aGF0IHRoaXMuc2l6ZSBhbmQgc2l6ZSBhcmUgdGhlcmVcclxuICAgIC8vIElFOCB0cmlnZ2VycyByZXNpemUgb24gYm9keSBzaXplIGNoYW5nZSwgc28gdGhleSBtaWdodCBub3QgYmVcclxuICAgIHZhciBoYXNTaXplcyA9IHRoaXMuaXNvdG9wZS5zaXplICYmIHNpemU7XHJcbiAgICByZXR1cm4gaGFzU2l6ZXMgJiYgc2l6ZS5pbm5lckhlaWdodCAhPSB0aGlzLmlzb3RvcGUuc2l6ZS5pbm5lckhlaWdodDtcclxuICB9O1xyXG5cclxuICAvLyAtLS0tLSBtZWFzdXJlbWVudHMgLS0tLS0gLy9cclxuXHJcbiAgcHJvdG8uX2dldE1lYXN1cmVtZW50ID0gZnVuY3Rpb24oKSB7XHJcbiAgICB0aGlzLmlzb3RvcGUuX2dldE1lYXN1cmVtZW50LmFwcGx5KCB0aGlzLCBhcmd1bWVudHMgKTtcclxuICB9O1xyXG5cclxuICBwcm90by5nZXRDb2x1bW5XaWR0aCA9IGZ1bmN0aW9uKCkge1xyXG4gICAgdGhpcy5nZXRTZWdtZW50U2l6ZSggJ2NvbHVtbicsICdXaWR0aCcgKTtcclxuICB9O1xyXG5cclxuICBwcm90by5nZXRSb3dIZWlnaHQgPSBmdW5jdGlvbigpIHtcclxuICAgIHRoaXMuZ2V0U2VnbWVudFNpemUoICdyb3cnLCAnSGVpZ2h0JyApO1xyXG4gIH07XHJcblxyXG4gIC8qKlxyXG4gICAqIGdldCBjb2x1bW5XaWR0aCBvciByb3dIZWlnaHRcclxuICAgKiBzZWdtZW50OiAnY29sdW1uJyBvciAncm93J1xyXG4gICAqIHNpemUgJ1dpZHRoJyBvciAnSGVpZ2h0J1xyXG4gICoqL1xyXG4gIHByb3RvLmdldFNlZ21lbnRTaXplID0gZnVuY3Rpb24oIHNlZ21lbnQsIHNpemUgKSB7XHJcbiAgICB2YXIgc2VnbWVudE5hbWUgPSBzZWdtZW50ICsgc2l6ZTtcclxuICAgIHZhciBvdXRlclNpemUgPSAnb3V0ZXInICsgc2l6ZTtcclxuICAgIC8vIGNvbHVtbldpZHRoIC8gb3V0ZXJXaWR0aCAvLyByb3dIZWlnaHQgLyBvdXRlckhlaWdodFxyXG4gICAgdGhpcy5fZ2V0TWVhc3VyZW1lbnQoIHNlZ21lbnROYW1lLCBvdXRlclNpemUgKTtcclxuICAgIC8vIGdvdCByb3dIZWlnaHQgb3IgY29sdW1uV2lkdGgsIHdlIGNhbiBjaGlsbFxyXG4gICAgaWYgKCB0aGlzWyBzZWdtZW50TmFtZSBdICkge1xyXG4gICAgICByZXR1cm47XHJcbiAgICB9XHJcbiAgICAvLyBmYWxsIGJhY2sgdG8gaXRlbSBvZiBmaXJzdCBlbGVtZW50XHJcbiAgICB2YXIgZmlyc3RJdGVtU2l6ZSA9IHRoaXMuZ2V0Rmlyc3RJdGVtU2l6ZSgpO1xyXG4gICAgdGhpc1sgc2VnbWVudE5hbWUgXSA9IGZpcnN0SXRlbVNpemUgJiYgZmlyc3RJdGVtU2l6ZVsgb3V0ZXJTaXplIF0gfHxcclxuICAgICAgLy8gb3Igc2l6ZSBvZiBjb250YWluZXJcclxuICAgICAgdGhpcy5pc290b3BlLnNpemVbICdpbm5lcicgKyBzaXplIF07XHJcbiAgfTtcclxuXHJcbiAgcHJvdG8uZ2V0Rmlyc3RJdGVtU2l6ZSA9IGZ1bmN0aW9uKCkge1xyXG4gICAgdmFyIGZpcnN0SXRlbSA9IHRoaXMuaXNvdG9wZS5maWx0ZXJlZEl0ZW1zWzBdO1xyXG4gICAgcmV0dXJuIGZpcnN0SXRlbSAmJiBmaXJzdEl0ZW0uZWxlbWVudCAmJiBnZXRTaXplKCBmaXJzdEl0ZW0uZWxlbWVudCApO1xyXG4gIH07XHJcblxyXG4gIC8vIC0tLS0tIG1ldGhvZHMgdGhhdCBzaG91bGQgcmVmZXJlbmNlIGlzb3RvcGUgLS0tLS0gLy9cclxuXHJcbiAgcHJvdG8ubGF5b3V0ID0gZnVuY3Rpb24oKSB7XHJcbiAgICB0aGlzLmlzb3RvcGUubGF5b3V0LmFwcGx5KCB0aGlzLmlzb3RvcGUsIGFyZ3VtZW50cyApO1xyXG4gIH07XHJcblxyXG4gIHByb3RvLmdldFNpemUgPSBmdW5jdGlvbigpIHtcclxuICAgIHRoaXMuaXNvdG9wZS5nZXRTaXplKCk7XHJcbiAgICB0aGlzLnNpemUgPSB0aGlzLmlzb3RvcGUuc2l6ZTtcclxuICB9O1xyXG5cclxuICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLSBjcmVhdGUgLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0gLy9cclxuXHJcbiAgTGF5b3V0TW9kZS5tb2RlcyA9IHt9O1xyXG5cclxuICBMYXlvdXRNb2RlLmNyZWF0ZSA9IGZ1bmN0aW9uKCBuYW1lc3BhY2UsIG9wdGlvbnMgKSB7XHJcblxyXG4gICAgZnVuY3Rpb24gTW9kZSgpIHtcclxuICAgICAgTGF5b3V0TW9kZS5hcHBseSggdGhpcywgYXJndW1lbnRzICk7XHJcbiAgICB9XHJcblxyXG4gICAgTW9kZS5wcm90b3R5cGUgPSBPYmplY3QuY3JlYXRlKCBwcm90byApO1xyXG4gICAgTW9kZS5wcm90b3R5cGUuY29uc3RydWN0b3IgPSBNb2RlO1xyXG5cclxuICAgIC8vIGRlZmF1bHQgb3B0aW9uc1xyXG4gICAgaWYgKCBvcHRpb25zICkge1xyXG4gICAgICBNb2RlLm9wdGlvbnMgPSBvcHRpb25zO1xyXG4gICAgfVxyXG5cclxuICAgIE1vZGUucHJvdG90eXBlLm5hbWVzcGFjZSA9IG5hbWVzcGFjZTtcclxuICAgIC8vIHJlZ2lzdGVyIGluIElzb3RvcGVcclxuICAgIExheW91dE1vZGUubW9kZXNbIG5hbWVzcGFjZSBdID0gTW9kZTtcclxuXHJcbiAgICByZXR1cm4gTW9kZTtcclxuICB9O1xyXG5cclxuICByZXR1cm4gTGF5b3V0TW9kZTtcclxuXHJcbn0pKTtcclxuXHJcbi8qIVxyXG4gKiBNYXNvbnJ5IHY0LjEuMFxyXG4gKiBDYXNjYWRpbmcgZ3JpZCBsYXlvdXQgbGlicmFyeVxyXG4gKiBodHRwOi8vbWFzb25yeS5kZXNhbmRyby5jb21cclxuICogTUlUIExpY2Vuc2VcclxuICogYnkgRGF2aWQgRGVTYW5kcm9cclxuICovXHJcblxyXG4oIGZ1bmN0aW9uKCB3aW5kb3csIGZhY3RvcnkgKSB7XHJcbiAgLy8gdW5pdmVyc2FsIG1vZHVsZSBkZWZpbml0aW9uXHJcbiAgLyoganNoaW50IHN0cmljdDogZmFsc2UgKi8gLypnbG9iYWxzIGRlZmluZSwgbW9kdWxlLCByZXF1aXJlICovXHJcbiAgaWYgKCB0eXBlb2YgZGVmaW5lID09ICdmdW5jdGlvbicgJiYgZGVmaW5lLmFtZCApIHtcclxuICAgIC8vIEFNRFxyXG4gICAgZGVmaW5lKCAnbWFzb25yeS9tYXNvbnJ5JyxbXHJcbiAgICAgICAgJ291dGxheWVyL291dGxheWVyJyxcclxuICAgICAgICAnZ2V0LXNpemUvZ2V0LXNpemUnXHJcbiAgICAgIF0sXHJcbiAgICAgIGZhY3RvcnkgKTtcclxuICB9IGVsc2UgaWYgKCB0eXBlb2YgbW9kdWxlID09ICdvYmplY3QnICYmIG1vZHVsZS5leHBvcnRzICkge1xyXG4gICAgLy8gQ29tbW9uSlNcclxuICAgIG1vZHVsZS5leHBvcnRzID0gZmFjdG9yeShcclxuICAgICAgcmVxdWlyZSgnb3V0bGF5ZXInKSxcclxuICAgICAgcmVxdWlyZSgnZ2V0LXNpemUnKVxyXG4gICAgKTtcclxuICB9IGVsc2Uge1xyXG4gICAgLy8gYnJvd3NlciBnbG9iYWxcclxuICAgIHdpbmRvdy5NYXNvbnJ5ID0gZmFjdG9yeShcclxuICAgICAgd2luZG93Lk91dGxheWVyLFxyXG4gICAgICB3aW5kb3cuZ2V0U2l6ZVxyXG4gICAgKTtcclxuICB9XHJcblxyXG59KCB3aW5kb3csIGZ1bmN0aW9uIGZhY3RvcnkoIE91dGxheWVyLCBnZXRTaXplICkge1xyXG5cclxuXHJcblxyXG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLSBtYXNvbnJ5RGVmaW5pdGlvbiAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLSAvL1xyXG5cclxuICAvLyBjcmVhdGUgYW4gT3V0bGF5ZXIgbGF5b3V0IGNsYXNzXHJcbiAgdmFyIE1hc29ucnkgPSBPdXRsYXllci5jcmVhdGUoJ21hc29ucnknKTtcclxuICAvLyBpc0ZpdFdpZHRoIC0+IGZpdFdpZHRoXHJcbiAgTWFzb25yeS5jb21wYXRPcHRpb25zLmZpdFdpZHRoID0gJ2lzRml0V2lkdGgnO1xyXG5cclxuICBNYXNvbnJ5LnByb3RvdHlwZS5fcmVzZXRMYXlvdXQgPSBmdW5jdGlvbigpIHtcclxuICAgIHRoaXMuZ2V0U2l6ZSgpO1xyXG4gICAgdGhpcy5fZ2V0TWVhc3VyZW1lbnQoICdjb2x1bW5XaWR0aCcsICdvdXRlcldpZHRoJyApO1xyXG4gICAgdGhpcy5fZ2V0TWVhc3VyZW1lbnQoICdndXR0ZXInLCAnb3V0ZXJXaWR0aCcgKTtcclxuICAgIHRoaXMubWVhc3VyZUNvbHVtbnMoKTtcclxuXHJcbiAgICAvLyByZXNldCBjb2x1bW4gWVxyXG4gICAgdGhpcy5jb2xZcyA9IFtdO1xyXG4gICAgZm9yICggdmFyIGk9MDsgaSA8IHRoaXMuY29sczsgaSsrICkge1xyXG4gICAgICB0aGlzLmNvbFlzLnB1c2goIDAgKTtcclxuICAgIH1cclxuXHJcbiAgICB0aGlzLm1heFkgPSAwO1xyXG4gIH07XHJcblxyXG4gIE1hc29ucnkucHJvdG90eXBlLm1lYXN1cmVDb2x1bW5zID0gZnVuY3Rpb24oKSB7XHJcbiAgICB0aGlzLmdldENvbnRhaW5lcldpZHRoKCk7XHJcbiAgICAvLyBpZiBjb2x1bW5XaWR0aCBpcyAwLCBkZWZhdWx0IHRvIG91dGVyV2lkdGggb2YgZmlyc3QgaXRlbVxyXG4gICAgaWYgKCAhdGhpcy5jb2x1bW5XaWR0aCApIHtcclxuICAgICAgdmFyIGZpcnN0SXRlbSA9IHRoaXMuaXRlbXNbMF07XHJcbiAgICAgIHZhciBmaXJzdEl0ZW1FbGVtID0gZmlyc3RJdGVtICYmIGZpcnN0SXRlbS5lbGVtZW50O1xyXG4gICAgICAvLyBjb2x1bW5XaWR0aCBmYWxsIGJhY2sgdG8gaXRlbSBvZiBmaXJzdCBlbGVtZW50XHJcbiAgICAgIHRoaXMuY29sdW1uV2lkdGggPSBmaXJzdEl0ZW1FbGVtICYmIGdldFNpemUoIGZpcnN0SXRlbUVsZW0gKS5vdXRlcldpZHRoIHx8XHJcbiAgICAgICAgLy8gaWYgZmlyc3QgZWxlbSBoYXMgbm8gd2lkdGgsIGRlZmF1bHQgdG8gc2l6ZSBvZiBjb250YWluZXJcclxuICAgICAgICB0aGlzLmNvbnRhaW5lcldpZHRoO1xyXG4gICAgfVxyXG5cclxuICAgIHZhciBjb2x1bW5XaWR0aCA9IHRoaXMuY29sdW1uV2lkdGggKz0gdGhpcy5ndXR0ZXI7XHJcblxyXG4gICAgLy8gY2FsY3VsYXRlIGNvbHVtbnNcclxuICAgIHZhciBjb250YWluZXJXaWR0aCA9IHRoaXMuY29udGFpbmVyV2lkdGggKyB0aGlzLmd1dHRlcjtcclxuICAgIHZhciBjb2xzID0gY29udGFpbmVyV2lkdGggLyBjb2x1bW5XaWR0aDtcclxuICAgIC8vIGZpeCByb3VuZGluZyBlcnJvcnMsIHR5cGljYWxseSB3aXRoIGd1dHRlcnNcclxuICAgIHZhciBleGNlc3MgPSBjb2x1bW5XaWR0aCAtIGNvbnRhaW5lcldpZHRoICUgY29sdW1uV2lkdGg7XHJcbiAgICAvLyBpZiBvdmVyc2hvb3QgaXMgbGVzcyB0aGFuIGEgcGl4ZWwsIHJvdW5kIHVwLCBvdGhlcndpc2UgZmxvb3IgaXRcclxuICAgIHZhciBtYXRoTWV0aG9kID0gZXhjZXNzICYmIGV4Y2VzcyA8IDEgPyAncm91bmQnIDogJ2Zsb29yJztcclxuICAgIGNvbHMgPSBNYXRoWyBtYXRoTWV0aG9kIF0oIGNvbHMgKTtcclxuICAgIHRoaXMuY29scyA9IE1hdGgubWF4KCBjb2xzLCAxICk7XHJcbiAgfTtcclxuXHJcbiAgTWFzb25yeS5wcm90b3R5cGUuZ2V0Q29udGFpbmVyV2lkdGggPSBmdW5jdGlvbigpIHtcclxuICAgIC8vIGNvbnRhaW5lciBpcyBwYXJlbnQgaWYgZml0IHdpZHRoXHJcbiAgICB2YXIgaXNGaXRXaWR0aCA9IHRoaXMuX2dldE9wdGlvbignZml0V2lkdGgnKTtcclxuICAgIHZhciBjb250YWluZXIgPSBpc0ZpdFdpZHRoID8gdGhpcy5lbGVtZW50LnBhcmVudE5vZGUgOiB0aGlzLmVsZW1lbnQ7XHJcbiAgICAvLyBjaGVjayB0aGF0IHRoaXMuc2l6ZSBhbmQgc2l6ZSBhcmUgdGhlcmVcclxuICAgIC8vIElFOCB0cmlnZ2VycyByZXNpemUgb24gYm9keSBzaXplIGNoYW5nZSwgc28gdGhleSBtaWdodCBub3QgYmVcclxuICAgIHZhciBzaXplID0gZ2V0U2l6ZSggY29udGFpbmVyICk7XHJcbiAgICB0aGlzLmNvbnRhaW5lcldpZHRoID0gc2l6ZSAmJiBzaXplLmlubmVyV2lkdGg7XHJcbiAgfTtcclxuXHJcbiAgTWFzb25yeS5wcm90b3R5cGUuX2dldEl0ZW1MYXlvdXRQb3NpdGlvbiA9IGZ1bmN0aW9uKCBpdGVtICkge1xyXG4gICAgaXRlbS5nZXRTaXplKCk7XHJcbiAgICAvLyBob3cgbWFueSBjb2x1bW5zIGRvZXMgdGhpcyBicmljayBzcGFuXHJcbiAgICB2YXIgcmVtYWluZGVyID0gaXRlbS5zaXplLm91dGVyV2lkdGggJSB0aGlzLmNvbHVtbldpZHRoO1xyXG4gICAgdmFyIG1hdGhNZXRob2QgPSByZW1haW5kZXIgJiYgcmVtYWluZGVyIDwgMSA/ICdyb3VuZCcgOiAnY2VpbCc7XHJcbiAgICAvLyByb3VuZCBpZiBvZmYgYnkgMSBwaXhlbCwgb3RoZXJ3aXNlIHVzZSBjZWlsXHJcbiAgICB2YXIgY29sU3BhbiA9IE1hdGhbIG1hdGhNZXRob2QgXSggaXRlbS5zaXplLm91dGVyV2lkdGggLyB0aGlzLmNvbHVtbldpZHRoICk7XHJcbiAgICBjb2xTcGFuID0gTWF0aC5taW4oIGNvbFNwYW4sIHRoaXMuY29scyApO1xyXG5cclxuICAgIHZhciBjb2xHcm91cCA9IHRoaXMuX2dldENvbEdyb3VwKCBjb2xTcGFuICk7XHJcbiAgICAvLyBnZXQgdGhlIG1pbmltdW0gWSB2YWx1ZSBmcm9tIHRoZSBjb2x1bW5zXHJcbiAgICB2YXIgbWluaW11bVkgPSBNYXRoLm1pbi5hcHBseSggTWF0aCwgY29sR3JvdXAgKTtcclxuICAgIHZhciBzaG9ydENvbEluZGV4ID0gY29sR3JvdXAuaW5kZXhPZiggbWluaW11bVkgKTtcclxuXHJcbiAgICAvLyBwb3NpdGlvbiB0aGUgYnJpY2tcclxuICAgIHZhciBwb3NpdGlvbiA9IHtcclxuICAgICAgeDogdGhpcy5jb2x1bW5XaWR0aCAqIHNob3J0Q29sSW5kZXgsXHJcbiAgICAgIHk6IG1pbmltdW1ZXHJcbiAgICB9O1xyXG5cclxuICAgIC8vIGFwcGx5IHNldEhlaWdodCB0byBuZWNlc3NhcnkgY29sdW1uc1xyXG4gICAgdmFyIHNldEhlaWdodCA9IG1pbmltdW1ZICsgaXRlbS5zaXplLm91dGVySGVpZ2h0O1xyXG4gICAgdmFyIHNldFNwYW4gPSB0aGlzLmNvbHMgKyAxIC0gY29sR3JvdXAubGVuZ3RoO1xyXG4gICAgZm9yICggdmFyIGkgPSAwOyBpIDwgc2V0U3BhbjsgaSsrICkge1xyXG4gICAgICB0aGlzLmNvbFlzWyBzaG9ydENvbEluZGV4ICsgaSBdID0gc2V0SGVpZ2h0O1xyXG4gICAgfVxyXG5cclxuICAgIHJldHVybiBwb3NpdGlvbjtcclxuICB9O1xyXG5cclxuICAvKipcclxuICAgKiBAcGFyYW0ge051bWJlcn0gY29sU3BhbiAtIG51bWJlciBvZiBjb2x1bW5zIHRoZSBlbGVtZW50IHNwYW5zXHJcbiAgICogQHJldHVybnMge0FycmF5fSBjb2xHcm91cFxyXG4gICAqL1xyXG4gIE1hc29ucnkucHJvdG90eXBlLl9nZXRDb2xHcm91cCA9IGZ1bmN0aW9uKCBjb2xTcGFuICkge1xyXG4gICAgaWYgKCBjb2xTcGFuIDwgMiApIHtcclxuICAgICAgLy8gaWYgYnJpY2sgc3BhbnMgb25seSBvbmUgY29sdW1uLCB1c2UgYWxsIHRoZSBjb2x1bW4gWXNcclxuICAgICAgcmV0dXJuIHRoaXMuY29sWXM7XHJcbiAgICB9XHJcblxyXG4gICAgdmFyIGNvbEdyb3VwID0gW107XHJcbiAgICAvLyBob3cgbWFueSBkaWZmZXJlbnQgcGxhY2VzIGNvdWxkIHRoaXMgYnJpY2sgZml0IGhvcml6b250YWxseVxyXG4gICAgdmFyIGdyb3VwQ291bnQgPSB0aGlzLmNvbHMgKyAxIC0gY29sU3BhbjtcclxuICAgIC8vIGZvciBlYWNoIGdyb3VwIHBvdGVudGlhbCBob3Jpem9udGFsIHBvc2l0aW9uXHJcbiAgICBmb3IgKCB2YXIgaSA9IDA7IGkgPCBncm91cENvdW50OyBpKysgKSB7XHJcbiAgICAgIC8vIG1ha2UgYW4gYXJyYXkgb2YgY29sWSB2YWx1ZXMgZm9yIHRoYXQgb25lIGdyb3VwXHJcbiAgICAgIHZhciBncm91cENvbFlzID0gdGhpcy5jb2xZcy5zbGljZSggaSwgaSArIGNvbFNwYW4gKTtcclxuICAgICAgLy8gYW5kIGdldCB0aGUgbWF4IHZhbHVlIG9mIHRoZSBhcnJheVxyXG4gICAgICBjb2xHcm91cFtpXSA9IE1hdGgubWF4LmFwcGx5KCBNYXRoLCBncm91cENvbFlzICk7XHJcbiAgICB9XHJcbiAgICByZXR1cm4gY29sR3JvdXA7XHJcbiAgfTtcclxuXHJcbiAgTWFzb25yeS5wcm90b3R5cGUuX21hbmFnZVN0YW1wID0gZnVuY3Rpb24oIHN0YW1wICkge1xyXG4gICAgdmFyIHN0YW1wU2l6ZSA9IGdldFNpemUoIHN0YW1wICk7XHJcbiAgICB2YXIgb2Zmc2V0ID0gdGhpcy5fZ2V0RWxlbWVudE9mZnNldCggc3RhbXAgKTtcclxuICAgIC8vIGdldCB0aGUgY29sdW1ucyB0aGF0IHRoaXMgc3RhbXAgYWZmZWN0c1xyXG4gICAgdmFyIGlzT3JpZ2luTGVmdCA9IHRoaXMuX2dldE9wdGlvbignb3JpZ2luTGVmdCcpO1xyXG4gICAgdmFyIGZpcnN0WCA9IGlzT3JpZ2luTGVmdCA/IG9mZnNldC5sZWZ0IDogb2Zmc2V0LnJpZ2h0O1xyXG4gICAgdmFyIGxhc3RYID0gZmlyc3RYICsgc3RhbXBTaXplLm91dGVyV2lkdGg7XHJcbiAgICB2YXIgZmlyc3RDb2wgPSBNYXRoLmZsb29yKCBmaXJzdFggLyB0aGlzLmNvbHVtbldpZHRoICk7XHJcbiAgICBmaXJzdENvbCA9IE1hdGgubWF4KCAwLCBmaXJzdENvbCApO1xyXG4gICAgdmFyIGxhc3RDb2wgPSBNYXRoLmZsb29yKCBsYXN0WCAvIHRoaXMuY29sdW1uV2lkdGggKTtcclxuICAgIC8vIGxhc3RDb2wgc2hvdWxkIG5vdCBnbyBvdmVyIGlmIG11bHRpcGxlIG9mIGNvbHVtbldpZHRoICM0MjVcclxuICAgIGxhc3RDb2wgLT0gbGFzdFggJSB0aGlzLmNvbHVtbldpZHRoID8gMCA6IDE7XHJcbiAgICBsYXN0Q29sID0gTWF0aC5taW4oIHRoaXMuY29scyAtIDEsIGxhc3RDb2wgKTtcclxuICAgIC8vIHNldCBjb2xZcyB0byBib3R0b20gb2YgdGhlIHN0YW1wXHJcblxyXG4gICAgdmFyIGlzT3JpZ2luVG9wID0gdGhpcy5fZ2V0T3B0aW9uKCdvcmlnaW5Ub3AnKTtcclxuICAgIHZhciBzdGFtcE1heFkgPSAoIGlzT3JpZ2luVG9wID8gb2Zmc2V0LnRvcCA6IG9mZnNldC5ib3R0b20gKSArXHJcbiAgICAgIHN0YW1wU2l6ZS5vdXRlckhlaWdodDtcclxuICAgIGZvciAoIHZhciBpID0gZmlyc3RDb2w7IGkgPD0gbGFzdENvbDsgaSsrICkge1xyXG4gICAgICB0aGlzLmNvbFlzW2ldID0gTWF0aC5tYXgoIHN0YW1wTWF4WSwgdGhpcy5jb2xZc1tpXSApO1xyXG4gICAgfVxyXG4gIH07XHJcblxyXG4gIE1hc29ucnkucHJvdG90eXBlLl9nZXRDb250YWluZXJTaXplID0gZnVuY3Rpb24oKSB7XHJcbiAgICB0aGlzLm1heFkgPSBNYXRoLm1heC5hcHBseSggTWF0aCwgdGhpcy5jb2xZcyApO1xyXG4gICAgdmFyIHNpemUgPSB7XHJcbiAgICAgIGhlaWdodDogdGhpcy5tYXhZXHJcbiAgICB9O1xyXG5cclxuICAgIGlmICggdGhpcy5fZ2V0T3B0aW9uKCdmaXRXaWR0aCcpICkge1xyXG4gICAgICBzaXplLndpZHRoID0gdGhpcy5fZ2V0Q29udGFpbmVyRml0V2lkdGgoKTtcclxuICAgIH1cclxuXHJcbiAgICByZXR1cm4gc2l6ZTtcclxuICB9O1xyXG5cclxuICBNYXNvbnJ5LnByb3RvdHlwZS5fZ2V0Q29udGFpbmVyRml0V2lkdGggPSBmdW5jdGlvbigpIHtcclxuICAgIHZhciB1bnVzZWRDb2xzID0gMDtcclxuICAgIC8vIGNvdW50IHVudXNlZCBjb2x1bW5zXHJcbiAgICB2YXIgaSA9IHRoaXMuY29scztcclxuICAgIHdoaWxlICggLS1pICkge1xyXG4gICAgICBpZiAoIHRoaXMuY29sWXNbaV0gIT09IDAgKSB7XHJcbiAgICAgICAgYnJlYWs7XHJcbiAgICAgIH1cclxuICAgICAgdW51c2VkQ29scysrO1xyXG4gICAgfVxyXG4gICAgLy8gZml0IGNvbnRhaW5lciB0byBjb2x1bW5zIHRoYXQgaGF2ZSBiZWVuIHVzZWRcclxuICAgIHJldHVybiAoIHRoaXMuY29scyAtIHVudXNlZENvbHMgKSAqIHRoaXMuY29sdW1uV2lkdGggLSB0aGlzLmd1dHRlcjtcclxuICB9O1xyXG5cclxuICBNYXNvbnJ5LnByb3RvdHlwZS5uZWVkc1Jlc2l6ZUxheW91dCA9IGZ1bmN0aW9uKCkge1xyXG4gICAgdmFyIHByZXZpb3VzV2lkdGggPSB0aGlzLmNvbnRhaW5lcldpZHRoO1xyXG4gICAgdGhpcy5nZXRDb250YWluZXJXaWR0aCgpO1xyXG4gICAgcmV0dXJuIHByZXZpb3VzV2lkdGggIT0gdGhpcy5jb250YWluZXJXaWR0aDtcclxuICB9O1xyXG5cclxuICByZXR1cm4gTWFzb25yeTtcclxuXHJcbn0pKTtcclxuXHJcbi8qIVxyXG4gKiBNYXNvbnJ5IGxheW91dCBtb2RlXHJcbiAqIHN1Yi1jbGFzc2VzIE1hc29ucnlcclxuICogaHR0cDovL21hc29ucnkuZGVzYW5kcm8uY29tXHJcbiAqL1xyXG5cclxuKCBmdW5jdGlvbiggd2luZG93LCBmYWN0b3J5ICkge1xyXG4gIC8vIHVuaXZlcnNhbCBtb2R1bGUgZGVmaW5pdGlvblxyXG4gIC8qIGpzaGludCBzdHJpY3Q6IGZhbHNlICovIC8qZ2xvYmFscyBkZWZpbmUsIG1vZHVsZSwgcmVxdWlyZSAqL1xyXG4gIGlmICggdHlwZW9mIGRlZmluZSA9PSAnZnVuY3Rpb24nICYmIGRlZmluZS5hbWQgKSB7XHJcbiAgICAvLyBBTURcclxuICAgIGRlZmluZSggJ2lzb3RvcGUvbGF5b3V0LW1vZGVzL21hc29ucnknLFtcclxuICAgICAgICAnLi4vbGF5b3V0LW1vZGUnLFxyXG4gICAgICAgICdtYXNvbnJ5L21hc29ucnknXHJcbiAgICAgIF0sXHJcbiAgICAgIGZhY3RvcnkgKTtcclxuICB9IGVsc2UgaWYgKCB0eXBlb2YgbW9kdWxlID09ICdvYmplY3QnICYmIG1vZHVsZS5leHBvcnRzICkge1xyXG4gICAgLy8gQ29tbW9uSlNcclxuICAgIG1vZHVsZS5leHBvcnRzID0gZmFjdG9yeShcclxuICAgICAgcmVxdWlyZSgnLi4vbGF5b3V0LW1vZGUnKSxcclxuICAgICAgcmVxdWlyZSgnbWFzb25yeS1sYXlvdXQnKVxyXG4gICAgKTtcclxuICB9IGVsc2Uge1xyXG4gICAgLy8gYnJvd3NlciBnbG9iYWxcclxuICAgIGZhY3RvcnkoXHJcbiAgICAgIHdpbmRvdy5Jc290b3BlLkxheW91dE1vZGUsXHJcbiAgICAgIHdpbmRvdy5NYXNvbnJ5XHJcbiAgICApO1xyXG4gIH1cclxuXHJcbn0oIHdpbmRvdywgZnVuY3Rpb24gZmFjdG9yeSggTGF5b3V0TW9kZSwgTWFzb25yeSApIHtcclxuJ3VzZSBzdHJpY3QnO1xyXG5cclxuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0gbWFzb25yeURlZmluaXRpb24gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0gLy9cclxuXHJcbiAgLy8gY3JlYXRlIGFuIE91dGxheWVyIGxheW91dCBjbGFzc1xyXG4gIHZhciBNYXNvbnJ5TW9kZSA9IExheW91dE1vZGUuY3JlYXRlKCdtYXNvbnJ5Jyk7XHJcblxyXG4gIHZhciBwcm90byA9IE1hc29ucnlNb2RlLnByb3RvdHlwZTtcclxuXHJcbiAgdmFyIGtlZXBNb2RlTWV0aG9kcyA9IHtcclxuICAgIF9nZXRFbGVtZW50T2Zmc2V0OiB0cnVlLFxyXG4gICAgbGF5b3V0OiB0cnVlLFxyXG4gICAgX2dldE1lYXN1cmVtZW50OiB0cnVlXHJcbiAgfTtcclxuXHJcbiAgLy8gaW5oZXJpdCBNYXNvbnJ5IHByb3RvdHlwZVxyXG4gIGZvciAoIHZhciBtZXRob2QgaW4gTWFzb25yeS5wcm90b3R5cGUgKSB7XHJcbiAgICAvLyBkbyBub3QgaW5oZXJpdCBtb2RlIG1ldGhvZHNcclxuICAgIGlmICggIWtlZXBNb2RlTWV0aG9kc1sgbWV0aG9kIF0gKSB7XHJcbiAgICAgIHByb3RvWyBtZXRob2QgXSA9IE1hc29ucnkucHJvdG90eXBlWyBtZXRob2QgXTtcclxuICAgIH1cclxuICB9XHJcblxyXG4gIHZhciBtZWFzdXJlQ29sdW1ucyA9IHByb3RvLm1lYXN1cmVDb2x1bW5zO1xyXG4gIHByb3RvLm1lYXN1cmVDb2x1bW5zID0gZnVuY3Rpb24oKSB7XHJcbiAgICAvLyBzZXQgaXRlbXMsIHVzZWQgaWYgbWVhc3VyaW5nIGZpcnN0IGl0ZW1cclxuICAgIHRoaXMuaXRlbXMgPSB0aGlzLmlzb3RvcGUuZmlsdGVyZWRJdGVtcztcclxuICAgIG1lYXN1cmVDb2x1bW5zLmNhbGwoIHRoaXMgKTtcclxuICB9O1xyXG5cclxuICAvLyBwb2ludCB0byBtb2RlIG9wdGlvbnMgZm9yIGZpdFdpZHRoXHJcbiAgdmFyIF9nZXRPcHRpb24gPSBwcm90by5fZ2V0T3B0aW9uO1xyXG4gIHByb3RvLl9nZXRPcHRpb24gPSBmdW5jdGlvbiggb3B0aW9uICkge1xyXG4gICAgaWYgKCBvcHRpb24gPT0gJ2ZpdFdpZHRoJyApIHtcclxuICAgICAgcmV0dXJuIHRoaXMub3B0aW9ucy5pc0ZpdFdpZHRoICE9PSB1bmRlZmluZWQgP1xyXG4gICAgICAgIHRoaXMub3B0aW9ucy5pc0ZpdFdpZHRoIDogdGhpcy5vcHRpb25zLmZpdFdpZHRoO1xyXG4gICAgfVxyXG4gICAgcmV0dXJuIF9nZXRPcHRpb24uYXBwbHkoIHRoaXMuaXNvdG9wZSwgYXJndW1lbnRzICk7XHJcbiAgfTtcclxuXHJcbiAgcmV0dXJuIE1hc29ucnlNb2RlO1xyXG5cclxufSkpO1xyXG5cclxuLyoqXHJcbiAqIGZpdFJvd3MgbGF5b3V0IG1vZGVcclxuICovXHJcblxyXG4oIGZ1bmN0aW9uKCB3aW5kb3csIGZhY3RvcnkgKSB7XHJcbiAgLy8gdW5pdmVyc2FsIG1vZHVsZSBkZWZpbml0aW9uXHJcbiAgLyoganNoaW50IHN0cmljdDogZmFsc2UgKi8gLypnbG9iYWxzIGRlZmluZSwgbW9kdWxlLCByZXF1aXJlICovXHJcbiAgaWYgKCB0eXBlb2YgZGVmaW5lID09ICdmdW5jdGlvbicgJiYgZGVmaW5lLmFtZCApIHtcclxuICAgIC8vIEFNRFxyXG4gICAgZGVmaW5lKCAnaXNvdG9wZS9sYXlvdXQtbW9kZXMvZml0LXJvd3MnLFtcclxuICAgICAgICAnLi4vbGF5b3V0LW1vZGUnXHJcbiAgICAgIF0sXHJcbiAgICAgIGZhY3RvcnkgKTtcclxuICB9IGVsc2UgaWYgKCB0eXBlb2YgZXhwb3J0cyA9PSAnb2JqZWN0JyApIHtcclxuICAgIC8vIENvbW1vbkpTXHJcbiAgICBtb2R1bGUuZXhwb3J0cyA9IGZhY3RvcnkoXHJcbiAgICAgIHJlcXVpcmUoJy4uL2xheW91dC1tb2RlJylcclxuICAgICk7XHJcbiAgfSBlbHNlIHtcclxuICAgIC8vIGJyb3dzZXIgZ2xvYmFsXHJcbiAgICBmYWN0b3J5KFxyXG4gICAgICB3aW5kb3cuSXNvdG9wZS5MYXlvdXRNb2RlXHJcbiAgICApO1xyXG4gIH1cclxuXHJcbn0oIHdpbmRvdywgZnVuY3Rpb24gZmFjdG9yeSggTGF5b3V0TW9kZSApIHtcclxuJ3VzZSBzdHJpY3QnO1xyXG5cclxudmFyIEZpdFJvd3MgPSBMYXlvdXRNb2RlLmNyZWF0ZSgnZml0Um93cycpO1xyXG5cclxudmFyIHByb3RvID0gRml0Um93cy5wcm90b3R5cGU7XHJcblxyXG5wcm90by5fcmVzZXRMYXlvdXQgPSBmdW5jdGlvbigpIHtcclxuICB0aGlzLnggPSAwO1xyXG4gIHRoaXMueSA9IDA7XHJcbiAgdGhpcy5tYXhZID0gMDtcclxuICB0aGlzLl9nZXRNZWFzdXJlbWVudCggJ2d1dHRlcicsICdvdXRlcldpZHRoJyApO1xyXG59O1xyXG5cclxucHJvdG8uX2dldEl0ZW1MYXlvdXRQb3NpdGlvbiA9IGZ1bmN0aW9uKCBpdGVtICkge1xyXG4gIGl0ZW0uZ2V0U2l6ZSgpO1xyXG5cclxuICB2YXIgaXRlbVdpZHRoID0gaXRlbS5zaXplLm91dGVyV2lkdGggKyB0aGlzLmd1dHRlcjtcclxuICAvLyBpZiB0aGlzIGVsZW1lbnQgY2Fubm90IGZpdCBpbiB0aGUgY3VycmVudCByb3dcclxuICB2YXIgY29udGFpbmVyV2lkdGggPSB0aGlzLmlzb3RvcGUuc2l6ZS5pbm5lcldpZHRoICsgdGhpcy5ndXR0ZXI7XHJcbiAgaWYgKCB0aGlzLnggIT09IDAgJiYgaXRlbVdpZHRoICsgdGhpcy54ID4gY29udGFpbmVyV2lkdGggKSB7XHJcbiAgICB0aGlzLnggPSAwO1xyXG4gICAgdGhpcy55ID0gdGhpcy5tYXhZO1xyXG4gIH1cclxuXHJcbiAgdmFyIHBvc2l0aW9uID0ge1xyXG4gICAgeDogdGhpcy54LFxyXG4gICAgeTogdGhpcy55XHJcbiAgfTtcclxuXHJcbiAgdGhpcy5tYXhZID0gTWF0aC5tYXgoIHRoaXMubWF4WSwgdGhpcy55ICsgaXRlbS5zaXplLm91dGVySGVpZ2h0ICk7XHJcbiAgdGhpcy54ICs9IGl0ZW1XaWR0aDtcclxuXHJcbiAgcmV0dXJuIHBvc2l0aW9uO1xyXG59O1xyXG5cclxucHJvdG8uX2dldENvbnRhaW5lclNpemUgPSBmdW5jdGlvbigpIHtcclxuICByZXR1cm4geyBoZWlnaHQ6IHRoaXMubWF4WSB9O1xyXG59O1xyXG5cclxucmV0dXJuIEZpdFJvd3M7XHJcblxyXG59KSk7XHJcblxyXG4vKipcclxuICogdmVydGljYWwgbGF5b3V0IG1vZGVcclxuICovXHJcblxyXG4oIGZ1bmN0aW9uKCB3aW5kb3csIGZhY3RvcnkgKSB7XHJcbiAgLy8gdW5pdmVyc2FsIG1vZHVsZSBkZWZpbml0aW9uXHJcbiAgLyoganNoaW50IHN0cmljdDogZmFsc2UgKi8gLypnbG9iYWxzIGRlZmluZSwgbW9kdWxlLCByZXF1aXJlICovXHJcbiAgaWYgKCB0eXBlb2YgZGVmaW5lID09ICdmdW5jdGlvbicgJiYgZGVmaW5lLmFtZCApIHtcclxuICAgIC8vIEFNRFxyXG4gICAgZGVmaW5lKCAnaXNvdG9wZS9sYXlvdXQtbW9kZXMvdmVydGljYWwnLFtcclxuICAgICAgICAnLi4vbGF5b3V0LW1vZGUnXHJcbiAgICAgIF0sXHJcbiAgICAgIGZhY3RvcnkgKTtcclxuICB9IGVsc2UgaWYgKCB0eXBlb2YgbW9kdWxlID09ICdvYmplY3QnICYmIG1vZHVsZS5leHBvcnRzICkge1xyXG4gICAgLy8gQ29tbW9uSlNcclxuICAgIG1vZHVsZS5leHBvcnRzID0gZmFjdG9yeShcclxuICAgICAgcmVxdWlyZSgnLi4vbGF5b3V0LW1vZGUnKVxyXG4gICAgKTtcclxuICB9IGVsc2Uge1xyXG4gICAgLy8gYnJvd3NlciBnbG9iYWxcclxuICAgIGZhY3RvcnkoXHJcbiAgICAgIHdpbmRvdy5Jc290b3BlLkxheW91dE1vZGVcclxuICAgICk7XHJcbiAgfVxyXG5cclxufSggd2luZG93LCBmdW5jdGlvbiBmYWN0b3J5KCBMYXlvdXRNb2RlICkge1xyXG4ndXNlIHN0cmljdCc7XHJcblxyXG52YXIgVmVydGljYWwgPSBMYXlvdXRNb2RlLmNyZWF0ZSggJ3ZlcnRpY2FsJywge1xyXG4gIGhvcml6b250YWxBbGlnbm1lbnQ6IDBcclxufSk7XHJcblxyXG52YXIgcHJvdG8gPSBWZXJ0aWNhbC5wcm90b3R5cGU7XHJcblxyXG5wcm90by5fcmVzZXRMYXlvdXQgPSBmdW5jdGlvbigpIHtcclxuICB0aGlzLnkgPSAwO1xyXG59O1xyXG5cclxucHJvdG8uX2dldEl0ZW1MYXlvdXRQb3NpdGlvbiA9IGZ1bmN0aW9uKCBpdGVtICkge1xyXG4gIGl0ZW0uZ2V0U2l6ZSgpO1xyXG4gIHZhciB4ID0gKCB0aGlzLmlzb3RvcGUuc2l6ZS5pbm5lcldpZHRoIC0gaXRlbS5zaXplLm91dGVyV2lkdGggKSAqXHJcbiAgICB0aGlzLm9wdGlvbnMuaG9yaXpvbnRhbEFsaWdubWVudDtcclxuICB2YXIgeSA9IHRoaXMueTtcclxuICB0aGlzLnkgKz0gaXRlbS5zaXplLm91dGVySGVpZ2h0O1xyXG4gIHJldHVybiB7IHg6IHgsIHk6IHkgfTtcclxufTtcclxuXHJcbnByb3RvLl9nZXRDb250YWluZXJTaXplID0gZnVuY3Rpb24oKSB7XHJcbiAgcmV0dXJuIHsgaGVpZ2h0OiB0aGlzLnkgfTtcclxufTtcclxuXHJcbnJldHVybiBWZXJ0aWNhbDtcclxuXHJcbn0pKTtcclxuXHJcbi8qIVxyXG4gKiBJc290b3BlIHYzLjAuMFxyXG4gKlxyXG4gKiBMaWNlbnNlZCBHUEx2MyBmb3Igb3BlbiBzb3VyY2UgdXNlXHJcbiAqIG9yIElzb3RvcGUgQ29tbWVyY2lhbCBMaWNlbnNlIGZvciBjb21tZXJjaWFsIHVzZVxyXG4gKlxyXG4gKiBodHRwOi8vaXNvdG9wZS5tZXRhZml6enkuY29cclxuICogQ29weXJpZ2h0IDIwMTYgTWV0YWZpenp5XHJcbiAqL1xyXG5cclxuKCBmdW5jdGlvbiggd2luZG93LCBmYWN0b3J5ICkge1xyXG4gIC8vIHVuaXZlcnNhbCBtb2R1bGUgZGVmaW5pdGlvblxyXG4gIC8qIGpzaGludCBzdHJpY3Q6IGZhbHNlICovIC8qZ2xvYmFscyBkZWZpbmUsIG1vZHVsZSwgcmVxdWlyZSAqL1xyXG4gIGlmICggdHlwZW9mIGRlZmluZSA9PSAnZnVuY3Rpb24nICYmIGRlZmluZS5hbWQgKSB7XHJcbiAgICAvLyBBTURcclxuICAgIGRlZmluZSggW1xyXG4gICAgICAgICdvdXRsYXllci9vdXRsYXllcicsXHJcbiAgICAgICAgJ2dldC1zaXplL2dldC1zaXplJyxcclxuICAgICAgICAnZGVzYW5kcm8tbWF0Y2hlcy1zZWxlY3Rvci9tYXRjaGVzLXNlbGVjdG9yJyxcclxuICAgICAgICAnZml6enktdWktdXRpbHMvdXRpbHMnLFxyXG4gICAgICAgICcuL2l0ZW0nLFxyXG4gICAgICAgICcuL2xheW91dC1tb2RlJyxcclxuICAgICAgICAvLyBpbmNsdWRlIGRlZmF1bHQgbGF5b3V0IG1vZGVzXHJcbiAgICAgICAgJy4vbGF5b3V0LW1vZGVzL21hc29ucnknLFxyXG4gICAgICAgICcuL2xheW91dC1tb2Rlcy9maXQtcm93cycsXHJcbiAgICAgICAgJy4vbGF5b3V0LW1vZGVzL3ZlcnRpY2FsJ1xyXG4gICAgICBdLFxyXG4gICAgICBmdW5jdGlvbiggT3V0bGF5ZXIsIGdldFNpemUsIG1hdGNoZXNTZWxlY3RvciwgdXRpbHMsIEl0ZW0sIExheW91dE1vZGUgKSB7XHJcbiAgICAgICAgcmV0dXJuIGZhY3RvcnkoIHdpbmRvdywgT3V0bGF5ZXIsIGdldFNpemUsIG1hdGNoZXNTZWxlY3RvciwgdXRpbHMsIEl0ZW0sIExheW91dE1vZGUgKTtcclxuICAgICAgfSk7XHJcbiAgfSBlbHNlIGlmICggdHlwZW9mIG1vZHVsZSA9PSAnb2JqZWN0JyAmJiBtb2R1bGUuZXhwb3J0cyApIHtcclxuICAgIC8vIENvbW1vbkpTXHJcbiAgICBtb2R1bGUuZXhwb3J0cyA9IGZhY3RvcnkoXHJcbiAgICAgIHdpbmRvdyxcclxuICAgICAgcmVxdWlyZSgnb3V0bGF5ZXInKSxcclxuICAgICAgcmVxdWlyZSgnZ2V0LXNpemUnKSxcclxuICAgICAgcmVxdWlyZSgnZGVzYW5kcm8tbWF0Y2hlcy1zZWxlY3RvcicpLFxyXG4gICAgICByZXF1aXJlKCdmaXp6eS11aS11dGlscycpLFxyXG4gICAgICByZXF1aXJlKCcuL2l0ZW0nKSxcclxuICAgICAgcmVxdWlyZSgnLi9sYXlvdXQtbW9kZScpLFxyXG4gICAgICAvLyBpbmNsdWRlIGRlZmF1bHQgbGF5b3V0IG1vZGVzXHJcbiAgICAgIHJlcXVpcmUoJy4vbGF5b3V0LW1vZGVzL21hc29ucnknKSxcclxuICAgICAgcmVxdWlyZSgnLi9sYXlvdXQtbW9kZXMvZml0LXJvd3MnKSxcclxuICAgICAgcmVxdWlyZSgnLi9sYXlvdXQtbW9kZXMvdmVydGljYWwnKVxyXG4gICAgKTtcclxuICB9IGVsc2Uge1xyXG4gICAgLy8gYnJvd3NlciBnbG9iYWxcclxuICAgIHdpbmRvdy5Jc290b3BlID0gZmFjdG9yeShcclxuICAgICAgd2luZG93LFxyXG4gICAgICB3aW5kb3cuT3V0bGF5ZXIsXHJcbiAgICAgIHdpbmRvdy5nZXRTaXplLFxyXG4gICAgICB3aW5kb3cubWF0Y2hlc1NlbGVjdG9yLFxyXG4gICAgICB3aW5kb3cuZml6enlVSVV0aWxzLFxyXG4gICAgICB3aW5kb3cuSXNvdG9wZS5JdGVtLFxyXG4gICAgICB3aW5kb3cuSXNvdG9wZS5MYXlvdXRNb2RlXHJcbiAgICApO1xyXG4gIH1cclxuXHJcbn0oIHdpbmRvdywgZnVuY3Rpb24gZmFjdG9yeSggd2luZG93LCBPdXRsYXllciwgZ2V0U2l6ZSwgbWF0Y2hlc1NlbGVjdG9yLCB1dGlscyxcclxuICBJdGVtLCBMYXlvdXRNb2RlICkge1xyXG5cclxuXHJcblxyXG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLSB2YXJzIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tIC8vXHJcblxyXG52YXIgalF1ZXJ5ID0gd2luZG93LmpRdWVyeTtcclxuXHJcbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tIGhlbHBlcnMgLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0gLy9cclxuXHJcbnZhciB0cmltID0gU3RyaW5nLnByb3RvdHlwZS50cmltID9cclxuICBmdW5jdGlvbiggc3RyICkge1xyXG4gICAgcmV0dXJuIHN0ci50cmltKCk7XHJcbiAgfSA6XHJcbiAgZnVuY3Rpb24oIHN0ciApIHtcclxuICAgIHJldHVybiBzdHIucmVwbGFjZSggL15cXHMrfFxccyskL2csICcnICk7XHJcbiAgfTtcclxuXHJcbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tIGlzb3RvcGVEZWZpbml0aW9uIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tIC8vXHJcblxyXG4gIC8vIGNyZWF0ZSBhbiBPdXRsYXllciBsYXlvdXQgY2xhc3NcclxuICB2YXIgSXNvdG9wZSA9IE91dGxheWVyLmNyZWF0ZSggJ2lzb3RvcGUnLCB7XHJcbiAgICBsYXlvdXRNb2RlOiAnbWFzb25yeScsXHJcbiAgICBpc0pRdWVyeUZpbHRlcmluZzogdHJ1ZSxcclxuICAgIHNvcnRBc2NlbmRpbmc6IHRydWVcclxuICB9KTtcclxuXHJcbiAgSXNvdG9wZS5JdGVtID0gSXRlbTtcclxuICBJc290b3BlLkxheW91dE1vZGUgPSBMYXlvdXRNb2RlO1xyXG5cclxuICB2YXIgcHJvdG8gPSBJc290b3BlLnByb3RvdHlwZTtcclxuXHJcbiAgcHJvdG8uX2NyZWF0ZSA9IGZ1bmN0aW9uKCkge1xyXG4gICAgdGhpcy5pdGVtR1VJRCA9IDA7XHJcbiAgICAvLyBmdW5jdGlvbnMgdGhhdCBzb3J0IGl0ZW1zXHJcbiAgICB0aGlzLl9zb3J0ZXJzID0ge307XHJcbiAgICB0aGlzLl9nZXRTb3J0ZXJzKCk7XHJcbiAgICAvLyBjYWxsIHN1cGVyXHJcbiAgICBPdXRsYXllci5wcm90b3R5cGUuX2NyZWF0ZS5jYWxsKCB0aGlzICk7XHJcblxyXG4gICAgLy8gY3JlYXRlIGxheW91dCBtb2Rlc1xyXG4gICAgdGhpcy5tb2RlcyA9IHt9O1xyXG4gICAgLy8gc3RhcnQgZmlsdGVyZWRJdGVtcyB3aXRoIGFsbCBpdGVtc1xyXG4gICAgdGhpcy5maWx0ZXJlZEl0ZW1zID0gdGhpcy5pdGVtcztcclxuICAgIC8vIGtlZXAgb2YgdHJhY2sgb2Ygc29ydEJ5c1xyXG4gICAgdGhpcy5zb3J0SGlzdG9yeSA9IFsgJ29yaWdpbmFsLW9yZGVyJyBdO1xyXG4gICAgLy8gY3JlYXRlIGZyb20gcmVnaXN0ZXJlZCBsYXlvdXQgbW9kZXNcclxuICAgIGZvciAoIHZhciBuYW1lIGluIExheW91dE1vZGUubW9kZXMgKSB7XHJcbiAgICAgIHRoaXMuX2luaXRMYXlvdXRNb2RlKCBuYW1lICk7XHJcbiAgICB9XHJcbiAgfTtcclxuXHJcbiAgcHJvdG8ucmVsb2FkSXRlbXMgPSBmdW5jdGlvbigpIHtcclxuICAgIC8vIHJlc2V0IGl0ZW0gSUQgY291bnRlclxyXG4gICAgdGhpcy5pdGVtR1VJRCA9IDA7XHJcbiAgICAvLyBjYWxsIHN1cGVyXHJcbiAgICBPdXRsYXllci5wcm90b3R5cGUucmVsb2FkSXRlbXMuY2FsbCggdGhpcyApO1xyXG4gIH07XHJcblxyXG4gIHByb3RvLl9pdGVtaXplID0gZnVuY3Rpb24oKSB7XHJcbiAgICB2YXIgaXRlbXMgPSBPdXRsYXllci5wcm90b3R5cGUuX2l0ZW1pemUuYXBwbHkoIHRoaXMsIGFyZ3VtZW50cyApO1xyXG4gICAgLy8gYXNzaWduIElEIGZvciBvcmlnaW5hbC1vcmRlclxyXG4gICAgZm9yICggdmFyIGk9MDsgaSA8IGl0ZW1zLmxlbmd0aDsgaSsrICkge1xyXG4gICAgICB2YXIgaXRlbSA9IGl0ZW1zW2ldO1xyXG4gICAgICBpdGVtLmlkID0gdGhpcy5pdGVtR1VJRCsrO1xyXG4gICAgfVxyXG4gICAgdGhpcy5fdXBkYXRlSXRlbXNTb3J0RGF0YSggaXRlbXMgKTtcclxuICAgIHJldHVybiBpdGVtcztcclxuICB9O1xyXG5cclxuXHJcbiAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0gbGF5b3V0IC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tIC8vXHJcblxyXG4gIHByb3RvLl9pbml0TGF5b3V0TW9kZSA9IGZ1bmN0aW9uKCBuYW1lICkge1xyXG4gICAgdmFyIE1vZGUgPSBMYXlvdXRNb2RlLm1vZGVzWyBuYW1lIF07XHJcbiAgICAvLyBzZXQgbW9kZSBvcHRpb25zXHJcbiAgICAvLyBIQUNLIGV4dGVuZCBpbml0aWFsIG9wdGlvbnMsIGJhY2stZmlsbCBpbiBkZWZhdWx0IG9wdGlvbnNcclxuICAgIHZhciBpbml0aWFsT3B0cyA9IHRoaXMub3B0aW9uc1sgbmFtZSBdIHx8IHt9O1xyXG4gICAgdGhpcy5vcHRpb25zWyBuYW1lIF0gPSBNb2RlLm9wdGlvbnMgP1xyXG4gICAgICB1dGlscy5leHRlbmQoIE1vZGUub3B0aW9ucywgaW5pdGlhbE9wdHMgKSA6IGluaXRpYWxPcHRzO1xyXG4gICAgLy8gaW5pdCBsYXlvdXQgbW9kZSBpbnN0YW5jZVxyXG4gICAgdGhpcy5tb2Rlc1sgbmFtZSBdID0gbmV3IE1vZGUoIHRoaXMgKTtcclxuICB9O1xyXG5cclxuXHJcbiAgcHJvdG8ubGF5b3V0ID0gZnVuY3Rpb24oKSB7XHJcbiAgICAvLyBpZiBmaXJzdCB0aW1lIGRvaW5nIGxheW91dCwgZG8gYWxsIG1hZ2ljXHJcbiAgICBpZiAoICF0aGlzLl9pc0xheW91dEluaXRlZCAmJiB0aGlzLl9nZXRPcHRpb24oJ2luaXRMYXlvdXQnKSApIHtcclxuICAgICAgdGhpcy5hcnJhbmdlKCk7XHJcbiAgICAgIHJldHVybjtcclxuICAgIH1cclxuICAgIHRoaXMuX2xheW91dCgpO1xyXG4gIH07XHJcblxyXG4gIC8vIHByaXZhdGUgbWV0aG9kIHRvIGJlIHVzZWQgaW4gbGF5b3V0KCkgJiBtYWdpYygpXHJcbiAgcHJvdG8uX2xheW91dCA9IGZ1bmN0aW9uKCkge1xyXG4gICAgLy8gZG9uJ3QgYW5pbWF0ZSBmaXJzdCBsYXlvdXRcclxuICAgIHZhciBpc0luc3RhbnQgPSB0aGlzLl9nZXRJc0luc3RhbnQoKTtcclxuICAgIC8vIGxheW91dCBmbG93XHJcbiAgICB0aGlzLl9yZXNldExheW91dCgpO1xyXG4gICAgdGhpcy5fbWFuYWdlU3RhbXBzKCk7XHJcbiAgICB0aGlzLmxheW91dEl0ZW1zKCB0aGlzLmZpbHRlcmVkSXRlbXMsIGlzSW5zdGFudCApO1xyXG5cclxuICAgIC8vIGZsYWcgZm9yIGluaXRhbGl6ZWRcclxuICAgIHRoaXMuX2lzTGF5b3V0SW5pdGVkID0gdHJ1ZTtcclxuICB9O1xyXG5cclxuICAvLyBmaWx0ZXIgKyBzb3J0ICsgbGF5b3V0XHJcbiAgcHJvdG8uYXJyYW5nZSA9IGZ1bmN0aW9uKCBvcHRzICkge1xyXG4gICAgLy8gc2V0IGFueSBvcHRpb25zIHBhc3NcclxuICAgIHRoaXMub3B0aW9uKCBvcHRzICk7XHJcbiAgICB0aGlzLl9nZXRJc0luc3RhbnQoKTtcclxuICAgIC8vIGZpbHRlciwgc29ydCwgYW5kIGxheW91dFxyXG5cclxuICAgIC8vIGZpbHRlclxyXG4gICAgdmFyIGZpbHRlcmVkID0gdGhpcy5fZmlsdGVyKCB0aGlzLml0ZW1zICk7XHJcbiAgICB0aGlzLmZpbHRlcmVkSXRlbXMgPSBmaWx0ZXJlZC5tYXRjaGVzO1xyXG5cclxuICAgIHRoaXMuX2JpbmRBcnJhbmdlQ29tcGxldGUoKTtcclxuXHJcbiAgICBpZiAoIHRoaXMuX2lzSW5zdGFudCApIHtcclxuICAgICAgdGhpcy5fbm9UcmFuc2l0aW9uKCB0aGlzLl9oaWRlUmV2ZWFsLCBbIGZpbHRlcmVkIF0gKTtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIHRoaXMuX2hpZGVSZXZlYWwoIGZpbHRlcmVkICk7XHJcbiAgICB9XHJcblxyXG4gICAgdGhpcy5fc29ydCgpO1xyXG4gICAgdGhpcy5fbGF5b3V0KCk7XHJcbiAgfTtcclxuICAvLyBhbGlhcyB0byBfaW5pdCBmb3IgbWFpbiBwbHVnaW4gbWV0aG9kXHJcbiAgcHJvdG8uX2luaXQgPSBwcm90by5hcnJhbmdlO1xyXG5cclxuICBwcm90by5faGlkZVJldmVhbCA9IGZ1bmN0aW9uKCBmaWx0ZXJlZCApIHtcclxuICAgIHRoaXMucmV2ZWFsKCBmaWx0ZXJlZC5uZWVkUmV2ZWFsICk7XHJcbiAgICB0aGlzLmhpZGUoIGZpbHRlcmVkLm5lZWRIaWRlICk7XHJcbiAgfTtcclxuXHJcbiAgLy8gSEFDS1xyXG4gIC8vIERvbid0IGFuaW1hdGUvdHJhbnNpdGlvbiBmaXJzdCBsYXlvdXRcclxuICAvLyBPciBkb24ndCBhbmltYXRlL3RyYW5zaXRpb24gb3RoZXIgbGF5b3V0c1xyXG4gIHByb3RvLl9nZXRJc0luc3RhbnQgPSBmdW5jdGlvbigpIHtcclxuICAgIHZhciBpc0xheW91dEluc3RhbnQgPSB0aGlzLl9nZXRPcHRpb24oJ2xheW91dEluc3RhbnQnKTtcclxuICAgIHZhciBpc0luc3RhbnQgPSBpc0xheW91dEluc3RhbnQgIT09IHVuZGVmaW5lZCA/IGlzTGF5b3V0SW5zdGFudCA6XHJcbiAgICAgICF0aGlzLl9pc0xheW91dEluaXRlZDtcclxuICAgIHRoaXMuX2lzSW5zdGFudCA9IGlzSW5zdGFudDtcclxuICAgIHJldHVybiBpc0luc3RhbnQ7XHJcbiAgfTtcclxuXHJcbiAgLy8gbGlzdGVuIGZvciBsYXlvdXRDb21wbGV0ZSwgaGlkZUNvbXBsZXRlIGFuZCByZXZlYWxDb21wbGV0ZVxyXG4gIC8vIHRvIHRyaWdnZXIgYXJyYW5nZUNvbXBsZXRlXHJcbiAgcHJvdG8uX2JpbmRBcnJhbmdlQ29tcGxldGUgPSBmdW5jdGlvbigpIHtcclxuICAgIC8vIGxpc3RlbiBmb3IgMyBldmVudHMgdG8gdHJpZ2dlciBhcnJhbmdlQ29tcGxldGVcclxuICAgIHZhciBpc0xheW91dENvbXBsZXRlLCBpc0hpZGVDb21wbGV0ZSwgaXNSZXZlYWxDb21wbGV0ZTtcclxuICAgIHZhciBfdGhpcyA9IHRoaXM7XHJcbiAgICBmdW5jdGlvbiBhcnJhbmdlUGFyYWxsZWxDYWxsYmFjaygpIHtcclxuICAgICAgaWYgKCBpc0xheW91dENvbXBsZXRlICYmIGlzSGlkZUNvbXBsZXRlICYmIGlzUmV2ZWFsQ29tcGxldGUgKSB7XHJcbiAgICAgICAgX3RoaXMuZGlzcGF0Y2hFdmVudCggJ2FycmFuZ2VDb21wbGV0ZScsIG51bGwsIFsgX3RoaXMuZmlsdGVyZWRJdGVtcyBdICk7XHJcbiAgICAgIH1cclxuICAgIH1cclxuICAgIHRoaXMub25jZSggJ2xheW91dENvbXBsZXRlJywgZnVuY3Rpb24oKSB7XHJcbiAgICAgIGlzTGF5b3V0Q29tcGxldGUgPSB0cnVlO1xyXG4gICAgICBhcnJhbmdlUGFyYWxsZWxDYWxsYmFjaygpO1xyXG4gICAgfSk7XHJcbiAgICB0aGlzLm9uY2UoICdoaWRlQ29tcGxldGUnLCBmdW5jdGlvbigpIHtcclxuICAgICAgaXNIaWRlQ29tcGxldGUgPSB0cnVlO1xyXG4gICAgICBhcnJhbmdlUGFyYWxsZWxDYWxsYmFjaygpO1xyXG4gICAgfSk7XHJcbiAgICB0aGlzLm9uY2UoICdyZXZlYWxDb21wbGV0ZScsIGZ1bmN0aW9uKCkge1xyXG4gICAgICBpc1JldmVhbENvbXBsZXRlID0gdHJ1ZTtcclxuICAgICAgYXJyYW5nZVBhcmFsbGVsQ2FsbGJhY2soKTtcclxuICAgIH0pO1xyXG4gIH07XHJcblxyXG4gIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tIGZpbHRlciAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLSAvL1xyXG5cclxuICBwcm90by5fZmlsdGVyID0gZnVuY3Rpb24oIGl0ZW1zICkge1xyXG4gICAgdmFyIGZpbHRlciA9IHRoaXMub3B0aW9ucy5maWx0ZXI7XHJcbiAgICBmaWx0ZXIgPSBmaWx0ZXIgfHwgJyonO1xyXG4gICAgdmFyIG1hdGNoZXMgPSBbXTtcclxuICAgIHZhciBoaWRkZW5NYXRjaGVkID0gW107XHJcbiAgICB2YXIgdmlzaWJsZVVubWF0Y2hlZCA9IFtdO1xyXG5cclxuICAgIHZhciB0ZXN0ID0gdGhpcy5fZ2V0RmlsdGVyVGVzdCggZmlsdGVyICk7XHJcblxyXG4gICAgLy8gdGVzdCBlYWNoIGl0ZW1cclxuICAgIGZvciAoIHZhciBpPTA7IGkgPCBpdGVtcy5sZW5ndGg7IGkrKyApIHtcclxuICAgICAgdmFyIGl0ZW0gPSBpdGVtc1tpXTtcclxuICAgICAgaWYgKCBpdGVtLmlzSWdub3JlZCApIHtcclxuICAgICAgICBjb250aW51ZTtcclxuICAgICAgfVxyXG4gICAgICAvLyBhZGQgaXRlbSB0byBlaXRoZXIgbWF0Y2hlZCBvciB1bm1hdGNoZWQgZ3JvdXBcclxuICAgICAgdmFyIGlzTWF0Y2hlZCA9IHRlc3QoIGl0ZW0gKTtcclxuICAgICAgLy8gaXRlbS5pc0ZpbHRlck1hdGNoZWQgPSBpc01hdGNoZWQ7XHJcbiAgICAgIC8vIGFkZCB0byBtYXRjaGVzIGlmIGl0cyBhIG1hdGNoXHJcbiAgICAgIGlmICggaXNNYXRjaGVkICkge1xyXG4gICAgICAgIG1hdGNoZXMucHVzaCggaXRlbSApO1xyXG4gICAgICB9XHJcbiAgICAgIC8vIGFkZCB0byBhZGRpdGlvbmFsIGdyb3VwIGlmIGl0ZW0gbmVlZHMgdG8gYmUgaGlkZGVuIG9yIHJldmVhbGVkXHJcbiAgICAgIGlmICggaXNNYXRjaGVkICYmIGl0ZW0uaXNIaWRkZW4gKSB7XHJcbiAgICAgICAgaGlkZGVuTWF0Y2hlZC5wdXNoKCBpdGVtICk7XHJcbiAgICAgIH0gZWxzZSBpZiAoICFpc01hdGNoZWQgJiYgIWl0ZW0uaXNIaWRkZW4gKSB7XHJcbiAgICAgICAgdmlzaWJsZVVubWF0Y2hlZC5wdXNoKCBpdGVtICk7XHJcbiAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICAvLyByZXR1cm4gY29sbGVjdGlvbnMgb2YgaXRlbXMgdG8gYmUgbWFuaXB1bGF0ZWRcclxuICAgIHJldHVybiB7XHJcbiAgICAgIG1hdGNoZXM6IG1hdGNoZXMsXHJcbiAgICAgIG5lZWRSZXZlYWw6IGhpZGRlbk1hdGNoZWQsXHJcbiAgICAgIG5lZWRIaWRlOiB2aXNpYmxlVW5tYXRjaGVkXHJcbiAgICB9O1xyXG4gIH07XHJcblxyXG4gIC8vIGdldCBhIGpRdWVyeSwgZnVuY3Rpb24sIG9yIGEgbWF0Y2hlc1NlbGVjdG9yIHRlc3QgZ2l2ZW4gdGhlIGZpbHRlclxyXG4gIHByb3RvLl9nZXRGaWx0ZXJUZXN0ID0gZnVuY3Rpb24oIGZpbHRlciApIHtcclxuICAgIGlmICggalF1ZXJ5ICYmIHRoaXMub3B0aW9ucy5pc0pRdWVyeUZpbHRlcmluZyApIHtcclxuICAgICAgLy8gdXNlIGpRdWVyeVxyXG4gICAgICByZXR1cm4gZnVuY3Rpb24oIGl0ZW0gKSB7XHJcbiAgICAgICAgcmV0dXJuIGpRdWVyeSggaXRlbS5lbGVtZW50ICkuaXMoIGZpbHRlciApO1xyXG4gICAgICB9O1xyXG4gICAgfVxyXG4gICAgaWYgKCB0eXBlb2YgZmlsdGVyID09ICdmdW5jdGlvbicgKSB7XHJcbiAgICAgIC8vIHVzZSBmaWx0ZXIgYXMgZnVuY3Rpb25cclxuICAgICAgcmV0dXJuIGZ1bmN0aW9uKCBpdGVtICkge1xyXG4gICAgICAgIHJldHVybiBmaWx0ZXIoIGl0ZW0uZWxlbWVudCApO1xyXG4gICAgICB9O1xyXG4gICAgfVxyXG4gICAgLy8gZGVmYXVsdCwgdXNlIGZpbHRlciBhcyBzZWxlY3RvciBzdHJpbmdcclxuICAgIHJldHVybiBmdW5jdGlvbiggaXRlbSApIHtcclxuICAgICAgcmV0dXJuIG1hdGNoZXNTZWxlY3RvciggaXRlbS5lbGVtZW50LCBmaWx0ZXIgKTtcclxuICAgIH07XHJcbiAgfTtcclxuXHJcbiAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0gc29ydGluZyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLSAvL1xyXG5cclxuICAvKipcclxuICAgKiBAcGFyYW1zIHtBcnJheX0gZWxlbXNcclxuICAgKiBAcHVibGljXHJcbiAgICovXHJcbiAgcHJvdG8udXBkYXRlU29ydERhdGEgPSBmdW5jdGlvbiggZWxlbXMgKSB7XHJcbiAgICAvLyBnZXQgaXRlbXNcclxuICAgIHZhciBpdGVtcztcclxuICAgIGlmICggZWxlbXMgKSB7XHJcbiAgICAgIGVsZW1zID0gdXRpbHMubWFrZUFycmF5KCBlbGVtcyApO1xyXG4gICAgICBpdGVtcyA9IHRoaXMuZ2V0SXRlbXMoIGVsZW1zICk7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICAvLyB1cGRhdGUgYWxsIGl0ZW1zIGlmIG5vIGVsZW1zIHByb3ZpZGVkXHJcbiAgICAgIGl0ZW1zID0gdGhpcy5pdGVtcztcclxuICAgIH1cclxuXHJcbiAgICB0aGlzLl9nZXRTb3J0ZXJzKCk7XHJcbiAgICB0aGlzLl91cGRhdGVJdGVtc1NvcnREYXRhKCBpdGVtcyApO1xyXG4gIH07XHJcblxyXG4gIHByb3RvLl9nZXRTb3J0ZXJzID0gZnVuY3Rpb24oKSB7XHJcbiAgICB2YXIgZ2V0U29ydERhdGEgPSB0aGlzLm9wdGlvbnMuZ2V0U29ydERhdGE7XHJcbiAgICBmb3IgKCB2YXIga2V5IGluIGdldFNvcnREYXRhICkge1xyXG4gICAgICB2YXIgc29ydGVyID0gZ2V0U29ydERhdGFbIGtleSBdO1xyXG4gICAgICB0aGlzLl9zb3J0ZXJzWyBrZXkgXSA9IG11bmdlU29ydGVyKCBzb3J0ZXIgKTtcclxuICAgIH1cclxuICB9O1xyXG5cclxuICAvKipcclxuICAgKiBAcGFyYW1zIHtBcnJheX0gaXRlbXMgLSBvZiBJc290b3BlLkl0ZW1zXHJcbiAgICogQHByaXZhdGVcclxuICAgKi9cclxuICBwcm90by5fdXBkYXRlSXRlbXNTb3J0RGF0YSA9IGZ1bmN0aW9uKCBpdGVtcyApIHtcclxuICAgIC8vIGRvIG5vdCB1cGRhdGUgaWYgbm8gaXRlbXNcclxuICAgIHZhciBsZW4gPSBpdGVtcyAmJiBpdGVtcy5sZW5ndGg7XHJcblxyXG4gICAgZm9yICggdmFyIGk9MDsgbGVuICYmIGkgPCBsZW47IGkrKyApIHtcclxuICAgICAgdmFyIGl0ZW0gPSBpdGVtc1tpXTtcclxuICAgICAgaXRlbS51cGRhdGVTb3J0RGF0YSgpO1xyXG4gICAgfVxyXG4gIH07XHJcblxyXG4gIC8vIC0tLS0tIG11bmdlIHNvcnRlciAtLS0tLSAvL1xyXG5cclxuICAvLyBlbmNhcHN1bGF0ZSB0aGlzLCBhcyB3ZSBqdXN0IG5lZWQgbXVuZ2VTb3J0ZXJcclxuICAvLyBvdGhlciBmdW5jdGlvbnMgaW4gaGVyZSBhcmUganVzdCBmb3IgbXVuZ2luZ1xyXG4gIHZhciBtdW5nZVNvcnRlciA9ICggZnVuY3Rpb24oKSB7XHJcbiAgICAvLyBhZGQgYSBtYWdpYyBsYXllciB0byBzb3J0ZXJzIGZvciBjb252aWVuZW50IHNob3J0aGFuZHNcclxuICAgIC8vIGAuZm9vLWJhcmAgd2lsbCB1c2UgdGhlIHRleHQgb2YgLmZvby1iYXIgcXVlcnlTZWxlY3RvclxyXG4gICAgLy8gYFtmb28tYmFyXWAgd2lsbCB1c2UgYXR0cmlidXRlXHJcbiAgICAvLyB5b3UgY2FuIGFsc28gYWRkIHBhcnNlclxyXG4gICAgLy8gYC5mb28tYmFyIHBhcnNlSW50YCB3aWxsIHBhcnNlIHRoYXQgYXMgYSBudW1iZXJcclxuICAgIGZ1bmN0aW9uIG11bmdlU29ydGVyKCBzb3J0ZXIgKSB7XHJcbiAgICAgIC8vIGlmIG5vdCBhIHN0cmluZywgcmV0dXJuIGZ1bmN0aW9uIG9yIHdoYXRldmVyIGl0IGlzXHJcbiAgICAgIGlmICggdHlwZW9mIHNvcnRlciAhPSAnc3RyaW5nJyApIHtcclxuICAgICAgICByZXR1cm4gc29ydGVyO1xyXG4gICAgICB9XHJcbiAgICAgIC8vIHBhcnNlIHRoZSBzb3J0ZXIgc3RyaW5nXHJcbiAgICAgIHZhciBhcmdzID0gdHJpbSggc29ydGVyICkuc3BsaXQoJyAnKTtcclxuICAgICAgdmFyIHF1ZXJ5ID0gYXJnc1swXTtcclxuICAgICAgLy8gY2hlY2sgaWYgcXVlcnkgbG9va3MgbGlrZSBbYW4tYXR0cmlidXRlXVxyXG4gICAgICB2YXIgYXR0ck1hdGNoID0gcXVlcnkubWF0Y2goIC9eXFxbKC4rKVxcXSQvICk7XHJcbiAgICAgIHZhciBhdHRyID0gYXR0ck1hdGNoICYmIGF0dHJNYXRjaFsxXTtcclxuICAgICAgdmFyIGdldFZhbHVlID0gZ2V0VmFsdWVHZXR0ZXIoIGF0dHIsIHF1ZXJ5ICk7XHJcbiAgICAgIC8vIHVzZSBzZWNvbmQgYXJndW1lbnQgYXMgYSBwYXJzZXJcclxuICAgICAgdmFyIHBhcnNlciA9IElzb3RvcGUuc29ydERhdGFQYXJzZXJzWyBhcmdzWzFdIF07XHJcbiAgICAgIC8vIHBhcnNlIHRoZSB2YWx1ZSwgaWYgdGhlcmUgd2FzIGEgcGFyc2VyXHJcbiAgICAgIHNvcnRlciA9IHBhcnNlciA/IGZ1bmN0aW9uKCBlbGVtICkge1xyXG4gICAgICAgIHJldHVybiBlbGVtICYmIHBhcnNlciggZ2V0VmFsdWUoIGVsZW0gKSApO1xyXG4gICAgICB9IDpcclxuICAgICAgLy8gb3RoZXJ3aXNlIGp1c3QgcmV0dXJuIHZhbHVlXHJcbiAgICAgIGZ1bmN0aW9uKCBlbGVtICkge1xyXG4gICAgICAgIHJldHVybiBlbGVtICYmIGdldFZhbHVlKCBlbGVtICk7XHJcbiAgICAgIH07XHJcblxyXG4gICAgICByZXR1cm4gc29ydGVyO1xyXG4gICAgfVxyXG5cclxuICAgIC8vIGdldCBhbiBhdHRyaWJ1dGUgZ2V0dGVyLCBvciBnZXQgdGV4dCBvZiB0aGUgcXVlcnlTZWxlY3RvclxyXG4gICAgZnVuY3Rpb24gZ2V0VmFsdWVHZXR0ZXIoIGF0dHIsIHF1ZXJ5ICkge1xyXG4gICAgICAvLyBpZiBxdWVyeSBsb29rcyBsaWtlIFtmb28tYmFyXSwgZ2V0IGF0dHJpYnV0ZVxyXG4gICAgICBpZiAoIGF0dHIgKSB7XHJcbiAgICAgICAgcmV0dXJuIGZ1bmN0aW9uIGdldEF0dHJpYnV0ZSggZWxlbSApIHtcclxuICAgICAgICAgIHJldHVybiBlbGVtLmdldEF0dHJpYnV0ZSggYXR0ciApO1xyXG4gICAgICAgIH07XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIC8vIG90aGVyd2lzZSwgYXNzdW1lIGl0cyBhIHF1ZXJ5U2VsZWN0b3IsIGFuZCBnZXQgaXRzIHRleHRcclxuICAgICAgcmV0dXJuIGZ1bmN0aW9uIGdldENoaWxkVGV4dCggZWxlbSApIHtcclxuICAgICAgICB2YXIgY2hpbGQgPSBlbGVtLnF1ZXJ5U2VsZWN0b3IoIHF1ZXJ5ICk7XHJcbiAgICAgICAgcmV0dXJuIGNoaWxkICYmIGNoaWxkLnRleHRDb250ZW50O1xyXG4gICAgICB9O1xyXG4gICAgfVxyXG5cclxuICAgIHJldHVybiBtdW5nZVNvcnRlcjtcclxuICB9KSgpO1xyXG5cclxuICAvLyBwYXJzZXJzIHVzZWQgaW4gZ2V0U29ydERhdGEgc2hvcnRjdXQgc3RyaW5nc1xyXG4gIElzb3RvcGUuc29ydERhdGFQYXJzZXJzID0ge1xyXG4gICAgJ3BhcnNlSW50JzogZnVuY3Rpb24oIHZhbCApIHtcclxuICAgICAgcmV0dXJuIHBhcnNlSW50KCB2YWwsIDEwICk7XHJcbiAgICB9LFxyXG4gICAgJ3BhcnNlRmxvYXQnOiBmdW5jdGlvbiggdmFsICkge1xyXG4gICAgICByZXR1cm4gcGFyc2VGbG9hdCggdmFsICk7XHJcbiAgICB9XHJcbiAgfTtcclxuXHJcbiAgLy8gLS0tLS0gc29ydCBtZXRob2QgLS0tLS0gLy9cclxuXHJcbiAgLy8gc29ydCBmaWx0ZXJlZEl0ZW0gb3JkZXJcclxuICBwcm90by5fc29ydCA9IGZ1bmN0aW9uKCkge1xyXG4gICAgdmFyIHNvcnRCeU9wdCA9IHRoaXMub3B0aW9ucy5zb3J0Qnk7XHJcbiAgICBpZiAoICFzb3J0QnlPcHQgKSB7XHJcbiAgICAgIHJldHVybjtcclxuICAgIH1cclxuICAgIC8vIGNvbmNhdCBhbGwgc29ydEJ5IGFuZCBzb3J0SGlzdG9yeVxyXG4gICAgdmFyIHNvcnRCeXMgPSBbXS5jb25jYXQuYXBwbHkoIHNvcnRCeU9wdCwgdGhpcy5zb3J0SGlzdG9yeSApO1xyXG4gICAgLy8gc29ydCBtYWdpY1xyXG4gICAgdmFyIGl0ZW1Tb3J0ZXIgPSBnZXRJdGVtU29ydGVyKCBzb3J0QnlzLCB0aGlzLm9wdGlvbnMuc29ydEFzY2VuZGluZyApO1xyXG4gICAgdGhpcy5maWx0ZXJlZEl0ZW1zLnNvcnQoIGl0ZW1Tb3J0ZXIgKTtcclxuICAgIC8vIGtlZXAgdHJhY2sgb2Ygc29ydEJ5IEhpc3RvcnlcclxuICAgIGlmICggc29ydEJ5T3B0ICE9IHRoaXMuc29ydEhpc3RvcnlbMF0gKSB7XHJcbiAgICAgIC8vIGFkZCB0byBmcm9udCwgb2xkZXN0IGdvZXMgaW4gbGFzdFxyXG4gICAgICB0aGlzLnNvcnRIaXN0b3J5LnVuc2hpZnQoIHNvcnRCeU9wdCApO1xyXG4gICAgfVxyXG4gIH07XHJcblxyXG4gIC8vIHJldHVybnMgYSBmdW5jdGlvbiB1c2VkIGZvciBzb3J0aW5nXHJcbiAgZnVuY3Rpb24gZ2V0SXRlbVNvcnRlciggc29ydEJ5cywgc29ydEFzYyApIHtcclxuICAgIHJldHVybiBmdW5jdGlvbiBzb3J0ZXIoIGl0ZW1BLCBpdGVtQiApIHtcclxuICAgICAgLy8gY3ljbGUgdGhyb3VnaCBhbGwgc29ydEtleXNcclxuICAgICAgZm9yICggdmFyIGkgPSAwOyBpIDwgc29ydEJ5cy5sZW5ndGg7IGkrKyApIHtcclxuICAgICAgICB2YXIgc29ydEJ5ID0gc29ydEJ5c1tpXTtcclxuICAgICAgICB2YXIgYSA9IGl0ZW1BLnNvcnREYXRhWyBzb3J0QnkgXTtcclxuICAgICAgICB2YXIgYiA9IGl0ZW1CLnNvcnREYXRhWyBzb3J0QnkgXTtcclxuICAgICAgICBpZiAoIGEgPiBiIHx8IGEgPCBiICkge1xyXG4gICAgICAgICAgLy8gaWYgc29ydEFzYyBpcyBhbiBvYmplY3QsIHVzZSB0aGUgdmFsdWUgZ2l2ZW4gdGhlIHNvcnRCeSBrZXlcclxuICAgICAgICAgIHZhciBpc0FzY2VuZGluZyA9IHNvcnRBc2NbIHNvcnRCeSBdICE9PSB1bmRlZmluZWQgPyBzb3J0QXNjWyBzb3J0QnkgXSA6IHNvcnRBc2M7XHJcbiAgICAgICAgICB2YXIgZGlyZWN0aW9uID0gaXNBc2NlbmRpbmcgPyAxIDogLTE7XHJcbiAgICAgICAgICByZXR1cm4gKCBhID4gYiA/IDEgOiAtMSApICogZGlyZWN0aW9uO1xyXG4gICAgICAgIH1cclxuICAgICAgfVxyXG4gICAgICByZXR1cm4gMDtcclxuICAgIH07XHJcbiAgfVxyXG5cclxuICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLSBtZXRob2RzIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tIC8vXHJcblxyXG4gIC8vIGdldCBsYXlvdXQgbW9kZVxyXG4gIHByb3RvLl9tb2RlID0gZnVuY3Rpb24oKSB7XHJcbiAgICB2YXIgbGF5b3V0TW9kZSA9IHRoaXMub3B0aW9ucy5sYXlvdXRNb2RlO1xyXG4gICAgdmFyIG1vZGUgPSB0aGlzLm1vZGVzWyBsYXlvdXRNb2RlIF07XHJcbiAgICBpZiAoICFtb2RlICkge1xyXG4gICAgICAvLyBUT0RPIGNvbnNvbGUuZXJyb3JcclxuICAgICAgdGhyb3cgbmV3IEVycm9yKCAnTm8gbGF5b3V0IG1vZGU6ICcgKyBsYXlvdXRNb2RlICk7XHJcbiAgICB9XHJcbiAgICAvLyBIQUNLIHN5bmMgbW9kZSdzIG9wdGlvbnNcclxuICAgIC8vIGFueSBvcHRpb25zIHNldCBhZnRlciBpbml0IGZvciBsYXlvdXQgbW9kZSBuZWVkIHRvIGJlIHN5bmNlZFxyXG4gICAgbW9kZS5vcHRpb25zID0gdGhpcy5vcHRpb25zWyBsYXlvdXRNb2RlIF07XHJcbiAgICByZXR1cm4gbW9kZTtcclxuICB9O1xyXG5cclxuICBwcm90by5fcmVzZXRMYXlvdXQgPSBmdW5jdGlvbigpIHtcclxuICAgIC8vIHRyaWdnZXIgb3JpZ2luYWwgcmVzZXQgbGF5b3V0XHJcbiAgICBPdXRsYXllci5wcm90b3R5cGUuX3Jlc2V0TGF5b3V0LmNhbGwoIHRoaXMgKTtcclxuICAgIHRoaXMuX21vZGUoKS5fcmVzZXRMYXlvdXQoKTtcclxuICB9O1xyXG5cclxuICBwcm90by5fZ2V0SXRlbUxheW91dFBvc2l0aW9uID0gZnVuY3Rpb24oIGl0ZW0gICkge1xyXG4gICAgcmV0dXJuIHRoaXMuX21vZGUoKS5fZ2V0SXRlbUxheW91dFBvc2l0aW9uKCBpdGVtICk7XHJcbiAgfTtcclxuXHJcbiAgcHJvdG8uX21hbmFnZVN0YW1wID0gZnVuY3Rpb24oIHN0YW1wICkge1xyXG4gICAgdGhpcy5fbW9kZSgpLl9tYW5hZ2VTdGFtcCggc3RhbXAgKTtcclxuICB9O1xyXG5cclxuICBwcm90by5fZ2V0Q29udGFpbmVyU2l6ZSA9IGZ1bmN0aW9uKCkge1xyXG4gICAgcmV0dXJuIHRoaXMuX21vZGUoKS5fZ2V0Q29udGFpbmVyU2l6ZSgpO1xyXG4gIH07XHJcblxyXG4gIHByb3RvLm5lZWRzUmVzaXplTGF5b3V0ID0gZnVuY3Rpb24oKSB7XHJcbiAgICByZXR1cm4gdGhpcy5fbW9kZSgpLm5lZWRzUmVzaXplTGF5b3V0KCk7XHJcbiAgfTtcclxuXHJcbiAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0gYWRkaW5nICYgcmVtb3ZpbmcgLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0gLy9cclxuXHJcbiAgLy8gSEVBRFMgVVAgb3ZlcndyaXRlcyBkZWZhdWx0IE91dGxheWVyIGFwcGVuZGVkXHJcbiAgcHJvdG8uYXBwZW5kZWQgPSBmdW5jdGlvbiggZWxlbXMgKSB7XHJcbiAgICB2YXIgaXRlbXMgPSB0aGlzLmFkZEl0ZW1zKCBlbGVtcyApO1xyXG4gICAgaWYgKCAhaXRlbXMubGVuZ3RoICkge1xyXG4gICAgICByZXR1cm47XHJcbiAgICB9XHJcbiAgICAvLyBmaWx0ZXIsIGxheW91dCwgcmV2ZWFsIG5ldyBpdGVtc1xyXG4gICAgdmFyIGZpbHRlcmVkSXRlbXMgPSB0aGlzLl9maWx0ZXJSZXZlYWxBZGRlZCggaXRlbXMgKTtcclxuICAgIC8vIGFkZCB0byBmaWx0ZXJlZEl0ZW1zXHJcbiAgICB0aGlzLmZpbHRlcmVkSXRlbXMgPSB0aGlzLmZpbHRlcmVkSXRlbXMuY29uY2F0KCBmaWx0ZXJlZEl0ZW1zICk7XHJcbiAgfTtcclxuXHJcbiAgLy8gSEVBRFMgVVAgb3ZlcndyaXRlcyBkZWZhdWx0IE91dGxheWVyIHByZXBlbmRlZFxyXG4gIHByb3RvLnByZXBlbmRlZCA9IGZ1bmN0aW9uKCBlbGVtcyApIHtcclxuICAgIHZhciBpdGVtcyA9IHRoaXMuX2l0ZW1pemUoIGVsZW1zICk7XHJcbiAgICBpZiAoICFpdGVtcy5sZW5ndGggKSB7XHJcbiAgICAgIHJldHVybjtcclxuICAgIH1cclxuICAgIC8vIHN0YXJ0IG5ldyBsYXlvdXRcclxuICAgIHRoaXMuX3Jlc2V0TGF5b3V0KCk7XHJcbiAgICB0aGlzLl9tYW5hZ2VTdGFtcHMoKTtcclxuICAgIC8vIGZpbHRlciwgbGF5b3V0LCByZXZlYWwgbmV3IGl0ZW1zXHJcbiAgICB2YXIgZmlsdGVyZWRJdGVtcyA9IHRoaXMuX2ZpbHRlclJldmVhbEFkZGVkKCBpdGVtcyApO1xyXG4gICAgLy8gbGF5b3V0IHByZXZpb3VzIGl0ZW1zXHJcbiAgICB0aGlzLmxheW91dEl0ZW1zKCB0aGlzLmZpbHRlcmVkSXRlbXMgKTtcclxuICAgIC8vIGFkZCB0byBpdGVtcyBhbmQgZmlsdGVyZWRJdGVtc1xyXG4gICAgdGhpcy5maWx0ZXJlZEl0ZW1zID0gZmlsdGVyZWRJdGVtcy5jb25jYXQoIHRoaXMuZmlsdGVyZWRJdGVtcyApO1xyXG4gICAgdGhpcy5pdGVtcyA9IGl0ZW1zLmNvbmNhdCggdGhpcy5pdGVtcyApO1xyXG4gIH07XHJcblxyXG4gIHByb3RvLl9maWx0ZXJSZXZlYWxBZGRlZCA9IGZ1bmN0aW9uKCBpdGVtcyApIHtcclxuICAgIHZhciBmaWx0ZXJlZCA9IHRoaXMuX2ZpbHRlciggaXRlbXMgKTtcclxuICAgIHRoaXMuaGlkZSggZmlsdGVyZWQubmVlZEhpZGUgKTtcclxuICAgIC8vIHJldmVhbCBhbGwgbmV3IGl0ZW1zXHJcbiAgICB0aGlzLnJldmVhbCggZmlsdGVyZWQubWF0Y2hlcyApO1xyXG4gICAgLy8gbGF5b3V0IG5ldyBpdGVtcywgbm8gdHJhbnNpdGlvblxyXG4gICAgdGhpcy5sYXlvdXRJdGVtcyggZmlsdGVyZWQubWF0Y2hlcywgdHJ1ZSApO1xyXG4gICAgcmV0dXJuIGZpbHRlcmVkLm1hdGNoZXM7XHJcbiAgfTtcclxuXHJcbiAgLyoqXHJcbiAgICogRmlsdGVyLCBzb3J0LCBhbmQgbGF5b3V0IG5ld2x5LWFwcGVuZGVkIGl0ZW0gZWxlbWVudHNcclxuICAgKiBAcGFyYW0ge0FycmF5IG9yIE5vZGVMaXN0IG9yIEVsZW1lbnR9IGVsZW1zXHJcbiAgICovXHJcbiAgcHJvdG8uaW5zZXJ0ID0gZnVuY3Rpb24oIGVsZW1zICkge1xyXG4gICAgdmFyIGl0ZW1zID0gdGhpcy5hZGRJdGVtcyggZWxlbXMgKTtcclxuICAgIGlmICggIWl0ZW1zLmxlbmd0aCApIHtcclxuICAgICAgcmV0dXJuO1xyXG4gICAgfVxyXG4gICAgLy8gYXBwZW5kIGl0ZW0gZWxlbWVudHNcclxuICAgIHZhciBpLCBpdGVtO1xyXG4gICAgdmFyIGxlbiA9IGl0ZW1zLmxlbmd0aDtcclxuICAgIGZvciAoIGk9MDsgaSA8IGxlbjsgaSsrICkge1xyXG4gICAgICBpdGVtID0gaXRlbXNbaV07XHJcbiAgICAgIHRoaXMuZWxlbWVudC5hcHBlbmRDaGlsZCggaXRlbS5lbGVtZW50ICk7XHJcbiAgICB9XHJcbiAgICAvLyBmaWx0ZXIgbmV3IHN0dWZmXHJcbiAgICB2YXIgZmlsdGVyZWRJbnNlcnRJdGVtcyA9IHRoaXMuX2ZpbHRlciggaXRlbXMgKS5tYXRjaGVzO1xyXG4gICAgLy8gc2V0IGZsYWdcclxuICAgIGZvciAoIGk9MDsgaSA8IGxlbjsgaSsrICkge1xyXG4gICAgICBpdGVtc1tpXS5pc0xheW91dEluc3RhbnQgPSB0cnVlO1xyXG4gICAgfVxyXG4gICAgdGhpcy5hcnJhbmdlKCk7XHJcbiAgICAvLyByZXNldCBmbGFnXHJcbiAgICBmb3IgKCBpPTA7IGkgPCBsZW47IGkrKyApIHtcclxuICAgICAgZGVsZXRlIGl0ZW1zW2ldLmlzTGF5b3V0SW5zdGFudDtcclxuICAgIH1cclxuICAgIHRoaXMucmV2ZWFsKCBmaWx0ZXJlZEluc2VydEl0ZW1zICk7XHJcbiAgfTtcclxuXHJcbiAgdmFyIF9yZW1vdmUgPSBwcm90by5yZW1vdmU7XHJcbiAgcHJvdG8ucmVtb3ZlID0gZnVuY3Rpb24oIGVsZW1zICkge1xyXG4gICAgZWxlbXMgPSB1dGlscy5tYWtlQXJyYXkoIGVsZW1zICk7XHJcbiAgICB2YXIgcmVtb3ZlSXRlbXMgPSB0aGlzLmdldEl0ZW1zKCBlbGVtcyApO1xyXG4gICAgLy8gZG8gcmVndWxhciB0aGluZ1xyXG4gICAgX3JlbW92ZS5jYWxsKCB0aGlzLCBlbGVtcyApO1xyXG4gICAgLy8gYmFpbCBpZiBubyBpdGVtcyB0byByZW1vdmVcclxuICAgIHZhciBsZW4gPSByZW1vdmVJdGVtcyAmJiByZW1vdmVJdGVtcy5sZW5ndGg7XHJcbiAgICAvLyByZW1vdmUgZWxlbXMgZnJvbSBmaWx0ZXJlZEl0ZW1zXHJcbiAgICBmb3IgKCB2YXIgaT0wOyBsZW4gJiYgaSA8IGxlbjsgaSsrICkge1xyXG4gICAgICB2YXIgaXRlbSA9IHJlbW92ZUl0ZW1zW2ldO1xyXG4gICAgICAvLyByZW1vdmUgaXRlbSBmcm9tIGNvbGxlY3Rpb25cclxuICAgICAgdXRpbHMucmVtb3ZlRnJvbSggdGhpcy5maWx0ZXJlZEl0ZW1zLCBpdGVtICk7XHJcbiAgICB9XHJcbiAgfTtcclxuXHJcbiAgcHJvdG8uc2h1ZmZsZSA9IGZ1bmN0aW9uKCkge1xyXG4gICAgLy8gdXBkYXRlIHJhbmRvbSBzb3J0RGF0YVxyXG4gICAgZm9yICggdmFyIGk9MDsgaSA8IHRoaXMuaXRlbXMubGVuZ3RoOyBpKysgKSB7XHJcbiAgICAgIHZhciBpdGVtID0gdGhpcy5pdGVtc1tpXTtcclxuICAgICAgaXRlbS5zb3J0RGF0YS5yYW5kb20gPSBNYXRoLnJhbmRvbSgpO1xyXG4gICAgfVxyXG4gICAgdGhpcy5vcHRpb25zLnNvcnRCeSA9ICdyYW5kb20nO1xyXG4gICAgdGhpcy5fc29ydCgpO1xyXG4gICAgdGhpcy5fbGF5b3V0KCk7XHJcbiAgfTtcclxuXHJcbiAgLyoqXHJcbiAgICogdHJpZ2dlciBmbiB3aXRob3V0IHRyYW5zaXRpb25cclxuICAgKiBraW5kIG9mIGhhY2t5IHRvIGhhdmUgdGhpcyBpbiB0aGUgZmlyc3QgcGxhY2VcclxuICAgKiBAcGFyYW0ge0Z1bmN0aW9ufSBmblxyXG4gICAqIEBwYXJhbSB7QXJyYXl9IGFyZ3NcclxuICAgKiBAcmV0dXJucyByZXRcclxuICAgKiBAcHJpdmF0ZVxyXG4gICAqL1xyXG4gIHByb3RvLl9ub1RyYW5zaXRpb24gPSBmdW5jdGlvbiggZm4sIGFyZ3MgKSB7XHJcbiAgICAvLyBzYXZlIHRyYW5zaXRpb25EdXJhdGlvbiBiZWZvcmUgZGlzYWJsaW5nXHJcbiAgICB2YXIgdHJhbnNpdGlvbkR1cmF0aW9uID0gdGhpcy5vcHRpb25zLnRyYW5zaXRpb25EdXJhdGlvbjtcclxuICAgIC8vIGRpc2FibGUgdHJhbnNpdGlvblxyXG4gICAgdGhpcy5vcHRpb25zLnRyYW5zaXRpb25EdXJhdGlvbiA9IDA7XHJcbiAgICAvLyBkbyBpdFxyXG4gICAgdmFyIHJldHVyblZhbHVlID0gZm4uYXBwbHkoIHRoaXMsIGFyZ3MgKTtcclxuICAgIC8vIHJlLWVuYWJsZSB0cmFuc2l0aW9uIGZvciByZXZlYWxcclxuICAgIHRoaXMub3B0aW9ucy50cmFuc2l0aW9uRHVyYXRpb24gPSB0cmFuc2l0aW9uRHVyYXRpb247XHJcbiAgICByZXR1cm4gcmV0dXJuVmFsdWU7XHJcbiAgfTtcclxuXHJcbiAgLy8gLS0tLS0gaGVscGVyIG1ldGhvZHMgLS0tLS0gLy9cclxuXHJcbiAgLyoqXHJcbiAgICogZ2V0dGVyIG1ldGhvZCBmb3IgZ2V0dGluZyBmaWx0ZXJlZCBpdGVtIGVsZW1lbnRzXHJcbiAgICogQHJldHVybnMge0FycmF5fSBlbGVtcyAtIGNvbGxlY3Rpb24gb2YgaXRlbSBlbGVtZW50c1xyXG4gICAqL1xyXG4gIHByb3RvLmdldEZpbHRlcmVkSXRlbUVsZW1lbnRzID0gZnVuY3Rpb24oKSB7XHJcbiAgICByZXR1cm4gdGhpcy5maWx0ZXJlZEl0ZW1zLm1hcCggZnVuY3Rpb24oIGl0ZW0gKSB7XHJcbiAgICAgIHJldHVybiBpdGVtLmVsZW1lbnQ7XHJcbiAgICB9KTtcclxuICB9O1xyXG5cclxuICAvLyAtLS0tLSAgLS0tLS0gLy9cclxuXHJcbiAgcmV0dXJuIElzb3RvcGU7XHJcblxyXG59KSk7XHJcblxyXG4iLCIvKipcclxuICogQGxpY2Vuc2VcclxuICogbG9kYXNoIGxvZGFzaC5jb20vbGljZW5zZSB8IFVuZGVyc2NvcmUuanMgMS44LjMgdW5kZXJzY29yZWpzLm9yZy9MSUNFTlNFXHJcbiAqL1xyXG47KGZ1bmN0aW9uKCl7ZnVuY3Rpb24gdCh0LG4pe3JldHVybiB0LnNldChuWzBdLG5bMV0pLHR9ZnVuY3Rpb24gbih0LG4pe3JldHVybiB0LmFkZChuKSx0fWZ1bmN0aW9uIHIodCxuLHIpe3N3aXRjaChyLmxlbmd0aCl7Y2FzZSAwOnJldHVybiB0LmNhbGwobik7Y2FzZSAxOnJldHVybiB0LmNhbGwobixyWzBdKTtjYXNlIDI6cmV0dXJuIHQuY2FsbChuLHJbMF0sclsxXSk7Y2FzZSAzOnJldHVybiB0LmNhbGwobixyWzBdLHJbMV0sclsyXSl9cmV0dXJuIHQuYXBwbHkobixyKX1mdW5jdGlvbiBlKHQsbixyLGUpe2Zvcih2YXIgdT0tMSxvPXQ/dC5sZW5ndGg6MDsrK3U8bzspe3ZhciBpPXRbdV07bihlLGkscihpKSx0KX1yZXR1cm4gZX1mdW5jdGlvbiB1KHQsbil7Zm9yKHZhciByPS0xLGU9dD90Lmxlbmd0aDowOysrcjxlJiZmYWxzZSE9PW4odFtyXSxyLHQpOyk7cmV0dXJuIHR9ZnVuY3Rpb24gbyh0LG4pe2Zvcih2YXIgcj10P3QubGVuZ3RoOjA7ci0tJiZmYWxzZSE9PW4odFtyXSxyLHQpOyk7XHJcbnJldHVybiB0fWZ1bmN0aW9uIGkodCxuKXtmb3IodmFyIHI9LTEsZT10P3QubGVuZ3RoOjA7KytyPGU7KWlmKCFuKHRbcl0scix0KSlyZXR1cm4gZmFsc2U7cmV0dXJuIHRydWV9ZnVuY3Rpb24gZih0LG4pe2Zvcih2YXIgcj0tMSxlPXQ/dC5sZW5ndGg6MCx1PTAsbz1bXTsrK3I8ZTspe3ZhciBpPXRbcl07bihpLHIsdCkmJihvW3UrK109aSl9cmV0dXJuIG99ZnVuY3Rpb24gYyh0LG4pe3JldHVybiEoIXR8fCF0Lmxlbmd0aCkmJi0xPGQodCxuLDApfWZ1bmN0aW9uIGEodCxuLHIpe2Zvcih2YXIgZT0tMSx1PXQ/dC5sZW5ndGg6MDsrK2U8dTspaWYocihuLHRbZV0pKXJldHVybiB0cnVlO3JldHVybiBmYWxzZX1mdW5jdGlvbiBsKHQsbil7Zm9yKHZhciByPS0xLGU9dD90Lmxlbmd0aDowLHU9QXJyYXkoZSk7KytyPGU7KXVbcl09bih0W3JdLHIsdCk7cmV0dXJuIHV9ZnVuY3Rpb24gcyh0LG4pe2Zvcih2YXIgcj0tMSxlPW4ubGVuZ3RoLHU9dC5sZW5ndGg7KytyPGU7KXRbdStyXT1uW3JdO3JldHVybiB0fWZ1bmN0aW9uIGgodCxuLHIsZSl7XHJcbnZhciB1PS0xLG89dD90Lmxlbmd0aDowO2ZvcihlJiZvJiYocj10WysrdV0pOysrdTxvOylyPW4ocix0W3VdLHUsdCk7cmV0dXJuIHJ9ZnVuY3Rpb24gcCh0LG4scixlKXt2YXIgdT10P3QubGVuZ3RoOjA7Zm9yKGUmJnUmJihyPXRbLS11XSk7dS0tOylyPW4ocix0W3VdLHUsdCk7cmV0dXJuIHJ9ZnVuY3Rpb24gXyh0LG4pe2Zvcih2YXIgcj0tMSxlPXQ/dC5sZW5ndGg6MDsrK3I8ZTspaWYobih0W3JdLHIsdCkpcmV0dXJuIHRydWU7cmV0dXJuIGZhbHNlfWZ1bmN0aW9uIHYodCxuLHIpe3ZhciBlO3JldHVybiByKHQsZnVuY3Rpb24odCxyLHUpe3JldHVybiBuKHQscix1KT8oZT1yLGZhbHNlKTp2b2lkIDB9KSxlfWZ1bmN0aW9uIGcodCxuLHIsZSl7dmFyIHU9dC5sZW5ndGg7Zm9yKHIrPWU/MTotMTtlP3ItLTorK3I8dTspaWYobih0W3JdLHIsdCkpcmV0dXJuIHI7cmV0dXJuLTF9ZnVuY3Rpb24gZCh0LG4scil7aWYobiE9PW4pcmV0dXJuIE0odCxyKTstLXI7Zm9yKHZhciBlPXQubGVuZ3RoOysrcjxlOylpZih0W3JdPT09bilyZXR1cm4gcjtcclxucmV0dXJuLTF9ZnVuY3Rpb24geSh0LG4scixlKXstLXI7Zm9yKHZhciB1PXQubGVuZ3RoOysrcjx1OylpZihlKHRbcl0sbikpcmV0dXJuIHI7cmV0dXJuLTF9ZnVuY3Rpb24gYih0LG4pe3ZhciByPXQ/dC5sZW5ndGg6MDtyZXR1cm4gcj93KHQsbikvcjpWfWZ1bmN0aW9uIHgodCxuLHIsZSx1KXtyZXR1cm4gdSh0LGZ1bmN0aW9uKHQsdSxvKXtyPWU/KGU9ZmFsc2UsdCk6bihyLHQsdSxvKX0pLHJ9ZnVuY3Rpb24gaih0LG4pe3ZhciByPXQubGVuZ3RoO2Zvcih0LnNvcnQobik7ci0tOyl0W3JdPXRbcl0uYztyZXR1cm4gdH1mdW5jdGlvbiB3KHQsbil7Zm9yKHZhciByLGU9LTEsdT10Lmxlbmd0aDsrK2U8dTspe3ZhciBvPW4odFtlXSk7byE9PVQmJihyPXI9PT1UP286citvKX1yZXR1cm4gcn1mdW5jdGlvbiBtKHQsbil7Zm9yKHZhciByPS0xLGU9QXJyYXkodCk7KytyPHQ7KWVbcl09bihyKTtyZXR1cm4gZX1mdW5jdGlvbiBBKHQsbil7cmV0dXJuIGwobixmdW5jdGlvbihuKXtyZXR1cm5bbix0W25dXTtcclxufSl9ZnVuY3Rpb24gTyh0KXtyZXR1cm4gZnVuY3Rpb24obil7cmV0dXJuIHQobil9fWZ1bmN0aW9uIGsodCxuKXtyZXR1cm4gbChuLGZ1bmN0aW9uKG4pe3JldHVybiB0W25dfSl9ZnVuY3Rpb24gRSh0LG4pe3JldHVybiB0LmhhcyhuKX1mdW5jdGlvbiBTKHQsbil7Zm9yKHZhciByPS0xLGU9dC5sZW5ndGg7KytyPGUmJi0xPGQobix0W3JdLDApOyk7cmV0dXJuIHJ9ZnVuY3Rpb24gSSh0LG4pe2Zvcih2YXIgcj10Lmxlbmd0aDtyLS0mJi0xPGQobix0W3JdLDApOyk7cmV0dXJuIHJ9ZnVuY3Rpb24gUih0KXtyZXR1cm4gdCYmdC5PYmplY3Q9PT1PYmplY3Q/dDpudWxsfWZ1bmN0aW9uIFcodCl7cmV0dXJuIHp0W3RdfWZ1bmN0aW9uIEIodCl7cmV0dXJuIFV0W3RdfWZ1bmN0aW9uIEwodCl7cmV0dXJuXCJcXFxcXCIrRHRbdF19ZnVuY3Rpb24gTSh0LG4scil7dmFyIGU9dC5sZW5ndGg7Zm9yKG4rPXI/MTotMTtyP24tLTorK248ZTspe3ZhciB1PXRbbl07aWYodSE9PXUpcmV0dXJuIG59cmV0dXJuLTE7XHJcbn1mdW5jdGlvbiBDKHQpe3ZhciBuPWZhbHNlO2lmKG51bGwhPXQmJnR5cGVvZiB0LnRvU3RyaW5nIT1cImZ1bmN0aW9uXCIpdHJ5e249ISEodCtcIlwiKX1jYXRjaChyKXt9cmV0dXJuIG59ZnVuY3Rpb24geih0KXtmb3IodmFyIG4scj1bXTshKG49dC5uZXh0KCkpLmRvbmU7KXIucHVzaChuLnZhbHVlKTtyZXR1cm4gcn1mdW5jdGlvbiBVKHQpe3ZhciBuPS0xLHI9QXJyYXkodC5zaXplKTtyZXR1cm4gdC5mb3JFYWNoKGZ1bmN0aW9uKHQsZSl7clsrK25dPVtlLHRdfSkscn1mdW5jdGlvbiAkKHQsbil7Zm9yKHZhciByPS0xLGU9dC5sZW5ndGgsdT0wLG89W107KytyPGU7KXt2YXIgaT10W3JdO2khPT1uJiZcIl9fbG9kYXNoX3BsYWNlaG9sZGVyX19cIiE9PWl8fCh0W3JdPVwiX19sb2Rhc2hfcGxhY2Vob2xkZXJfX1wiLG9bdSsrXT1yKX1yZXR1cm4gb31mdW5jdGlvbiBEKHQpe3ZhciBuPS0xLHI9QXJyYXkodC5zaXplKTtyZXR1cm4gdC5mb3JFYWNoKGZ1bmN0aW9uKHQpe3JbKytuXT10fSkscn1mdW5jdGlvbiBGKHQpe1xyXG52YXIgbj0tMSxyPUFycmF5KHQuc2l6ZSk7cmV0dXJuIHQuZm9yRWFjaChmdW5jdGlvbih0KXtyWysrbl09W3QsdF19KSxyfWZ1bmN0aW9uIE4odCl7aWYoIXR8fCFXdC50ZXN0KHQpKXJldHVybiB0Lmxlbmd0aDtmb3IodmFyIG49SXQubGFzdEluZGV4PTA7SXQudGVzdCh0KTspbisrO3JldHVybiBufWZ1bmN0aW9uIFAodCl7cmV0dXJuICR0W3RdfWZ1bmN0aW9uIFooUil7ZnVuY3Rpb24gQXQodCxuKXtyZXR1cm4gUi5zZXRUaW1lb3V0LmNhbGwoS3QsdCxuKX1mdW5jdGlvbiBPdCh0KXtpZihaZSh0KSYmIXZpKHQpJiYhKHQgaW5zdGFuY2VvZiBVdCkpe2lmKHQgaW5zdGFuY2VvZiB6dClyZXR1cm4gdDtpZihSdS5jYWxsKHQsXCJfX3dyYXBwZWRfX1wiKSlyZXR1cm4gY2UodCl9cmV0dXJuIG5ldyB6dCh0KX1mdW5jdGlvbiBrdCgpe31mdW5jdGlvbiB6dCh0LG4pe3RoaXMuX193cmFwcGVkX189dCx0aGlzLl9fYWN0aW9uc19fPVtdLHRoaXMuX19jaGFpbl9fPSEhbix0aGlzLl9faW5kZXhfXz0wLFxyXG50aGlzLl9fdmFsdWVzX189VH1mdW5jdGlvbiBVdCh0KXt0aGlzLl9fd3JhcHBlZF9fPXQsdGhpcy5fX2FjdGlvbnNfXz1bXSx0aGlzLl9fZGlyX189MSx0aGlzLl9fZmlsdGVyZWRfXz1mYWxzZSx0aGlzLl9faXRlcmF0ZWVzX189W10sdGhpcy5fX3Rha2VDb3VudF9fPTQyOTQ5NjcyOTUsdGhpcy5fX3ZpZXdzX189W119ZnVuY3Rpb24gJHQodCl7dmFyIG49LTEscj10P3QubGVuZ3RoOjA7Zm9yKHRoaXMuY2xlYXIoKTsrK248cjspe3ZhciBlPXRbbl07dGhpcy5zZXQoZVswXSxlWzFdKX19ZnVuY3Rpb24gRHQodCl7dmFyIG49LTEscj10P3QubGVuZ3RoOjA7Zm9yKHRoaXMuY2xlYXIoKTsrK248cjspe3ZhciBlPXRbbl07dGhpcy5zZXQoZVswXSxlWzFdKX19ZnVuY3Rpb24gUHQodCl7dmFyIG49LTEscj10P3QubGVuZ3RoOjA7Zm9yKHRoaXMuY2xlYXIoKTsrK248cjspe3ZhciBlPXRbbl07dGhpcy5zZXQoZVswXSxlWzFdKX19ZnVuY3Rpb24gWnQodCl7dmFyIG49LTEscj10P3QubGVuZ3RoOjA7XHJcbmZvcih0aGlzLl9fZGF0YV9fPW5ldyBQdDsrK248cjspdGhpcy5hZGQodFtuXSl9ZnVuY3Rpb24gcXQodCl7dGhpcy5fX2RhdGFfXz1uZXcgRHQodCl9ZnVuY3Rpb24gVnQodCxuLHIsZSl7cmV0dXJuIHQ9PT1UfHxNZSh0LE91W3JdKSYmIVJ1LmNhbGwoZSxyKT9uOnR9ZnVuY3Rpb24gSnQodCxuLHIpeyhyPT09VHx8TWUodFtuXSxyKSkmJih0eXBlb2YgbiE9XCJudW1iZXJcInx8ciE9PVR8fG4gaW4gdCl8fCh0W25dPXIpfWZ1bmN0aW9uIFl0KHQsbixyKXt2YXIgZT10W25dO1J1LmNhbGwodCxuKSYmTWUoZSxyKSYmKHIhPT1UfHxuIGluIHQpfHwodFtuXT1yKX1mdW5jdGlvbiBIdCh0LG4pe2Zvcih2YXIgcj10Lmxlbmd0aDtyLS07KWlmKE1lKHRbcl1bMF0sbikpcmV0dXJuIHI7cmV0dXJuLTF9ZnVuY3Rpb24gUXQodCxuLHIsZSl7cmV0dXJuIG1vKHQsZnVuY3Rpb24odCx1LG8pe24oZSx0LHIodCksbyl9KSxlfWZ1bmN0aW9uIFh0KHQsbil7cmV0dXJuIHQmJnNyKG4sb3UobiksdCl9XHJcbmZ1bmN0aW9uIHRuKHQsbil7Zm9yKHZhciByPS0xLGU9bnVsbD09dCx1PW4ubGVuZ3RoLG89QXJyYXkodSk7KytyPHU7KW9bcl09ZT9UOmV1KHQsbltyXSk7cmV0dXJuIG99ZnVuY3Rpb24gbm4odCxuLHIpe3JldHVybiB0PT09dCYmKHIhPT1UJiYodD1yPj10P3Q6ciksbiE9PVQmJih0PXQ+PW4/dDpuKSksdH1mdW5jdGlvbiBybih0LG4scixlLG8saSxmKXt2YXIgYztpZihlJiYoYz1pP2UodCxvLGksZik6ZSh0KSksYyE9PVQpcmV0dXJuIGM7aWYoIVBlKHQpKXJldHVybiB0O2lmKG89dmkodCkpe2lmKGM9VnIodCksIW4pcmV0dXJuIGxyKHQsYyl9ZWxzZXt2YXIgYT1Ucih0KSxsPVwiW29iamVjdCBGdW5jdGlvbl1cIj09YXx8XCJbb2JqZWN0IEdlbmVyYXRvckZ1bmN0aW9uXVwiPT1hO2lmKGdpKHQpKXJldHVybiBvcih0LG4pO2lmKFwiW29iamVjdCBPYmplY3RdXCI9PWF8fFwiW29iamVjdCBBcmd1bWVudHNdXCI9PWF8fGwmJiFpKXtpZihDKHQpKXJldHVybiBpP3Q6e307aWYoYz1LcihsP3t9OnQpLFxyXG4hbilyZXR1cm4gaHIodCxYdChjLHQpKX1lbHNle2lmKCFDdFthXSlyZXR1cm4gaT90Ont9O2M9R3IodCxhLHJuLG4pfX1pZihmfHwoZj1uZXcgcXQpLGk9Zi5nZXQodCkpcmV0dXJuIGk7aWYoZi5zZXQodCxjKSwhbyl2YXIgcz1yP2duKHQsb3UsWnIpOm91KHQpO3JldHVybiB1KHN8fHQsZnVuY3Rpb24odSxvKXtzJiYobz11LHU9dFtvXSksWXQoYyxvLHJuKHUsbixyLGUsbyx0LGYpKX0pLGN9ZnVuY3Rpb24gZW4odCl7dmFyIG49b3UodCkscj1uLmxlbmd0aDtyZXR1cm4gZnVuY3Rpb24oZSl7aWYobnVsbD09ZSlyZXR1cm4hcjtmb3IodmFyIHU9cjt1LS07KXt2YXIgbz1uW3VdLGk9dFtvXSxmPWVbb107aWYoZj09PVQmJiEobyBpbiBPYmplY3QoZSkpfHwhaShmKSlyZXR1cm4gZmFsc2V9cmV0dXJuIHRydWV9fWZ1bmN0aW9uIHVuKHQpe3JldHVybiBQZSh0KT9adSh0KTp7fX1mdW5jdGlvbiBvbih0LG4scil7aWYodHlwZW9mIHQhPVwiZnVuY3Rpb25cIil0aHJvdyBuZXcgbXUoXCJFeHBlY3RlZCBhIGZ1bmN0aW9uXCIpO1xyXG5yZXR1cm4gQXQoZnVuY3Rpb24oKXt0LmFwcGx5KFQscil9LG4pfWZ1bmN0aW9uIGZuKHQsbixyLGUpe3ZhciB1PS0xLG89YyxpPXRydWUsZj10Lmxlbmd0aCxzPVtdLGg9bi5sZW5ndGg7aWYoIWYpcmV0dXJuIHM7ciYmKG49bChuLE8ocikpKSxlPyhvPWEsaT1mYWxzZSk6bi5sZW5ndGg+PTIwMCYmKG89RSxpPWZhbHNlLG49bmV3IFp0KG4pKTt0OmZvcig7Kyt1PGY7KXt2YXIgcD10W3VdLF89cj9yKHApOnAscD1lfHwwIT09cD9wOjA7aWYoaSYmXz09PV8pe2Zvcih2YXIgdj1oO3YtLTspaWYoblt2XT09PV8pY29udGludWUgdDtzLnB1c2gocCl9ZWxzZSBvKG4sXyxlKXx8cy5wdXNoKHApfXJldHVybiBzfWZ1bmN0aW9uIGNuKHQsbil7dmFyIHI9dHJ1ZTtyZXR1cm4gbW8odCxmdW5jdGlvbih0LGUsdSl7cmV0dXJuIHI9ISFuKHQsZSx1KX0pLHJ9ZnVuY3Rpb24gYW4odCxuLHIpe2Zvcih2YXIgZT0tMSx1PXQubGVuZ3RoOysrZTx1Oyl7dmFyIG89dFtlXSxpPW4obyk7aWYobnVsbCE9aSYmKGY9PT1UP2k9PT1pJiYhR2UoaSk6cihpLGYpKSl2YXIgZj1pLGM9bztcclxufXJldHVybiBjfWZ1bmN0aW9uIGxuKHQsbil7dmFyIHI9W107cmV0dXJuIG1vKHQsZnVuY3Rpb24odCxlLHUpe24odCxlLHUpJiZyLnB1c2godCl9KSxyfWZ1bmN0aW9uIHNuKHQsbixyLGUsdSl7dmFyIG89LTEsaT10Lmxlbmd0aDtmb3Iocnx8KHI9WXIpLHV8fCh1PVtdKTsrK288aTspe3ZhciBmPXRbb107bj4wJiZyKGYpP24+MT9zbihmLG4tMSxyLGUsdSk6cyh1LGYpOmV8fCh1W3UubGVuZ3RoXT1mKX1yZXR1cm4gdX1mdW5jdGlvbiBobih0LG4pe3JldHVybiB0JiZPbyh0LG4sb3UpfWZ1bmN0aW9uIHBuKHQsbil7cmV0dXJuIHQmJmtvKHQsbixvdSl9ZnVuY3Rpb24gX24odCxuKXtyZXR1cm4gZihuLGZ1bmN0aW9uKG4pe3JldHVybiBEZSh0W25dKX0pfWZ1bmN0aW9uIHZuKHQsbil7bj10ZShuLHQpP1tuXTplcihuKTtmb3IodmFyIHI9MCxlPW4ubGVuZ3RoO251bGwhPXQmJmU+cjspdD10W2llKG5bcisrXSldO3JldHVybiByJiZyPT1lP3Q6VH1mdW5jdGlvbiBnbih0LG4scil7XHJcbnJldHVybiBuPW4odCksdmkodCk/bjpzKG4scih0KSl9ZnVuY3Rpb24gZG4odCxuKXtyZXR1cm4gdD5ufWZ1bmN0aW9uIHluKHQsbil7cmV0dXJuIG51bGwhPXQmJihSdS5jYWxsKHQsbil8fHR5cGVvZiB0PT1cIm9iamVjdFwiJiZuIGluIHQmJm51bGw9PT1HdShPYmplY3QodCkpKX1mdW5jdGlvbiBibih0LG4pe3JldHVybiBudWxsIT10JiZuIGluIE9iamVjdCh0KX1mdW5jdGlvbiB4bih0LG4scil7Zm9yKHZhciBlPXI/YTpjLHU9dFswXS5sZW5ndGgsbz10Lmxlbmd0aCxpPW8sZj1BcnJheShvKSxzPTEvMCxoPVtdO2ktLTspe3ZhciBwPXRbaV07aSYmbiYmKHA9bChwLE8obikpKSxzPVh1KHAubGVuZ3RoLHMpLGZbaV09IXImJihufHx1Pj0xMjAmJnAubGVuZ3RoPj0xMjApP25ldyBadChpJiZwKTpUfXZhciBwPXRbMF0sXz0tMSx2PWZbMF07dDpmb3IoOysrXzx1JiZzPmgubGVuZ3RoOyl7dmFyIGc9cFtfXSxkPW4/bihnKTpnLGc9cnx8MCE9PWc/ZzowO2lmKHY/IUUodixkKTohZShoLGQscikpe1xyXG5mb3IoaT1vOy0taTspe3ZhciB5PWZbaV07aWYoeT8hRSh5LGQpOiFlKHRbaV0sZCxyKSljb250aW51ZSB0fXYmJnYucHVzaChkKSxoLnB1c2goZyl9fXJldHVybiBofWZ1bmN0aW9uIGpuKHQsbixyKXt2YXIgZT17fTtyZXR1cm4gaG4odCxmdW5jdGlvbih0LHUsbyl7bihlLHIodCksdSxvKX0pLGV9ZnVuY3Rpb24gd24odCxuLGUpe3JldHVybiB0ZShuLHQpfHwobj1lcihuKSx0PW9lKHQsbiksbj1fZShuKSksbj1udWxsPT10P3Q6dFtpZShuKV0sbnVsbD09bj9UOnIobix0LGUpfWZ1bmN0aW9uIG1uKHQsbixyLGUsdSl7aWYodD09PW4pbj10cnVlO2Vsc2UgaWYobnVsbD09dHx8bnVsbD09bnx8IVBlKHQpJiYhWmUobikpbj10IT09dCYmbiE9PW47ZWxzZSB0Ont2YXIgbz12aSh0KSxpPXZpKG4pLGY9XCJbb2JqZWN0IEFycmF5XVwiLGM9XCJbb2JqZWN0IEFycmF5XVwiO298fChmPVRyKHQpLGY9XCJbb2JqZWN0IEFyZ3VtZW50c11cIj09Zj9cIltvYmplY3QgT2JqZWN0XVwiOmYpLGl8fChjPVRyKG4pLFxyXG5jPVwiW29iamVjdCBBcmd1bWVudHNdXCI9PWM/XCJbb2JqZWN0IE9iamVjdF1cIjpjKTt2YXIgYT1cIltvYmplY3QgT2JqZWN0XVwiPT1mJiYhQyh0KSxpPVwiW29iamVjdCBPYmplY3RdXCI9PWMmJiFDKG4pO2lmKChjPWY9PWMpJiYhYSl1fHwodT1uZXcgcXQpLG49b3x8SmUodCk/Q3IodCxuLG1uLHIsZSx1KTp6cih0LG4sZixtbixyLGUsdSk7ZWxzZXtpZighKDImZSkmJihvPWEmJlJ1LmNhbGwodCxcIl9fd3JhcHBlZF9fXCIpLGY9aSYmUnUuY2FsbChuLFwiX193cmFwcGVkX19cIiksb3x8Zikpe3Q9bz90LnZhbHVlKCk6dCxuPWY/bi52YWx1ZSgpOm4sdXx8KHU9bmV3IHF0KSxuPW1uKHQsbixyLGUsdSk7YnJlYWsgdH1pZihjKW46aWYodXx8KHU9bmV3IHF0KSxvPTImZSxmPW91KHQpLGk9Zi5sZW5ndGgsYz1vdShuKS5sZW5ndGgsaT09Y3x8byl7Zm9yKGE9aTthLS07KXt2YXIgbD1mW2FdO2lmKCEobz9sIGluIG46eW4obixsKSkpe249ZmFsc2U7YnJlYWsgbn19aWYoYz11LmdldCh0KSluPWM9PW47ZWxzZXtcclxuYz10cnVlLHUuc2V0KHQsbik7Zm9yKHZhciBzPW87KythPGk7KXt2YXIgbD1mW2FdLGg9dFtsXSxwPW5bbF07aWYocil2YXIgXz1vP3IocCxoLGwsbix0LHUpOnIoaCxwLGwsdCxuLHUpO2lmKF89PT1UP2ghPT1wJiYhbW4oaCxwLHIsZSx1KTohXyl7Yz1mYWxzZTticmVha31zfHwocz1cImNvbnN0cnVjdG9yXCI9PWwpfWMmJiFzJiYocj10LmNvbnN0cnVjdG9yLGU9bi5jb25zdHJ1Y3RvcixyIT1lJiZcImNvbnN0cnVjdG9yXCJpbiB0JiZcImNvbnN0cnVjdG9yXCJpbiBuJiYhKHR5cGVvZiByPT1cImZ1bmN0aW9uXCImJnIgaW5zdGFuY2VvZiByJiZ0eXBlb2YgZT09XCJmdW5jdGlvblwiJiZlIGluc3RhbmNlb2YgZSkmJihjPWZhbHNlKSksdVtcImRlbGV0ZVwiXSh0KSxuPWN9fWVsc2Ugbj1mYWxzZTtlbHNlIG49ZmFsc2V9fXJldHVybiBufWZ1bmN0aW9uIEFuKHQsbixyLGUpe3ZhciB1PXIubGVuZ3RoLG89dSxpPSFlO2lmKG51bGw9PXQpcmV0dXJuIW87Zm9yKHQ9T2JqZWN0KHQpO3UtLTspe3ZhciBmPXJbdV07aWYoaSYmZlsyXT9mWzFdIT09dFtmWzBdXTohKGZbMF1pbiB0KSlyZXR1cm4gZmFsc2U7XHJcbn1mb3IoOysrdTxvOyl7dmFyIGY9clt1XSxjPWZbMF0sYT10W2NdLGw9ZlsxXTtpZihpJiZmWzJdKXtpZihhPT09VCYmIShjIGluIHQpKXJldHVybiBmYWxzZX1lbHNle2lmKGY9bmV3IHF0LGUpdmFyIHM9ZShhLGwsYyx0LG4sZik7aWYocz09PVQ/IW1uKGwsYSxlLDMsZik6IXMpcmV0dXJuIGZhbHNlfX1yZXR1cm4gdHJ1ZX1mdW5jdGlvbiBPbih0KXtyZXR1cm4hUGUodCl8fFN1JiZTdSBpbiB0P2ZhbHNlOihEZSh0KXx8Qyh0KT9DdTp5dCkudGVzdChmZSh0KSl9ZnVuY3Rpb24ga24odCl7cmV0dXJuIHR5cGVvZiB0PT1cImZ1bmN0aW9uXCI/dDpudWxsPT10P2h1OnR5cGVvZiB0PT1cIm9iamVjdFwiP3ZpKHQpP1duKHRbMF0sdFsxXSk6Um4odCk6Z3UodCl9ZnVuY3Rpb24gRW4odCl7dD1udWxsPT10P3Q6T2JqZWN0KHQpO3ZhciBuLHI9W107Zm9yKG4gaW4gdClyLnB1c2gobik7cmV0dXJuIHJ9ZnVuY3Rpb24gU24odCxuKXtyZXR1cm4gbj50fWZ1bmN0aW9uIEluKHQsbil7dmFyIHI9LTEsZT16ZSh0KT9BcnJheSh0Lmxlbmd0aCk6W107XHJcbnJldHVybiBtbyh0LGZ1bmN0aW9uKHQsdSxvKXtlWysrcl09bih0LHUsbyl9KSxlfWZ1bmN0aW9uIFJuKHQpe3ZhciBuPU5yKHQpO3JldHVybiAxPT1uLmxlbmd0aCYmblswXVsyXT9lZShuWzBdWzBdLG5bMF1bMV0pOmZ1bmN0aW9uKHIpe3JldHVybiByPT09dHx8QW4ocix0LG4pfX1mdW5jdGlvbiBXbih0LG4pe3JldHVybiB0ZSh0KSYmbj09PW4mJiFQZShuKT9lZShpZSh0KSxuKTpmdW5jdGlvbihyKXt2YXIgZT1ldShyLHQpO3JldHVybiBlPT09VCYmZT09PW4/dXUocix0KTptbihuLGUsVCwzKX19ZnVuY3Rpb24gQm4odCxuLHIsZSxvKXtpZih0IT09bil7aWYoIXZpKG4pJiYhSmUobikpdmFyIGk9aXUobik7dShpfHxuLGZ1bmN0aW9uKHUsZil7aWYoaSYmKGY9dSx1PW5bZl0pLFBlKHUpKXtvfHwobz1uZXcgcXQpO3ZhciBjPWYsYT1vLGw9dFtjXSxzPW5bY10saD1hLmdldChzKTtpZihoKUp0KHQsYyxoKTtlbHNle3ZhciBoPWU/ZShsLHMsYytcIlwiLHQsbixhKTpULHA9aD09PVQ7cCYmKGg9cyxcclxudmkocyl8fEplKHMpP3ZpKGwpP2g9bDpVZShsKT9oPWxyKGwpOihwPWZhbHNlLGg9cm4ocyx0cnVlKSk6cWUocyl8fENlKHMpP0NlKGwpP2g9bnUobCk6IVBlKGwpfHxyJiZEZShsKT8ocD1mYWxzZSxoPXJuKHMsdHJ1ZSkpOmg9bDpwPWZhbHNlKSxhLnNldChzLGgpLHAmJkJuKGgscyxyLGUsYSksYVtcImRlbGV0ZVwiXShzKSxKdCh0LGMsaCl9fWVsc2UgYz1lP2UodFtmXSx1LGYrXCJcIix0LG4sbyk6VCxjPT09VCYmKGM9dSksSnQodCxmLGMpfSl9fWZ1bmN0aW9uIExuKHQsbil7dmFyIHI9dC5sZW5ndGg7cmV0dXJuIHI/KG4rPTA+bj9yOjAsUXIobixyKT90W25dOlQpOnZvaWQgMH1mdW5jdGlvbiBNbih0LG4scil7dmFyIGU9LTE7cmV0dXJuIG49bChuLmxlbmd0aD9uOltodV0sTyhEcigpKSksdD1Jbih0LGZ1bmN0aW9uKHQpe3JldHVybnthOmwobixmdW5jdGlvbihuKXtyZXR1cm4gbih0KX0pLGI6KytlLGM6dH19KSxqKHQsZnVuY3Rpb24odCxuKXt2YXIgZTt0OntlPS0xO2Zvcih2YXIgdT10LmEsbz1uLmEsaT11Lmxlbmd0aCxmPXIubGVuZ3RoOysrZTxpOyl7XHJcbnZhciBjPWZyKHVbZV0sb1tlXSk7aWYoYyl7ZT1lPj1mP2M6YyooXCJkZXNjXCI9PXJbZV0/LTE6MSk7YnJlYWsgdH19ZT10LmItbi5ifXJldHVybiBlfSl9ZnVuY3Rpb24gQ24odCxuKXtyZXR1cm4gdD1PYmplY3QodCksaChuLGZ1bmN0aW9uKG4scil7cmV0dXJuIHIgaW4gdCYmKG5bcl09dFtyXSksbn0se30pfWZ1bmN0aW9uIHpuKHQsbil7Zm9yKHZhciByPS0xLGU9Z24odCxpdSxXbyksdT1lLmxlbmd0aCxvPXt9Oysrcjx1Oyl7dmFyIGk9ZVtyXSxmPXRbaV07bihmLGkpJiYob1tpXT1mKX1yZXR1cm4gb31mdW5jdGlvbiBVbih0KXtyZXR1cm4gZnVuY3Rpb24obil7cmV0dXJuIG51bGw9PW4/VDpuW3RdfX1mdW5jdGlvbiAkbih0KXtyZXR1cm4gZnVuY3Rpb24obil7cmV0dXJuIHZuKG4sdCl9fWZ1bmN0aW9uIERuKHQsbixyLGUpe3ZhciB1PWU/eTpkLG89LTEsaT1uLmxlbmd0aCxmPXQ7Zm9yKHQ9PT1uJiYobj1scihuKSksciYmKGY9bCh0LE8ocikpKTsrK288aTspZm9yKHZhciBjPTAsYT1uW29dLGE9cj9yKGEpOmE7LTE8KGM9dShmLGEsYyxlKSk7KWYhPT10JiZxdS5jYWxsKGYsYywxKSxcclxucXUuY2FsbCh0LGMsMSk7cmV0dXJuIHR9ZnVuY3Rpb24gRm4odCxuKXtmb3IodmFyIHI9dD9uLmxlbmd0aDowLGU9ci0xO3ItLTspe3ZhciB1PW5bcl07aWYocj09ZXx8dSE9PW8pe3ZhciBvPXU7aWYoUXIodSkpcXUuY2FsbCh0LHUsMSk7ZWxzZSBpZih0ZSh1LHQpKWRlbGV0ZSB0W2llKHUpXTtlbHNle3ZhciB1PWVyKHUpLGk9b2UodCx1KTtudWxsIT1pJiZkZWxldGUgaVtpZShfZSh1KSldfX19fWZ1bmN0aW9uIE5uKHQsbil7cmV0dXJuIHQrS3Uobm8oKSoobi10KzEpKX1mdW5jdGlvbiBQbih0LG4pe3ZhciByPVwiXCI7aWYoIXR8fDE+bnx8bj45MDA3MTk5MjU0NzQwOTkxKXJldHVybiByO2RvIG4lMiYmKHIrPXQpLChuPUt1KG4vMikpJiYodCs9dCk7d2hpbGUobik7cmV0dXJuIHJ9ZnVuY3Rpb24gWm4odCxuLHIsZSl7bj10ZShuLHQpP1tuXTplcihuKTtmb3IodmFyIHU9LTEsbz1uLmxlbmd0aCxpPW8tMSxmPXQ7bnVsbCE9ZiYmKyt1PG87KXt2YXIgYz1pZShuW3VdKTtpZihQZShmKSl7XHJcbnZhciBhPXI7aWYodSE9aSl7dmFyIGw9ZltjXSxhPWU/ZShsLGMsZik6VDthPT09VCYmKGE9bnVsbD09bD9RcihuW3UrMV0pP1tdOnt9OmwpfVl0KGYsYyxhKX1mPWZbY119cmV0dXJuIHR9ZnVuY3Rpb24gVG4odCxuLHIpe3ZhciBlPS0xLHU9dC5sZW5ndGg7Zm9yKDA+biYmKG49LW4+dT8wOnUrbikscj1yPnU/dTpyLDA+ciYmKHIrPXUpLHU9bj5yPzA6ci1uPj4+MCxuPj4+PTAscj1BcnJheSh1KTsrK2U8dTspcltlXT10W2Urbl07cmV0dXJuIHJ9ZnVuY3Rpb24gcW4odCxuKXt2YXIgcjtyZXR1cm4gbW8odCxmdW5jdGlvbih0LGUsdSl7cmV0dXJuIHI9bih0LGUsdSksIXJ9KSwhIXJ9ZnVuY3Rpb24gVm4odCxuLHIpe3ZhciBlPTAsdT10P3QubGVuZ3RoOmU7aWYodHlwZW9mIG49PVwibnVtYmVyXCImJm49PT1uJiYyMTQ3NDgzNjQ3Pj11KXtmb3IoO3U+ZTspe3ZhciBvPWUrdT4+PjEsaT10W29dO251bGwhPT1pJiYhR2UoaSkmJihyP24+PWk6bj5pKT9lPW8rMTp1PW99cmV0dXJuIHV9XHJcbnJldHVybiBLbih0LG4saHUscil9ZnVuY3Rpb24gS24odCxuLHIsZSl7bj1yKG4pO2Zvcih2YXIgdT0wLG89dD90Lmxlbmd0aDowLGk9biE9PW4sZj1udWxsPT09bixjPUdlKG4pLGE9bj09PVQ7bz51Oyl7dmFyIGw9S3UoKHUrbykvMikscz1yKHRbbF0pLGg9cyE9PVQscD1udWxsPT09cyxfPXM9PT1zLHY9R2Uocyk7KGk/ZXx8XzphP18mJihlfHxoKTpmP18mJmgmJihlfHwhcCk6Yz9fJiZoJiYhcCYmKGV8fCF2KTpwfHx2PzA6ZT9uPj1zOm4+cyk/dT1sKzE6bz1sfXJldHVybiBYdShvLDQyOTQ5NjcyOTQpfWZ1bmN0aW9uIEduKHQsbil7Zm9yKHZhciByPS0xLGU9dC5sZW5ndGgsdT0wLG89W107KytyPGU7KXt2YXIgaT10W3JdLGY9bj9uKGkpOmk7aWYoIXJ8fCFNZShmLGMpKXt2YXIgYz1mO29bdSsrXT0wPT09aT8wOml9fXJldHVybiBvfWZ1bmN0aW9uIEpuKHQpe3JldHVybiB0eXBlb2YgdD09XCJudW1iZXJcIj90OkdlKHQpP1Y6K3R9ZnVuY3Rpb24gWW4odCl7aWYodHlwZW9mIHQ9PVwic3RyaW5nXCIpcmV0dXJuIHQ7XHJcbmlmKEdlKHQpKXJldHVybiB3bz93by5jYWxsKHQpOlwiXCI7dmFyIG49dCtcIlwiO3JldHVyblwiMFwiPT1uJiYxL3Q9PS1xP1wiLTBcIjpufWZ1bmN0aW9uIEhuKHQsbixyKXt2YXIgZT0tMSx1PWMsbz10Lmxlbmd0aCxpPXRydWUsZj1bXSxsPWY7aWYocilpPWZhbHNlLHU9YTtlbHNlIGlmKG8+PTIwMCl7aWYodT1uP251bGw6U28odCkpcmV0dXJuIEQodSk7aT1mYWxzZSx1PUUsbD1uZXcgWnR9ZWxzZSBsPW4/W106Zjt0OmZvcig7KytlPG87KXt2YXIgcz10W2VdLGg9bj9uKHMpOnMscz1yfHwwIT09cz9zOjA7aWYoaSYmaD09PWgpe2Zvcih2YXIgcD1sLmxlbmd0aDtwLS07KWlmKGxbcF09PT1oKWNvbnRpbnVlIHQ7biYmbC5wdXNoKGgpLGYucHVzaChzKX1lbHNlIHUobCxoLHIpfHwobCE9PWYmJmwucHVzaChoKSxmLnB1c2gocykpfXJldHVybiBmfWZ1bmN0aW9uIFFuKHQsbixyLGUpe2Zvcih2YXIgdT10Lmxlbmd0aCxvPWU/dTotMTsoZT9vLS06KytvPHUpJiZuKHRbb10sbyx0KTspO3JldHVybiByP1RuKHQsZT8wOm8sZT9vKzE6dSk6VG4odCxlP28rMTowLGU/dTpvKTtcclxufWZ1bmN0aW9uIFhuKHQsbil7dmFyIHI9dDtyZXR1cm4gciBpbnN0YW5jZW9mIFV0JiYocj1yLnZhbHVlKCkpLGgobixmdW5jdGlvbih0LG4pe3JldHVybiBuLmZ1bmMuYXBwbHkobi50aGlzQXJnLHMoW3RdLG4uYXJncykpfSxyKX1mdW5jdGlvbiB0cih0LG4scil7Zm9yKHZhciBlPS0xLHU9dC5sZW5ndGg7KytlPHU7KXZhciBvPW8/cyhmbihvLHRbZV0sbixyKSxmbih0W2VdLG8sbixyKSk6dFtlXTtyZXR1cm4gbyYmby5sZW5ndGg/SG4obyxuLHIpOltdfWZ1bmN0aW9uIG5yKHQsbixyKXtmb3IodmFyIGU9LTEsdT10Lmxlbmd0aCxvPW4ubGVuZ3RoLGk9e307KytlPHU7KXIoaSx0W2VdLG8+ZT9uW2VdOlQpO3JldHVybiBpfWZ1bmN0aW9uIHJyKHQpe3JldHVybiBVZSh0KT90OltdfWZ1bmN0aW9uIGVyKHQpe3JldHVybiB2aSh0KT90Ok1vKHQpfWZ1bmN0aW9uIHVyKHQsbixyKXt2YXIgZT10Lmxlbmd0aDtyZXR1cm4gcj1yPT09VD9lOnIsIW4mJnI+PWU/dDpUbih0LG4scil9ZnVuY3Rpb24gb3IodCxuKXtcclxuaWYobilyZXR1cm4gdC5zbGljZSgpO3ZhciByPW5ldyB0LmNvbnN0cnVjdG9yKHQubGVuZ3RoKTtyZXR1cm4gdC5jb3B5KHIpLHJ9ZnVuY3Rpb24gaXIodCl7dmFyIG49bmV3IHQuY29uc3RydWN0b3IodC5ieXRlTGVuZ3RoKTtyZXR1cm4gbmV3IER1KG4pLnNldChuZXcgRHUodCkpLG59ZnVuY3Rpb24gZnIodCxuKXtpZih0IT09bil7dmFyIHI9dCE9PVQsZT1udWxsPT09dCx1PXQ9PT10LG89R2UodCksaT1uIT09VCxmPW51bGw9PT1uLGM9bj09PW4sYT1HZShuKTtpZighZiYmIWEmJiFvJiZ0Pm58fG8mJmkmJmMmJiFmJiYhYXx8ZSYmaSYmY3x8IXImJmN8fCF1KXJldHVybiAxO2lmKCFlJiYhbyYmIWEmJm4+dHx8YSYmciYmdSYmIWUmJiFvfHxmJiZyJiZ1fHwhaSYmdXx8IWMpcmV0dXJuLTF9cmV0dXJuIDB9ZnVuY3Rpb24gY3IodCxuLHIsZSl7dmFyIHU9LTEsbz10Lmxlbmd0aCxpPXIubGVuZ3RoLGY9LTEsYz1uLmxlbmd0aCxhPVF1KG8taSwwKSxsPUFycmF5KGMrYSk7Zm9yKGU9IWU7KytmPGM7KWxbZl09bltmXTtcclxuZm9yKDsrK3U8aTspKGV8fG8+dSkmJihsW3JbdV1dPXRbdV0pO2Zvcig7YS0tOylsW2YrK109dFt1KytdO3JldHVybiBsfWZ1bmN0aW9uIGFyKHQsbixyLGUpe3ZhciB1PS0xLG89dC5sZW5ndGgsaT0tMSxmPXIubGVuZ3RoLGM9LTEsYT1uLmxlbmd0aCxsPVF1KG8tZiwwKSxzPUFycmF5KGwrYSk7Zm9yKGU9IWU7Kyt1PGw7KXNbdV09dFt1XTtmb3IobD11OysrYzxhOylzW2wrY109bltjXTtmb3IoOysraTxmOykoZXx8bz51KSYmKHNbbCtyW2ldXT10W3UrK10pO3JldHVybiBzfWZ1bmN0aW9uIGxyKHQsbil7dmFyIHI9LTEsZT10Lmxlbmd0aDtmb3Iobnx8KG49QXJyYXkoZSkpOysrcjxlOyluW3JdPXRbcl07cmV0dXJuIG59ZnVuY3Rpb24gc3IodCxuLHIsZSl7cnx8KHI9e30pO2Zvcih2YXIgdT0tMSxvPW4ubGVuZ3RoOysrdTxvOyl7dmFyIGk9blt1XSxmPWU/ZShyW2ldLHRbaV0saSxyLHQpOnRbaV07WXQocixpLGYpfXJldHVybiByfWZ1bmN0aW9uIGhyKHQsbil7cmV0dXJuIHNyKHQsWnIodCksbik7XHJcbn1mdW5jdGlvbiBwcih0LG4pe3JldHVybiBmdW5jdGlvbihyLHUpe3ZhciBvPXZpKHIpP2U6UXQsaT1uP24oKTp7fTtyZXR1cm4gbyhyLHQsRHIodSksaSl9fWZ1bmN0aW9uIF9yKHQpe3JldHVybiBMZShmdW5jdGlvbihuLHIpe3ZhciBlPS0xLHU9ci5sZW5ndGgsbz11PjE/clt1LTFdOlQsaT11PjI/clsyXTpULG89dC5sZW5ndGg+MyYmdHlwZW9mIG89PVwiZnVuY3Rpb25cIj8odS0tLG8pOlQ7Zm9yKGkmJlhyKHJbMF0sclsxXSxpKSYmKG89Mz51P1Q6byx1PTEpLG49T2JqZWN0KG4pOysrZTx1OykoaT1yW2VdKSYmdChuLGksZSxvKTtyZXR1cm4gbn0pfWZ1bmN0aW9uIHZyKHQsbil7cmV0dXJuIGZ1bmN0aW9uKHIsZSl7aWYobnVsbD09cilyZXR1cm4gcjtpZighemUocikpcmV0dXJuIHQocixlKTtmb3IodmFyIHU9ci5sZW5ndGgsbz1uP3U6LTEsaT1PYmplY3Qocik7KG4/by0tOisrbzx1KSYmZmFsc2UhPT1lKGlbb10sbyxpKTspO3JldHVybiByfX1mdW5jdGlvbiBncih0KXtyZXR1cm4gZnVuY3Rpb24obixyLGUpe1xyXG52YXIgdT0tMSxvPU9iamVjdChuKTtlPWUobik7Zm9yKHZhciBpPWUubGVuZ3RoO2ktLTspe3ZhciBmPWVbdD9pOisrdV07aWYoZmFsc2U9PT1yKG9bZl0sZixvKSlicmVha31yZXR1cm4gbn19ZnVuY3Rpb24gZHIodCxuLHIpe2Z1bmN0aW9uIGUoKXtyZXR1cm4odGhpcyYmdGhpcyE9PUt0JiZ0aGlzIGluc3RhbmNlb2YgZT9vOnQpLmFwcGx5KHU/cjp0aGlzLGFyZ3VtZW50cyl9dmFyIHU9MSZuLG89eHIodCk7cmV0dXJuIGV9ZnVuY3Rpb24geXIodCl7cmV0dXJuIGZ1bmN0aW9uKG4pe249cnUobik7dmFyIHI9V3QudGVzdChuKT9uLm1hdGNoKEl0KTpULGU9cj9yWzBdOm4uY2hhckF0KDApO3JldHVybiBuPXI/dXIociwxKS5qb2luKFwiXCIpOm4uc2xpY2UoMSksZVt0XSgpK259fWZ1bmN0aW9uIGJyKHQpe3JldHVybiBmdW5jdGlvbihuKXtyZXR1cm4gaChsdShhdShuKS5yZXBsYWNlKEV0LFwiXCIpKSx0LFwiXCIpfX1mdW5jdGlvbiB4cih0KXtyZXR1cm4gZnVuY3Rpb24oKXt2YXIgbj1hcmd1bWVudHM7XHJcbnN3aXRjaChuLmxlbmd0aCl7Y2FzZSAwOnJldHVybiBuZXcgdDtjYXNlIDE6cmV0dXJuIG5ldyB0KG5bMF0pO2Nhc2UgMjpyZXR1cm4gbmV3IHQoblswXSxuWzFdKTtjYXNlIDM6cmV0dXJuIG5ldyB0KG5bMF0sblsxXSxuWzJdKTtjYXNlIDQ6cmV0dXJuIG5ldyB0KG5bMF0sblsxXSxuWzJdLG5bM10pO2Nhc2UgNTpyZXR1cm4gbmV3IHQoblswXSxuWzFdLG5bMl0sblszXSxuWzRdKTtjYXNlIDY6cmV0dXJuIG5ldyB0KG5bMF0sblsxXSxuWzJdLG5bM10sbls0XSxuWzVdKTtjYXNlIDc6cmV0dXJuIG5ldyB0KG5bMF0sblsxXSxuWzJdLG5bM10sbls0XSxuWzVdLG5bNl0pfXZhciByPXVuKHQucHJvdG90eXBlKSxuPXQuYXBwbHkocixuKTtyZXR1cm4gUGUobik/bjpyfX1mdW5jdGlvbiBqcih0LG4sZSl7ZnVuY3Rpb24gdSgpe2Zvcih2YXIgaT1hcmd1bWVudHMubGVuZ3RoLGY9QXJyYXkoaSksYz1pLGE9JHIodSk7Yy0tOylmW2NdPWFyZ3VtZW50c1tjXTtyZXR1cm4gYz0zPmkmJmZbMF0hPT1hJiZmW2ktMV0hPT1hP1tdOiQoZixhKSxcclxuaS09Yy5sZW5ndGgsZT5pP1dyKHQsbixtcix1LnBsYWNlaG9sZGVyLFQsZixjLFQsVCxlLWkpOnIodGhpcyYmdGhpcyE9PUt0JiZ0aGlzIGluc3RhbmNlb2YgdT9vOnQsdGhpcyxmKX12YXIgbz14cih0KTtyZXR1cm4gdX1mdW5jdGlvbiB3cih0KXtyZXR1cm4gTGUoZnVuY3Rpb24obil7bj1zbihuLDEpO3ZhciByPW4ubGVuZ3RoLGU9cix1PXp0LnByb3RvdHlwZS50aHJ1O2Zvcih0JiZuLnJldmVyc2UoKTtlLS07KXt2YXIgbz1uW2VdO2lmKHR5cGVvZiBvIT1cImZ1bmN0aW9uXCIpdGhyb3cgbmV3IG11KFwiRXhwZWN0ZWQgYSBmdW5jdGlvblwiKTtpZih1JiYhaSYmXCJ3cmFwcGVyXCI9PVVyKG8pKXZhciBpPW5ldyB6dChbXSx0cnVlKX1mb3IoZT1pP2U6cjsrK2U8cjspdmFyIG89bltlXSx1PVVyKG8pLGY9XCJ3cmFwcGVyXCI9PXU/SW8obyk6VCxpPWYmJm5lKGZbMF0pJiY0MjQ9PWZbMV0mJiFmWzRdLmxlbmd0aCYmMT09Zls5XT9pW1VyKGZbMF0pXS5hcHBseShpLGZbM10pOjE9PW8ubGVuZ3RoJiZuZShvKT9pW3VdKCk6aS50aHJ1KG8pO1xyXG5yZXR1cm4gZnVuY3Rpb24oKXt2YXIgdD1hcmd1bWVudHMsZT10WzBdO2lmKGkmJjE9PXQubGVuZ3RoJiZ2aShlKSYmZS5sZW5ndGg+PTIwMClyZXR1cm4gaS5wbGFudChlKS52YWx1ZSgpO2Zvcih2YXIgdT0wLHQ9cj9uW3VdLmFwcGx5KHRoaXMsdCk6ZTsrK3U8cjspdD1uW3VdLmNhbGwodGhpcyx0KTtyZXR1cm4gdH19KX1mdW5jdGlvbiBtcih0LG4scixlLHUsbyxpLGYsYyxhKXtmdW5jdGlvbiBsKCl7Zm9yKHZhciBkPWFyZ3VtZW50cy5sZW5ndGgseT1BcnJheShkKSxiPWQ7Yi0tOyl5W2JdPWFyZ3VtZW50c1tiXTtpZihfKXt2YXIgeCxqPSRyKGwpLGI9eS5sZW5ndGg7Zm9yKHg9MDtiLS07KXlbYl09PT1qJiZ4Kyt9aWYoZSYmKHk9Y3IoeSxlLHUsXykpLG8mJih5PWFyKHksbyxpLF8pKSxkLT14LF8mJmE+ZClyZXR1cm4gaj0kKHksaiksV3IodCxuLG1yLGwucGxhY2Vob2xkZXIscix5LGosZixjLGEtZCk7aWYoaj1oP3I6dGhpcyxiPXA/alt0XTp0LGQ9eS5sZW5ndGgsZil7eD15Lmxlbmd0aDtcclxuZm9yKHZhciB3PVh1KGYubGVuZ3RoLHgpLG09bHIoeSk7dy0tOyl7dmFyIEE9Zlt3XTt5W3ddPVFyKEEseCk/bVtBXTpUfX1lbHNlIHYmJmQ+MSYmeS5yZXZlcnNlKCk7cmV0dXJuIHMmJmQ+YyYmKHkubGVuZ3RoPWMpLHRoaXMmJnRoaXMhPT1LdCYmdGhpcyBpbnN0YW5jZW9mIGwmJihiPWd8fHhyKGIpKSxiLmFwcGx5KGoseSl9dmFyIHM9MTI4Jm4saD0xJm4scD0yJm4sXz0yNCZuLHY9NTEyJm4sZz1wP1Q6eHIodCk7cmV0dXJuIGx9ZnVuY3Rpb24gQXIodCxuKXtyZXR1cm4gZnVuY3Rpb24ocixlKXtyZXR1cm4gam4ocix0LG4oZSkpfX1mdW5jdGlvbiBPcih0KXtyZXR1cm4gZnVuY3Rpb24obixyKXt2YXIgZTtpZihuPT09VCYmcj09PVQpcmV0dXJuIDA7aWYobiE9PVQmJihlPW4pLHIhPT1UKXtpZihlPT09VClyZXR1cm4gcjt0eXBlb2Ygbj09XCJzdHJpbmdcInx8dHlwZW9mIHI9PVwic3RyaW5nXCI/KG49WW4obikscj1ZbihyKSk6KG49Sm4obikscj1KbihyKSksZT10KG4scil9cmV0dXJuIGU7XHJcbn19ZnVuY3Rpb24ga3IodCl7cmV0dXJuIExlKGZ1bmN0aW9uKG4pe3JldHVybiBuPTE9PW4ubGVuZ3RoJiZ2aShuWzBdKT9sKG5bMF0sTyhEcigpKSk6bChzbihuLDEsSHIpLE8oRHIoKSkpLExlKGZ1bmN0aW9uKGUpe3ZhciB1PXRoaXM7cmV0dXJuIHQobixmdW5jdGlvbih0KXtyZXR1cm4gcih0LHUsZSl9KX0pfSl9ZnVuY3Rpb24gRXIodCxuKXtuPW49PT1UP1wiIFwiOlluKG4pO3ZhciByPW4ubGVuZ3RoO3JldHVybiAyPnI/cj9QbihuLHQpOm46KHI9UG4obixWdSh0L04obikpKSxXdC50ZXN0KG4pP3VyKHIubWF0Y2goSXQpLDAsdCkuam9pbihcIlwiKTpyLnNsaWNlKDAsdCkpfWZ1bmN0aW9uIFNyKHQsbixlLHUpe2Z1bmN0aW9uIG8oKXtmb3IodmFyIG49LTEsYz1hcmd1bWVudHMubGVuZ3RoLGE9LTEsbD11Lmxlbmd0aCxzPUFycmF5KGwrYyksaD10aGlzJiZ0aGlzIT09S3QmJnRoaXMgaW5zdGFuY2VvZiBvP2Y6dDsrK2E8bDspc1thXT11W2FdO2Zvcig7Yy0tOylzW2ErK109YXJndW1lbnRzWysrbl07XHJcbnJldHVybiByKGgsaT9lOnRoaXMscyl9dmFyIGk9MSZuLGY9eHIodCk7cmV0dXJuIG99ZnVuY3Rpb24gSXIodCl7cmV0dXJuIGZ1bmN0aW9uKG4scixlKXtlJiZ0eXBlb2YgZSE9XCJudW1iZXJcIiYmWHIobixyLGUpJiYocj1lPVQpLG49dHUobiksbj1uPT09bj9uOjAscj09PVQ/KHI9bixuPTApOnI9dHUocil8fDAsZT1lPT09VD9yPm4/MTotMTp0dShlKXx8MDt2YXIgdT0tMTtyPVF1KFZ1KChyLW4pLyhlfHwxKSksMCk7Zm9yKHZhciBvPUFycmF5KHIpO3ItLTspb1t0P3I6Kyt1XT1uLG4rPWU7cmV0dXJuIG99fWZ1bmN0aW9uIFJyKHQpe3JldHVybiBmdW5jdGlvbihuLHIpe3JldHVybiB0eXBlb2Ygbj09XCJzdHJpbmdcIiYmdHlwZW9mIHI9PVwic3RyaW5nXCJ8fChuPXR1KG4pLHI9dHUocikpLHQobixyKX19ZnVuY3Rpb24gV3IodCxuLHIsZSx1LG8saSxmLGMsYSl7dmFyIGw9OCZuLHM9bD9pOlQ7aT1sP1Q6aTt2YXIgaD1sP286VDtyZXR1cm4gbz1sP1Q6byxuPShufChsPzMyOjY0KSkmfihsPzY0OjMyKSxcclxuNCZufHwobiY9LTQpLG49W3Qsbix1LGgscyxvLGksZixjLGFdLHI9ci5hcHBseShULG4pLG5lKHQpJiZMbyhyLG4pLHIucGxhY2Vob2xkZXI9ZSxyfWZ1bmN0aW9uIEJyKHQpe3ZhciBuPWp1W3RdO3JldHVybiBmdW5jdGlvbih0LHIpe2lmKHQ9dHUodCkscj1YdShRZShyKSwyOTIpKXt2YXIgZT0ocnUodCkrXCJlXCIpLnNwbGl0KFwiZVwiKSxlPW4oZVswXStcImVcIisoK2VbMV0rcikpLGU9KHJ1KGUpK1wiZVwiKS5zcGxpdChcImVcIik7cmV0dXJuKyhlWzBdK1wiZVwiKygrZVsxXS1yKSl9cmV0dXJuIG4odCl9fWZ1bmN0aW9uIExyKHQpe3JldHVybiBmdW5jdGlvbihuKXt2YXIgcj1UcihuKTtyZXR1cm5cIltvYmplY3QgTWFwXVwiPT1yP1Uobik6XCJbb2JqZWN0IFNldF1cIj09cj9GKG4pOkEobix0KG4pKX19ZnVuY3Rpb24gTXIodCxuLHIsZSx1LG8saSxmKXt2YXIgYz0yJm47aWYoIWMmJnR5cGVvZiB0IT1cImZ1bmN0aW9uXCIpdGhyb3cgbmV3IG11KFwiRXhwZWN0ZWQgYSBmdW5jdGlvblwiKTt2YXIgYT1lP2UubGVuZ3RoOjA7XHJcbmlmKGF8fChuJj0tOTcsZT11PVQpLGk9aT09PVQ/aTpRdShRZShpKSwwKSxmPWY9PT1UP2Y6UWUoZiksYS09dT91Lmxlbmd0aDowLDY0Jm4pe3ZhciBsPWUscz11O2U9dT1UfXZhciBoPWM/VDpJbyh0KTtyZXR1cm4gbz1bdCxuLHIsZSx1LGwscyxvLGksZl0saCYmKHI9b1sxXSx0PWhbMV0sbj1yfHQsZT0xMjg9PXQmJjg9PXJ8fDEyOD09dCYmMjU2PT1yJiZoWzhdPj1vWzddLmxlbmd0aHx8Mzg0PT10JiZoWzhdPj1oWzddLmxlbmd0aCYmOD09ciwxMzE+bnx8ZSkmJigxJnQmJihvWzJdPWhbMl0sbnw9MSZyPzA6NCksKHI9aFszXSkmJihlPW9bM10sb1szXT1lP2NyKGUscixoWzRdKTpyLG9bNF09ZT8kKG9bM10sXCJfX2xvZGFzaF9wbGFjZWhvbGRlcl9fXCIpOmhbNF0pLChyPWhbNV0pJiYoZT1vWzVdLG9bNV09ZT9hcihlLHIsaFs2XSk6cixvWzZdPWU/JChvWzVdLFwiX19sb2Rhc2hfcGxhY2Vob2xkZXJfX1wiKTpoWzZdKSwocj1oWzddKSYmKG9bN109ciksMTI4JnQmJihvWzhdPW51bGw9PW9bOF0/aFs4XTpYdShvWzhdLGhbOF0pKSxcclxubnVsbD09b1s5XSYmKG9bOV09aFs5XSksb1swXT1oWzBdLG9bMV09biksdD1vWzBdLG49b1sxXSxyPW9bMl0sZT1vWzNdLHU9b1s0XSxmPW9bOV09bnVsbD09b1s5XT9jPzA6dC5sZW5ndGg6UXUob1s5XS1hLDApLCFmJiYyNCZuJiYobiY9LTI1KSwoaD9FbzpMbykobiYmMSE9bj84PT1ufHwxNj09bj9qcih0LG4sZik6MzIhPW4mJjMzIT1ufHx1Lmxlbmd0aD9tci5hcHBseShULG8pOlNyKHQsbixyLGUpOmRyKHQsbixyKSxvKX1mdW5jdGlvbiBDcih0LG4scixlLHUsbyl7dmFyIGk9MiZ1LGY9dC5sZW5ndGgsYz1uLmxlbmd0aDtpZihmIT1jJiYhKGkmJmM+ZikpcmV0dXJuIGZhbHNlO2lmKGM9by5nZXQodCkpcmV0dXJuIGM9PW47dmFyIGM9LTEsYT10cnVlLGw9MSZ1P25ldyBadDpUO2ZvcihvLnNldCh0LG4pOysrYzxmOyl7dmFyIHM9dFtjXSxoPW5bY107aWYoZSl2YXIgcD1pP2UoaCxzLGMsbix0LG8pOmUocyxoLGMsdCxuLG8pO2lmKHAhPT1UKXtpZihwKWNvbnRpbnVlO2E9ZmFsc2U7YnJlYWt9XHJcbmlmKGwpe2lmKCFfKG4sZnVuY3Rpb24odCxuKXtyZXR1cm4gbC5oYXMobil8fHMhPT10JiYhcihzLHQsZSx1LG8pP3ZvaWQgMDpsLmFkZChuKX0pKXthPWZhbHNlO2JyZWFrfX1lbHNlIGlmKHMhPT1oJiYhcihzLGgsZSx1LG8pKXthPWZhbHNlO2JyZWFrfX1yZXR1cm4gb1tcImRlbGV0ZVwiXSh0KSxhfWZ1bmN0aW9uIHpyKHQsbixyLGUsdSxvLGkpe3N3aXRjaChyKXtjYXNlXCJbb2JqZWN0IERhdGFWaWV3XVwiOmlmKHQuYnl0ZUxlbmd0aCE9bi5ieXRlTGVuZ3RofHx0LmJ5dGVPZmZzZXQhPW4uYnl0ZU9mZnNldClicmVhazt0PXQuYnVmZmVyLG49bi5idWZmZXI7Y2FzZVwiW29iamVjdCBBcnJheUJ1ZmZlcl1cIjppZih0LmJ5dGVMZW5ndGghPW4uYnl0ZUxlbmd0aHx8IWUobmV3IER1KHQpLG5ldyBEdShuKSkpYnJlYWs7cmV0dXJuIHRydWU7Y2FzZVwiW29iamVjdCBCb29sZWFuXVwiOmNhc2VcIltvYmplY3QgRGF0ZV1cIjpyZXR1cm4rdD09K247Y2FzZVwiW29iamVjdCBFcnJvcl1cIjpyZXR1cm4gdC5uYW1lPT1uLm5hbWUmJnQubWVzc2FnZT09bi5tZXNzYWdlO1xyXG5jYXNlXCJbb2JqZWN0IE51bWJlcl1cIjpyZXR1cm4gdCE9K3Q/biE9K246dD09K247Y2FzZVwiW29iamVjdCBSZWdFeHBdXCI6Y2FzZVwiW29iamVjdCBTdHJpbmddXCI6cmV0dXJuIHQ9PW4rXCJcIjtjYXNlXCJbb2JqZWN0IE1hcF1cIjp2YXIgZj1VO2Nhc2VcIltvYmplY3QgU2V0XVwiOmlmKGZ8fChmPUQpLHQuc2l6ZSE9bi5zaXplJiYhKDImbykpYnJlYWs7cmV0dXJuKHI9aS5nZXQodCkpP3I9PW46KG98PTEsaS5zZXQodCxuKSxDcihmKHQpLGYobiksZSx1LG8saSkpO2Nhc2VcIltvYmplY3QgU3ltYm9sXVwiOmlmKGpvKXJldHVybiBqby5jYWxsKHQpPT1qby5jYWxsKG4pfXJldHVybiBmYWxzZX1mdW5jdGlvbiBVcih0KXtmb3IodmFyIG49dC5uYW1lK1wiXCIscj1wb1tuXSxlPVJ1LmNhbGwocG8sbik/ci5sZW5ndGg6MDtlLS07KXt2YXIgdT1yW2VdLG89dS5mdW5jO2lmKG51bGw9PW98fG89PXQpcmV0dXJuIHUubmFtZX1yZXR1cm4gbn1mdW5jdGlvbiAkcih0KXtyZXR1cm4oUnUuY2FsbChPdCxcInBsYWNlaG9sZGVyXCIpP090OnQpLnBsYWNlaG9sZGVyO1xyXG59ZnVuY3Rpb24gRHIoKXt2YXIgdD1PdC5pdGVyYXRlZXx8cHUsdD10PT09cHU/a246dDtyZXR1cm4gYXJndW1lbnRzLmxlbmd0aD90KGFyZ3VtZW50c1swXSxhcmd1bWVudHNbMV0pOnR9ZnVuY3Rpb24gRnIodCxuKXt2YXIgcj10Ll9fZGF0YV9fLGU9dHlwZW9mIG47cmV0dXJuKFwic3RyaW5nXCI9PWV8fFwibnVtYmVyXCI9PWV8fFwic3ltYm9sXCI9PWV8fFwiYm9vbGVhblwiPT1lP1wiX19wcm90b19fXCIhPT1uOm51bGw9PT1uKT9yW3R5cGVvZiBuPT1cInN0cmluZ1wiP1wic3RyaW5nXCI6XCJoYXNoXCJdOnIubWFwfWZ1bmN0aW9uIE5yKHQpe2Zvcih2YXIgbj1vdSh0KSxyPW4ubGVuZ3RoO3ItLTspe3ZhciBlPW5bcl0sdT10W2VdO25bcl09W2UsdSx1PT09dSYmIVBlKHUpXX1yZXR1cm4gbn1mdW5jdGlvbiBQcih0LG4pe3ZhciByPW51bGw9PXQ/VDp0W25dO3JldHVybiBPbihyKT9yOlR9ZnVuY3Rpb24gWnIodCl7cmV0dXJuIE51KE9iamVjdCh0KSl9ZnVuY3Rpb24gVHIodCl7cmV0dXJuIEx1LmNhbGwodCk7XHJcbn1mdW5jdGlvbiBxcih0LG4scil7bj10ZShuLHQpP1tuXTplcihuKTtmb3IodmFyIGUsdT0tMSxvPW4ubGVuZ3RoOysrdTxvOyl7dmFyIGk9aWUoblt1XSk7aWYoIShlPW51bGwhPXQmJnIodCxpKSkpYnJlYWs7dD10W2ldfXJldHVybiBlP2U6KG89dD90Lmxlbmd0aDowLCEhbyYmTmUobykmJlFyKGksbykmJih2aSh0KXx8S2UodCl8fENlKHQpKSl9ZnVuY3Rpb24gVnIodCl7dmFyIG49dC5sZW5ndGgscj10LmNvbnN0cnVjdG9yKG4pO3JldHVybiBuJiZcInN0cmluZ1wiPT10eXBlb2YgdFswXSYmUnUuY2FsbCh0LFwiaW5kZXhcIikmJihyLmluZGV4PXQuaW5kZXgsci5pbnB1dD10LmlucHV0KSxyfWZ1bmN0aW9uIEtyKHQpe3JldHVybiB0eXBlb2YgdC5jb25zdHJ1Y3RvciE9XCJmdW5jdGlvblwifHxyZSh0KT97fTp1bihHdShPYmplY3QodCkpKX1mdW5jdGlvbiBHcihyLGUsdSxvKXt2YXIgaT1yLmNvbnN0cnVjdG9yO3N3aXRjaChlKXtjYXNlXCJbb2JqZWN0IEFycmF5QnVmZmVyXVwiOnJldHVybiBpcihyKTtcclxuY2FzZVwiW29iamVjdCBCb29sZWFuXVwiOmNhc2VcIltvYmplY3QgRGF0ZV1cIjpyZXR1cm4gbmV3IGkoK3IpO2Nhc2VcIltvYmplY3QgRGF0YVZpZXddXCI6cmV0dXJuIGU9bz9pcihyLmJ1ZmZlcik6ci5idWZmZXIsbmV3IHIuY29uc3RydWN0b3IoZSxyLmJ5dGVPZmZzZXQsci5ieXRlTGVuZ3RoKTtjYXNlXCJbb2JqZWN0IEZsb2F0MzJBcnJheV1cIjpjYXNlXCJbb2JqZWN0IEZsb2F0NjRBcnJheV1cIjpjYXNlXCJbb2JqZWN0IEludDhBcnJheV1cIjpjYXNlXCJbb2JqZWN0IEludDE2QXJyYXldXCI6Y2FzZVwiW29iamVjdCBJbnQzMkFycmF5XVwiOmNhc2VcIltvYmplY3QgVWludDhBcnJheV1cIjpjYXNlXCJbb2JqZWN0IFVpbnQ4Q2xhbXBlZEFycmF5XVwiOmNhc2VcIltvYmplY3QgVWludDE2QXJyYXldXCI6Y2FzZVwiW29iamVjdCBVaW50MzJBcnJheV1cIjpyZXR1cm4gZT1vP2lyKHIuYnVmZmVyKTpyLmJ1ZmZlcixuZXcgci5jb25zdHJ1Y3RvcihlLHIuYnl0ZU9mZnNldCxyLmxlbmd0aCk7Y2FzZVwiW29iamVjdCBNYXBdXCI6XHJcbnJldHVybiBlPW8/dShVKHIpLHRydWUpOlUociksaChlLHQsbmV3IHIuY29uc3RydWN0b3IpO2Nhc2VcIltvYmplY3QgTnVtYmVyXVwiOmNhc2VcIltvYmplY3QgU3RyaW5nXVwiOnJldHVybiBuZXcgaShyKTtjYXNlXCJbb2JqZWN0IFJlZ0V4cF1cIjpyZXR1cm4gZT1uZXcgci5jb25zdHJ1Y3RvcihyLnNvdXJjZSxfdC5leGVjKHIpKSxlLmxhc3RJbmRleD1yLmxhc3RJbmRleCxlO2Nhc2VcIltvYmplY3QgU2V0XVwiOnJldHVybiBlPW8/dShEKHIpLHRydWUpOkQociksaChlLG4sbmV3IHIuY29uc3RydWN0b3IpO2Nhc2VcIltvYmplY3QgU3ltYm9sXVwiOnJldHVybiBqbz9PYmplY3Qoam8uY2FsbChyKSk6e319fWZ1bmN0aW9uIEpyKHQpe3ZhciBuPXQ/dC5sZW5ndGg6VDtyZXR1cm4gTmUobikmJih2aSh0KXx8S2UodCl8fENlKHQpKT9tKG4sU3RyaW5nKTpudWxsfWZ1bmN0aW9uIFlyKHQpe3JldHVybiB2aSh0KXx8Q2UodCl9ZnVuY3Rpb24gSHIodCl7cmV0dXJuIHZpKHQpJiYhKDI9PXQubGVuZ3RoJiYhRGUodFswXSkpO1xyXG59ZnVuY3Rpb24gUXIodCxuKXtyZXR1cm4gbj1udWxsPT1uPzkwMDcxOTkyNTQ3NDA5OTE6biwhIW4mJih0eXBlb2YgdD09XCJudW1iZXJcInx8eHQudGVzdCh0KSkmJnQ+LTEmJjA9PXQlMSYmbj50fWZ1bmN0aW9uIFhyKHQsbixyKXtpZighUGUocikpcmV0dXJuIGZhbHNlO3ZhciBlPXR5cGVvZiBuO3JldHVybihcIm51bWJlclwiPT1lP3plKHIpJiZRcihuLHIubGVuZ3RoKTpcInN0cmluZ1wiPT1lJiZuIGluIHIpP01lKHJbbl0sdCk6ZmFsc2V9ZnVuY3Rpb24gdGUodCxuKXtpZih2aSh0KSlyZXR1cm4gZmFsc2U7dmFyIHI9dHlwZW9mIHQ7cmV0dXJuXCJudW1iZXJcIj09cnx8XCJzeW1ib2xcIj09cnx8XCJib29sZWFuXCI9PXJ8fG51bGw9PXR8fEdlKHQpP3RydWU6dXQudGVzdCh0KXx8IWV0LnRlc3QodCl8fG51bGwhPW4mJnQgaW4gT2JqZWN0KG4pfWZ1bmN0aW9uIG5lKHQpe3ZhciBuPVVyKHQpLHI9T3Rbbl07cmV0dXJuIHR5cGVvZiByPT1cImZ1bmN0aW9uXCImJm4gaW4gVXQucHJvdG90eXBlP3Q9PT1yP3RydWU6KG49SW8ociksXHJcbiEhbiYmdD09PW5bMF0pOmZhbHNlfWZ1bmN0aW9uIHJlKHQpe3ZhciBuPXQmJnQuY29uc3RydWN0b3I7cmV0dXJuIHQ9PT0odHlwZW9mIG49PVwiZnVuY3Rpb25cIiYmbi5wcm90b3R5cGV8fE91KX1mdW5jdGlvbiBlZSh0LG4pe3JldHVybiBmdW5jdGlvbihyKXtyZXR1cm4gbnVsbD09cj9mYWxzZTpyW3RdPT09biYmKG4hPT1UfHx0IGluIE9iamVjdChyKSl9fWZ1bmN0aW9uIHVlKHQsbixyLGUsdSxvKXtyZXR1cm4gUGUodCkmJlBlKG4pJiZCbih0LG4sVCx1ZSxvLnNldChuLHQpKSx0fWZ1bmN0aW9uIG9lKHQsbil7cmV0dXJuIDE9PW4ubGVuZ3RoP3Q6dm4odCxUbihuLDAsLTEpKX1mdW5jdGlvbiBpZSh0KXtpZih0eXBlb2YgdD09XCJzdHJpbmdcInx8R2UodCkpcmV0dXJuIHQ7dmFyIG49dCtcIlwiO3JldHVyblwiMFwiPT1uJiYxL3Q9PS1xP1wiLTBcIjpufWZ1bmN0aW9uIGZlKHQpe2lmKG51bGwhPXQpe3RyeXtyZXR1cm4gSXUuY2FsbCh0KX1jYXRjaChuKXt9cmV0dXJuIHQrXCJcIn1yZXR1cm5cIlwifWZ1bmN0aW9uIGNlKHQpe1xyXG5pZih0IGluc3RhbmNlb2YgVXQpcmV0dXJuIHQuY2xvbmUoKTt2YXIgbj1uZXcgenQodC5fX3dyYXBwZWRfXyx0Ll9fY2hhaW5fXyk7cmV0dXJuIG4uX19hY3Rpb25zX189bHIodC5fX2FjdGlvbnNfXyksbi5fX2luZGV4X189dC5fX2luZGV4X18sbi5fX3ZhbHVlc19fPXQuX192YWx1ZXNfXyxufWZ1bmN0aW9uIGFlKHQsbixyKXt2YXIgZT10P3QubGVuZ3RoOjA7cmV0dXJuIGU/KG49cnx8bj09PVQ/MTpRZShuKSxUbih0LDA+bj8wOm4sZSkpOltdfWZ1bmN0aW9uIGxlKHQsbixyKXt2YXIgZT10P3QubGVuZ3RoOjA7cmV0dXJuIGU/KG49cnx8bj09PVQ/MTpRZShuKSxuPWUtbixUbih0LDAsMD5uPzA6bikpOltdfWZ1bmN0aW9uIHNlKHQsbixyKXt2YXIgZT10P3QubGVuZ3RoOjA7cmV0dXJuIGU/KHI9bnVsbD09cj8wOlFlKHIpLDA+ciYmKHI9UXUoZStyLDApKSxnKHQsRHIobiwzKSxyKSk6LTF9ZnVuY3Rpb24gaGUodCxuLHIpe3ZhciBlPXQ/dC5sZW5ndGg6MDtpZighZSlyZXR1cm4tMTtcclxudmFyIHU9ZS0xO3JldHVybiByIT09VCYmKHU9UWUociksdT0wPnI/UXUoZSt1LDApOlh1KHUsZS0xKSksZyh0LERyKG4sMyksdSx0cnVlKX1mdW5jdGlvbiBwZSh0KXtyZXR1cm4gdCYmdC5sZW5ndGg/dFswXTpUfWZ1bmN0aW9uIF9lKHQpe3ZhciBuPXQ/dC5sZW5ndGg6MDtyZXR1cm4gbj90W24tMV06VH1mdW5jdGlvbiB2ZSh0LG4pe3JldHVybiB0JiZ0Lmxlbmd0aCYmbiYmbi5sZW5ndGg/RG4odCxuKTp0fWZ1bmN0aW9uIGdlKHQpe3JldHVybiB0P2VvLmNhbGwodCk6dH1mdW5jdGlvbiBkZSh0KXtpZighdHx8IXQubGVuZ3RoKXJldHVybltdO3ZhciBuPTA7cmV0dXJuIHQ9Zih0LGZ1bmN0aW9uKHQpe3JldHVybiBVZSh0KT8obj1RdSh0Lmxlbmd0aCxuKSx0cnVlKTp2b2lkIDB9KSxtKG4sZnVuY3Rpb24obil7cmV0dXJuIGwodCxVbihuKSl9KX1mdW5jdGlvbiB5ZSh0LG4pe2lmKCF0fHwhdC5sZW5ndGgpcmV0dXJuW107dmFyIGU9ZGUodCk7cmV0dXJuIG51bGw9PW4/ZTpsKGUsZnVuY3Rpb24odCl7XHJcbnJldHVybiByKG4sVCx0KX0pfWZ1bmN0aW9uIGJlKHQpe3JldHVybiB0PU90KHQpLHQuX19jaGFpbl9fPXRydWUsdH1mdW5jdGlvbiB4ZSh0LG4pe3JldHVybiBuKHQpfWZ1bmN0aW9uIGplKCl7cmV0dXJuIHRoaXN9ZnVuY3Rpb24gd2UodCxuKXtyZXR1cm4odmkodCk/dTptbykodCxEcihuLDMpKX1mdW5jdGlvbiBtZSh0LG4pe3JldHVybih2aSh0KT9vOkFvKSh0LERyKG4sMykpfWZ1bmN0aW9uIEFlKHQsbil7cmV0dXJuKHZpKHQpP2w6SW4pKHQsRHIobiwzKSl9ZnVuY3Rpb24gT2UodCxuLHIpe3ZhciBlPS0xLHU9WWUodCksbz11Lmxlbmd0aCxpPW8tMTtmb3Iobj0ocj9Ycih0LG4scik6bj09PVQpPzE6bm4oUWUobiksMCxvKTsrK2U8bjspdD1ObihlLGkpLHI9dVt0XSx1W3RdPXVbZV0sdVtlXT1yO3JldHVybiB1Lmxlbmd0aD1uLHV9ZnVuY3Rpb24ga2UoKXtyZXR1cm4gYnUubm93KCl9ZnVuY3Rpb24gRWUodCxuLHIpe3JldHVybiBuPXI/VDpuLG49dCYmbnVsbD09bj90Lmxlbmd0aDpuLFxyXG5Ncih0LDEyOCxULFQsVCxULG4pfWZ1bmN0aW9uIFNlKHQsbil7dmFyIHI7aWYodHlwZW9mIG4hPVwiZnVuY3Rpb25cIil0aHJvdyBuZXcgbXUoXCJFeHBlY3RlZCBhIGZ1bmN0aW9uXCIpO3JldHVybiB0PVFlKHQpLGZ1bmN0aW9uKCl7cmV0dXJuIDA8LS10JiYocj1uLmFwcGx5KHRoaXMsYXJndW1lbnRzKSksMT49dCYmKG49VCkscn19ZnVuY3Rpb24gSWUodCxuLHIpe3JldHVybiBuPXI/VDpuLHQ9TXIodCw4LFQsVCxULFQsVCxuKSx0LnBsYWNlaG9sZGVyPUllLnBsYWNlaG9sZGVyLHR9ZnVuY3Rpb24gUmUodCxuLHIpe3JldHVybiBuPXI/VDpuLHQ9TXIodCwxNixULFQsVCxULFQsbiksdC5wbGFjZWhvbGRlcj1SZS5wbGFjZWhvbGRlcix0fWZ1bmN0aW9uIFdlKHQsbixyKXtmdW5jdGlvbiBlKG4pe3ZhciByPWMsZT1hO3JldHVybiBjPWE9VCxfPW4scz10LmFwcGx5KGUscil9ZnVuY3Rpb24gdSh0KXt2YXIgcj10LXA7cmV0dXJuIHQtPV8scD09PVR8fHI+PW58fDA+cnx8ZyYmdD49bH1mdW5jdGlvbiBvKCl7XHJcbnZhciB0PWtlKCk7aWYodSh0KSlyZXR1cm4gaSh0KTt2YXIgcjtyPXQtXyx0PW4tKHQtcCkscj1nP1h1KHQsbC1yKTp0LGg9QXQobyxyKX1mdW5jdGlvbiBpKHQpe3JldHVybiBoPVQsZCYmYz9lKHQpOihjPWE9VCxzKX1mdW5jdGlvbiBmKCl7dmFyIHQ9a2UoKSxyPXUodCk7aWYoYz1hcmd1bWVudHMsYT10aGlzLHA9dCxyKXtpZihoPT09VClyZXR1cm4gXz10PXAsaD1BdChvLG4pLHY/ZSh0KTpzO2lmKGcpcmV0dXJuIGg9QXQobyxuKSxlKHApfXJldHVybiBoPT09VCYmKGg9QXQobyxuKSksc312YXIgYyxhLGwscyxoLHAsXz0wLHY9ZmFsc2UsZz1mYWxzZSxkPXRydWU7aWYodHlwZW9mIHQhPVwiZnVuY3Rpb25cIil0aHJvdyBuZXcgbXUoXCJFeHBlY3RlZCBhIGZ1bmN0aW9uXCIpO3JldHVybiBuPXR1KG4pfHwwLFBlKHIpJiYodj0hIXIubGVhZGluZyxsPShnPVwibWF4V2FpdFwiaW4gcik/UXUodHUoci5tYXhXYWl0KXx8MCxuKTpsLGQ9XCJ0cmFpbGluZ1wiaW4gcj8hIXIudHJhaWxpbmc6ZCksZi5jYW5jZWw9ZnVuY3Rpb24oKXtcclxuXz0wLGM9cD1hPWg9VH0sZi5mbHVzaD1mdW5jdGlvbigpe3JldHVybiBoPT09VD9zOmkoa2UoKSl9LGZ9ZnVuY3Rpb24gQmUodCxuKXtmdW5jdGlvbiByKCl7dmFyIGU9YXJndW1lbnRzLHU9bj9uLmFwcGx5KHRoaXMsZSk6ZVswXSxvPXIuY2FjaGU7cmV0dXJuIG8uaGFzKHUpP28uZ2V0KHUpOihlPXQuYXBwbHkodGhpcyxlKSxyLmNhY2hlPW8uc2V0KHUsZSksZSl9aWYodHlwZW9mIHQhPVwiZnVuY3Rpb25cInx8biYmdHlwZW9mIG4hPVwiZnVuY3Rpb25cIil0aHJvdyBuZXcgbXUoXCJFeHBlY3RlZCBhIGZ1bmN0aW9uXCIpO3JldHVybiByLmNhY2hlPW5ldyhCZS5DYWNoZXx8UHQpLHJ9ZnVuY3Rpb24gTGUodCxuKXtpZih0eXBlb2YgdCE9XCJmdW5jdGlvblwiKXRocm93IG5ldyBtdShcIkV4cGVjdGVkIGEgZnVuY3Rpb25cIik7cmV0dXJuIG49UXUobj09PVQ/dC5sZW5ndGgtMTpRZShuKSwwKSxmdW5jdGlvbigpe2Zvcih2YXIgZT1hcmd1bWVudHMsdT0tMSxvPVF1KGUubGVuZ3RoLW4sMCksaT1BcnJheShvKTsrK3U8bzspaVt1XT1lW24rdV07XHJcbnN3aXRjaChuKXtjYXNlIDA6cmV0dXJuIHQuY2FsbCh0aGlzLGkpO2Nhc2UgMTpyZXR1cm4gdC5jYWxsKHRoaXMsZVswXSxpKTtjYXNlIDI6cmV0dXJuIHQuY2FsbCh0aGlzLGVbMF0sZVsxXSxpKX1mb3Iobz1BcnJheShuKzEpLHU9LTE7Kyt1PG47KW9bdV09ZVt1XTtyZXR1cm4gb1tuXT1pLHIodCx0aGlzLG8pfX1mdW5jdGlvbiBNZSh0LG4pe3JldHVybiB0PT09bnx8dCE9PXQmJm4hPT1ufWZ1bmN0aW9uIENlKHQpe3JldHVybiBVZSh0KSYmUnUuY2FsbCh0LFwiY2FsbGVlXCIpJiYoIVR1LmNhbGwodCxcImNhbGxlZVwiKXx8XCJbb2JqZWN0IEFyZ3VtZW50c11cIj09THUuY2FsbCh0KSl9ZnVuY3Rpb24gemUodCl7cmV0dXJuIG51bGwhPXQmJk5lKFJvKHQpKSYmIURlKHQpfWZ1bmN0aW9uIFVlKHQpe3JldHVybiBaZSh0KSYmemUodCl9ZnVuY3Rpb24gJGUodCl7cmV0dXJuIFplKHQpP1wiW29iamVjdCBFcnJvcl1cIj09THUuY2FsbCh0KXx8dHlwZW9mIHQubWVzc2FnZT09XCJzdHJpbmdcIiYmdHlwZW9mIHQubmFtZT09XCJzdHJpbmdcIjpmYWxzZTtcclxufWZ1bmN0aW9uIERlKHQpe3JldHVybiB0PVBlKHQpP0x1LmNhbGwodCk6XCJcIixcIltvYmplY3QgRnVuY3Rpb25dXCI9PXR8fFwiW29iamVjdCBHZW5lcmF0b3JGdW5jdGlvbl1cIj09dH1mdW5jdGlvbiBGZSh0KXtyZXR1cm4gdHlwZW9mIHQ9PVwibnVtYmVyXCImJnQ9PVFlKHQpfWZ1bmN0aW9uIE5lKHQpe3JldHVybiB0eXBlb2YgdD09XCJudW1iZXJcIiYmdD4tMSYmMD09dCUxJiY5MDA3MTk5MjU0NzQwOTkxPj10fWZ1bmN0aW9uIFBlKHQpe3ZhciBuPXR5cGVvZiB0O3JldHVybiEhdCYmKFwib2JqZWN0XCI9PW58fFwiZnVuY3Rpb25cIj09bil9ZnVuY3Rpb24gWmUodCl7cmV0dXJuISF0JiZ0eXBlb2YgdD09XCJvYmplY3RcIn1mdW5jdGlvbiBUZSh0KXtyZXR1cm4gdHlwZW9mIHQ9PVwibnVtYmVyXCJ8fFplKHQpJiZcIltvYmplY3QgTnVtYmVyXVwiPT1MdS5jYWxsKHQpfWZ1bmN0aW9uIHFlKHQpe3JldHVybiFaZSh0KXx8XCJbb2JqZWN0IE9iamVjdF1cIiE9THUuY2FsbCh0KXx8Qyh0KT9mYWxzZToodD1HdShPYmplY3QodCkpLFxyXG5udWxsPT09dD90cnVlOih0PVJ1LmNhbGwodCxcImNvbnN0cnVjdG9yXCIpJiZ0LmNvbnN0cnVjdG9yLHR5cGVvZiB0PT1cImZ1bmN0aW9uXCImJnQgaW5zdGFuY2VvZiB0JiZJdS5jYWxsKHQpPT1CdSkpfWZ1bmN0aW9uIFZlKHQpe3JldHVybiBQZSh0KSYmXCJbb2JqZWN0IFJlZ0V4cF1cIj09THUuY2FsbCh0KX1mdW5jdGlvbiBLZSh0KXtyZXR1cm4gdHlwZW9mIHQ9PVwic3RyaW5nXCJ8fCF2aSh0KSYmWmUodCkmJlwiW29iamVjdCBTdHJpbmddXCI9PUx1LmNhbGwodCl9ZnVuY3Rpb24gR2UodCl7cmV0dXJuIHR5cGVvZiB0PT1cInN5bWJvbFwifHxaZSh0KSYmXCJbb2JqZWN0IFN5bWJvbF1cIj09THUuY2FsbCh0KX1mdW5jdGlvbiBKZSh0KXtyZXR1cm4gWmUodCkmJk5lKHQubGVuZ3RoKSYmISFNdFtMdS5jYWxsKHQpXX1mdW5jdGlvbiBZZSh0KXtpZighdClyZXR1cm5bXTtpZih6ZSh0KSlyZXR1cm4gS2UodCk/dC5tYXRjaChJdCk6bHIodCk7aWYoUHUmJnRbUHVdKXJldHVybiB6KHRbUHVdKCkpO3ZhciBuPVRyKHQpO1xyXG5yZXR1cm4oXCJbb2JqZWN0IE1hcF1cIj09bj9VOlwiW29iamVjdCBTZXRdXCI9PW4/RDpmdSkodCl9ZnVuY3Rpb24gSGUodCl7cmV0dXJuIHQ/KHQ9dHUodCksdD09PXF8fHQ9PT0tcT8xLjc5NzY5MzEzNDg2MjMxNTdlMzA4KigwPnQ/LTE6MSk6dD09PXQ/dDowKTowPT09dD90OjB9ZnVuY3Rpb24gUWUodCl7dD1IZSh0KTt2YXIgbj10JTE7cmV0dXJuIHQ9PT10P24/dC1uOnQ6MH1mdW5jdGlvbiBYZSh0KXtyZXR1cm4gdD9ubihRZSh0KSwwLDQyOTQ5NjcyOTUpOjB9ZnVuY3Rpb24gdHUodCl7aWYodHlwZW9mIHQ9PVwibnVtYmVyXCIpcmV0dXJuIHQ7aWYoR2UodCkpcmV0dXJuIFY7aWYoUGUodCkmJih0PURlKHQudmFsdWVPZik/dC52YWx1ZU9mKCk6dCx0PVBlKHQpP3QrXCJcIjp0KSx0eXBlb2YgdCE9XCJzdHJpbmdcIilyZXR1cm4gMD09PXQ/dDordDt0PXQucmVwbGFjZShjdCxcIlwiKTt2YXIgbj1kdC50ZXN0KHQpO3JldHVybiBufHxidC50ZXN0KHQpP050KHQuc2xpY2UoMiksbj8yOjgpOmd0LnRlc3QodCk/VjordDtcclxufWZ1bmN0aW9uIG51KHQpe3JldHVybiBzcih0LGl1KHQpKX1mdW5jdGlvbiBydSh0KXtyZXR1cm4gbnVsbD09dD9cIlwiOlluKHQpfWZ1bmN0aW9uIGV1KHQsbixyKXtyZXR1cm4gdD1udWxsPT10P1Q6dm4odCxuKSx0PT09VD9yOnR9ZnVuY3Rpb24gdXUodCxuKXtyZXR1cm4gbnVsbCE9dCYmcXIodCxuLGJuKX1mdW5jdGlvbiBvdSh0KXt2YXIgbj1yZSh0KTtpZighbiYmIXplKHQpKXJldHVybiBIdShPYmplY3QodCkpO3ZhciByLGU9SnIodCksdT0hIWUsZT1lfHxbXSxvPWUubGVuZ3RoO2ZvcihyIGluIHQpIXluKHQscil8fHUmJihcImxlbmd0aFwiPT1yfHxRcihyLG8pKXx8biYmXCJjb25zdHJ1Y3RvclwiPT1yfHxlLnB1c2gocik7cmV0dXJuIGV9ZnVuY3Rpb24gaXUodCl7Zm9yKHZhciBuPS0xLHI9cmUodCksZT1Fbih0KSx1PWUubGVuZ3RoLG89SnIodCksaT0hIW8sbz1vfHxbXSxmPW8ubGVuZ3RoOysrbjx1Oyl7dmFyIGM9ZVtuXTtpJiYoXCJsZW5ndGhcIj09Y3x8UXIoYyxmKSl8fFwiY29uc3RydWN0b3JcIj09YyYmKHJ8fCFSdS5jYWxsKHQsYykpfHxvLnB1c2goYyk7XHJcbn1yZXR1cm4gb31mdW5jdGlvbiBmdSh0KXtyZXR1cm4gdD9rKHQsb3UodCkpOltdfWZ1bmN0aW9uIGN1KHQpe3JldHVybiBQaShydSh0KS50b0xvd2VyQ2FzZSgpKX1mdW5jdGlvbiBhdSh0KXtyZXR1cm4odD1ydSh0KSkmJnQucmVwbGFjZShqdCxXKS5yZXBsYWNlKFN0LFwiXCIpfWZ1bmN0aW9uIGx1KHQsbixyKXtyZXR1cm4gdD1ydSh0KSxuPXI/VDpuLG49PT1UJiYobj1CdC50ZXN0KHQpP1J0OnN0KSx0Lm1hdGNoKG4pfHxbXX1mdW5jdGlvbiBzdSh0KXtyZXR1cm4gZnVuY3Rpb24oKXtyZXR1cm4gdH19ZnVuY3Rpb24gaHUodCl7cmV0dXJuIHR9ZnVuY3Rpb24gcHUodCl7cmV0dXJuIGtuKHR5cGVvZiB0PT1cImZ1bmN0aW9uXCI/dDpybih0LHRydWUpKX1mdW5jdGlvbiBfdSh0LG4scil7dmFyIGU9b3Uobiksbz1fbihuLGUpO251bGwhPXJ8fFBlKG4pJiYoby5sZW5ndGh8fCFlLmxlbmd0aCl8fChyPW4sbj10LHQ9dGhpcyxvPV9uKG4sb3UobikpKTt2YXIgaT0hKFBlKHIpJiZcImNoYWluXCJpbiByJiYhci5jaGFpbiksZj1EZSh0KTtcclxucmV0dXJuIHUobyxmdW5jdGlvbihyKXt2YXIgZT1uW3JdO3Rbcl09ZSxmJiYodC5wcm90b3R5cGVbcl09ZnVuY3Rpb24oKXt2YXIgbj10aGlzLl9fY2hhaW5fXztpZihpfHxuKXt2YXIgcj10KHRoaXMuX193cmFwcGVkX18pO3JldHVybihyLl9fYWN0aW9uc19fPWxyKHRoaXMuX19hY3Rpb25zX18pKS5wdXNoKHtmdW5jOmUsYXJnczphcmd1bWVudHMsdGhpc0FyZzp0fSksci5fX2NoYWluX189bixyfXJldHVybiBlLmFwcGx5KHQscyhbdGhpcy52YWx1ZSgpXSxhcmd1bWVudHMpKX0pfSksdH1mdW5jdGlvbiB2dSgpe31mdW5jdGlvbiBndSh0KXtyZXR1cm4gdGUodCk/VW4oaWUodCkpOiRuKHQpfWZ1bmN0aW9uIGR1KCl7cmV0dXJuW119ZnVuY3Rpb24geXUoKXtyZXR1cm4gZmFsc2V9Uj1SP0d0LmRlZmF1bHRzKHt9LFIsR3QucGljayhLdCxMdCkpOkt0O3ZhciBidT1SLkRhdGUseHU9Ui5FcnJvcixqdT1SLk1hdGgsd3U9Ui5SZWdFeHAsbXU9Ui5UeXBlRXJyb3IsQXU9Ui5BcnJheS5wcm90b3R5cGUsT3U9Ui5PYmplY3QucHJvdG90eXBlLGt1PVIuU3RyaW5nLnByb3RvdHlwZSxFdT1SW1wiX19jb3JlLWpzX3NoYXJlZF9fXCJdLFN1PWZ1bmN0aW9uKCl7XHJcbnZhciB0PS9bXi5dKyQvLmV4ZWMoRXUmJkV1LmtleXMmJkV1LmtleXMuSUVfUFJPVE98fFwiXCIpO3JldHVybiB0P1wiU3ltYm9sKHNyYylfMS5cIit0OlwiXCJ9KCksSXU9Ui5GdW5jdGlvbi5wcm90b3R5cGUudG9TdHJpbmcsUnU9T3UuaGFzT3duUHJvcGVydHksV3U9MCxCdT1JdS5jYWxsKE9iamVjdCksTHU9T3UudG9TdHJpbmcsTXU9S3QuXyxDdT13dShcIl5cIitJdS5jYWxsKFJ1KS5yZXBsYWNlKGl0LFwiXFxcXCQmXCIpLnJlcGxhY2UoL2hhc093blByb3BlcnR5fChmdW5jdGlvbikuKj8oPz1cXFxcXFwoKXwgZm9yIC4rPyg/PVxcXFxcXF0pL2csXCIkMS4qP1wiKStcIiRcIiksenU9VHQ/Ui5CdWZmZXI6VCxVdT1SLlJlZmxlY3QsJHU9Ui5TeW1ib2wsRHU9Ui5VaW50OEFycmF5LEZ1PVV1P1V1LmY6VCxOdT1PYmplY3QuZ2V0T3duUHJvcGVydHlTeW1ib2xzLFB1PXR5cGVvZihQdT0kdSYmJHUuaXRlcmF0b3IpPT1cInN5bWJvbFwiP1B1OlQsWnU9T2JqZWN0LmNyZWF0ZSxUdT1PdS5wcm9wZXJ0eUlzRW51bWVyYWJsZSxxdT1BdS5zcGxpY2UsVnU9anUuY2VpbCxLdT1qdS5mbG9vcixHdT1PYmplY3QuZ2V0UHJvdG90eXBlT2YsSnU9Ui5pc0Zpbml0ZSxZdT1BdS5qb2luLEh1PU9iamVjdC5rZXlzLFF1PWp1Lm1heCxYdT1qdS5taW4sdG89Ui5wYXJzZUludCxubz1qdS5yYW5kb20scm89a3UucmVwbGFjZSxlbz1BdS5yZXZlcnNlLHVvPWt1LnNwbGl0LG9vPVByKFIsXCJEYXRhVmlld1wiKSxpbz1QcihSLFwiTWFwXCIpLGZvPVByKFIsXCJQcm9taXNlXCIpLGNvPVByKFIsXCJTZXRcIiksYW89UHIoUixcIldlYWtNYXBcIiksbG89UHIoT2JqZWN0LFwiY3JlYXRlXCIpLHNvPWFvJiZuZXcgYW8saG89IVR1LmNhbGwoe1xyXG52YWx1ZU9mOjF9LFwidmFsdWVPZlwiKSxwbz17fSxfbz1mZShvbyksdm89ZmUoaW8pLGdvPWZlKGZvKSx5bz1mZShjbyksYm89ZmUoYW8pLHhvPSR1PyR1LnByb3RvdHlwZTpULGpvPXhvP3hvLnZhbHVlT2Y6VCx3bz14bz94by50b1N0cmluZzpUO090LnRlbXBsYXRlU2V0dGluZ3M9e2VzY2FwZTp0dCxldmFsdWF0ZTpudCxpbnRlcnBvbGF0ZTpydCx2YXJpYWJsZTpcIlwiLGltcG9ydHM6e186T3R9fSxPdC5wcm90b3R5cGU9a3QucHJvdG90eXBlLE90LnByb3RvdHlwZS5jb25zdHJ1Y3Rvcj1PdCx6dC5wcm90b3R5cGU9dW4oa3QucHJvdG90eXBlKSx6dC5wcm90b3R5cGUuY29uc3RydWN0b3I9enQsVXQucHJvdG90eXBlPXVuKGt0LnByb3RvdHlwZSksVXQucHJvdG90eXBlLmNvbnN0cnVjdG9yPVV0LCR0LnByb3RvdHlwZS5jbGVhcj1mdW5jdGlvbigpe3RoaXMuX19kYXRhX189bG8/bG8obnVsbCk6e319LCR0LnByb3RvdHlwZVtcImRlbGV0ZVwiXT1mdW5jdGlvbih0KXtyZXR1cm4gdGhpcy5oYXModCkmJmRlbGV0ZSB0aGlzLl9fZGF0YV9fW3RdO1xyXG59LCR0LnByb3RvdHlwZS5nZXQ9ZnVuY3Rpb24odCl7dmFyIG49dGhpcy5fX2RhdGFfXztyZXR1cm4gbG8/KHQ9blt0XSxcIl9fbG9kYXNoX2hhc2hfdW5kZWZpbmVkX19cIj09PXQ/VDp0KTpSdS5jYWxsKG4sdCk/blt0XTpUfSwkdC5wcm90b3R5cGUuaGFzPWZ1bmN0aW9uKHQpe3ZhciBuPXRoaXMuX19kYXRhX187cmV0dXJuIGxvP25bdF0hPT1UOlJ1LmNhbGwobix0KX0sJHQucHJvdG90eXBlLnNldD1mdW5jdGlvbih0LG4pe3JldHVybiB0aGlzLl9fZGF0YV9fW3RdPWxvJiZuPT09VD9cIl9fbG9kYXNoX2hhc2hfdW5kZWZpbmVkX19cIjpuLHRoaXN9LER0LnByb3RvdHlwZS5jbGVhcj1mdW5jdGlvbigpe3RoaXMuX19kYXRhX189W119LER0LnByb3RvdHlwZVtcImRlbGV0ZVwiXT1mdW5jdGlvbih0KXt2YXIgbj10aGlzLl9fZGF0YV9fO3JldHVybiB0PUh0KG4sdCksMD50P2ZhbHNlOih0PT1uLmxlbmd0aC0xP24ucG9wKCk6cXUuY2FsbChuLHQsMSksdHJ1ZSl9LER0LnByb3RvdHlwZS5nZXQ9ZnVuY3Rpb24odCl7XHJcbnZhciBuPXRoaXMuX19kYXRhX187cmV0dXJuIHQ9SHQobix0KSwwPnQ/VDpuW3RdWzFdfSxEdC5wcm90b3R5cGUuaGFzPWZ1bmN0aW9uKHQpe3JldHVybi0xPEh0KHRoaXMuX19kYXRhX18sdCl9LER0LnByb3RvdHlwZS5zZXQ9ZnVuY3Rpb24odCxuKXt2YXIgcj10aGlzLl9fZGF0YV9fLGU9SHQocix0KTtyZXR1cm4gMD5lP3IucHVzaChbdCxuXSk6cltlXVsxXT1uLHRoaXN9LFB0LnByb3RvdHlwZS5jbGVhcj1mdW5jdGlvbigpe3RoaXMuX19kYXRhX189e2hhc2g6bmV3ICR0LG1hcDpuZXcoaW98fER0KSxzdHJpbmc6bmV3ICR0fX0sUHQucHJvdG90eXBlW1wiZGVsZXRlXCJdPWZ1bmN0aW9uKHQpe3JldHVybiBGcih0aGlzLHQpW1wiZGVsZXRlXCJdKHQpfSxQdC5wcm90b3R5cGUuZ2V0PWZ1bmN0aW9uKHQpe3JldHVybiBGcih0aGlzLHQpLmdldCh0KX0sUHQucHJvdG90eXBlLmhhcz1mdW5jdGlvbih0KXtyZXR1cm4gRnIodGhpcyx0KS5oYXModCl9LFB0LnByb3RvdHlwZS5zZXQ9ZnVuY3Rpb24odCxuKXtcclxucmV0dXJuIEZyKHRoaXMsdCkuc2V0KHQsbiksdGhpc30sWnQucHJvdG90eXBlLmFkZD1adC5wcm90b3R5cGUucHVzaD1mdW5jdGlvbih0KXtyZXR1cm4gdGhpcy5fX2RhdGFfXy5zZXQodCxcIl9fbG9kYXNoX2hhc2hfdW5kZWZpbmVkX19cIiksdGhpc30sWnQucHJvdG90eXBlLmhhcz1mdW5jdGlvbih0KXtyZXR1cm4gdGhpcy5fX2RhdGFfXy5oYXModCl9LHF0LnByb3RvdHlwZS5jbGVhcj1mdW5jdGlvbigpe3RoaXMuX19kYXRhX189bmV3IER0fSxxdC5wcm90b3R5cGVbXCJkZWxldGVcIl09ZnVuY3Rpb24odCl7cmV0dXJuIHRoaXMuX19kYXRhX19bXCJkZWxldGVcIl0odCl9LHF0LnByb3RvdHlwZS5nZXQ9ZnVuY3Rpb24odCl7cmV0dXJuIHRoaXMuX19kYXRhX18uZ2V0KHQpfSxxdC5wcm90b3R5cGUuaGFzPWZ1bmN0aW9uKHQpe3JldHVybiB0aGlzLl9fZGF0YV9fLmhhcyh0KX0scXQucHJvdG90eXBlLnNldD1mdW5jdGlvbih0LG4pe3ZhciByPXRoaXMuX19kYXRhX187cmV0dXJuIHIgaW5zdGFuY2VvZiBEdCYmMjAwPT1yLl9fZGF0YV9fLmxlbmd0aCYmKHI9dGhpcy5fX2RhdGFfXz1uZXcgUHQoci5fX2RhdGFfXykpLFxyXG5yLnNldCh0LG4pLHRoaXN9O3ZhciBtbz12cihobiksQW89dnIocG4sdHJ1ZSksT289Z3IoKSxrbz1ncih0cnVlKTtGdSYmIVR1LmNhbGwoe3ZhbHVlT2Y6MX0sXCJ2YWx1ZU9mXCIpJiYoRW49ZnVuY3Rpb24odCl7cmV0dXJuIHooRnUodCkpfSk7dmFyIEVvPXNvP2Z1bmN0aW9uKHQsbil7cmV0dXJuIHNvLnNldCh0LG4pLHR9Omh1LFNvPWNvJiYxL0QobmV3IGNvKFssLTBdKSlbMV09PXE/ZnVuY3Rpb24odCl7cmV0dXJuIG5ldyBjbyh0KX06dnUsSW89c28/ZnVuY3Rpb24odCl7cmV0dXJuIHNvLmdldCh0KX06dnUsUm89VW4oXCJsZW5ndGhcIik7TnV8fChacj1kdSk7dmFyIFdvPU51P2Z1bmN0aW9uKHQpe2Zvcih2YXIgbj1bXTt0OylzKG4sWnIodCkpLHQ9R3UoT2JqZWN0KHQpKTtyZXR1cm4gbn06WnI7KG9vJiZcIltvYmplY3QgRGF0YVZpZXddXCIhPVRyKG5ldyBvbyhuZXcgQXJyYXlCdWZmZXIoMSkpKXx8aW8mJlwiW29iamVjdCBNYXBdXCIhPVRyKG5ldyBpbyl8fGZvJiZcIltvYmplY3QgUHJvbWlzZV1cIiE9VHIoZm8ucmVzb2x2ZSgpKXx8Y28mJlwiW29iamVjdCBTZXRdXCIhPVRyKG5ldyBjbyl8fGFvJiZcIltvYmplY3QgV2Vha01hcF1cIiE9VHIobmV3IGFvKSkmJihUcj1mdW5jdGlvbih0KXtcclxudmFyIG49THUuY2FsbCh0KTtpZih0PSh0PVwiW29iamVjdCBPYmplY3RdXCI9PW4/dC5jb25zdHJ1Y3RvcjpUKT9mZSh0KTpUKXN3aXRjaCh0KXtjYXNlIF9vOnJldHVyblwiW29iamVjdCBEYXRhVmlld11cIjtjYXNlIHZvOnJldHVyblwiW29iamVjdCBNYXBdXCI7Y2FzZSBnbzpyZXR1cm5cIltvYmplY3QgUHJvbWlzZV1cIjtjYXNlIHlvOnJldHVyblwiW29iamVjdCBTZXRdXCI7Y2FzZSBibzpyZXR1cm5cIltvYmplY3QgV2Vha01hcF1cIn1yZXR1cm4gbn0pO3ZhciBCbz1FdT9EZTp5dSxMbz1mdW5jdGlvbigpe3ZhciB0PTAsbj0wO3JldHVybiBmdW5jdGlvbihyLGUpe3ZhciB1PWtlKCksbz0xNi0odS1uKTtpZihuPXUsbz4wKXtpZigxNTA8PSsrdClyZXR1cm4gcn1lbHNlIHQ9MDtyZXR1cm4gRW8ocixlKX19KCksTW89QmUoZnVuY3Rpb24odCl7dmFyIG49W107cmV0dXJuIHJ1KHQpLnJlcGxhY2Uob3QsZnVuY3Rpb24odCxyLGUsdSl7bi5wdXNoKGU/dS5yZXBsYWNlKGh0LFwiJDFcIik6cnx8dCl9KSxcclxubn0pLENvPUxlKGZ1bmN0aW9uKHQsbil7cmV0dXJuIFVlKHQpP2ZuKHQsc24obiwxLFVlLHRydWUpKTpbXX0pLHpvPUxlKGZ1bmN0aW9uKHQsbil7dmFyIHI9X2Uobik7cmV0dXJuIFVlKHIpJiYocj1UKSxVZSh0KT9mbih0LHNuKG4sMSxVZSx0cnVlKSxEcihyKSk6W119KSxVbz1MZShmdW5jdGlvbih0LG4pe3ZhciByPV9lKG4pO3JldHVybiBVZShyKSYmKHI9VCksVWUodCk/Zm4odCxzbihuLDEsVWUsdHJ1ZSksVCxyKTpbXX0pLCRvPUxlKGZ1bmN0aW9uKHQpe3ZhciBuPWwodCxycik7cmV0dXJuIG4ubGVuZ3RoJiZuWzBdPT09dFswXT94bihuKTpbXX0pLERvPUxlKGZ1bmN0aW9uKHQpe3ZhciBuPV9lKHQpLHI9bCh0LHJyKTtyZXR1cm4gbj09PV9lKHIpP249VDpyLnBvcCgpLHIubGVuZ3RoJiZyWzBdPT09dFswXT94bihyLERyKG4pKTpbXX0pLEZvPUxlKGZ1bmN0aW9uKHQpe3ZhciBuPV9lKHQpLHI9bCh0LHJyKTtyZXR1cm4gbj09PV9lKHIpP249VDpyLnBvcCgpLHIubGVuZ3RoJiZyWzBdPT09dFswXT94bihyLFQsbik6W107XHJcbn0pLE5vPUxlKHZlKSxQbz1MZShmdW5jdGlvbih0LG4pe249c24obiwxKTt2YXIgcj10P3QubGVuZ3RoOjAsZT10bih0LG4pO3JldHVybiBGbih0LGwobixmdW5jdGlvbih0KXtyZXR1cm4gUXIodCxyKT8rdDp0fSkuc29ydChmcikpLGV9KSxabz1MZShmdW5jdGlvbih0KXtyZXR1cm4gSG4oc24odCwxLFVlLHRydWUpKX0pLFRvPUxlKGZ1bmN0aW9uKHQpe3ZhciBuPV9lKHQpO3JldHVybiBVZShuKSYmKG49VCksSG4oc24odCwxLFVlLHRydWUpLERyKG4pKX0pLHFvPUxlKGZ1bmN0aW9uKHQpe3ZhciBuPV9lKHQpO3JldHVybiBVZShuKSYmKG49VCksSG4oc24odCwxLFVlLHRydWUpLFQsbil9KSxWbz1MZShmdW5jdGlvbih0LG4pe3JldHVybiBVZSh0KT9mbih0LG4pOltdfSksS289TGUoZnVuY3Rpb24odCl7cmV0dXJuIHRyKGYodCxVZSkpfSksR289TGUoZnVuY3Rpb24odCl7dmFyIG49X2UodCk7cmV0dXJuIFVlKG4pJiYobj1UKSx0cihmKHQsVWUpLERyKG4pKX0pLEpvPUxlKGZ1bmN0aW9uKHQpe1xyXG52YXIgbj1fZSh0KTtyZXR1cm4gVWUobikmJihuPVQpLHRyKGYodCxVZSksVCxuKX0pLFlvPUxlKGRlKSxIbz1MZShmdW5jdGlvbih0KXt2YXIgbj10Lmxlbmd0aCxuPW4+MT90W24tMV06VCxuPXR5cGVvZiBuPT1cImZ1bmN0aW9uXCI/KHQucG9wKCksbik6VDtyZXR1cm4geWUodCxuKX0pLFFvPUxlKGZ1bmN0aW9uKHQpe2Z1bmN0aW9uIG4obil7cmV0dXJuIHRuKG4sdCl9dD1zbih0LDEpO3ZhciByPXQubGVuZ3RoLGU9cj90WzBdOjAsdT10aGlzLl9fd3JhcHBlZF9fO3JldHVybiEocj4xfHx0aGlzLl9fYWN0aW9uc19fLmxlbmd0aCkmJnUgaW5zdGFuY2VvZiBVdCYmUXIoZSk/KHU9dS5zbGljZShlLCtlKyhyPzE6MCkpLHUuX19hY3Rpb25zX18ucHVzaCh7ZnVuYzp4ZSxhcmdzOltuXSx0aGlzQXJnOlR9KSxuZXcgenQodSx0aGlzLl9fY2hhaW5fXykudGhydShmdW5jdGlvbih0KXtyZXR1cm4gciYmIXQubGVuZ3RoJiZ0LnB1c2goVCksdH0pKTp0aGlzLnRocnUobil9KSxYbz1wcihmdW5jdGlvbih0LG4scil7XHJcblJ1LmNhbGwodCxyKT8rK3Rbcl06dFtyXT0xfSksdGk9cHIoZnVuY3Rpb24odCxuLHIpe1J1LmNhbGwodCxyKT90W3JdLnB1c2gobik6dFtyXT1bbl19KSxuaT1MZShmdW5jdGlvbih0LG4sZSl7dmFyIHU9LTEsbz10eXBlb2Ygbj09XCJmdW5jdGlvblwiLGk9dGUobiksZj16ZSh0KT9BcnJheSh0Lmxlbmd0aCk6W107cmV0dXJuIG1vKHQsZnVuY3Rpb24odCl7dmFyIGM9bz9uOmkmJm51bGwhPXQ/dFtuXTpUO2ZbKyt1XT1jP3IoYyx0LGUpOnduKHQsbixlKX0pLGZ9KSxyaT1wcihmdW5jdGlvbih0LG4scil7dFtyXT1ufSksZWk9cHIoZnVuY3Rpb24odCxuLHIpe3Rbcj8wOjFdLnB1c2gobil9LGZ1bmN0aW9uKCl7cmV0dXJuW1tdLFtdXX0pLHVpPUxlKGZ1bmN0aW9uKHQsbil7aWYobnVsbD09dClyZXR1cm5bXTt2YXIgcj1uLmxlbmd0aDtyZXR1cm4gcj4xJiZYcih0LG5bMF0sblsxXSk/bj1bXTpyPjImJlhyKG5bMF0sblsxXSxuWzJdKSYmKG49W25bMF1dKSxuPTE9PW4ubGVuZ3RoJiZ2aShuWzBdKT9uWzBdOnNuKG4sMSxIciksXHJcbk1uKHQsbixbXSl9KSxvaT1MZShmdW5jdGlvbih0LG4scil7dmFyIGU9MTtpZihyLmxlbmd0aCl2YXIgdT0kKHIsJHIob2kpKSxlPTMyfGU7cmV0dXJuIE1yKHQsZSxuLHIsdSl9KSxpaT1MZShmdW5jdGlvbih0LG4scil7dmFyIGU9MztpZihyLmxlbmd0aCl2YXIgdT0kKHIsJHIoaWkpKSxlPTMyfGU7cmV0dXJuIE1yKG4sZSx0LHIsdSl9KSxmaT1MZShmdW5jdGlvbih0LG4pe3JldHVybiBvbih0LDEsbil9KSxjaT1MZShmdW5jdGlvbih0LG4scil7cmV0dXJuIG9uKHQsdHUobil8fDAscil9KTtCZS5DYWNoZT1QdDt2YXIgYWk9TGUoZnVuY3Rpb24odCxuKXtuPTE9PW4ubGVuZ3RoJiZ2aShuWzBdKT9sKG5bMF0sTyhEcigpKSk6bChzbihuLDEsSHIpLE8oRHIoKSkpO3ZhciBlPW4ubGVuZ3RoO3JldHVybiBMZShmdW5jdGlvbih1KXtmb3IodmFyIG89LTEsaT1YdSh1Lmxlbmd0aCxlKTsrK288aTspdVtvXT1uW29dLmNhbGwodGhpcyx1W29dKTtyZXR1cm4gcih0LHRoaXMsdSl9KX0pLGxpPUxlKGZ1bmN0aW9uKHQsbil7XHJcbnZhciByPSQobiwkcihsaSkpO3JldHVybiBNcih0LDMyLFQsbixyKX0pLHNpPUxlKGZ1bmN0aW9uKHQsbil7dmFyIHI9JChuLCRyKHNpKSk7cmV0dXJuIE1yKHQsNjQsVCxuLHIpfSksaGk9TGUoZnVuY3Rpb24odCxuKXtyZXR1cm4gTXIodCwyNTYsVCxULFQsc24obiwxKSl9KSxwaT1ScihkbiksX2k9UnIoZnVuY3Rpb24odCxuKXtyZXR1cm4gdD49bn0pLHZpPUFycmF5LmlzQXJyYXksZ2k9enU/ZnVuY3Rpb24odCl7cmV0dXJuIHQgaW5zdGFuY2VvZiB6dX06eXUsZGk9UnIoU24pLHlpPVJyKGZ1bmN0aW9uKHQsbil7cmV0dXJuIG4+PXR9KSxiaT1fcihmdW5jdGlvbih0LG4pe2lmKGhvfHxyZShuKXx8emUobikpc3IobixvdShuKSx0KTtlbHNlIGZvcih2YXIgciBpbiBuKVJ1LmNhbGwobixyKSYmWXQodCxyLG5bcl0pfSkseGk9X3IoZnVuY3Rpb24odCxuKXtpZihob3x8cmUobil8fHplKG4pKXNyKG4saXUobiksdCk7ZWxzZSBmb3IodmFyIHIgaW4gbilZdCh0LHIsbltyXSl9KSxqaT1fcihmdW5jdGlvbih0LG4scixlKXtcclxuc3IobixpdShuKSx0LGUpfSksd2k9X3IoZnVuY3Rpb24odCxuLHIsZSl7c3IobixvdShuKSx0LGUpfSksbWk9TGUoZnVuY3Rpb24odCxuKXtyZXR1cm4gdG4odCxzbihuLDEpKX0pLEFpPUxlKGZ1bmN0aW9uKHQpe3JldHVybiB0LnB1c2goVCxWdCkscihqaSxULHQpfSksT2k9TGUoZnVuY3Rpb24odCl7cmV0dXJuIHQucHVzaChULHVlKSxyKFJpLFQsdCl9KSxraT1BcihmdW5jdGlvbih0LG4scil7dFtuXT1yfSxzdShodSkpLEVpPUFyKGZ1bmN0aW9uKHQsbixyKXtSdS5jYWxsKHQsbik/dFtuXS5wdXNoKHIpOnRbbl09W3JdfSxEciksU2k9TGUod24pLElpPV9yKGZ1bmN0aW9uKHQsbixyKXtCbih0LG4scil9KSxSaT1fcihmdW5jdGlvbih0LG4scixlKXtCbih0LG4scixlKX0pLFdpPUxlKGZ1bmN0aW9uKHQsbil7cmV0dXJuIG51bGw9PXQ/e306KG49bChzbihuLDEpLGllKSxDbih0LGZuKGduKHQsaXUsV28pLG4pKSl9KSxCaT1MZShmdW5jdGlvbih0LG4pe3JldHVybiBudWxsPT10P3t9OkNuKHQsbChzbihuLDEpLGllKSk7XHJcbn0pLExpPUxyKG91KSxNaT1McihpdSksQ2k9YnIoZnVuY3Rpb24odCxuLHIpe3JldHVybiBuPW4udG9Mb3dlckNhc2UoKSx0KyhyP2N1KG4pOm4pfSksemk9YnIoZnVuY3Rpb24odCxuLHIpe3JldHVybiB0KyhyP1wiLVwiOlwiXCIpK24udG9Mb3dlckNhc2UoKX0pLFVpPWJyKGZ1bmN0aW9uKHQsbixyKXtyZXR1cm4gdCsocj9cIiBcIjpcIlwiKStuLnRvTG93ZXJDYXNlKCl9KSwkaT15cihcInRvTG93ZXJDYXNlXCIpLERpPWJyKGZ1bmN0aW9uKHQsbixyKXtyZXR1cm4gdCsocj9cIl9cIjpcIlwiKStuLnRvTG93ZXJDYXNlKCl9KSxGaT1icihmdW5jdGlvbih0LG4scil7cmV0dXJuIHQrKHI/XCIgXCI6XCJcIikrUGkobil9KSxOaT1icihmdW5jdGlvbih0LG4scil7cmV0dXJuIHQrKHI/XCIgXCI6XCJcIikrbi50b1VwcGVyQ2FzZSgpfSksUGk9eXIoXCJ0b1VwcGVyQ2FzZVwiKSxaaT1MZShmdW5jdGlvbih0LG4pe3RyeXtyZXR1cm4gcih0LFQsbil9Y2F0Y2goZSl7cmV0dXJuICRlKGUpP2U6bmV3IHh1KGUpfX0pLFRpPUxlKGZ1bmN0aW9uKHQsbil7XHJcbnJldHVybiB1KHNuKG4sMSksZnVuY3Rpb24obil7bj1pZShuKSx0W25dPW9pKHRbbl0sdCl9KSx0fSkscWk9d3IoKSxWaT13cih0cnVlKSxLaT1MZShmdW5jdGlvbih0LG4pe3JldHVybiBmdW5jdGlvbihyKXtyZXR1cm4gd24ocix0LG4pfX0pLEdpPUxlKGZ1bmN0aW9uKHQsbil7cmV0dXJuIGZ1bmN0aW9uKHIpe3JldHVybiB3bih0LHIsbil9fSksSmk9a3IobCksWWk9a3IoaSksSGk9a3IoXyksUWk9SXIoKSxYaT1Jcih0cnVlKSx0Zj1PcihmdW5jdGlvbih0LG4pe3JldHVybiB0K259KSxuZj1CcihcImNlaWxcIikscmY9T3IoZnVuY3Rpb24odCxuKXtyZXR1cm4gdC9ufSksZWY9QnIoXCJmbG9vclwiKSx1Zj1PcihmdW5jdGlvbih0LG4pe3JldHVybiB0Km59KSxvZj1CcihcInJvdW5kXCIpLGZmPU9yKGZ1bmN0aW9uKHQsbil7cmV0dXJuIHQtbn0pO3JldHVybiBPdC5hZnRlcj1mdW5jdGlvbih0LG4pe2lmKHR5cGVvZiBuIT1cImZ1bmN0aW9uXCIpdGhyb3cgbmV3IG11KFwiRXhwZWN0ZWQgYSBmdW5jdGlvblwiKTtcclxucmV0dXJuIHQ9UWUodCksZnVuY3Rpb24oKXtyZXR1cm4gMT4tLXQ/bi5hcHBseSh0aGlzLGFyZ3VtZW50cyk6dm9pZCAwfX0sT3QuYXJ5PUVlLE90LmFzc2lnbj1iaSxPdC5hc3NpZ25Jbj14aSxPdC5hc3NpZ25JbldpdGg9amksT3QuYXNzaWduV2l0aD13aSxPdC5hdD1taSxPdC5iZWZvcmU9U2UsT3QuYmluZD1vaSxPdC5iaW5kQWxsPVRpLE90LmJpbmRLZXk9aWksT3QuY2FzdEFycmF5PWZ1bmN0aW9uKCl7aWYoIWFyZ3VtZW50cy5sZW5ndGgpcmV0dXJuW107dmFyIHQ9YXJndW1lbnRzWzBdO3JldHVybiB2aSh0KT90Olt0XX0sT3QuY2hhaW49YmUsT3QuY2h1bms9ZnVuY3Rpb24odCxuLHIpe2lmKG49KHI/WHIodCxuLHIpOm49PT1UKT8xOlF1KFFlKG4pLDApLHI9dD90Lmxlbmd0aDowLCFyfHwxPm4pcmV0dXJuW107Zm9yKHZhciBlPTAsdT0wLG89QXJyYXkoVnUoci9uKSk7cj5lOylvW3UrK109VG4odCxlLGUrPW4pO3JldHVybiBvfSxPdC5jb21wYWN0PWZ1bmN0aW9uKHQpe2Zvcih2YXIgbj0tMSxyPXQ/dC5sZW5ndGg6MCxlPTAsdT1bXTsrK248cjspe1xyXG52YXIgbz10W25dO28mJih1W2UrK109byl9cmV0dXJuIHV9LE90LmNvbmNhdD1mdW5jdGlvbigpe2Zvcih2YXIgdD1hcmd1bWVudHMubGVuZ3RoLG49QXJyYXkodD90LTE6MCkscj1hcmd1bWVudHNbMF0sZT10O2UtLTspbltlLTFdPWFyZ3VtZW50c1tlXTtyZXR1cm4gdD9zKHZpKHIpP2xyKHIpOltyXSxzbihuLDEpKTpbXX0sT3QuY29uZD1mdW5jdGlvbih0KXt2YXIgbj10P3QubGVuZ3RoOjAsZT1EcigpO3JldHVybiB0PW4/bCh0LGZ1bmN0aW9uKHQpe2lmKFwiZnVuY3Rpb25cIiE9dHlwZW9mIHRbMV0pdGhyb3cgbmV3IG11KFwiRXhwZWN0ZWQgYSBmdW5jdGlvblwiKTtyZXR1cm5bZSh0WzBdKSx0WzFdXX0pOltdLExlKGZ1bmN0aW9uKGUpe2Zvcih2YXIgdT0tMTsrK3U8bjspe3ZhciBvPXRbdV07aWYocihvWzBdLHRoaXMsZSkpcmV0dXJuIHIob1sxXSx0aGlzLGUpfX0pfSxPdC5jb25mb3Jtcz1mdW5jdGlvbih0KXtyZXR1cm4gZW4ocm4odCx0cnVlKSl9LE90LmNvbnN0YW50PXN1LE90LmNvdW50Qnk9WG8sXHJcbk90LmNyZWF0ZT1mdW5jdGlvbih0LG4pe3ZhciByPXVuKHQpO3JldHVybiBuP1h0KHIsbik6cn0sT3QuY3Vycnk9SWUsT3QuY3VycnlSaWdodD1SZSxPdC5kZWJvdW5jZT1XZSxPdC5kZWZhdWx0cz1BaSxPdC5kZWZhdWx0c0RlZXA9T2ksT3QuZGVmZXI9ZmksT3QuZGVsYXk9Y2ksT3QuZGlmZmVyZW5jZT1DbyxPdC5kaWZmZXJlbmNlQnk9em8sT3QuZGlmZmVyZW5jZVdpdGg9VW8sT3QuZHJvcD1hZSxPdC5kcm9wUmlnaHQ9bGUsT3QuZHJvcFJpZ2h0V2hpbGU9ZnVuY3Rpb24odCxuKXtyZXR1cm4gdCYmdC5sZW5ndGg/UW4odCxEcihuLDMpLHRydWUsdHJ1ZSk6W119LE90LmRyb3BXaGlsZT1mdW5jdGlvbih0LG4pe3JldHVybiB0JiZ0Lmxlbmd0aD9Rbih0LERyKG4sMyksdHJ1ZSk6W119LE90LmZpbGw9ZnVuY3Rpb24odCxuLHIsZSl7dmFyIHU9dD90Lmxlbmd0aDowO2lmKCF1KXJldHVybltdO2ZvcihyJiZ0eXBlb2YgciE9XCJudW1iZXJcIiYmWHIodCxuLHIpJiYocj0wLGU9dSksdT10Lmxlbmd0aCxcclxucj1RZShyKSwwPnImJihyPS1yPnU/MDp1K3IpLGU9ZT09PVR8fGU+dT91OlFlKGUpLDA+ZSYmKGUrPXUpLGU9cj5lPzA6WGUoZSk7ZT5yOyl0W3IrK109bjtyZXR1cm4gdH0sT3QuZmlsdGVyPWZ1bmN0aW9uKHQsbil7cmV0dXJuKHZpKHQpP2Y6bG4pKHQsRHIobiwzKSl9LE90LmZsYXRNYXA9ZnVuY3Rpb24odCxuKXtyZXR1cm4gc24oQWUodCxuKSwxKX0sT3QuZmxhdE1hcERlZXA9ZnVuY3Rpb24odCxuKXtyZXR1cm4gc24oQWUodCxuKSxxKX0sT3QuZmxhdE1hcERlcHRoPWZ1bmN0aW9uKHQsbixyKXtyZXR1cm4gcj1yPT09VD8xOlFlKHIpLHNuKEFlKHQsbikscil9LE90LmZsYXR0ZW49ZnVuY3Rpb24odCl7cmV0dXJuIHQmJnQubGVuZ3RoP3NuKHQsMSk6W119LE90LmZsYXR0ZW5EZWVwPWZ1bmN0aW9uKHQpe3JldHVybiB0JiZ0Lmxlbmd0aD9zbih0LHEpOltdfSxPdC5mbGF0dGVuRGVwdGg9ZnVuY3Rpb24odCxuKXtyZXR1cm4gdCYmdC5sZW5ndGg/KG49bj09PVQ/MTpRZShuKSxzbih0LG4pKTpbXTtcclxufSxPdC5mbGlwPWZ1bmN0aW9uKHQpe3JldHVybiBNcih0LDUxMil9LE90LmZsb3c9cWksT3QuZmxvd1JpZ2h0PVZpLE90LmZyb21QYWlycz1mdW5jdGlvbih0KXtmb3IodmFyIG49LTEscj10P3QubGVuZ3RoOjAsZT17fTsrK248cjspe3ZhciB1PXRbbl07ZVt1WzBdXT11WzFdfXJldHVybiBlfSxPdC5mdW5jdGlvbnM9ZnVuY3Rpb24odCl7cmV0dXJuIG51bGw9PXQ/W106X24odCxvdSh0KSl9LE90LmZ1bmN0aW9uc0luPWZ1bmN0aW9uKHQpe3JldHVybiBudWxsPT10P1tdOl9uKHQsaXUodCkpfSxPdC5ncm91cEJ5PXRpLE90LmluaXRpYWw9ZnVuY3Rpb24odCl7cmV0dXJuIGxlKHQsMSl9LE90LmludGVyc2VjdGlvbj0kbyxPdC5pbnRlcnNlY3Rpb25CeT1EbyxPdC5pbnRlcnNlY3Rpb25XaXRoPUZvLE90LmludmVydD1raSxPdC5pbnZlcnRCeT1FaSxPdC5pbnZva2VNYXA9bmksT3QuaXRlcmF0ZWU9cHUsT3Qua2V5Qnk9cmksT3Qua2V5cz1vdSxPdC5rZXlzSW49aXUsT3QubWFwPUFlLFxyXG5PdC5tYXBLZXlzPWZ1bmN0aW9uKHQsbil7dmFyIHI9e307cmV0dXJuIG49RHIobiwzKSxobih0LGZ1bmN0aW9uKHQsZSx1KXtyW24odCxlLHUpXT10fSkscn0sT3QubWFwVmFsdWVzPWZ1bmN0aW9uKHQsbil7dmFyIHI9e307cmV0dXJuIG49RHIobiwzKSxobih0LGZ1bmN0aW9uKHQsZSx1KXtyW2VdPW4odCxlLHUpfSkscn0sT3QubWF0Y2hlcz1mdW5jdGlvbih0KXtyZXR1cm4gUm4ocm4odCx0cnVlKSl9LE90Lm1hdGNoZXNQcm9wZXJ0eT1mdW5jdGlvbih0LG4pe3JldHVybiBXbih0LHJuKG4sdHJ1ZSkpfSxPdC5tZW1vaXplPUJlLE90Lm1lcmdlPUlpLE90Lm1lcmdlV2l0aD1SaSxPdC5tZXRob2Q9S2ksT3QubWV0aG9kT2Y9R2ksT3QubWl4aW49X3UsT3QubmVnYXRlPWZ1bmN0aW9uKHQpe2lmKHR5cGVvZiB0IT1cImZ1bmN0aW9uXCIpdGhyb3cgbmV3IG11KFwiRXhwZWN0ZWQgYSBmdW5jdGlvblwiKTtyZXR1cm4gZnVuY3Rpb24oKXtyZXR1cm4hdC5hcHBseSh0aGlzLGFyZ3VtZW50cyl9fSxPdC5udGhBcmc9ZnVuY3Rpb24odCl7XHJcbnJldHVybiB0PVFlKHQpLExlKGZ1bmN0aW9uKG4pe3JldHVybiBMbihuLHQpfSl9LE90Lm9taXQ9V2ksT3Qub21pdEJ5PWZ1bmN0aW9uKHQsbil7cmV0dXJuIG49RHIobiksem4odCxmdW5jdGlvbih0LHIpe3JldHVybiFuKHQscil9KX0sT3Qub25jZT1mdW5jdGlvbih0KXtyZXR1cm4gU2UoMix0KX0sT3Qub3JkZXJCeT1mdW5jdGlvbih0LG4scixlKXtyZXR1cm4gbnVsbD09dD9bXToodmkobil8fChuPW51bGw9PW4/W106W25dKSxyPWU/VDpyLHZpKHIpfHwocj1udWxsPT1yP1tdOltyXSksTW4odCxuLHIpKX0sT3Qub3Zlcj1KaSxPdC5vdmVyQXJncz1haSxPdC5vdmVyRXZlcnk9WWksT3Qub3ZlclNvbWU9SGksT3QucGFydGlhbD1saSxPdC5wYXJ0aWFsUmlnaHQ9c2ksT3QucGFydGl0aW9uPWVpLE90LnBpY2s9QmksT3QucGlja0J5PWZ1bmN0aW9uKHQsbil7cmV0dXJuIG51bGw9PXQ/e306em4odCxEcihuKSl9LE90LnByb3BlcnR5PWd1LE90LnByb3BlcnR5T2Y9ZnVuY3Rpb24odCl7XHJcbnJldHVybiBmdW5jdGlvbihuKXtyZXR1cm4gbnVsbD09dD9UOnZuKHQsbil9fSxPdC5wdWxsPU5vLE90LnB1bGxBbGw9dmUsT3QucHVsbEFsbEJ5PWZ1bmN0aW9uKHQsbixyKXtyZXR1cm4gdCYmdC5sZW5ndGgmJm4mJm4ubGVuZ3RoP0RuKHQsbixEcihyKSk6dH0sT3QucHVsbEFsbFdpdGg9ZnVuY3Rpb24odCxuLHIpe3JldHVybiB0JiZ0Lmxlbmd0aCYmbiYmbi5sZW5ndGg/RG4odCxuLFQscik6dH0sT3QucHVsbEF0PVBvLE90LnJhbmdlPVFpLE90LnJhbmdlUmlnaHQ9WGksT3QucmVhcmc9aGksT3QucmVqZWN0PWZ1bmN0aW9uKHQsbil7dmFyIHI9dmkodCk/ZjpsbjtyZXR1cm4gbj1EcihuLDMpLHIodCxmdW5jdGlvbih0LHIsZSl7cmV0dXJuIW4odCxyLGUpfSl9LE90LnJlbW92ZT1mdW5jdGlvbih0LG4pe3ZhciByPVtdO2lmKCF0fHwhdC5sZW5ndGgpcmV0dXJuIHI7dmFyIGU9LTEsdT1bXSxvPXQubGVuZ3RoO2ZvcihuPURyKG4sMyk7KytlPG87KXt2YXIgaT10W2VdO24oaSxlLHQpJiYoci5wdXNoKGkpLFxyXG51LnB1c2goZSkpfXJldHVybiBGbih0LHUpLHJ9LE90LnJlc3Q9TGUsT3QucmV2ZXJzZT1nZSxPdC5zYW1wbGVTaXplPU9lLE90LnNldD1mdW5jdGlvbih0LG4scil7cmV0dXJuIG51bGw9PXQ/dDpabih0LG4scil9LE90LnNldFdpdGg9ZnVuY3Rpb24odCxuLHIsZSl7cmV0dXJuIGU9dHlwZW9mIGU9PVwiZnVuY3Rpb25cIj9lOlQsbnVsbD09dD90OlpuKHQsbixyLGUpfSxPdC5zaHVmZmxlPWZ1bmN0aW9uKHQpe3JldHVybiBPZSh0LDQyOTQ5NjcyOTUpfSxPdC5zbGljZT1mdW5jdGlvbih0LG4scil7dmFyIGU9dD90Lmxlbmd0aDowO3JldHVybiBlPyhyJiZ0eXBlb2YgciE9XCJudW1iZXJcIiYmWHIodCxuLHIpPyhuPTAscj1lKToobj1udWxsPT1uPzA6UWUobikscj1yPT09VD9lOlFlKHIpKSxUbih0LG4scikpOltdfSxPdC5zb3J0Qnk9dWksT3Quc29ydGVkVW5pcT1mdW5jdGlvbih0KXtyZXR1cm4gdCYmdC5sZW5ndGg/R24odCk6W119LE90LnNvcnRlZFVuaXFCeT1mdW5jdGlvbih0LG4pe1xyXG5yZXR1cm4gdCYmdC5sZW5ndGg/R24odCxEcihuKSk6W119LE90LnNwbGl0PWZ1bmN0aW9uKHQsbixyKXtyZXR1cm4gciYmdHlwZW9mIHIhPVwibnVtYmVyXCImJlhyKHQsbixyKSYmKG49cj1UKSxyPXI9PT1UPzQyOTQ5NjcyOTU6cj4+PjAscj8odD1ydSh0KSkmJih0eXBlb2Ygbj09XCJzdHJpbmdcInx8bnVsbCE9biYmIVZlKG4pKSYmKG49WW4obiksXCJcIj09biYmV3QudGVzdCh0KSk/dXIodC5tYXRjaChJdCksMCxyKTp1by5jYWxsKHQsbixyKTpbXX0sT3Quc3ByZWFkPWZ1bmN0aW9uKHQsbil7aWYodHlwZW9mIHQhPVwiZnVuY3Rpb25cIil0aHJvdyBuZXcgbXUoXCJFeHBlY3RlZCBhIGZ1bmN0aW9uXCIpO3JldHVybiBuPW49PT1UPzA6UXUoUWUobiksMCksTGUoZnVuY3Rpb24oZSl7dmFyIHU9ZVtuXTtyZXR1cm4gZT11cihlLDAsbiksdSYmcyhlLHUpLHIodCx0aGlzLGUpfSl9LE90LnRhaWw9ZnVuY3Rpb24odCl7cmV0dXJuIGFlKHQsMSl9LE90LnRha2U9ZnVuY3Rpb24odCxuLHIpe3JldHVybiB0JiZ0Lmxlbmd0aD8obj1yfHxuPT09VD8xOlFlKG4pLFxyXG5Ubih0LDAsMD5uPzA6bikpOltdfSxPdC50YWtlUmlnaHQ9ZnVuY3Rpb24odCxuLHIpe3ZhciBlPXQ/dC5sZW5ndGg6MDtyZXR1cm4gZT8obj1yfHxuPT09VD8xOlFlKG4pLG49ZS1uLFRuKHQsMD5uPzA6bixlKSk6W119LE90LnRha2VSaWdodFdoaWxlPWZ1bmN0aW9uKHQsbil7cmV0dXJuIHQmJnQubGVuZ3RoP1FuKHQsRHIobiwzKSxmYWxzZSx0cnVlKTpbXX0sT3QudGFrZVdoaWxlPWZ1bmN0aW9uKHQsbil7cmV0dXJuIHQmJnQubGVuZ3RoP1FuKHQsRHIobiwzKSk6W119LE90LnRhcD1mdW5jdGlvbih0LG4pe3JldHVybiBuKHQpLHR9LE90LnRocm90dGxlPWZ1bmN0aW9uKHQsbixyKXt2YXIgZT10cnVlLHU9dHJ1ZTtpZih0eXBlb2YgdCE9XCJmdW5jdGlvblwiKXRocm93IG5ldyBtdShcIkV4cGVjdGVkIGEgZnVuY3Rpb25cIik7cmV0dXJuIFBlKHIpJiYoZT1cImxlYWRpbmdcImluIHI/ISFyLmxlYWRpbmc6ZSx1PVwidHJhaWxpbmdcImluIHI/ISFyLnRyYWlsaW5nOnUpLFdlKHQsbix7bGVhZGluZzplLG1heFdhaXQ6bixcclxudHJhaWxpbmc6dX0pfSxPdC50aHJ1PXhlLE90LnRvQXJyYXk9WWUsT3QudG9QYWlycz1MaSxPdC50b1BhaXJzSW49TWksT3QudG9QYXRoPWZ1bmN0aW9uKHQpe3JldHVybiB2aSh0KT9sKHQsaWUpOkdlKHQpP1t0XTpscihNbyh0KSl9LE90LnRvUGxhaW5PYmplY3Q9bnUsT3QudHJhbnNmb3JtPWZ1bmN0aW9uKHQsbixyKXt2YXIgZT12aSh0KXx8SmUodCk7aWYobj1EcihuLDQpLG51bGw9PXIpaWYoZXx8UGUodCkpe3ZhciBvPXQuY29uc3RydWN0b3I7cj1lP3ZpKHQpP25ldyBvOltdOkRlKG8pP3VuKEd1KE9iamVjdCh0KSkpOnt9fWVsc2Ugcj17fTtyZXR1cm4oZT91OmhuKSh0LGZ1bmN0aW9uKHQsZSx1KXtyZXR1cm4gbihyLHQsZSx1KX0pLHJ9LE90LnVuYXJ5PWZ1bmN0aW9uKHQpe3JldHVybiBFZSh0LDEpfSxPdC51bmlvbj1abyxPdC51bmlvbkJ5PVRvLE90LnVuaW9uV2l0aD1xbyxPdC51bmlxPWZ1bmN0aW9uKHQpe3JldHVybiB0JiZ0Lmxlbmd0aD9Ibih0KTpbXX0sT3QudW5pcUJ5PWZ1bmN0aW9uKHQsbil7XHJcbnJldHVybiB0JiZ0Lmxlbmd0aD9Ibih0LERyKG4pKTpbXX0sT3QudW5pcVdpdGg9ZnVuY3Rpb24odCxuKXtyZXR1cm4gdCYmdC5sZW5ndGg/SG4odCxULG4pOltdfSxPdC51bnNldD1mdW5jdGlvbih0LG4pe3ZhciByO2lmKG51bGw9PXQpcj10cnVlO2Vsc2V7cj10O3ZhciBlPW4sZT10ZShlLHIpP1tlXTplcihlKTtyPW9lKHIsZSksZT1pZShfZShlKSkscj0hKG51bGwhPXImJnluKHIsZSkpfHxkZWxldGUgcltlXX1yZXR1cm4gcn0sT3QudW56aXA9ZGUsT3QudW56aXBXaXRoPXllLE90LnVwZGF0ZT1mdW5jdGlvbih0LG4scil7cmV0dXJuIG51bGw9PXQ/dDpabih0LG4sKHR5cGVvZiByPT1cImZ1bmN0aW9uXCI/cjpodSkodm4odCxuKSksdm9pZCAwKX0sT3QudXBkYXRlV2l0aD1mdW5jdGlvbih0LG4scixlKXtyZXR1cm4gZT10eXBlb2YgZT09XCJmdW5jdGlvblwiP2U6VCxudWxsIT10JiYodD1abih0LG4sKHR5cGVvZiByPT1cImZ1bmN0aW9uXCI/cjpodSkodm4odCxuKSksZSkpLHR9LE90LnZhbHVlcz1mdSxcclxuT3QudmFsdWVzSW49ZnVuY3Rpb24odCl7cmV0dXJuIG51bGw9PXQ/W106ayh0LGl1KHQpKX0sT3Qud2l0aG91dD1WbyxPdC53b3Jkcz1sdSxPdC53cmFwPWZ1bmN0aW9uKHQsbil7cmV0dXJuIG49bnVsbD09bj9odTpuLGxpKG4sdCl9LE90Lnhvcj1LbyxPdC54b3JCeT1HbyxPdC54b3JXaXRoPUpvLE90LnppcD1ZbyxPdC56aXBPYmplY3Q9ZnVuY3Rpb24odCxuKXtyZXR1cm4gbnIodHx8W10sbnx8W10sWXQpfSxPdC56aXBPYmplY3REZWVwPWZ1bmN0aW9uKHQsbil7cmV0dXJuIG5yKHR8fFtdLG58fFtdLFpuKX0sT3QuemlwV2l0aD1IbyxPdC5lbnRyaWVzPUxpLE90LmVudHJpZXNJbj1NaSxPdC5leHRlbmQ9eGksT3QuZXh0ZW5kV2l0aD1qaSxfdShPdCxPdCksT3QuYWRkPXRmLE90LmF0dGVtcHQ9WmksT3QuY2FtZWxDYXNlPUNpLE90LmNhcGl0YWxpemU9Y3UsT3QuY2VpbD1uZixPdC5jbGFtcD1mdW5jdGlvbih0LG4scil7cmV0dXJuIHI9PT1UJiYocj1uLG49VCksciE9PVQmJihyPXR1KHIpLFxyXG5yPXI9PT1yP3I6MCksbiE9PVQmJihuPXR1KG4pLG49bj09PW4/bjowKSxubih0dSh0KSxuLHIpfSxPdC5jbG9uZT1mdW5jdGlvbih0KXtyZXR1cm4gcm4odCxmYWxzZSx0cnVlKX0sT3QuY2xvbmVEZWVwPWZ1bmN0aW9uKHQpe3JldHVybiBybih0LHRydWUsdHJ1ZSl9LE90LmNsb25lRGVlcFdpdGg9ZnVuY3Rpb24odCxuKXtyZXR1cm4gcm4odCx0cnVlLHRydWUsbil9LE90LmNsb25lV2l0aD1mdW5jdGlvbih0LG4pe3JldHVybiBybih0LGZhbHNlLHRydWUsbil9LE90LmRlYnVycj1hdSxPdC5kaXZpZGU9cmYsT3QuZW5kc1dpdGg9ZnVuY3Rpb24odCxuLHIpe3Q9cnUodCksbj1ZbihuKTt2YXIgZT10Lmxlbmd0aDtyZXR1cm4gcj1yPT09VD9lOm5uKFFlKHIpLDAsZSksci09bi5sZW5ndGgscj49MCYmdC5pbmRleE9mKG4scik9PXJ9LE90LmVxPU1lLE90LmVzY2FwZT1mdW5jdGlvbih0KXtyZXR1cm4odD1ydSh0KSkmJlgudGVzdCh0KT90LnJlcGxhY2UoSCxCKTp0fSxPdC5lc2NhcGVSZWdFeHA9ZnVuY3Rpb24odCl7XHJcbnJldHVybih0PXJ1KHQpKSYmZnQudGVzdCh0KT90LnJlcGxhY2UoaXQsXCJcXFxcJCZcIik6dH0sT3QuZXZlcnk9ZnVuY3Rpb24odCxuLHIpe3ZhciBlPXZpKHQpP2k6Y247cmV0dXJuIHImJlhyKHQsbixyKSYmKG49VCksZSh0LERyKG4sMykpfSxPdC5maW5kPWZ1bmN0aW9uKHQsbixyKXtyZXR1cm4gdD16ZSh0KT90OmZ1KHQpLG49c2UodCxuLHIpLG4+LTE/dFtuXTpUfSxPdC5maW5kSW5kZXg9c2UsT3QuZmluZEtleT1mdW5jdGlvbih0LG4pe3JldHVybiB2KHQsRHIobiwzKSxobil9LE90LmZpbmRMYXN0PWZ1bmN0aW9uKHQsbixyKXtyZXR1cm4gdD16ZSh0KT90OmZ1KHQpLG49aGUodCxuLHIpLG4+LTE/dFtuXTpUfSxPdC5maW5kTGFzdEluZGV4PWhlLE90LmZpbmRMYXN0S2V5PWZ1bmN0aW9uKHQsbil7cmV0dXJuIHYodCxEcihuLDMpLHBuKX0sT3QuZmxvb3I9ZWYsT3QuZm9yRWFjaD13ZSxPdC5mb3JFYWNoUmlnaHQ9bWUsT3QuZm9ySW49ZnVuY3Rpb24odCxuKXtyZXR1cm4gbnVsbD09dD90Ok9vKHQsRHIobiwzKSxpdSk7XHJcbn0sT3QuZm9ySW5SaWdodD1mdW5jdGlvbih0LG4pe3JldHVybiBudWxsPT10P3Q6a28odCxEcihuLDMpLGl1KX0sT3QuZm9yT3duPWZ1bmN0aW9uKHQsbil7cmV0dXJuIHQmJmhuKHQsRHIobiwzKSl9LE90LmZvck93blJpZ2h0PWZ1bmN0aW9uKHQsbil7cmV0dXJuIHQmJnBuKHQsRHIobiwzKSl9LE90LmdldD1ldSxPdC5ndD1waSxPdC5ndGU9X2ksT3QuaGFzPWZ1bmN0aW9uKHQsbil7cmV0dXJuIG51bGwhPXQmJnFyKHQsbix5bil9LE90Lmhhc0luPXV1LE90LmhlYWQ9cGUsT3QuaWRlbnRpdHk9aHUsT3QuaW5jbHVkZXM9ZnVuY3Rpb24odCxuLHIsZSl7cmV0dXJuIHQ9emUodCk/dDpmdSh0KSxyPXImJiFlP1FlKHIpOjAsZT10Lmxlbmd0aCwwPnImJihyPVF1KGUrciwwKSksS2UodCk/ZT49ciYmLTE8dC5pbmRleE9mKG4scik6ISFlJiYtMTxkKHQsbixyKX0sT3QuaW5kZXhPZj1mdW5jdGlvbih0LG4scil7dmFyIGU9dD90Lmxlbmd0aDowO3JldHVybiBlPyhyPW51bGw9PXI/MDpRZShyKSxcclxuMD5yJiYocj1RdShlK3IsMCkpLGQodCxuLHIpKTotMX0sT3QuaW5SYW5nZT1mdW5jdGlvbih0LG4scil7cmV0dXJuIG49dHUobil8fDAscj09PVQ/KHI9bixuPTApOnI9dHUocil8fDAsdD10dSh0KSx0Pj1YdShuLHIpJiZ0PFF1KG4scil9LE90Lmludm9rZT1TaSxPdC5pc0FyZ3VtZW50cz1DZSxPdC5pc0FycmF5PXZpLE90LmlzQXJyYXlCdWZmZXI9ZnVuY3Rpb24odCl7cmV0dXJuIFplKHQpJiZcIltvYmplY3QgQXJyYXlCdWZmZXJdXCI9PUx1LmNhbGwodCl9LE90LmlzQXJyYXlMaWtlPXplLE90LmlzQXJyYXlMaWtlT2JqZWN0PVVlLE90LmlzQm9vbGVhbj1mdW5jdGlvbih0KXtyZXR1cm4gdHJ1ZT09PXR8fGZhbHNlPT09dHx8WmUodCkmJlwiW29iamVjdCBCb29sZWFuXVwiPT1MdS5jYWxsKHQpfSxPdC5pc0J1ZmZlcj1naSxPdC5pc0RhdGU9ZnVuY3Rpb24odCl7cmV0dXJuIFplKHQpJiZcIltvYmplY3QgRGF0ZV1cIj09THUuY2FsbCh0KX0sT3QuaXNFbGVtZW50PWZ1bmN0aW9uKHQpe3JldHVybiEhdCYmMT09PXQubm9kZVR5cGUmJlplKHQpJiYhcWUodCk7XHJcbn0sT3QuaXNFbXB0eT1mdW5jdGlvbih0KXtpZih6ZSh0KSYmKHZpKHQpfHxLZSh0KXx8RGUodC5zcGxpY2UpfHxDZSh0KXx8Z2kodCkpKXJldHVybiF0Lmxlbmd0aDtpZihaZSh0KSl7dmFyIG49VHIodCk7aWYoXCJbb2JqZWN0IE1hcF1cIj09bnx8XCJbb2JqZWN0IFNldF1cIj09bilyZXR1cm4hdC5zaXplfWZvcih2YXIgciBpbiB0KWlmKFJ1LmNhbGwodCxyKSlyZXR1cm4gZmFsc2U7cmV0dXJuIShobyYmb3UodCkubGVuZ3RoKX0sT3QuaXNFcXVhbD1mdW5jdGlvbih0LG4pe3JldHVybiBtbih0LG4pfSxPdC5pc0VxdWFsV2l0aD1mdW5jdGlvbih0LG4scil7dmFyIGU9KHI9dHlwZW9mIHI9PVwiZnVuY3Rpb25cIj9yOlQpP3IodCxuKTpUO3JldHVybiBlPT09VD9tbih0LG4scik6ISFlfSxPdC5pc0Vycm9yPSRlLE90LmlzRmluaXRlPWZ1bmN0aW9uKHQpe3JldHVybiB0eXBlb2YgdD09XCJudW1iZXJcIiYmSnUodCl9LE90LmlzRnVuY3Rpb249RGUsT3QuaXNJbnRlZ2VyPUZlLE90LmlzTGVuZ3RoPU5lLE90LmlzTWFwPWZ1bmN0aW9uKHQpe1xyXG5yZXR1cm4gWmUodCkmJlwiW29iamVjdCBNYXBdXCI9PVRyKHQpfSxPdC5pc01hdGNoPWZ1bmN0aW9uKHQsbil7cmV0dXJuIHQ9PT1ufHxBbih0LG4sTnIobikpfSxPdC5pc01hdGNoV2l0aD1mdW5jdGlvbih0LG4scil7cmV0dXJuIHI9dHlwZW9mIHI9PVwiZnVuY3Rpb25cIj9yOlQsQW4odCxuLE5yKG4pLHIpfSxPdC5pc05hTj1mdW5jdGlvbih0KXtyZXR1cm4gVGUodCkmJnQhPSt0fSxPdC5pc05hdGl2ZT1mdW5jdGlvbih0KXtpZihCbyh0KSl0aHJvdyBuZXcgeHUoXCJUaGlzIG1ldGhvZCBpcyBub3Qgc3VwcG9ydGVkIHdpdGggYGNvcmUtanNgLiBUcnkgaHR0cHM6Ly9naXRodWIuY29tL2VzLXNoaW1zLlwiKTtyZXR1cm4gT24odCl9LE90LmlzTmlsPWZ1bmN0aW9uKHQpe3JldHVybiBudWxsPT10fSxPdC5pc051bGw9ZnVuY3Rpb24odCl7cmV0dXJuIG51bGw9PT10fSxPdC5pc051bWJlcj1UZSxPdC5pc09iamVjdD1QZSxPdC5pc09iamVjdExpa2U9WmUsT3QuaXNQbGFpbk9iamVjdD1xZSxcclxuT3QuaXNSZWdFeHA9VmUsT3QuaXNTYWZlSW50ZWdlcj1mdW5jdGlvbih0KXtyZXR1cm4gRmUodCkmJnQ+PS05MDA3MTk5MjU0NzQwOTkxJiY5MDA3MTk5MjU0NzQwOTkxPj10fSxPdC5pc1NldD1mdW5jdGlvbih0KXtyZXR1cm4gWmUodCkmJlwiW29iamVjdCBTZXRdXCI9PVRyKHQpfSxPdC5pc1N0cmluZz1LZSxPdC5pc1N5bWJvbD1HZSxPdC5pc1R5cGVkQXJyYXk9SmUsT3QuaXNVbmRlZmluZWQ9ZnVuY3Rpb24odCl7cmV0dXJuIHQ9PT1UfSxPdC5pc1dlYWtNYXA9ZnVuY3Rpb24odCl7cmV0dXJuIFplKHQpJiZcIltvYmplY3QgV2Vha01hcF1cIj09VHIodCl9LE90LmlzV2Vha1NldD1mdW5jdGlvbih0KXtyZXR1cm4gWmUodCkmJlwiW29iamVjdCBXZWFrU2V0XVwiPT1MdS5jYWxsKHQpfSxPdC5qb2luPWZ1bmN0aW9uKHQsbil7cmV0dXJuIHQ/WXUuY2FsbCh0LG4pOlwiXCJ9LE90LmtlYmFiQ2FzZT16aSxPdC5sYXN0PV9lLE90Lmxhc3RJbmRleE9mPWZ1bmN0aW9uKHQsbixyKXt2YXIgZT10P3QubGVuZ3RoOjA7XHJcbmlmKCFlKXJldHVybi0xO3ZhciB1PWU7aWYociE9PVQmJih1PVFlKHIpLHU9KDA+dT9RdShlK3UsMCk6WHUodSxlLTEpKSsxKSxuIT09bilyZXR1cm4gTSh0LHUtMSx0cnVlKTtmb3IoO3UtLTspaWYodFt1XT09PW4pcmV0dXJuIHU7cmV0dXJuLTF9LE90Lmxvd2VyQ2FzZT1VaSxPdC5sb3dlckZpcnN0PSRpLE90Lmx0PWRpLE90Lmx0ZT15aSxPdC5tYXg9ZnVuY3Rpb24odCl7cmV0dXJuIHQmJnQubGVuZ3RoP2FuKHQsaHUsZG4pOlR9LE90Lm1heEJ5PWZ1bmN0aW9uKHQsbil7cmV0dXJuIHQmJnQubGVuZ3RoP2FuKHQsRHIobiksZG4pOlR9LE90Lm1lYW49ZnVuY3Rpb24odCl7cmV0dXJuIGIodCxodSl9LE90Lm1lYW5CeT1mdW5jdGlvbih0LG4pe3JldHVybiBiKHQsRHIobikpfSxPdC5taW49ZnVuY3Rpb24odCl7cmV0dXJuIHQmJnQubGVuZ3RoP2FuKHQsaHUsU24pOlR9LE90Lm1pbkJ5PWZ1bmN0aW9uKHQsbil7cmV0dXJuIHQmJnQubGVuZ3RoP2FuKHQsRHIobiksU24pOlR9LE90LnN0dWJBcnJheT1kdSxcclxuT3Quc3R1YkZhbHNlPXl1LE90LnN0dWJPYmplY3Q9ZnVuY3Rpb24oKXtyZXR1cm57fX0sT3Quc3R1YlN0cmluZz1mdW5jdGlvbigpe3JldHVyblwiXCJ9LE90LnN0dWJUcnVlPWZ1bmN0aW9uKCl7cmV0dXJuIHRydWV9LE90Lm11bHRpcGx5PXVmLE90Lm50aD1mdW5jdGlvbih0LG4pe3JldHVybiB0JiZ0Lmxlbmd0aD9Mbih0LFFlKG4pKTpUfSxPdC5ub0NvbmZsaWN0PWZ1bmN0aW9uKCl7cmV0dXJuIEt0Ll89PT10aGlzJiYoS3QuXz1NdSksdGhpc30sT3Qubm9vcD12dSxPdC5ub3c9a2UsT3QucGFkPWZ1bmN0aW9uKHQsbixyKXt0PXJ1KHQpO3ZhciBlPShuPVFlKG4pKT9OKHQpOjA7cmV0dXJuIW58fGU+PW4/dDoobj0obi1lKS8yLEVyKEt1KG4pLHIpK3QrRXIoVnUobikscikpfSxPdC5wYWRFbmQ9ZnVuY3Rpb24odCxuLHIpe3Q9cnUodCk7dmFyIGU9KG49UWUobikpP04odCk6MDtyZXR1cm4gbiYmbj5lP3QrRXIobi1lLHIpOnR9LE90LnBhZFN0YXJ0PWZ1bmN0aW9uKHQsbixyKXt0PXJ1KHQpO1xyXG52YXIgZT0obj1RZShuKSk/Tih0KTowO3JldHVybiBuJiZuPmU/RXIobi1lLHIpK3Q6dH0sT3QucGFyc2VJbnQ9ZnVuY3Rpb24odCxuLHIpe3JldHVybiByfHxudWxsPT1uP249MDpuJiYobj0rbiksdD1ydSh0KS5yZXBsYWNlKGN0LFwiXCIpLHRvKHQsbnx8KHZ0LnRlc3QodCk/MTY6MTApKX0sT3QucmFuZG9tPWZ1bmN0aW9uKHQsbixyKXtpZihyJiZ0eXBlb2YgciE9XCJib29sZWFuXCImJlhyKHQsbixyKSYmKG49cj1UKSxyPT09VCYmKHR5cGVvZiBuPT1cImJvb2xlYW5cIj8ocj1uLG49VCk6dHlwZW9mIHQ9PVwiYm9vbGVhblwiJiYocj10LHQ9VCkpLHQ9PT1UJiZuPT09VD8odD0wLG49MSk6KHQ9dHUodCl8fDAsbj09PVQ/KG49dCx0PTApOm49dHUobil8fDApLHQ+bil7dmFyIGU9dDt0PW4sbj1lfXJldHVybiByfHx0JTF8fG4lMT8ocj1ubygpLFh1KHQrcioobi10K0Z0KFwiMWUtXCIrKChyK1wiXCIpLmxlbmd0aC0xKSkpLG4pKTpObih0LG4pfSxPdC5yZWR1Y2U9ZnVuY3Rpb24odCxuLHIpe3ZhciBlPXZpKHQpP2g6eCx1PTM+YXJndW1lbnRzLmxlbmd0aDtcclxucmV0dXJuIGUodCxEcihuLDQpLHIsdSxtbyl9LE90LnJlZHVjZVJpZ2h0PWZ1bmN0aW9uKHQsbixyKXt2YXIgZT12aSh0KT9wOngsdT0zPmFyZ3VtZW50cy5sZW5ndGg7cmV0dXJuIGUodCxEcihuLDQpLHIsdSxBbyl9LE90LnJlcGVhdD1mdW5jdGlvbih0LG4scil7cmV0dXJuIG49KHI/WHIodCxuLHIpOm49PT1UKT8xOlFlKG4pLFBuKHJ1KHQpLG4pfSxPdC5yZXBsYWNlPWZ1bmN0aW9uKCl7dmFyIHQ9YXJndW1lbnRzLG49cnUodFswXSk7cmV0dXJuIDM+dC5sZW5ndGg/bjpyby5jYWxsKG4sdFsxXSx0WzJdKX0sT3QucmVzdWx0PWZ1bmN0aW9uKHQsbixyKXtuPXRlKG4sdCk/W25dOmVyKG4pO3ZhciBlPS0xLHU9bi5sZW5ndGg7Zm9yKHV8fCh0PVQsdT0xKTsrK2U8dTspe3ZhciBvPW51bGw9PXQ/VDp0W2llKG5bZV0pXTtvPT09VCYmKGU9dSxvPXIpLHQ9RGUobyk/by5jYWxsKHQpOm99cmV0dXJuIHR9LE90LnJvdW5kPW9mLE90LnJ1bkluQ29udGV4dD1aLE90LnNhbXBsZT1mdW5jdGlvbih0KXtcclxudD16ZSh0KT90OmZ1KHQpO3ZhciBuPXQubGVuZ3RoO3JldHVybiBuPjA/dFtObigwLG4tMSldOlR9LE90LnNpemU9ZnVuY3Rpb24odCl7aWYobnVsbD09dClyZXR1cm4gMDtpZih6ZSh0KSl7dmFyIG49dC5sZW5ndGg7cmV0dXJuIG4mJktlKHQpP04odCk6bn1yZXR1cm4gWmUodCkmJihuPVRyKHQpLFwiW29iamVjdCBNYXBdXCI9PW58fFwiW29iamVjdCBTZXRdXCI9PW4pP3Quc2l6ZTpvdSh0KS5sZW5ndGh9LE90LnNuYWtlQ2FzZT1EaSxPdC5zb21lPWZ1bmN0aW9uKHQsbixyKXt2YXIgZT12aSh0KT9fOnFuO3JldHVybiByJiZYcih0LG4scikmJihuPVQpLGUodCxEcihuLDMpKX0sT3Quc29ydGVkSW5kZXg9ZnVuY3Rpb24odCxuKXtyZXR1cm4gVm4odCxuKX0sT3Quc29ydGVkSW5kZXhCeT1mdW5jdGlvbih0LG4scil7cmV0dXJuIEtuKHQsbixEcihyKSl9LE90LnNvcnRlZEluZGV4T2Y9ZnVuY3Rpb24odCxuKXt2YXIgcj10P3QubGVuZ3RoOjA7aWYocil7dmFyIGU9Vm4odCxuKTtpZihyPmUmJk1lKHRbZV0sbikpcmV0dXJuIGU7XHJcbn1yZXR1cm4tMX0sT3Quc29ydGVkTGFzdEluZGV4PWZ1bmN0aW9uKHQsbil7cmV0dXJuIFZuKHQsbix0cnVlKX0sT3Quc29ydGVkTGFzdEluZGV4Qnk9ZnVuY3Rpb24odCxuLHIpe3JldHVybiBLbih0LG4sRHIociksdHJ1ZSl9LE90LnNvcnRlZExhc3RJbmRleE9mPWZ1bmN0aW9uKHQsbil7aWYodCYmdC5sZW5ndGgpe3ZhciByPVZuKHQsbix0cnVlKS0xO2lmKE1lKHRbcl0sbikpcmV0dXJuIHJ9cmV0dXJuLTF9LE90LnN0YXJ0Q2FzZT1GaSxPdC5zdGFydHNXaXRoPWZ1bmN0aW9uKHQsbixyKXtyZXR1cm4gdD1ydSh0KSxyPW5uKFFlKHIpLDAsdC5sZW5ndGgpLHQubGFzdEluZGV4T2YoWW4obikscik9PXJ9LE90LnN1YnRyYWN0PWZmLE90LnN1bT1mdW5jdGlvbih0KXtyZXR1cm4gdCYmdC5sZW5ndGg/dyh0LGh1KTowfSxPdC5zdW1CeT1mdW5jdGlvbih0LG4pe3JldHVybiB0JiZ0Lmxlbmd0aD93KHQsRHIobikpOjB9LE90LnRlbXBsYXRlPWZ1bmN0aW9uKHQsbixyKXt2YXIgZT1PdC50ZW1wbGF0ZVNldHRpbmdzO1xyXG5yJiZYcih0LG4scikmJihuPVQpLHQ9cnUodCksbj1qaSh7fSxuLGUsVnQpLHI9amkoe30sbi5pbXBvcnRzLGUuaW1wb3J0cyxWdCk7dmFyIHUsbyxpPW91KHIpLGY9ayhyLGkpLGM9MDtyPW4uaW50ZXJwb2xhdGV8fHd0O3ZhciBhPVwiX19wKz0nXCI7cj13dSgobi5lc2NhcGV8fHd0KS5zb3VyY2UrXCJ8XCIrci5zb3VyY2UrXCJ8XCIrKHI9PT1ydD9wdDp3dCkuc291cmNlK1wifFwiKyhuLmV2YWx1YXRlfHx3dCkuc291cmNlK1wifCRcIixcImdcIik7dmFyIGw9XCJzb3VyY2VVUkxcImluIG4/XCIvLyMgc291cmNlVVJMPVwiK24uc291cmNlVVJMK1wiXFxuXCI6XCJcIjtpZih0LnJlcGxhY2UocixmdW5jdGlvbihuLHIsZSxpLGYsbCl7cmV0dXJuIGV8fChlPWkpLGErPXQuc2xpY2UoYyxsKS5yZXBsYWNlKG10LEwpLHImJih1PXRydWUsYSs9XCInK19fZShcIityK1wiKSsnXCIpLGYmJihvPXRydWUsYSs9XCInO1wiK2YrXCI7XFxuX19wKz0nXCIpLGUmJihhKz1cIicrKChfX3Q9KFwiK2UrXCIpKT09bnVsbD8nJzpfX3QpKydcIiksYz1sK24ubGVuZ3RoLFxyXG5ufSksYSs9XCInO1wiLChuPW4udmFyaWFibGUpfHwoYT1cIndpdGgob2JqKXtcIithK1wifVwiKSxhPShvP2EucmVwbGFjZShLLFwiXCIpOmEpLnJlcGxhY2UoRyxcIiQxXCIpLnJlcGxhY2UoSixcIiQxO1wiKSxhPVwiZnVuY3Rpb24oXCIrKG58fFwib2JqXCIpK1wiKXtcIisobj9cIlwiOlwib2JqfHwob2JqPXt9KTtcIikrXCJ2YXIgX190LF9fcD0nJ1wiKyh1P1wiLF9fZT1fLmVzY2FwZVwiOlwiXCIpKyhvP1wiLF9faj1BcnJheS5wcm90b3R5cGUuam9pbjtmdW5jdGlvbiBwcmludCgpe19fcCs9X19qLmNhbGwoYXJndW1lbnRzLCcnKX1cIjpcIjtcIikrYStcInJldHVybiBfX3B9XCIsbj1aaShmdW5jdGlvbigpe3JldHVybiBGdW5jdGlvbihpLGwrXCJyZXR1cm4gXCIrYSkuYXBwbHkoVCxmKX0pLG4uc291cmNlPWEsJGUobikpdGhyb3cgbjtyZXR1cm4gbn0sT3QudGltZXM9ZnVuY3Rpb24odCxuKXtpZih0PVFlKHQpLDE+dHx8dD45MDA3MTk5MjU0NzQwOTkxKXJldHVybltdO3ZhciByPTQyOTQ5NjcyOTUsZT1YdSh0LDQyOTQ5NjcyOTUpO2ZvcihuPURyKG4pLFxyXG50LT00Mjk0OTY3Mjk1LGU9bShlLG4pOysrcjx0OyluKHIpO3JldHVybiBlfSxPdC50b0Zpbml0ZT1IZSxPdC50b0ludGVnZXI9UWUsT3QudG9MZW5ndGg9WGUsT3QudG9Mb3dlcj1mdW5jdGlvbih0KXtyZXR1cm4gcnUodCkudG9Mb3dlckNhc2UoKX0sT3QudG9OdW1iZXI9dHUsT3QudG9TYWZlSW50ZWdlcj1mdW5jdGlvbih0KXtyZXR1cm4gbm4oUWUodCksLTkwMDcxOTkyNTQ3NDA5OTEsOTAwNzE5OTI1NDc0MDk5MSl9LE90LnRvU3RyaW5nPXJ1LE90LnRvVXBwZXI9ZnVuY3Rpb24odCl7cmV0dXJuIHJ1KHQpLnRvVXBwZXJDYXNlKCl9LE90LnRyaW09ZnVuY3Rpb24odCxuLHIpe3JldHVybih0PXJ1KHQpKSYmKHJ8fG49PT1UKT90LnJlcGxhY2UoY3QsXCJcIik6dCYmKG49WW4obikpPyh0PXQubWF0Y2goSXQpLG49bi5tYXRjaChJdCksdXIodCxTKHQsbiksSSh0LG4pKzEpLmpvaW4oXCJcIikpOnR9LE90LnRyaW1FbmQ9ZnVuY3Rpb24odCxuLHIpe3JldHVybih0PXJ1KHQpKSYmKHJ8fG49PT1UKT90LnJlcGxhY2UobHQsXCJcIik6dCYmKG49WW4obikpPyh0PXQubWF0Y2goSXQpLFxyXG5uPUkodCxuLm1hdGNoKEl0KSkrMSx1cih0LDAsbikuam9pbihcIlwiKSk6dH0sT3QudHJpbVN0YXJ0PWZ1bmN0aW9uKHQsbixyKXtyZXR1cm4odD1ydSh0KSkmJihyfHxuPT09VCk/dC5yZXBsYWNlKGF0LFwiXCIpOnQmJihuPVluKG4pKT8odD10Lm1hdGNoKEl0KSxuPVModCxuLm1hdGNoKEl0KSksdXIodCxuKS5qb2luKFwiXCIpKTp0fSxPdC50cnVuY2F0ZT1mdW5jdGlvbih0LG4pe3ZhciByPTMwLGU9XCIuLi5cIjtpZihQZShuKSl2YXIgdT1cInNlcGFyYXRvclwiaW4gbj9uLnNlcGFyYXRvcjp1LHI9XCJsZW5ndGhcImluIG4/UWUobi5sZW5ndGgpOnIsZT1cIm9taXNzaW9uXCJpbiBuP1luKG4ub21pc3Npb24pOmU7dD1ydSh0KTt2YXIgbz10Lmxlbmd0aDtpZihXdC50ZXN0KHQpKXZhciBpPXQubWF0Y2goSXQpLG89aS5sZW5ndGg7aWYocj49bylyZXR1cm4gdDtpZihvPXItTihlKSwxPm8pcmV0dXJuIGU7aWYocj1pP3VyKGksMCxvKS5qb2luKFwiXCIpOnQuc2xpY2UoMCxvKSx1PT09VClyZXR1cm4gcitlO1xyXG5pZihpJiYobys9ci5sZW5ndGgtbyksVmUodSkpe2lmKHQuc2xpY2Uobykuc2VhcmNoKHUpKXt2YXIgZj1yO2Zvcih1Lmdsb2JhbHx8KHU9d3UodS5zb3VyY2UscnUoX3QuZXhlYyh1KSkrXCJnXCIpKSx1Lmxhc3RJbmRleD0wO2k9dS5leGVjKGYpOyl2YXIgYz1pLmluZGV4O3I9ci5zbGljZSgwLGM9PT1UP286Yyl9fWVsc2UgdC5pbmRleE9mKFluKHUpLG8pIT1vJiYodT1yLmxhc3RJbmRleE9mKHUpLHU+LTEmJihyPXIuc2xpY2UoMCx1KSkpO3JldHVybiByK2V9LE90LnVuZXNjYXBlPWZ1bmN0aW9uKHQpe3JldHVybih0PXJ1KHQpKSYmUS50ZXN0KHQpP3QucmVwbGFjZShZLFApOnR9LE90LnVuaXF1ZUlkPWZ1bmN0aW9uKHQpe3ZhciBuPSsrV3U7cmV0dXJuIHJ1KHQpK259LE90LnVwcGVyQ2FzZT1OaSxPdC51cHBlckZpcnN0PVBpLE90LmVhY2g9d2UsT3QuZWFjaFJpZ2h0PW1lLE90LmZpcnN0PXBlLF91KE90LGZ1bmN0aW9uKCl7dmFyIHQ9e307cmV0dXJuIGhuKE90LGZ1bmN0aW9uKG4scil7XHJcblJ1LmNhbGwoT3QucHJvdG90eXBlLHIpfHwodFtyXT1uKX0pLHR9KCkse2NoYWluOmZhbHNlfSksT3QuVkVSU0lPTj1cIjQuMTMuMFwiLHUoXCJiaW5kIGJpbmRLZXkgY3VycnkgY3VycnlSaWdodCBwYXJ0aWFsIHBhcnRpYWxSaWdodFwiLnNwbGl0KFwiIFwiKSxmdW5jdGlvbih0KXtPdFt0XS5wbGFjZWhvbGRlcj1PdH0pLHUoW1wiZHJvcFwiLFwidGFrZVwiXSxmdW5jdGlvbih0LG4pe1V0LnByb3RvdHlwZVt0XT1mdW5jdGlvbihyKXt2YXIgZT10aGlzLl9fZmlsdGVyZWRfXztpZihlJiYhbilyZXR1cm4gbmV3IFV0KHRoaXMpO3I9cj09PVQ/MTpRdShRZShyKSwwKTt2YXIgdT10aGlzLmNsb25lKCk7cmV0dXJuIGU/dS5fX3Rha2VDb3VudF9fPVh1KHIsdS5fX3Rha2VDb3VudF9fKTp1Ll9fdmlld3NfXy5wdXNoKHtzaXplOlh1KHIsNDI5NDk2NzI5NSksdHlwZTp0KygwPnUuX19kaXJfXz9cIlJpZ2h0XCI6XCJcIil9KSx1fSxVdC5wcm90b3R5cGVbdCtcIlJpZ2h0XCJdPWZ1bmN0aW9uKG4pe3JldHVybiB0aGlzLnJldmVyc2UoKVt0XShuKS5yZXZlcnNlKCk7XHJcbn19KSx1KFtcImZpbHRlclwiLFwibWFwXCIsXCJ0YWtlV2hpbGVcIl0sZnVuY3Rpb24odCxuKXt2YXIgcj1uKzEsZT0xPT1yfHwzPT1yO1V0LnByb3RvdHlwZVt0XT1mdW5jdGlvbih0KXt2YXIgbj10aGlzLmNsb25lKCk7cmV0dXJuIG4uX19pdGVyYXRlZXNfXy5wdXNoKHtpdGVyYXRlZTpEcih0LDMpLHR5cGU6cn0pLG4uX19maWx0ZXJlZF9fPW4uX19maWx0ZXJlZF9ffHxlLG59fSksdShbXCJoZWFkXCIsXCJsYXN0XCJdLGZ1bmN0aW9uKHQsbil7dmFyIHI9XCJ0YWtlXCIrKG4/XCJSaWdodFwiOlwiXCIpO1V0LnByb3RvdHlwZVt0XT1mdW5jdGlvbigpe3JldHVybiB0aGlzW3JdKDEpLnZhbHVlKClbMF19fSksdShbXCJpbml0aWFsXCIsXCJ0YWlsXCJdLGZ1bmN0aW9uKHQsbil7dmFyIHI9XCJkcm9wXCIrKG4/XCJcIjpcIlJpZ2h0XCIpO1V0LnByb3RvdHlwZVt0XT1mdW5jdGlvbigpe3JldHVybiB0aGlzLl9fZmlsdGVyZWRfXz9uZXcgVXQodGhpcyk6dGhpc1tyXSgxKX19KSxVdC5wcm90b3R5cGUuY29tcGFjdD1mdW5jdGlvbigpe1xyXG5yZXR1cm4gdGhpcy5maWx0ZXIoaHUpfSxVdC5wcm90b3R5cGUuZmluZD1mdW5jdGlvbih0KXtyZXR1cm4gdGhpcy5maWx0ZXIodCkuaGVhZCgpfSxVdC5wcm90b3R5cGUuZmluZExhc3Q9ZnVuY3Rpb24odCl7cmV0dXJuIHRoaXMucmV2ZXJzZSgpLmZpbmQodCl9LFV0LnByb3RvdHlwZS5pbnZva2VNYXA9TGUoZnVuY3Rpb24odCxuKXtyZXR1cm4gdHlwZW9mIHQ9PVwiZnVuY3Rpb25cIj9uZXcgVXQodGhpcyk6dGhpcy5tYXAoZnVuY3Rpb24ocil7cmV0dXJuIHduKHIsdCxuKX0pfSksVXQucHJvdG90eXBlLnJlamVjdD1mdW5jdGlvbih0KXtyZXR1cm4gdD1Ecih0LDMpLHRoaXMuZmlsdGVyKGZ1bmN0aW9uKG4pe3JldHVybiF0KG4pfSl9LFV0LnByb3RvdHlwZS5zbGljZT1mdW5jdGlvbih0LG4pe3Q9UWUodCk7dmFyIHI9dGhpcztyZXR1cm4gci5fX2ZpbHRlcmVkX18mJih0PjB8fDA+bik/bmV3IFV0KHIpOigwPnQ/cj1yLnRha2VSaWdodCgtdCk6dCYmKHI9ci5kcm9wKHQpKSxuIT09VCYmKG49UWUobiksXHJcbnI9MD5uP3IuZHJvcFJpZ2h0KC1uKTpyLnRha2Uobi10KSkscil9LFV0LnByb3RvdHlwZS50YWtlUmlnaHRXaGlsZT1mdW5jdGlvbih0KXtyZXR1cm4gdGhpcy5yZXZlcnNlKCkudGFrZVdoaWxlKHQpLnJldmVyc2UoKX0sVXQucHJvdG90eXBlLnRvQXJyYXk9ZnVuY3Rpb24oKXtyZXR1cm4gdGhpcy50YWtlKDQyOTQ5NjcyOTUpfSxobihVdC5wcm90b3R5cGUsZnVuY3Rpb24odCxuKXt2YXIgcj0vXig/OmZpbHRlcnxmaW5kfG1hcHxyZWplY3QpfFdoaWxlJC8udGVzdChuKSxlPS9eKD86aGVhZHxsYXN0KSQvLnRlc3QobiksdT1PdFtlP1widGFrZVwiKyhcImxhc3RcIj09bj9cIlJpZ2h0XCI6XCJcIik6bl0sbz1lfHwvXmZpbmQvLnRlc3Qobik7dSYmKE90LnByb3RvdHlwZVtuXT1mdW5jdGlvbigpe2Z1bmN0aW9uIG4odCl7cmV0dXJuIHQ9dS5hcHBseShPdCxzKFt0XSxmKSksZSYmaD90WzBdOnR9dmFyIGk9dGhpcy5fX3dyYXBwZWRfXyxmPWU/WzFdOmFyZ3VtZW50cyxjPWkgaW5zdGFuY2VvZiBVdCxhPWZbMF0sbD1jfHx2aShpKTtcclxubCYmciYmdHlwZW9mIGE9PVwiZnVuY3Rpb25cIiYmMSE9YS5sZW5ndGgmJihjPWw9ZmFsc2UpO3ZhciBoPXRoaXMuX19jaGFpbl9fLHA9ISF0aGlzLl9fYWN0aW9uc19fLmxlbmd0aCxhPW8mJiFoLGM9YyYmIXA7cmV0dXJuIW8mJmw/KGk9Yz9pOm5ldyBVdCh0aGlzKSxpPXQuYXBwbHkoaSxmKSxpLl9fYWN0aW9uc19fLnB1c2goe2Z1bmM6eGUsYXJnczpbbl0sdGhpc0FyZzpUfSksbmV3IHp0KGksaCkpOmEmJmM/dC5hcHBseSh0aGlzLGYpOihpPXRoaXMudGhydShuKSxhP2U/aS52YWx1ZSgpWzBdOmkudmFsdWUoKTppKX0pfSksdShcInBvcCBwdXNoIHNoaWZ0IHNvcnQgc3BsaWNlIHVuc2hpZnRcIi5zcGxpdChcIiBcIiksZnVuY3Rpb24odCl7dmFyIG49QXVbdF0scj0vXig/OnB1c2h8c29ydHx1bnNoaWZ0KSQvLnRlc3QodCk/XCJ0YXBcIjpcInRocnVcIixlPS9eKD86cG9wfHNoaWZ0KSQvLnRlc3QodCk7T3QucHJvdG90eXBlW3RdPWZ1bmN0aW9uKCl7dmFyIHQ9YXJndW1lbnRzO2lmKGUmJiF0aGlzLl9fY2hhaW5fXyl7XHJcbnZhciB1PXRoaXMudmFsdWUoKTtyZXR1cm4gbi5hcHBseSh2aSh1KT91OltdLHQpfXJldHVybiB0aGlzW3JdKGZ1bmN0aW9uKHIpe3JldHVybiBuLmFwcGx5KHZpKHIpP3I6W10sdCl9KX19KSxobihVdC5wcm90b3R5cGUsZnVuY3Rpb24odCxuKXt2YXIgcj1PdFtuXTtpZihyKXt2YXIgZT1yLm5hbWUrXCJcIjsocG9bZV18fChwb1tlXT1bXSkpLnB1c2goe25hbWU6bixmdW5jOnJ9KX19KSxwb1ttcihULDIpLm5hbWVdPVt7bmFtZTpcIndyYXBwZXJcIixmdW5jOlR9XSxVdC5wcm90b3R5cGUuY2xvbmU9ZnVuY3Rpb24oKXt2YXIgdD1uZXcgVXQodGhpcy5fX3dyYXBwZWRfXyk7cmV0dXJuIHQuX19hY3Rpb25zX189bHIodGhpcy5fX2FjdGlvbnNfXyksdC5fX2Rpcl9fPXRoaXMuX19kaXJfXyx0Ll9fZmlsdGVyZWRfXz10aGlzLl9fZmlsdGVyZWRfXyx0Ll9faXRlcmF0ZWVzX189bHIodGhpcy5fX2l0ZXJhdGVlc19fKSx0Ll9fdGFrZUNvdW50X189dGhpcy5fX3Rha2VDb3VudF9fLHQuX192aWV3c19fPWxyKHRoaXMuX192aWV3c19fKSxcclxudH0sVXQucHJvdG90eXBlLnJldmVyc2U9ZnVuY3Rpb24oKXtpZih0aGlzLl9fZmlsdGVyZWRfXyl7dmFyIHQ9bmV3IFV0KHRoaXMpO3QuX19kaXJfXz0tMSx0Ll9fZmlsdGVyZWRfXz10cnVlfWVsc2UgdD10aGlzLmNsb25lKCksdC5fX2Rpcl9fKj0tMTtyZXR1cm4gdH0sVXQucHJvdG90eXBlLnZhbHVlPWZ1bmN0aW9uKCl7dmFyIHQsbj10aGlzLl9fd3JhcHBlZF9fLnZhbHVlKCkscj10aGlzLl9fZGlyX18sZT12aShuKSx1PTA+cixvPWU/bi5sZW5ndGg6MDt0PW87Zm9yKHZhciBpPXRoaXMuX192aWV3c19fLGY9MCxjPS0xLGE9aS5sZW5ndGg7KytjPGE7KXt2YXIgbD1pW2NdLHM9bC5zaXplO3N3aXRjaChsLnR5cGUpe2Nhc2VcImRyb3BcIjpmKz1zO2JyZWFrO2Nhc2VcImRyb3BSaWdodFwiOnQtPXM7YnJlYWs7Y2FzZVwidGFrZVwiOnQ9WHUodCxmK3MpO2JyZWFrO2Nhc2VcInRha2VSaWdodFwiOmY9UXUoZix0LXMpfX1pZih0PXtzdGFydDpmLGVuZDp0fSxpPXQuc3RhcnQsZj10LmVuZCx0PWYtaSxcclxudT11P2Y6aS0xLGk9dGhpcy5fX2l0ZXJhdGVlc19fLGY9aS5sZW5ndGgsYz0wLGE9WHUodCx0aGlzLl9fdGFrZUNvdW50X18pLCFlfHwyMDA+b3x8bz09dCYmYT09dClyZXR1cm4gWG4obix0aGlzLl9fYWN0aW9uc19fKTtlPVtdO3Q6Zm9yKDt0LS0mJmE+Yzspe2Zvcih1Kz1yLG89LTEsbD1uW3VdOysrbzxmOyl7dmFyIGg9aVtvXSxzPWgudHlwZSxoPSgwLGguaXRlcmF0ZWUpKGwpO2lmKDI9PXMpbD1oO2Vsc2UgaWYoIWgpe2lmKDE9PXMpY29udGludWUgdDticmVhayB0fX1lW2MrK109bH1yZXR1cm4gZX0sT3QucHJvdG90eXBlLmF0PVFvLE90LnByb3RvdHlwZS5jaGFpbj1mdW5jdGlvbigpe3JldHVybiBiZSh0aGlzKX0sT3QucHJvdG90eXBlLmNvbW1pdD1mdW5jdGlvbigpe3JldHVybiBuZXcgenQodGhpcy52YWx1ZSgpLHRoaXMuX19jaGFpbl9fKX0sT3QucHJvdG90eXBlLm5leHQ9ZnVuY3Rpb24oKXt0aGlzLl9fdmFsdWVzX189PT1UJiYodGhpcy5fX3ZhbHVlc19fPVllKHRoaXMudmFsdWUoKSkpO1xyXG52YXIgdD10aGlzLl9faW5kZXhfXz49dGhpcy5fX3ZhbHVlc19fLmxlbmd0aCxuPXQ/VDp0aGlzLl9fdmFsdWVzX19bdGhpcy5fX2luZGV4X18rK107cmV0dXJue2RvbmU6dCx2YWx1ZTpufX0sT3QucHJvdG90eXBlLnBsYW50PWZ1bmN0aW9uKHQpe2Zvcih2YXIgbixyPXRoaXM7ciBpbnN0YW5jZW9mIGt0Oyl7dmFyIGU9Y2Uocik7ZS5fX2luZGV4X189MCxlLl9fdmFsdWVzX189VCxuP3UuX193cmFwcGVkX189ZTpuPWU7dmFyIHU9ZSxyPXIuX193cmFwcGVkX199cmV0dXJuIHUuX193cmFwcGVkX189dCxufSxPdC5wcm90b3R5cGUucmV2ZXJzZT1mdW5jdGlvbigpe3ZhciB0PXRoaXMuX193cmFwcGVkX187cmV0dXJuIHQgaW5zdGFuY2VvZiBVdD8odGhpcy5fX2FjdGlvbnNfXy5sZW5ndGgmJih0PW5ldyBVdCh0aGlzKSksdD10LnJldmVyc2UoKSx0Ll9fYWN0aW9uc19fLnB1c2goe2Z1bmM6eGUsYXJnczpbZ2VdLHRoaXNBcmc6VH0pLG5ldyB6dCh0LHRoaXMuX19jaGFpbl9fKSk6dGhpcy50aHJ1KGdlKTtcclxufSxPdC5wcm90b3R5cGUudG9KU09OPU90LnByb3RvdHlwZS52YWx1ZU9mPU90LnByb3RvdHlwZS52YWx1ZT1mdW5jdGlvbigpe3JldHVybiBYbih0aGlzLl9fd3JhcHBlZF9fLHRoaXMuX19hY3Rpb25zX18pfSxQdSYmKE90LnByb3RvdHlwZVtQdV09amUpLE90fXZhciBULHE9MS8wLFY9TmFOLEs9L1xcYl9fcFxcKz0nJzsvZyxHPS9cXGIoX19wXFwrPSknJ1xcKy9nLEo9LyhfX2VcXCguKj9cXCl8XFxiX190XFwpKVxcKycnOy9nLFk9LyYoPzphbXB8bHR8Z3R8cXVvdHwjMzl8Izk2KTsvZyxIPS9bJjw+XCInYF0vZyxRPVJlZ0V4cChZLnNvdXJjZSksWD1SZWdFeHAoSC5zb3VyY2UpLHR0PS88JS0oW1xcc1xcU10rPyklPi9nLG50PS88JShbXFxzXFxTXSs/KSU+L2cscnQ9LzwlPShbXFxzXFxTXSs/KSU+L2csZXQ9L1xcLnxcXFsoPzpbXltcXF1dKnwoW1wiJ10pKD86KD8hXFwxKVteXFxcXF18XFxcXC4pKj9cXDEpXFxdLyx1dD0vXlxcdyokLyxvdD0vW14uW1xcXV0rfFxcWyg/OigtP1xcZCsoPzpcXC5cXGQrKT8pfChbXCInXSkoKD86KD8hXFwyKVteXFxcXF18XFxcXC4pKj8pXFwyKVxcXXwoPz0oXFwufFxcW1xcXSkoPzpcXDR8JCkpL2csaXQ9L1tcXFxcXiQuKis/KClbXFxde318XS9nLGZ0PVJlZ0V4cChpdC5zb3VyY2UpLGN0PS9eXFxzK3xcXHMrJC9nLGF0PS9eXFxzKy8sbHQ9L1xccyskLyxzdD0vW2EtekEtWjAtOV0rL2csaHQ9L1xcXFwoXFxcXCk/L2cscHQ9L1xcJFxceyhbXlxcXFx9XSooPzpcXFxcLlteXFxcXH1dKikqKVxcfS9nLF90PS9cXHcqJC8sdnQ9L14weC9pLGd0PS9eWy0rXTB4WzAtOWEtZl0rJC9pLGR0PS9eMGJbMDFdKyQvaSx5dD0vXlxcW29iamVjdCAuKz9Db25zdHJ1Y3RvclxcXSQvLGJ0PS9eMG9bMC03XSskL2kseHQ9L14oPzowfFsxLTldXFxkKikkLyxqdD0vW1xceGMwLVxceGQ2XFx4ZDgtXFx4ZGVcXHhkZi1cXHhmNlxceGY4LVxceGZmXS9nLHd0PS8oJF4pLyxtdD0vWydcXG5cXHJcXHUyMDI4XFx1MjAyOVxcXFxdL2csQXQ9XCJbXFxcXHVmZTBlXFxcXHVmZTBmXT8oPzpbXFxcXHUwMzAwLVxcXFx1MDM2ZlxcXFx1ZmUyMC1cXFxcdWZlMjNcXFxcdTIwZDAtXFxcXHUyMGYwXXxcXFxcdWQ4M2NbXFxcXHVkZmZiLVxcXFx1ZGZmZl0pPyg/OlxcXFx1MjAwZCg/OlteXFxcXHVkODAwLVxcXFx1ZGZmZl18KD86XFxcXHVkODNjW1xcXFx1ZGRlNi1cXFxcdWRkZmZdKXsyfXxbXFxcXHVkODAwLVxcXFx1ZGJmZl1bXFxcXHVkYzAwLVxcXFx1ZGZmZl0pW1xcXFx1ZmUwZVxcXFx1ZmUwZl0/KD86W1xcXFx1MDMwMC1cXFxcdTAzNmZcXFxcdWZlMjAtXFxcXHVmZTIzXFxcXHUyMGQwLVxcXFx1MjBmMF18XFxcXHVkODNjW1xcXFx1ZGZmYi1cXFxcdWRmZmZdKT8pKlwiLE90PVwiKD86W1xcXFx1MjcwMC1cXFxcdTI3YmZdfCg/OlxcXFx1ZDgzY1tcXFxcdWRkZTYtXFxcXHVkZGZmXSl7Mn18W1xcXFx1ZDgwMC1cXFxcdWRiZmZdW1xcXFx1ZGMwMC1cXFxcdWRmZmZdKVwiK0F0LGt0PVwiKD86W15cXFxcdWQ4MDAtXFxcXHVkZmZmXVtcXFxcdTAzMDAtXFxcXHUwMzZmXFxcXHVmZTIwLVxcXFx1ZmUyM1xcXFx1MjBkMC1cXFxcdTIwZjBdP3xbXFxcXHUwMzAwLVxcXFx1MDM2ZlxcXFx1ZmUyMC1cXFxcdWZlMjNcXFxcdTIwZDAtXFxcXHUyMGYwXXwoPzpcXFxcdWQ4M2NbXFxcXHVkZGU2LVxcXFx1ZGRmZl0pezJ9fFtcXFxcdWQ4MDAtXFxcXHVkYmZmXVtcXFxcdWRjMDAtXFxcXHVkZmZmXXxbXFxcXHVkODAwLVxcXFx1ZGZmZl0pXCIsRXQ9UmVnRXhwKFwiWydcXHUyMDE5XVwiLFwiZ1wiKSxTdD1SZWdFeHAoXCJbXFxcXHUwMzAwLVxcXFx1MDM2ZlxcXFx1ZmUyMC1cXFxcdWZlMjNcXFxcdTIwZDAtXFxcXHUyMGYwXVwiLFwiZ1wiKSxJdD1SZWdFeHAoXCJcXFxcdWQ4M2NbXFxcXHVkZmZiLVxcXFx1ZGZmZl0oPz1cXFxcdWQ4M2NbXFxcXHVkZmZiLVxcXFx1ZGZmZl0pfFwiK2t0K0F0LFwiZ1wiKSxSdD1SZWdFeHAoW1wiW0EtWlxcXFx4YzAtXFxcXHhkNlxcXFx4ZDgtXFxcXHhkZV0/W2EtelxcXFx4ZGYtXFxcXHhmNlxcXFx4ZjgtXFxcXHhmZl0rKD86WydcXHUyMDE5XSg/OmR8bGx8bXxyZXxzfHR8dmUpKT8oPz1bXFxcXHhhY1xcXFx4YjFcXFxceGQ3XFxcXHhmN1xcXFx4MDAtXFxcXHgyZlxcXFx4M2EtXFxcXHg0MFxcXFx4NWItXFxcXHg2MFxcXFx4N2ItXFxcXHhiZlxcXFx1MjAwMC1cXFxcdTIwNmYgXFxcXHRcXFxceDBiXFxcXGZcXFxceGEwXFxcXHVmZWZmXFxcXG5cXFxcclxcXFx1MjAyOFxcXFx1MjAyOVxcXFx1MTY4MFxcXFx1MTgwZVxcXFx1MjAwMFxcXFx1MjAwMVxcXFx1MjAwMlxcXFx1MjAwM1xcXFx1MjAwNFxcXFx1MjAwNVxcXFx1MjAwNlxcXFx1MjAwN1xcXFx1MjAwOFxcXFx1MjAwOVxcXFx1MjAwYVxcXFx1MjAyZlxcXFx1MjA1ZlxcXFx1MzAwMF18W0EtWlxcXFx4YzAtXFxcXHhkNlxcXFx4ZDgtXFxcXHhkZV18JCl8KD86W0EtWlxcXFx4YzAtXFxcXHhkNlxcXFx4ZDgtXFxcXHhkZV18W15cXFxcdWQ4MDAtXFxcXHVkZmZmXFxcXHhhY1xcXFx4YjFcXFxceGQ3XFxcXHhmN1xcXFx4MDAtXFxcXHgyZlxcXFx4M2EtXFxcXHg0MFxcXFx4NWItXFxcXHg2MFxcXFx4N2ItXFxcXHhiZlxcXFx1MjAwMC1cXFxcdTIwNmYgXFxcXHRcXFxceDBiXFxcXGZcXFxceGEwXFxcXHVmZWZmXFxcXG5cXFxcclxcXFx1MjAyOFxcXFx1MjAyOVxcXFx1MTY4MFxcXFx1MTgwZVxcXFx1MjAwMFxcXFx1MjAwMVxcXFx1MjAwMlxcXFx1MjAwM1xcXFx1MjAwNFxcXFx1MjAwNVxcXFx1MjAwNlxcXFx1MjAwN1xcXFx1MjAwOFxcXFx1MjAwOVxcXFx1MjAwYVxcXFx1MjAyZlxcXFx1MjA1ZlxcXFx1MzAwMFxcXFxkK1xcXFx1MjcwMC1cXFxcdTI3YmZhLXpcXFxceGRmLVxcXFx4ZjZcXFxceGY4LVxcXFx4ZmZBLVpcXFxceGMwLVxcXFx4ZDZcXFxceGQ4LVxcXFx4ZGVdKSsoPzpbJ1xcdTIwMTldKD86RHxMTHxNfFJFfFN8VHxWRSkpPyg/PVtcXFxceGFjXFxcXHhiMVxcXFx4ZDdcXFxceGY3XFxcXHgwMC1cXFxceDJmXFxcXHgzYS1cXFxceDQwXFxcXHg1Yi1cXFxceDYwXFxcXHg3Yi1cXFxceGJmXFxcXHUyMDAwLVxcXFx1MjA2ZiBcXFxcdFxcXFx4MGJcXFxcZlxcXFx4YTBcXFxcdWZlZmZcXFxcblxcXFxyXFxcXHUyMDI4XFxcXHUyMDI5XFxcXHUxNjgwXFxcXHUxODBlXFxcXHUyMDAwXFxcXHUyMDAxXFxcXHUyMDAyXFxcXHUyMDAzXFxcXHUyMDA0XFxcXHUyMDA1XFxcXHUyMDA2XFxcXHUyMDA3XFxcXHUyMDA4XFxcXHUyMDA5XFxcXHUyMDBhXFxcXHUyMDJmXFxcXHUyMDVmXFxcXHUzMDAwXXxbQS1aXFxcXHhjMC1cXFxceGQ2XFxcXHhkOC1cXFxceGRlXSg/OlthLXpcXFxceGRmLVxcXFx4ZjZcXFxceGY4LVxcXFx4ZmZdfFteXFxcXHVkODAwLVxcXFx1ZGZmZlxcXFx4YWNcXFxceGIxXFxcXHhkN1xcXFx4ZjdcXFxceDAwLVxcXFx4MmZcXFxceDNhLVxcXFx4NDBcXFxceDViLVxcXFx4NjBcXFxceDdiLVxcXFx4YmZcXFxcdTIwMDAtXFxcXHUyMDZmIFxcXFx0XFxcXHgwYlxcXFxmXFxcXHhhMFxcXFx1ZmVmZlxcXFxuXFxcXHJcXFxcdTIwMjhcXFxcdTIwMjlcXFxcdTE2ODBcXFxcdTE4MGVcXFxcdTIwMDBcXFxcdTIwMDFcXFxcdTIwMDJcXFxcdTIwMDNcXFxcdTIwMDRcXFxcdTIwMDVcXFxcdTIwMDZcXFxcdTIwMDdcXFxcdTIwMDhcXFxcdTIwMDlcXFxcdTIwMGFcXFxcdTIwMmZcXFxcdTIwNWZcXFxcdTMwMDBcXFxcZCtcXFxcdTI3MDAtXFxcXHUyN2JmYS16XFxcXHhkZi1cXFxceGY2XFxcXHhmOC1cXFxceGZmQS1aXFxcXHhjMC1cXFxceGQ2XFxcXHhkOC1cXFxceGRlXSl8JCl8W0EtWlxcXFx4YzAtXFxcXHhkNlxcXFx4ZDgtXFxcXHhkZV0/KD86W2EtelxcXFx4ZGYtXFxcXHhmNlxcXFx4ZjgtXFxcXHhmZl18W15cXFxcdWQ4MDAtXFxcXHVkZmZmXFxcXHhhY1xcXFx4YjFcXFxceGQ3XFxcXHhmN1xcXFx4MDAtXFxcXHgyZlxcXFx4M2EtXFxcXHg0MFxcXFx4NWItXFxcXHg2MFxcXFx4N2ItXFxcXHhiZlxcXFx1MjAwMC1cXFxcdTIwNmYgXFxcXHRcXFxceDBiXFxcXGZcXFxceGEwXFxcXHVmZWZmXFxcXG5cXFxcclxcXFx1MjAyOFxcXFx1MjAyOVxcXFx1MTY4MFxcXFx1MTgwZVxcXFx1MjAwMFxcXFx1MjAwMVxcXFx1MjAwMlxcXFx1MjAwM1xcXFx1MjAwNFxcXFx1MjAwNVxcXFx1MjAwNlxcXFx1MjAwN1xcXFx1MjAwOFxcXFx1MjAwOVxcXFx1MjAwYVxcXFx1MjAyZlxcXFx1MjA1ZlxcXFx1MzAwMFxcXFxkK1xcXFx1MjcwMC1cXFxcdTI3YmZhLXpcXFxceGRmLVxcXFx4ZjZcXFxceGY4LVxcXFx4ZmZBLVpcXFxceGMwLVxcXFx4ZDZcXFxceGQ4LVxcXFx4ZGVdKSsoPzpbJ1xcdTIwMTldKD86ZHxsbHxtfHJlfHN8dHx2ZSkpP3xbQS1aXFxcXHhjMC1cXFxceGQ2XFxcXHhkOC1cXFxceGRlXSsoPzpbJ1xcdTIwMTldKD86RHxMTHxNfFJFfFN8VHxWRSkpP3xcXFxcZCtcIixPdF0uam9pbihcInxcIiksXCJnXCIpLFd0PVJlZ0V4cChcIltcXFxcdTIwMGRcXFxcdWQ4MDAtXFxcXHVkZmZmXFxcXHUwMzAwLVxcXFx1MDM2ZlxcXFx1ZmUyMC1cXFxcdWZlMjNcXFxcdTIwZDAtXFxcXHUyMGYwXFxcXHVmZTBlXFxcXHVmZTBmXVwiKSxCdD0vW2Etel1bQS1aXXxbQS1aXXsyLH1bYS16XXxbMC05XVthLXpBLVpdfFthLXpBLVpdWzAtOV18W15hLXpBLVowLTkgXS8sTHQ9XCJBcnJheSBCdWZmZXIgRGF0YVZpZXcgRGF0ZSBFcnJvciBGbG9hdDMyQXJyYXkgRmxvYXQ2NEFycmF5IEZ1bmN0aW9uIEludDhBcnJheSBJbnQxNkFycmF5IEludDMyQXJyYXkgTWFwIE1hdGggT2JqZWN0IFByb21pc2UgUmVmbGVjdCBSZWdFeHAgU2V0IFN0cmluZyBTeW1ib2wgVHlwZUVycm9yIFVpbnQ4QXJyYXkgVWludDhDbGFtcGVkQXJyYXkgVWludDE2QXJyYXkgVWludDMyQXJyYXkgV2Vha01hcCBfIGlzRmluaXRlIHBhcnNlSW50IHNldFRpbWVvdXRcIi5zcGxpdChcIiBcIiksTXQ9e307XHJcbk10W1wiW29iamVjdCBGbG9hdDMyQXJyYXldXCJdPU10W1wiW29iamVjdCBGbG9hdDY0QXJyYXldXCJdPU10W1wiW29iamVjdCBJbnQ4QXJyYXldXCJdPU10W1wiW29iamVjdCBJbnQxNkFycmF5XVwiXT1NdFtcIltvYmplY3QgSW50MzJBcnJheV1cIl09TXRbXCJbb2JqZWN0IFVpbnQ4QXJyYXldXCJdPU10W1wiW29iamVjdCBVaW50OENsYW1wZWRBcnJheV1cIl09TXRbXCJbb2JqZWN0IFVpbnQxNkFycmF5XVwiXT1NdFtcIltvYmplY3QgVWludDMyQXJyYXldXCJdPXRydWUsTXRbXCJbb2JqZWN0IEFyZ3VtZW50c11cIl09TXRbXCJbb2JqZWN0IEFycmF5XVwiXT1NdFtcIltvYmplY3QgQXJyYXlCdWZmZXJdXCJdPU10W1wiW29iamVjdCBCb29sZWFuXVwiXT1NdFtcIltvYmplY3QgRGF0YVZpZXddXCJdPU10W1wiW29iamVjdCBEYXRlXVwiXT1NdFtcIltvYmplY3QgRXJyb3JdXCJdPU10W1wiW29iamVjdCBGdW5jdGlvbl1cIl09TXRbXCJbb2JqZWN0IE1hcF1cIl09TXRbXCJbb2JqZWN0IE51bWJlcl1cIl09TXRbXCJbb2JqZWN0IE9iamVjdF1cIl09TXRbXCJbb2JqZWN0IFJlZ0V4cF1cIl09TXRbXCJbb2JqZWN0IFNldF1cIl09TXRbXCJbb2JqZWN0IFN0cmluZ11cIl09TXRbXCJbb2JqZWN0IFdlYWtNYXBdXCJdPWZhbHNlO1xyXG52YXIgQ3Q9e307Q3RbXCJbb2JqZWN0IEFyZ3VtZW50c11cIl09Q3RbXCJbb2JqZWN0IEFycmF5XVwiXT1DdFtcIltvYmplY3QgQXJyYXlCdWZmZXJdXCJdPUN0W1wiW29iamVjdCBEYXRhVmlld11cIl09Q3RbXCJbb2JqZWN0IEJvb2xlYW5dXCJdPUN0W1wiW29iamVjdCBEYXRlXVwiXT1DdFtcIltvYmplY3QgRmxvYXQzMkFycmF5XVwiXT1DdFtcIltvYmplY3QgRmxvYXQ2NEFycmF5XVwiXT1DdFtcIltvYmplY3QgSW50OEFycmF5XVwiXT1DdFtcIltvYmplY3QgSW50MTZBcnJheV1cIl09Q3RbXCJbb2JqZWN0IEludDMyQXJyYXldXCJdPUN0W1wiW29iamVjdCBNYXBdXCJdPUN0W1wiW29iamVjdCBOdW1iZXJdXCJdPUN0W1wiW29iamVjdCBPYmplY3RdXCJdPUN0W1wiW29iamVjdCBSZWdFeHBdXCJdPUN0W1wiW29iamVjdCBTZXRdXCJdPUN0W1wiW29iamVjdCBTdHJpbmddXCJdPUN0W1wiW29iamVjdCBTeW1ib2xdXCJdPUN0W1wiW29iamVjdCBVaW50OEFycmF5XVwiXT1DdFtcIltvYmplY3QgVWludDhDbGFtcGVkQXJyYXldXCJdPUN0W1wiW29iamVjdCBVaW50MTZBcnJheV1cIl09Q3RbXCJbb2JqZWN0IFVpbnQzMkFycmF5XVwiXT10cnVlLFxyXG5DdFtcIltvYmplY3QgRXJyb3JdXCJdPUN0W1wiW29iamVjdCBGdW5jdGlvbl1cIl09Q3RbXCJbb2JqZWN0IFdlYWtNYXBdXCJdPWZhbHNlO3ZhciB6dD17XCJcXHhjMFwiOlwiQVwiLFwiXFx4YzFcIjpcIkFcIixcIlxceGMyXCI6XCJBXCIsXCJcXHhjM1wiOlwiQVwiLFwiXFx4YzRcIjpcIkFcIixcIlxceGM1XCI6XCJBXCIsXCJcXHhlMFwiOlwiYVwiLFwiXFx4ZTFcIjpcImFcIixcIlxceGUyXCI6XCJhXCIsXCJcXHhlM1wiOlwiYVwiLFwiXFx4ZTRcIjpcImFcIixcIlxceGU1XCI6XCJhXCIsXCJcXHhjN1wiOlwiQ1wiLFwiXFx4ZTdcIjpcImNcIixcIlxceGQwXCI6XCJEXCIsXCJcXHhmMFwiOlwiZFwiLFwiXFx4YzhcIjpcIkVcIixcIlxceGM5XCI6XCJFXCIsXCJcXHhjYVwiOlwiRVwiLFwiXFx4Y2JcIjpcIkVcIixcIlxceGU4XCI6XCJlXCIsXCJcXHhlOVwiOlwiZVwiLFwiXFx4ZWFcIjpcImVcIixcIlxceGViXCI6XCJlXCIsXCJcXHhjY1wiOlwiSVwiLFwiXFx4Y2RcIjpcIklcIixcIlxceGNlXCI6XCJJXCIsXCJcXHhjZlwiOlwiSVwiLFwiXFx4ZWNcIjpcImlcIixcIlxceGVkXCI6XCJpXCIsXCJcXHhlZVwiOlwiaVwiLFwiXFx4ZWZcIjpcImlcIixcIlxceGQxXCI6XCJOXCIsXCJcXHhmMVwiOlwiblwiLFwiXFx4ZDJcIjpcIk9cIixcIlxceGQzXCI6XCJPXCIsXCJcXHhkNFwiOlwiT1wiLFwiXFx4ZDVcIjpcIk9cIixcIlxceGQ2XCI6XCJPXCIsXHJcblwiXFx4ZDhcIjpcIk9cIixcIlxceGYyXCI6XCJvXCIsXCJcXHhmM1wiOlwib1wiLFwiXFx4ZjRcIjpcIm9cIixcIlxceGY1XCI6XCJvXCIsXCJcXHhmNlwiOlwib1wiLFwiXFx4ZjhcIjpcIm9cIixcIlxceGQ5XCI6XCJVXCIsXCJcXHhkYVwiOlwiVVwiLFwiXFx4ZGJcIjpcIlVcIixcIlxceGRjXCI6XCJVXCIsXCJcXHhmOVwiOlwidVwiLFwiXFx4ZmFcIjpcInVcIixcIlxceGZiXCI6XCJ1XCIsXCJcXHhmY1wiOlwidVwiLFwiXFx4ZGRcIjpcIllcIixcIlxceGZkXCI6XCJ5XCIsXCJcXHhmZlwiOlwieVwiLFwiXFx4YzZcIjpcIkFlXCIsXCJcXHhlNlwiOlwiYWVcIixcIlxceGRlXCI6XCJUaFwiLFwiXFx4ZmVcIjpcInRoXCIsXCJcXHhkZlwiOlwic3NcIn0sVXQ9e1wiJlwiOlwiJmFtcDtcIixcIjxcIjpcIiZsdDtcIixcIj5cIjpcIiZndDtcIiwnXCInOlwiJnF1b3Q7XCIsXCInXCI6XCImIzM5O1wiLFwiYFwiOlwiJiM5NjtcIn0sJHQ9e1wiJmFtcDtcIjpcIiZcIixcIiZsdDtcIjpcIjxcIixcIiZndDtcIjpcIj5cIixcIiZxdW90O1wiOidcIicsXCImIzM5O1wiOlwiJ1wiLFwiJiM5NjtcIjpcImBcIn0sRHQ9e1wiXFxcXFwiOlwiXFxcXFwiLFwiJ1wiOlwiJ1wiLFwiXFxuXCI6XCJuXCIsXCJcXHJcIjpcInJcIixcIlxcdTIwMjhcIjpcInUyMDI4XCIsXCJcXHUyMDI5XCI6XCJ1MjAyOVwifSxGdD1wYXJzZUZsb2F0LE50PXBhcnNlSW50LFB0PXR5cGVvZiBleHBvcnRzPT1cIm9iamVjdFwiJiZleHBvcnRzLFp0PVB0JiZ0eXBlb2YgbW9kdWxlPT1cIm9iamVjdFwiJiZtb2R1bGUsVHQ9WnQmJlp0LmV4cG9ydHM9PT1QdCxxdD1SKHR5cGVvZiBzZWxmPT1cIm9iamVjdFwiJiZzZWxmKSxWdD1SKHR5cGVvZiB0aGlzPT1cIm9iamVjdFwiJiZ0aGlzKSxLdD1SKHR5cGVvZiBnbG9iYWw9PVwib2JqZWN0XCImJmdsb2JhbCl8fHF0fHxWdHx8RnVuY3Rpb24oXCJyZXR1cm4gdGhpc1wiKSgpLEd0PVooKTtcclxuKHF0fHx7fSkuXz1HdCx0eXBlb2YgZGVmaW5lPT1cImZ1bmN0aW9uXCImJnR5cGVvZiBkZWZpbmUuYW1kPT1cIm9iamVjdFwiJiZkZWZpbmUuYW1kPyBkZWZpbmUoZnVuY3Rpb24oKXtyZXR1cm4gR3R9KTpadD8oKFp0LmV4cG9ydHM9R3QpLl89R3QsUHQuXz1HdCk6S3QuXz1HdH0pLmNhbGwodGhpcyk7Iiwid2luZG93Lk1vZGVybml6cj1mdW5jdGlvbihlLHQsbil7ZnVuY3Rpb24gcihlKXtiLmNzc1RleHQ9ZX1mdW5jdGlvbiBvKGUsdCl7cmV0dXJuIHIoUy5qb2luKGUrXCI7XCIpKyh0fHxcIlwiKSl9ZnVuY3Rpb24gYShlLHQpe3JldHVybiB0eXBlb2YgZT09PXR9ZnVuY3Rpb24gaShlLHQpe3JldHVybiEhfihcIlwiK2UpLmluZGV4T2YodCl9ZnVuY3Rpb24gYyhlLHQpe2Zvcih2YXIgciBpbiBlKXt2YXIgbz1lW3JdO2lmKCFpKG8sXCItXCIpJiZiW29dIT09bilyZXR1cm5cInBmeFwiPT10P286ITB9cmV0dXJuITF9ZnVuY3Rpb24gcyhlLHQscil7Zm9yKHZhciBvIGluIGUpe3ZhciBpPXRbZVtvXV07aWYoaSE9PW4pcmV0dXJuIHI9PT0hMT9lW29dOmEoaSxcImZ1bmN0aW9uXCIpP2kuYmluZChyfHx0KTppfXJldHVybiExfWZ1bmN0aW9uIHUoZSx0LG4pe3ZhciByPWUuY2hhckF0KDApLnRvVXBwZXJDYXNlKCkrZS5zbGljZSgxKSxvPShlK1wiIFwiK2suam9pbihyK1wiIFwiKStyKS5zcGxpdChcIiBcIik7cmV0dXJuIGEodCxcInN0cmluZ1wiKXx8YSh0LFwidW5kZWZpbmVkXCIpP2Mobyx0KToobz0oZStcIiBcIitULmpvaW4ocitcIiBcIikrcikuc3BsaXQoXCIgXCIpLHMobyx0LG4pKX1mdW5jdGlvbiBsKCl7cC5pbnB1dD1mdW5jdGlvbihuKXtmb3IodmFyIHI9MCxvPW4ubGVuZ3RoO28+cjtyKyspaltuW3JdXT0hIShuW3JdaW4gRSk7cmV0dXJuIGoubGlzdCYmKGoubGlzdD0hKCF0LmNyZWF0ZUVsZW1lbnQoXCJkYXRhbGlzdFwiKXx8IWUuSFRNTERhdGFMaXN0RWxlbWVudCkpLGp9KFwiYXV0b2NvbXBsZXRlIGF1dG9mb2N1cyBsaXN0IHBsYWNlaG9sZGVyIG1heCBtaW4gbXVsdGlwbGUgcGF0dGVybiByZXF1aXJlZCBzdGVwXCIuc3BsaXQoXCIgXCIpKSxwLmlucHV0dHlwZXM9ZnVuY3Rpb24oZSl7Zm9yKHZhciByLG8sYSxpPTAsYz1lLmxlbmd0aDtjPmk7aSsrKUUuc2V0QXR0cmlidXRlKFwidHlwZVwiLG89ZVtpXSkscj1cInRleHRcIiE9PUUudHlwZSxyJiYoRS52YWx1ZT14LEUuc3R5bGUuY3NzVGV4dD1cInBvc2l0aW9uOmFic29sdXRlO3Zpc2liaWxpdHk6aGlkZGVuO1wiLC9ecmFuZ2UkLy50ZXN0KG8pJiZFLnN0eWxlLldlYmtpdEFwcGVhcmFuY2UhPT1uPyhnLmFwcGVuZENoaWxkKEUpLGE9dC5kZWZhdWx0VmlldyxyPWEuZ2V0Q29tcHV0ZWRTdHlsZSYmXCJ0ZXh0ZmllbGRcIiE9PWEuZ2V0Q29tcHV0ZWRTdHlsZShFLG51bGwpLldlYmtpdEFwcGVhcmFuY2UmJjAhPT1FLm9mZnNldEhlaWdodCxnLnJlbW92ZUNoaWxkKEUpKTovXihzZWFyY2h8dGVsKSQvLnRlc3Qobyl8fChyPS9eKHVybHxlbWFpbCkkLy50ZXN0KG8pP0UuY2hlY2tWYWxpZGl0eSYmRS5jaGVja1ZhbGlkaXR5KCk9PT0hMTpFLnZhbHVlIT14KSksUFtlW2ldXT0hIXI7cmV0dXJuIFB9KFwic2VhcmNoIHRlbCB1cmwgZW1haWwgZGF0ZXRpbWUgZGF0ZSBtb250aCB3ZWVrIHRpbWUgZGF0ZXRpbWUtbG9jYWwgbnVtYmVyIHJhbmdlIGNvbG9yXCIuc3BsaXQoXCIgXCIpKX12YXIgZCxmLG09XCIyLjguM1wiLHA9e30saD0hMCxnPXQuZG9jdW1lbnRFbGVtZW50LHY9XCJtb2Rlcm5penJcIix5PXQuY3JlYXRlRWxlbWVudCh2KSxiPXkuc3R5bGUsRT10LmNyZWF0ZUVsZW1lbnQoXCJpbnB1dFwiKSx4PVwiOilcIix3PXt9LnRvU3RyaW5nLFM9XCIgLXdlYmtpdC0gLW1vei0gLW8tIC1tcy0gXCIuc3BsaXQoXCIgXCIpLEM9XCJXZWJraXQgTW96IE8gbXNcIixrPUMuc3BsaXQoXCIgXCIpLFQ9Qy50b0xvd2VyQ2FzZSgpLnNwbGl0KFwiIFwiKSxOPXtzdmc6XCJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2Z1wifSxNPXt9LFA9e30saj17fSwkPVtdLEQ9JC5zbGljZSxGPWZ1bmN0aW9uKGUsbixyLG8pe3ZhciBhLGksYyxzLHU9dC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpLGw9dC5ib2R5LGQ9bHx8dC5jcmVhdGVFbGVtZW50KFwiYm9keVwiKTtpZihwYXJzZUludChyLDEwKSlmb3IoO3ItLTspYz10LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIiksYy5pZD1vP29bcl06disocisxKSx1LmFwcGVuZENoaWxkKGMpO3JldHVybiBhPVtcIiYjMTczO1wiLCc8c3R5bGUgaWQ9XCJzJyx2LCdcIj4nLGUsXCI8L3N0eWxlPlwiXS5qb2luKFwiXCIpLHUuaWQ9diwobD91OmQpLmlubmVySFRNTCs9YSxkLmFwcGVuZENoaWxkKHUpLGx8fChkLnN0eWxlLmJhY2tncm91bmQ9XCJcIixkLnN0eWxlLm92ZXJmbG93PVwiaGlkZGVuXCIscz1nLnN0eWxlLm92ZXJmbG93LGcuc3R5bGUub3ZlcmZsb3c9XCJoaWRkZW5cIixnLmFwcGVuZENoaWxkKGQpKSxpPW4odSxlKSxsP3UucGFyZW50Tm9kZS5yZW1vdmVDaGlsZCh1KTooZC5wYXJlbnROb2RlLnJlbW92ZUNoaWxkKGQpLGcuc3R5bGUub3ZlcmZsb3c9cyksISFpfSx6PWZ1bmN0aW9uKHQpe3ZhciBuPWUubWF0Y2hNZWRpYXx8ZS5tc01hdGNoTWVkaWE7aWYobilyZXR1cm4gbih0KSYmbih0KS5tYXRjaGVzfHwhMTt2YXIgcjtyZXR1cm4gRihcIkBtZWRpYSBcIit0K1wiIHsgI1wiK3YrXCIgeyBwb3NpdGlvbjogYWJzb2x1dGU7IH0gfVwiLGZ1bmN0aW9uKHQpe3I9XCJhYnNvbHV0ZVwiPT0oZS5nZXRDb21wdXRlZFN0eWxlP2dldENvbXB1dGVkU3R5bGUodCxudWxsKTp0LmN1cnJlbnRTdHlsZSkucG9zaXRpb259KSxyfSxBPWZ1bmN0aW9uKCl7ZnVuY3Rpb24gZShlLG8pe289b3x8dC5jcmVhdGVFbGVtZW50KHJbZV18fFwiZGl2XCIpLGU9XCJvblwiK2U7dmFyIGk9ZSBpbiBvO3JldHVybiBpfHwoby5zZXRBdHRyaWJ1dGV8fChvPXQuY3JlYXRlRWxlbWVudChcImRpdlwiKSksby5zZXRBdHRyaWJ1dGUmJm8ucmVtb3ZlQXR0cmlidXRlJiYoby5zZXRBdHRyaWJ1dGUoZSxcIlwiKSxpPWEob1tlXSxcImZ1bmN0aW9uXCIpLGEob1tlXSxcInVuZGVmaW5lZFwiKXx8KG9bZV09biksby5yZW1vdmVBdHRyaWJ1dGUoZSkpKSxvPW51bGwsaX12YXIgcj17c2VsZWN0OlwiaW5wdXRcIixjaGFuZ2U6XCJpbnB1dFwiLHN1Ym1pdDpcImZvcm1cIixyZXNldDpcImZvcm1cIixlcnJvcjpcImltZ1wiLGxvYWQ6XCJpbWdcIixhYm9ydDpcImltZ1wifTtyZXR1cm4gZX0oKSxMPXt9Lmhhc093blByb3BlcnR5O2Y9YShMLFwidW5kZWZpbmVkXCIpfHxhKEwuY2FsbCxcInVuZGVmaW5lZFwiKT9mdW5jdGlvbihlLHQpe3JldHVybiB0IGluIGUmJmEoZS5jb25zdHJ1Y3Rvci5wcm90b3R5cGVbdF0sXCJ1bmRlZmluZWRcIil9OmZ1bmN0aW9uKGUsdCl7cmV0dXJuIEwuY2FsbChlLHQpfSxGdW5jdGlvbi5wcm90b3R5cGUuYmluZHx8KEZ1bmN0aW9uLnByb3RvdHlwZS5iaW5kPWZ1bmN0aW9uKGUpe3ZhciB0PXRoaXM7aWYoXCJmdW5jdGlvblwiIT10eXBlb2YgdCl0aHJvdyBuZXcgVHlwZUVycm9yO3ZhciBuPUQuY2FsbChhcmd1bWVudHMsMSkscj1mdW5jdGlvbigpe2lmKHRoaXMgaW5zdGFuY2VvZiByKXt2YXIgbz1mdW5jdGlvbigpe307by5wcm90b3R5cGU9dC5wcm90b3R5cGU7dmFyIGE9bmV3IG8saT10LmFwcGx5KGEsbi5jb25jYXQoRC5jYWxsKGFyZ3VtZW50cykpKTtyZXR1cm4gT2JqZWN0KGkpPT09aT9pOmF9cmV0dXJuIHQuYXBwbHkoZSxuLmNvbmNhdChELmNhbGwoYXJndW1lbnRzKSkpfTtyZXR1cm4gcn0pLE0uZmxleGJveD1mdW5jdGlvbigpe3JldHVybiB1KFwiZmxleFdyYXBcIil9LE0uZmxleGJveGxlZ2FjeT1mdW5jdGlvbigpe3JldHVybiB1KFwiYm94RGlyZWN0aW9uXCIpfSxNLmNhbnZhcz1mdW5jdGlvbigpe3ZhciBlPXQuY3JlYXRlRWxlbWVudChcImNhbnZhc1wiKTtyZXR1cm4hKCFlLmdldENvbnRleHR8fCFlLmdldENvbnRleHQoXCIyZFwiKSl9LE0uY2FudmFzdGV4dD1mdW5jdGlvbigpe3JldHVybiEoIXAuY2FudmFzfHwhYSh0LmNyZWF0ZUVsZW1lbnQoXCJjYW52YXNcIikuZ2V0Q29udGV4dChcIjJkXCIpLmZpbGxUZXh0LFwiZnVuY3Rpb25cIikpfSxNLndlYmdsPWZ1bmN0aW9uKCl7cmV0dXJuISFlLldlYkdMUmVuZGVyaW5nQ29udGV4dH0sTS50b3VjaD1mdW5jdGlvbigpe3ZhciBuO3JldHVyblwib250b3VjaHN0YXJ0XCJpbiBlfHxlLkRvY3VtZW50VG91Y2gmJnQgaW5zdGFuY2VvZiBEb2N1bWVudFRvdWNoP249ITA6RihbXCJAbWVkaWEgKFwiLFMuam9pbihcInRvdWNoLWVuYWJsZWQpLChcIiksdixcIilcIixcInsjbW9kZXJuaXpye3RvcDo5cHg7cG9zaXRpb246YWJzb2x1dGV9fVwiXS5qb2luKFwiXCIpLGZ1bmN0aW9uKGUpe249OT09PWUub2Zmc2V0VG9wfSksbn0sTS5nZW9sb2NhdGlvbj1mdW5jdGlvbigpe3JldHVyblwiZ2VvbG9jYXRpb25cImluIG5hdmlnYXRvcn0sTS5wb3N0bWVzc2FnZT1mdW5jdGlvbigpe3JldHVybiEhZS5wb3N0TWVzc2FnZX0sTS53ZWJzcWxkYXRhYmFzZT1mdW5jdGlvbigpe3JldHVybiEhZS5vcGVuRGF0YWJhc2V9LE0uaW5kZXhlZERCPWZ1bmN0aW9uKCl7cmV0dXJuISF1KFwiaW5kZXhlZERCXCIsZSl9LE0uaGFzaGNoYW5nZT1mdW5jdGlvbigpe3JldHVybiBBKFwiaGFzaGNoYW5nZVwiLGUpJiYodC5kb2N1bWVudE1vZGU9PT1ufHx0LmRvY3VtZW50TW9kZT43KX0sTS5oaXN0b3J5PWZ1bmN0aW9uKCl7cmV0dXJuISghZS5oaXN0b3J5fHwhaGlzdG9yeS5wdXNoU3RhdGUpfSxNLmRyYWdhbmRkcm9wPWZ1bmN0aW9uKCl7dmFyIGU9dC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpO3JldHVyblwiZHJhZ2dhYmxlXCJpbiBlfHxcIm9uZHJhZ3N0YXJ0XCJpbiBlJiZcIm9uZHJvcFwiaW4gZX0sTS53ZWJzb2NrZXRzPWZ1bmN0aW9uKCl7cmV0dXJuXCJXZWJTb2NrZXRcImluIGV8fFwiTW96V2ViU29ja2V0XCJpbiBlfSxNLnJnYmE9ZnVuY3Rpb24oKXtyZXR1cm4gcihcImJhY2tncm91bmQtY29sb3I6cmdiYSgxNTAsMjU1LDE1MCwuNSlcIiksaShiLmJhY2tncm91bmRDb2xvcixcInJnYmFcIil9LE0uaHNsYT1mdW5jdGlvbigpe3JldHVybiByKFwiYmFja2dyb3VuZC1jb2xvcjpoc2xhKDEyMCw0MCUsMTAwJSwuNSlcIiksaShiLmJhY2tncm91bmRDb2xvcixcInJnYmFcIil8fGkoYi5iYWNrZ3JvdW5kQ29sb3IsXCJoc2xhXCIpfSxNLm11bHRpcGxlYmdzPWZ1bmN0aW9uKCl7cmV0dXJuIHIoXCJiYWNrZ3JvdW5kOnVybChodHRwczovLyksdXJsKGh0dHBzOi8vKSxyZWQgdXJsKGh0dHBzOi8vKVwiKSwvKHVybFxccypcXCguKj8pezN9Ly50ZXN0KGIuYmFja2dyb3VuZCl9LE0uYmFja2dyb3VuZHNpemU9ZnVuY3Rpb24oKXtyZXR1cm4gdShcImJhY2tncm91bmRTaXplXCIpfSxNLmJvcmRlcmltYWdlPWZ1bmN0aW9uKCl7cmV0dXJuIHUoXCJib3JkZXJJbWFnZVwiKX0sTS5ib3JkZXJyYWRpdXM9ZnVuY3Rpb24oKXtyZXR1cm4gdShcImJvcmRlclJhZGl1c1wiKX0sTS5ib3hzaGFkb3c9ZnVuY3Rpb24oKXtyZXR1cm4gdShcImJveFNoYWRvd1wiKX0sTS50ZXh0c2hhZG93PWZ1bmN0aW9uKCl7cmV0dXJuXCJcIj09PXQuY3JlYXRlRWxlbWVudChcImRpdlwiKS5zdHlsZS50ZXh0U2hhZG93fSxNLm9wYWNpdHk9ZnVuY3Rpb24oKXtyZXR1cm4gbyhcIm9wYWNpdHk6LjU1XCIpLC9eMC41NSQvLnRlc3QoYi5vcGFjaXR5KX0sTS5jc3NhbmltYXRpb25zPWZ1bmN0aW9uKCl7cmV0dXJuIHUoXCJhbmltYXRpb25OYW1lXCIpfSxNLmNzc2NvbHVtbnM9ZnVuY3Rpb24oKXtyZXR1cm4gdShcImNvbHVtbkNvdW50XCIpfSxNLmNzc2dyYWRpZW50cz1mdW5jdGlvbigpe3ZhciBlPVwiYmFja2dyb3VuZC1pbWFnZTpcIix0PVwiZ3JhZGllbnQobGluZWFyLGxlZnQgdG9wLHJpZ2h0IGJvdHRvbSxmcm9tKCM5ZjkpLHRvKHdoaXRlKSk7XCIsbj1cImxpbmVhci1ncmFkaWVudChsZWZ0IHRvcCwjOWY5LCB3aGl0ZSk7XCI7cmV0dXJuIHIoKGUrXCItd2Via2l0LSBcIi5zcGxpdChcIiBcIikuam9pbih0K2UpK1Muam9pbihuK2UpKS5zbGljZSgwLC1lLmxlbmd0aCkpLGkoYi5iYWNrZ3JvdW5kSW1hZ2UsXCJncmFkaWVudFwiKX0sTS5jc3NyZWZsZWN0aW9ucz1mdW5jdGlvbigpe3JldHVybiB1KFwiYm94UmVmbGVjdFwiKX0sTS5jc3N0cmFuc2Zvcm1zPWZ1bmN0aW9uKCl7cmV0dXJuISF1KFwidHJhbnNmb3JtXCIpfSxNLmNzc3RyYW5zZm9ybXMzZD1mdW5jdGlvbigpe3ZhciBlPSEhdShcInBlcnNwZWN0aXZlXCIpO3JldHVybiBlJiZcIndlYmtpdFBlcnNwZWN0aXZlXCJpbiBnLnN0eWxlJiZGKFwiQG1lZGlhICh0cmFuc2Zvcm0tM2QpLCgtd2Via2l0LXRyYW5zZm9ybS0zZCl7I21vZGVybml6cntsZWZ0OjlweDtwb3NpdGlvbjphYnNvbHV0ZTtoZWlnaHQ6M3B4O319XCIsZnVuY3Rpb24odCl7ZT05PT09dC5vZmZzZXRMZWZ0JiYzPT09dC5vZmZzZXRIZWlnaHR9KSxlfSxNLmNzc3RyYW5zaXRpb25zPWZ1bmN0aW9uKCl7cmV0dXJuIHUoXCJ0cmFuc2l0aW9uXCIpfSxNLmZvbnRmYWNlPWZ1bmN0aW9uKCl7dmFyIGU7cmV0dXJuIEYoJ0Bmb250LWZhY2Uge2ZvbnQtZmFtaWx5OlwiZm9udFwiO3NyYzp1cmwoXCJodHRwczovL1wiKX0nLGZ1bmN0aW9uKG4scil7dmFyIG89dC5nZXRFbGVtZW50QnlJZChcInNtb2Rlcm5penJcIiksYT1vLnNoZWV0fHxvLnN0eWxlU2hlZXQsaT1hP2EuY3NzUnVsZXMmJmEuY3NzUnVsZXNbMF0/YS5jc3NSdWxlc1swXS5jc3NUZXh0OmEuY3NzVGV4dHx8XCJcIjpcIlwiO2U9L3NyYy9pLnRlc3QoaSkmJjA9PT1pLmluZGV4T2Yoci5zcGxpdChcIiBcIilbMF0pfSksZX0sTS5nZW5lcmF0ZWRjb250ZW50PWZ1bmN0aW9uKCl7dmFyIGU7cmV0dXJuIEYoW1wiI1wiLHYsXCJ7Zm9udDowLzAgYX0jXCIsdiwnOmFmdGVye2NvbnRlbnQ6XCInLHgsJ1wiO3Zpc2liaWxpdHk6aGlkZGVuO2ZvbnQ6M3B4LzEgYX0nXS5qb2luKFwiXCIpLGZ1bmN0aW9uKHQpe2U9dC5vZmZzZXRIZWlnaHQ+PTN9KSxlfSxNLnZpZGVvPWZ1bmN0aW9uKCl7dmFyIGU9dC5jcmVhdGVFbGVtZW50KFwidmlkZW9cIiksbj0hMTt0cnl7KG49ISFlLmNhblBsYXlUeXBlKSYmKG49bmV3IEJvb2xlYW4obiksbi5vZ2c9ZS5jYW5QbGF5VHlwZSgndmlkZW8vb2dnOyBjb2RlY3M9XCJ0aGVvcmFcIicpLnJlcGxhY2UoL15ubyQvLFwiXCIpLG4uaDI2ND1lLmNhblBsYXlUeXBlKCd2aWRlby9tcDQ7IGNvZGVjcz1cImF2YzEuNDJFMDFFXCInKS5yZXBsYWNlKC9ebm8kLyxcIlwiKSxuLndlYm09ZS5jYW5QbGF5VHlwZSgndmlkZW8vd2VibTsgY29kZWNzPVwidnA4LCB2b3JiaXNcIicpLnJlcGxhY2UoL15ubyQvLFwiXCIpKX1jYXRjaChyKXt9cmV0dXJuIG59LE0uYXVkaW89ZnVuY3Rpb24oKXt2YXIgZT10LmNyZWF0ZUVsZW1lbnQoXCJhdWRpb1wiKSxuPSExO3RyeXsobj0hIWUuY2FuUGxheVR5cGUpJiYobj1uZXcgQm9vbGVhbihuKSxuLm9nZz1lLmNhblBsYXlUeXBlKCdhdWRpby9vZ2c7IGNvZGVjcz1cInZvcmJpc1wiJykucmVwbGFjZSgvXm5vJC8sXCJcIiksbi5tcDM9ZS5jYW5QbGF5VHlwZShcImF1ZGlvL21wZWc7XCIpLnJlcGxhY2UoL15ubyQvLFwiXCIpLG4ud2F2PWUuY2FuUGxheVR5cGUoJ2F1ZGlvL3dhdjsgY29kZWNzPVwiMVwiJykucmVwbGFjZSgvXm5vJC8sXCJcIiksbi5tNGE9KGUuY2FuUGxheVR5cGUoXCJhdWRpby94LW00YTtcIil8fGUuY2FuUGxheVR5cGUoXCJhdWRpby9hYWM7XCIpKS5yZXBsYWNlKC9ebm8kLyxcIlwiKSl9Y2F0Y2gocil7fXJldHVybiBufSxNLmxvY2Fsc3RvcmFnZT1mdW5jdGlvbigpe3RyeXtyZXR1cm4gbG9jYWxTdG9yYWdlLnNldEl0ZW0odix2KSxsb2NhbFN0b3JhZ2UucmVtb3ZlSXRlbSh2KSwhMH1jYXRjaChlKXtyZXR1cm4hMX19LE0uc2Vzc2lvbnN0b3JhZ2U9ZnVuY3Rpb24oKXt0cnl7cmV0dXJuIHNlc3Npb25TdG9yYWdlLnNldEl0ZW0odix2KSxzZXNzaW9uU3RvcmFnZS5yZW1vdmVJdGVtKHYpLCEwfWNhdGNoKGUpe3JldHVybiExfX0sTS53ZWJ3b3JrZXJzPWZ1bmN0aW9uKCl7cmV0dXJuISFlLldvcmtlcn0sTS5hcHBsaWNhdGlvbmNhY2hlPWZ1bmN0aW9uKCl7cmV0dXJuISFlLmFwcGxpY2F0aW9uQ2FjaGV9LE0uc3ZnPWZ1bmN0aW9uKCl7cmV0dXJuISF0LmNyZWF0ZUVsZW1lbnROUyYmISF0LmNyZWF0ZUVsZW1lbnROUyhOLnN2ZyxcInN2Z1wiKS5jcmVhdGVTVkdSZWN0fSxNLmlubGluZXN2Zz1mdW5jdGlvbigpe3ZhciBlPXQuY3JlYXRlRWxlbWVudChcImRpdlwiKTtyZXR1cm4gZS5pbm5lckhUTUw9XCI8c3ZnLz5cIiwoZS5maXJzdENoaWxkJiZlLmZpcnN0Q2hpbGQubmFtZXNwYWNlVVJJKT09Ti5zdmd9LE0uc21pbD1mdW5jdGlvbigpe3JldHVybiEhdC5jcmVhdGVFbGVtZW50TlMmJi9TVkdBbmltYXRlLy50ZXN0KHcuY2FsbCh0LmNyZWF0ZUVsZW1lbnROUyhOLnN2ZyxcImFuaW1hdGVcIikpKX0sTS5zdmdjbGlwcGF0aHM9ZnVuY3Rpb24oKXtyZXR1cm4hIXQuY3JlYXRlRWxlbWVudE5TJiYvU1ZHQ2xpcFBhdGgvLnRlc3Qody5jYWxsKHQuY3JlYXRlRWxlbWVudE5TKE4uc3ZnLFwiY2xpcFBhdGhcIikpKX07Zm9yKHZhciBIIGluIE0pZihNLEgpJiYoZD1ILnRvTG93ZXJDYXNlKCkscFtkXT1NW0hdKCksJC5wdXNoKChwW2RdP1wiXCI6XCJuby1cIikrZCkpO3JldHVybiBwLmlucHV0fHxsKCkscC5hZGRUZXN0PWZ1bmN0aW9uKGUsdCl7aWYoXCJvYmplY3RcIj09dHlwZW9mIGUpZm9yKHZhciByIGluIGUpZihlLHIpJiZwLmFkZFRlc3QocixlW3JdKTtlbHNle2lmKGU9ZS50b0xvd2VyQ2FzZSgpLHBbZV0hPT1uKXJldHVybiBwO3Q9XCJmdW5jdGlvblwiPT10eXBlb2YgdD90KCk6dCxcInVuZGVmaW5lZFwiIT10eXBlb2YgaCYmaCYmKGcuY2xhc3NOYW1lKz1cIiBcIisodD9cIlwiOlwibm8tXCIpK2UpLHBbZV09dH1yZXR1cm4gcH0scihcIlwiKSx5PUU9bnVsbCxmdW5jdGlvbihlLHQpe2Z1bmN0aW9uIG4oZSx0KXt2YXIgbj1lLmNyZWF0ZUVsZW1lbnQoXCJwXCIpLHI9ZS5nZXRFbGVtZW50c0J5VGFnTmFtZShcImhlYWRcIilbMF18fGUuZG9jdW1lbnRFbGVtZW50O3JldHVybiBuLmlubmVySFRNTD1cIng8c3R5bGU+XCIrdCtcIjwvc3R5bGU+XCIsci5pbnNlcnRCZWZvcmUobi5sYXN0Q2hpbGQsci5maXJzdENoaWxkKX1mdW5jdGlvbiByKCl7dmFyIGU9eS5lbGVtZW50cztyZXR1cm5cInN0cmluZ1wiPT10eXBlb2YgZT9lLnNwbGl0KFwiIFwiKTplfWZ1bmN0aW9uIG8oZSl7dmFyIHQ9dltlW2hdXTtyZXR1cm4gdHx8KHQ9e30sZysrLGVbaF09Zyx2W2ddPXQpLHR9ZnVuY3Rpb24gYShlLG4scil7aWYobnx8KG49dCksbClyZXR1cm4gbi5jcmVhdGVFbGVtZW50KGUpO3J8fChyPW8obikpO3ZhciBhO3JldHVybiBhPXIuY2FjaGVbZV0/ci5jYWNoZVtlXS5jbG9uZU5vZGUoKTpwLnRlc3QoZSk/KHIuY2FjaGVbZV09ci5jcmVhdGVFbGVtKGUpKS5jbG9uZU5vZGUoKTpyLmNyZWF0ZUVsZW0oZSksIWEuY2FuSGF2ZUNoaWxkcmVufHxtLnRlc3QoZSl8fGEudGFnVXJuP2E6ci5mcmFnLmFwcGVuZENoaWxkKGEpfWZ1bmN0aW9uIGkoZSxuKXtpZihlfHwoZT10KSxsKXJldHVybiBlLmNyZWF0ZURvY3VtZW50RnJhZ21lbnQoKTtuPW58fG8oZSk7Zm9yKHZhciBhPW4uZnJhZy5jbG9uZU5vZGUoKSxpPTAsYz1yKCkscz1jLmxlbmd0aDtzPmk7aSsrKWEuY3JlYXRlRWxlbWVudChjW2ldKTtyZXR1cm4gYX1mdW5jdGlvbiBjKGUsdCl7dC5jYWNoZXx8KHQuY2FjaGU9e30sdC5jcmVhdGVFbGVtPWUuY3JlYXRlRWxlbWVudCx0LmNyZWF0ZUZyYWc9ZS5jcmVhdGVEb2N1bWVudEZyYWdtZW50LHQuZnJhZz10LmNyZWF0ZUZyYWcoKSksZS5jcmVhdGVFbGVtZW50PWZ1bmN0aW9uKG4pe3JldHVybiB5LnNoaXZNZXRob2RzP2EobixlLHQpOnQuY3JlYXRlRWxlbShuKX0sZS5jcmVhdGVEb2N1bWVudEZyYWdtZW50PUZ1bmN0aW9uKFwiaCxmXCIsXCJyZXR1cm4gZnVuY3Rpb24oKXt2YXIgbj1mLmNsb25lTm9kZSgpLGM9bi5jcmVhdGVFbGVtZW50O2guc2hpdk1ldGhvZHMmJihcIityKCkuam9pbigpLnJlcGxhY2UoL1tcXHdcXC1dKy9nLGZ1bmN0aW9uKGUpe3JldHVybiB0LmNyZWF0ZUVsZW0oZSksdC5mcmFnLmNyZWF0ZUVsZW1lbnQoZSksJ2MoXCInK2UrJ1wiKSd9KStcIik7cmV0dXJuIG59XCIpKHksdC5mcmFnKX1mdW5jdGlvbiBzKGUpe2V8fChlPXQpO3ZhciByPW8oZSk7cmV0dXJuIXkuc2hpdkNTU3x8dXx8ci5oYXNDU1N8fChyLmhhc0NTUz0hIW4oZSxcImFydGljbGUsYXNpZGUsZGlhbG9nLGZpZ2NhcHRpb24sZmlndXJlLGZvb3RlcixoZWFkZXIsaGdyb3VwLG1haW4sbmF2LHNlY3Rpb257ZGlzcGxheTpibG9ja31tYXJre2JhY2tncm91bmQ6I0ZGMDtjb2xvcjojMDAwfXRlbXBsYXRle2Rpc3BsYXk6bm9uZX1cIikpLGx8fGMoZSxyKSxlfXZhciB1LGwsZD1cIjMuNy4wXCIsZj1lLmh0bWw1fHx7fSxtPS9ePHxeKD86YnV0dG9ufG1hcHxzZWxlY3R8dGV4dGFyZWF8b2JqZWN0fGlmcmFtZXxvcHRpb258b3B0Z3JvdXApJC9pLHA9L14oPzphfGJ8Y29kZXxkaXZ8ZmllbGRzZXR8aDF8aDJ8aDN8aDR8aDV8aDZ8aXxsYWJlbHxsaXxvbHxwfHF8c3BhbnxzdHJvbmd8c3R5bGV8dGFibGV8dGJvZHl8dGR8dGh8dHJ8dWwpJC9pLGg9XCJfaHRtbDVzaGl2XCIsZz0wLHY9e307IWZ1bmN0aW9uKCl7dHJ5e3ZhciBlPXQuY3JlYXRlRWxlbWVudChcImFcIik7ZS5pbm5lckhUTUw9XCI8eHl6PjwveHl6PlwiLHU9XCJoaWRkZW5cImluIGUsbD0xPT1lLmNoaWxkTm9kZXMubGVuZ3RofHxmdW5jdGlvbigpe3QuY3JlYXRlRWxlbWVudChcImFcIik7dmFyIGU9dC5jcmVhdGVEb2N1bWVudEZyYWdtZW50KCk7cmV0dXJuXCJ1bmRlZmluZWRcIj09dHlwZW9mIGUuY2xvbmVOb2RlfHxcInVuZGVmaW5lZFwiPT10eXBlb2YgZS5jcmVhdGVEb2N1bWVudEZyYWdtZW50fHxcInVuZGVmaW5lZFwiPT10eXBlb2YgZS5jcmVhdGVFbGVtZW50fSgpfWNhdGNoKG4pe3U9ITAsbD0hMH19KCk7dmFyIHk9e2VsZW1lbnRzOmYuZWxlbWVudHN8fFwiYWJiciBhcnRpY2xlIGFzaWRlIGF1ZGlvIGJkaSBjYW52YXMgZGF0YSBkYXRhbGlzdCBkZXRhaWxzIGRpYWxvZyBmaWdjYXB0aW9uIGZpZ3VyZSBmb290ZXIgaGVhZGVyIGhncm91cCBtYWluIG1hcmsgbWV0ZXIgbmF2IG91dHB1dCBwcm9ncmVzcyBzZWN0aW9uIHN1bW1hcnkgdGVtcGxhdGUgdGltZSB2aWRlb1wiLHZlcnNpb246ZCxzaGl2Q1NTOmYuc2hpdkNTUyE9PSExLHN1cHBvcnRzVW5rbm93bkVsZW1lbnRzOmwsc2hpdk1ldGhvZHM6Zi5zaGl2TWV0aG9kcyE9PSExLHR5cGU6XCJkZWZhdWx0XCIsc2hpdkRvY3VtZW50OnMsY3JlYXRlRWxlbWVudDphLGNyZWF0ZURvY3VtZW50RnJhZ21lbnQ6aX07ZS5odG1sNT15LHModCl9KHRoaXMsdCkscC5fdmVyc2lvbj1tLHAuX3ByZWZpeGVzPVMscC5fZG9tUHJlZml4ZXM9VCxwLl9jc3NvbVByZWZpeGVzPWsscC5tcT16LHAuaGFzRXZlbnQ9QSxwLnRlc3RQcm9wPWZ1bmN0aW9uKGUpe3JldHVybiBjKFtlXSl9LHAudGVzdEFsbFByb3BzPXUscC50ZXN0U3R5bGVzPUYscC5wcmVmaXhlZD1mdW5jdGlvbihlLHQsbil7cmV0dXJuIHQ/dShlLHQsbik6dShlLFwicGZ4XCIpfSxnLmNsYXNzTmFtZT1nLmNsYXNzTmFtZS5yZXBsYWNlKC8oXnxcXHMpbm8tanMoXFxzfCQpLyxcIiQxJDJcIikrKGg/XCIganMgXCIrJC5qb2luKFwiIFwiKTpcIlwiKSxwfSh0aGlzLHRoaXMuZG9jdW1lbnQpOyIsImZ1bmN0aW9uIGNyZWF0ZU92ZXJsYXkoc2x1Zyl7XHJcblx0Ly9PVkVSTEFZIC0gU2hhZG93Ym94IHN0eWxlIHBvcHVwIGJveFxyXG5cdC8vQ1NTIGRlZmF1bHRzIHNldCBpbiBjb3JlL3Njc3MvcGFydGlhbHMvX3Jlc2V0LnNjc3NcclxuXHQvL0N1c3RvbWl6ZSBjc3MgZm9yIHNsdWdPdmVybGF5Q29udGVudCBpbiB5b3VyIHRoZW1lXHJcblxyXG5cdC8vQ3JlYXRlIGZ1bGwgc2NyZWVuIGJveCBmb3IgYmFja2dyb3VuZFxyXG5cdHZhciBvdmVybGF5Q29udGFpbmVyIFx0XHQ9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xyXG5cdG92ZXJsYXlDb250YWluZXIuaWQgXHRcdD0gc2x1ZyArXCJPdmVybGF5XCI7XHJcblx0b3ZlcmxheUNvbnRhaW5lci5jbGFzc05hbWUgXHQ9IFwib3ZlcmxheUNvbnRhaW5lclwiO1xyXG5cdGRvY3VtZW50LmJvZHkuYXBwZW5kQ2hpbGQob3ZlcmxheUNvbnRhaW5lcik7XHJcblxyXG5cdFx0Ly9DcmVhdGUgY29udGVudCBib3hcclxuXHRcdHZhciBvdmVybGF5Q29udGVudCBcdFx0XHQ9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xyXG5cdFx0b3ZlcmxheUNvbnRlbnQuaWQgXHRcdFx0PSBzbHVnICsnT3ZlcmxheUNvbnRlbnQnO1xyXG5cdFx0b3ZlcmxheUNvbnRlbnQuY2xhc3NOYW1lIFx0PSBcIm92ZXJsYXlDb250ZW50XCI7XHJcblxyXG5cdFx0ZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQob3ZlcmxheUNvbnRhaW5lci5pZCkuYXBwZW5kQ2hpbGQob3ZlcmxheUNvbnRlbnQpO1xyXG5cclxuXHRcdC8vQ3JlYXRlIGNsb3NlQnRuXHJcblx0XHR2YXIgY2xvc2VCdG4gXHRcdFx0XHQ9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xyXG5cdFx0Y2xvc2VCdG4uaWQgXHRcdFx0XHQ9IFwib3ZlcmxheUNsb3NlQnRuXCI7XHJcblx0XHRjbG9zZUJ0bi5jbGFzc05hbWUgXHRcdFx0PSBcImljb24tY2FuY2VsLWNpcmNsZVwiO1xyXG5cdFx0ZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQob3ZlcmxheUNvbnRhaW5lci5pZCkuYXBwZW5kQ2hpbGQoY2xvc2VCdG4pO1xyXG5cclxuXHRyZXR1cm4gXCJkaXYjXCIrb3ZlcmxheUNvbnRlbnQuaWQ7XHJcbn1cclxuXHJcbmZ1bmN0aW9uIGxvYWQod2hlcmUsIHdoYXQpe1xyXG5cdGNvbnNvbGUubG9nKFwiTG9hZGVkOiBcIiArIHdoZXJlICsgXCIgSU5UTyBcIiArIHdoYXQpO1xyXG5cdGpRdWVyeSggd2hlcmUgKS5sb2FkKCB3aGF0LCBmdW5jdGlvbigpIHtcclxuXHQgIGpRdWVyeSh3aW5kb3cpLnJlc2l6ZSgpO1xyXG5cdCAgd2luZG93LnNjcm9sbFRvKDAsMCk7XHJcblx0fSk7XHJcbn1cclxuXHJcblxyXG5qUXVlcnkoJy5vdmVybGF5JykuY2xpY2soZnVuY3Rpb24oKXtcclxuXHRqUXVlcnkoJy5vdmVybGF5Q29udGFpbmVyJykucmVtb3ZlKCk7XHJcblx0d2hhdCBcdD0galF1ZXJ5KHRoaXMpLmF0dHIoJ2hyZWYnKTtcclxuXHRzbHVnXHQ9IGpRdWVyeSh0aGlzKS5kYXRhKCdvdmVybGF5LXNsdWcnKTtcclxuICAgIHdoZXJlIFx0PSBjcmVhdGVPdmVybGF5KHNsdWcpO1xyXG5cclxuICAgIGxvYWQod2hlcmUsIHdoYXQpO1xyXG5cclxuICAgIHJldHVybiBmYWxzZTtcclxufSk7XHJcblxyXG5qUXVlcnkoYm9keSkub24oJ2NsaWNrJywgJyNvdmVybGF5Q2xvc2VCdG4nLCBmdW5jdGlvbigpIHtcclxuXHRqUXVlcnkoJ2Rpdi5vdmVybGF5Q29udGFpbmVyJykucmVtb3ZlKCk7XHJcblx0alF1ZXJ5KCdodG1sJykuY3NzKCdvdmVyZmxvdycsJ3Njcm9sbCcpO1xyXG59KTsiLCIvKkdvIFRvIFRvcCBGdW5jdGlvbiovXHJcbnZhciBnb1RvVG9wID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2J0bi10by10b3AnKTtcclxuXHJcbmdvVG9Ub3Aub25jbGljayA9IGZ1bmN0aW9uICgpIHtcclxuXHRzbW9vdGhTY3JvbGxUbygwLCA1MDApO1xyXG59O1xyXG5cclxud2luZG93LnNtb290aFNjcm9sbFRvID0gKGZ1bmN0aW9uICgpIHtcclxuICB2YXIgdGltZXIsIHN0YXJ0LCBmYWN0b3I7XHJcblxyXG4gIHJldHVybiBmdW5jdGlvbiAodGFyZ2V0LCBkdXJhdGlvbikge1xyXG4gICAgdmFyIG9mZnNldCA9IHdpbmRvdy5wYWdlWU9mZnNldCxcclxuICAgICAgICBkZWx0YSAgPSB0YXJnZXQgLSB3aW5kb3cucGFnZVlPZmZzZXQ7IC8qIFktb2Zmc2V0IGRpZmZlcmVuY2UqL1xyXG4gICAgZHVyYXRpb24gPSBkdXJhdGlvbiB8fCAxMDAwOyAgICAgICAgICAgICAgLyogZGVmYXVsdCAxIHNlYyBhbmltYXRpb24qL1xyXG4gICAgc3RhcnQgPSBEYXRlLm5vdygpOyAgICAgICAgICAgICAgICAgICAgICAvKiBnZXQgc3RhcnQgdGltZSovXHJcbiAgICBmYWN0b3IgPSAwO1xyXG5cclxuICAgIGlmKCB0aW1lciApIHtcclxuICAgICAgY2xlYXJJbnRlcnZhbCh0aW1lcik7IC8vIHN0b3AgYW55IHJ1bm5pbmcgYW5pbWF0aW9uc1xyXG4gICB9XHJcblxyXG4gICAgZnVuY3Rpb24gc3RlcCgpIHtcclxuICAgICAgdmFyIHk7XHJcbiAgICAgIGZhY3RvciA9IChEYXRlLm5vdygpIC0gc3RhcnQpIC8gZHVyYXRpb247IC8vIGdldCBpbnRlcnBvbGF0aW9uIGZhY3RvclxyXG4gICAgICBpZiggZmFjdG9yID49IDEgKSB7XHJcbiAgICAgICAgY2xlYXJJbnRlcnZhbCh0aW1lcik7IC8vIHN0b3AgYW5pbWF0aW9uXHJcbiAgICAgICAgZmFjdG9yID0gMTsgICAgICAgICAgIC8vIGNsaXAgdG8gbWF4IDEuMFxyXG4gICAgIH1cclxuICAgICAgeSA9IGZhY3RvciAqIGRlbHRhICsgb2Zmc2V0O1xyXG4gICAgICB3aW5kb3cuc2Nyb2xsQnkoMCwgeSAtIHdpbmRvdy5wYWdlWU9mZnNldCk7XHJcbiAgIH1cclxuXHJcbiAgICB0aW1lciA9IHNldEludGVydmFsKHN0ZXAsIDIwKTtcclxuICAgIHJldHVybiB0aW1lcjtcclxuIH07XHJcbn0oKSk7IiwialF1ZXJ5KCdib2R5JykuYXBwZW5kKFwiPGRpdiBpZD0nd2luZG93U2l6ZSc+PC9kaXY+XCIpO1xyXG5qUXVlcnkoJyN3aW5kb3dTaXplJykuY2xpY2soZnVuY3Rpb24oKSB7XHJcbiAgICBqUXVlcnkoJyN3aW5kb3dTaXplJykuZmFkZU91dCgnbWVkaXVtJyk7XHJcbn0pO1xyXG5cclxuZnVuY3Rpb24gaW5pdFRlc3RQYW5lbCgpIHtcclxuXHJcbiAgICBqUXVlcnkoJyN3aW5kb3dTaXplJykuZW1wdHkoKTtcclxuXHJcbiAgICBqUXVlcnkoJyN3aW5kb3dTaXplJykuYXBwZW5kKFwiPGRpdj5cIiAgICAgICAgXHRcdCsgYXNwVGV4dCAgICAgICAgICAgKyBcIjwvZGl2PlwiKTtcclxuICAgIGpRdWVyeSgnI3dpbmRvd1NpemUnKS5hcHBlbmQoXCI8ZGl2PlwiICAgICAgIFx0XHQgXHQrIGJyZWFrUG9pbnQgICAgICAgICsgXCI8L2Rpdj5cIik7XHJcbiAgICBqUXVlcnkoJyN3aW5kb3dTaXplJykuYXBwZW5kKFwiPGRpdj5XOiBcIiAgICAgXHRcdCsgdmlld1dpZHRoICAgICAgICAgKyBcInB4IC0gXCIgKyB2aWV3V2lkdGgvYmFzZUZvbnRTaXplICsgXCJlbTwvZGl2PlwiKTtcclxuICAgIGpRdWVyeSgnI3dpbmRvd1NpemUnKS5hcHBlbmQoXCI8ZGl2Pkg6IFwiICAgICBcdFx0KyB2aWV3SGVpZ2h0ICAgICAgICArIFwicHg8L2Rpdj5cIik7XHJcbiAgICBqUXVlcnkoJyN3aW5kb3dTaXplJykuYXBwZW5kKFwiPGRpdj5EZXZpY2U6XCIgICAgICAgIFx0KyBkZXZpY2VUeXBlICAgICAgICArIFwiPC9kaXY+XCIpO1xyXG5cclxuICAgIGlmICggalF1ZXJ5KCdodG1sJykuZGF0YSgncGFnZScpID09ICdwcm9qZWN0cycpe1xyXG4gICAgICAgIC8vVGVtcCBTbGlkZXIgVGVzdGluZ1xyXG4gICAgXHQvL3ZhciBzbGlkZUhlaWdodCAgICA9IGpRdWVyeShcIiNob21lR2FsbGVyeVwiKS5oZWlnaHQoKTtcclxuICAgIFx0Ly92YXIgc2xpZGVNYXhIZWlnaHQgPSBqUXVlcnkoXCIjaG9tZUdhbGxlcnlcIikuY3NzKCdtYXgtaGVpZ2h0Jyk7XHJcbiAgICBcdC8vdmFyIHNsaWRlTWluSGVpZ2h0ID0galF1ZXJ5KFwiI2hvbWVHYWxsZXJ5XCIpLmNzcygnbWluLWhlaWdodCcpO1xyXG5cclxuICAgICAgICAvL2pRdWVyeSgnI3dpbmRvd1NpemUnKS5hcHBlbmQoXCI8ZGl2PlNsaWRlSDogXCIgIFx0XHQrIHNsaWRlSGVpZ2h0ICAgICAgICsgXCJweDwvZGl2PlwiKTtcclxuICAgICAgICAvL2pRdWVyeSgnI3dpbmRvd1NpemUnKS5hcHBlbmQoXCI8ZGl2PlNsaWRlTWF4SDogXCIgIFx0KyBzbGlkZU1heEhlaWdodCAgICArIFwiPC9kaXY+XCIpO1xyXG4gICAgICAgIC8valF1ZXJ5KCcjd2luZG93U2l6ZScpLmFwcGVuZChcIjxkaXY+U2xpZGVNaW5IOiBcIiAgXHQrIHNsaWRlTWluSGVpZ2h0ICAgICsgXCI8L2Rpdj5cIik7XHJcbiAgICB9XHJcbn1cclxuXHJcblxyXG4iXSwic291cmNlUm9vdCI6Ii9zb3VyY2UvIn0=
