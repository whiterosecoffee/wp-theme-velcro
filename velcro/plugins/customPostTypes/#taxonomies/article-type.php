<?php

require_once( $root . '/lib/taxonomy.php' );

class ArticleTypeModel extends Taxonomy {
  function __construct() {
    $this->name = 'article-type';
  }

  function registerTaxonomy() {
    register_taxonomy( $this->name, $this->model_names, array(
      'hierarchical'      => false,
      'public'            => true,
      'show_in_nav_menus' => true,
      'show_ui'           => true,
      'show_admin_column' => true,
      'query_var'         => true,
      'rewrite'           => false,
      'capabilities'      => array(
        'manage_terms'  => 'edit_posts',
        'edit_terms'    => 'edit_posts',
        'delete_terms'  => 'edit_posts',
        'assign_terms'  => 'edit_posts'
      ),
      'labels'            => array(
        'name'                       => __( 'Article types', 'cpt-articles' ),
        'singular_name'              => _x( 'Article type', 'taxonomy general name', 'cpt-articles' ),
        'search_items'               => __( 'Search article types', 'cpt-articles' ),
        'popular_items'              => __( 'Popular article types', 'cpt-articles' ),
        'all_items'                  => __( 'All article types', 'cpt-articles' ),
        'parent_item'                => __( 'Parent article type', 'cpt-articles' ),
        'parent_item_colon'          => __( 'Parent article type:', 'cpt-articles' ),
        'edit_item'                  => __( 'Edit article type', 'cpt-articles' ),
        'update_item'                => __( 'Update article type', 'cpt-articles' ),
        'add_new_item'               => __( 'New article type', 'cpt-articles' ),
        'new_item_name'              => __( 'New article type', 'cpt-articles' ),
        'separate_items_with_commas' => __( 'Article types separated by comma', 'cpt-articles' ),
        'add_or_remove_items'        => __( 'Add or remove article types', 'cpt-articles' ),
        'choose_from_most_used'      => __( 'Choose from the most used article types', 'cpt-articles' ),
        'menu_name'                  => __( 'Article types', 'cpt-articles' ),
      ),
    ));
  }
}
