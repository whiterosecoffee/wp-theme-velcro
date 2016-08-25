<?php

//DEVICE DETECTION
global $deviceType;
global $detect;

// Include and instantiate the class.
$detect = new Mobile_Detect;
if 		( $detect->isMobile() ) { $deviceType = "mobile";  }
else if ( $detect->isTablet() )	{ $deviceType = "tablet";  }
else 							{ $deviceType = "desktop"; }

//PARENT SLUG - A  custom variable applied to the content to create a custom class for each page <div id="content" class="the_parent_slug();">
function the_parent_slug() {
	global $post;

	if (
		$post->post_parent == 0) {
		return $post->post_name;
	}
	else {
		$post_data = get_post($post->post_parent);
		return $post_data->post_name;
	}
}




?>