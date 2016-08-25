<?php

namespace cptPress;

require_once( $root . '/lib/taxonomy.php' );

class ArticleStatusModel extends Taxonomy {
  function __construct() {
    $this->name = 'article-status';
  }

  function registerTaxonomy() {
    register_taxonomy( 'article-status', $this->model_names, array(
      'hierarchical'      => true,
      'public'            => true,
      'show_in_nav_menus' => true,
      'show_ui'           => true,
      'show_admin_column' => true,
/*      'show_admin_column' => false,
*/      'query_var'         => true,
      'capabilities'      => array(
        'manage_terms'  => 'edit_posts',
        'edit_terms'    => 'edit_posts',
        'delete_terms'  => 'edit_posts',
        'assign_terms'  => 'edit_posts'
      ),
      'labels'            => array(
        'name'                       => __( 'Article statuses', 'cpt-articles' ),
        'singular_name'              => _x( 'Article status', 'taxonomy general name', 'cpt-articles' ),
        'search_items'               => __( 'Search article statuses', 'cpt-articles' ),
        'popular_items'              => __( 'Popular article statuses', 'cpt-articles' ),
        'all_items'                  => __( 'All article statuses', 'cpt-articles' ),
        'parent_item'                => __( 'Parent article status', 'cpt-articles' ),
        'parent_item_colon'          => __( 'Parent article status:', 'cpt-articles' ),
        'edit_item'                  => __( 'Edit article status', 'cpt-articles' ),
        'update_item'                => __( 'Update article status', 'cpt-articles' ),
        'add_new_item'               => __( 'New article status', 'cpt-articles' ),
        'new_item_name'              => __( 'New article status', 'cpt-articles' ),
        'separate_items_with_commas' => __( 'Article statuses separated by comma', 'cpt-articles' ),
        'add_or_remove_items'        => __( 'Add or remove article statuses', 'cpt-articles' ),
        'choose_from_most_used'      => __( 'Choose from the most used article statuses', 'cpt-articles' ),
        'menu_name'                  => __( 'Article statuses', 'cpt-articles' ),
      ),
    ));
  }
}
