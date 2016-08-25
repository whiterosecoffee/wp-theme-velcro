<?php get_header(); ?>
<?php if(function_exists('rdfa_breadcrumb')){ rdfa_breadcrumb(); } ?>
<div id="content" class="content contentPadding floatfix">

    <ul id="posts">

    	<?php while ( have_posts() ) : the_post(); ?> 
        <li class="post">
            <h4 class="floatleft"><?php the_title(); ?></h4>
            <h5 class="floatright"><?php the_date(); ?></h5> 
            <p class="clearboth">   	
    			<?php the_post_thumbnail();?>
                <?php the_content(); ?>     
            </p>     
        </li>

      <?php endwhile;?>				

    </ul><!--posts-->

</div>
<?php get_footer(); ?>
<!-- Core Single Template -->
