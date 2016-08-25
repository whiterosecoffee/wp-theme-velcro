<?php //Template Name: Projects CPT ?>

<?php get_header(); ?>

<?php include_once(get_stylesheet_directory().'/views/pageTitle.php'); ?>
<div id="content" class="fullWidth floatfix" >

	<section id="projectsCpt" class="iso-grid dragend-container floatfix" >

		<?php $projects = query_posts( '&post_type=Projects&order=ASC');?>
		<?php while ( have_posts() ) : the_post(); ?>

			<?php include(get_template_directory().'/views/eachProject.php'); ?>

	  	<?php endwhile;?>

	</section>

</div><!--CONTENT-->



<?php get_footer(); ?>
<!-- Core CPT Projects Template -->
