<?php
global $wpdb;			//$wpdb is a class of functions for easy database manipulations
						//$wpdb->get_results( "query" );
						//$wpdb->query('query'); etc.

//STYLES & SCRIPTS
function parent_styles() {
	//SCSS included by child theme for unified compile.
}
	add_action( 'wp_enqueue_scripts', 'parent_styles', 1);

function parent_scripts() {
	wp_deregister_script('jquery');
    wp_register_script('jquery', 'http://ajax.googleapis.com/ajax/libs/jquery/1.9.1/jquery.min.js', true, '1.9.1');
}
	add_action( 'wp_enqueue_scripts', 'parent_scripts', 0 );

//PLUGINS
include_once(get_template_directory().'/plugins/customPostTypes/customPostTypes.php');
include_once(get_template_directory().'/plugins/galleryMetabox/galleryMetabox.php');
include_once(get_template_directory().'/inc/mobile-detect.php'); //http://mobiledetect.net/


//CORE THEME CUSTOMIZATION.
include_once(get_template_directory().'/inc/coreFunctions.php');
include_once(get_template_directory().'/inc/cleanWpHead.php');
include_once(get_template_directory().'/inc/excerpt.php');


//IMAGE SIZES
add_image_size( 'coreLarge', '1920', '1920', false );


//MENUS
add_theme_support('main'); //initiates the menu section under the appearances panel in dashboard
register_nav_menu('main','Main Site Navigation');
register_nav_menu('scroll','Scroll Navigation');


//THUMNAILS
if ( function_exists( 'add_theme_support' ) ) {
	add_theme_support( 'post-thumbnails' );
        set_post_thumbnail_size( 50, 50 ); // default Post Thumbnail dimensions
}

add_filter( 'auto_update_plugin', '__return_true' );

?>