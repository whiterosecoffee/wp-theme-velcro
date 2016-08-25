<?php get_header(); ?>

<?php $paged = 1;
	if ( get_query_var('paged') ) $paged = get_query_var('paged');
	if ( get_query_var('page') ) $paged = get_query_var('page');
	$thisCat = get_category(get_query_var(‘cat’),false);
	query_posts( '&post_type=article&order=DESC&paged=' . $paged .'&cat='.$thisCat->cat_ID );
?>

<div id="content" class="content contentPadding floatfix">
	<h2 class="pageTitle"><?php echo (the_parent_slug()); ?></h2>

	<section class="postCategory">

		<?php while ( have_posts() ) : the_post(); ?> 
	    <article class="postArticle">
	    	<h3 class="postArticleTitle"><?php the_title();?></h3>
	    	<hr/>
	    	<p class="postArticleCategories">post + <?php echo get_the_category_list(' + '); ?></p>
	    	<p class="postArticleDate">
	    		<span><?php the_time('M'); ?></span>
	    		<span><?php the_time('j'); ?></span>
	    	</p>
	    	<?php the_post_thumbnail('medium');?>
			<?php the_excerpt(); ?>
			<?php $originalLink = get_post_meta( $post->ID, 'original-article-link', true ); ?>
	            <?php if  (!empty( $originalLink )) { ?>
	            	<a href="<?php echo ($originalLink);?>" target="_blank" class="postArticleLink">Origianl Source</a>
	            <?php } ?>
             
                     
	    </article>

	  <?php endwhile;?>				

	  <div id="pagination-controls"><?php //paginate(); ?></div>

	</section>

</div>
<style>

	#postCategory{max-width:750px; padding:1.5em;}
	.postArticle{position:relative; margin-bottom:3.5rem;}
		.postArticleTitle{color:white; font-size:1.3em;}
		.postArticleCategories{font-size:.875em;}
		
		@media screen and (min-width: 600px){
			.postArticle{padding-left:90px;}  
			p.postArticleDate{
				width:64px; height:64px; 
				position: absolute; left:0px; top:0px;
				margin:0; padding-top:12px;
				border-radius: 32px;
				text-transform: uppercase;
				text-align: center;  
				border:1px solid white;
			}
				p.postArticleDate span{display:block;}
		}

		@media screen and (max-width: 600px) {
			p.postArticleDate{display: none;}
		}

		.postArticleLink{text-decoration: underline; font-size:.875em;}

		.postArticle .wp-post-image{float:left; width:150px; margin-right: 1.5em;background-color: white;}
</style>

<?php get_footer(); ?>
<!-- Core Category Template -->
