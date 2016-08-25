<?php

function childStyles() {
	wp_enqueue_style( 'childStyle', get_stylesheet_directory_uri() . '/style.css' );
}

function childScripts() {
	wp_enqueue_script( 'project', get_stylesheet_directory_uri().'/project.js', array('jquery'), '1.0.0', true );

    wp_enqueue_script(
		'angularjs',
		get_stylesheet_directory_uri() . '/angular-js/angular.min.js'
	);

    wp_enqueue_script(
		'angularjs-route',
		get_stylesheet_directory_uri() . '/angular-js/angular-route.min.js',
        array('angularjs')
	);

    wp_register_script(
		'angularjs-sanitize',
		get_stylesheet_directory_uri() . '/angular-js/angular-sanitize.min.js'
	);

    wp_enqueue_script(
		'portfolioApp',
		get_stylesheet_directory_uri() . '/angular-portfolio/portfolio.component.js',
		array( 'angularjs', 'angularjs-route', 'angularjs-sanitize' )
	);

    wp_localize_script(
        'portfolioApp',
        'angularLocal',
		array(
			'portfolioApp' => trailingslashit( get_stylesheet_directory_uri() ) . 'angular-portfolio/'
		)
	);
}

add_action( 'wp_enqueue_scripts', 'childScripts', 99);
add_action( 'wp_enqueue_scripts', 'childStyles' , 98);



add_filter( 'rest_prepare_the_event', 'add_meta_to_json', 10, 3 );
function add_meta_to_json($data, $post, $request){

$response_data = $data->get_data();

if ( $request['context'] !== 'view' || is_wp_error( $data ) ) {
    return $data;
}

$projectImages 	= get_post_meta($post->ID, 'vdw_gallery_id', true);
$featuredImage	= wp_get_attachment_image_url($projectImages[0], 'large');
$address 		= get_post_meta($post->ID, 'Address', true);

if($post->post_type == 'Projects'){
    $response_data['prject_meta'] = array(
        'thumbnail' => $featuredImage,
        'address' => $address,
    );
}

$data->set_data( $response_data );

return $data;
}


?>