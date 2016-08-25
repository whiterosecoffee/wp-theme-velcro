<?php 

//EXCERPT
function custom_excerpt_length( $length ) {
	return 35;
}	
	add_filter( 'excerpt_length', 'custom_excerpt_length', 99 );


function new_excerpt_more( $more ) {
	return ' <a class="read-more overlay" href="'. get_permalink( get_the_ID() ) . '">...</a>';
}	
	add_filter( 'excerpt_more', 'new_excerpt_more' );


function add_excerpt_class( $excerpt ){
    $excerpt = str_replace( "<p", "<p class=\"excerpt floatfix\"", $excerpt );
    return $excerpt;
}
	add_filter('the_excerpt','add_excerpt_class');


//* Remove the edit link
add_filter ( 'edit_post_link' , '__return_false' );

?>