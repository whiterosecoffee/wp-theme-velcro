<?php 

if( !is_admin()){
	//Remove unwanted WordPress defaults
	remove_action('wp_head', 'wp_generator');
	remove_action('wp_head', 'start_post_rel_link');
	remove_action('wp_head', 'adjacent_posts_rel_link_wp_head');
	remove_action('wp_head', 'wlwmanifest_link');
	remove_action('wp_head', 'rsd_link');
	remove_action('wp_head', 'wp_shortlink_wp_head');
	remove_action('wp_head', 'index_rel_link');
	remove_action('wp_head', 'feed_links_extra', 3 );
	remove_action('wp_head', 'feed_links', 2 );
	remove_action( 'wp_head', 'print_emoji_detection_script', 7 );
	remove_action( 'wp_print_styles', 'print_emoji_styles' );	
	add_filter('show_admin_bar', '__return_false');
}

?>