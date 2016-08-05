<?
/**
 * The Template for displaying all pages.
 *
 * @package nxtheme
 */

get_header();
?>

	<?= module('stage')
			->tag('section')
			->ctrl() 
	?>

	<?= module('cta')
			->tag('section')
			->ctrl() 
	?>

	<?= module('intro')
			->tag('section')
			->ctrl() 
	?>

	<?= module('article')
			->tag('section')
			->ctrl() 
	?>



<? get_footer(); ?>