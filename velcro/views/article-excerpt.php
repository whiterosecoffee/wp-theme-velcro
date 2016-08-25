<?php global $post;?>
<a href="<?php the_permalink();?>" class="articleLink">
	<?php 
	if ( '' !=get_the_post_thumbnail() ){
		the_post_thumbnail('full', array('class'=> 'featuredImage')); 
	}
	else{ ?>
    	<img src="<?php echo (get_post_meta($post->ID, 'image', true));?>" class="featuredImage"/>
	<?php}?>
    <div class="articleStats floatfix">
        <strong class="viewCount countBox">
                <i class="icon-eye"></i>
                <?php echo (get_post_meta($post->ID, 'views', true));?>
        </strong>
        <div class="socialCount floatfix">
            <strong class="twCount countBox tw-bg">
                    <i class="icon-twitter-2"></i>
                    <?php echo (get_post_meta($post->ID, 'views', true));?>
            </strong>
            <strong class="fbCount countBox fb-bg">
                    <i class="icon-facebook-2"></i>
                    <?php echo (get_post_meta($post->ID, 'views', true));?>
            </strong>
        </div><!--.socialCount-->
    </div><!--.articleStats-->
</a>
<footer class="tileFooter floatfix">
    <div class="tileAuthor">
        <a href="" class="articleAuthorImgLink"><img src="http://graph.facebook.com/10201903278808841/picture?type=normal&height=200&width=200" class="author" height="45" width="45" /></a>
        <a href="" class="articleAuthorLink"><?php echo get_the_author_link();?></a>
    </div><!-- tileAuthor -->
    <h2 class="tileTitle">
        <a href="<?php the_permalink();?>" class="articleLink"><?php the_title();?></a>
    </h2>
    <span class="readTime"><?php echo (get_post_meta($post->ID, 'read-duration', true));?> دقائق</span>
</footer>