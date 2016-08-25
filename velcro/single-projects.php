<!-- Single Projects Template -->

<?php include_once(get_template_directory().'/plugins/galleryMetabox/jsonReturnGallery.php'); //RETURNS allSizes image array for $post-ID?>
<script>

	 jQuery(document).ready(function() {

		//#projectsGallery Image Slider
		var slidesParent 		= '#projectsGallery';
		var slidesContainer 	= '#slidesContainer';
		var slidesContent 		= getImagesByScreenSize(allSizes);
		var thumbsContainer 	= '#thumbsContainer';
		var thumbsContent 		= allSizes[4];

		createDragendSlides( slidesParent, slidesContent, "images", "thumbnails");
		updateDragendSlider( slidesParent, viewHeight, "thumbnails");
		jQuery(slidesContainer).dragend({});

		jQuery(window).resize(_.debounce(function(){
			updateDragendSlider( slidesParent, viewHeight, true );
			//setThumbsPerPage();
		}, 50));

		doRecursively( function(){ autoPlaySlides(slidesContainer) }, 4000, 40000);
		var nextLinkHref= jQuery("#content a[rel='next']").attr('href');
		var prevLinkHref= jQuery("#content a[rel='prev']").attr('href');

		var nextTag = jQuery("<a>");
		    nextTag.attr("href", nextLinkHref);
		    nextTag.data("overlay-slug","projects");
		    nextTag.text("Next Project");
		    nextTag.addClass("overlay projectControl nextProject");
		    nextTag.prependTo( jQuery("#projectsOverlayContent #content") );

		var prevTag = jQuery("<a>");
		    prevTag.attr("href", prevLinkHref);
		    prevTag.data("overlay-slug","projects");
		    prevTag.text("Prev Project");
		    prevTag.addClass("overlay projectControl prevProject");
		   	prevTag.prependTo( jQuery("#projectsOverlayContent #content") );

		});


</script>


<div id="projectsGallery" class="dragend-container">
		<!-- slides created dynamically -->
</div>

<div id="projectsContent" class="contentWidth floatfix">

    <!-- Use WP function to output hrefs && replace with custom overlay links -->
    <div class="hideWordPressOutput" style="display:none">
    	<?php next_post_link('%link'); ?>
    	<?php previous_post_link('%link'); ?>
    </div>

	<h2>Project Details</h2>
	<?php
        $page = $post->ID;
        $page_articleDate = get_page($page);
        $content = apply_filters('the_content', $page_articleDate->post_content);
        echo $content;
    ?>
      <a href="#" id="btn-to-top" class="scrollToTop icon-circle-up"></a>

</div>

<!-- remove second scroll bar if overlay is tall -->
<style> html{overflow:hidden!important;} </style>
