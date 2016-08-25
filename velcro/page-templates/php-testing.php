<?php //Template Name: Test Php ?>
<?php get_template_part( 'inc/checkRegisteredImageSizes', 'inc' ); ?>

<pre>
	<?php var_dump( get_image_sizes() );?>
</pre>