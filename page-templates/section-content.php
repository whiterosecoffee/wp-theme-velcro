<?php //Template Name: Load Section Content ?>
<!-- Section Content Template -->

<?php get_header(); ?>
	<div id="content" class="content contentPadding floatfix">	
    	
    	<? get_template_part("/section-templates/".the_parent_slug()."-content"); ?>
    	
    </div>
<?php get_footer(); ?>
<!-- Core Section Content Template -->
