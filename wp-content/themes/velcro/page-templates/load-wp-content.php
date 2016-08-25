<?php //Template Name: Load WP Content ?>
<!-- Wordpress Content Template -->

<?php get_header(); ?>
	<div id="content" class="content contentPadding floatfix">
		<h2 class="pageTitle"><?php echo (the_parent_slug()); ?></h2>
		<div class="wpContent">
			<?php			
		        $page = $post->ID;
		        $page_articleDate = get_page($page);
		        $content = apply_filters('the_content', $page_articleDate->post_content);
		        echo $content; 
		    ?>
	    </div>
	</div>
<?php get_footer(); ?>
<!-- Core WP Content Template -->
