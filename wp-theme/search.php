<?php
/**
 * The template for displaying Search Results pages.
 *
 * @package nxtheme
 */

get_header(); ?>

<div class="page-centered">

	<?= module('teaserlistheader')->ctrl(); ?>

	<?= module('teaserlist')->ctrl(); ?>

	<?= module('teaserlistfooter'); ?>
</div>

<? get_footer(); ?>
