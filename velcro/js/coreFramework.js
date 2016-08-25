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
