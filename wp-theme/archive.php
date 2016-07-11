<?php
/**
 * The template for displaying Archive pages.
 *
 * Learn more: http://codex.wordpress.org/Template_Hierarchy
 *
 * @package nxtheme
 */

get_header(); ?>

	<?= module('teaserlistheader')->ctrl(); ?>

	<?= module('teaserlist')->ctrl(); ?>

	<?= module('teaserlistfooter'); ?>

<? get_footer(); ?>
