<?php
/**
 * The header for our theme
 *
 * This is the template that displays all of the <head> section and everything up until <div id="content">
 *
 * @link https://developer.wordpress.org/themes/basics/template-files/#template-partials
 *
 * @package TRI
 */
?>
<!DOCTYPE html>
<!--[if IE 8]><html <?php language_attributes(); ?> class="ie8"><![endif]-->
<!--[if gt IE 8]><!--><html <?php language_attributes(); ?>><!--<![endif]-->
<head>
	<meta charset="<?php bloginfo( 'charset' ); ?>">
	<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=0">
	<link rel="profile" href="http://gmpg.org/xfn/11">
	<link rel="pingback" href="<?php bloginfo( 'pingback_url' ); ?>">
	<link href="//fonts.googleapis.com/css?family=Open+Sans|Playfair+Display+SC" rel="stylesheet">
	<?php wp_head(); ?>
</head>
<body <?php body_class(); ?>>
<a class="skip-link sr-only" href="#main"><?php esc_html_e( 'Skip to content', 'gorilla' ); ?></a>
<header id="masthead" class="masthead" role="banner">
	<div class="container-fluid">
		<a class="logo" href="<?php echo esc_url( home_url( '/' ) ); ?>">
			<span class="sr-only"><?php bloginfo( 'name' ); ?></span>
			<img src="<?php echo get_template_directory_uri().'/images/logo.svg' ?>" alt="<?php bloginfo( 'name' ); ?>" />
		</a>
        <a href="#" class="button button-alternate button-donate"><?php _e( 'Donate', 'tri' ); ?></a>
        <nav id="navigation" class="navigation ui-nav" role="navigation">
			<div class="navigation__inner">
				<?php wp_nav_menu( array( 'menu_id' => '',  'container' => '', 'depth' => '2' ) ); ?>
				<a href="#" class="button button-alternate button-donate visible-md"><?php _e( 'Donate', 'tri' ); ?></a>
			</div>
		</nav>
		<button id="hamburger" type="button" class="hamburger visible-md" data-tray="toggle" data-target="#masthead"><span class="line"></span><span class="line"></span><span class="line"></span></button>
	</div>
</header>
<div id="main" class="main" role="main">
