<?
/**
 * The Template for displaying all pages.
 *
 * @package nxtheme
 */

get_header();
?>

<div class="stage-full-heighth">
	<?= module('stage')
			->tag('section')
			->ctrl() 
	?>

	<?= module('cta')
			->tag('section')
			->ctrl() 
	?>
</div>

	<?= module('article')
			->tag('section')
			->ctrl() 
	?>



<? get_footer(); ?>