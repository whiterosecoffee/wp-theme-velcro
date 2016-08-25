<?php global $detect; global $deviceType; //http://mobiledetect.net/ ?>
<!DOCTYPE html>
<!--[if lt IE 7]>
	<script src="http://html5shim.googlecode.com/svn/trunk/html5.js"></script>
   <style type="text/css">
	.current-menu-item {border-bottom: none;}
    </style>
<![endif]-->
<!--[if IE 7]>
<html class="ie ie7" lang="en-US" prefix="og: http://ogp.me/ns#">
<![endif]-->
<!--[if IE 8]>
<html class="ie ie8" lang="en-US" prefix="og: http://ogp.me/ns#">
<![endif]-->
<!--[if !(IE 7) | !(IE 8)  ]><!-->
<html dir="ltr" lang="en-US" prefix="og: http://ogp.me/ns#" class="no-js grid ltr devTesting" data-device="<?php echo($deviceType);?>" data-page="<?php echo(the_parent_slug());?>">
<!--<![endif]-->
<base href="/sebastian/">

<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0" />

<title><?php wp_title(); ?></title>
<?php get_template_part('/section-templates/head-content' );?>
<?php wp_head();?>
</head>

<body class="mobileMenu mobileMenuClosed <?php echo(the_parent_slug());?> <?php echo($deviceType);?>" >


<div id='pageLoader'></div>
<div id="wrapper" >
    <div id="headerOut" class="wrapper floatfix">
        <?php get_template_part('/section-templates/header-content' ); ?>
    </div>




