<?
/**
 * The Template for displaying all single posts.
 *
 * @package nxtheme
 */

get_header();
?>

	<? while (have_posts()) : the_post(); ?>

		<?=
		module('article')
			->tag('article')
			->ctrl(); ?>

		<? if($post->comment_status == 'open'): ?>

			<?=
			module('commentform')
				->classes('box-content')
				->tag('section')
				->ctrl() ?>

			<?=
			module('commentlist')
				->classes('box-content')
				->tag('section')
				->ctrl()
			?>

		<? endif; ?>

	<? endwhile; ?>

<? get_footer(); ?>