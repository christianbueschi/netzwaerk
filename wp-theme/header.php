<?php
/**
 * The Header for our theme.
 *
 * Displays all of the <head> section and everything up till <div id="main">
 *
 * @package nxtheme
 */
?><!doctype html>
	<!--[if lt IE 9]>      <html class="no-js lt-ie10 lt-ie9" <?php language_attributes(); ?>> <![endif]-->
	<!--[if IE 9]>         <html class="no-js ie9 lt-ie10" <?php language_attributes(); ?>> <![endif]-->
	<!--[if gt IE 9]><!--> <html class="no-js" <?php language_attributes(); ?>> <!--<![endif]-->
	<head>
		<meta charset="<?php bloginfo('charset'); ?>" />
		<meta name="viewport" content="width=device-width" />
		<meta name="apple-mobile-web-app-capable" content="yes" />
		<meta name="description" content="<?php bloginfo('description'); ?>" />
		<meta name="apple-mobile-web-app-title" content=“<?php bloginfo('name'); ?>”>

		<title><?php wp_title('|', true, 'right'); ?></title>

		<link rel="pingback" href="<?php bloginfo('pingback_url'); ?>">
		<link rel="shortcut icon" type="image/x-icon" href="<?=ASSETS_URL?>/img/favicon.ico"/>
		<link rel="apple-touch-icon" href="<?=ASSETS_URL?>/img/apple-touch-icon.png"/>

		<?php wp_head(); ?>

		<script>var assetsUrl = '<?=ASSETS_URL?>';</script>

		<!-- Open Graph !-->
		<?= partial('opengraph') ?>

		<!--[if lte IE 8]>
		<script src="//cdnjs.cloudflare.com/ajax/libs/html5shiv/3.7/html5shiv.js"></script>
		<script src="//cdnjs.cloudflare.com/ajax/libs/selectivizr/1.0.2/selectivizr-min.js"></script>
		<![endif]-->

		<!--[if lte IE 9]>
		<script src="<?=ASSETS_URL?>/js/matchMedia.js"></script>
		<script src="<?=ASSETS_URL?>/js/matchMedia.addListener.js"></script>
		<script src="//cdnjs.cloudflare.com/ajax/libs/respond.js/1.4.2/respond.min.js"></script>
		<![endif]-->
	</head>

	<body <?php body_class(); ?>>

		<ul class="skip-links h-vh">
			<li>
				<a href="#site-navigation"><? _e( 'Skip to main navigation', 'nxtheme' ); ?></a>
			</li>
			<li>
				<a href="#content"><? _e( 'Skip to content', 'nxtheme' ); ?></a>
			</li>
		</ul>

		<?= module('header')
			->tag('header')
			->attrib('role', 'banner')
			->ctrl() ?>

		<main id="content" role="main" class="page-centered">
