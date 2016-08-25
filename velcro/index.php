<?php get_header(); ?>
	<div id="content" class="content contentPadding floatfix">
		
		<h2 class="pageTitle"><?php echo (the_parent_slug()); ?></h2>
		<?php			
	        $page = $post->ID;
	        $page_articleDate = get_page($page);
	        $content = apply_filters('the_content', $page_articleDate->post_content);
	        echo $content; 
	    ?>
	    <? get_template_part("/section-templates/".the_parent_slug()."-content"); ?>

	
	</div>
<?php get_footer(); ?>
<!-- Core Index Template -->
