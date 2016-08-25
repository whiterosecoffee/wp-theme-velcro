<?php //Template Name: Full Screen Image + Overlay Content?>

<?php get_header(); ?>
	
<?php include_once(get_stylesheet_directory().'/views/pageTitle.php'); ?>

<div id="overlayContent" class="clearfix">

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

<style>


@media (min-width:640px){
	.landscape #pageTitle{display: none;}
	.landscape #wrapper{background: url('<?php the_post_thumbnail_url( 'full' ) ?>') center center no-repeat; background-size: cover;}
	#overlayContent{margin-top:8%;}
}

@media only screen and (max-width:640px) {
	#pageTitle h4{margin-bottom: 1.25rem;}
	div#overlayContent{padding:0rem 2rem}
		div#overlayContent h2{margin-bottom: 0;}
		div#overlayContent p{font-size:.85rem;}

}

@media only screen and (min-width : 640px) {
	div#overlayContent{padding:1.5rem 3rem; line-height: 1.5; background-color:rgba(255,255,255,.75);}
}

@media only screen and (min-width : 640px) and (max-width: 980px){
	div#overlayContent{max-width:75%; margin-left:auto; margin-right:auto; font-size: 1em;}
}

@media only screen and (min-width : 950px) {
	div#overlayContent{max-width:450px; margin:8% 9% 0;}
		div#overlayContent p{font-size:.85rem;}

}

</style>


<?php get_footer(); ?>
<!-- Core Full Screen Images Template -->
