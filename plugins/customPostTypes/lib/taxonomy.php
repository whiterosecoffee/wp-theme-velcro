<?php

namespace core; 

class Taxonomy {
  static $default_args;
  static $default_labels;

// When registering a taxonomy, default args and labels can be overridden. In labels, %1$s and %2$s will be overridden with the taxonomy name, or it's plural name, respectively.
  function __construct( $model, $slug, $name, $plural_name, $args = array(), $labels = array() ) {
    $this->model = $model;
    $this->slug = $slug;
    $this->name = $name;
    $this->plural_name = $plural_name;
    $this->args = $args;
    $this->labels = $labels;
  }

  function init() {
    $registerTaxonomy = $this->createTaxonomyRegisterer( $this->args, $this->labels );
    add_action( 'init', $registerTaxonomy );
  }

  // Returns a registerTaxonomy function to be passed to the init hook. Default arguments may be overridden.
  private function createTaxonomyRegisterer( $args = array(), $labels = array() ) {
    $args = array_merge( $args, static::$default_args );
    $labels = array_merge( $labels, static::$default_labels );

    $labels = static::interpolateLabels( $labels, $this->name, $this->plural_name );
    $args = array_merge( $args, array( 'labels' => $labels ));

	$that = $this;
    return function() use ( &$args, $that ) {
      register_taxonomy( $that->slug, $that->model->name, $args );
    };
  }

  private static function interpolateLabels( $labels, $name, $plural_name ) {
    $interpolateLabel = function( $label ) use ( &$name, &$plural_name ) {
      return ucfirst( sprintf( $label, $name, $plural_name ));
    };

    return array_map( $interpolateLabel, $labels );
  }
}

Taxonomy::$default_labels = array(
  'name' => __( '%2$s', 'cpt-articles' ),
  'singular_name' => _x( '%1$s', 'taxonomy general name', 'cpt-articles' ),
  'search_items' => __( 'Search %2$s', 'cpt-articles' ),
  'popular_items' => __( 'Popular %2$s', 'cpt-articles' ),
  'all_items' => __( 'All %2$s', 'cpt-articles' ),
  'parent_item' => __( 'Parent %1$s', 'cpt-articles' ),
  'parent_item_colon' => __( 'Parent %1$s:', 'cpt-articles' ),
  'edit_item' => __( 'Edit %1$s', 'cpt-articles' ),
  'update_item' => __( 'Update %1$s', 'cpt-articles' ),
  'add_new_item' => __( 'New %1$s', 'cpt-articles' ),
  'new_item_name' => __( 'New %1$s', 'cpt-articles' ),
  'separate_items_with_commas' => __( '%2$s separated by comma', 'cpt-articles' ),
  'add_or_remove_items' => __( 'Add or remove %2$s', 'cpt-articles' ),
  'choose_from_most_used' => __( 'Choose from the most used %2$s', 'cpt-articles' ),
  'menu_name' => __( '%2$s', 'cpt-articles' )
);

Taxonomy::$default_args = array(
  'hierarchical' => false,
  'public' => true,
  'show_in_nav_menus' => true,
  'show_ui' => true,
  'show_admin_column' => false,
  'query_var' => true,
  'rewrite' => false,
  'capabilities' => array(
    'manage_terms' => 'edit_posts',
    'edit_terms' => 'edit_posts',
    'delete_terms' => 'edit_posts',
    'assign_terms' => 'edit_posts'
  )
);
