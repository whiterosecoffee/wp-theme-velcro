<?php

function applyTerm( $postId, $termName, $taxonomySlug ) {
  // Create a term if neccessary, and apply it to a post.

  $term = get_term_by( 'name', $termName, $taxonomySlug );

  if( $term ) {
    $termId = $term->term_id;
  } else {
    $result = wp_insert_term( $termName, $taxonomySlug );
    $termId = $result[ 'term_id' ];
  }

  wp_set_object_terms( $postId, $termId, $taxonomySlug, true );
}
