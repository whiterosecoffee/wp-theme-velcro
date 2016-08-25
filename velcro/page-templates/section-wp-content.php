<?php //Template Name: Section & WP Content ?>

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
	    <div class="sectionContent">
	    	<?php get_template_part("/section-templates/".the_parent_slug()."-content"); ?>
	    </div>
	    
	</div>
<?php get_footer(); ?>
<!-- Core Section & WP Template -->
