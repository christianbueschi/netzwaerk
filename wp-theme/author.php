<?
/**
 * The template for displaying author pages.
 *
 * Learn more: http://codex.wordpress.org/Template_Hierarchy
 *
 * @package nxtheme
 */

get_header();

?>

<main id="main" class="site-main page-centered" role="main">
	<?=
	module('author')
		->tag('section')
		->ctrl(); ?>
</main>

<?php wp_footer(); ?>
</body>
</html>