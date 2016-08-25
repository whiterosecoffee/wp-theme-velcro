<?php //Template Name: Overlay Content ?>
<?php get_header(); ?>
<div id="content" class="content contentPadding floatfix">
    <script type="text/javascript">
		jQuery(document).ready(function() {
		    jQuery('.overlay').click(function(){
		        var contentId =  overlay(355, "voice");
		        window.console.log(this);
		        /*
		        jQuery(contentId).load(jQuery(this).attr('href'), function() {
		            vertical_center(contentId);
		            positionCloseButton(contentId);
		        }); */
		        return false;
		    });   
		}); 
	</script> 

	<h2 class="pageTitle"><?php echo (the_parent_slug()); ?></h2>
	<?php			
        $page = $post->ID;
        $page_articleDate = get_page($page);
        $content = apply_filters('the_content', $page_articleDate->post_content);
        echo $content; 
    ?>

</div>
<?php get_footer(); ?>
<!-- Core Overlay Template -->
