<?php

function childStyles() {
	wp_enqueue_style( 'childStyle', get_stylesheet_directory_uri() . '/style.css' );
}

function childScripts() {
	wp_enqueue_script( 'project', get_stylesheet_directory_uri().'/js/project.js', array('jquery'), '1.0.0', true );

}

add_action( 'wp_enqueue_scripts', 'childScripts', 99);
add_action( 'wp_enqueue_scripts', 'childStyles' , 98);




?>