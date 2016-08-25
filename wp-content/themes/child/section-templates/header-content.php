<header id="headerContent" class="contentWidth floatfix">

    <a id="navOpenBtn" class="nav-btn icon-menu icon"  href="#nav"></a>

    <a href="<?php bloginfo('url');?>" id="logo" class="">
        <img src="<?php echo get_bloginfo('stylesheet_directory');?>/img/logo.png" alt="houseonphuket.com logo">
    </a>

    <nav id="nav" role="navigation" class="floatfix">

        <a id="navCloseBtn" class="nav-btn" href="#">
            <i class="icon icon-cancel-circle floatleft"></i>
        </a>

        <?php wp_nav_menu(array('menu' => 'main', 'container' => ''));?>

    </nav>

</header><!--#main-->

