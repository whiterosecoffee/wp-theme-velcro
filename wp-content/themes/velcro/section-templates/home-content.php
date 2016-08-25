<div id="content" class="content contentPadding floatfix">
	<h1>Content</h1>
	<?php			
        $page = $post->ID;
        $page_articleDate = get_page($page);
        $content = apply_filters('the_content', $page_articleDate->post_content);
        echo $content; 
    ?>
</div><!--CONTENT-->


