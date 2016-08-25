<?php //Template Name: Press CPT ?>
<?php get_header(); ?>

<?php $paged = 1;
	if ( get_query_var('paged') ) $paged = get_query_var('paged');
	if ( get_query_var('page') ) $paged = get_query_var('page');
	query_posts( '&post_type=article&order=DESC&paged=' . $paged );
?>

<div id="content" class="content contentPadding floatfix">
	<h2 class="pageTitle"><?php echo (the_parent_slug()); ?></h2>

	<section id="cptPress">

		<?php while ( have_posts() ) : the_post(); ?> 
	    <article class="pressArticle">
	    	<h3 class="pressArticleTitle"><?php the_title();?></h3>
	    	<hr/>
	    	<p class="pressArticleCategories">Press + <?php echo get_the_category_list(' + '); ?></p>
	    	<p class="pressArticleDate">
	    		<span><?php the_time('M'); ?></span>
	    		<span><?php the_time('j'); ?></span>
	    	</p>
	    	<?php the_post_thumbnail('medium');?>
			<?php the_excerpt(); ?>
			<?php $originalLink = get_post_meta( $post->ID, 'original-article-link', true ); ?>
	            <?php if  (!empty( $originalLink )) { ?>
	            	<a href="<?php echo ($originalLink);?>" target="_blank" class="pressArticleLink">Origianl Source</a>
	            <?php } ?>
             
                     
	    </article>

	  <?php endwhile;?>				

	  <div id="pagination-controls"><?php //paginate(); ?></div>

	</section>

</div>

<script>
jQuery(document).ready(function() {
	jQuery('.pressArticleCategories a').click(function(event){
		event.preventDefault();
	});
});
</script>

<style>

	#cptPress{max-width:750px; padding:1.5em;}
	.pressArticle{position:relative; margin-bottom:3.5rem;}
		.pressArticleTitle{color:white; font-size:1.3em;}
		.pressArticleCategories{font-size:.875em;}
		
		@media screen and (min-width: 600px){
			.pressArticle{padding-left:90px;}  
			p.pressArticleDate{
				width:64px; height:64px; 
				position: absolute; left:0px; top:0px;
				margin:0; padding-top:12px;
				border-radius: 32px;
				text-transform: uppercase;
				text-align: center;  
				border:1px solid white;
			}
				p.pressArticleDate span{display:block;}
		}

		@media screen and (max-width: 600px) {
			p.pressArticleDate{display: none;}
		}

		.pressArticleLink{text-decoration: underline; font-size:.875em;}

		.pressArticle .wp-post-image{float:left; width:150px; margin-right: 1.5em;background-color: white;}
</style>

<?php get_footer(); ?>
<!-- Core CPT Press Template -->
