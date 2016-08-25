<?php

/**
 * Attach a class to linked images' parent anchors
 * Works for existing content
 */
function give_linked_images_class($content) {

  $classes = 'overlay'; // separate classes by spaces - 'img image-link'
  // check if there are already a class property assigned to the anchor
  if ( preg_match('/<a.*? class=".*?"><img/', $content) ) {
    // If there is, simply add the class
    $content = preg_replace('/(<a.*? class=".*?)(".*?><img)/', '$1 ' . $classes . '$2', $content);
  } else {
    // If there is not an existing class, create a class property
    $content = preg_replace('/(<a.*?)><img/', '$1 class="' . $classes . '" ><img', $content);
  }
  return $content;
}

add_filter('the_content','give_linked_images_class');

?>