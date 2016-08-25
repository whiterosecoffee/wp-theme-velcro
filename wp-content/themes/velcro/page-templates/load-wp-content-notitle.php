<?php //Template Name: Load WP Conent - No Page Title ?>
<!-- Wordpress Content - No Title Template -->

<?php get_header(); ?>
	<div id="content" class="content contentPadding floatfix">
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
<!-- Core WP Content - No Title Template -->
