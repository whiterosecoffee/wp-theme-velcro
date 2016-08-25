<?php //Template Name: Home Page - Gallery ?>
<?php get_header(); ?>

<?php //Load Gallery Plugin.  Init JS in project.js ?>
<?php include_once(get_template_directory().'/plugins/galleryMetabox/jsonReturnGallery.php'); ?>

<div id="homeGallery" class="galleryContainer dragend-container">
	<!-- slides created dynamically -->
</div>

<?php //include_once(get_template_directory().'/modals/scrollMenu.php'); ?>

<?php include_once(get_stylesheet_directory().'/views/pageTitle.php'); ?>
<!--
<div class="separator small w50"></div>

<p class="about-us-description">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nam nunc dolor, vestibulum nec nunc a, cursus blandit libero. Donec pellentesque at tellus sit amet tincidunt. Tolor sit amet, consectetur adipiscing elit. olor sit amet, consectetur adipiscing elit. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nam nunc dolor, vestibulum nec nunc a, cursus blandit libero. Donec pellentesque at tellus sit amet tincidunt. Tolor sit amet, consectetur adipiscing elit. </p>

<div class="separator large"></div>

<?php //include_once(get_stylesheet_directory().'/section-templates/services-content.php'); ?>

<div class="separator large"></div>

<div id="homeTestimonials">
	<h2>Testomonial { </h2>
	<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nam nunc dolor, vestibulum nec nunc a, cursus blandit libero. Donec pellentesque at tellus sit amet tincidunt. Tolor sit amet, consectetur adipiscing elit. olor sit amet, consectetur adipiscing elit.  <cite>Bob Parsley, Betaworks</cite></p>
</div>

<div class="separator large"></div>
-->
<?php get_footer(); ?>
<!-- Core Single Projects Template -->
