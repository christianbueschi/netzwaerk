<?php
/**
 * The template for displaying the footer.
 *
 * Contains the closing of the #content div and all content after
 *
 * @package nxtheme
 */
?>
		</main>

		<?=
		module('footer')
			->tag('footer')
			->classes('page-centered box-content')
			->attrib('role', 'contentinfo')
			->ctrl(); ?>

		<?php wp_footer(); ?>

	</body>
</html>
