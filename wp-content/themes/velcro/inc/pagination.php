<?php // PAGINATION

function paginate() {
	global $wp_query, $wp_rewrite;
	$wp_query->query_vars['paged'] > 1 ? $current = $wp_query->query_vars['paged'] : $current = 1;
	$pagination = array(
		'base' => @add_query_arg('page','%#%'),
		'format' => '',
		'total' => $wp_query->max_num_pages,
		'current' => $current,
		'show_all' => true,
		'type' => 'plain'
	);
	if( $wp_rewrite->using_permalinks() ) $pagination['base'] = user_trailingslashit( trailingslashit( remove_query_arg( 's', get_pagenum_link( 1 ) ) ) . 'page/%#%/', 'paged' );
	if( !empty($wp_query->query_vars['s']) ) $pagination['add_args'] = array( 's' => get_query_var( 's' ) );
	echo paginate_links( $pagination );
}


// CUSTOM POST TYPES

function justins_custom_post_types() {
	
	// Testimonial
	$labels_portfolio = array(
		'add_new' => __('Add New', 'testimonial'),
		'add_new_item' => __('Add New Testimonial Post'),
		'edit_item' => __('Edit Testimonial Post'),
		'menu_name' => __('Testimonials'),
		'name' => __('Testimonial', 'post type general name'),
		'new_item' => __('New Testimonial Post'),
		'not_found' =>  __('No testimonial posts found'),
		'not_found_in_trash' => __('No testimonial posts found in Trash'), 
		'parent_item_colon' => '',
		'singular_name' => __('Testimonial Post', 'post type singular name'),
		'search_items' => __('Search Testimonial Posts'),
		'view_item' => __('View Testimonial Post'),
	);
	$args_portfolio = array(
		'capability_type' => 'post',
		'has_archive' => true, 
		'hierarchical' => false,
		'labels' => $labels_portfolio,
		'menu_position' => 4,
		'public' => true,
		'publicly_queryable' => true,
		'query_var' => true,
		'rewrite' => array( 'slug' => 'testimonial', 'with_front' => true ),
		'show_in_menu' => true, 
		'show_ui' => true, 
		'supports' => array( 'comments', 'editor', 'excerpt', 'thumbnail', 'title' ),
	);
	register_post_type( 'testimonial', $args_portfolio );
	
	
}

add_action( 'init', 'justins_custom_post_types' );


// CUSTOM TAXONOMIES

function justins_custom_taxonomies() {


	// Testimonial Categories	
	
	$labels = array(
		'add_new_item' => __( 'Add New Category' ),
		'all_items' => __( 'All Categories' ),
		'edit_item' => __( 'Edit Category' ), 
		'name' => __( 'Testimonial Categories', 'taxonomy general name' ),
		'new_item_name' => __( 'New Genre Category' ),
		'menu_name' => __( 'Categories' ),
		'parent_item' => __( 'Parent Category' ),
		'parent_item_colon' => __( 'Parent Category:' ),
		'singular_name' => __( 'Testimonial Category', 'taxonomy singular name' ),
		'search_items' =>  __( 'Search Categories' ),
		'update_item' => __( 'Update Category' ),
	);
	register_taxonomy( 'testimonial-category', array( 'testimonial' ), array(
		'hierarchical' => true,
		'labels' => $labels,
		'query_var' => true,
		'rewrite' => array( 'slug' => 'testimonial/category' ),
		'show_ui' => true,
	));
	
	
	// Testimonial Tags	
	
	$labels = array(
		'add_new_item' => __( 'Add New Tag' ),
		'all_items' => __( 'All Tags' ),
		'edit_item' => __( 'Edit Tag' ), 
		'menu_name' => __( 'Testimonial Tags' ),
		'name' => __( 'Testimonial Tags', 'taxonomy general name' ),
		'new_item_name' => __( 'New Genre Tag' ),
		'parent_item' => __( 'Parent Tag' ),
		'parent_item_colon' => __( 'Parent Tag:' ),
		'singular_name' => __( 'Testimonial Tag', 'taxonomy singular name' ),
		'search_items' =>  __( 'Search Tags' ),
		'update_item' => __( 'Update Tag' ),
	);
	register_taxonomy( 'testimonial-tags', array( 'testimonial' ), array(
		'hierarchical' => false,
		'labels' => $labels,
		'query_var' => true,
		'rewrite' => array( 'slug' => 'testimonial/tag' ),
		'show_ui' => true,
	));
	
		
}

add_action( 'init', 'justins_custom_taxonomies', 0 );


// CUSTOM POSTS PER PAGE

// posts per page based on CPT
function custom_posts_per_page($query)
{
    switch ( $query->query_vars['post_type'] )
    {
        case 'testimonial':  // Post Type named 'iti_cpt_1'
            $query->query_vars['posts_per_page'] = 3;
            break;

        default:
            break;
    }
    return $query;
}

if( !is_admin() )
{
    add_filter( 'pre_get_posts', 'custom_posts_per_page' );
}


?>