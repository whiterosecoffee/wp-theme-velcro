<header class="contentWidth floatfix">
    <a id="navOpenBtn" class="nav-btn icon-menu icon"  href="#nav"></a>
    <a href="<?php bloginfo('url');?>" id="logo" class="">
        <!--Add Logo-->
    </a>
    <nav id="nav" role="navigation" class="floatfix nav-right">
        <a id="navCloseBtn" class="nav-btn icon icon-cancel-circle" href="#"></a>
        <nav id="social-media" class="">
            <a href="#" target="_blank" class="socialMediaLink"><i class="icon-facebook-2"></i></a></li>
            <a href="#" target="_blank" class="socialMediaLink"><i class="icon-twitter-2"></i></a></li>
            <a href="#" target="_blank" class="socialMediaLink"><i class="icon-gplus"></i></a>
        </nav><!-- Social Media -->

        <?php wp_nav_menu(array('menu' => 'main', 'container' => ''));?>
        <!--
        <div id="profile" class="floatfix">
           <a href="#"><i class="icon-search icon"></i></a>
           <a href="wp-admin"><i class="icon-user icon"></i></a>
        </div> Profile-->

    </nav>

    <section id="pageTitle">
        <h1><?php echo get_bloginfo( 'name' ); ?></h1>
        <h4><?php echo get_bloginfo( 'description' ); ?></h4>
    </section>

</header><!--#main-->

