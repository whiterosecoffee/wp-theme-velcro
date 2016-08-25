<?php global $post;?>
<a href="<?php the_permalink();?>" class="articleLink">
	<?php 
		if ( '' !=get_the_post_thumbnail() ){
			the_post_thumbnail('full', array('class'=> 'featuredImage')); 
		}
		else{ ?>
	    	<img src="<?php echo (get_post_meta($post->ID, 'image', true));?>" class="featuredImage"/>
	<?php}?>
<h2 class="tileTitle">
    <?php the_title();?>
</h2>	
</a>