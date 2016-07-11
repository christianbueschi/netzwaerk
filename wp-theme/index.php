<?php
/**
 * The main template file.
 *
 * This is the most generic template file in a WordPress theme
 * and one of the two required files for a theme (the other being style.css).
 * It is used to display a page when nothing more specific matches a query.
 * E.g., it puts together the home page when no home.php file exists.
 * Learn more: http://codex.wordpress.org/Template_Hierarchy
 *
 * @package nxtheme
 */

get_header(); ?>

	<?=
	module('teaser')
		->tag('article')
		->template('sticky')
		->skin('sticky')
		->ctrl(array(), 'dataSticky')
	?>

	<?=
	module('teaserlist')
		->attribs(array(
			'data-connectors' => 'articles',
			'data-posts-per-page' => get_option('posts_per_page')
		))
		->ctrl(); ?>

	<?= module('teaserlistfooter')->ctrl() ?>

<? get_footer(); ?>
