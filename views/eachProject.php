<?php

$projectImages 	= get_post_meta($post->ID, 'vdw_gallery_id', true);
$featuredImage	= wp_get_attachment_image_url($projectImages[0], 'large');
$address 		= get_post_meta($post->ID, 'Address', true);

?>

<article class="project dragend-page layout-1-2-3-4 iso-grid-item">

	<a href="<?php the_permalink(); ?>" class="projectLink overlay" data-overlay-slug="projects">

		<div class="projectImg" style="background-image: url(' <?php echo ($featuredImage);?> ');" /></div>
		<p class="projectTitle"><?php the_title();?></p>

	</a>

</article>