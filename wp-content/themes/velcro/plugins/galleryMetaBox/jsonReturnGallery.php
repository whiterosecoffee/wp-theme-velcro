<?php 
// USAGE EXAMPLE - core/single-projects.php
// include_once(get_template_directory().'/plugins/galleryMetabox/jsonReturnGallery.php');
// JS Example
/* 	jQuery(document).ready(function(jQuery) {
		jQuery(window).on("resize", function() {
			initDragendSlider(
				'#projectsGallery', 				//This Gallery Container
				getImagesByScreenSize(640, 1024), 	//Checks current screen size and returns array by breakpoints
				viewHeight, 						//Parent slider height
				"thumbnails" 						//Thumbnails or buttons if desired
			);
		});
	});

###Change - maxSizeByAsp(target, 1.5, 2.2);

*/

	$images = get_post_meta($post->ID, 'vdw_gallery_id', true);
	
	$thumbs = array(); 
	$small = array(); 
	$medium = array(); 
	$large = array(); 
	
	foreach ($images as $image) {
		$attachment_meta = wp_get_attachment_metadata( $image );
		$imageHeight = $attachment_meta['height'];
		$imageWidth = $attachment_meta['width'];

		array_push($thumbs, [wp_get_attachment_image_url($image, 'thumbnail'),  $imageHeight, $imageWidth]);
		array_push($small, 	[wp_get_attachment_image_url($image, 'medium'),  $imageHeight, $imageWidth]);
		array_push($medium, [wp_get_attachment_image_url($image, 'large'),  $imageHeight, $imageWidth]);
		array_push($large, 	[wp_get_attachment_image_url($image, 'coreLarge'),  $imageHeight, $imageWidth]);
	}
	
	$allSizes = array();
	$allSizes[0] = $thumbs;
	$allSizes[1] = $small;
	$allSizes[2] = $medium;
	$allSizes[3] = $large;


?>
<script>
	var allSizes = <?php echo json_encode($allSizes);?> ;	
</script>