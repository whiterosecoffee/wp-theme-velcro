<?php //Template Name: Content Page
get_header(); 

	$page = $post->ID;
	$page_date = get_page($page);
	$content = apply_filters('the_content', $page_date->post_content);
	echo $content;

get_footer(); ?>